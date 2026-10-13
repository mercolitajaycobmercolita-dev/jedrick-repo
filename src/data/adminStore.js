import { useEffect, useState } from 'react'
import {
  deleteContent,
  deletePortfolioImage,
  isSupabaseConfigured,
  listAdminContent,
  listPublicContent,
  publicImageUrl,
  saveContent,
  uploadPortfolioImage,
} from '../lib/supabase.js'

export const ADMIN_PROJECTS_KEY = 'projects'
export const ADMIN_CERTIFICATES_KEY = 'certificates'
export const ADMIN_EQUIPMENT_KEY = 'equipment'

function safeExternalUrl(value) {
  if (!value) return null
  const parsed = new URL(value)
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Links must start with http:// or https://.')
  return parsed.href
}

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    status: row.status,
    description: row.description,
    role: row.role,
    technologies: row.technologies || [],
    githubUrl: row.github_url,
    liveUrl: row.live_url,
    image: publicImageUrl(row.image_path),
    imagePath: row.image_path,
    imageAlt: row.image_alt || `${row.title} preview`,
    isPublished: row.is_published,
    displayOrder: row.display_order,
  }
}

function mapCertificate(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    issuer: row.issuer,
    earnedAt: row.earned_at,
    verificationUrl: row.verification_url,
    image: publicImageUrl(row.image_path),
    imagePath: row.image_path,
    isPublished: row.is_published,
    displayOrder: row.display_order,
  }
}

function mapEquipment(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    summary: row.summary,
    purpose: row.purpose,
    image: row.image_path ? publicImageUrl(row.image_path) : row.image_url,
    imagePath: row.image_path,
    isPublished: row.is_published,
    displayOrder: row.display_order,
  }
}

export async function fetchProjects({ admin = false } = {}) {
  const rows = admin ? await listAdminContent(ADMIN_PROJECTS_KEY) : await listPublicContent(ADMIN_PROJECTS_KEY)
  return rows.map(mapProject)
}

export async function fetchCertificates({ admin = false } = {}) {
  const rows = admin ? await listAdminContent(ADMIN_CERTIFICATES_KEY) : await listPublicContent(ADMIN_CERTIFICATES_KEY)
  return rows.map(mapCertificate)
}

export async function fetchEquipment({ admin = false } = {}) {
  const rows = admin ? await listAdminContent(ADMIN_EQUIPMENT_KEY) : await listPublicContent(ADMIN_EQUIPMENT_KEY)
  return rows.map(mapEquipment)
}

export async function storeProject(values, file, existingPath = null) {
  const imagePath = file ? await uploadPortfolioImage(file, 'projects') : existingPath
  const row = {
    ...(values.id ? { id: values.id } : {}),
    title: values.title,
    category: values.category || 'Personal project',
    status: values.status || 'Published',
    description: values.description,
    role: values.role || 'Developer',
    technologies: values.technologies,
    github_url: safeExternalUrl(values.githubUrl),
    live_url: safeExternalUrl(values.liveUrl),
    image_path: imagePath,
    image_alt: values.imageAlt || `${values.title} project image`,
    display_order: Number(values.displayOrder) || 0,
    is_published: Boolean(values.isPublished),
  }
  const saved = await saveContent(ADMIN_PROJECTS_KEY, row)
  if (file && existingPath && existingPath !== imagePath) {
    await deletePortfolioImage(existingPath).catch(() => {})
  }
  return mapProject(saved)
}

export async function storeCertificate(values, file, existingPath = null) {
  const imagePath = file ? await uploadPortfolioImage(file, 'certificates') : existingPath
  if (!imagePath) throw new Error('Choose a certificate image.')
  const row = {
    ...(values.id ? { id: values.id } : {}),
    title: values.title,
    description: values.description,
    issuer: values.issuer || null,
    earned_at: values.earnedAt || null,
    verification_url: safeExternalUrl(values.verificationUrl),
    image_path: imagePath,
    display_order: Number(values.displayOrder) || 0,
    is_published: Boolean(values.isPublished),
  }
  const saved = await saveContent(ADMIN_CERTIFICATES_KEY, row)
  if (file && existingPath && existingPath !== imagePath) {
    await deletePortfolioImage(existingPath).catch(() => {})
  }
  return mapCertificate(saved)
}

export async function storeEquipment(values, file, existingPath = null, existingImage = null) {
  const imagePath = file ? await uploadPortfolioImage(file, 'equipment') : existingPath
  if (!imagePath && !existingImage) throw new Error('Choose an equipment image.')
  const row = {
    ...(values.id ? { id: values.id } : {}),
    title: values.title,
    category: values.category || 'Equipment',
    summary: values.summary,
    purpose: values.purpose || null,
    image_path: imagePath,
    image_url: imagePath ? null : existingImage,
    display_order: Number(values.displayOrder) || 0,
    is_published: Boolean(values.isPublished),
  }
  const saved = await saveContent(ADMIN_EQUIPMENT_KEY, row)
  if (file && existingPath && existingPath !== imagePath) {
    await deletePortfolioImage(existingPath).catch(() => {})
  }
  return mapEquipment(saved)
}

export async function removeContent(table, item) {
  await deleteContent(table, item.id)
  if (item.imagePath) await deletePortfolioImage(item.imagePath).catch(() => {})
}

export function usePortfolioContent(table, fallback = []) {
  const [items, setItems] = useState(() => isSupabaseConfigured ? [] : fallback)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    if (!isSupabaseConfigured) {
      setItems(fallback)
      setLoading(false)
      return undefined
    }
    setLoading(true)
    const load = table === ADMIN_PROJECTS_KEY
      ? fetchProjects
      : table === ADMIN_CERTIFICATES_KEY
        ? fetchCertificates
        : fetchEquipment
    load().then((records) => {
      if (active) setItems(records)
    }).catch((loadError) => {
      if (active) {
        setItems([])
        setError(loadError.message)
      }
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [table])

  return { items, loading, error }
}
