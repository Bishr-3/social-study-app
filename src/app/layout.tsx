import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "فخورون بالإمارات 🇦🇪 | المدرسة الأهلية الخيرية",
  description:
    "فعالية فخورون بالإمارات - التعبير عن حب الوطن والانتماء إليه وإبراز إنجازات دولة الإمارات العربية المتحدة",
  keywords: "الإمارات, فخورون, وطني, المدرسة الأهلية الخيرية, سمنان",
  manifest: "/manifest.json",
  themeColor: "#050510",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
