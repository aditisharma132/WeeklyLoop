import { NextResponse } from "next/server";
import { dynamoDb, USERS_TABLE, isDemoMode, mockDb } from "@/lib/dynamodb";
import { generateSchedule } from "@/lib/bedrock";
import { getSchedulePrompt } from "@/lib/prompts";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        
        const userId = session.user.email;
        const body = await req.json();
        const { goals, priorities, routine, mealsAndFreeTime } = body;
        const now = new Date().toISOString();

        // Save user profile
        if (isDemoMode) {
            mockDb.users[userId] = { goals, priorities, routine, memberSince: now };
        } else {
            await dynamoDb.send(new PutCommand({
                TableName: USERS_TABLE,
                Item: {
                    userId,
                    goals,
                    priorities,
                    routine,
                    mealsAndFreeTime,
                    memberSince: now,
                    createdAt: now
                }
            }));
        }

        // Generate initial schedule
        const prompt = getSchedulePrompt(goals, priorities, routine, mealsAndFreeTime);
        const scheduleResponse = await generateSchedule(prompt);
        
        let initialSchedule;
        try {
            // Bedrock might return markdown JSON block, strip it if necessary
            let cleanResponse = scheduleResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            initialSchedule = JSON.parse(cleanResponse);
        } catch (e) {
            initialSchedule = { tasks: [] };
            console.error("Failed to parse schedule JSON", e);
        }

        return NextResponse.json({ success: true, schedule: initialSchedule });
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ success: false, error: "Failed to process onboarding" }, { status: 500 });
    }
}
