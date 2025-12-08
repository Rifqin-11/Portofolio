import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/Showcase";
import Navbar from "./components/Navbar";
import LogoSection from "./sections/LogoShowcase";
import FeatureCard from "./sections/FeatureCard";
import ExperienceSection from "./sections/Experience";
import TechStack from "./sections/TechStack";
import Footer from "./sections/Footer";

import Contact from "./sections/Contact";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster />
      <Navbar />
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCard />
      <ExperienceSection />
      <TechStack />
      <Contact />
      <Footer />
    </>
  );
};

export default App;
