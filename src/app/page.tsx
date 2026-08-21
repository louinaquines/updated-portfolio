import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import VisitTracker from "@/components/VisitTracker";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#dedede]">
      <VisitTracker />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
