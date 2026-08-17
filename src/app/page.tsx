import React from 'react';
import BusinessLandingPageClient from '../components/BusinessLandingPageClient';

// Disable Next.js caching for the root landing page to ensure updates show immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function BusinessLandingPage() {
  return <BusinessLandingPageClient />;
}
