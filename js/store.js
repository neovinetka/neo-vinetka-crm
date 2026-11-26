/* ====================================================================
   VINETKA CRM & ERP - STATE MANAGEMENT STORE (REACTIVE LOCALSTORAGE)
   ==================================================================== */

const STORE_KEY = 'vinetka_crm_store_v10';
const LEGACY_STORE_KEYS = [
  'vinetka_crm_store_v1',
  'vinetka_crm_store_v2',
  'vinetka_crm_store_v3',
  'vinetka_crm_store_v4',
  'vinetka_crm_store_v5',
  'vinetka_crm_store_v6',
  'vinetka_crm_store_v7',
  'vinetka_crm_store_v8',
  'vinetka_crm_store_v9'
];

// Standart tariflar
const DEFAULT_RATES = {
  sellerCommissionPercent: 10,   // Sotuvchiga 10%
  editorRatePerStudent: 15000,   // Dizaynerga har bir talaba uchun 15 000 so'm
  makerRatePerAlbum: 25000,      // Albom yasovchiga 1 ta albom uchun 25 000 so'm
  photographerSalary: 6000000    // Fotografga 6 000 000 so'm oylik
};

// O'zbekiston viloyatlari (Boshlang'ich hududlar ro'yxati)
const INITIAL_REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand',
  'Buxoro',
  'Andijon',
  "Farg'ona",
  'Namangan',
  'Qashqadaryo',
  'Surxondaryo',
  'Xorazm',
  'Navoiy',
  'Jizzax',
  'Sirdaryo',
  "Qoraqalpog'iston Respublikasi"
];
let REGIONS = [...INITIAL_REGIONS];

// Dinamik Vinetka turlari katalogi (Har bir model uchun sotuv va yasovchi narxi)
const INITIAL_ALBUM_TYPES = [
  { id: 'type_1', name: 'Premium Glossy (A4)', basePrice: 220000, makerRate: 25000 },
  { id: 'type_2', name: 'Luxe Velvet Soft-touch', basePrice: 250000, makerRate: 30000 },
  { id: 'type_3', name: 'Standard Book Hardcover', basePrice: 190000, makerRate: 20000 },
  { id: 'type_4', name: 'Royal Leather Embossed', basePrice: 280000, makerRate: 35000 }
];

// O'zbekcha oylar ro'yxati (Oy va Yil tizimi uchun)
const UZ_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

