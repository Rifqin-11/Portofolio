import React from 'react'
import Hero from "./sections/Hero.tsx";
import ShowcaseSection from './sections/Showcase.tsx';
import Navbar from './components/Navbar.tsx';
import LogoSection from './sections/LogoShowcase.tsx';
import FeatureCard from './sections/FeatureCard.tsx';
import ExperienceSection from './sections/Experience.tsx';
import TechStack from './sections/TechStack.tsx';

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
