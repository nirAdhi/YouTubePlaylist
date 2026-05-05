'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SharePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sharedUrl = searchParams.get('url');
    const sharedText = searchParams.get('text');

    let videoUrl = sharedUrl;

    if (!videoUrl && sharedText) {
      const match = sharedText.match(
        /(https?:\/\/)?(www\.)?([^\s]+)/i
      );
      if (match) {
        videoUrl = match[0];
      }
    }

    if (videoUrl) {
      router.replace(`/?addUrl=${encodeURIComponent(videoUrl)}`);
    } else {
      router.replace('/');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p>Processing shared link...</p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p>Processing shared link...</p>
      </div>
    }>
      <SharePageContent />
    </Suspense>
  );
}
