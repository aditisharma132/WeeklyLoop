import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/dynamodb";

export async function GET() {
    // In demo mode or normally, returning a default schedule to populate the dashboard if none is available
    if (isDemoMode) {
        return NextResponse.json({
            success: true,
            schedule: {
                tasks: [
                    { id: "1", title: "Morning Routine", startTime: "07:00", endTime: "08:00", category: "health", status: "completed" },
                    { id: "2", title: "Deep Work Block", startTime: "09:00", endTime: "11:30", category: "work", status: "upcoming" },
                    { id: "3", title: "Lunch", startTime: "12:00", endTime: "13:00", category: "personal", status: "upcoming" },
                    { id: "4", title: "Meetings", startTime: "13:00", endTime: "15:00", category: "work", status: "upcoming" },
                    { id: "5", title: "Exercise", startTime: "17:00", endTime: "18:00", category: "health", status: "upcoming" }
                ]
            }
        });
    }

    return NextResponse.json({ success: true, schedule: { tasks: [] } });
}
