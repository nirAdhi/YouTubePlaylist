'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SharePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract YouTube URL from share parameters
    const sharedUrl = searchParams.get('url');
    const sharedText = searchParams.get('text');

    let videoUrl = sharedUrl;

    // If no direct url param, try to extract from text
    if (!videoUrl && sharedText) {
      const youtubeMatch = sharedText.match(
        /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/i
      );
      if (youtubeMatch) {
        videoUrl = youtubeMatch[0];
      }
    }

    if (videoUrl) {
      // Redirect to dashboard with the URL to auto-add
      router.replace(`/?addUrl=${encodeURIComponent(videoUrl)}`);
    } else {
      // No URL found, go to dashboard
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
