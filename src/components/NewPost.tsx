
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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
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
  if (files.length > 0) {
      // Caricamento multiplo immagini: invia tutte come base64 in una singola richiesta
      const encoded = await Promise.all(files.map(async (f) => {
        const reader = new FileReader()
        const p: Promise<string> = new Promise((resolve) => { reader.onloadend = () => resolve(reader.result as string) })
        reader.readAsDataURL(f)
        return p
      }))
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mediaType, filesBase64: encoded })
      })
      setLoading(false)
      if (res.ok) {
        setContent('')
        setFiles([])
        setPreviews([])
        setPosted(true)
        setTimeout(() => { window.location.reload() }, 800)
      }
      return
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
    const list = Array.from(e.target.files || [])
    if (!list.length) return
    if (mediaType === 'image') {
      const imgs = list.filter(f => f.type.startsWith('image/'))
      const nextFiles = [...files, ...imgs]
      const nextPreviews = [...previews, ...imgs.map(f => URL.createObjectURL(f))]
      setFiles(nextFiles)
      setPreviews(nextPreviews)
    } else {
      const v = list.find(f => f.type.startsWith('video/'))
      if (v) {
        setFiles([v])
        setPreviews([URL.createObjectURL(v)])
      }
    }
    // resetta l'input per poter ri-caricare gli stessi file
    e.currentTarget.value = ''
  }

  function removePreview(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
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
              const match = upToCaret.match(/@([a-zA-Z0-9_]{0,20})$/);
              if (match) {
                setMentionQuery(match[2] || '');
                setMentionOpen(true);
              } else {
                setMentionOpen(false);
                setMentionQuery('');
              }
            }}
            placeholder={t.placeholder}
            className="w-full resize-y min-h-24 rounded-2xl border px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              onClick={() => { setMediaType('image'); setFiles([]); setPreviews([]); }}
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
              onClick={() => { setMediaType('video'); setFiles([]); setPreviews([]); }}
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
            multiple={mediaType === 'image'}
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

          {previews.length > 0 && mediaType === 'image' && (
            <div className="mt-1 flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt={`preview-${i}`} className="h-24 w-24 rounded-lg border object-cover" />
                  <button type="button" onClick={() => removePreview(i)} aria-label="Rimuovi immagine" className="absolute -top-2 -right-2 rounded-full bg-white border text-purple-600 hover:bg-purple-50 p-1 shadow">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {previews.length > 0 && mediaType === 'video' && (
            <video src={previews[0]} controls className="mt-1 max-h-60 rounded-xl border object-contain" />
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
    const res = await fetch('/api/friends?q=' + encodeURIComponent(query || ''), { cache: 'no-store' });
        let users = await res.json().catch(() => []);
        if ((!Array.isArray(users) || users.length === 0) && (query || '').length >= 2) {
          // fallback globale se non ci sono amici che matchano
          const r2 = await fetch('/api/search?q=' + encodeURIComponent(query), { cache: 'no-store' });
          const j2 = await r2.json().catch(() => ({ users: [] }));
          users = j2.users || [];
        }
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
    <div className="absolute left-2 right-2 bottom-full mb-2 sm:top-full sm:bottom-auto sm:mb-0 sm:left-0 sm:right-auto sm:min-w-[14rem] z-50 rounded-xl border bg-white shadow">
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

