import { NextResponse } from "next/server";
import { generateSchedule } from "@/lib/bedrock";
import { getRearrangePrompt } from "@/lib/prompts";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentSchedule, request } = body;

        const prompt = getRearrangePrompt(currentSchedule, request);
        const scheduleResponse = await generateSchedule(prompt);

        let newSchedule;
        try {
            let cleanResponse = scheduleResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            newSchedule = JSON.parse(cleanResponse);
        } catch (e) {
            console.error("Failed to parse schedule JSON", e);
            newSchedule = currentSchedule;
        }

        return NextResponse.json({ success: true, schedule: newSchedule });
    } catch (error) {
        console.error("Generate error:", error);
        return NextResponse.json({ success: false, error: "Failed to generate schedule" }, { status: 500 });
    }
}
