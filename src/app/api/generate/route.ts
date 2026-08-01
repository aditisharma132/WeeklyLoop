import { NextResponse } from "next/server";
import { dynamoDb, SCHEDULES_TABLE, USERS_TABLE } from "@/lib/dynamodb";
import { generateSchedule } from "@/lib/bedrock";
import { getRearrangePrompt } from "@/lib/prompts";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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
        const { currentSchedule, request } = body;

        const prompt = getRearrangePrompt(currentSchedule, request);
        const scheduleResponse = await generateSchedule(prompt);

        let newSchedule;
        let deferredToTomorrow = [];
        const now = new Date().toISOString();
        const today = now.split("T")[0];

        try {
            let cleanResponse = scheduleResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanResponse);
            newSchedule = { tasks: parsed.tasks };
            deferredToTomorrow = parsed.deferredToTomorrow || [];
            
            // Save updated schedule for today
            await dynamoDb.send(new PutCommand({
                TableName: SCHEDULES_TABLE,
                Item: {
                    userId,
                    date: today,
                    tasks: newSchedule.tasks,
                    updatedAt: now
                }
            }));

            // If there are deferred tasks, save them to the user's profile for tomorrow's generation
            if (deferredToTomorrow.length > 0) {
                await dynamoDb.send(new UpdateCommand({
                    TableName: USERS_TABLE,
                    Key: { userId },
                    UpdateExpression: "SET deferredTasks = :dt",
                    ExpressionAttributeValues: {
                        ":dt": deferredToTomorrow
                    }
                }));
            }

        } catch (e) {
            console.error("Failed to parse schedule JSON", e);
            newSchedule = currentSchedule;
        }

        return NextResponse.json({ success: true, schedule: newSchedule, deferredToTomorrow });
    } catch (error) {
        console.error("Generate error:", error);
        return NextResponse.json({ success: false, error: "Failed to generate schedule" }, { status: 500 });
    }
}
