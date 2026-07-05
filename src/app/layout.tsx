import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Persona Tutor — Learn from AI mentors who teach like the real thing",
  description: "Chat with AI-powered coding tutors modelled after real engineering educators. Get personalized explanations, code reviews, and mentorship on demand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bricolage.variable} font-sans antialiased bg-white text-zinc-900`}
      >
        {children}
      </body>
    </html>
  );
}

