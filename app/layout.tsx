import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { AudioProvider } from "@/components/Audio";
import { Motion } from "@/components/Motion";
import { festa } from "@/lib/festa";

export const metadata: Metadata = {
  title: { default: `60 anni di ${festa.nome}`, template: `%s · 60 anni di ${festa.nome}` },
  description: `L'album e le canzoni per i sessant'anni di ${festa.nome}.`,
};
export const viewport: Viewport = { themeColor: "#f4eee2" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it" data-scroll-behavior="smooth"><body><AudioProvider>{children}</AudioProvider><Motion /></body></html>;
}
