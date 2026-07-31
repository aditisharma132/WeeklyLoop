import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/dynamodb";

export async function GET() {
    if (isDemoMode) {
        return NextResponse.json({
            success: true,
            progress: [
                { id: "1", goal: "Launch MVP", percentage: 65, color: "text-purple-400" },
                { id: "2", goal: "Run 50km", percentage: 40, color: "text-emerald-400" },
                { id: "3", goal: "Read 2 Books", percentage: 80, color: "text-blue-400" }
            ]
        });
    }

    return NextResponse.json({ success: true, progress: [] });
}
