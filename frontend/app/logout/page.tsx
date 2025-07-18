'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');

  
    router.push('/signup');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h2 className="text-xl font-semibold text-gray-700">Logging you out...</h2>
    </div>
  );
}
