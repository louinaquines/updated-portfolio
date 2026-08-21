import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import VisitTracker from "@/components/VisitTracker";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Loui Naquines",
  alternateName: ["Loui Jay Naquines", "louinaquines"],
  url: "https://louinaquines.online",
  image: "https://louinaquines.online/images/profile.png",
  jobTitle: "Full-Stack Developer",
  description: "Cebu-based full-stack developer building websites, mobile apps, APIs, and dependable digital products.",
  email: "mailto:louinaquines@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cebu",
    addressCountry: "PH",
  },
  sameAs: [
    "https://www.facebook.com/loui.naquines",
    "https://www.instagram.com/_whitechocolateee",
    "https://www.linkedin.com/in/loui-naquines-aba84324b",
    "https://github.com/louinaquines",
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#dedede]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <VisitTracker />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
