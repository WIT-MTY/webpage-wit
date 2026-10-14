/*
  ─────────────────────────────────────────────────────────────
  WIT ROSTER. This is the only file you edit to update the team.
  ─────────────────────────────────────────────────────────────

  One row per person. The filters on /integrantes build themselves from this:
  - a new `generation` value adds a new year chip automatically
  - the newest generation is selected by default
  - CURRENT_GENERATION shows every role; older generations show only
    presidencia, vicepresidencia and director (coordinators are hidden)
  - a generation with no one to show never appears in the selector

  Fields
    name        Full name.
    generation  e.g. '2026-2027'.
    role        'presidencia' | 'vicepresidencia' | 'director' | 'coordinador'
    area        See AREAS below.
    title       Optional. Shown under the area (e.g. 'Directora de Software').
                Historical wording lives here, not in `area`.
    photo       Optional. Square image in /public/integrantes, written as
                '/integrantes/nombre-apellido.webp' (lowercase, no accents).
                Without a photo the card shows the person's initials.
    initials    Optional. Overrides the auto initials when the name is ambiguous.
    bio         Optional. 2-3 lines the member writes herself: where she works
                or studies now, what she does, what she took from WIT. Keep it
                under ~280 characters. Without a bio the card's
                "¿Dónde está hoy?" button renders in its muted state.
    linkedin    Optional. Full URL. Shows a LinkedIn link on the back.
*/

export const CURRENT_GENERATION = '2026-2027'

