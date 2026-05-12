import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/Showcase";
import Navbar from "./components/Navbar";
import LogoSection from "./sections/LogoShowcase";
import FeatureCard from "./sections/FeatureCard";
import ExperienceSection from "./sections/Experience";
import TechStack from "./sections/TechStack";
import Footer from "./sections/Footer";
import InteractiveBackground from "./components/InteractiveBackground";

import Contact from "./sections/Contact";

import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { usePortfolioData } from "./hooks/usePortfolioData";
import AdminPage from "./pages/AdminPage";

const PublicPortfolio = () => {
  const { data } = usePortfolioData();

  return (
    <>
      <Navbar brandName={data.profile.brandName} />
      <Hero
        profile={data.profile}
        roles={data.heroRoles}
        stats={data.stats}
      />
      <ShowcaseSection projects={data.projects} />
      <LogoSection />
      <FeatureCard />
      <ExperienceSection experiences={data.experiences} />
      <TechStack skills={data.skills} />
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
