"use client";

import dynamic from "next/dynamic";

// Load the wizard as a client chunk (also safe if it uses hooks)
const HealthOnboardingWizard = dynamic(
  () => import("@/components/health-onboarding-wizard"),
  { ssr: false } // prevents SSR from trying to execute hooks during prerender
);

export default function OnboardingPage() {
  return (
    <div className="container mx-auto px-6 py-10">
      <HealthOnboardingWizard />
    </div>
  );
}
