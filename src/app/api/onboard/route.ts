import { NextResponse } from "next/server";
import { dynamoDb, USERS_TABLE, SCHEDULES_TABLE } from "@/lib/dynamodb";
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
        const today = now.split("T")[0]; // YYYY-MM-DD

        // Save user profile
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

        // Generate initial schedule
        const prompt = getSchedulePrompt(goals, priorities, routine, mealsAndFreeTime);
        const scheduleResponse = await generateSchedule(prompt);
        
        let initialSchedule;
        try {
            let cleanResponse = scheduleResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            initialSchedule = JSON.parse(cleanResponse);
            
            // Save initial schedule to DynamoDB for today
            await dynamoDb.send(new PutCommand({
                TableName: SCHEDULES_TABLE,
                Item: {
                    userId,
                    date: today,
                    tasks: initialSchedule.tasks || [],
                    updatedAt: now
                }
            }));
            
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
