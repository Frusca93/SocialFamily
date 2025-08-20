
'use client';
import { useState, useRef, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from './Avatar';
// Rimossa la logica del dropdown
import { LanguageContext } from '@/app/LanguageContext';

export default function NewPost() {
  const [content, setContent] = useState('');
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionList, setMentionList] = useState<any[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { lang } = useContext(LanguageContext);
  const { data: session } = useSession();

  const translations = {
    it: {
      placeholder: "A cosa stai pensando?",
      image: "Immagine",
      video: "Video",
      urlImage: "URL immagine (opzionale)",
      urlVideo: "URL video (opzionale)",
  uploadImage: "Carica immagine da dispositivo",
  uploadVideo: "Carica video da dispositivo",
  addMedia: "Aggiungi media",
  fromDevice: "Da dispositivo",
  takePhoto: "Scatta foto",
  publishingAs: (u: string) => `Stai pubblicando come ${u}`,
  published: "Pubblicato!",
  publish: "Pubblica"
    },
    en: {
      placeholder: "What's on your mind?",
      image: "Image",
      video: "Video",
      urlImage: "Image URL (optional)",
      urlVideo: "Video URL (optional)",
      uploadImage: "Upload image from device",
      uploadVideo: "Upload video from device",
  addMedia: "Add media",
  fromDevice: "From device",
  takePhoto: "Take photo",
  publishingAs: (u: string) => `Posting as ${u}`,
  published: "Posted!",
      publish: "Post"
    },
    fr: {
      placeholder: "À quoi penses-tu ?",
      image: "Image",
      video: "Vidéo",
      urlImage: "URL de l'image (optionnel)",
      urlVideo: "URL de la vidéo (optionnel)",
      uploadImage: "Télécharger une image",
      uploadVideo: "Télécharger une vidéo",
  addMedia: "Ajouter un média",
  fromDevice: "Depuis l'appareil",
  takePhoto: "Prendre une photo",
  publishingAs: (u: string) => `Publier en tant que ${u}`,
  published: "Publié !",
      publish: "Publier"
    },
    es: {
      placeholder: "¿En qué estás pensando?",
      image: "Imagen",
      video: "Vídeo",
      urlImage: "URL de imagen (opcional)",
      urlVideo: "URL de vídeo (opcional)",
      uploadImage: "Subir imagen desde el dispositivo",
      uploadVideo: "Subir vídeo desde el dispositivo",
  addMedia: "Añadir medio",
  fromDevice: "Desde el dispositivo",
  takePhoto: "Tomar foto",
  publishingAs: (u: string) => `Publicando como ${u}`,
  published: "¡Publicado!",
      publish: "Publicar"
    }
  };
  const t = translations[lang] || translations.it;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
  if (file) {
      // Leggi il file come base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, mediaType, fileBase64: base64 })
        });
        setLoading(false);
        if (res.ok) {
      setContent(''); setFile(null); setFilePreview(null);
      setPosted(true);
      setTimeout(() => { window.location.reload(); }, 800);
        }
      };
      reader.readAsDataURL(file);
      return;
    }
    // fallback: nessun file, solo testo
  const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, mediaType })
    });
    setLoading(false);
    if (res.ok) {
      setContent('');
      setPosted(true);
      setTimeout(() => { window.location.reload(); }, 800);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setFilePreview(null);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-white p-3 sm:p-4 flex flex-col gap-3">
      {posted && (
        <div className="rounded-xl bg-green-50 text-green-700 text-sm px-3 py-2 border border-green-100">
          {t.published}
        </div>
      )}

      <div className="flex items-start gap-3">
        <Avatar src={session?.user?.image as string | undefined} alt={session?.user?.name || 'avatar'} />
        <div className="flex-1">
          {session?.user?.name && (
            <div className="text-xs text-gray-500 mb-1">{t.publishingAs(session.user.name)}</div>
          )}
          <div className="relative">
          <textarea
            value={content}
            onChange={e=>{
              const val = e.target.value;
              setContent(val);
              const caret = e.target.selectionStart || val.length;
              // Trova l'ultima @ aperta senza spazio
              const upToCaret = val.slice(0, caret);
              const match = upToCaret.match(/(^|\s)@([a-zA-Z0-9_]{0,20})$/);
              if (match) {
                setMentionQuery(match[2] || '');
                setMentionOpen(true);
              } else {
                setMentionOpen(false);
                setMentionQuery('');
              }
            }}
            placeholder={t.placeholder}
            className="w-full resize-y min-h-24 rounded-2xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {mentionOpen && (
            <MentionSuggestions
              query={mentionQuery}
              onPick={(u)=>{
                // sostituisci l'ultimo token @...
                const val = content;
                const caret = (document.activeElement as HTMLTextAreaElement | null)?.selectionStart || val.length;
                const upToCaret = val.slice(0, caret);
                const before = upToCaret.replace(/(@[a-zA-Z0-9_]{0,20})$/, `@${u.username} `);
                const after = val.slice(caret);
                setContent(before + after);
                setMentionOpen(false);
                setMentionQuery('');
              }}
            />
          )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {/* Tabs icone per tipo media */}
          <div className="inline-flex rounded-full border bg-gray-50 p-1">
            <button
              type="button"
              aria-label={t.image}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${mediaType==='image' ? 'bg-white text-blue-700 shadow-sm border border-blue-200' : 'text-gray-600 hover:text-black'}`}
              onClick={() => { setMediaType('image'); setFile(null); setFilePreview(null); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M8 13l2-2 3 3 2-2 4 4" />
                <circle cx="8" cy="9" r="1.5" />
              </svg>
              <span className="hidden sm:inline">{t.image}</span>
            </button>
            <button
              type="button"
              aria-label={t.video}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${mediaType==='video' ? 'bg-white text-blue-700 shadow-sm border border-blue-200' : 'text-gray-600 hover:text-black'}`}
              onClick={() => { setMediaType('video'); setFile(null); setFilePreview(null); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M10 9l5 3-5 3V9z" />
              </svg>
              <span className="hidden sm:inline">{t.video}</span>
            </button>
          </div>

          {/* Add media split/menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMediaMenu(v=>!v)}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t.addMedia}
            </button>
            {showMediaMenu && (
              <div className="absolute z-10 bottom-full right-0 mb-2 w-44 rounded-xl border bg-white shadow">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => { setShowMediaMenu(false); fileInputRef.current?.click(); }}
                >
                  {t.fromDevice}
                </button>
                {mediaType === 'image' && (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => { setShowMediaMenu(false); cameraInputRef.current?.click(); }}
                  >
                    {t.takePhoto}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="hidden sm:block ml-auto" />
          <button
            disabled={loading || !content}
            className="ml-auto rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
          >
            {t.publish}
          </button>
        </div>

  <div className="flex flex-col gap-2">

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === 'image' ? 'image/*' : 'video/*'}
            className="hidden"
            onChange={handleFileChange}
          />
          {mediaType === 'image' && (
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          )}

          {filePreview && (
            mediaType === 'image' ? (
              <img src={filePreview} alt="preview" className="mt-1 max-h-60 rounded-xl border object-contain" />
            ) : (
              <video src={filePreview} controls className="mt-1 max-h-60 rounded-xl border object-contain" />
            )
          )}
          {/* rimosso duplicato del pulsante Pubblica su mobile */}
        </div>
      </div>
    </form>
  );
}

function MentionSuggestions({ query, onPick }: { query: string; onPick: (u: any) => void }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const res = await fetch('/api/friends?q=' + encodeURIComponent(query || ''));
        const users = await res.json().catch(() => []);
        if (!active) return;
        setItems(users);
      } catch {
        setItems([]);
      }
    };
    run();
    return () => { active = false };
  }, [query]);
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="absolute left-2 right-2 -bottom-2 translate-y-full sm:translate-y-0 sm:top-full sm:left-0 sm:right-auto sm:min-w-[14rem] z-20 rounded-xl border bg-white shadow">
      <ul className="max-h-56 overflow-auto py-1">
        {items.map(u => (
          <li key={u.id}>
            <button
              type="button"
              onClick={() => onPick(u)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left"
            >
              {u.image ? (
                <img src={u.image} alt={u.username} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="h-6 w-6 rounded-full bg-gray-200 inline-block" />
              )}
              <span className="font-medium">{u.name || u.username}</span>
              <span className="text-gray-500">@{u.username}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

