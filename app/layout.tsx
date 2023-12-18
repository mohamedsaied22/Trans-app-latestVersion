// ./app/layout.tsx
import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
//import {ClerkProvider} from "@clerk/nextjs";
import {CrispProvider} from "@/components/crisp-provider";
import AuthProvider from "@/app/AuthProvider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "SESCO",
    description: "SESCO trans app",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        /*<ClerkProvider>*/
        <AuthProvider>
            <html lang="en">
            <CrispProvider/>
            <body className={inter.className}>{children}</body>
            </html>
        </AuthProvider>
        /*</ClerkProvider>*/
    );
}
