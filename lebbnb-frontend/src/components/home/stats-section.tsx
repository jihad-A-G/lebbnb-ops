'use client';

import { motion } from 'framer-motion';
import { Home, Users, Award, Building2 } from 'lucide-react';
import type { Stat } from '@/types';
import { useEffect, useState } from 'react';

interface StatsSectionProps {
  stats: Stat[];
}

const defaultStats = [
  { label: 'Properties', value: '500+', icon: 'Building2' },
  { label: 'Happy Clients', value: '1000+', icon: 'Users' },
  { label: 'Years Experience', value: '15+', icon: 'Award' },
  { label: 'Cities Covered', value: '25+', icon: 'Home' },
];

const iconMap: Record<string, any> = {
  Building2,
  Users,
  Award,
  Home,
};

function CountUpAnimation({ end }: { end: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}</span>;
}

export function StatsSection({ stats: propStats }: StatsSectionProps) {
  const stats = propStats && propStats.length > 0 ? propStats : defaultStats;

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-[#2f4222] to-[#425b30] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 font-[family-name:var(--font-playfair)] px-4">
            Our Achievements
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Numbers that speak for our excellence and commitment
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon ? iconMap[stat.icon] || Building2 : Building2;
            const numericValue = parseInt(stat.value.replace(/\D/g, '')) || 0;
            const suffix = stat.value.replace(/\d/g, '');

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-lg rounded-full mb-3 sm:mb-4"
                >
                  <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#9dbe85]" />
                </motion.div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">
                  <CountUpAnimation end={numericValue} />
                  {suffix}
                </div>
                <div className="text-sm sm:text-base text-gray-200 font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
