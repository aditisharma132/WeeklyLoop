"use client";

import { motion } from "framer-motion";
import { AlertCircle, CalendarClock, RotateCcw } from "lucide-react";

export default function QuickActions({
    onAction
}: {
    onAction: (action: string) => void
}) {
    const actions = [
        { id: "late", title: "Woke up late", icon: <AlertCircle className="w-4 h-4 text-orange-400" /> },
        { id: "skip", title: "Skip next task", icon: <CalendarClock className="w-4 h-4 text-blue-400" /> },
        { id: "rearrange", title: "Rearrange my day", icon: <RotateCcw className="w-4 h-4 text-purple-400" /> },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {actions.map((action, idx) => (
                <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onAction(action.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors"
                >
                    {action.icon}
                    <span>{action.title}</span>
                </motion.button>
            ))}
        </div>
    );
}
