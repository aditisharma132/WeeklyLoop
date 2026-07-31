"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Loader2, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeedbackModal({
    isOpen,
    onClose,
    onSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit({ rating, notes });
        setIsSubmitting(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-lg glass-panel border border-purple-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full point-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center mb-8 relative z-10">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-400">
                                <Moon className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-center">End of Day Reflection</h2>
                            <p className="text-white/60 text-center mt-2 max-w-sm">
                                How did today feel? Your feedback helps WeeklyLoop plan tomorrow better.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                            <div className="flex flex-col items-center">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-10 h-10 transition-colors duration-200",
                                                    (hoverRating || rating) >= star
                                                        ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                                                        : "text-white/20"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-sm text-yellow-400/80 font-medium h-4 mt-2">
                                    {rating === 1 && "Rough day, off track"}
                                    {rating === 2 && "Struggled a bit"}
                                    {rating === 3 && "Okay, average day"}
                                    {rating === 4 && "Great, very productive!"}
                                    {rating === 5 && "Perfect, crushed my goals!"}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    What went well? What didn't? (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="e.g., I skipped reading because work took longer than expected..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={rating === 0 || isSubmitting}
                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold transition-all hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Reflection"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
