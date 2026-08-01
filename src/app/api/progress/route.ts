import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.email;

    return NextResponse.json({
        success: true,
        progress: [
            { id: "1", goal: "Launch MVP", percentage: 65, color: "text-purple-400" },
            { id: "2", goal: "Run 50km", percentage: 40, color: "text-emerald-400" },
            { id: "3", goal: "Read 2 Books", percentage: 80, color: "text-blue-400" }
        ]
    });
}
