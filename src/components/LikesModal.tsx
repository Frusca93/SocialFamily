// src/components/LikesModal.tsx
'use client';
import { useEffect, useState } from 'react';

export default function LikesModal({ postId, onClose }: { postId: string, onClose: () => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${postId}/likes`).then(r => r.json()).then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, [postId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[260px] max-w-xs relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">×</button>
        <h2 className="text-lg font-semibold mb-3">Mi piace</h2>
        {loading ? (
          <div className="text-center text-gray-500">Caricamento...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500">Nessun like</div>
        ) : (
          <ul className="divide-y">
            {users.map(u => (
              <li key={u.id} className="flex items-center gap-2 py-2">
                {u.image ? <img src={u.image} alt="avatar" className="h-7 w-7 rounded-full object-cover" /> : <div className="h-7 w-7 rounded-full bg-gray-200" />}
                <span className="font-medium">{u.name}</span>
                <span className="text-gray-500 text-xs">@{u.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
