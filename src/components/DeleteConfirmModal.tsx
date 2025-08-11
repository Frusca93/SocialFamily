
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

export default function DeleteConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-xl min-w-[300px] relative">
        <button onClick={onCancel} className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800">×</button>
        <h2 className="text-lg font-semibold mb-4">{t.title}</h2>
        <p className="mb-4">{t.message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="rounded-xl border px-4 py-2">{t.cancel}</button>
          <button onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2 text-white font-semibold">{t.confirm}</button>
        </div>
      </div>
    </div>
  )
}
