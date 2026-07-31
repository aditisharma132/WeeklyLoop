"use client";

import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Insight {
    id: string;
    type: "positive" | "improvement" | "observation";
    message: string;
}

const icons = {
    positive: <TrendingUp className="w-5 h-5 text-green-400" />,
    improvement: <Lightbulb className="w-5 h-5 text-yellow-400" />,
    observation: <Sparkles className="w-5 h-5 text-blue-400" />,
};

const backgrounds = {
    positive: "from-green-500/10 to-transparent border-green-500/20",
    improvement: "from-yellow-500/10 to-transparent border-yellow-500/20",
    observation: "from-blue-500/10 to-transparent border-blue-500/20",
};

export default function PatternInsights({ insights }: { insights: Insight[] }) {
    return (
        <div className="space-y-4">
            {insights.map((insight, idx) => (
                <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className={cn(
                        "p-5 rounded-2xl border bg-gradient-to-r flex items-start gap-4 glass",
                        backgrounds[insight.type]
                    )}
                >
                    <div className="p-2 bg-background/50 rounded-xl shrink-0 mt-0.5 shadow-inner">
                        {icons[insight.type]}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                        {insight.message}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
