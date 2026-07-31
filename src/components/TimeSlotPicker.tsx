"use client";

export default function TimeSlotPicker({
    label,
    value,
    onChange
}: {
    label: string,
    value: string,
    onChange: (val: string) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/70">{label}</label>
            <input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white w-full transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:opacity-50"
            />
        </div>
    );
}
