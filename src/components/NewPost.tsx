
'use client';
import { useState, useRef, useContext } from 'react';
import { LanguageContext } from '@/app/LanguageContext';

export default function NewPost() {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { lang } = useContext(LanguageContext);

  const translations = {
    it: {
      placeholder: "A cosa stai pensando?",
      image: "Immagine",
      video: "Video",
      urlImage: "URL immagine (opzionale)",
      urlVideo: "URL video (opzionale)",
      uploadImage: "Carica immagine da dispositivo",
      uploadVideo: "Carica video da dispositivo",
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
          setContent(''); setMediaUrl(''); setFile(null); setFilePreview(null);
          window.location.reload();
        }
      };
      reader.readAsDataURL(file);
      return;
    }
    // fallback: solo URL
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, mediaUrl, mediaType })
    });
    setLoading(false);
    if (res.ok) {
      setContent(''); setMediaUrl('');
      window.location.reload();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
      setMediaUrl('');
    } else {
      setFile(null);
      setFilePreview(null);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-white p-4 flex flex-col gap-2">
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder={t.placeholder} className="w-full resize-none rounded-xl border p-3" />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className={`rounded-xl border px-3 py-2 font-semibold ${mediaType==='image' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
          onClick={() => { setMediaType('image'); setFile(null); setFilePreview(null); setMediaUrl('') }}
        >
          {t.image}
        </button>
        <button
          type="button"
          className={`rounded-xl border px-3 py-2 font-semibold ${mediaType==='video' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
          onClick={() => { setMediaType('video'); setFile(null); setFilePreview(null); setMediaUrl('') }}
        >
          {t.video}
        </button>
      </div>
      <input
        value={mediaUrl}
        onChange={e => { setMediaUrl(e.target.value); setFile(null); setFilePreview(null) }}
        placeholder={mediaType === 'image' ? t.urlImage : t.urlVideo}
        className="rounded-xl border px-3 py-2 mt-2"
      />
      <div className="flex flex-col gap-2 mt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={mediaType === 'image' ? 'image/*' : 'video/*'}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="rounded-xl border bg-blue-100 px-3 py-2 text-blue-700 w-fit"
          onClick={() => fileInputRef.current?.click()}
        >
          {mediaType === 'image' ? t.uploadImage : t.uploadVideo}
        </button>
        {filePreview && (
          mediaType === 'image' ? (
            <img src={filePreview} alt="preview" className="mt-2 max-h-48 rounded-xl border object-contain" />
          ) : (
            <video src={filePreview} controls className="mt-2 max-h-48 rounded-xl border object-contain" />
          )
        )}
      </div>
      <div className="flex justify-start mt-4">
        <button
          disabled={loading || !content}
          className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {t.publish}
        </button>
      </div>
    </form>
  );
}

