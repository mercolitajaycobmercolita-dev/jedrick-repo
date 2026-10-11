const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const sessionStorageKey = 'jedrick-portfolio:supabase-session'
const bucket = 'portfolio-media'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

function requireConfig() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.')
  }
}

function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(sessionStorageKey) || 'null')
  } catch {
    return null
  }
}

function saveSession(session) {
  if (session) window.localStorage.setItem(sessionStorageKey, JSON.stringify(session))
  else window.localStorage.removeItem(sessionStorageKey)
}

async function authRequest(path, options = {}) {
  requireConfig()
  const response = await fetch(`${supabaseUrl}/auth/v1${path}`, {
    ...options,
    headers: { apikey: supabaseKey, 'Content-Type': 'application/json', ...options.headers },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.msg || body.message || body.error_description || 'Supabase authentication failed.')
  return body
}

export async function signInWithPassword(email, password) {
  const session = await authRequest('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  saveSession(session)
  return session
}

export async function signOut() {
  const session = readSession()
  try {
    if (session?.access_token) {
      await authRequest('/logout', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } })
    }
  } catch {
    // Clear the local refresh token even if the remote session already expired.
  } finally {
    saveSession(null)
  }
}

export async function getSession() {
  const session = readSession()
  if (!session?.access_token) return null
  const expiresAt = session.expires_at || (Date.now() / 1000 + (session.expires_in || 0))
  if (expiresAt && expiresAt < Date.now() / 1000 + 30 && session.refresh_token) {
    const refreshed = await authRequest('/token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    })
    saveSession(refreshed)
    return refreshed
  }
  return session
}

async function apiRequest(path, { method = 'GET', body, headers = {}, token } = {}) {
  requireConfig()
  const session = token ? null : await getSession()
  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers: {
      apikey: supabaseKey,
      ...(session?.access_token || token ? { Authorization: `Bearer ${token || session.access_token}` } : {}),
      ...(body instanceof FormData ? {} : body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: body instanceof FormData ? body : JSON.stringify(body) }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || error.msg || error.error_description || `Supabase request failed (${response.status}).`)
  }
  if (response.status === 204) return null
  return response.json().catch(() => null)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.access_token) return null
  return authRequest('/user', { headers: { Authorization: `Bearer ${session.access_token}` } })
}

export async function isPortfolioAdmin() {
  const result = await apiRequest('/rest/v1/rpc/is_portfolio_admin', { method: 'POST', body: {} })
  return result === true
}

export async function listPublicContent(table) {
  const query = new URLSearchParams({ select: '*', is_published: 'eq.true', order: 'display_order.asc,created_at.desc' })
  return apiRequest(`/rest/v1/${table}?${query}`)
}

export async function listAdminContent(table) {
  return apiRequest(`/rest/v1/${table}?select=*&order=display_order.asc,created_at.desc`)
}

export async function saveContent(table, record) {
  const isEdit = Boolean(record.id)
  const query = isEdit ? `?id=eq.${encodeURIComponent(record.id)}` : ''
  const result = await apiRequest(`/rest/v1/${table}${query}`, {
    method: isEdit ? 'PATCH' : 'POST',
    body: record,
    headers: { Prefer: 'return=representation' },
  })
  return Array.isArray(result) ? result[0] : result
}

export async function deleteContent(table, id) {
  return apiRequest(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function uploadPortfolioImage(file, folder = 'projects') {
  requireConfig()
  const session = await getSession()
  if (!session?.access_token) throw new Error('Please sign in again before uploading an image.')
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: file,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Could not upload the image to Supabase Storage.')
  }
  return path
}

export function publicImageUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/')) return path
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`
}

export async function deletePortfolioImage(path) {
  if (!path || path.startsWith('/') || /^https?:\/\//i.test(path)) return
  await apiRequest(`/storage/v1/object/${bucket}`, {
    method: 'DELETE',
    body: { prefixes: [path] },
  })
}
