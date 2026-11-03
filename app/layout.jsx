import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata = {
  title: "Adrian Bagasbas — Web Developer & Designer",
  description:
    "Freelance web developer and UI/UX designer building fast, modern websites with React, Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
