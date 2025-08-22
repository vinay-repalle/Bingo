import React from 'react';
import Navbar from '../Components/Navbar';
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import HowToPlaySection from '../Components/HowToPlaySection';
import Footer from '../Components/Footer';

function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowToPlaySection />
      <Footer />
    </>
  );
}

export default LandingPage;