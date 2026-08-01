import { NextResponse } from "next/server";
import { dynamoDb, SCHEDULES_TABLE } from "@/lib/dynamodb";
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
        const { rating, notes, date = new Date().toISOString().split('T')[0] } = body;

        const feedbackId = `FB#${date}`;

        await dynamoDb.send(new PutCommand({
            TableName: SCHEDULES_TABLE,
            Item: {
                userId,
                date: feedbackId, // date is the RANGE key
                rating,
                notes,
                createdAt: new Date().toISOString()
            }
        }));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json({ success: false, error: "Failed to save feedback" }, { status: 500 });
    }
}
