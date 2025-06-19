
import Hero from "./sections/Hero";
import ShowcaseSection from './sections/Showcase';
import Navbar from './components/Navbar';
import LogoSection from './sections/LogoShowcase';
import FeatureCard from './sections/FeatureCard';
import ExperienceSection from './sections/Experience';
import TechStack from './sections/TechStack';

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCard />
      <ExperienceSection />
      <TechStack />
    </>
  )
}

export default App
