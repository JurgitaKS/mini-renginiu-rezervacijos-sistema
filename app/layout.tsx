import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { THEME_STORAGE_KEY } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini renginių rezervacijos sistema",
  description: "Mokymosi projektas — renginių rezervavimas",
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}');
    var isDark = theme === 'dark';
    var root = document.documentElement;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
