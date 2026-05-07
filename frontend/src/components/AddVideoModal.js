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
      <div className="w-full max-w-md app-bg-card rounded-xl border app-border p-4 sm:p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 app-text">Add Video</h2>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm app-text-secondary mb-1">Video URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YouTube, TikTok, Instagram link..."
              className="w-full px-4 py-2 app-bg-input app-border rounded-lg focus:outline-none focus:border-blue-500 text-sm app-text"
              required
            />
          </div>
          <div>
            <label className="block text-sm app-text-secondary mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 app-bg-input app-border rounded-lg focus:outline-none focus:border-blue-500 app-text"
            />
          </div>
          {detectedCategory && (
            <div className="flex items-center gap-2 text-sm app-text-secondary">
              <span>Detected mood:</span>
              <span className="px-2 py-0.5 app-bg-pill rounded-full text-xs font-medium app-text">
                {categoryLabels[detectedCategory] || detectedCategory}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 app-bg-pill app-hover rounded-lg transition-colors app-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 text-white"
            >
              {loading ? 'Adding...' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
