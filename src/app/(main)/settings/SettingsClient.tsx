"use client";
import { useState, useRef, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LanguageContext } from '@/app/LanguageContext';

const LANGS = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

const translations = {
  it: {
    title: "Impostazioni profilo",
    username: "Username",
    language: "Lingua",
    bio: "Bio",
    bioPlaceholder: "(opzionale)",
    image: "Immagine profilo",
    imagePlaceholder: "URL immagine (opzionale)",
    upload: "Carica file",
    save: "Salva le modifiche",
    saved: "Impostazioni salvate!",
    error: "Errore nel salvataggio delle impostazioni",
    errorImage: "Errore nel caricamento dell'immagine",
    errorUsername: "Username già in uso",
  },
  en: {
    title: "Profile settings",
    username: "Username",
    language: "Language",
    bio: "Bio",
    bioPlaceholder: "(optional)",
    image: "Profile image",
    imagePlaceholder: "Image URL (optional)",
    upload: "Upload file",
    save: "Save changes",
    saved: "Settings saved!",
    error: "Error saving settings",
    errorImage: "Error uploading image",
    errorUsername: "Username already in use",
  },
  fr: {
    title: "Paramètres du profil",
    username: "Nom d'utilisateur",
    language: "Langue",
    bio: "Bio",
    bioPlaceholder: "(optionnel)",
    image: "Image de profil",
    imagePlaceholder: "URL de l'image (optionnel)",
    upload: "Télécharger un fichier",
    save: "Enregistrer les modifications",
    saved: "Paramètres enregistrés !",
    error: "Erreur lors de l'enregistrement des paramètres",
    errorImage: "Erreur lors du téléchargement de l'image",
    errorUsername: "Nom d'utilisateur déjà utilisé",
  },
  es: {
    title: "Configuración de perfil",
    username: "Nombre de usuario",
    language: "Idioma",
    bio: "Bio",
    bioPlaceholder: "(opcional)",
    image: "Imagen de perfil",
    imagePlaceholder: "URL de la imagen (opcional)",
    upload: "Subir archivo",
    save: "Guardar cambios",
    saved: "¡Configuración guardada!",
    error: "Error al guardar la configuración",
    errorImage: "Error al subir la imagen",
    errorUsername: "Nombre de usuario ya en uso",
  },
};

export default function SettingsClient({ user, onSave }: any) {
  const { update } = useSession();
  const router = useRouter();
  const { lang, setLang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [language, setLanguage] = useState(user?.language ?? "it");
  useEffect(() => {
    if (user?.language && user.language !== language) {
      setLanguage(user.language);
    }
  }, [user?.language]);
  const [image, setImage] = useState(user?.image ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let imageUrl = image;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        imageUrl = data.image;
        setImage(imageUrl);
      } else {
        setError(t.errorImage);
        setLoading(false);
        return;
      }
    }
    const usernameToSend = username || user?.username || "";
    const prevUsername = user?.username;
    const res = await fetch("/api/profile/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameToSend, bio, language })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      if (err?.error && err.error.toLowerCase().includes('unique')) {
        setError(t.errorUsername);
      } else {
        setError(t.error);
      }
      setLoading(false);
      return;
    }
    if (!file && image) {
      await fetch("/api/profile/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image })
      });
    }
    setSuccess(true);
    setLoading(false);
    setLang(language);
    if (update) await update();
    if (usernameToSend && prevUsername && usernameToSend !== prevUsername) {
      router.replace(`/profile/${usernameToSend}`);
    }
    if (onSave) onSave();
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
  <form onSubmit={handleSave} className="max-w-lg mx-auto rounded-2xl border bg-white p-6 flex flex-col gap-4">
      <label className="font-semibold">{t.username}</label>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="rounded-xl border px-3 py-2"
        minLength={0}
        autoComplete="username"
        placeholder={user?.username || t.username}
      />
      <label className="font-semibold">{t.language}</label>
      <select value={language} onChange={e=>setLanguage(e.target.value)} className="rounded-xl border px-3 py-2">
        {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
      <label className="font-semibold">{t.bio}</label>
      <textarea value={bio} onChange={e=>setBio(e.target.value)} className="rounded-xl border px-3 py-2" rows={3} maxLength={200} placeholder={t.bioPlaceholder} />
      <label className="font-semibold">{t.image}</label>
      <div className="flex gap-2 items-center">
        <input value={file ? '' : image} onChange={e=>{ setImage(e.target.value); setFile(null); setFilePreview(null) }} placeholder={t.imagePlaceholder} className="rounded-xl border px-3 py-2 flex-1" />
        <button type="button" className="rounded-xl border bg-blue-100 px-3 py-2 text-blue-700" onClick={()=>fileInputRef.current?.click()}>{t.upload}</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      {(filePreview || image) && (
        <img src={filePreview || image} alt="preview" className="mt-2 max-h-32 rounded-xl border object-contain" />
      )}
  <button disabled={loading} className="mt-4 rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{t.save}</button>
      {success && <div className="text-green-600 font-semibold">{t.saved}</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </form>
  );
}
