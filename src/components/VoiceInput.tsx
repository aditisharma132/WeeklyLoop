"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, X, Loader2 } from "lucide-react";

import { useSession, signIn } from "next-auth/react";

export default function VoiceInput({
    onSubmit
}: {
    onSubmit: (text: string) => void
}) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // ... (useEffect remains unchanged) ...
    useEffect(() => {
        // Initialize Web Speech API
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognitionRef.current.onresult = (event: any) => {
                    let currentTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setText(currentTranscript);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                    setError("Error listening. Try the text fallback.");
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (!recognitionRef.current) {
                setError("Voice input not supported in this browser. Please type instead.");
                return;
            }
            setText("");
            recognitionRef.current.start();
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (text.trim()) {
            onSubmit(text);
            setIsOpen(false);
            setText("");
        }
    };

    const handleOpenClick = () => {
        if (!session) {
            signIn();
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            {/* Floating Action Button */}
            <div className="fixed bottom-6 xl:bottom-12 right-6 xl:right-12 z-50">
                <motion.button
                    onClick={handleOpenClick}
                    className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.8)] transition-all animate-pulse-glow hover:scale-105"
                >
                    <Mic className="w-8 h-8" />
                </motion.button>
            </div>

            {/* Voice/Text Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="w-full max-w-lg bg-card border border-white/10 p-6 rounded-3xl shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8 mt-4">
                                <button
                                    onClick={toggleListen}
                                    className="relative group w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                                >
                                    <div className={`absolute inset-0 bg-primary/20 rounded-full transition-all duration-500 ${isListening ? 'scale-150 opacity-0 animate-ping' : 'scale-100 opacity-100 group-hover:scale-110'}`} />
                                    <div className={`absolute inset-2 bg-primary/40 rounded-full transition-all duration-300 ${isListening ? 'scale-125' : 'scale-100 group-hover:scale-105'}`} />
                                    <div className="relative z-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                        {isListening ? (
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        ) : (
                                            <Mic className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                </button>
                                <h3 className="text-xl font-semibold mb-1">
                                    {isListening ? "Listening..." : "How can I help adjust your day?"}
                                </h3>
                                <p className="text-sm text-white/50">
                                    Try asking to rearrange tasks, or explain any delays.
                                </p>
                                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                            </div>

                            {/* Text Fallback / Editor */}
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type or speak a message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!text.trim()}
                                    className="bg-primary text-white p-3 px-5 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
