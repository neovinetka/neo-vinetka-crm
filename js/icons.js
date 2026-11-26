/* ====================================================================
   VINETKA CRM & ERP - ICONS LIBRARY (PAYNO CLEAN OUTLINE STYLE)
   ==================================================================== */

const Icons = {
  // Fotoaparat
  camera: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>`,

  // Albom / Kitob
  album: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"/>
      <path d="M6 6h10"/>
      <path d="M6 10h10"/>
      <path d="M6 14h6"/>
    </svg>`,

  // Guruh / Talabalar
  users: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>`,

  // Chek / Kvitansiya
  receipt: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
      <path d="M8 7h8"/>
      <path d="M8 11h8"/>
      <path d="M8 15h5"/>
    </svg>`,

  // Pul / Karta / Moliya
  wallet: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
    </svg>`,

  // Tasdiqlash / Check
  check: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`,

  checkCircle: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="16 9 10 15 8 13"/>
    </svg>`,

  // Qo'ng'iroq / Telefon
  phone: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>`,

  // Xarita va Lokatsiya / Map Pin
  mapPin: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>`,

  map: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>`,

  // Chiqish / Logout
  logout: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>`,

  // Plus
  plus: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>`,

  // Ma'lumot / Info
  info: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`,

  // Yopish / Close
  x: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`,

  // Arrow Up Right (Payno circular action arrow)
  arrowUpRight: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/>
      <polyline points="7 7 17 7 17 17"/>
    </svg>`,

  // Arrow Down Left (Kirim)
  arrowDownLeft: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <line x1="17" y1="7" x2="7" y2="17"/>
      <polyline points="17 17 7 17 7 7"/>
    </svg>`,

  // Chevron Right
  chevronRight: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>`,

  // Chevron Down
  chevronDown: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`,

  // Ko'z / Ko'rmaslik
  eye: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`,

  // Havola / Link
  link: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>`,

  // Qidiruv
  search: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>`,

  // Home
  home: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,

  // Ro'yxat / Orders
  orders: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>`,

  // Pul daftari
  ledger: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <line x1="6" y1="8" x2="10" y2="8"/>
      <line x1="6" y1="12" x2="18" y2="12"/>
      <line x1="6" y1="16" x2="14" y2="16"/>
    </svg>`,

  // Sozlamalar
  settings: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`,

  // Foydalanuvchi / User
  user: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>`,

  // Tahrirlash / Edit
  edit: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>`,

  // O'chirish / Trash
  trash: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>`,

  // Universitet / Bino
  building: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 21h18"/>
      <path d="M5 21V7l8-4v18"/>
      <path d="M19 21V11l-6-4"/>
      <path d="M9 9h1"/>
      <path d="M9 13h1"/>
      <path d="M9 17h1"/>
    </svg>`,

  // Sparkles
  sparkles: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>`,

  // Box / Paket
  box: (cls = "w-5 h-5", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>`,

  // Clock
  clock: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>`,

  // Calendar
  calendar: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>`,

  // Palette (Dizayn / Edit)
  palette: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>
    </svg>`,

  // Layers (Yig'ish / Albom)
  layers: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>`,

  // Aperture (Fotosessiya ob'yektiv)
  aperture: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="14.31" y1="8" x2="20.05" y2="17.94"/>
      <line x1="9.69" y1="8" x2="21.17" y2="8"/>
      <line x1="7.38" y1="12" x2="13.12" y2="2.06"/>
      <line x1="9.69" y1="16" x2="3.95" y2="6.06"/>
      <line x1="14.31" y1="16" x2="2.83" y2="16"/>
      <line x1="16.62" y1="12" x2="10.88" y2="21.94"/>
    </svg>`,

  // Briefcase (Buxgalter)
  briefcase: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>`,

  // FileText / Hujjat / Hisobot
  fileText: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>`,

  // Crown (Rahbar / CEO)
  crown: (cls = "w-4 h-4", stroke = "currentColor") => `
    <svg class="${cls}" fill="none" stroke="${stroke}" stroke-width="1.8" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z"/>
    </svg>`
};

// Globalga chiqarish
window.Icons = Icons;

