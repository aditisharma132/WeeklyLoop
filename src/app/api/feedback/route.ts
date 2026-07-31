import { NextResponse } from "next/server";
import { dynamoDb, SCHEDULES_TABLE, isDemoMode, mockDb } from "@/lib/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { rating, notes, userId = "default-user", date = new Date().toISOString().split('T')[0] } = body;

        const feedbackId = `FB#${date}`;

        if (isDemoMode) {
            mockDb.schedules[`${userId}#${feedbackId}`] = { rating, notes };
        } else {
            await dynamoDb.send(new PutCommand({
                TableName: SCHEDULES_TABLE,
                Item: {
                    userId,
                    sk: feedbackId,
                    rating,
                    notes,
                    createdAt: new Date().toISOString()
                }
            }));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json({ success: false, error: "Failed to save feedback" }, { status: 500 });
    }
}
