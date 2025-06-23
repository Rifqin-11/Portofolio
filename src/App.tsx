
import Hero from "./sections/Hero";
import ShowcaseSection from './sections/Showcase';
import Navbar from './components/Navbar';
import LogoSection from './sections/LogoShowcase';
import FeatureCard from './sections/FeatureCard';
import ExperienceSection from './sections/Experience';
import TechStack from './sections/TechStack';
import Footer from "./sections/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCard />
      <ExperienceSection />
      {/* <TechStack /> */}
      <Footer />
    </>
  )
}

export default App
