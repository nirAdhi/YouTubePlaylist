'use client';

import { useState } from 'react';
import { bulkAddVideos } from '@/lib/api';

export default function BulkAddModal({ onClose, onBulkAdd }) {
  const [urlsText, setUrlsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const urls = urlsText
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    setLoading(true);
    setResults(null);
    setError('');

    try {
      const data = await bulkAddVideos(urls);
      setResults(data);

      if (data.added?.length > 0) {
        onBulkAdd(data.added);
      }
    } catch (err) {
      console.error('Bulk add failed:', err);
      setError(err?.response?.data?.error || err?.message || 'Failed to process videos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl app-bg-card rounded-xl border app-border p-4 sm:p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold app-text">Add Multiple Videos</h2>
          <button onClick={onClose} className="app-text-secondary hover:app-text transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <p className="text-sm app-text-secondary mb-4">
          Paste multiple video URLs (one per line). Supports YouTube, TikTok, Instagram, Facebook, Twitter, Vimeo, Reddit, and more.
        </p>

        <textarea
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder="https://youtube.com/watch?v=...
https://tiktok.com/@user/video/...
https://instagram.com/reel/...
https://facebook.com/watch/..."
          className="w-full h-48 px-4 py-3 app-bg-input app-border rounded-lg focus:outline-none focus:border-blue-500 mb-4 app-text font-mono text-sm"
          disabled={loading}
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 app-bg-pill app-hover rounded-lg transition-colors app-text"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !urlsText.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 text-white"
          >
            {loading ? 'Processing...' : 'Add Videos'}
          </button>
        </div>

        {results && (
          <div className="mt-6 app-border-t pt-4">
            <h3 className="text-lg font-semibold app-text mb-3">Results</h3>

            {results.added?.length > 0 && (
              <div className="mb-4">
                <p className="text-green-500 font-medium mb-2">
                  ✓ Added ({results.added.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {results.added.map((video, i) => (
                    <div key={i} className="text-sm app-text-secondary app-bg-pill rounded p-2">
                      {video.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.duplicates?.length > 0 && (
              <div className="mb-4">
                <p className="text-yellow-500 font-medium mb-2">
                  ⚠ Duplicates ({results.duplicates.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {results.duplicates.map((item, i) => (
                    <div key={i} className="text-sm app-text-muted app-bg-pill rounded p-2">
                      {item.title || item.url}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.failed?.length > 0 && (
              <div>
                <p className="text-red-500 font-medium mb-2">
                  ✗ Failed ({results.failed.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {results.failed.map((item, i) => (
                    <div key={i} className="text-sm app-text-muted app-bg-pill rounded p-2">
                      <span className="text-red-500">{item.url}</span>
                      <span className="ml-2">- {item.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
