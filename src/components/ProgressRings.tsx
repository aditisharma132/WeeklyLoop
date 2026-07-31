"use client";

import { motion } from "framer-motion";

export default function ProgressRings({
    progress,
    label
}: {
    progress: number;
    label: string;
}) {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((progress || 0) / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Background ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="8"
                    />
                    {/* Progress ring */}
                    <motion.circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {progress}%
                </div>
            </div>
            <p className="text-sm font-medium text-white/60 mt-3 text-center">{label}</p>
        </div>
    );
}
