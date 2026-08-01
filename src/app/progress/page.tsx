"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Sparkles, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

const data = [
    { name: 'Mon', completion: 60, focus: 40 },
    { name: 'Tue', completion: 75, focus: 55 },
    { name: 'Wed', completion: 85, focus: 70 },
    { name: 'Thu', completion: 70, focus: 50 },
    { name: 'Fri', completion: 90, focus: 85 },
    { name: 'Sat', completion: 100, focus: 90 },
    { name: 'Sun', completion: 85, focus: 80 },
];

export default function ProgressPage() {
    return (
        <div className="flex-1 p-4 md:p-8 relative min-h-screen">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

            <header className="mb-8 relative z-10">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Progress Tracker</h1>
                <p className="text-white/60">Visualize your consistency and focus over time.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-white/60">Weekly Completion</p>
                        <p className="text-2xl font-bold">81% <span className="text-sm text-green-400 ml-2">+5%</span></p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm text-white/60">Current Streak</p>
                        <p className="text-2xl font-bold">5 Days</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-sm text-white/60">Peak Focus Time</p>
                        <p className="text-2xl font-bold">10:00 AM</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 md:p-8 relative z-10 h-[500px]">
                <h2 className="text-2xl font-bold mb-8">Weekly Performance</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="completion" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletion)" />
                        <Area type="monotone" dataKey="focus" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
