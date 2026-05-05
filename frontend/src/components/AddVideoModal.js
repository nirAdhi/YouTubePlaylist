'use client';

import { useState } from 'react';
import { addVideo } from '@/lib/api';

const categoryLabels = {
  Relaxing: 'Relaxing',
  Motivational: 'Motivational',
  Funny: 'Funny',
  Music: 'Music',
  Learning: 'Learning',
  Tech: 'Tech',
  Gaming: 'Gaming',
  Fitness: 'Fitness',
  Cooking: 'Cooking',
  News: 'News',
  Productivity: 'Productivity',
  Creative: 'Creative',
  Entertainment: 'Entertainment',
  Other: 'Other',
};

export default function AddVideoModal({ onClose, onAdded, prefilledUrl = '' }) {
  const [url, setUrl] = useState(prefilledUrl);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedCategory, setDetectedCategory] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDetectedCategory('');
    try {
      const video = await addVideo(url, note);
      setDetectedCategory(video.category || 'Other');
      onAdded(video);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This video is already in your library');
      } else {
        setError(err.response?.data?.error || 'Failed to add video');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-gray-850 rounded-xl border border-gray-750 p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Add Video</h2>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Video URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste any video link: YouTube, TikTok, Instagram, Facebook, Vimeo, Twitter..."
              className="w-full px-4 py-2 bg-gray-950 border border-gray-750 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-950 border border-gray-750 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          {detectedCategory && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Detected mood:</span>
              <span className="px-2 py-0.5 bg-gray-750 rounded-full text-xs font-medium">
                {categoryLabels[detectedCategory] || detectedCategory}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-750 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
