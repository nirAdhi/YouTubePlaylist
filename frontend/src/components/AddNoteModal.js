'use client';

import { useState, useEffect } from 'react';

export default function AddNoteModal({ onClose, onSave, note }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('gray');
  const [category, setCategory] = useState('General');
  const [saving, setSaving] = useState(false);

  const colors = [
    { name: 'gray', label: 'Gray' },
    { name: 'red', label: 'Red' },
    { name: 'orange', label: 'Orange' },
    { name: 'yellow', label: 'Yellow' },
    { name: 'green', label: 'Green' },
    { name: 'blue', label: 'Blue' },
    { name: 'purple', label: 'Purple' },
    { name: 'pink', label: 'Pink' },
  ];

  const categories = [
    'General',
    'Configuration',
    'Commands',
    'Code Snippets',
    'Credentials',
    'Ideas',
    'Tasks',
    'Learning',
    'Work',
    'Personal',
  ];

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setCategory(note.category);
    }
  }, [note]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const url = note
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/notes/${note.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/notes`;
      const method = note ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, color, category }),
      });

      const data = await res.json();
      onSave(data);
      onClose();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    color === c.name ? 'border-white scale-110' : 'border-transparent'
                  } bg-${c.name}-600`}
                  style={{
                    backgroundColor:
                      c.name === 'gray' ? '#4b5563' :
                      c.name === 'red' ? '#dc2626' :
                      c.name === 'orange' ? '#ea580c' :
                      c.name === 'yellow' ? '#ca8a04' :
                      c.name === 'green' ? '#16a34a' :
                      c.name === 'blue' ? '#2563eb' :
                      c.name === 'purple' ? '#9333ea' :
                      c.name === 'pink' ? '#db2777' : '#4b5563'
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here... 

You can store:
- Configuration settings
- Commands & scripts
- Code snippets
- Important information
- Ideas & thoughts"
              className="w-full h-64 bg-gray-700 text-white rounded-lg px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={saving || !title.trim() || !content.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
