import { NextResponse } from "next/server";
import { generateSchedule } from "@/lib/bedrock";
import { getRearrangePrompt } from "@/lib/prompts";
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
        try {
            let cleanResponse = scheduleResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanResponse);
            newSchedule = { tasks: parsed.tasks };
            deferredToTomorrow = parsed.deferredToTomorrow || [];
            
            // Here you would save deferred tasks to DynamoDB for tomorrow's date
            // e.g. await saveDeferredTasks(userId, dateTomorrow, deferredToTomorrow);

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
