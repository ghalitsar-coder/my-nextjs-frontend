"use client";

import "./landing.css";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import SpecialtyCards from "./SpecialtyCards";
import MenuSection from "./MenuSection";
import AboutSection from "./AboutSection";
import CallToActionSection from "./CallToActionSection";
import TestimonialsSection from "./TestimonialsSection";
import LocationsSection from "./LocationsSection";
import NewsletterSection from "./NewsletterSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* <Navigation /> */}
      <HeroSection />
      <SpecialtyCards />
      <MenuSection />
      <AboutSection />
      <CallToActionSection />
      <TestimonialsSection />
      <LocationsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
