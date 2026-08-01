"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Moon } from "lucide-react";
import ScheduleTimeline, { ScheduleTask } from "@/components/ScheduleTimeline";
import ProgressRings from "@/components/ProgressRings";
import PatternInsights, { Insight } from "@/components/PatternInsights";
import QuickActions from "@/components/QuickActions";
import VoiceInput from "@/components/VoiceInput";
import FeedbackModal from "@/components/FeedbackModal";

// Mock AI Data for UI scaffolding
const mockTasks: ScheduleTask[] = [
    { id: "1", title: "Morning Run", startTime: "07:00", endTime: "07:45", status: "done", category: "health" },
    { id: "2", title: "Breakfast", startTime: "08:00", endTime: "08:30", status: "done", category: "meal" },
    { id: "3", title: "Deep Work: Project Alpha", startTime: "09:00", endTime: "11:00", status: "in-progress", category: "work" },
    { id: "4", title: "Lunch Break", startTime: "12:00", endTime: "13:00", status: "upcoming", category: "meal" },
    { id: "5", title: "Spanish Lesson", startTime: "13:30", endTime: "14:00", status: "upcoming", category: "learning" },
    { id: "6", title: "Team Sync", startTime: "14:30", endTime: "15:30", status: "upcoming", category: "work" },
    { id: "7", title: "Evening Chill", startTime: "20:00", endTime: "22:00", status: "upcoming", category: "free" },
];

const mockInsights: Insight[] = [
    { id: "i1", type: "positive", message: "You're extremely consistent with morning workouts! 5 day streak." },
    { id: "i2", type: "improvement", message: "You usually push reading to late night and skip it. Want to move it to the afternoon?" },
];

export default function Dashboard() {
    const [tasks, setTasks] = useState<ScheduleTask[]>(mockTasks);
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [aiMessage, setAiMessage] = useState("");
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const schedRes = await fetch('/api/schedule');
            const schedData = await schedRes.json();
            
            if (schedData.success && schedData.schedule?.tasks?.length > 0) {
                setTasks(schedData.schedule.tasks);
            }
        };
        loadData();
    }, []);

    const handleToggleStatus = (id: string) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                if (t.status === "in-progress") return { ...t, status: "done" };
                if (t.status === "upcoming") return { ...t, status: "in-progress" };
                return { ...t, status: "upcoming" };
            }
            return t;
        }));
    };

    const simulateAiRearrange = async (prompt: string) => {
        setIsAiProcessing(true);
        setAiMessage(prompt);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentSchedule: { tasks }, request: prompt })
            });
            const data = await response.json();
            if (data.success && data.schedule?.tasks) {
                setTasks(data.schedule.tasks);
            }
            if (data.deferredToTomorrow && data.deferredToTomorrow.length > 0) {
                setToastMessage(`${data.deferredToTomorrow.length} lower priority task(s) moved to tomorrow.`);
                setTimeout(() => setToastMessage(null), 5000);
            }
        } catch (error) {
            console.error("Failed to rearrange schedule:", error);
        } finally {
            setIsAiProcessing(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col p-4 md:p-8 relative min-h-screen">
            {/* Dynamic gradients base on time of day (Mocked as bright for now) */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium shadow-xl flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                        Today's Loop.
                    </h1>
                    <p className="text-white/60 text-lg">
                        Let's stay on track. 2 priorities completed so far.
                    </p>
                </div>
                <div className="flex gap-4">
                    {/* Progress visualization */}
                    <ProgressRings progress={60} label="Monthly Goal" />
                    <ProgressRings progress={40} label="Daily Routine" />
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* Left Col: Timeline (8 cols wide on desktop) */}
                <section className="lg:col-span-8 glass-panel p-6 rounded-3xl relative overflow-hidden min-h-[600px]">

                    <AnimatePresence>
                        {isAiProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 rounded-3xl"
                            >
                                <Sparkles className="w-12 h-12 text-primary animate-pulse mb-6" />
                                <h2 className="text-2xl font-bold mb-2 break-words">Rearranging based on: "{aiMessage}"</h2>
                                <p className="text-white/60 mb-8 max-w-sm">
                                    Analyzing your patterns, shifting dependencies, and ensuring you still hit your minimum sleep target...
                                </p>
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Schedule</h2>
                        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <Sparkles className="w-4 h-4" />
                            <span>Optimized</span>
                        </div>
                    </div>

                    <ScheduleTimeline tasks={tasks} onToggleStatus={handleToggleStatus} />
                </section>

                {/* Right Col: Insights & Quick Actions (4 cols wide) */}
                <section className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-3xl">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Quick Adjustments
                        </h2>
                        <QuickActions onAction={(action) => simulateAiRearrange(`Triggered quick action: ${action}`)} />
                    </div>

                    <div className="glass-panel p-6 rounded-3xl">
                        <h2 className="text-xl font-bold mb-4">AI Observations</h2>
                        <PatternInsights insights={mockInsights} />
                    </div>

                    <button
                        onClick={() => setIsFeedbackOpen(true)}
                        className="w-full relative group overflow-hidden glass-panel p-6 rounded-3xl flex items-center justify-center gap-3 transition-colors hover:border-purple-500/50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Moon className="w-6 h-6 text-purple-400 relative z-10" />
                        <span className="font-semibold text-lg relative z-10">End Day & Give Feedback</span>
                    </button>
                </section>
            </div>

            <VoiceInput onSubmit={(text) => simulateAiRearrange(text)} />

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                onSubmit={async (data) => {
                    await fetch('/api/feedback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                }}
            />
        </div>
    );
}
