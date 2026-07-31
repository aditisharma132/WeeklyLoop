"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "done" | "in-progress" | "upcoming";

export interface ScheduleTask {
    id: string;
    title: string;
    time: string;
    duration: string; // e.g. "1h", "30m"
    status: TaskStatus;
    category: "work" | "health" | "personal" | "learning";
}

const categoryColors = {
    work: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    health: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    personal: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
    learning: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
};

export default function ScheduleTimeline({
    tasks,
    onToggleStatus
}: {
    tasks: ScheduleTask[],
    onToggleStatus: (id: string) => void
}) {
    return (
        <div className="relative pl-6 space-y-6">
            {/* Vertical line timeline */}
            <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-white/5 rounded-full" />

            {tasks.map((task, idx) => (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                >
                    {/* Status Indicator on timeline */}
                    <button
                        onClick={() => onToggleStatus(task.id)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center bg-background rounded-full transition-transform hover:scale-110"
                    >
                        {task.status === "done" ? (
                            <CheckCircle2 className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        ) : task.status === "in-progress" ? (
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        ) : (
                            <Circle className="w-4 h-4 text-white/30" />
                        )}
                    </button>

                    {/* Task Card */}
                    <div className={cn(
                        "ml-6 p-4 rounded-2xl border bg-gradient-to-br transition-all duration-300 backdrop-blur-md",
                        categoryColors[task.category],
                        task.status === "done" && "opacity-50 grayscale bg-white/5 border-white/5"
                    )}>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={cn(
                                "font-semibold text-lg",
                                task.status === "done" ? "text-white/40 line-through" : "text-white"
                            )}>
                                {task.title}
                            </h3>
                            <span className="text-xs font-mono px-2 py-1 bg-black/40 rounded-md text-white/70">
                                {task.time}
                            </span>
                        </div>
                        <p className="text-sm opacity-70">
                            {task.duration} • <span className="capitalize">{task.category}</span>
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
