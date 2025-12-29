'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');

    if (requireAuth && !token) {
      // Need auth but no token - redirect to login
      router.replace('/admin/login');
    } else if (!requireAuth && token) {
      // On login page but already authenticated - redirect to admin
      router.replace('/admin');
    }
  }, [requireAuth, router]);
}
