'use client';

import { useState } from 'react';
import { createReminder } from '@/lib/api';

export default function ReminderModal({ video, onClose, onCreated }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date || !time) return;
    setLoading(true);
    setError('');
    try {
      const scheduled = new Date(`${date}T${time}`);
      await createReminder(video.id, scheduled.toISOString());
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create reminder');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm app-bg-card rounded-xl border app-border p-4 sm:p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-2 app-text">Set Reminder</h2>
        <p className="text-sm app-text-secondary mb-4 truncate">{video.title}</p>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm app-text-secondary mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-3 app-bg-input app-border rounded-lg focus:outline-none focus:border-blue-500 text-base min-h-[48px] app-text"
              required
            />
          </div>
          <div>
            <label className="block text-sm app-text-secondary mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-3 app-bg-input app-border rounded-lg focus:outline-none focus:border-blue-500 text-base min-h-[48px] app-text"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 app-bg-pill app-hover rounded-lg transition-colors text-base min-h-[48px] app-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 text-base min-h-[48px] text-white"
            >
              {loading ? 'Saving...' : 'Set Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
