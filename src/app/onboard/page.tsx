"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";
import PriorityList from "@/components/PriorityList";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { cn } from "@/lib/utils";

export default function OnboardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [goal, setGoal] = useState("");
    const [priorities, setPriorities] = useState<string[]>([]);
    
    // Current vs Desired Rhythm
    const [currentWakeTime, setCurrentWakeTime] = useState("08:00");
    const [currentSleepTime, setCurrentSleepTime] = useState("23:30");
    const [desiredWakeTime, setDesiredWakeTime] = useState("07:00");
    const [desiredSleepTime, setDesiredSleepTime] = useState("22:30");

    // Meals & Free time
    const [lunchTime, setLunchTime] = useState("13:00");
    const [dinnerTime, setDinnerTime] = useState("19:30");
    const [chillTime, setChillTime] = useState("21:00");

    const totalSteps = 6;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            const profile = { 
                goal, 
                priorities, 
                routine: { 
                    currentWakeTime, currentSleepTime, 
                    desiredWakeTime, desiredSleepTime 
                },
                mealsAndFreeTime: {
                    lunchTime, dinnerTime, chillTime
                }
            };
            const response = await fetch('/api/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem("weeklyloop_profile", JSON.stringify(profile));
                router.push("/dashboard");
            } else {
                console.error("Failed to onboard:", data.error);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Onboarding error:", error);
            setIsSubmitting(false);
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-2xl">
                {/* Progress bar */}
                <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                            key={i}
                            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${i <= step ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-card border border-white/10 text-white/30"
                                }`}
                        >
                            {i < step ? <Check className="w-5 h-5" /> : i}
                        </motion.div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative min-h-[400px]">
                    <AnimatePresence mode="wait" custom={1}>
                        {step === 1 && (
                            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">What's your primary goal?</h2>
                                    <p className="text-white/60">Having a clear monthly goal helps the AI prioritize your schedule.</p>
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="e.g., I want to become a morning person, exercise consistently, and finish my side project."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-white text-lg transition-all"
                                    />
                                    <div className="absolute bottom-4 right-4 p-2 bg-primary/20 rounded-full text-primary">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Your Priorities</h2>
                                    <p className="text-white/60">List the things that must happen every week. We'll build around these.</p>
                                </div>
                                <PriorityList items={priorities} onChange={setPriorities} />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Current Rhythm</h2>
                                    <p className="text-white/60">When do you *actually* wake up and sleep right now? Be honest!</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <TimeSlotPicker label="Current Wake Time" value={currentWakeTime} onChange={setCurrentWakeTime} />
                                    <TimeSlotPicker label="Current Sleep Time" value={currentSleepTime} onChange={setCurrentSleepTime} />
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Desired Rhythm</h2>
                                    <p className="text-white/60">When would you *like* to wake up and sleep? The AI will help you gradually shift towards this.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <TimeSlotPicker label="Desired Wake Time" value={desiredWakeTime} onChange={setDesiredWakeTime} />
                                    <TimeSlotPicker label="Desired Sleep Time" value={desiredSleepTime} onChange={setDesiredSleepTime} />
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Meals & Chill Time</h2>
                                    <p className="text-white/60">Let's block out time for the essentials.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                    <TimeSlotPicker label="Lunch" value={lunchTime} onChange={setLunchTime} />
                                    <TimeSlotPicker label="Dinner" value={dinnerTime} onChange={setDinnerTime} />
                                    <TimeSlotPicker label="Chill Time" value={chillTime} onChange={setChillTime} />
                                </div>
                            </motion.div>
                        )}

                        {step === 6 && (
                            <motion.div key="step6" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6 flex flex-col items-center justify-center text-center min-h-[250px]">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                    <Check className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">All set!</h2>
                                <p className="text-white/60 max-w-sm mb-8">
                                    Your baseline profile is ready. The AI is now generating your optimal schedule based on your goals and rhythm.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={handlePrev}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-full text-white/50 hover:text-white transition-colors",
                            step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                        onClick={step === totalSteps ? handleComplete : handleNext}
                        disabled={isSubmitting || (step === 1 && !goal.trim())}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : step === totalSteps ? (
                            <>Generate My Schedule <Sparkles className="w-4 h-4" /></>
                        ) : (
                            <>Continue <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
