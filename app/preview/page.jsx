"use client";
import React from "react";
import { Navbar } from "../../components/Navbar";
import HeroSection from "../../components/Hero";
import FreshnessCalculator from "../../components/Calculator";
import ComparisonTable from "../../components/Comparison";
import ReferralAndPlans from "../../components/Program";
import ContactFooter from "../../components/Contact";
const Preview = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      {/* <HowItWorks /> */}
      {/* <EggBotChat /> */}
      {/* <RecipeGenerator /> */}
      <FreshnessCalculator />
      <ComparisonTable />
      <ReferralAndPlans />
      <ContactFooter />
    </div>
  );
};

export default Preview;
