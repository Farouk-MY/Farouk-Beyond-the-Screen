import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const spaceGrotesk = localFont({
  src: '../public/FAROUK_REDESIGN_ASSETS/Fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf',
  variable: '--font-space-grotesk',
  display: 'swap',
});

const manrope = localFont({
  src: '../public/FAROUK_REDESIGN_ASSETS/Fonts/Manrope/Manrope-VariableFont_wght.ttf',
  variable: '--font-manrope',
  display: 'swap',
});

const ibmPlexMono = localFont({
  src: [
    {
      path: '../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/FAROUK_REDESIGN_ASSETS/Fonts/IBM_Plex_Mono/IBMPlexMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1C1512',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Farouk Messai — Software Developer | Mobile & Web Development',
    template: '%s | Farouk Messai',
  },
  description:
    'Cinematic digital portfolio of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter across modern web and cross-platform architectures.',
  keywords: [
    'Farouk Messai',
    'Software Developer',
    'Mobile Development',
    'Web Development',
    'Flutter',
    'Next.js',
    'React Native',
    'TypeScript',
    'FastAPI',
    'Portfolio',
  ],
  authors: [{ name: 'Farouk Messai' }],
  creator: 'Farouk Messai',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Farouk Messai — Software Developer | Mobile & Web Development',
    description:
      'Explore the continuous cinematic portfolio film of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter.',
    siteName: 'Farouk Messai — Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farouk Messai — Software Developer | Mobile & Web Development',
    description:
      'Explore the continuous cinematic portfolio film of Farouk Messai, featuring production systems in Next.js, React Native, and Flutter.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
      className={`${spaceGrotesk.variable} ${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-500 bg-[#0E0C0A] text-[#FAF8F5]">
        {children}
      </body>
    </html>
  );
}
