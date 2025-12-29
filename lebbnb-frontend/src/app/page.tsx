'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { PropertyCarousel } from '@/components/home/property-carousel';
import { PropertyShowcase } from '@/components/home/property-showcase';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { CtaSection } from '@/components/home/cta-section';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: homeData, isLoading: homeLoading } = useQuery({
    queryKey: ['home'],
    queryFn: publicApi.getHome,
  });

  // Fetch all properties for carousel
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => publicApi.getProperties({ limit: 10 }),
  });

  if (homeLoading || propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#425b30] animate-spin" />
      </div>
    );
  }

  // Use featured properties if available, otherwise use all properties
  const displayProperties = homeData?.featuredProperties && homeData.featuredProperties.length > 0
    ? homeData.featuredProperties
    : propertiesData?.galleryItems || [];

  return (
    <div className="pt-20">
      <HeroSection data={homeData} />
      <FeaturedProperties properties={displayProperties} />
      <PropertyCarousel properties={displayProperties} />
      {homeData?.stats && homeData.stats.length > 0 && (
        <StatsSection stats={homeData.stats} />
      )}
      {homeData?.testimonials && homeData.testimonials.length > 0 && (
        <TestimonialsSection testimonials={homeData.testimonials} />
      )}
      <CtaSection />
    </div>
  );
}

