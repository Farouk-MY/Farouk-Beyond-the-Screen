import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { GoogleTagManager } from "@next/third-parties/google";

const spaceGrotesk = localFont({
  src: "../public/FAROUK_REDESIGN_ASSETS/Fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = localFont({
  src: "../public/FAROUK_REDESIGN_ASSETS/Fonts/Manrope/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    {
      path: "../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const notoSansArabic = localFont({
  src: "../public/FAROUK_REDESIGN_ASSETS/Fonts/Noto_Sans_Arabic/NotoSansArabic-VariableFont_wght.ttf",
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1C1512",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://farouk-beyond-the-screen.vercel.app"),
  title: {
    default: "Farouk Messai — Software Developer | Mobile & Web Development",
    template: "%s | Farouk Messai",
  },
  description:
    "Cinematic digital portfolio of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter across modern web and cross-platform architectures.",
  keywords: [
    "Farouk Messai",
    "فاروق مسعي",
    "Software Developer",
    "مطوّر برمجيات",
    "Mobile Development",
    "Web Development",
    "Flutter",
    "Next.js",
    "React Native",
    "TypeScript",
    "FastAPI",
    "Tunisia",
    "Portfolio",
  ],
  authors: [{ name: "Farouk Messai" }],
  creator: "Farouk Messai",
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      ar: "/ar",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_TN"],
    title: "Farouk Messai — Software Developer | Mobile & Web Development",
    description:
      "Explore the continuous cinematic portfolio film of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter.",
    siteName: "Farouk Messai — Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farouk Messai — Software Developer | Mobile & Web Development",
    description:
      "Explore the continuous cinematic portfolio film of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "rtDtKjJUFKy_n8K6ETk1cLT8Pr_ocrd_RKKq2K4LQqo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexMono.variable} ${notoSansArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {process.env.NODE_ENV === "production" ? (
        <GoogleTagManager gtmId="GTM-WPC5PGG5" />
      ) : null}
      <body className="min-h-full flex flex-col font-sans transition-colors duration-500 bg-[#0E0C0A] text-[#FAF8F5]">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
