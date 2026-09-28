/*
  ─────────────────────────────────────────────────────────────
  WIT ROSTER. This is the only file you edit to update the team.
  ─────────────────────────────────────────────────────────────

  One row per person. The filters on /integrantes build themselves from this:
  - a new `generation` value adds a new year chip automatically
  - the newest generation is selected by default

  Fields
    name        Full name.
    generation  e.g. '2026-2027'.
    role        'presidencia' | 'vicepresidencia' | 'director' | 'coordinador'
    area        Required for directors and coordinators. See AREAS below.
    title       Optional. Overrides the auto label (e.g. 'Directora de Software').
    photo       Optional. Put the image in /public/team and write '/team/nombre.jpg'.
                Without a photo the card shows the person's celestial icon.
    bio         Optional. 2-3 lines the member writes herself: where she works
                or studies now, what she does, what she took from WIT. Keep it
                under ~280 characters. Without a bio the card's
                "¿Dónde está hoy?" button renders in its muted state.
    linkedin    Optional. Full URL. Shows a LinkedIn link on the back.
*/

export const AREAS = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finanzas', label: 'Finanzas' },
  { id: 'responsabilidad-social', label: 'Responsabilidad Social' },
  { id: 'vinculacion', label: 'Vinculación' },
  { id: 'software', label: 'Software' },
] as const

export type AreaId = (typeof AREAS)[number]['id']
export type Role = 'presidencia' | 'vicepresidencia' | 'director' | 'coordinador'

export type Member = {
  name: string
  generation: string
  role: Role
  area?: AreaId
  title?: string
  photo?: string
  bio?: string
  linkedin?: string
}

export const MEMBERS: Member[] = [
  // ── 2026-2027 ─────────────────────────────────────────────
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'presidencia' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'vicepresidencia' },

  { name: 'Nombre Apellido', generation: '2026-2027', role: 'director', area: 'proyectos' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'proyectos' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'proyectos' },

  { name: 'Nombre Apellido', generation: '2026-2027', role: 'director', area: 'marketing' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'marketing' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'marketing' },

  { name: 'Nombre Apellido', generation: '2026-2027', role: 'director', area: 'finanzas' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'finanzas' },

  { name: 'Nombre Apellido', generation: '2026-2027', role: 'director', area: 'responsabilidad-social' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social' },

  { name: 'Nombre Apellido', generation: '2026-2027', role: 'director', area: 'vinculacion' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'vinculacion' },

  { name: 'Nombre Apellido', generation: '2026-2027', role: 'director', area: 'software' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'software' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'software' },
  { name: 'Nombre Apellido', generation: '2026-2027', role: 'coordinador', area: 'software' },

  // ── 2025-2026 ─────────────────────────────────────────────
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'presidencia' },
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'vicepresidencia' },

  { name: 'Nombre Apellido', generation: '2025-2026', role: 'director', area: 'proyectos' },
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'coordinador', area: 'proyectos' },

  { name: 'Nombre Apellido', generation: '2025-2026', role: 'director', area: 'marketing' },
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'coordinador', area: 'marketing' },

  { name: 'Nombre Apellido', generation: '2025-2026', role: 'director', area: 'finanzas' },
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'coordinador', area: 'finanzas' },

  { name: 'Nombre Apellido', generation: '2025-2026', role: 'director', area: 'responsabilidad-social' },
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'coordinador', area: 'responsabilidad-social' },

  { name: 'Nombre Apellido', generation: '2025-2026', role: 'director', area: 'vinculacion' },
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'coordinador', area: 'vinculacion' },

  { name: 'Nombre Apellido', generation: '2025-2026', role: 'director', area: 'software' },
  { name: 'Nombre Apellido', generation: '2025-2026', role: 'coordinador', area: 'software' },
]

// ── Helpers (no need to edit below) ────────────────────────

export const GENERATIONS: string[] = [...new Set(MEMBERS.map((m) => m.generation))].sort().reverse()

export function areaLabel(id?: AreaId): string {
  return AREAS.find((a) => a.id === id)?.label ?? ''
}

export function roleLabel(m: Member): string {
  if (m.title) return m.title
  switch (m.role) {
    case 'presidencia':
      return 'Presidenta'
    case 'vicepresidencia':
      return 'Vicepresidenta'
    case 'director':
      return `Directora de ${areaLabel(m.area)}`
    case 'coordinador':
      return `Coordinadora de ${areaLabel(m.area)}`
  }
}
