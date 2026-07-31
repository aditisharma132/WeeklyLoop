"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PriorityList({
    items,
    onChange
}: {
    items: string[],
    onChange: (items: string[]) => void
}) {
    const [newItem, setNewItem] = useState("");

    const handleAdd = () => {
        if (newItem.trim() && !items.includes(newItem.trim())) {
            onChange([...items, newItem.trim()]);
            setNewItem("");
        }
    };

    const handleRemove = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Add a priority (e.g., Work out 3x a week)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/40 transition-all"
                />
                <button
                    onClick={handleAdd}
                    className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-2 mt-4">
                {items.length === 0 ? (
                    <p className="text-white/40 text-sm text-center py-4">No priorities added yet.</p>
                ) : (
                    items.map((item, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={item}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm group",
                                index === 0 ? "border-primary/30 bg-primary/10" : ""
                            )}
                        >
                            <span className="text-white/20 cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-5 h-5" />
                            </span>
                            <span className="flex-1 text-white font-medium">
                                {index === 0 ? <span className="text-primary mr-2 text-sm opacity-80">Top Priority:</span> : null}
                                {item}
                            </span>
                            <button
                                onClick={() => handleRemove(index)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
