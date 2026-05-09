import AdvantagesSection from "@/src/components/home/AdvantagesSection";
import AppHeader from "@/src/components/home/AppHeader";
import BrandShowcase from "@/src/components/home/BrandShowcase";
import D2CBrandStories from "@/src/components/home/D2CBrandStories";
import FloatingInviteButton from "@/src/components/home/FloatingInviteButton";
import Footer from "@/src/components/home/Footer";
import HeroSection from "@/src/components/home/HeroSection";
import VerificationSection from "@/src/components/home/VerificationSection";
import { useHomeLogic } from "@/src/hooks/useHomeLogic";

const videoUrls = [
  "https://www.youtube.com/watch?v=BiM441mDo4A",
  "https://www.youtube.com/watch?v=Et_D6txS4ew",
  "https://www.youtube.com/watch?v=B58ZXi2Qk5w",
  "https://www.youtube.com/watch?v=znXQ89WBj0U",
  "https://www.youtube.com/watch?v=uJdLg8uJf9M",
];

export default function HomePage() {
  const { scrollController } = useHomeLogic();

  return (
    <>
      <AppHeader />
      <main ref={scrollController} className="min-h-screen bg-brand-soft">
        <HeroSection />
        <BrandShowcase />
        <VerificationSection />
        <AdvantagesSection />
        <D2CBrandStories videoUrls={videoUrls} />
        <Footer />
        <FloatingInviteButton />
      </main>
    </>
  );
}
