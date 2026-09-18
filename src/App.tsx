import { useCallback, useState } from "react";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/Showcase";
import Navbar from "./components/Navbar";
import ExperienceSection from "./sections/Experience";
import Footer from "./sections/Footer";
import InteractiveBackground from "./components/InteractiveBackground";

import Contact from "./sections/Contact";
import AnimatedCounter from "./components/AnimatedCounter";

import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { usePortfolioData } from "./hooks/usePortfolioData";
import AdminPage from "./pages/AdminPage";
import Preloader from "./components/Preloader";

const PublicPortfolio = () => {
  const { data, loading } = usePortfolioData();
  const [showPreloader, setShowPreloader] = useState(true);
  const finishPreloader = useCallback(() => setShowPreloader(false), []);

  return (
    <>
      {showPreloader && (
        <Preloader dataReady={!loading} onComplete={finishPreloader} />
      )}
      <Navbar brandName={data.profile.brandName} />
      <Hero
        profile={data.profile}
        roles={data.heroRoles}
        socialLinks={data.socialLinks}
      />
      <AnimatedCounter items={data.stats} />
      <ExperienceSection experiences={data.experiences} />
      <ShowcaseSection projects={data.projects} />
      <Contact />
      <Footer profile={data.profile} socialLinks={data.socialLinks} />
    </>
  );
};

const App = () => {
  return (
    <>
      <Toaster />
      <InteractiveBackground />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
