"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { motion } from "framer-motion";

type ViewMode = "week" | "month";

export default function CalendarPage() {
    const [view, setView] = useState<ViewMode>("week");
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextTime = () => {
        if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
        else setCurrentDate(addMonths(currentDate, 1));
    };

    const prevTime = () => {
        if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
        else setCurrentDate(subMonths(currentDate, 1));
    };

    const generateWeekDays = () => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    };

    const generateMonthDays = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    };

    const days = view === "week" ? generateWeekDays() : generateMonthDays();

    // Mock items for visual flair
    const hasItems = (date: Date) => {
        // Randomly scatter some dots for visual effect
        return date.getDate() % 3 === 0 || date.getDate() % 5 === 0;
    };

    return (
        <div className="flex-1 p-4 md:p-8 relative min-h-screen">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

            <header className="mb-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Calendar</h1>
                    <p className="text-white/60">See your rhythm over time.</p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 rounded-full p-1 border border-white/10">
                    <button 
                        onClick={() => setView("week")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${view === "week" ? "bg-primary text-white shadow-lg" : "text-white/60 hover:text-white"}`}
                    >
                        Week
                    </button>
                    <button 
                        onClick={() => setView("month")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${view === "month" ? "bg-primary text-white shadow-lg" : "text-white/60 hover:text-white"}`}
                    >
                        Month
                    </button>
                </div>
            </header>

            <div className="glass-panel rounded-3xl p-6 md:p-8 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">
                        {view === "week" 
                            ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM do")}` 
                            : format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={prevTime} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                            Today
                        </button>
                        <button onClick={nextTime} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {view === "week" ? (
                    <div className="grid grid-cols-7 gap-4">
                        {days.map((day, i) => (
                            <div key={i} className="flex flex-col gap-4">
                                <div className={`text-center py-2 ${isSameDay(day, new Date()) ? "text-primary font-bold" : "text-white/60"}`}>
                                    <div className="text-xs uppercase mb-1">{format(day, "EEE")}</div>
                                    <div className={`text-2xl ${isSameDay(day, new Date()) ? "w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto" : ""}`}>
                                        {format(day, "d")}
                                    </div>
                                </div>
                                <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-2 min-h-[300px]">
                                    {hasItems(day) && (
                                        <div className="bg-primary/20 border border-primary/30 rounded-xl p-3 mb-2">
                                            <div className="text-xs font-bold text-primary mb-1">Morning Run</div>
                                            <div className="text-[10px] text-white/50">07:00 - 08:00</div>
                                        </div>
                                    )}
                                    {isSameDay(day, new Date()) && (
                                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-2">
                                            <div className="text-xs font-bold text-yellow-500 mb-1">Deep Work</div>
                                            <div className="text-[10px] text-white/50">10:00 - 12:00</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                            <div key={d} className="text-center text-xs font-bold text-white/50 py-2 uppercase tracking-wider">{d}</div>
                        ))}
                        {days.map((day, i) => {
                            // offset first day
                            const offset = i === 0 ? (day.getDay() === 0 ? 6 : day.getDay() - 1) : 0;
                            return (
                                <div key={i} className={`aspect-square relative p-2 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-colors ${offset ? 'col-start-' + (offset + 1) : ''}`}>
                                    <span className={`text-sm ${isSameDay(day, new Date()) ? "w-6 h-6 bg-primary rounded-full flex items-center justify-center font-bold text-white shadow-lg" : "text-white/70"}`}>
                                        {format(day, "d")}
                                    </span>
                                    {hasItems(day) && (
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
