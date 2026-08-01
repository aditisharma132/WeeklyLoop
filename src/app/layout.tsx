import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "WeeklyLoop | AI Self-Correcting Planner",
    description: "An AI-powered planner that learns your habits and automatically rearranges your day when things go off-track.",
};

export const viewport: Viewport = {
    themeColor: "#09090b",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${outfit.variable} font-sans antialiased min-h-screen bg-background text-foreground flex`}>
                <Providers>
                    <Sidebar />
                    <main className="flex-1 w-full flex flex-col min-h-screen">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
