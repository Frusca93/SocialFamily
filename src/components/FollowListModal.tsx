import React, { useContext } from 'react';
import { LanguageContext } from '@/app/layout';

const translations = {
  it: { title: 'Persone', remove: 'Rimuovi', close: 'Chiudi' },
  en: { title: 'People', remove: 'Remove', close: 'Close' },
  fr: { title: 'Personnes', remove: 'Retirer', close: 'Fermer' },
  es: { title: 'Personas', remove: 'Eliminar', close: 'Cerrar' },
};

export default function FollowListModal({ open, onClose, users, onRemove }: {
  open: boolean;
  onClose: () => void;
  users: { id: string; name: string; username: string; image?: string }[];
  onRemove: (id: string) => void;
}) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
          {users.length === 0 ? (
            <li className="py-4 text-center text-gray-500">-</li>
          ) : users.map(u => (
            <li key={u.id} className="flex items-center py-2">
              <a href={u.username ? `/profile/${u.username}` : '#'} className="flex items-center mr-3 group">
                {u.image ? (
                  <img src={u.image} alt="avatar" className="h-8 w-8 rounded-full object-cover group-hover:ring-2 group-hover:ring-blue-400" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 group-hover:ring-2 group-hover:ring-blue-400" />
                )}
              </a>
              <a href={u.username ? `/profile/${u.username}` : '#'} className="flex-1 hover:underline">
                {u.name} <span className="text-gray-500">@{u.username}</span>
              </a>
              <button onClick={() => onRemove(u.id)} className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">{t.remove}</button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 w-full rounded bg-gray-200 py-2 hover:bg-gray-300">{t.close}</button>
      </div>
    </div>
  );
}
