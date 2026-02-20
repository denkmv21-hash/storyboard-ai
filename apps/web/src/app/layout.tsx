import { Metadata } from 'next';
import { Header } from '@/components/header';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/contexts/theme-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Storyboard AI - Generate Storyboards from Scripts',
  description: 'AI-powered storyboard generation for filmmakers and content creators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1 w-full mx-auto max-w-7xl">{children}</main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
