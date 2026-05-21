import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "بیلیارد پلاس",
  description: "پلتفرم تخصصی بیلیارد ایران",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <style>{`
          * { font-family: 'Vazirmatn', system-ui, sans-serif !important; }
          input, select, textarea, button { font-family: 'Vazirmatn', system-ui, sans-serif !important; }
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #020806; }
          ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }
        `}</style>
      </head>
      <body style={{ backgroundColor: '#030a06', margin: 0, padding: 0 }}>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}