export const AREAS = [
  { id: 'presidencia', label: 'Presidencia' },
  { id: 'vicepresidencia', label: 'Vicepresidencia' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finanzas', label: 'Finanzas' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'responsabilidad-social', label: 'Responsabilidad Social' },
  { id: 'vinculacion', label: 'Vinculación' },
  { id: 'software', label: 'Software' },
  { id: 'planeacion-estrategica', label: 'Planeación Estratégica' },
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
  initials?: string
  bio?: string
  linkedin?: string
}

export const MEMBERS: Member[] = [
  // ── 2026-2027 ─────────────────────────────────────────────
  { name: 'Dana Sangines', generation: '2026-2027', role: 'presidencia', area: 'presidencia', title: 'Presidenta', photo: '/integrantes/dana-sangines.webp' },
  { name: 'Daniela Chávez', generation: '2026-2027', role: 'vicepresidencia', area: 'vicepresidencia', title: 'Vicepresidenta', photo: '/integrantes/daniela-chavez-ibarra.webp' },
  { name: 'Catalina Mendoza', generation: '2026-2027', role: 'director', area: 'marketing', title: 'Directora de Marketing' },
  { name: 'MaryGaby Castañeda', generation: '2026-2027', role: 'director', area: 'finanzas', title: 'Directora de Finanzas' },
  { name: 'Vanessa Mecott', generation: '2026-2027', role: 'director', area: 'proyectos', title: 'Directora de Proyectos', photo: '/integrantes/vanessa-mecott.webp' },
  { name: 'Regina Gutiérrez', generation: '2026-2027', role: 'director', area: 'responsabilidad-social', title: 'Directora de Responsabilidad Social', photo: '/integrantes/regina-gutierrez.webp' },
  { name: 'Antonella Apanco', generation: '2026-2027', role: 'director', area: 'vinculacion', title: 'Directora de Vinculación', photo: '/integrantes/antonella-apanco.webp' },
  { name: 'Katherine MacLean', generation: '2026-2027', role: 'director', area: 'software', title: 'Directora de Software', photo: '/integrantes/katherine-maclean.webp' },

  { name: 'Paola Micaela Vizcarra', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Zuhri Regalado', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Elena Sofía Herrera', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Luz Alejandra Saldaña', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Paulina Montserrat Mora', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Stephanie Gordillo', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Regina Valeria Rodríguez', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Ana Valeria Campos', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Marian Lombard', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },
  { name: 'Arely Sandoval', generation: '2026-2027', role: 'coordinador', area: 'proyectos', title: 'Coordinadora de Proyectos' },

  { name: 'Valeria Ruiz', generation: '2026-2027', role: 'coordinador', area: 'finanzas', title: 'Coordinadora de Finanzas' },
  { name: 'Sofia Fernandez', generation: '2026-2027', role: 'coordinador', area: 'finanzas', title: 'Coordinadora de Finanzas' },
  { name: 'Suri Valeria Tristán', generation: '2026-2027', role: 'coordinador', area: 'finanzas', title: 'Coordinadora de Finanzas' },
  { name: 'Dana Janeth Dávila', generation: '2026-2027', role: 'coordinador', area: 'finanzas', title: 'Coordinadora de Finanzas' },
  { name: 'Fatima Abigail Ochoa', generation: '2026-2027', role: 'coordinador', area: 'finanzas', title: 'Coordinadora de Finanzas' },
  { name: 'Ximena Canabal', generation: '2026-2027', role: 'coordinador', area: 'finanzas', title: 'Coordinadora de Finanzas' },
  { name: 'Dania Carolina Montes', generation: '2026-2027', role: 'coordinador', area: 'finanzas', title: 'Coordinadora de Finanzas' },

  { name: 'Valeria Meza', generation: '2026-2027', role: 'coordinador', area: 'marketing', title: 'Coordinadora de Marketing' },
  { name: 'Valentina Cordero', generation: '2026-2027', role: 'coordinador', area: 'marketing', title: 'Coordinadora de Marketing' },
  { name: 'Fabiola Treviño', generation: '2026-2027', role: 'coordinador', area: 'marketing', title: 'Coordinadora de Marketing' },
  { name: 'Greeytchell Lizárraga', generation: '2026-2027', role: 'coordinador', area: 'marketing', title: 'Coordinadora de Marketing' },
  { name: 'Galia Cueto', generation: '2026-2027', role: 'coordinador', area: 'marketing', title: 'Coordinadora de Marketing' },
  { name: 'Roberta Itzel Avila', generation: '2026-2027', role: 'coordinador', area: 'marketing', title: 'Coordinadora de Marketing' },
  { name: 'Lizbeth Marlene Molina', generation: '2026-2027', role: 'coordinador', area: 'marketing', title: 'Coordinadora de Marketing' },

  { name: 'Dorian Daniela González', generation: '2026-2027', role: 'coordinador', area: 'software', title: 'Coordinadora de Software' },
  { name: 'Kena Sofía Lira', generation: '2026-2027', role: 'coordinador', area: 'software', title: 'Coordinadora de Software' },
  { name: 'Sophia Alexandra Ramos', generation: '2026-2027', role: 'coordinador', area: 'software', title: 'Coordinadora de Software' },
  { name: 'Regina Elizabeth Flores', generation: '2026-2027', role: 'coordinador', area: 'software', title: 'Coordinadora de Software' },
  { name: 'Ana Camila Tamez', generation: '2026-2027', role: 'coordinador', area: 'software', title: 'Coordinadora de Software' },

  { name: 'Yoana Montoya', generation: '2026-2027', role: 'coordinador', area: 'vinculacion', title: 'Coordinadora de Vinculación' },
  { name: 'Violeta Natalia Cuellar', generation: '2026-2027', role: 'coordinador', area: 'vinculacion', title: 'Coordinadora de Vinculación' },
  { name: 'Regina Ramírez', generation: '2026-2027', role: 'coordinador', area: 'vinculacion', title: 'Coordinadora de Vinculación' },
  { name: 'Sofia Danae Acevedo', generation: '2026-2027', role: 'coordinador', area: 'vinculacion', title: 'Coordinadora de Vinculación' },
  { name: 'Denisse Natzuky Quintanilla', generation: '2026-2027', role: 'coordinador', area: 'vinculacion', title: 'Coordinadora de Vinculación' },

  { name: 'Angela Monserrat Hernandez', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social', title: 'Coordinadora de Responsabilidad Social' },
  { name: 'Sylvie Aylin Zabetoglu', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social', title: 'Coordinadora de Responsabilidad Social' },
  { name: 'Camila Sofia Aguasvivas', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social', title: 'Coordinadora de Responsabilidad Social' },
  { name: 'Fernanda De los Santos', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social', title: 'Coordinadora de Responsabilidad Social' },
  { name: 'Nataly Hernández', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social', title: 'Coordinadora de Responsabilidad Social' },
  { name: 'Paloma Itzel Macias', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social', title: 'Coordinadora de Responsabilidad Social' },
  { name: 'Noemi De los Santos', generation: '2026-2027', role: 'coordinador', area: 'responsabilidad-social', title: 'Project Manager' },

  // ── 2025-2026 ─────────────────────────────────────────────
  { name: 'Mia Nicole Arámbula Barraza', generation: '2025-2026', role: 'presidencia', area: 'presidencia', title: 'Presidenta' },
  { name: 'Paulina Mariel García Alanís', generation: '2025-2026', role: 'vicepresidencia', area: 'vicepresidencia', title: 'Vicepresidenta' },
  { name: 'Elisa Anahe Cázares López', generation: '2025-2026', role: 'director', area: 'marketing', title: 'Directora de Marketing' },
  { name: 'Carolina Cruz Rangel', generation: '2025-2026', role: 'director', area: 'proyectos', title: 'Directora de Proyectos', initials: 'CC' },
  { name: 'Mirna Azereth Gutiérrez Rodríguez', generation: '2025-2026', role: 'director', area: 'vinculacion', title: 'Directora de Vinculación' },
  { name: 'Andrea Estefanía de la Peña Contreras', generation: '2025-2026', role: 'director', area: 'finanzas', title: 'Directora de Finanzas' },
  { name: 'María Fernanda Cuevas', generation: '2025-2026', role: 'director', area: 'responsabilidad-social', title: 'Directora de Responsabilidad Social' },
  { name: 'Fátima Castillo Aguirre', generation: '2025-2026', role: 'director', area: 'software', title: 'Directora de Software', initials: 'FC' },

  // ── 2024-2025 ─────────────────────────────────────────────
  { name: 'Darianna Téllez', generation: '2024-2025', role: 'presidencia', area: 'presidencia', title: 'Presidenta' },
  { name: 'Brisma Alvarez', generation: '2024-2025', role: 'vicepresidencia', area: 'vicepresidencia', title: 'Vicepresidenta' },
  { name: 'Angela Pesina', generation: '2024-2025', role: 'director', area: 'responsabilidad-social', title: 'Directora de Responsabilidad Social' },
  { name: 'Jimena Carmona', generation: '2024-2025', role: 'director', area: 'marketing', title: 'Directora de Marketing' },
  { name: 'Eunice Peña', generation: '2024-2025', role: 'director', area: 'finanzas', title: 'Directora de Finanzas' },

  // ── 2023-2024 ─────────────────────────────────────────────
  { name: 'Sofía García', generation: '2023-2024', role: 'presidencia', area: 'presidencia', title: 'Presidenta' },
  { name: 'Alejandra Coeto', generation: '2023-2024', role: 'vicepresidencia', area: 'vicepresidencia', title: 'Vicepresidenta' },
  { name: 'Angela Pesina', generation: '2023-2024', role: 'director', area: 'responsabilidad-social', title: 'Directora de Responsabilidad Social' },
  { name: 'Jimena Carmona', generation: '2023-2024', role: 'director', area: 'marketing', title: 'Directora de Marketing' },
  { name: 'Fernanda Quevedo', generation: '2023-2024', role: 'director', area: 'proyectos', title: 'Directora de Proyectos (febrero-junio 2024)' },
  { name: 'Darianna Téllez', generation: '2023-2024', role: 'director', area: 'finanzas', title: 'Directora de Finanzas (febrero-junio 2024)' },
  { name: 'Marcela Jiménez', generation: '2023-2024', role: 'director', area: 'finanzas', title: 'Directora de Finanzas (agosto-diciembre 2023)' },
  { name: 'Ariadna Noli', generation: '2023-2024', role: 'director', area: 'proyectos', title: 'Directora de Proyectos (agosto-diciembre 2023)' },

  // ── 2022-2023 ─────────────────────────────────────────────
  { name: 'Marcela Barajas', generation: '2022-2023', role: 'presidencia', area: 'presidencia', title: 'Presidenta' },
  { name: 'Andrea Díaz', generation: '2022-2023', role: 'vicepresidencia', area: 'vicepresidencia', title: 'Vicepresidenta' },
  { name: 'Daniela López', generation: '2022-2023', role: 'director', area: 'responsabilidad-social', title: 'Directora de Responsabilidad Social' },
  { name: 'Ari Noli', generation: '2022-2023', role: 'director', area: 'proyectos', title: 'Directora de Proyectos' },
  { name: 'Andrea San Martín Vital', generation: '2022-2023', role: 'director', area: 'finanzas', title: 'Directora de Administración y Finanzas', initials: 'AS' },
  { name: 'Carolina Velarde', generation: '2022-2023', role: 'director', area: 'marketing', title: 'Directora de Comunicación y Mercadotecnia' },

  // ── 2021-2022 ─────────────────────────────────────────────
  { name: 'Bárbara García', generation: '2021-2022', role: 'presidencia', area: 'presidencia', title: 'Presidenta' },
  { name: 'Ana Zermeño', generation: '2021-2022', role: 'vicepresidencia', area: 'vicepresidencia', title: 'Vicepresidenta' },
  { name: 'Natalia González', generation: '2021-2022', role: 'director', area: 'finanzas', title: 'Directora de Administración y Finanzas' },
  { name: 'Mariafernanda Salas', generation: '2021-2022', role: 'director', area: 'proyectos', title: 'Directora de Proyectos' },
  { name: 'Nadia García', generation: '2021-2022', role: 'director', area: 'marketing', title: 'Directora de Comunicación' },
  { name: 'Ingrid Chávez', generation: '2021-2022', role: 'director', area: 'responsabilidad-social', title: 'Directora de Responsabilidad Social' },

  // ── 2020-2021 ─────────────────────────────────────────────
  { name: 'Paulina González', generation: '2020-2021', role: 'presidencia', area: 'presidencia', title: 'Presidenta' },
  { name: 'Carolina Obregón', generation: '2020-2021', role: 'vicepresidencia', area: 'vicepresidencia', title: 'Vicepresidenta' },
  { name: 'Andrea Ramírez', generation: '2020-2021', role: 'director', area: 'finanzas' },
  { name: 'Bárbara García', generation: '2020-2021', role: 'director', area: 'responsabilidad-social' },
  { name: 'Lolyna de la Fuente', generation: '2020-2021', role: 'director', area: 'marketing', title: 'Comunicación' },
  { name: 'Lizeth González', generation: '2020-2021', role: 'director', area: 'planeacion-estrategica' },
]

// ── Helpers (no need to edit below) ────────────────────────

/** Whether a member is rendered: real name, and coordinators only in CURRENT_GENERATION. */
export function isShown(m: Member): boolean {
  return m.name.trim() !== '' && (m.generation === CURRENT_GENERATION || m.role !== 'coordinador')
}

/** Generations with at least one member to show, newest first. */
export const GENERATIONS: string[] = [...new Set(MEMBERS.filter(isShown).map((m) => m.generation))].sort().reverse()

export function areaLabel(id?: AreaId): string {
  return AREAS.find((a) => a.id === id)?.label ?? ''
}

const NAME_PARTICLES = new Set(['de', 'del', 'la', 'las', 'los', 'y'])

/**
 * First letter of the first name and of the first surname. With four or more
 * words we assume two surnames, so the first surname is second to last.
 * Ambiguous three-word names set `initials` in the data instead.
 */
export function initials(m: Member): string {
  if (m.initials) return m.initials
  const words = m.name.split(/\s+/).filter((w) => w && !NAME_PARTICLES.has(w.toLowerCase()))
  if (words.length < 2) return (words[0]?.[0] ?? '').toUpperCase()
  const surname = words.length >= 4 ? words[words.length - 2] : words[words.length - 1]
  return (words[0][0] + surname[0]).toUpperCase()
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
