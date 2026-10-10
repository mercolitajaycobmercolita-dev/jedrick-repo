import { useEffect, useState } from 'react'

export const ADMIN_PROJECTS_KEY = 'jedrick-portfolio:projects'
export const ADMIN_CERTIFICATES_KEY = 'jedrick-portfolio:certificates'

export function readStoredList(key) {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function writeStoredList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('portfolio-storage-change', { detail: { key } }))
}

export function useStoredList(key) {
  const [items, setItems] = useState(() => readStoredList(key))

  useEffect(() => {
    function refresh(event) {
      if (event.type === 'storage' && event.key && event.key !== key) return
      if (event.type === 'portfolio-storage-change' && event.detail?.key !== key) return
      setItems(readStoredList(key))
    }
    window.addEventListener('storage', refresh)
    window.addEventListener('portfolio-storage-change', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('portfolio-storage-change', refresh)
    }
  }, [key])

  return items
}

export function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read the selected image.'))
    reader.readAsDataURL(file)
  })
}
