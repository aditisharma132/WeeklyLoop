"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function Home() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            {/* Background ambient light */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 text-center max-w-3xl glass-panel p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50" />

                <div className="relative z-20">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse-glow"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-[2px]" />
                        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mix-blend-overlay" />
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        Meet <span className="text-gradient">WeeklyLoop</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto font-light">
                        The AI planner that actually adapts to your real life. Set your goals, and let the AI rearrange your day when things go off track.
                    </p>

                    <button onClick={() => signIn("google")} className="inline-block">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-lg flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] cursor-pointer relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10">Sign in with Google</span>
                            <LogIn className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                    </button>
                </div>
            </motion.div>

            {/* Decorative floating elements */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-[20%] w-24 h-24 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm"
            />
            <motion.div
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 right-[15%] w-32 h-32 rounded-full border border-purple-500/10 bg-purple-500/[0.02] backdrop-blur-md"
            />
        </div>
    );
}