// Boshlang'ich Oy/Yil davrlari (Legacy moslik uchun)
const INITIAL_SEASONS = [
  {
    id: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    name: `${UZ_MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
    startDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
    endDate: '',
    status: 'active',
    isCurrent: true,
    createdAt: new Date().toLocaleDateString('ru-RU')
  }
];

// Standart Demo Foydalanuvchilar (Mijozga ko'rsatish va o'rgatish uchun toza demo hisoblar)
const INITIAL_USERS = [
  {
    id: 'usr_ceo_1',
    name: 'Doniyor Zufarov',
    username: 'admin',
    password: '123',
    role: 'ceo',
    region: 'all',
    phone: '+998 90 999 88 77',
    telegram: '@doniyor_ceo',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    payModel: 'salary',
    payRate: 0,
    monthlySalary: 0,
    paidAmount: 0,
    advanceTaken: 0,
    paidCommission: 0
  },
  {
    id: 'usr_acc_1',
    name: 'Nodira Buxgalter',
    username: 'accountant',
    password: '123',
    role: 'accountant',
    region: 'all',
    phone: '+998 90 123 45 67',
    telegram: '@nodira_bux',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    payModel: 'salary',
    payRate: 0,
    monthlySalary: 0,
    paidAmount: 0,
    advanceTaken: 0,
    paidCommission: 0
  },
  {
    id: 'usr_sel_1',
    name: 'Jamshid Sotuvchi',
    username: 'seller',
    password: '123',
    role: 'seller',
    region: 'Toshkent shahri',
    phone: '+998 93 555 44 33',
    telegram: '@jamshid_seller',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    payModel: 'percent',
    payRate: 10,
    monthlySalary: 0,
    paidAmount: 0,
    advanceTaken: 0,
    paidCommission: 0
  },
  {
    id: 'usr_pho_1',
    name: 'Bobur Fotograf',
    username: 'photographer',
    password: '123',
    role: 'photographer',
    region: 'Toshkent shahri',
    phone: '+998 97 777 66 55',
    telegram: '@bobur_photo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    payModel: 'salary',
    payRate: 6000000,
    monthlySalary: 6000000,
    paidAmount: 0,
    advanceTaken: 0,
    paidCommission: 0
  },
  {
    id: 'usr_edi_1',
    name: 'Sardor Dizayner',
    username: 'editor',
    password: '123',
    role: 'editor',
    region: 'Toshkent shahri',
    phone: '+998 99 888 11 22',
    telegram: '@sardor_editor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    payModel: 'per_student',
    payRate: 15000,
    monthlySalary: 0,
    paidAmount: 0,
    advanceTaken: 0,
    paidCommission: 0
  },
  {
    id: 'usr_mak_1',
    name: 'Jasur Albomchi',
    username: 'maker',
    password: '123',
    role: 'maker',
    region: 'Toshkent shahri',
    phone: '+998 91 333 22 11',
    telegram: '@jasur_maker',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    payModel: 'by_album_type',
    payRate: 25000,
    monthlySalary: 0,
    paidAmount: 0,
    advanceTaken: 0,
    paidCommission: 0
  }
];

// Boshlang'ich Guruh Buyurtmalari (Clean Start: Barcha test ma'lumotlar tozalandi)
const INITIAL_ORDERS = [];

// Buxgalter Inbox: Sotuvchidan topshirilgan pullar (Tasdiqlash markazi)
const INITIAL_CASH_SUBMISSIONS = [];

// Buxgalter Inbox: Xarajat so'rovlari
const INITIAL_EXPENSE_REQUESTS = [];

// Kompaniya doimiy xarajatlari (Ofis, ijara, oyliklar)
const INITIAL_COMPANY_EXPENSES = [];

// Payroll tarixi (Xodimlarga to'langan oylik va avanslar)
const INITIAL_PAYROLL_LOGS = [];

class Store {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    // Eski kesh kalitlarini tozalash
    try {
      for (const oldKey of LEGACY_STORE_KEYS) {
        localStorage.removeItem(oldKey);
      }
    } catch (e) {}

    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.rates = parsed.rates || { ...DEFAULT_RATES };
        this.albumTypes = parsed.albumTypes || JSON.parse(JSON.stringify(INITIAL_ALBUM_TYPES));
        this.users = parsed.users || JSON.parse(JSON.stringify(INITIAL_USERS));
        this.orders = parsed.orders || JSON.parse(JSON.stringify(INITIAL_ORDERS));
        this.seasons = parsed.seasons || JSON.parse(JSON.stringify(INITIAL_SEASONS));
        // Tizim har doim standart (default) holatda joriy oy va yilga ochiladi
        this.currentSeasonId = this.getCurrentMonthKey();
        this.selectedSeasonId = this.currentSeasonId;
        this.cashSubmissions = parsed.cashSubmissions || [...INITIAL_CASH_SUBMISSIONS];
        this.expenseRequests = parsed.expenseRequests || [...INITIAL_EXPENSE_REQUESTS];
        this.companyExpenses = parsed.companyExpenses || [...INITIAL_COMPANY_EXPENSES];
        this.payrollLogs = parsed.payrollLogs || [...INITIAL_PAYROLL_LOGS];
        this.regions = parsed.regions || JSON.parse(JSON.stringify(INITIAL_REGIONS));
        this.expenseCategories = parsed.expenseCategories || ['Ofis va Ijara', 'Taksi va Transport', 'Pechat va Materiallar', 'Oylik va Gonorar', 'Kanselyariya va Texnika', 'Tushlik va Ovqatlanish', 'Boshqa'];
        this.currentUser = (parsed.currentUser && parsed.currentUser.id) ? parsed.currentUser : null;
        window.REGIONS = this.regions;

        // Migratsiya: makerRate mavjudligini ta'minlash
        if (this.albumTypes) {
          for (const t of this.albumTypes) {
            if (t.makerRate === undefined) {
              const initMatch = INITIAL_ALBUM_TYPES.find(it => it.id === t.id);
              t.makerRate = initMatch ? initMatch.makerRate : 25000;
            }
          }
        }

        // Migratsiya: har bir xodimda payModel va payRate bo'lishini ta'minlash
        if (this.users) {
          for (const u of this.users) {
            if (!u.payModel) {
              const initMatch = INITIAL_USERS.find(iu => iu.id === u.id);
              if (initMatch) {
                u.payModel = initMatch.payModel;
                u.payRate = initMatch.payRate;
              } else {
                if (u.role === 'seller') { u.payModel = 'percent'; u.payRate = 10; }
                else if (u.role === 'photographer') { u.payModel = 'salary'; u.payRate = 6000000; }
                else if (u.role === 'editor') { u.payModel = 'per_student'; u.payRate = 15000; }
                else if (u.role === 'maker') { u.payModel = 'by_album_type'; u.payRate = 25000; }
              }
            }
          }
        }

        // Migratsiya: buyurtmalarda monthKey / seasonId va photoDate
        if (this.orders) {
          for (const order of this.orders) {
            const mk = this.getItemMonthKey(order);
            if (!order.monthKey) order.monthKey = mk;
            if (!order.seasonId || String(order.seasonId).startsWith('season_')) {
              order.seasonId = mk;
            }
            if (!order.photoDate) {
              const initMatch = INITIAL_ORDERS.find(io => io.id === order.id);
              if (initMatch && initMatch.photoDate) order.photoDate = initMatch.photoDate;
            }
          }
        }

        // Barcha muhim rollar (xususan buxgalter) mavjudligini kafolatlash
        if (this.users) {
          for (const initUser of INITIAL_USERS) {
            const exists = this.users.find(u => u.role === initUser.role);
            if (!exists) {
              this.users.push(JSON.parse(JSON.stringify(initUser)));
            }
          }
        }
        this.syncOrdersWithProfiles();
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isConfigured()) {
          setTimeout(() => this.syncWithSupabase(), 50);
        }
        return;
      } catch (e) {
        console.error("Local storage load error, resetting to initial", e);
      }
    }
    this.resetToDefaults();
  }

  resetToDefaults() {
    this.rates = { ...DEFAULT_RATES };
    this.albumTypes = JSON.parse(JSON.stringify(INITIAL_ALBUM_TYPES));
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.seasons = JSON.parse(JSON.stringify(INITIAL_SEASONS));
    this.currentSeasonId = this.getCurrentMonthKey();
    this.selectedSeasonId = this.currentSeasonId;
    this.cashSubmissions = JSON.parse(JSON.stringify(INITIAL_CASH_SUBMISSIONS));
    this.expenseRequests = JSON.parse(JSON.stringify(INITIAL_EXPENSE_REQUESTS));
    this.companyExpenses = JSON.parse(JSON.stringify(INITIAL_COMPANY_EXPENSES));
    this.payrollLogs = JSON.parse(JSON.stringify(INITIAL_PAYROLL_LOGS));
    this.regions = JSON.parse(JSON.stringify(INITIAL_REGIONS));
    this.currentUser = null;
    window.REGIONS = this.regions;
    this.save();
    if (typeof SupabaseService !== 'undefined' && SupabaseService.isConfigured()) {
      setTimeout(() => this.syncWithSupabase(), 50);
    }
  }

  saveLocalOnly() {
    const payload = {
      rates: this.rates,
      albumTypes: this.albumTypes,
      users: this.users,
      orders: this.orders,
      seasons: this.seasons,
      regions: this.regions,
      currentSeasonId: this.currentSeasonId,
      selectedSeasonId: this.selectedSeasonId,
      cashSubmissions: this.cashSubmissions,
      expenseRequests: this.expenseRequests,
      companyExpenses: this.companyExpenses,
      payrollLogs: this.payrollLogs,
      expenseCategories: this.expenseCategories || ['Ofis va Ijara', 'Taksi va Transport', 'Pechat va Materiallar', 'Oylik va Gonorar', 'Kanselyariya va Texnika', 'Tushlik va Ovqatlanish', 'Boshqa'],
      currentUser: this.currentUser
    };
    window.REGIONS = this.regions;
    localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    this.notify();
  }

  save() {
    this.saveLocalOnly();
  }

  // Supabase PostgreSQL bilan asinxron fonda CRUD sinxronizatsiya
  async syncDb(table, action, data, idField = 'id', idVal = null) {
    if (typeof SupabaseService === 'undefined' || !SupabaseService.isConfigured()) return;
    const client = SupabaseService.client;
    if (!client) return;

    try {
      if (action === 'insert') {
        const { error } = await client.from(table).insert(Array.isArray(data) ? data : [data]);
        if (error) console.error(`[Supabase Insert Error in ${table}]:`, error);
      } else if (action === 'update') {
        const { error } = await client.from(table).update(data).eq(idField, idVal);
        if (error) console.error(`[Supabase Update Error in ${table}]:`, error);
      } else if (action === 'delete') {
        const { error } = await client.from(table).delete().eq(idField, idVal);
        if (error) console.error(`[Supabase Delete Error in ${table}]:`, error);
      } else if (action === 'upsert') {
        const { error } = await client.from(table).upsert(data);
        if (error) console.error(`[Supabase Upsert Error in ${table}]:`, error);
      }
    } catch (err) {
      console.error(`[Supabase Sync Exception in ${table}]:`, err);
    }
  }

  // Supabase-dagi barcha jadvallarni yuklab xotiraga olish va Real-time yoqish
  async syncWithSupabase() {
    if (typeof SupabaseService === 'undefined' || !SupabaseService.isConfigured()) return;
    const client = SupabaseService.client;
    if (!client) return;

    try {
      console.log("[Supabase] Cloud ma'lumotlari yuklanmoqda...");

      // 1. Profiles
      const { data: dbProfiles, error: errProfiles } = await client.from('profiles').select('*');
      if (errProfiles) {
        console.warn("[Supabase] Profiles jadvalida xatolik:", errProfiles.message);
      } else if (dbProfiles && dbProfiles.length === 0) {
        console.log("[Supabase] Jadvallar bo'sh, boshlang'ich ma'lumotlar avtomatik yozilmoqda...");
        await this.seedSupabaseDirect(client);
      } else if (dbProfiles && dbProfiles.length > 0) {
        this.users = dbProfiles.map(SupabaseService.mapProfileFromDb);
        if (this.currentUser) {
          const matched = this.users.find(u => u.id === this.currentUser.id);
          if (matched) this.currentUser = matched;
        }
      }

      // 2. Oy va Yil davri (har doim joriy oy/yil standart bo'ladi)
      this.currentSeasonId = this.getCurrentMonthKey();
      if (!this.selectedSeasonId || String(this.selectedSeasonId).startsWith('season_')) {
        this.selectedSeasonId = this.currentSeasonId;
      }

      // 3. Settings (regions, album_types, rates)
      const { data: dbSettings, error: errSettings } = await client.from('settings').select('*');
      if (!errSettings && dbSettings) {
        for (const s of dbSettings) {
          if (s.key === 'regions' && Array.isArray(s.value)) {
            this.regions = s.value;
            window.REGIONS = s.value;
          } else if (s.key === 'album_types' && Array.isArray(s.value)) {
            this.albumTypes = s.value;
          } else if (s.key === 'rates' && s.value) {
            this.rates = s.value;
          }
        }
      }

      // 4. Orders
      const { data: dbOrders, error: errOrders } = await client.from('orders').select('*').order('created_at', { ascending: false });
      if (!errOrders && dbOrders) {
        this.orders = dbOrders.map(SupabaseService.mapOrderFromDb);
      }

      // 5. Payments (cash submissions)
      const { data: dbPayments, error: errPayments } = await client.from('payments').select('*').order('created_at', { ascending: false });
      if (!errPayments && dbPayments) {
        this.cashSubmissions = dbPayments.map(SupabaseService.mapPaymentFromDb);
      }

      // 6. Expenses
      const { data: dbExpenses, error: errExpenses } = await client.from('expenses').select('*').order('created_at', { ascending: false });
      if (!errExpenses && dbExpenses) {
        this.expenseRequests = dbExpenses.map(SupabaseService.mapExpenseFromDb);
      }

      // 7. Payroll logs
      const { data: dbPayroll, error: errPayroll } = await client.from('payroll_logs').select('*').order('created_at', { ascending: false });
      if (!errPayroll && dbPayroll) {
        this.payrollLogs = dbPayroll.map(p => ({
          id: p.id,
          userId: p.user_id,
          userName: p.user_name,
          role: p.role,
          amount: Number(p.amount) || 0,
          type: p.type,
          note: p.note,
          rawCreatedAt: p.created_at || null,
          date: p.date || (p.created_at ? new Date(p.created_at).toLocaleDateString('uz-UZ') : '')
        }));
      }

      // 8. Company Expenses
      const { data: dbCompExpenses, error: errCompExpenses } = await client.from('company_expenses').select('*').order('created_at', { ascending: false });
      if (!errCompExpenses && dbCompExpenses) {
        this.companyExpenses = dbCompExpenses.map(c => ({
          id: c.id,
          title: c.title,
          amount: Number(c.amount) || 0,
          category: c.category,
          note: c.note,
          rawCreatedAt: c.created_at || null,
          date: c.date || (c.created_at ? new Date(c.created_at).toLocaleDateString('uz-UZ') : '')
        }));
      }

      // Realtime obunani yoqish
      SupabaseService.subscribeRealtime(this);
      SupabaseService.status = 'connected';
      SupabaseService.notifyStatus();

      // Xodimlar va buyurtmalar/to'lovlar ma'lumotlarini o'zaro sinxronlashtirish
      this.syncOrdersWithProfiles();
      this.saveLocalOnly();
      this.notify();
      console.log("[Supabase] Barcha jadvallar muvaffaqiyatli sinxronlandi!");
    } catch (err) {
      console.error("[Supabase] syncWithSupabase xatolik:", err);
      SupabaseService.status = 'disconnected';
      SupabaseService.notifyStatus();
    }
  }

  // Boshlang'ich jadvallar bo'sh bo'lganda avtomatik seed qilish
  async seedSupabaseDirect(client) {
    try {
      // 1. Seasons
      await client.from('seasons').upsert(INITIAL_SEASONS.map(s => ({
        id: s.id,
        name: s.name,
        start_date: s.startDate,
        end_date: s.endDate || null,
        is_active: s.status === 'active',
        is_current: s.isCurrent
      })));

      // 2. Settings
      await client.from('settings').upsert([
        { key: 'regions', value: INITIAL_REGIONS },
        { key: 'album_types', value: INITIAL_ALBUM_TYPES },
        { key: 'rates', value: DEFAULT_RATES }
      ]);

      // 3. Profiles
      await client.from('profiles').upsert(INITIAL_USERS.map(SupabaseService.mapProfileToDb));

      console.log("[Supabase] Boshlang'ich tizim sozlamalari va xodimlar muvaffaqiyatli saqlandi!");
    } catch (e) {
      console.error("[Supabase] Seed xatolik:", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (e) {
        console.error("Store listener error", e);
      }
    }
  }

  // ==========================================
  // AUTH VA FOYDALANUVCHILAR
  // ==========================================
  // Production Autentifikatsiya (Xavfsiz, aniq profil va parol tekshiruvi)
  async login(username, password) {
    const cleanUser = (username || '').toLowerCase().trim();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, message: 'Iltimos, login va parolni kiriting!' };
    }

    // 1. Avval mavjud xotiradagi (yoki sinxronlangan) profillardan qidiramiz
    let user = (this.users || []).find(u => {
      const uname = (u.username || '').toLowerCase().trim();
      return uname === cleanUser || (cleanUser === 'ceo' && u.role === 'ceo');
    });

    // 2. Agar xotirada topilmasa, to'g'ridan-to'g'ri Supabase profiles jadvalidan so'raymiz
    if (!user && typeof SupabaseService !== 'undefined' && SupabaseService.client) {
      try {
        let query = SupabaseService.client.from('profiles').select('*');
        if (cleanUser === 'ceo') {
          query = query.or(`username.ilike.${cleanUser},role.eq.ceo`);
        } else {
          query = query.ilike('username', cleanUser);
        }
        const { data, error } = await query.maybeSingle();

        if (!error && data) {
          user = SupabaseService.mapProfileFromDb(data);
          const idx = this.users.findIndex(u => u.id === user.id);
          if (idx !== -1) {
            this.users[idx] = user;
          } else {
            this.users.push(user);
          }
        }
      } catch (err) {
        console.warn('[Supabase Auth lookup error]:', err);
      }
    }

    if (!user) {
      return { success: false, message: 'Login yoki parol notoʻgʻri!' };
    }

    if (user.password !== cleanPass) {
      return { success: false, message: 'Login yoki parol notoʻgʻri!' };
    }

    if (user.status === 'blocked') {
      return { success: false, message: 'Ushbu foydalanuvchi hisobi bloklangan. Iltimos, Rahbarga murojaat qiling.' };
    }

    this.currentUser = user;
    this.save();
    return { success: true, user };
  }

  logout() {
    this.currentUser = null;
    this.save();
  }

  // Xodim profilidagi o'zgarishlarni barcha buyurtmalar, kassa to'lovlari, xarajatlar va oylik loglariga tarqatish
  propagateUserChanges(userId, newName, newPhone, oldName = null) {
    if (!userId) return false;
    let anyChanged = false;

    // 1. Orders (faol, navbatdagi va tarixdagi / topshirilgan barcha buyurtmalar)
    if (this.orders && Array.isArray(this.orders)) {
      this.orders.forEach(order => {
        let changed = false;

        // Sotuvchi sifatida
        if (order.sellerId === userId || (!order.sellerId && oldName && order.sellerName === oldName)) {
          order.sellerId = userId;
          if (newName) order.sellerName = newName;
          if (newPhone !== undefined) order.sellerPhone = newPhone;
          changed = true;
        }

        // Fotograf sifatida
        if (order.photographerId === userId || (!order.photographerId && oldName && order.photographerName === oldName)) {
          order.photographerId = userId;
          if (newName) order.photographerName = newName;
          if (newPhone !== undefined) order.photographerPhone = newPhone;
          changed = true;
        }

        // Dizayner sifatida
        if (order.editorId === userId || (!order.editorId && oldName && order.editorName === oldName)) {
          order.editorId = userId;
          if (newName) order.editorName = newName;
          if (newPhone !== undefined) order.editorPhone = newPhone;
          changed = true;
        }

        // Albom yasovchi sifatida
        if (order.makerId === userId || (!order.makerId && oldName && order.makerName === oldName)) {
          order.makerId = userId;
          if (newName) order.makerName = newName;
          if (newPhone !== undefined) order.makerPhone = newPhone;
          changed = true;
        }

        if (changed) anyChanged = true;
      });
    }

    // 2. Kassa to'lovlari (payments / cashSubmissions)
    if (this.cashSubmissions && Array.isArray(this.cashSubmissions)) {
      this.cashSubmissions.forEach(sub => {
        if (sub.sellerId === userId || (!sub.sellerId && oldName && sub.sellerName === oldName)) {
          sub.sellerId = userId;
          if (newName) sub.sellerName = newName;
          anyChanged = true;
        }
      });
    }

    // 3. Xarajat so'rovlari (expenses / expenseRequests)
    if (this.expenseRequests && Array.isArray(this.expenseRequests)) {
      this.expenseRequests.forEach(exp => {
        const uid = exp.requesterId || exp.userId;
        if (uid === userId || (!uid && oldName && exp.requesterName === oldName)) {
          exp.requesterId = userId;
          exp.userId = userId;
          if (newName) exp.requesterName = newName;
          anyChanged = true;
        }
      });
    }

    // 4. Oylik/avans to'lovlari tarixi (payrollLogs)
    if (this.payrollLogs && Array.isArray(this.payrollLogs)) {
      this.payrollLogs.forEach(log => {
        if (log.userId === userId || (!log.userId && oldName && log.userName === oldName)) {
          log.userId = userId;
          if (newName) log.userName = newName;
          anyChanged = true;
        }
      });
    }

    return anyChanged;
  }

  // Barcha buyurtma va to'lovlarni xodimlar profili bilan to'liq sinxronlash
  syncOrdersWithProfiles() {
    if (!this.users || this.users.length === 0) return;
    const userMap = new Map();
    this.users.forEach(u => userMap.set(u.id, u));

    if (this.orders && Array.isArray(this.orders)) {
      this.orders.forEach(order => {
        if (order.sellerId && userMap.has(order.sellerId)) {
          const u = userMap.get(order.sellerId);
          order.sellerName = u.name;
          order.sellerPhone = u.phone;
        }
        if (order.photographerId && userMap.has(order.photographerId)) {
          const u = userMap.get(order.photographerId);
          order.photographerName = u.name;
          order.photographerPhone = u.phone;
        }
        if (order.editorId && userMap.has(order.editorId)) {
          const u = userMap.get(order.editorId);
          order.editorName = u.name;
          order.editorPhone = u.phone;
        }
        if (order.makerId && userMap.has(order.makerId)) {
          const u = userMap.get(order.makerId);
          order.makerName = u.name;
          order.makerPhone = u.phone;
        }
      });
    }

    if (this.cashSubmissions && Array.isArray(this.cashSubmissions)) {
      this.cashSubmissions.forEach(sub => {
        if (sub.sellerId && userMap.has(sub.sellerId)) {
          sub.sellerName = userMap.get(sub.sellerId).name;
        }
      });
    }

    if (this.expenseRequests && Array.isArray(this.expenseRequests)) {
      this.expenseRequests.forEach(exp => {
        const uid = exp.requesterId || exp.userId;
        if (uid && userMap.has(uid)) {
          exp.requesterName = userMap.get(uid).name;
        }
      });
    }

    if (this.payrollLogs && Array.isArray(this.payrollLogs)) {
      this.payrollLogs.forEach(log => {
        if (log.userId && userMap.has(log.userId)) {
          log.userName = userMap.get(log.userId).name;
        }
      });
    }
  }

  updateProfile(userId, data) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    const oldName = user.name;
    const oldPhone = user.phone;

    if (data.name) user.name = data.name.trim();
    if (data.phone !== undefined) user.phone = data.phone.trim();
    if (data.telegram !== undefined) user.telegram = data.telegram.trim();
    if (data.avatar !== undefined) user.avatar = data.avatar;
    if (data.role && user.role !== 'ceo') user.role = data.role;

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = { ...user };
    }

    const newName = user.name;
    const newPhone = user.phone;

    // Barcha buyurtmalar, kassa to'lovlari, xarajatlar va oylik loglariga tarqatish
    this.propagateUserChanges(userId, newName, newPhone, oldName);

    this.save();
    this.notify();

    // Supabase PostgreSQL bilan asinxron sinxronizatsiya
    if (typeof SupabaseService !== 'undefined' && SupabaseService.isConfigured()) {
      this.syncDb('profiles', 'update', SupabaseService.mapProfileToDb(user), 'id', user.id);

      const client = SupabaseService.client;
      if (client) {
        // Orders: Sotuvchi bo'lgan barcha buyurtmalar
        client.from('orders')
          .update({ seller_name: newName, seller_phone: newPhone })
          .eq('seller_id', userId)
          .then(({ error }) => { if (error) console.error('[Supabase orders seller update]:', error); });

        // Orders: Fotograf bo'lgan barcha buyurtmalar
        client.from('orders')
          .update({ photographer_name: newName, photographer_phone: newPhone })
          .eq('photographer_id', userId)
          .then(({ error }) => { if (error) console.error('[Supabase orders photo update]:', error); });

        // Orders: Dizayner bo'lgan barcha buyurtmalar
        client.from('orders')
          .update({ editor_name: newName, editor_phone: newPhone })
          .eq('editor_id', userId)
          .then(({ error }) => { if (error) console.error('[Supabase orders editor update]:', error); });

        // Orders: Albom yasovchi bo'lgan barcha buyurtmalar
        client.from('orders')
          .update({ maker_name: newName, maker_phone: newPhone })
          .eq('maker_id', userId)
          .then(({ error }) => { if (error) console.error('[Supabase orders maker update]:', error); });

        // Payments: Kassa to'lovlari
        client.from('payments')
          .update({ seller_name: newName })
          .eq('seller_id', userId)
          .then(({ error }) => { if (error) console.error('[Supabase payments update]:', error); });

        // Expenses: Xarajatlar
        client.from('expenses')
          .update({ requester_name: newName })
          .eq('user_id', userId)
          .then(({ error }) => { if (error) console.error('[Supabase expenses update]:', error); });

        // Payroll logs: Oylik va avans loglari
        client.from('payroll_logs')
          .update({ user_name: newName })
          .eq('user_id', userId)
          .then(({ error }) => { if (error) console.error('[Supabase payroll update]:', error); });
      }
    }

    return true;
  }

  addUser(userData) {
    const newId = 'usr_' + Date.now();
    const startDateIso = (userData.startDate && /^\d{4}-\d{2}-\d{2}$/.test(userData.startDate))
      ? userData.startDate
      : this.getTodayIsoDate();
    const newUser = {
      id: newId,
      name: userData.name,
      username: userData.username.toLowerCase().trim(),
      password: userData.password,
      role: userData.role,
      region: userData.region || 'all', // 'all' (Umumiy xodim) | 'Samarqand' | 'Toshkent shahri' | ...
      phone: userData.phone || '',
      telegram: userData.telegram || '',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      monthlySalary: userData.monthlySalary || (userData.role === 'photographer' ? (this.rates.photographerSalary || 6000000) : 0),
      advanceTaken: 0,
      paidCommission: 0,
      paidAmount: 0,
      startDate: startDateIso,
      startMonth: startDateIso.slice(0, 7),
      createdAt: `${startDateIso}T12:00:00.000Z`,
      payModel: userData.payModel || (userData.role === 'seller' ? 'percent' : userData.role === 'editor' ? 'per_student' : userData.role === 'maker' ? 'by_album_type' : userData.role === 'photographer' ? 'salary' : 'salary'),
      payRate: userData.payRate !== undefined ? userData.payRate : (userData.role === 'seller' ? (this.rates.sellerCommissionPercent || 10) : userData.role === 'editor' ? (this.rates.editorRatePerStudent || 15000) : userData.role === 'maker' ? (this.rates.makerRatePerAlbum || 25000) : userData.role === 'photographer' ? (this.rates.photographerSalary || 6000000) : 0)
    };
    this.users.push(newUser);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('profiles', 'insert', SupabaseService.mapProfileToDb(newUser));
    }
    return newUser;
  }

  // Xodimning biriktirilgan viloyatini yangilash
  updateUserRegion(userId, region) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.region = region || 'all';
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('profiles', 'update', { region: user.region }, 'id', user.id);
      }
      return true;
    }
    return false;
  }

  // Xodim profil rasmini yangilash (Faqat Rahbar/CEO tomonidan)
  updateUserAvatar(userId, avatar) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.avatar = avatar;
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('profiles', 'update', { avatar }, 'id', user.id);
      }
      return true;
    }
    return false;
  }

  deleteUser(userId) {
    if (this.currentUser && this.currentUser.id === userId) {
      return { success: false, message: 'Oʻzingizning profilingizni oʻchira olmaysiz!' };
    }
    this.users = this.users.filter(u => u.id !== userId);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('profiles', 'delete', null, 'id', userId);
    }
    return { success: true };
  }

  toggleUserStatus(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'blocked' : 'active';
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('profiles', 'update', { status: user.status }, 'id', user.id);
      }
      return user.status;
    }
    return null;
  }

  updateUserPassword(userId, newPassword) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.password = newPassword;
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('profiles', 'update', { password: newPassword }, 'id', user.id);
      }
      return true;
    }
    return false;
  }

  updateRates(rates) {
    this.rates = { ...this.rates, ...rates };
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('settings', 'upsert', { key: 'rates', value: this.rates });
    }
  }

  updateEmployeeCompensation(userId, compData) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      if (compData.payModel) user.payModel = compData.payModel;
      if (compData.payRate !== undefined) user.payRate = Store.parseMoney(compData.payRate);
      if (user.payModel === 'salary' && compData.payRate !== undefined) {
        user.monthlySalary = Store.parseMoney(compData.payRate);
      }
      if (compData.startDate && /^\d{4}-\d{2}-\d{2}$/.test(compData.startDate)) {
        user.startDate = compData.startDate;
        user.startMonth = compData.startDate.slice(0, 7);
        user.createdAt = `${compData.startDate}T12:00:00.000Z`;
      } else if (user.payModel === 'salary' && !user.startDate && !user.createdAt) {
        const todayIso = this.getTodayIsoDate();
        user.startDate = todayIso;
        user.startMonth = todayIso.slice(0, 7);
        user.createdAt = `${todayIso}T12:00:00.000Z`;
      }
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('profiles', 'update', SupabaseService.mapProfileToDb(user), 'id', user.id);
      }
      return true;
    }
    return false;
  }

  // ==========================================
  // OY VA YIL (MONTH / YEAR) DAVRLARI BOSHQARUVI
  // ==========================================
  getTodayIsoDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  getCurrentMonthKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  normalizePeriodId(periodId) {
    if (!periodId) return this.getCurrentMonthKey();
    const s = String(periodId).trim();
    if (s.startsWith('season_')) return this.getCurrentMonthKey();
    return s;
  }

  parseMonthKeyFromDateStr(str) {
    if (!str) return null;
    const s = String(str).trim();
    if (/^\d{4}-\d{2}$/.test(s)) return s;

    // 1. ISO / YYYY-MM-DD yoki YYYY.MM.DD
    const isoMatch = s.match(/^(\d{4})[-/.](\d{1,2})/);
    if (isoMatch) {
      const y = parseInt(isoMatch[1], 10);
      const m = parseInt(isoMatch[2], 10);
      if (y >= 2000 && y <= 2100 && m >= 1 && m <= 12) {
        return `${y}-${String(m).padStart(2, '0')}`;
      }
    }

    // 2. DD.MM.YYYY yoki DD/MM/YYYY
    const dmyMatch = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    if (dmyMatch) {
      const m = parseInt(dmyMatch[2], 10);
      const y = parseInt(dmyMatch[3], 10);
      if (y >= 2000 && y <= 2100 && m >= 1 && m <= 12) {
        return `${y}-${String(m).padStart(2, '0')}`;
      }
    }

    // 3. O'zbekcha oy nomi qatnashgan matn: masalan "15-Noyabr 2026"
    const yearMatch = s.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      const y = yearMatch[1];
      const lower = s.toLowerCase();
      const monthAliases = [
        ['yanvar'], ['fevral'], ['mart'], ['aprel'], ['may'], ['iyun'],
        ['iyul'], ['avgust'], ['sentyabr', 'sentabr'], ['oktyabr', 'oktabr'], ['noyabr'], ['dekabr']
      ];
      for (let i = 0; i < monthAliases.length; i++) {
        if (monthAliases[i].some(alias => lower.includes(alias))) {
          return `${y}-${String(i + 1).padStart(2, '0')}`;
        }
      }
    }

    return null;
  }

  getItemMonthKey(item) {
    if (!item) return this.getCurrentMonthKey();
    if (item.monthKey && /^\d{4}-\d{2}$/.test(item.monthKey)) return item.monthKey;
    if (item.seasonId && /^\d{4}-\d{2}$/.test(item.seasonId)) return item.seasonId;

    const fromRaw = this.parseMonthKeyFromDateStr(item.rawCreatedAt);
    if (fromRaw) return fromRaw;
    const fromCreated = this.parseMonthKeyFromDateStr(item.createdAt);
    if (fromCreated) return fromCreated;
    const fromDate = this.parseMonthKeyFromDateStr(item.date);
    if (fromDate) return fromDate;
    const fromPhotoDate = this.parseMonthKeyFromDateStr(item.photoDate);
    if (fromPhotoDate) return fromPhotoDate;

    if (item.timestamp && Number(item.timestamp) > 0) {
      const d = new Date(Number(item.timestamp));
      if (!isNaN(d.getTime())) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
    }

    return this.getCurrentMonthKey();
  }

  matchesPeriod(itemOrKey, periodId = null) {
    const pid = this.normalizePeriodId(periodId !== null ? periodId : this.selectedSeasonId);
    if (!pid || pid === 'all') return true;
    const mk = (typeof itemOrKey === 'string' && /^\d{4}-\d{2}$/.test(itemOrKey))
      ? itemOrKey
      : this.getItemMonthKey(itemOrKey);

    if (pid.startsWith('year_')) {
      const y = pid.replace('year_', '');
      return mk.startsWith(y + '-');
    }
    return mk === pid;
  }

  getPeriodLabel(periodId = null) {
    const pid = this.normalizePeriodId(periodId !== null ? periodId : (this.selectedSeasonId || this.currentSeasonId));
    if (pid === 'all') return 'Barcha oylar';
    if (pid.startsWith('year_')) {
      const y = pid.replace('year_', '');
      return `${y}-yil umumiy hisoboti`;
    }
    if (/^\d{4}-\d{2}$/.test(pid)) {
      const [y, m] = pid.split('-');
      const mIdx = parseInt(m, 10) - 1;
      return `${UZ_MONTHS[mIdx] || m} ${y}`;
    }
    return String(pid);
  }

  getAvailableYears() {
    const yearsSet = new Set([this.getCurrentYear()]);
    const collectYear = (item) => {
      const mk = this.getItemMonthKey(item);
      if (mk && /^\d{4}-\d{2}$/.test(mk)) {
        yearsSet.add(parseInt(mk.slice(0, 4), 10));
      }
    };
    (this.orders || []).forEach(collectYear);
    (this.payrollLogs || []).forEach(collectYear);
    (this.companyExpenses || []).forEach(collectYear);
    return Array.from(yearsSet).sort((a, b) => b - a);
  }

  // Dropdown uchun <option> lar (Tepada Joriy Yil umumiy hisoboti, ostida Oylar ro'yxati)
  renderPeriodSelectOptions(selectedPeriodId = null) {
    const selected = this.normalizePeriodId(selectedPeriodId !== null ? selectedPeriodId : (this.selectedSeasonId || this.getCurrentMonthKey()));
    const currentYear = this.getCurrentYear();
    const currentMonthKey = this.getCurrentMonthKey();
    const years = this.getAvailableYears();

    let html = `<option value="year_${currentYear}" ${selected === `year_${currentYear}` ? 'selected' : ''}>${currentYear}-yil umumiy hisoboti</option>`;

    for (const y of years) {
      if (y !== currentYear) {
        html += `<option value="year_${y}" ${selected === `year_${y}` ? 'selected' : ''}>${y}-yil umumiy hisoboti</option>`;
      }
      html += `<optgroup label="${y}-yil oylari">`;
      for (let m = 1; m <= 12; m++) {
        const mk = `${y}-${String(m).padStart(2, '0')}`;
        const label = `${UZ_MONTHS[m - 1]} ${y}${mk === currentMonthKey ? ' (Joriy oy)' : ''}`;
        html += `<option value="${mk}" ${selected === mk ? 'selected' : ''}>${label}</option>`;
      }
      html += `</optgroup>`;
    }

    return html;
  }

  getMonthsBetween(startMonthKey, endMonthKey) {
    if (!startMonthKey || !endMonthKey || startMonthKey > endMonthKey) return [];
    const [sy, sm] = startMonthKey.split('-').map(Number);
    const [ey, em] = endMonthKey.split('-').map(Number);
    if (!sy || !sm || !ey || !em) return [];
    const result = [];
    let y = sy;
    let m = sm;
    let guard = 0;
    while ((y < ey || (y === ey && m <= em)) && guard < 120) {
      result.push(`${y}-${String(m).padStart(2, '0')}`);
      m++;
      if (m > 12) {
        m = 1;
        y++;
      }
      guard++;
    }
    return result;
  }

  getCurrentSeason() {
    const mk = this.getCurrentMonthKey();
    return {
      id: mk,
      name: this.getPeriodLabel(mk),
      status: 'active',
      isCurrent: true
    };
  }

  getSelectedSeason() {
    const pid = this.normalizePeriodId(this.selectedSeasonId || this.getCurrentMonthKey());
    return {
      id: pid,
      name: this.getPeriodLabel(pid),
      status: pid === this.getCurrentMonthKey() || pid === `year_${this.getCurrentYear()}` ? 'active' : 'history',
      isCurrent: pid === this.getCurrentMonthKey()
    };
  }

  setSelectedSeason(id) {
    this.selectedSeasonId = this.normalizePeriodId(id);
    this.save();
  }

  getMonthlyPeriodsList(year = null) {
    const targetYear = year || this.getCurrentYear();
    const currentMonthKey = this.getCurrentMonthKey();
    const currentMonthNum = targetYear === this.getCurrentYear() ? (new Date().getMonth() + 1) : 12;

    const periods = [
      {
        id: `year_${targetYear}`,
        name: `${targetYear}-yil umumiy hisoboti`,
        subtitle: `1-Yanvar ${targetYear} — 31-Dekabr ${targetYear}`,
        status: 'active',
        isYearSummary: true,
        isCurrent: false
      }
    ];

    // Yilning oylari (joriy oydan Yanvargacha teskari tartibda + kelasi oylar agar ma'lumot bo'lsa)
    const monthsWithData = new Set();
    (this.orders || []).forEach(o => {
      const mk = this.getItemMonthKey(o);
      if (mk.startsWith(`${targetYear}-`)) monthsWithData.add(mk);
    });
    (this.payrollLogs || []).forEach(p => {
      const mk = this.getItemMonthKey(p);
      if (mk.startsWith(`${targetYear}-`)) monthsWithData.add(mk);
    });
    (this.companyExpenses || []).forEach(e => {
      const mk = this.getItemMonthKey(e);
      if (mk.startsWith(`${targetYear}-`)) monthsWithData.add(mk);
    });

    for (let m = 12; m >= 1; m--) {
      const mk = `${targetYear}-${String(m).padStart(2, '0')}`;
      if (m <= currentMonthNum || monthsWithData.has(mk)) {
        periods.push({
          id: mk,
          name: `${UZ_MONTHS[m - 1]} ${targetYear}`,
          subtitle: mk === currentMonthKey ? 'Joriy faol oy' : `${targetYear}-yil ${UZ_MONTHS[m - 1]} oyi hisoboti`,
          status: mk === currentMonthKey ? 'active' : 'archived',
          isYearSummary: false,
          isCurrent: mk === currentMonthKey
        });
      }
    }

    return periods;
  }

  getSeasonSummary(periodId) {
    const pid = this.normalizePeriodId(periodId);
    const season = {
      id: pid,
      name: this.getPeriodLabel(pid),
      status: pid === this.getCurrentMonthKey() || pid.startsWith('year_') ? 'active' : 'archived',
      isCurrent: pid === this.getCurrentMonthKey()
    };
    const targetOrders = (this.orders || []).filter(o => this.matchesPeriod(o, pid));
    const targetPayroll = (this.payrollLogs || []).filter(p => this.matchesPeriod(p, pid));
    const targetCompExp = (this.companyExpenses || []).filter(e => this.matchesPeriod(e, pid));

    let totalRevenue = 0;
    let totalProductionCosts = 0;
    let totalPiecesProduced = 0;
    let closedOrders = 0;

    for (const order of targetOrders) {
      const students = order.realStudentCount || order.studentCount || 0;
      totalPiecesProduced += students;
      totalRevenue += ((order.sellerSubmittedAmount || 0) + (order.photographerSubmittedAmount || 0));
      if (order.status === 'closed') closedOrders++;
      if (order.costs) {
        for (const c of order.costs) {
          if (c.status === 'approved') totalProductionCosts += (c.amount || 0);
        }
      }
    }

    const totalPayrollPaid = targetPayroll.reduce((s, p) => s + (p.amount || 0), 0);
    const totalCompExpPaid = targetCompExp.reduce((s, e) => s + (e.amount || 0), 0);
    const totalExpenses = totalProductionCosts + totalPayrollPaid + totalCompExpPaid;
    const netProfit = totalRevenue - totalExpenses;

    return {
      season,
      totalOrders: targetOrders.length,
      closedOrders,
      totalPiecesProduced,
      totalRevenue,
      totalExpenses,
      totalPayrollPaid,
      totalProductionCosts,
      totalCompExpPaid,
      netProfit
    };
  }

  // ==========================================
  // VILOYATLAR (HUDUDLAR) BOSHQARUVI (RAHBAR / CEO)
  // ==========================================
  getRegions() {
    if (!this.regions || this.regions.length === 0) {
      this.regions = JSON.parse(JSON.stringify(INITIAL_REGIONS));
      window.REGIONS = this.regions;
    }
    return this.regions;
  }

  addRegion(name) {
    const clean = (name || '').trim();
    if (!clean) return { success: false, message: "Viloyat nomini kiriting!" };
    if (!this.regions) this.regions = JSON.parse(JSON.stringify(INITIAL_REGIONS));
    if (this.regions.some(r => r.toLowerCase() === clean.toLowerCase())) {
      return { success: false, message: `"${clean}" viloyati allaqachon mavjud!` };
    }
    this.regions.push(clean);
    window.REGIONS = this.regions;
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('settings', 'upsert', { key: 'regions', value: this.regions });
    }
    return { success: true, message: `"${clean}" viloyati muvaffaqiyatli qoʻshildi!` };
  }

  deleteRegion(name) {
    if (!this.regions) return { success: false, message: "Viloyatlar roʻyxati topilmadi!" };
    if (this.regions.length <= 1) {
      return { success: false, message: "Kamida bitta faol viloyat qolishi shart!" };
    }
    this.regions = this.regions.filter(r => r !== name);
    window.REGIONS = this.regions;
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('settings', 'upsert', { key: 'regions', value: this.regions });
    }
    return { success: true, message: `"${name}" viloyatlar roʻyxatidan olib tashlandi!` };
  }

  // ==========================================
  // VINETKA TURLARI BOSHQARUVI (RAHBAR / CEO)
  // ==========================================
  addAlbumType(name, basePrice, makerRate = 25000) {
    const newType = {
      id: 'type_' + Date.now(),
      name: name.trim(),
      basePrice: Store.parseMoney(basePrice) || 200000,
      makerRate: Store.parseMoney(makerRate) || 25000
    };
    if (!this.albumTypes) this.albumTypes = [];
    this.albumTypes.push(newType);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('settings', 'upsert', { key: 'album_types', value: this.albumTypes });
    }
    return newType;
  }

  updateAlbumType(id, name, basePrice, makerRate) {
    const item = (this.albumTypes || []).find(t => t.id === id);
    if (item) {
      if (name) item.name = name.trim();
      if (basePrice !== undefined) item.basePrice = Store.parseMoney(basePrice);
      if (makerRate !== undefined) item.makerRate = Store.parseMoney(makerRate);
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('settings', 'upsert', { key: 'album_types', value: this.albumTypes });
      }
      return true;
    }
    return false;
  }

  deleteAlbumType(id) {
    if (!this.albumTypes || this.albumTypes.length <= 1) {
      return { success: false, message: 'Kamida bitta vinetka turi boʻlishi shart!' };
    }
    this.albumTypes = this.albumTypes.filter(t => t.id !== id);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('settings', 'upsert', { key: 'album_types', value: this.albumTypes });
    }
    return { success: true };
  }

  // Helper: 50% To'lov unlock qoidasi
  isOrder50Unlocked(order) {
    if (!order) return false;
    if (order.status === 'closed') return true;
    const studentNum = order.realStudentCount || order.studentCount || 0;
    const orderTotal = studentNum * (order.pricePerStudent || 0);
    const submitted = order.sellerSubmittedAmount || 0;
    if (submitted > 0) {
      if (orderTotal > 0 && submitted >= (orderTotal * 0.5)) return true;
      if ((order.collectedAmount || 0) > 0 && submitted >= (order.collectedAmount * 0.5)) return true;
    }
    return false;
  }

  // ==========================================
  // PULL SYSTEM: ORDER LIFECYCLE
  // ==========================================

  // 1. Sotuvchi yangi buyurtma yaratadi -> photo_queue
  createOrder(data) {
    let maxId = 0;
    this.orders.forEach(o => {
      const match = (o.id || '').match(/\d+/);
      if (match) {
        const n = parseInt(match[0], 10);
        if (n > maxId) maxId = n;
      }
    });
    const orderId = '#VIN-' + String(maxId + 1).padStart(4, '0');
    const newOrder = {
      id: orderId,
      region: data.region || 'Toshkent shahri',
      mapLink: data.mapLink || '',
      university: data.university,
      faculty: data.faculty,
      group: data.group,
      leaderName: data.leaderName,
      leaderPhone: data.leaderPhone,
      albumType: data.albumType,
      pricePerStudent: Number(data.pricePerStudent),
      studentCount: Number(data.studentCount),
      realStudentCount: null,
      photoDate: data.photoDate || null,
      notes: data.notes || '',
      sellerId: this.currentUser ? this.currentUser.id : ((this.users.find(u => u.role === 'seller') || {}).id || 'usr_seller'),
      sellerName: this.currentUser ? this.currentUser.name : ((this.users.find(u => u.role === 'seller') || {}).name || 'Sotuvchi'),
      sellerPhone: this.currentUser ? this.currentUser.phone : ((this.users.find(u => u.role === 'seller') || {}).phone || ''),
      photographerId: null,
      photographerName: null,
      photographerPhone: null,
      photoDriveLink: null,
      editorId: null,
      editorName: null,
      editorPhone: null,
      editorProofLink: null,
      editorPrintLink: null,
      makerId: null,
      makerName: null,
      makerPhone: null,
      status: 'photo_queue', // Foto navbatda
      createdAt: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      rawCreatedAt: new Date().toISOString(),
      costs: [],
      collectedAmount: 0,
      paymentMethod: null,
      sellerSubmittedAmount: 0,
      sellerSubmittedPending: 0,
      monthKey: this.getCurrentMonthKey(),
      seasonId: this.getCurrentMonthKey()
    };
    this.orders.unshift(newOrder);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('orders', 'insert', SupabaseService.mapOrderToDb(newOrder));
    }
    return newOrder;
  }

  // 2. Fotograf navbatdan ishni o'ziga oladi -> photo_active
  claimPhotoOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'photo_queue') {
      order.status = 'photo_active';
      order.photographerId = this.currentUser.id;
      order.photographerName = this.currentUser.name;
      order.photographerPhone = this.currentUser.phone;
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('orders', 'update', {
          status: 'photo_active',
          photographer_id: order.photographerId,
          photographer_name: order.photographerName,
          photographer_phone: order.photographerPhone,
          current_holder_id: order.photographerId
        }, 'id', orderId);
      }
      return true;
    }
    return false;
  }

  // 2.1 Fotograf xarajat qo'shadi (taksi, studiya va h.k.)
  addPhotoCost(orderId, costData) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      const parsedAmt = Store.parseMoney(costData.amount);
      const costId = 'cost_' + Date.now();
      const newCost = {
        id: costId,
        amount: parsedAmt,
        title: costData.title,
        proofLink: costData.proofLink || '',
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'pending' // Buxgalter tasdiqlashi uchun
      };
      if (!order.costs) order.costs = [];
      order.costs.push(newCost);

      const expObj = {
        id: 'exp_' + Date.now(),
        orderId: order.id,
        requesterId: this.currentUser.id,
        requesterName: this.currentUser.name,
        requesterRole: 'Fotograf',
        amount: parsedAmt,
        description: costData.title,
        proofLink: costData.proofLink || '',
        date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
      };

      // Buxgalter Inboxga ham tushadi
      this.expenseRequests.unshift(expObj);
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('expenses', 'insert', SupabaseService.mapExpenseToDb(expObj));
      }
      return true;
    }
    return false;
  }

  // 2.2 Fotograf ishni tugatadi -> edit_queue
  completePhotoOrder(orderId, realStudentCount, photoDriveLink, clientCashAmount = 0) {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'photo_active') {
      order.realStudentCount = Number(realStudentCount);
      order.photoDriveLink = photoDriveLink;
      order.status = 'edit_queue'; // Edit navbatda

      const cashAmt = Store.parseMoney(clientCashAmount);
      if (cashAmt > 0) {
        order.photographerCollectedAmount = (order.photographerCollectedAmount || 0) + cashAmt;
        order.collectedAmount = Math.max(order.collectedAmount || 0, (order.collectedAmount || 0) + cashAmt);
      }

      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('orders', 'update', SupabaseService.mapOrderToDb(order), 'id', orderId);
      }
      return true;
    }
    return false;
  }

  // 3. Dizayner (Editor) navbatdan ishni o'ziga oladi -> edit_active
  claimEditOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'edit_queue') {
      order.status = 'edit_active';
      order.editorId = this.currentUser.id;
      order.editorName = this.currentUser.name;
      order.editorPhone = this.currentUser.phone;
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('orders', 'update', {
          status: 'edit_active',
          editor_id: order.editorId,
          editor_name: order.editorName,
          editor_phone: order.editorPhone,
          current_holder_id: order.editorId
        }, 'id', orderId);
      }
      return true;
    }
    return false;
  }

  // 3.1 Dizayner ishni tugatadi -> make_queue (Proof link va Print link majburiy!)
  completeEditOrder(orderId, proofLink, printLink) {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'edit_active') {
      if (!proofLink || !printLink) return false;
      order.editorProofLink = proofLink;
      order.editorPrintLink = printLink;
      order.editorFinishedAt = new Date().toISOString();
      order.status = 'make_queue'; // Yig'ish navbatda
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('orders', 'update', {
          editor_proof_link: proofLink,
          editor_print_link: printLink,
          editor_finished_at: order.editorFinishedAt,
          status: 'make_queue',
          current_holder_id: null
        }, 'id', orderId);
      }
      return true;
    }
    return false;
  }

  // 4. Albom yasovchi navbatdan ishni o'ziga oladi -> make_active
  claimMakeOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'make_queue') {
      order.status = 'make_active';
      order.makerId = this.currentUser.id;
      order.makerName = this.currentUser.name;
      order.makerPhone = this.currentUser.phone;
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('orders', 'update', {
          status: 'make_active',
          maker_id: order.makerId,
          maker_name: order.makerName,
          maker_phone: order.makerPhone,
          current_holder_id: order.makerId
        }, 'id', orderId);
      }
      return true;
    }
    return false;
  }

  // 4.1 Albom yasovchi brak yoki xarajat qo'shadi
  addMakerCost(orderId, costData) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      const parsedAmt = Store.parseMoney(costData.amount);
      const costId = 'cost_' + Date.now();
      const newCost = {
        id: costId,
        amount: parsedAmt,
        title: costData.title,
        proofLink: costData.proofLink || '',
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'pending'
      };
      if (!order.costs) order.costs = [];
      order.costs.push(newCost);

      const expObj = {
        id: 'exp_' + Date.now(),
        orderId: order.id,
        requesterId: this.currentUser.id,
        requesterName: this.currentUser.name,
        requesterRole: 'Albom yasovchi',
        amount: parsedAmt,
        description: costData.title,
        proofLink: costData.proofLink || '',
        date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
      };

      this.expenseRequests.unshift(expObj);
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('expenses', 'insert', SupabaseService.mapExpenseToDb(expObj));
      }
      return true;
    }
    return false;
  }

  // Buxgalter bevosita guruhga xarajat kiritadi (pechat, transport, studiya va h.k.)
  addOrderExpense(orderId, { amount, title, proofLink, category }) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: "Buyurtma topilmadi" };
    if (!order.costs) order.costs = [];

    const numAmt = Store.parseMoney(amount);
    if (!numAmt || numAmt <= 0) {
      return { success: false, message: "Iltimos, xarajat summasini toʻgʻri kiriting!" };
    }

    const newCost = {
      id: 'cost_' + Date.now(),
      amount: numAmt,
      title: (title || 'Guruh xarajati').trim(),
      category: category || 'ishlab_chiqarish',
      proofLink: (proofLink || '').trim(),
      date: new Date().toLocaleDateString('ru-RU'),
      status: 'approved', // Buxgalter kiritgan xarajat to'g'ridan-to'g'ri tasdiqlangan
      createdByName: 'Buxgalter'
    };

    order.costs.push(newCost);

    const expObj = {
      id: newCost.id,
      orderId: order.id,
      requesterId: this.currentUser ? this.currentUser.id : null,
      requesterName: 'Buxgalter',
      requesterRole: 'Buxgalter',
      amount: numAmt,
      description: newCost.title,
      category: newCost.category,
      proofLink: newCost.proofLink,
      date: newCost.date,
      status: 'approved'
    };
    this.expenseRequests.unshift(expObj);

    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('expenses', 'insert', SupabaseService.mapExpenseToDb(expObj));
    }
    return { success: true, message: "Guruh xarajati muvaffaqiyatli saqlandi va tannarxga kiritildi!" };
  }

  deleteOrderExpense(orderId, costId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order || !order.costs) return false;
    order.costs = order.costs.filter(c => c.id !== costId);
    this.expenseRequests = this.expenseRequests.filter(e => e.id !== costId);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('expenses', 'delete', null, 'id', costId);
    }
    return true;
  }

  // 4.2 Albom yasovchi ishni tugatadi -> ready (Javonda)
  completeMakeOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'make_active') {
      order.status = 'ready'; // TAYYOR (Javonda)
      order.makerFinishedAt = new Date().toISOString();
      order.readyAt = new Date().toISOString();
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('orders', 'update', {
          status: 'ready',
          maker_finished_at: order.makerFinishedAt,
          ready_at: order.readyAt,
          current_holder_id: null
        }, 'id', orderId);
      }
      return true;
    }
    return false;
  }

  // 5. Sotuvchi albomni javondan oladi va mijozga topshiradi -> delivered
  deliverOrder(orderId, collectedAmount, paymentMethod) {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'ready') {
      order.status = 'delivered'; // Mijozga topshirildi
      const sellerInput = Store.parseMoney(collectedAmount);
      const photoCollected = order.photographerCollectedAmount || 0;
      const studentNum = order.realStudentCount || order.studentCount || 0;
      const totalContract = studentNum * (order.pricePerStudent || 0);

      // Agar fotograf avval qisman pul olgan bo'lsa va sotuvchi qoldiqni kiritgan bo'lsa:
      if (photoCollected > 0 && sellerInput < totalContract) {
        order.sellerCollectedAmount = sellerInput;
        order.collectedAmount = photoCollected + sellerInput;
      } else {
        order.sellerCollectedAmount = Math.max(0, sellerInput - photoCollected);
        order.collectedAmount = sellerInput;
      }

      order.paymentMethod = paymentMethod; // 'cash' | 'card'
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('orders', 'update', SupabaseService.mapOrderToDb(order), 'id', orderId);
      }
      return true;
    }
    return false;
  }

  // 5.1 Sotuvchi buxgalterga pul topshiradi (50%, 100% yoki Boshqa summa)
  submitCashToAccountant(orderId, choice = '100%', customAmount = null) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order || !(order.collectedAmount > 0)) {
      return { success: false, message: "Buyurtma topilmadi yoki yigʻilgan pul mavjud emas!" };
    }

    const totalCollected = order.collectedAmount;
    const alreadySubmitted = order.sellerSubmittedAmount || 0;
    const photoSubmitted = order.photographerSubmittedAmount || 0;
    const remainingDebt = Math.max(0, totalCollected - alreadySubmitted - photoSubmitted);

    if (remainingDebt <= 0) {
      return { success: false, message: "Ushbu guruhning barcha qarzi allaqachon toʻliq topshirilgan!" };
    }

    // Anti-duplicate: buxgalter tasdiqlamaguncha yoki rad etmaguncha qayta soʻrov yuborish bloklanadi
    if ((order.sellerSubmittedPending || 0) > 0) {
      return { 
        success: false, 
        message: "Ushbu guruh boʻyicha avval yuborilgan toʻlov soʻrovi buxgalter tasdigʻida kutilmoqda. Qayta soʻrov yuborish mumkin emas!" 
      };
    }

    let submitAmount = 0;
    let label = 'Toʻlov';

    if (choice === '50%') {
      // Guruh jami tushumining 50% qismini hisoblaydi
      const halfTotal = Math.round(totalCollected * 0.5);
      submitAmount = Math.min(halfTotal, remainingDebt);
      label = '50% toʻlov';
    } else if (choice === '100%') {
      // Qolgan to'liq 100% summani hisoblaydi
      submitAmount = remainingDebt;
      label = '100% toʻlov';
    } else {
      // Boshqa summa (Custom input)
      submitAmount = Store.parseMoney(customAmount !== null && customAmount !== undefined ? customAmount : choice);
      label = 'Ixtiyoriy toʻlov';
    }

    if (!submitAmount || isNaN(submitAmount) || submitAmount <= 0) {
      return { success: false, message: "Iltimos, toʻgʻri summa kiriting (0 dan katta boʻlishi kerak)!" };
    }

    if (submitAmount > remainingDebt) {
      return {
        success: false,
        message: `Kiritilgan summa qoldiq qarzdan (${Store.formatMoney(remainingDebt)}) koʻp boʻlishi mumkin emas!`
      };
    }

    order.sellerSubmittedPending = (order.sellerSubmittedPending || 0) + submitAmount;

    // Kun, oy, soat va daqiqasigacha (masalan: 29-Oktabr 2026, 16:45)
    const now = new Date();
    const monthsUz = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const formattedDate = `${now.getDate()}-${monthsUz[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSub = {
      id: 'sub_' + Date.now(),
      orderId: order.id,
      sellerId: order.sellerId,
      sellerName: order.sellerName,
      university: order.university,
      group: order.group,
      amount: submitAmount,
      percentage: label,
      paymentMethod: order.paymentMethod || 'cash',
      date: formattedDate,
      timestamp: Date.now(),
      status: 'pending' // status: 'pending' (Kutilmoqda)
    };

    this.cashSubmissions.unshift(newSub);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('payments', 'insert', SupabaseService.mapPaymentToDb(newSub));
      this.syncDb('orders', 'update', SupabaseService.mapOrderToDb(order), 'id', order.id);
    }
    return { success: true, submission: newSub, amount: submitAmount };
  }

  // Fotograf mijozdan olgan naqd pulni buxgalterga topshirish so'rovi
  submitPhotographerCash(orderId, amount) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: "Buyurtma topilmadi!" };

    if ((order.photographerSubmittedPending || 0) > 0) {
      return { 
        success: false, 
        message: "Ushbu guruh boʻyicha avval yuborilgan toʻlov soʻrovi buxgalter tasdigʻida kutilmoqda. Qayta soʻrov yuborish mumkin emas!" 
      };
    }

    const totalCollected = order.photographerCollectedAmount || 0;
    const submitted = order.photographerSubmittedAmount || 0;
    const remainingDebt = Math.max(0, totalCollected - submitted);

    const submitAmount = Store.parseMoney(amount);
    if (!submitAmount || isNaN(submitAmount) || submitAmount <= 0) {
      return { success: false, message: "Iltimos, toʻgʻri summa kiriting (0 dan katta boʻlishi kerak)!" };
    }

    if (submitAmount > remainingDebt) {
      return {
        success: false,
        message: `Kiritilgan summa qoldiq qarzdan (${Store.formatMoney(remainingDebt)}) koʻp boʻlishi mumkin emas!`
      };
    }

    order.photographerSubmittedPending = (order.photographerSubmittedPending || 0) + submitAmount;

    const now = new Date();
    const monthsUz = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const formattedDate = `${now.getDate()}-${monthsUz[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSub = {
      id: 'sub_' + Date.now(),
      orderId: order.id,
      role: 'photographer',
      sellerId: this.currentUser ? this.currentUser.id : order.photographerId,
      sellerName: this.currentUser ? this.currentUser.name : (order.photographerName || 'Fotograf'),
      university: order.university,
      group: order.group,
      amount: submitAmount,
      percentage: 'Fotograf qabul qilgan pul',
      region: order.region || 'Toshkent shahri',
      paymentMethod: 'cash',
      date: formattedDate,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.cashSubmissions.unshift(newSub);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('payments', 'insert', SupabaseService.mapPaymentToDb(newSub));
      this.syncDb('orders', 'update', SupabaseService.mapOrderToDb(order), 'id', order.id);
    }
    return { success: true, submission: newSub, amount: submitAmount };
  }

  // Aniq bir guruhga tegishli bo'lmagan "Umumiy xarajat" jo'natish (Sotuvchi va Fotograf)
  addGeneralExpense(data) {
    const user = this.currentUser || {};
    const roleNames = {
      seller: 'Sotuvchi',
      photographer: 'Fotograf',
      editor: 'Dizayner',
      maker: 'Albomchi',
      ceo: 'Rahbar',
      accountant: 'Buxgalter',
      worker: 'Oddiy ishchi'
    };
    const now = new Date();
    const monthsUz = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const formattedDate = `${now.getDate()}-${monthsUz[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const expObj = {
      id: 'c_' + Date.now(),
      orderId: null,
      orderGroup: 'Umumiy korporativ xarajat',
      requesterId: user.id || 'usr_unknown',
      requesterName: user.name || 'Xodim',
      requesterRole: roleNames[user.role] || user.role || 'Xodim',
      region: (user.region && user.region !== 'all') ? user.region : (data.region || 'Toshkent shahri'),
      amount: Store.parseMoney(data.amount) || 0,
      description: data.title || data.description || 'Umumiy xarajat',
      proofLink: data.receiptUrl || data.proofLink || '',
      category: data.category || 'Boshqa',
      date: formattedDate,
      status: 'pending'
    };

    this.expenseRequests.unshift(expObj);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('expenses', 'insert', SupabaseService.mapExpenseToDb(expObj));
    }
    return true;
  }

  // Xarajat kategoriyalari boshqaruvi
  getExpenseCategories() {
    if (!this.expenseCategories || this.expenseCategories.length === 0) {
      this.expenseCategories = ['Ofis va Ijara', 'Taksi va Transport', 'Pechat va Materiallar', 'Oylik va Gonorar', 'Kanselyariya va Texnika', 'Tushlik va Ovqatlanish', 'Boshqa'];
    }
    return this.expenseCategories;
  }

  addExpenseCategory(name) {
    const clean = (name || '').trim();
    if (!clean) return false;
    if (!this.expenseCategories) this.expenseCategories = this.getExpenseCategories();
    if (!this.expenseCategories.includes(clean)) {
      this.expenseCategories.push(clean);
      this.save();
      return true;
    }
    return false;
  }

  deleteExpenseCategory(name) {
    const clean = (name || '').trim();
    if (!this.expenseCategories) this.expenseCategories = this.getExpenseCategories();
    const idx = this.expenseCategories.indexOf(clean);
    if (idx !== -1) {
      this.expenseCategories.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Rahbarga (CEO) dividend yoki pul chiqarish
  addCeoPayout(data) {
    const now = new Date();
    const monthsUz = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const formattedDate = `${now.getDate()}-${monthsUz[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const payoutAmount = Store.parseMoney(data.amount) || 0;
    const activeMonthKey = /^\d{4}-\d{2}$/.test(this.selectedSeasonId || '') ? this.selectedSeasonId : this.getCurrentMonthKey();
    const logObj = {
      id: 'pay_' + Date.now(),
      userId: data.ceoId,
      userName: data.ceoName,
      role: 'ceo',
      type: 'dividend',
      amount: payoutAmount,
      comment: data.comment || 'Dividend / Rahbar ulushi',
      note: data.comment || 'Dividend / Rahbar ulushi',
      region: data.region || 'all',
      monthKey: activeMonthKey,
      seasonId: activeMonthKey,
      date: formattedDate,
      createdAt: new Date().toISOString()
    };

    if (!this.payrollLogs) this.payrollLogs = [];
    this.payrollLogs.unshift(logObj);

    const ceo = this.users.find(u => u.id === data.ceoId);
    if (ceo) {
      ceo.paidAmount = (ceo.paidAmount || 0) + payoutAmount;
    }

    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('payroll_logs', 'insert', {
        id: logObj.id,
        user_id: logObj.userId,
        user_name: logObj.userName,
        role: logObj.role,
        type: logObj.type,
        amount: logObj.amount,
        note: logObj.note,
        date: logObj.date
      });
    }
    return { success: true, log: logObj };
  }

  // ==========================================
  // BUXGALTER INBOX VA TASDIQLASH MARKAZI
  // ==========================================

  // Sotuvchi yoki Fotograf topshirgan naqd pulni tasdiqlash
  approveCashSubmission(subId) {
    const sub = this.cashSubmissions.find(s => s.id === subId);
    if (sub && sub.status === 'pending') {
      sub.status = 'approved';
      sub.confirmedBy = this.currentUser ? this.currentUser.id : null;
      sub.confirmedAt = new Date().toISOString();
      const order = this.orders.find(o => o.id === sub.orderId);
      if (order) {
        if (sub.role === 'photographer') {
          order.photographerSubmittedAmount = (order.photographerSubmittedAmount || 0) + sub.amount;
          order.photographerSubmittedPending = Math.max(0, (order.photographerSubmittedPending || 0) - sub.amount);
          // E'tibor: Bu summa avtomatik tarzda sotuvchining o'sha guruh uchun buxgalterga
          // berishi kerak bo'lgan qarzidan ayiriladi (chunki remainingDebt da minus qilinadi).
        } else {
          order.sellerSubmittedAmount = (order.sellerSubmittedAmount || 0) + sub.amount;
          order.sellerSubmittedPending = Math.max(0, (order.sellerSubmittedPending || 0) - sub.amount);
        }
        
        // Jami buxgalterga topshirilgan to'lov
        const totalPaidToAccountant = (order.sellerSubmittedAmount || 0) + (order.photographerSubmittedAmount || 0);
        if (totalPaidToAccountant >= order.collectedAmount && order.collectedAmount > 0) {
          order.status = 'closed';
        }
      }
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('payments', 'update', {
          status: 'approved',
          confirmed_by: sub.confirmedBy,
          confirmed_at: sub.confirmedAt
        }, 'id', subId);
        if (order) {
          this.syncDb('orders', 'update', SupabaseService.mapOrderToDb(order), 'id', order.id);
        }
      }
      return true;
    }
    return false;
  }

  rejectCashSubmission(subId) {
    const sub = this.cashSubmissions.find(s => s.id === subId);
    if (sub && sub.status === 'pending') {
      sub.status = 'rejected';
      const order = this.orders.find(o => o.id === sub.orderId);
      if (order) {
        if (sub.role === 'photographer') {
          order.photographerSubmittedPending = Math.max(0, (order.photographerSubmittedPending || 0) - sub.amount);
        } else {
          order.sellerSubmittedPending = Math.max(0, (order.sellerSubmittedPending || 0) - sub.amount);
        }
      }
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('payments', 'update', { status: 'rejected' }, 'id', subId);
        if (order) {
          this.syncDb('orders', 'update', SupabaseService.mapOrderToDb(order), 'id', order.id);
        }
      }
      return true;
    }
    return false;
  }

  // Xarajat so'rovini tasdiqlash yoki rad etish
  approveExpense(expId, category = null) {
    const exp = this.expenseRequests.find(e => e.id === expId);
    if (exp && exp.status === 'pending') {
      exp.status = 'approved';
      if (category) {
        exp.category = category;
      }
      const order = this.orders.find(o => o.id === exp.orderId);
      if (order && order.costs) {
        const costItem = order.costs.find(c => c.title === exp.description);
        if (costItem) {
          costItem.status = 'approved';
          if (category) costItem.category = category;
        }
      }
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('expenses', 'update', {
          status: 'approved',
          category: exp.category || 'Boshqa',
          reviewed_by: this.currentUser ? this.currentUser.id : null,
          reviewed_at: new Date().toISOString()
        }, 'id', expId);
      }
      return true;
    }
    return false;
  }

  rejectExpense(expId) {
    const exp = this.expenseRequests.find(e => e.id === expId);
    if (exp && exp.status === 'pending') {
      exp.status = 'rejected';
      const order = this.orders.find(o => o.id === exp.orderId);
      if (order && order.costs) {
        const costItem = order.costs.find(c => c.title === exp.description);
        if (costItem) costItem.status = 'rejected';
      }
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('expenses', 'update', {
          status: 'rejected',
          reviewed_by: this.currentUser ? this.currentUser.id : null,
          reviewed_at: new Date().toISOString()
        }, 'id', expId);
      }
      return true;
    }
    return false;
  }

  // Xodimga pul to'lash (Oylik, avans yoki gonorar - Viloyat bog'lanishi bilan)
  payEmployee(userId, amount, type, note, region = 'all') {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      const payAmount = Store.parseMoney(amount);
      if (type === 'advance') {
        user.advanceTaken = (user.advanceTaken || 0) + payAmount;
      } else if (user.role === 'seller') {
        user.paidCommission = (user.paidCommission || 0) + payAmount;
        user.paidAmount = user.paidCommission;
      } else {
        user.paidAmount = (user.paidAmount || 0) + payAmount;
      }

      const activeMonthKey = /^\d{4}-\d{2}$/.test(this.selectedSeasonId || '') ? this.selectedSeasonId : this.getCurrentMonthKey();
      const log = {
        id: 'pay_' + Date.now(),
        userId: user.id,
        userName: user.name,
        role: user.role,
        amount: payAmount,
        type: type, // 'salary' | 'advance' | 'commission' | 'piecework'
        region: region || 'all',
        monthKey: activeMonthKey,
        seasonId: activeMonthKey,
        rawCreatedAt: new Date().toISOString(),
        date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        note: note || ''
      };

      this.payrollLogs.unshift(log);
      this.save();
      if (typeof SupabaseService !== 'undefined') {
        this.syncDb('payroll_logs', 'insert', {
          id: log.id,
          user_id: user.id,
          user_name: user.name,
          role: user.role,
          amount: payAmount,
          type: type,
          note: log.note,
          date: log.date
        });
        this.syncDb('profiles', 'update', SupabaseService.mapProfileToDb(user), 'id', user.id);
      }
      return true;
    }
    return false;
  }

  // Kompaniya doimiy xarajatini qo'shish (Viloyat va Oy/Yil bo'yicha)
  addCompanyExpense(data) {
    const activeMonthKey = /^\d{4}-\d{2}$/.test(this.selectedSeasonId || '') ? this.selectedSeasonId : this.getCurrentMonthKey();
    const newExp = {
      id: 'compexp_' + Date.now(),
      title: data.title,
      amount: Store.parseMoney(data.amount),
      category: data.category || 'other',
      region: data.region || 'all',
      monthKey: activeMonthKey,
      seasonId: activeMonthKey,
      rawCreatedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('ru-RU'),
      note: data.note || ''
    };
    this.companyExpenses.unshift(newExp);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('company_expenses', 'insert', {
        id: newExp.id,
        title: newExp.title,
        amount: newExp.amount,
        category: newExp.category,
        note: newExp.note,
        date: newExp.date
      });
    }
    return newExp;
  }

  // Kompaniya xarajatini o'chirish
  deleteCompanyExpense(expId) {
    this.companyExpenses = (this.companyExpenses || []).filter(e => e.id !== expId);
    this.save();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('company_expenses', 'delete', null, 'id', expId);
    }
    return true;
  }

  // Rahbar uchun: istalgan orderni tahrirlash / statusini majburiy o'zgartirish (Override)
  overrideOrder(orderId, updateData) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return false;

    // 1. Agar Mas'ul Sotuvchi o'zgartirilsa
    if (updateData.sellerId !== undefined && updateData.sellerId !== order.sellerId) {
      if (updateData.sellerId) {
        const newSeller = this.users.find(u => u.id === updateData.sellerId);
        if (newSeller) {
          order.sellerId = newSeller.id;
          order.sellerName = newSeller.name;
          order.sellerPhone = newSeller.phone;

          // Ushbu buyurtmaning kassa topshiriqlari (payments) ham yangi sotuvchiga o'tadi
          this.cashSubmissions.forEach(sub => {
            if (sub.orderId === orderId) {
              sub.sellerId = newSeller.id;
              sub.sellerName = newSeller.name;
              if (typeof SupabaseService !== 'undefined') {
                this.syncDb('payments', 'update', { seller_id: newSeller.id, seller_name: newSeller.name }, 'id', sub.id);
              }
            }
          });
        }
      } else {
        order.sellerId = null;
        order.sellerName = null;
        order.sellerPhone = null;
      }
    }

    // 2. Agar Mas'ul Fotograf o'zgartirilsa
    if (updateData.photographerId !== undefined && updateData.photographerId !== order.photographerId) {
      if (updateData.photographerId) {
        const newPhoto = this.users.find(u => u.id === updateData.photographerId);
        if (newPhoto) {
          order.photographerId = newPhoto.id;
          order.photographerName = newPhoto.name;
          order.photographerPhone = newPhoto.phone;
        }
      } else {
        order.photographerId = null;
        order.photographerName = null;
        order.photographerPhone = null;
      }
    }

    // 3. Agar Mas'ul Dizayner o'zgartirilsa
    if (updateData.editorId !== undefined && updateData.editorId !== order.editorId) {
      if (updateData.editorId) {
        const newEditor = this.users.find(u => u.id === updateData.editorId);
        if (newEditor) {
          order.editorId = newEditor.id;
          order.editorName = newEditor.name;
          order.editorPhone = newEditor.phone;
        }
      } else {
        order.editorId = null;
        order.editorName = null;
        order.editorPhone = null;
      }
    }

    // 4. Agar Mas'ul Albom yasovchi o'zgartirilsa
    if (updateData.makerId !== undefined && updateData.makerId !== order.makerId) {
      if (updateData.makerId) {
        const newMaker = this.users.find(u => u.id === updateData.makerId);
        if (newMaker) {
          order.makerId = newMaker.id;
          order.makerName = newMaker.name;
          order.makerPhone = newMaker.phone;
        }
      } else {
        order.makerId = null;
        order.makerName = null;
        order.makerPhone = null;
      }
    }

    // Qolgan ma'lumotlarni birlashtirish
    Object.assign(order, updateData);

    // currentHolderId ni statusga qarab to'g'rilash
    if (order.status === 'photo_active') order.currentHolderId = order.photographerId;
    else if (order.status === 'edit_active') order.currentHolderId = order.editorId;
    else if (order.status === 'make_active') order.currentHolderId = order.makerId;
    else if (order.status === 'ready' || order.status === 'delivered') order.currentHolderId = order.sellerId;

    this.save();
    this.notify();
    if (typeof SupabaseService !== 'undefined') {
      this.syncDb('orders', 'update', SupabaseService.mapOrderToDb(order), 'id', orderId);
    }
    return true;
  }

  // ==========================================
  // REAL-TIME FINANSIYAL VA STATISTIKA HISOB-KITOBLARI (OY/YIL VA CARRY-OVER MANTIG'I BILAN)
  // ==========================================

  // Xodimning oylar kesimidagi avans va to'lovlarini ajratib beruvchi yordamchi metod
  getEmployeePayoutsSplit(userId, periodId = null, region = 'all') {
    const pid = this.normalizePeriodId(periodId !== null ? periodId : (this.selectedSeasonId || this.getCurrentMonthKey()));
    const emp = (this.users || []).find(u => u.id === userId);
    const currentMonthKey = this.getCurrentMonthKey();

    let periodStartMonth = pid;
    let periodEndMonth = pid;
    if (!pid || pid === 'all') {
      periodStartMonth = '0000-01';
      periodEndMonth = '9999-12';
    } else if (pid.startsWith('year_')) {
      const y = pid.replace('year_', '');
      periodStartMonth = `${y}-01`;
      periodEndMonth = `${y}-12`;
    }

    const userLogs = (this.payrollLogs || []).filter(p =>
      p.userId === userId &&
      (!region || region === 'all' || !p.region || p.region === 'all' || p.region === region)
    );

    let prevAdvance = 0;
    let prevPaid = 0;
    let periodAdvance = 0;
    let periodPaid = 0;

    for (const log of userLogs) {
      const mk = this.getItemMonthKey(log);
      const amt = Number(log.amount) || 0;
      if (mk < periodStartMonth) {
        if (log.type === 'advance') prevAdvance += amt;
        else prevPaid += amt;
      } else if (mk >= periodStartMonth && mk <= periodEndMonth) {
        if (log.type === 'advance') periodAdvance += amt;
        else periodPaid += amt;
      }
    }

    // Agar profilning o'zida eski (payrollLogs ga tushmagan) to'lov/avans mavjud bo'lsa, uni ham inobatga olamiz
    if (!region || region === 'all') {
      const allLogsForUser = (this.payrollLogs || []).filter(p => p.userId === userId);
      let allLoggedAdvance = 0;
      let allLoggedPaid = 0;
      for (const l of allLogsForUser) {
        if (l.type === 'advance') allLoggedAdvance += (Number(l.amount) || 0);
        else allLoggedPaid += (Number(l.amount) || 0);
      }

      const profileAdvance = Number(emp?.advanceTaken) || 0;
      const profilePaid = emp?.role === 'seller'
        ? (Number(emp?.paidCommission) || Number(emp?.paidAmount) || 0)
        : (Number(emp?.paidAmount) || 0);

      const unloggedAdv = Math.max(0, profileAdvance - allLoggedAdvance);
      const unloggedPaid = Math.max(0, profilePaid - allLoggedPaid);

      if (unloggedAdv > 0 || unloggedPaid > 0) {
        if (currentMonthKey < periodStartMonth) {
          prevAdvance += unloggedAdv;
          prevPaid += unloggedPaid;
        } else if (currentMonthKey >= periodStartMonth && currentMonthKey <= periodEndMonth) {
          periodAdvance += unloggedAdv;
          periodPaid += unloggedPaid;
        }
      }
    }

    return {
      periodStartMonth,
      periodEndMonth,
      prevAdvance,
      prevPaid,
      prevTotalPaid: prevAdvance + prevPaid,
      periodAdvance,
      periodPaid,
      periodTotalPaid: periodAdvance + periodPaid
    };
  }

  // Xodimning ishga kirgan sanasi va 30 kunlik standart oy bo'yicha 1-oylik kunbay parametrlarini aniqlash
  getEmployeeStartDateInfo(emp, myAllRegionOrders = []) {
    const currentMonthKey = this.getCurrentMonthKey();
    let startMonth = currentMonthKey;
    let startDay = 1;
    let startDateIso = `${currentMonthKey}-01`;

    const rawDateStr = emp?.startDate || emp?.createdAt || '';
    if (rawDateStr) {
      const s = String(rawDateStr).trim();
      const isoDateMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoDateMatch) {
        if (s.includes('T')) {
          const dt = new Date(s);
          if (!isNaN(dt.getTime())) {
            const ly = dt.getFullYear();
            const lm = String(dt.getMonth() + 1).padStart(2, '0');
            const ld = dt.getDate();
            startMonth = `${ly}-${lm}`;
            startDay = ld;
            startDateIso = `${ly}-${lm}-${String(ld).padStart(2, '0')}`;
          }
        } else {
          const y = parseInt(isoDateMatch[1], 10);
          const m = parseInt(isoDateMatch[2], 10);
          const d = parseInt(isoDateMatch[3], 10);
          startMonth = `${y}-${String(m).padStart(2, '0')}`;
          startDay = d;
          startDateIso = `${startMonth}-${String(d).padStart(2, '0')}`;
        }
      } else {
        const dmyMatch = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
        if (dmyMatch) {
          const d = parseInt(dmyMatch[1], 10);
          const m = parseInt(dmyMatch[2], 10);
          const y = parseInt(dmyMatch[3], 10);
          startMonth = `${y}-${String(m).padStart(2, '0')}`;
          startDay = d;
          startDateIso = `${startMonth}-${String(d).padStart(2, '0')}`;
        }
      }
    } else if (emp?.startMonth && /^\d{4}-\d{2}$/.test(emp.startMonth)) {
      startMonth = emp.startMonth;
      startDay = 1;
      startDateIso = `${startMonth}-01`;
    }

    // Agar xodimning oldingi oylarda buyurtmasi yoki to'lov logi mavjud bo'lsa
    const earlierMonths = [];
    for (const o of myAllRegionOrders) {
      const mk = this.getItemMonthKey(o);
      if (mk && mk < startMonth) earlierMonths.push(mk);
    }
    for (const l of (this.payrollLogs || [])) {
      if (l.userId === emp?.id) {
        const mk = this.getItemMonthKey(l);
        if (mk && mk < startMonth) earlierMonths.push(mk);
      }
    }
    if (earlierMonths.length > 0) {
      earlierMonths.sort();
      startMonth = earlierMonths[0];
      startDay = 1;
      startDateIso = `${startMonth}-01`;
    }

    // 30 kunlik oylik hisobda:
    // Agar oyning 1-sanasidan kirgan bo'lsa -> 30 kun (to'liq oylik).
    // Agar oyning N-sanasida (masalan, 12-sanasida) kirgan bo'lsa -> 30 - 12 = 18 kunlik maosh hisoblanadi!
    const isProratedFirstMonth = startDay > 1;
    const firstMonthWorkedDays = isProratedFirstMonth ? Math.max(1, 30 - startDay) : 30;

    return {
      startDateIso,
      startMonth,
      startDay,
      isProratedFirstMonth,
      firstMonthWorkedDays
    };
  }

  // Berilgan oy (monthKey) uchun oylik stavkadagi xodimning 30 kunlik tizimdagi hisoblangan maoshi
  getSalariedMonthAccrual(monthKey, baseMonthlySalary, startInfo) {
    const base = Number(baseMonthlySalary) || 0;
    const dailyRate = Math.round(base / 30);

    if (!monthKey || monthKey < startInfo.startMonth) {
      return {
        amount: 0,
        workedDays: 0,
        totalDays: 30,
        dailyRate,
        isProrated: false,
        notStartedYet: true
      };
    }

    if (monthKey === startInfo.startMonth && startInfo.isProratedFirstMonth) {
      const workedDays = startInfo.firstMonthWorkedDays;
      const amount = Math.round((base / 30) * workedDays);
      return {
        amount,
        workedDays,
        totalDays: 30,
        dailyRate,
        isProrated: true,
        notStartedYet: false
      };
    }

    return {
      amount: base,
      workedDays: 30,
      totalDays: 30,
      dailyRate,
      isProrated: false,
      notStartedYet: false
    };
  }

  // Oylik maoshga (Stavka / salary) ishlaydigan xodimlar uchun Oyma-oy hisob, 1-oylik kunbay (30 kundan) va Carry-over
  computeSalariedCarryOver(emp, targetPeriod, baseMonthlySalary, payouts, myAllRegionOrders = []) {
    const currentMonthKey = this.getCurrentMonthKey();
    const startInfo = this.getEmployeeStartDateInfo(emp, myAllRegionOrders);
    const empStartMonth = startInfo.startMonth;
    const dailyRate = Math.round((Number(baseMonthlySalary) || 0) / 30);

    // 1. Tanlangan davrdan oldingi oylardagi yopilmagan qoldiq (Carry-over)
    let carryOverBalance = 0;
    if (empStartMonth < payouts.periodStartMonth) {
      const prevMonths = this.getMonthsBetween(empStartMonth, payouts.periodStartMonth)
        .filter(m => m < payouts.periodStartMonth);
      let prevAccruedSalary = 0;
      for (const m of prevMonths) {
        prevAccruedSalary += this.getSalariedMonthAccrual(m, baseMonthlySalary, startInfo).amount;
      }
      carryOverBalance = prevAccruedSalary - payouts.prevTotalPaid;
    } else {
      carryOverBalance = 0 - payouts.prevTotalPaid;
    }

    // 2. Tanlangan oy (yoki yil) uchun hisoblangan maosh
    let periodEarned = 0;
    let workedDays = 30;
    let totalDays = 30;
    let isProrated = false;
    let notStartedYet = false;

    if (targetPeriod && targetPeriod.startsWith('year_')) {
      const y = targetPeriod.replace('year_', '');
      const startM = empStartMonth > `${y}-01` ? empStartMonth : `${y}-01`;
      const endM = currentMonthKey < `${y}-12` ? currentMonthKey : `${y}-12`;
      if (startM <= endM) {
        const activeMonths = this.getMonthsBetween(startM, endM);
        let totalY = 0;
        let daysY = 0;
        for (const m of activeMonths) {
          const acc = this.getSalariedMonthAccrual(m, baseMonthlySalary, startInfo);
          totalY += acc.amount;
          daysY += acc.workedDays;
          if (acc.isProrated) isProrated = true;
        }
        periodEarned = totalY;
        workedDays = daysY;
        totalDays = activeMonths.length * 30;
      } else {
        periodEarned = 0;
        workedDays = 0;
        notStartedYet = true;
      }
    } else if (!targetPeriod || targetPeriod === 'all') {
      const endM = currentMonthKey >= empStartMonth ? currentMonthKey : empStartMonth;
      const activeMonths = this.getMonthsBetween(empStartMonth, endM);
      let totalAllM = 0;
      let daysAllM = 0;
      for (const m of activeMonths) {
        const acc = this.getSalariedMonthAccrual(m, baseMonthlySalary, startInfo);
        totalAllM += acc.amount;
        daysAllM += acc.workedDays;
        if (acc.isProrated) isProrated = true;
      }
      periodEarned = totalAllM;
      workedDays = daysAllM;
      totalDays = activeMonths.length * 30;
    } else {
      const acc = this.getSalariedMonthAccrual(targetPeriod, baseMonthlySalary, startInfo);
      periodEarned = acc.amount;
      workedDays = acc.workedDays;
      totalDays = acc.totalDays;
      isProrated = acc.isProrated;
      notStartedYet = acc.notStartedYet;
    }

    const totalEarned = periodEarned + carryOverBalance;
    const netBalance = totalEarned - payouts.periodTotalPaid;

    return {
      empStartMonth,
      startDateIso: startInfo.startDateIso,
      startDay: startInfo.startDay,
      workedDays,
      totalDays,
      dailyRate,
      isProrated,
      notStartedYet,
      baseMonthlySalary: Number(baseMonthlySalary) || 0,
      periodEarned,
      carryOverBalance,
      totalEarned,
      netBalance
    };
  }

  // Sotuvchi balansi hisob-kitobi (Oyma-oy ko'rinish + uzluksiz yig'ilib boruvchi Carry-over qoldiq)
  getSellerFinance(sellerId, seasonId = null, region = 'all') {
    const targetPeriod = this.normalizePeriodId(seasonId !== null ? seasonId : (this.selectedSeasonId || this.getCurrentMonthKey()));
    const seller = this.users.find(u => u.id === sellerId);
    const payouts = this.getEmployeePayoutsSplit(sellerId, targetPeriod, region);

    const allMyRegionOrders = (this.orders || []).filter(o =>
      o.sellerId === sellerId &&
      (!region || region === 'all' || o.region === region)
    );

    const payModel = seller?.payModel || 'percent';
    const payRate = seller?.payRate !== undefined ? seller.payRate : (this.rates.sellerCommissionPercent || 10);

    let prevConfirmedEarned = 0;
    let periodConfirmedEarned = 0;
    let pendingEarned = 0;
    let totalAllCommission = 0;

    let cashInHand = 0;
    let cashSubmittedPending = 0;
    let totalCashSubmittedApproved = 0;

    const breakdown = [];

    for (const order of allMyRegionOrders) {
      const studentNum = order.realStudentCount || order.studentCount || 0;
      const orderTotal = studentNum * (order.pricePerStudent || 0);

      let commission = 0;
      if (payModel === 'per_student') {
        commission = studentNum * payRate;
      } else if (payModel === 'per_group') {
        commission = payRate;
      } else {
        commission = Math.round(orderTotal * (payRate / 100));
      }

      const isConfirmed = this.isOrder50Unlocked(order);
      const mk = this.getItemMonthKey(order);

      // Qo'ldagi naqd pul (topshirilmaguncha barcha guruhlar bo'yicha ko'rinib turadi)
      if ((order.collectedAmount || 0) > 0 && mk <= payouts.periodEndMonth) {
        const photoSubmitted = order.photographerSubmittedAmount || 0;
        const sellerSubmitted = order.sellerSubmittedAmount || 0;
        const remaining = Math.max(0, (order.collectedAmount || 0) - sellerSubmitted - photoSubmitted);
        if (remaining > 0) {
          cashInHand += remaining;
        }
        cashSubmittedPending += (order.sellerSubmittedPending || 0);
        totalCashSubmittedApproved += sellerSubmitted;
      }

      if (mk < payouts.periodStartMonth) {
        if (isConfirmed) {
          prevConfirmedEarned += commission;
        }
      } else if (mk >= payouts.periodStartMonth && mk <= payouts.periodEndMonth) {
        totalAllCommission += commission;
        if (isConfirmed) {
          periodConfirmedEarned += commission;
        } else {
          pendingEarned += commission;
        }

        breakdown.push({
          id: order.id,
          monthKey: mk,
          periodLabel: this.getPeriodLabel(mk),
          region: order.region || 'Toshkent shahri',
          group: `${(order.university || '').split(' ')[0]} - ${order.group}`,
          total: orderTotal,
          commission: commission,
          isConfirmed: isConfirmed,
          status: isConfirmed ? 'confirmed' : 'in_progress',
          statusText: isConfirmed ? 'Toʻlov 50%+ tasdiqlangan (Olishga tayyor)' : (order.status === 'delivered' ? 'Topshirilgan (Pul kutilmoqda)' : 'Jarayonda'),
          collected: order.collectedAmount || 0,
          submitted: order.sellerSubmittedAmount || 0,
          pendingSubmission: order.sellerSubmittedPending || 0
        });
      }
    }

    // Oldingi oylardan to'lanmay qolgan komissiya qoldig'i (nollanib ketmaydi, keyingi oyga o'tadi)
    const carryOverBalance = prevConfirmedEarned - payouts.prevTotalPaid;
    const confirmedEarned = periodConfirmedEarned + carryOverBalance;
    const paidCommission = payouts.periodPaid;
    const advanceTaken = payouts.periodAdvance;
    const totalPaidOut = payouts.periodTotalPaid;
    const netBalance = confirmedEarned - totalPaidOut;

    return {
      periodId: targetPeriod,
      periodLabel: this.getPeriodLabel(targetPeriod),
      periodEarned: periodConfirmedEarned,
      carryOverBalance: carryOverBalance,
      totalEarned: confirmedEarned,
      netBalance: netBalance,
      confirmedEarned: confirmedEarned,
      pendingEarned: pendingEarned,
      totalAllCommission: totalAllCommission,
      availableToWithdraw: netBalance,
      paidCommission: paidCommission,
      advanceTaken: advanceTaken,
      totalPaidOut: totalPaidOut,
      cashInHand: cashInHand,
      cashSubmittedPending: cashSubmittedPending,
      totalCashSubmittedApproved: totalCashSubmittedApproved,
      payModel,
      payRate,
      breakdown: breakdown
    };
  }

  // Sotuvchining buxgalterga topshirgan to'lovlari tarixi (Pul daftarim auditi)
  getSellerCashSubmissions(sellerId) {
    return this.cashSubmissions.filter(s => s.sellerId === sellerId);
  }

  // Fotograf moliya hisob-kitobi (Oylik stavka Carry-over va donabay uzluksiz balans bilan)
  getPhotographerFinance(photoId, seasonId = null, region = 'all') {
    const targetPeriod = this.normalizePeriodId(seasonId !== null ? seasonId : (this.selectedSeasonId || this.getCurrentMonthKey()));
    const photo = this.users.find(u => u.id === photoId);
    const payouts = this.getEmployeePayoutsSplit(photoId, targetPeriod, region);

    const allMyRegionOrders = (this.orders || []).filter(o =>
      o.photographerId === photoId &&
      (!region || region === 'all' || o.region === region)
    );
    const myOrders = allMyRegionOrders.filter(o => this.matchesPeriod(o, targetPeriod));

    const payModel = photo?.payModel || 'salary';
    const payRate = photo?.payRate !== undefined ? photo.payRate : (photo?.monthlySalary || this.rates.photographerSalary || 6000000);

    const paid = payouts.periodPaid;
    const advanceOnly = payouts.periodAdvance;
    const advance = payouts.periodTotalPaid;

    let periodEarned = 0;
    let carryOverBalance = 0;
    let totalEarned = 0;
    let confirmedEarned = 0;
    let pendingEarned = 0;
    let available = 0;
    let salaryMeta = null;
    const breakdown = [];

    if (payModel === 'salary') {
      const isActiveInRegion = !region || region === 'all' || photo?.region === region || allMyRegionOrders.length > 0;
      const baseSalary = isActiveInRegion ? payRate : 0;
      const salCalc = this.computeSalariedCarryOver(photo, targetPeriod, baseSalary, payouts, allMyRegionOrders);
      salaryMeta = salCalc;

      periodEarned = salCalc.periodEarned;
      carryOverBalance = salCalc.carryOverBalance;
      totalEarned = salCalc.totalEarned;
      confirmedEarned = salCalc.totalEarned;
      available = salCalc.netBalance;

      for (const o of myOrders) {
        const studentNum = o.realStudentCount || o.studentCount || 0;
        const isCompleted = o.status !== 'photo_active' && o.status !== 'photo_queue';
        breakdown.push({
          id: o.id,
          monthKey: this.getItemMonthKey(o),
          region: o.region || 'Toshkent shahri',
          group: `${(o.university || '').split(' ')[0]} - ${o.group}`,
          students: studentNum,
          amount: 0,
          isCompleted,
          isUnlocked: isCompleted
        });
      }
    } else {
      let prevConfirmed = 0;
      for (const o of allMyRegionOrders) {
        const studentNum = o.realStudentCount || o.studentCount || 0;
        const amt = payModel === 'per_group' ? payRate : (studentNum * payRate);
        const isCompleted = o.status !== 'photo_active' && o.status !== 'photo_queue';
        const isUnlocked = isCompleted && this.isOrder50Unlocked(o);
        const mk = this.getItemMonthKey(o);

        if (mk < payouts.periodStartMonth) {
          if (isUnlocked) prevConfirmed += amt;
        } else if (mk >= payouts.periodStartMonth && mk <= payouts.periodEndMonth) {
          totalEarned += amt;
          if (isUnlocked) {
            periodEarned += amt;
          } else {
            pendingEarned += amt;
          }
          breakdown.push({
            id: o.id,
            monthKey: mk,
            region: o.region || 'Toshkent shahri',
            group: `${(o.university || '').split(' ')[0]} - ${o.group}`,
            students: studentNum,
            rate: payRate,
            amount: amt,
            isCompleted,
            isUnlocked
          });
        }
      }
      carryOverBalance = prevConfirmed - payouts.prevTotalPaid;
      confirmedEarned = periodEarned + carryOverBalance;
      totalEarned = confirmedEarned;
      available = confirmedEarned - advance;
    }

    let totalCosts = 0;
    for (const o of myOrders) {
      if (o.costs) {
        for (const c of o.costs) {
          totalCosts += (c.amount || 0);
        }
      }
    }

    // Fotograf mijozdan qabul qilgan naqd pul va qarz hisobi
    let cashInHand = 0;
    let cashSubmittedPending = 0;
    let totalCashSubmittedApproved = 0;

    for (const o of allMyRegionOrders) {
      const mk = this.getItemMonthKey(o);
      if (mk <= payouts.periodEndMonth) {
        const photoCollected = o.photographerCollectedAmount || 0;
        if (photoCollected > 0) {
          const photoSubmitted = o.photographerSubmittedAmount || 0;
          const photoPending = o.photographerSubmittedPending || 0;
          const rem = Math.max(0, photoCollected - photoSubmitted);
          cashInHand += rem;
          cashSubmittedPending += photoPending;
          totalCashSubmittedApproved += photoSubmitted;
        }
      }
    }

    return {
      periodId: targetPeriod,
      periodLabel: this.getPeriodLabel(targetPeriod),
      payModel,
      payRate,
      periodEarned,
      carryOverBalance,
      monthlySalary: periodEarned,
      paidAmount: paid,
      advanceOnly: advanceOnly,
      advanceTaken: advance,
      remainingSalary: available,
      availableToWithdraw: available,
      netBalance: available,
      totalEarned,
      confirmedEarned,
      pendingEarned,
      totalCostsApproved: totalCosts,
      cashInHand: cashInHand,
      cashSubmittedPending: cashSubmittedPending,
      totalCashSubmittedApproved: totalCashSubmittedApproved,
      completedGroupsCount: myOrders.filter(o => o.status !== 'photo_active' && o.status !== 'photo_queue').length,
      isProrated: salaryMeta ? salaryMeta.isProrated : false,
      workedDays: salaryMeta ? salaryMeta.workedDays : 30,
      totalDays: salaryMeta ? salaryMeta.totalDays : 30,
      dailyRate: salaryMeta ? salaryMeta.dailyRate : Math.round(payRate / 30),
      startDay: salaryMeta ? salaryMeta.startDay : 1,
      startMonth: salaryMeta ? salaryMeta.empStartMonth : this.getCurrentMonthKey(),
      startDateIso: salaryMeta ? salaryMeta.startDateIso : `${this.getCurrentMonthKey()}-01`,
      notStartedYet: salaryMeta ? salaryMeta.notStartedYet : false,
      breakdown
    };
  }

  // Dizayner moliya hisob-kitobi (Oyma-oy ko'rinish + Carry-over qoldiq bilan)
  getEditorFinance(editorId, seasonId = null, region = 'all') {
    const targetPeriod = this.normalizePeriodId(seasonId !== null ? seasonId : (this.selectedSeasonId || this.getCurrentMonthKey()));
    const editor = this.users.find(u => u.id === editorId);
    const payouts = this.getEmployeePayoutsSplit(editorId, targetPeriod, region);

    const paid = payouts.periodPaid;
    const advance = payouts.periodAdvance;
    const totalPaid = payouts.periodTotalPaid;

    const payModel = editor?.payModel || 'per_student';
    const payRate = editor?.payRate !== undefined ? editor.payRate : (this.rates.editorRatePerStudent || 15000);

    const allMyRegionOrders = (this.orders || []).filter(o =>
      o.editorId === editorId &&
      (!region || region === 'all' || o.region === region)
    );

    let periodEarned = 0;
    let carryOverBalance = 0;
    let confirmedEarned = 0;
    let pendingEarned = 0;
    let totalAll = 0;
    let salaryMeta = null;
    const breakdown = [];

    if (payModel === 'salary') {
      const isActiveInRegion = !region || region === 'all' || editor?.region === region || allMyRegionOrders.length > 0;
      const baseSalary = isActiveInRegion ? payRate : 0;
      const salCalc = this.computeSalariedCarryOver(editor, targetPeriod, baseSalary, payouts, allMyRegionOrders);
      salaryMeta = salCalc;
      periodEarned = salCalc.periodEarned;
      carryOverBalance = salCalc.carryOverBalance;
      confirmedEarned = salCalc.totalEarned;
      totalAll = salCalc.totalEarned;
    } else {
      let prevConfirmed = 0;
      for (const order of allMyRegionOrders) {
        const studentNum = order.realStudentCount || order.studentCount || 0;
        const payment = payModel === 'per_group' ? payRate : (studentNum * payRate);
        const isCompleted = order.status !== 'edit_active' && order.status !== 'edit_queue';
        const isUnlocked = isCompleted && this.isOrder50Unlocked(order);
        const mk = this.getItemMonthKey(order);

        if (mk < payouts.periodStartMonth) {
          if (isUnlocked) prevConfirmed += payment;
        } else if (mk >= payouts.periodStartMonth && mk <= payouts.periodEndMonth) {
          totalAll += payment;
          if (isUnlocked) {
            periodEarned += payment;
          } else {
            pendingEarned += payment;
          }

          breakdown.push({
            id: order.id,
            monthKey: mk,
            region: order.region || 'Toshkent shahri',
            group: `${(order.university || '').split(' ')[0]} - ${order.group}`,
            students: studentNum,
            rate: payRate,
            amount: payment,
            isCompleted,
            isUnlocked
          });
        }
      }
      carryOverBalance = prevConfirmed - payouts.prevTotalPaid;
      confirmedEarned = periodEarned + carryOverBalance;
    }

    const netBalance = confirmedEarned - totalPaid;

    return {
      periodId: targetPeriod,
      periodLabel: this.getPeriodLabel(targetPeriod),
      payModel,
      payRate,
      periodEarned,
      carryOverBalance,
      totalEarned: confirmedEarned,
      confirmedEarned: confirmedEarned,
      pendingEarned: pendingEarned,
      totalAll: totalAll,
      netBalance: netBalance,
      paidAmount: paid,
      advanceTaken: advance,
      totalPaid: totalPaid,
      availableToWithdraw: netBalance,
      isProrated: salaryMeta ? salaryMeta.isProrated : false,
      workedDays: salaryMeta ? salaryMeta.workedDays : 30,
      totalDays: salaryMeta ? salaryMeta.totalDays : 30,
      dailyRate: salaryMeta ? salaryMeta.dailyRate : Math.round(payRate / 30),
      startDay: salaryMeta ? salaryMeta.startDay : 1,
      startMonth: salaryMeta ? salaryMeta.empStartMonth : this.getCurrentMonthKey(),
      startDateIso: salaryMeta ? salaryMeta.startDateIso : `${this.getCurrentMonthKey()}-01`,
      notStartedYet: salaryMeta ? salaryMeta.notStartedYet : false,
      breakdown
    };
  }

  // Albom yasovchi moliya hisob-kitobi (Oyma-oy ko'rinish + Carry-over qoldiq bilan)
  getMakerFinance(makerId, seasonId = null, region = 'all') {
    const targetPeriod = this.normalizePeriodId(seasonId !== null ? seasonId : (this.selectedSeasonId || this.getCurrentMonthKey()));
    const maker = this.users.find(u => u.id === makerId);
    const payouts = this.getEmployeePayoutsSplit(makerId, targetPeriod, region);

    const paid = payouts.periodPaid;
    const advance = payouts.periodAdvance;
    const totalPaid = payouts.periodTotalPaid;

    const payModel = maker?.payModel || 'by_album_type';
    const payRate = maker?.payRate !== undefined ? maker.payRate : (this.rates.makerRatePerAlbum || 25000);

    const allMyRegionOrders = (this.orders || []).filter(o =>
      o.makerId === makerId &&
      (!region || region === 'all' || o.region === region)
    );

    let periodEarned = 0;
    let carryOverBalance = 0;
    let confirmedEarned = 0;
    let pendingEarned = 0;
    let totalAll = 0;
    let salaryMeta = null;
    const breakdown = [];

    if (payModel === 'salary') {
      const isActiveInRegion = !region || region === 'all' || maker?.region === region || allMyRegionOrders.length > 0;
      const baseSalary = isActiveInRegion ? payRate : 0;
      const salCalc = this.computeSalariedCarryOver(maker, targetPeriod, baseSalary, payouts, allMyRegionOrders);
      salaryMeta = salCalc;
      periodEarned = salCalc.periodEarned;
      carryOverBalance = salCalc.carryOverBalance;
      confirmedEarned = salCalc.totalEarned;
      totalAll = salCalc.totalEarned;
    } else {
      let prevConfirmed = 0;
      for (const order of allMyRegionOrders) {
        const albumNum = order.realStudentCount || order.studentCount || 0;
        let rate = payRate;

        if (payModel === 'by_album_type') {
          const albumTypeObj = (this.albumTypes || []).find(t => t.name === order.albumType);
          rate = (albumTypeObj && albumTypeObj.makerRate) ? albumTypeObj.makerRate : (this.rates.makerRatePerAlbum || 25000);
        }

        const payment = albumNum * rate;
        const isCompleted = order.status === 'ready' || order.status === 'delivered' || order.status === 'closed';
        const isUnlocked = isCompleted && this.isOrder50Unlocked(order);
        const mk = this.getItemMonthKey(order);

        if (mk < payouts.periodStartMonth) {
          if (isUnlocked) prevConfirmed += payment;
        } else if (mk >= payouts.periodStartMonth && mk <= payouts.periodEndMonth) {
          totalAll += payment;
          if (isUnlocked) {
            periodEarned += payment;
          } else {
            pendingEarned += payment;
          }

          breakdown.push({
            id: order.id,
            monthKey: mk,
            region: order.region || 'Toshkent shahri',
            group: `${(order.university || '').split(' ')[0]} - ${order.group}`,
            albums: albumNum,
            albumType: order.albumType,
            rate: rate,
            amount: payment,
            isCompleted,
            isUnlocked
          });
        }
      }
      carryOverBalance = prevConfirmed - payouts.prevTotalPaid;
      confirmedEarned = periodEarned + carryOverBalance;
    }

    const netBalance = confirmedEarned - totalPaid;

    return {
      periodId: targetPeriod,
      periodLabel: this.getPeriodLabel(targetPeriod),
      payModel,
      payRate,
      periodEarned,
      carryOverBalance,
      totalEarned: confirmedEarned,
      confirmedEarned: confirmedEarned,
      pendingEarned: pendingEarned,
      totalAll: totalAll,
      netBalance: netBalance,
      paidAmount: paid,
      advanceTaken: advance,
      totalPaid: totalPaid,
      availableToWithdraw: netBalance,
      isProrated: salaryMeta ? salaryMeta.isProrated : false,
      workedDays: salaryMeta ? salaryMeta.workedDays : 30,
      totalDays: salaryMeta ? salaryMeta.totalDays : 30,
      dailyRate: salaryMeta ? salaryMeta.dailyRate : Math.round(payRate / 30),
      startDay: salaryMeta ? salaryMeta.startDay : 1,
      startMonth: salaryMeta ? salaryMeta.empStartMonth : this.getCurrentMonthKey(),
      startDateIso: salaryMeta ? salaryMeta.startDateIso : `${this.getCurrentMonthKey()}-01`,
      notStartedYet: salaryMeta ? salaryMeta.notStartedYet : false,
      breakdown
    };
  }

  // Guruh tannarxi va xarajatlari (Buxgalteriya belgilagan individual stavkalar bo'yicha)
  getOrderCosts(order) {
    if (!order) return { orderSum: 0, sellerComm: 0, editorCost: 0, makerCost: 0, photoCost: 0, extraCosts: 0, totalCosts: 0, profit: 0 };
    const students = order.realStudentCount || order.studentCount || 0;
    const orderSum = students * (order.pricePerStudent || 0);

    // 1. Sotuvchi komissiyasi (Individual stavka)
    const seller = (this.users || []).find(u => u.id === order.sellerId);
    const sModel = seller?.payModel || 'percent';
    const sRate = seller?.payRate !== undefined ? seller.payRate : (this.rates?.sellerCommissionPercent || 10);
    let sellerComm = 0;
    if (sModel === 'per_student') sellerComm = students * sRate;
    else if (sModel === 'per_group') sellerComm = sRate;
    else sellerComm = Math.round(orderSum * (sRate / 100));

    // 2. Dizayner haqi (Individual stavka)
    const editor = (this.users || []).find(u => u.id === order.editorId);
    const eModel = editor?.payModel || 'per_student';
    const eRate = editor?.payRate !== undefined ? editor.payRate : (this.rates?.editorRatePerStudent || 15000);
    let editorCost = 0;
    if (eModel === 'per_group') editorCost = eRate;
    else if (eModel === 'salary') editorCost = 0;
    else editorCost = students * eRate;

    // 3. Albom yasovchi haqi (Individual stavka)
    const maker = (this.users || []).find(u => u.id === order.makerId);
    const mModel = maker?.payModel || 'by_album_type';
    let mRate = maker?.payRate !== undefined ? maker.payRate : (this.rates?.makerRatePerAlbum || 25000);
    if (mModel === 'by_album_type') {
      const at = (this.albumTypes || []).find(t => t.name === order.albumType);
      if (at && at.makerRate) mRate = at.makerRate;
    }
    let makerCost = 0;
    if (mModel !== 'salary') makerCost = students * mRate;

    // 4. Fotograf xarajati (agar guruh yoki talaba bo'yicha belgilangan bo'lsa)
    const photo = (this.users || []).find(u => u.id === order.photographerId);
    let photoCost = 0;
    if (photo && photo.payModel === 'per_group') {
      photoCost = photo.payRate || 0;
    } else if (photo && photo.payModel === 'per_student') {
      photoCost = students * (photo.payRate || 0);
    }

    // 5. Buyurtmadagi qo'shimcha tasdiqlangan xarajatlar (transport, rekvizit va h.k.)
    let extraCosts = 0;
    if (order.costs) {
      for (const c of order.costs) {
        if (c.status === 'approved') extraCosts += (c.amount || 0);
      }
    }

    const totalCosts = sellerComm + editorCost + makerCost + photoCost + extraCosts;
    const profit = ((order.sellerSubmittedAmount || 0) + (order.photographerSubmittedAmount || 0)) - totalCosts;

    return {
      orderSum,
      sellerComm,
      editorCost,
      makerCost,
      photoCost,
      extraCosts,
      totalCosts,
      profit
    };
  }

  // Buxgalter uchun: Xodimlarda (Sotuvchi va Fotograf) qolgan naqd pullar va qarzdorliklar ro'yxati
  getEmployeesCashInHandList(filterRegion = 'all', filterSeason = 'all') {
    let targetOrders = this.orders || [];
    if (filterSeason && filterSeason !== 'all') {
      const pid = this.normalizePeriodId(filterSeason);
      // Agar joriy oy yoki yil tanlangan bo'lsa, oldingi oydan hali topshirilmagan naqd qarzlar ham yo'qolib ketmasligi kerak
      if (pid === this.getCurrentMonthKey()) {
        targetOrders = targetOrders.filter(o => this.getItemMonthKey(o) <= pid);
      } else {
        targetOrders = targetOrders.filter(o => this.matchesPeriod(o, pid));
      }
    }
    if (filterRegion && filterRegion !== 'all') {
      targetOrders = targetOrders.filter(o => o.region === filterRegion);
    }

    const items = [];

    for (const order of targetOrders) {
      // 1. Fotograf fotosessiyada mijozdan olgan va hali topshirmagan naqd pul
      const photoCollected = order.photographerCollectedAmount || 0;
      if (photoCollected > 0) {
        const photoSubmitted = order.photographerSubmittedAmount || 0;
        const photoPending = order.photographerSubmittedPending || 0;
        const photoInHand = Math.max(0, photoCollected - photoSubmitted);

        if (photoInHand > 0) {
          const photoUser = (this.users || []).find(u => u.id === order.photographerId);
          items.push({
            id: `photo_${order.id}`,
            role: 'photographer',
            roleName: 'Fotograf',
            orderId: order.id,
            group: order.group,
            university: order.university,
            faculty: order.faculty,
            city: order.city,
            region: order.region || order.city || 'Toshkent shahri',
            userId: order.photographerId,
            userName: order.photographerName || photoUser?.name || 'Fotograf',
            userPhone: order.photographerPhone || photoUser?.phone || 'Telefon koʻrsatilmagan',
            userAvatar: photoUser?.avatar || null,
            collectedAmount: photoCollected,
            submittedAmount: photoSubmitted,
            pendingAmount: photoPending,
            cashInHand: photoInHand,
            source: 'Fotosessiyadan olingan (Oldindan toʻlov)',
            hasPendingRequest: photoPending > 0
          });
        }
      }

      // 2. Sotuvchi albomni topshirganda mijozdan olgan va hali topshirmagan naqd pul
      const totalCol = order.collectedAmount || 0;
      if (order.status === 'delivered' || order.status === 'closed' || totalCol > photoCollected) {
        const sellerCol = Math.max(0, totalCol - photoCollected);
        const sellerSubmitted = order.sellerSubmittedAmount || 0;
        const sellerPending = order.sellerSubmittedPending || 0;
        const sellerInHand = Math.max(0, sellerCol - sellerSubmitted);

        if (sellerInHand > 0) {
          const sellerUser = (this.users || []).find(u => u.id === order.sellerId);
          items.push({
            id: `seller_${order.id}`,
            role: 'seller',
            roleName: 'Sotuvchi',
            orderId: order.id,
            group: order.group,
            university: order.university,
            faculty: order.faculty,
            city: order.city,
            region: order.region || order.city || 'Toshkent shahri',
            userId: order.sellerId,
            userName: order.sellerName || sellerUser?.name || 'Sotuvchi',
            userPhone: order.sellerPhone || sellerUser?.phone || 'Telefon koʻrsatilmagan',
            userAvatar: sellerUser?.avatar || null,
            collectedAmount: sellerCol,
            submittedAmount: sellerSubmitted,
            pendingAmount: sellerPending,
            cashInHand: sellerInHand,
            source: 'Albom topshirilganda olingan toʻlov',
            hasPendingRequest: sellerPending > 0
          });
        }
      }
    }

    return items;
  }

  // Rahbar va Buxgalter uchun umumiy kompaniya moliyasi (Viloyat va Oy/Yil filtri bilan)
  getCompanyOverview(filterRegion = 'all', filterSeason = null) {
    const targetSeason = this.normalizePeriodId(filterSeason !== null ? filterSeason : this.selectedSeasonId);
    let targetOrders = this.orders || [];

    if (targetSeason && targetSeason !== 'all') {
      targetOrders = targetOrders.filter(o => this.matchesPeriod(o, targetSeason));
    }
    if (filterRegion && filterRegion !== 'all') {
      targetOrders = targetOrders.filter(o => o.region === filterRegion);
    }

    let totalRevenue = 0;       // Jami tushum (tasdiqlangan buxgalterga kelgan)
    let totalSellerCashInHand = 0; // Sotuvchilar va Fotograflar qo'lidagi naqd pul
    let totalPiecesProduced = 0; // Albomlar/talabalar soni
    let totalOrdersCount = targetOrders.length;
    let activeOrdersCount = 0;

    // Voronka sonlari
    const funnel = {
      photoQueue: 0,
      photoActive: 0,
      editQueue: 0,
      editActive: 0,
      makeQueue: 0,
      makeActive: 0,
      ready: 0,
      delivered: 0,
      closed: 0
    };

    // Xarajatlar yig'indisi
    let totalProductionCosts = 0; // Taksi, pechat, brak
    let totalCommissionsPaid = 0;
    let totalEditorCosts = 0;
    let totalMakerCosts = 0;

    for (const order of targetOrders) {
      const students = order.realStudentCount || order.studentCount || 0;
      totalPiecesProduced += students;

      if (order.status !== 'closed') {
        activeOrdersCount++;
      }

      // Funnel hisoblash
      if (order.status === 'photo_queue') funnel.photoQueue++;
      else if (order.status === 'photo_active') funnel.photoActive++;
      else if (order.status === 'edit_queue') funnel.editQueue++;
      else if (order.status === 'edit_active') funnel.editActive++;
      else if (order.status === 'make_queue') funnel.makeQueue++;
      else if (order.status === 'make_active') funnel.makeActive++;
      else if (order.status === 'ready') funnel.ready++;
      else if (order.status === 'delivered') funnel.delivered++;
      else if (order.status === 'closed') funnel.closed++;

      // Tushum (Buxgalter kassasiga tasdiqlanib tushgan jami summa)
      totalRevenue += ((order.sellerSubmittedAmount || 0) + (order.photographerSubmittedAmount || 0));

      // Xodimlardagi (Sotuvchi va Fotograf) naqd pul
      const photoCollected = order.photographerCollectedAmount || 0;
      const photoSubmitted = order.photographerSubmittedAmount || 0;
      const photoInHand = Math.max(0, photoCollected - photoSubmitted);

      let sellerInHand = 0;
      const totalCol = order.collectedAmount || 0;
      if (order.status === 'delivered' || order.status === 'closed' || totalCol > photoCollected) {
        const sellerCol = Math.max(0, totalCol - photoCollected);
        const sellerSubmitted = order.sellerSubmittedAmount || 0;
        sellerInHand = Math.max(0, sellerCol - sellerSubmitted);
      }

      totalSellerCashInHand += (photoInHand + sellerInHand);

      // Buyurtma ichidagi xarajatlar
      if (order.costs) {
        for (const c of order.costs) {
          if (c.status === 'approved') {
            totalProductionCosts += (c.amount || 0);
          }
        }
      }

      // Xizmat haqlari (Xodimlarning individual modellariga mos)
      if (order.status === 'closed' || order.status === 'delivered') {
        const orderSum = students * order.pricePerStudent;

        // Sotuvchi komissiyasi
        const seller = (this.users || []).find(u => u.id === order.sellerId);
        const sModel = seller?.payModel || 'percent';
        const sRate = seller?.payRate !== undefined ? seller.payRate : (this.rates.sellerCommissionPercent || 10);
        if (sModel === 'per_student') totalCommissionsPaid += students * sRate;
        else if (sModel === 'per_group') totalCommissionsPaid += sRate;
        else totalCommissionsPaid += Math.round(orderSum * (sRate / 100));

        // Dizayner haqi
        const editor = (this.users || []).find(u => u.id === order.editorId);
        const eModel = editor?.payModel || 'per_student';
        const eRate = editor?.payRate !== undefined ? editor.payRate : (this.rates.editorRatePerStudent || 15000);
        if (eModel === 'per_group') totalEditorCosts += eRate;
        else if (eModel === 'per_student') totalEditorCosts += students * eRate;

        // Yasovchi haqi
        const maker = (this.users || []).find(u => u.id === order.makerId);
        const mModel = maker?.payModel || 'by_album_type';
        let mRate = maker?.payRate !== undefined ? maker.payRate : (this.rates.makerRatePerAlbum || 25000);
        if (mModel === 'by_album_type') {
          const at = (this.albumTypes || []).find(t => t.name === order.albumType);
          if (at && at.makerRate) mRate = at.makerRate;
        }
        if (mModel !== 'salary') totalMakerCosts += students * mRate;
      }
    }

    // Xodimlarga to'langan oyliklar va avanslar (Viloyat va Oy/Yil bo'yicha)
    let totalSalaries = 0;
    const targetPayroll = (this.payrollLogs || []).filter(p => 
      (!targetSeason || targetSeason === 'all' || this.matchesPeriod(p, targetSeason)) &&
      (!filterRegion || filterRegion === 'all' || !p.region || p.region === 'all' || p.region === filterRegion)
    );
    for (const p of targetPayroll) {
      if (p.type === 'salary' || p.type === 'advance') {
        totalSalaries += (p.amount || 0);
      }
    }

    // Kompaniya doimiy xarajatlari (Viloyat va Oy/Yil bo'yicha)
    let totalCompanyExpenses = 0;
    const targetCompExp = (this.companyExpenses || []).filter(ce => 
      (!targetSeason || targetSeason === 'all' || this.matchesPeriod(ce, targetSeason)) &&
      (!filterRegion || filterRegion === 'all' || !ce.region || ce.region === 'all' || ce.region === filterRegion)
    );
    for (const ce of targetCompExp) {
      totalCompanyExpenses += (ce.amount || 0);
    }

    const totalExpenses = totalProductionCosts + totalCommissionsPaid + totalEditorCosts + totalMakerCosts + totalSalaries + totalCompanyExpenses;
    const netProfit = totalRevenue - totalExpenses;

    return {
      filterRegion,
      filterSeason: targetSeason,
      totalRevenue,
      totalExpenses,
      netProfit,
      totalSellerCashInHand,
      totalOrdersCount,
      activeOrdersCount,
      totalPiecesProduced,
      funnel,
      details: {
        totalProductionCosts,
        totalCommissionsPaid,
        totalEditorCosts,
        totalMakerCosts,
        totalSalaries,
        totalCompanyExpenses
      }
    };
  }

  // Raqamlarni chiroyli formatlash (10000 -> "10 000 soʻm", -400000 -> "- 400 000 soʻm")
  static formatMoney(amount) {
    if (amount === null || amount === undefined) return "0 soʻm";
    const num = Math.round(Number(amount));
    if (isNaN(num)) return "0 soʻm";
    const isNegative = num < 0;
    const formatted = Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return isNegative ? `- ${formatted} soʻm` : `${formatted} soʻm`;
  }

  // Raqamni faqat bo'shliqlar bilan formatlash (5000000 -> "5 000 000")
  static formatNumber(amount) {
    if (amount === null || amount === undefined || amount === '') return "";
    const num = Math.round(Number(String(amount).replace(/\D/g, '')));
    if (isNaN(num) || num === 0) return "";
    return Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  // Har qanday formatlangan yoki kiritilgan summadan toza butun son olish ("5 000 000 so'm" -> 5000000)
  static parseMoney(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);
    const cleaned = String(val).replace(/[^0-9]/g, '');
    return cleaned ? Number(cleaned) : 0;
  }

  formatMoney(amount) {
    return Store.formatMoney(amount);
  }

  formatNumber(amount) {
    return Store.formatNumber(amount);
  }

  parseMoney(val) {
    return Store.parseMoney(val);
  }
}

// Global instansiyalar
window.Store = Store;
window.store = new Store();
window.REGIONS = window.store.getRegions();

