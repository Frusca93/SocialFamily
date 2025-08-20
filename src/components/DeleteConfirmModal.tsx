
"use client"
import React, { useContext } from "react"
import { LanguageContext } from '@/app/LanguageContext'

const translations = {
  it: {
    title: "Conferma eliminazione",
    message: "Sei sicuro di voler eliminare questo post?",
    cancel: "Annulla",
    confirm: "Elimina"
  },
  en: {
    title: "Confirm deletion",
    message: "Are you sure you want to delete this post?",
    cancel: "Cancel",
    confirm: "Delete"
  },
  fr: {
    title: "Confirmer la suppression",
    message: "Êtes-vous sûr de vouloir supprimer ce post ?",
    cancel: "Annuler",
    confirm: "Supprimer"
  },
  es: {
    title: "Confirmar eliminación",
    message: "¿Seguro que quieres eliminar esta publicación?",
    cancel: "Cancelar",
    confirm: "Eliminar"
  }
}

export default function DeleteConfirmModal({ onConfirm, onCancel, loading = false, error }: { onConfirm: () => void, onCancel: () => void, loading?: boolean, error?: string }) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-xl min-w-[300px] relative">
  <button type="button" onClick={onCancel} className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800">×</button>
        <h2 className="text-lg font-semibold mb-4">{t.title}</h2>
        <p className="mb-4">{t.message}</p>
        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="rounded-xl border px-4 py-2">{t.cancel}</button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2 text-white font-semibold ${loading ? 'bg-red-400 opacity-60 cursor-not-allowed' : 'bg-red-600'}`}
          >
            {loading ? t.confirm + '…' : t.confirm}
          </button>
        </div>
      </div>
    </div>
  )
}
