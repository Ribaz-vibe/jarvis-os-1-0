import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { XPHeader } from "@/components/shared/XPHeader";
import { StoreProvider } from "@/components/providers/StoreProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "JARVIS 1.0 | Personal OS",
  description: "Sistema operacional pessoal gamificado com IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased overflow-x-hidden`}>
        <StoreProvider>
          <Sidebar />
          <XPHeader />
          <main className="pl-20 md:pl-64 pt-20 min-h-screen">
            <div className="p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
