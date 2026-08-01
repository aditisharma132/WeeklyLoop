import { NextResponse } from "next/server";
import { dynamoDb, USERS_TABLE, SCHEDULES_TABLE } from "@/lib/dynamodb";
import { generateSchedule } from "@/lib/bedrock";
import { getSchedulePrompt } from "@/lib/prompts";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        
        const userId = session.user.email;
        const now = new Date().toISOString();
        const today = now.split("T")[0];

        // 1. Try to fetch today's schedule
        const scheduleResponse = await dynamoDb.send(new GetCommand({
            TableName: SCHEDULES_TABLE,
            Key: { userId, date: today }
        }));

        if (scheduleResponse.Item) {
            return NextResponse.json({ success: true, schedule: { tasks: scheduleResponse.Item.tasks || [] } });
        }

        // 2. If no schedule exists for today, fetch user profile to generate one
        const userResponse = await dynamoDb.send(new GetCommand({
            TableName: USERS_TABLE,
            Key: { userId }
        }));

        if (!userResponse.Item) {
            // User hasn't completed onboarding
            return NextResponse.json({ success: true, schedule: { tasks: [] } });
        }

        const { goals, priorities, routine, mealsAndFreeTime } = userResponse.Item;

        // 3. Generate a new schedule for today using Bedrock
        const prompt = getSchedulePrompt(goals, priorities, routine, mealsAndFreeTime);
        const bedrockResponse = await generateSchedule(prompt);
        
        let newSchedule;
        try {
            let cleanResponse = bedrockResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            newSchedule = JSON.parse(cleanResponse);
            
            // Save newly generated schedule
            await dynamoDb.send(new PutCommand({
                TableName: SCHEDULES_TABLE,
                Item: {
                    userId,
                    date: today,
                    tasks: newSchedule.tasks || [],
                    updatedAt: now
                }
            }));
        } catch (e) {
            newSchedule = { tasks: [] };
            console.error("Failed to parse schedule JSON", e);
        }

        return NextResponse.json({ success: true, schedule: newSchedule });
    } catch (error) {
        console.error("Schedule fetch error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch schedule" }, { status: 500 });
    }
}
