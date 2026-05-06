'use client';

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const colorMap = {
    gray: 'bg-gray-700 border-gray-600',
    red: 'bg-red-900/30 border-red-700',
    orange: 'bg-orange-900/30 border-orange-700',
    yellow: 'bg-yellow-900/30 border-yellow-700',
    green: 'bg-green-900/30 border-green-700',
    blue: 'bg-blue-900/30 border-blue-700',
    purple: 'bg-purple-900/30 border-purple-700',
    pink: 'bg-pink-900/30 border-pink-700',
  };

  const borderColor = colorMap[note.color] || colorMap.gray;

  return (
    <div
      className={`relative rounded-lg border p-4 transition-all hover:shadow-lg ${borderColor}`}
    >
      {note.isPinned && (
        <div className="absolute top-2 right-2">
          <span className="text-yellow-400 text-lg">📌</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white text-lg pr-6 line-clamp-1">
          {note.title}
        </h3>
      </div>

      <div className="flex gap-2 mb-3">
        <span className="text-xs px-2 py-1 bg-gray-600 rounded text-gray-200">
          {note.category}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-300 text-sm line-clamp-4 whitespace-pre-wrap">
        {note.content}
      </p>

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-600">
        <button
          onClick={() => onTogglePin(note)}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            note.isPinned
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
              : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
          }`}
        >
          {note.isPinned ? 'Unpin' : 'Pin'}
        </button>
        <button
          onClick={() => onEdit(note)}
          className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-sm px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
