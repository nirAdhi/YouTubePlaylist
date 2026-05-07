'use client';

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, onClick }) {
  const colorMap = {
    gray: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
  };

  const colorStyle = colorMap[note.color] || colorMap.gray;

  return (
    <div 
      className={`relative rounded-xl border p-5 transition-all hover:shadow-xl group cursor-pointer active:scale-[0.98] ${colorStyle}`}
      onClick={onClick}
    >
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
          <span className="text-white text-sm">📌</span>
        </div>
      )}

      <div className="mb-3">
        <h3 className="font-bold app-text text-lg pr-6 line-clamp-1">
          {note.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 app-text-secondary">
            {note.category}
          </span>
          <span className="text-[10px] app-text-muted">
            {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <p className="app-text-secondary text-sm line-clamp-4 whitespace-pre-wrap mb-6 min-h-[5rem]">
        {note.content}
      </p>

      <div className="flex gap-2 pt-4 border-t border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(note);
          }}
          className={`flex-1 text-xs py-2 rounded-lg font-medium transition-colors ${
            note.isPinned
              ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30'
              : 'app-bg-pill app-text-secondary hover:app-bg-pill-active'
          }`}
        >
          {note.isPinned ? 'Unpin' : 'Pin'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="flex-1 text-xs py-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 rounded-lg font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="flex-1 text-xs py-2 bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20 rounded-lg font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
