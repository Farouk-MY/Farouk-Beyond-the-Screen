import type { Metadata } from 'next';
import { CinematicExperience } from '@/components/cinematic/CinematicExperience';

export const metadata: Metadata = {
  title: 'Farouk Messai — Software Developer | Mobile & Web Development',
  description:
    'Cinematic five-act developer portfolio and continuous digital journey showcasing modern web architectures, cross-platform mobile systems, and creative engineering.',
};

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[#0E0C0A]">
      <CinematicExperience />
    </main>
  );
}
