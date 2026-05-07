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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add Multiple Videos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <p className="text-gray-400 text-sm mb-4">
          Paste multiple video URLs (one per line). Supports YouTube, TikTok, Instagram, Facebook, Twitter, Vimeo, Reddit, and more.
        </p>

        <textarea
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder="https://youtube.com/watch?v=...
https://tiktok.com/@user/video/...
https://instagram.com/reel/...
https://facebook.com/watch/..."
          className="w-full h-48 bg-gray-700 text-white rounded-lg p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !urlsText.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : 'Add Videos'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

        {results && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-3">Results</h3>

            {results.added?.length > 0 && (
              <div className="mb-4">
                <p className="text-green-400 font-medium mb-2">
                  ✓ Added ({results.added.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {results.added.map((video, i) => (
                    <div key={i} className="text-sm text-gray-300 bg-gray-700/50 rounded p-2">
                      {video.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.duplicates?.length > 0 && (
              <div className="mb-4">
                <p className="text-yellow-400 font-medium mb-2">
                  ⚠ Duplicates ({results.duplicates.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {results.duplicates.map((item, i) => (
                    <div key={i} className="text-sm text-gray-400 bg-gray-700/50 rounded p-2">
                      {item.title || item.url}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.failed?.length > 0 && (
              <div>
                <p className="text-red-400 font-medium mb-2">
                  ✗ Failed ({results.failed.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {results.failed.map((item, i) => (
                    <div key={i} className="text-sm text-gray-400 bg-gray-700/50 rounded p-2">
                      <span className="text-red-400">{item.url}</span>
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
