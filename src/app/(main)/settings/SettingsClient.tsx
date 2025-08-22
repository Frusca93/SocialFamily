"use client";
import { useState, useRef, useContext, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LanguageContext } from '@/app/LanguageContext';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

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
    upload: "Carica file",
    save: "Salva le modifiche",
    saved: "Impostazioni salvate!",
    error: "Errore nel salvataggio delle impostazioni",
    errorImage: "Errore nel caricamento dell'immagine",
    errorUsername: "Username già in uso",
  deleteAccount: "Elimina il mio account",
  deleteTitle: "Conferma eliminazione account",
  deleteMessage: "Sei sicuro di voler eliminare definitivamente il tuo account? Questa azione è irreversibile e rimuoverà tutti i tuoi dati (post, commenti, like, messaggi, notifiche, ecc.).",
  deleteConfirm: "Elimina account"
  },
  en: {
    title: "Profile settings",
    username: "Username",
    language: "Language",
    bio: "Bio",
    bioPlaceholder: "(optional)",
  image: "Profile image",
    upload: "Upload file",
    save: "Save changes",
    saved: "Settings saved!",
    error: "Error saving settings",
    errorImage: "Error uploading image",
    errorUsername: "Username already in use",
  deleteAccount: "Delete my account",
  deleteTitle: "Confirm account deletion",
  deleteMessage: "Are you sure you want to permanently delete your account? This action is irreversible and will remove all your data (posts, comments, likes, messages, notifications, etc.).",
  deleteConfirm: "Delete account"
  },
  fr: {
    title: "Paramètres du profil",
    username: "Nom d'utilisateur",
    language: "Langue",
    bio: "Bio",
    bioPlaceholder: "(optionnel)",
  image: "Image de profil",
    upload: "Télécharger un fichier",
    save: "Enregistrer les modifications",
    saved: "Paramètres enregistrés !",
    error: "Erreur lors de l'enregistrement des paramètres",
    errorImage: "Erreur lors du téléchargement de l'image",
    errorUsername: "Nom d'utilisateur déjà utilisé",
  deleteAccount: "Supprimer mon compte",
  deleteTitle: "Confirmer la suppression du compte",
  deleteMessage: "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et supprimera toutes vos données (posts, commentaires, likes, messages, notifications, etc.).",
  deleteConfirm: "Supprimer le compte"
  },
  es: {
    title: "Configuración de perfil",
    username: "Nombre de usuario",
    language: "Idioma",
    bio: "Bio",
    bioPlaceholder: "(opcional)",
  image: "Imagen de perfil",
    upload: "Subir archivo",
    save: "Guardar cambios",
    saved: "¡Configuración guardada!",
    error: "Error al guardar la configuración",
    errorImage: "Error al subir la imagen",
    errorUsername: "Nombre de usuario ya en uso",
  deleteAccount: "Eliminar mi cuenta",
  deleteTitle: "Confirmar eliminación de cuenta",
  deleteMessage: "¿Seguro que quieres eliminar permanentemente tu cuenta? Esta acción es irreversible y eliminará todos tus datos (publicaciones, comentarios, me gusta, mensajes, notificaciones, etc.).",
  deleteConfirm: "Eliminar cuenta"
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
  // No URL input anymore: image is updated only via avatar upload.
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
      <div className="flex flex-col items-center gap-3">
        {(filePreview || image) && (
          <img
            src={filePreview || image}
            alt="preview"
            className="mt-1 h-32 w-32 rounded-full border object-cover"
          />
        )}
        <button
          type="button"
          className="rounded-xl border bg-blue-100 px-4 py-2 text-blue-700"
          onClick={()=>fileInputRef.current?.click()}
        >
          {t.upload}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <button disabled={loading} className="mt-4 rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{t.save}</button>
      <button
        type="button"
        onClick={()=>{ setDeleteError(null); setShowDeleteModal(true); }}
        className="mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 hover:bg-red-100"
      >
        {t.deleteAccount}
      </button>
      {success && <div className="text-green-600 font-semibold">{t.saved}</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {showDeleteModal && (
        <DeleteConfirmModal
          onCancel={()=>{ if (!deleting) setShowDeleteModal(false); }}
          onConfirm={async ()=>{
            setDeleting(true);
            setDeleteError(null);
            try {
              const res = await fetch('/api/profile/delete', { method: 'POST' });
              if (!res.ok) {
                const j = await res.json().catch(()=>null);
                throw new Error(j?.error || 'Delete failed');
              }
              // Redirect to login after sign out
              await signOut({ callbackUrl: '/login' });
            } catch (err: any) {
              setDeleteError(err?.message || 'Errore eliminazione');
              setDeleting(false);
            }
          }}
          loading={deleting}
          error={deleteError || undefined}
          title={t.deleteTitle}
          message={t.deleteMessage}
          confirmLabel={t.deleteConfirm}
        />
      )}
    </form>
  );
}
