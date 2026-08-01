"use client";

import { signIn } from "next-auth/react";
import { Sparkles, Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we are only using Google for now, this just acts as a placeholder 
        // to show the user how a premium login screen looks!
        alert("Email login is coming soon! Please use 'Continue with Google' for now.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md p-8 glass-panel rounded-3xl relative z-10 border border-white/10 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
                        <span className="text-3xl font-black text-white">W</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-white/60 text-center">
                        Sign in to continue planning your perfect week.
                    </p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-white/80">Password</label>
                            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-2xl transition-all mt-2"
                    >
                        Sign In
                    </button>
                </form>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative bg-[#0d1117] px-4 text-xs text-white/40 uppercase tracking-wider font-medium">
                        Or continue with
                    </div>
                </div>

                <button 
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
