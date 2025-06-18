import React from 'react'
import Hero from "./sections/Hero.tsx";
import ShowcaseSection from './sections/ShowcaseSection.tsx';
import Navbar from './components/Navbar.tsx';
import LogoSection from './sections/LogoShowcase.tsx';
import FeatureCard from './sections/FeatureCard.tsx';

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCard />
    </>
  )
}

export default App
