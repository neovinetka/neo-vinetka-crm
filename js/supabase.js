/* ====================================================================
   VINETKA CRM & ERP - PRODUCTION SUPABASE CLIENT & REAL-TIME SERVICE
   Multi-Device Instant Synchronization (20-50 Staff Members)
   ==================================================================== */

// Doimiy Production Supabase konfiguratsiyasi (Neo Vinetka CRM - neovinetka@gmail.com)
const SUPABASE_URL = "https://hwjljzlemarzeejrgkoe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vhjUTZoc9Dn26mgyC0yMIA_-vhs1Vre";

window.VINETKA_SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
};

const SupabaseService = {
  client: null,
  realtimeChannel: null,
  status: 'disconnected', // 'connected' | 'connecting' | 'disconnected'
  statusListeners: [],

  // Dastur yuklanishi bilan avtomatik ulanish
  init: () => {
    if (typeof supabase !== 'undefined') {
      try {
        SupabaseService.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          },
          realtime: {
            params: {
              eventsPerSecond: 15
            }
          }
        });
        SupabaseService.status = 'connecting';
        SupabaseService.notifyStatus();
        return true;
      } catch (err) {
        console.error("[Supabase] Ulanishda xatolik:", err);
        SupabaseService.status = 'disconnected';
        SupabaseService.notifyStatus();
        return false;
      }
    }
    return false;
  },

  isReady: () => {
    return SupabaseService.client !== null && SupabaseService.status === 'connected';
  },

  isConfigured: () => {
    return true; // Productionda har doim sozlangan
  },

  getCredentials: () => {
    return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
  },

  onStatusChange: (listener) => {
    SupabaseService.statusListeners.push(listener);
    return () => {
      SupabaseService.statusListeners = SupabaseService.statusListeners.filter(l => l !== listener);
    };
  },

  notifyStatus: () => {
    for (const listener of SupabaseService.statusListeners) {
      try { listener(SupabaseService.status); } catch (e) {}
    }
  },

  // ==================================================================
  // REAL-TIME POSTGRES REPLICATION CHANNELS
  // Barcha jadvallar bo'yicha real vaqtda telefon va kompyuterlarni yangilash
  // ==================================================================
  subscribeRealtime: (storeInstance) => {
    if (!SupabaseService.client) return null;

    if (SupabaseService.realtimeChannel) {
      try { SupabaseService.client.removeChannel(SupabaseService.realtimeChannel); } catch (e) {}
    }

    const channel = SupabaseService.client.channel('vinetka-production-realtime');

    // 1. ORDERS jadvali o'zgarishlari (Yangi buyurtma, status o'zgarishi, navbatlar)
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        console.log('[Real-time] Orders change:', payload.eventType, payload.new?.id || payload.old?.id);
        if (payload.eventType === 'INSERT') {
          const newOrder = SupabaseService.mapOrderFromDb(payload.new);
          const exists = storeInstance.orders.some(o => o.id === newOrder.id);
          if (!exists) {
            storeInstance.orders.unshift(newOrder);
            storeInstance.saveLocalOnly();
            if (typeof App !== 'undefined' && App.showToast) {
              App.showToast(`Yangi buyurtma qoʻshildi: ${newOrder.id}`);
            }
          }
        } else if (payload.eventType === 'UPDATE') {
          const updated = SupabaseService.mapOrderFromDb(payload.new);
          const idx = storeInstance.orders.findIndex(o => o.id === updated.id);
          if (idx !== -1) {
            // Local va real-time ma'lumotlarni birlashtirish
            storeInstance.orders[idx] = { ...storeInstance.orders[idx], ...updated };
            storeInstance.saveLocalOnly();
          } else {
            storeInstance.orders.unshift(updated);
            storeInstance.saveLocalOnly();
          }
        } else if (payload.eventType === 'DELETE') {
          storeInstance.orders = storeInstance.orders.filter(o => o.id !== payload.old.id);
          storeInstance.saveLocalOnly();
        }
      }
    );

    // 2. PAYMENTS jadvali o'zgarishlari (Buxgalteriya to'lov tasdiqlari va kassa)
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'payments' },
      (payload) => {
        console.log('[Real-time] Payments change:', payload.eventType);
        if (payload.eventType === 'INSERT') {
          const newSub = SupabaseService.mapPaymentFromDb(payload.new);
          if (!storeInstance.cashSubmissions.some(s => s.id === newSub.id)) {
            storeInstance.cashSubmissions.unshift(newSub);
            storeInstance.saveLocalOnly();
          }
        } else if (payload.eventType === 'UPDATE') {
          const updated = SupabaseService.mapPaymentFromDb(payload.new);
          const idx = storeInstance.cashSubmissions.findIndex(s => s.id === updated.id);
          if (idx !== -1) {
            storeInstance.cashSubmissions[idx] = updated;
            storeInstance.saveLocalOnly();
          }
        } else if (payload.eventType === 'DELETE') {
          storeInstance.cashSubmissions = storeInstance.cashSubmissions.filter(s => s.id !== payload.old.id);
          storeInstance.saveLocalOnly();
        }
      }
    );

    // 3. EXPENSES jadvali o'zgarishlari (Xarajat so'rovlari va tasdiqlari)
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'expenses' },
      (payload) => {
        console.log('[Real-time] Expenses change:', payload.eventType);
        if (payload.eventType === 'INSERT') {
          const newExp = SupabaseService.mapExpenseFromDb(payload.new);
          if (!storeInstance.expenseRequests.some(e => e.id === newExp.id)) {
            storeInstance.expenseRequests.unshift(newExp);
            storeInstance.saveLocalOnly();
          }
        } else if (payload.eventType === 'UPDATE') {
          const updated = SupabaseService.mapExpenseFromDb(payload.new);
          const idx = storeInstance.expenseRequests.findIndex(e => e.id === updated.id);
          if (idx !== -1) {
            storeInstance.expenseRequests[idx] = updated;
            storeInstance.saveLocalOnly();
          }
        } else if (payload.eventType === 'DELETE') {
          storeInstance.expenseRequests = storeInstance.expenseRequests.filter(e => e.id !== payload.old.id);
          storeInstance.saveLocalOnly();
        }
      }
    );

    // 4. PROFILES jadvali o'zgarishlari (Xodimlar, parollar, oylik/avans balanslari)
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'profiles' },
      (payload) => {
        console.log('[Real-time] Profiles change:', payload.eventType);
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const updated = SupabaseService.mapProfileFromDb(payload.new);
          const idx = storeInstance.users.findIndex(u => u.id === updated.id);
          const oldUser = idx !== -1 ? storeInstance.users[idx] : null;
          if (idx !== -1) {
            storeInstance.users[idx] = updated;
            if (storeInstance.currentUser?.id === updated.id) {
              storeInstance.currentUser = updated;
            }
          } else {
            storeInstance.users.push(updated);
          }
          // Real-time rejimida xodimning yangilangan ism va telefonini barcha buyurtmalarga kaskad tarqatish
          if (typeof storeInstance.propagateUserChanges === 'function') {
            storeInstance.propagateUserChanges(updated.id, updated.name, updated.phone, oldUser?.name);
          }
          storeInstance.saveLocalOnly();
          if (typeof App !== 'undefined' && App.render) {
            App.render();
          }
        } else if (payload.eventType === 'DELETE') {
          storeInstance.users = storeInstance.users.filter(u => u.id !== payload.old.id);
          if (storeInstance.currentUser?.id === payload.old.id) {
            storeInstance.currentUser = null;
          }
          storeInstance.saveLocalOnly();
        }
      }
    );

    // 5. PAYROLL_LOGS jadvali o'zgarishlari (Oylik to'lovlari)
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'payroll_logs' },
      (payload) => {
        console.log('[Real-time] Payroll logs change:', payload.eventType);
        if (payload.eventType === 'INSERT') {
          const p = payload.new;
          const log = {
            id: p.id,
            userId: p.user_id,
            userName: p.user_name,
            role: p.role,
            amount: Number(p.amount) || 0,
            type: p.type,
            note: p.note,
            rawCreatedAt: p.created_at || null,
            date: p.date || (p.created_at ? new Date(p.created_at).toLocaleDateString('uz-UZ') : '')
          };
          if (!storeInstance.payrollLogs.some(item => item.id === log.id)) {
            storeInstance.payrollLogs.unshift(log);
            storeInstance.saveLocalOnly();
          }
        } else if (payload.eventType === 'DELETE') {
          storeInstance.payrollLogs = storeInstance.payrollLogs.filter(p => p.id !== payload.old.id);
          storeInstance.saveLocalOnly();
        }
      }
    );

    // 6. COMPANY_EXPENSES jadvali o'zgarishlari
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'company_expenses' },
      (payload) => {
        console.log('[Real-time] Company expenses change:', payload.eventType);
        if (payload.eventType === 'INSERT') {
          const c = payload.new;
          const exp = {
            id: c.id,
            title: c.title,
            amount: Number(c.amount) || 0,
            category: c.category,
            note: c.note,
            rawCreatedAt: c.created_at || null,
            date: c.date || (c.created_at ? new Date(c.created_at).toLocaleDateString('uz-UZ') : '')
          };
          if (!storeInstance.companyExpenses.some(item => item.id === exp.id)) {
            storeInstance.companyExpenses.unshift(exp);
            storeInstance.saveLocalOnly();
          }
        } else if (payload.eventType === 'DELETE') {
          storeInstance.companyExpenses = storeInstance.companyExpenses.filter(c => c.id !== payload.old.id);
          storeInstance.saveLocalOnly();
        }
      }
    );

    // 7. SETTINGS jadvali o'zgarishlari (Viloyatlar, narxlar, albom turlari)
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'settings' },
      (payload) => {
        console.log('[Real-time] Settings change:', payload.new?.key);
        if (payload.new?.key === 'regions' && Array.isArray(payload.new.value)) {
          storeInstance.regions = payload.new.value;
          window.REGIONS = payload.new.value;
        } else if (payload.new?.key === 'album_types' && Array.isArray(payload.new.value)) {
          storeInstance.albumTypes = payload.new.value;
        } else if (payload.new?.key === 'rates' && payload.new.value) {
          storeInstance.rates = payload.new.value;
        }
        storeInstance.saveLocalOnly();
      }
    );

    // 8. SEASONS jadvali o'zgarishlari
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'seasons' },
      (payload) => {
        console.log('[Real-time] Seasons change:', payload.eventType);
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const s = payload.new;
          const mapped = {
            id: s.id,
            name: s.name,
            startDate: s.start_date,
            endDate: s.end_date,
            status: s.is_active ? 'active' : 'archived',
            isCurrent: s.is_current,
            createdAt: s.created_at ? new Date(s.created_at).toLocaleDateString('uz-UZ') : ''
          };
          const idx = storeInstance.seasons.findIndex(item => item.id === mapped.id);
          if (idx !== -1) {
            storeInstance.seasons[idx] = mapped;
          } else {
            storeInstance.seasons.push(mapped);
          }
          storeInstance.saveLocalOnly();
        }
      }
    );

    channel.subscribe((status) => {
      console.log('[Supabase Real-time status]:', status);
      if (status === 'SUBSCRIBED') {
        SupabaseService.status = 'connected';
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        SupabaseService.status = 'disconnected';
      }
      SupabaseService.notifyStatus();
    });

    SupabaseService.realtimeChannel = channel;
    return channel;
  },

  // Qo'shimcha metama'lumotlarni comment orqali xavfsiz saqlash/o'qish (DB schema o'zgarmasdan ishlashi uchun)
  encodeNotesWithMeta: (notes, meta) => {
    const cleanNotes = (notes || '').replace(/\s*<!--meta:\{.*?\}-->/gs, '').trim();
    if (!meta || Object.keys(meta).length === 0) return cleanNotes;
    return `${cleanNotes}\n<!--meta:${JSON.stringify(meta)}-->`.trim();
  },

  decodeNotesWithMeta: (comment) => {
    if (!comment) return { notes: '', meta: {} };
    const match = String(comment).match(/<!--meta:(.*?)-->/s);
    let meta = {};
    if (match) {
      try { meta = JSON.parse(match[1]); } catch (e) {}
    }
    const notes = String(comment).replace(/\s*<!--meta:\{.*?\}-->/gs, '').trim();
    return { notes, meta };
  },

  // ==================================================================
  // MA'LUMOTLARNI MAP QILISH (CAMELCASE <-> SNAKE_CASE)
  // ==================================================================
  mapOrderFromDb: (row) => {
    if (!row) return null;
    const { notes, meta } = SupabaseService.decodeNotesWithMeta(row.comment);

    return {
      id: row.id,
      region: row.region,
      mapLink: row.location_url || '',
      university: row.university || '',
      faculty: row.faculty || '',
      group: row.group_name || '',
      leaderName: row.leader_name || '',
      leaderPhone: row.leader_phone || '',
      albumType: row.album_type || 'Standart',
      pricePerStudent: Number(row.unit_price) || 0,
      studentCount: Number(row.student_count) || 0,
      realStudentCount: row.real_student_count !== null ? Number(row.real_student_count) : null,
      photoDate: row.photo_date || '',
      notes: notes,
      sellerId: row.seller_id || null,
      sellerName: row.seller_name || null,
      sellerPhone: row.seller_phone || null,
      photographerId: row.photographer_id || null,
      photographerName: row.photographer_name || null,
      photographerPhone: row.photographer_phone || null,
      photoDriveLink: row.photo_drive_link || null,
      editorId: row.editor_id || null,
      editorName: row.editor_name || null,
      editorPhone: row.editor_phone || null,
      editorProofLink: row.editor_proof_link || null,
      proofLink: row.editor_proof_link || null,
      editorPrintLink: row.editor_print_link || null,
      editorFinishedAt: row.editor_finished_at || null,
      makerId: row.maker_id || null,
      makerName: row.maker_name || null,
      makerPhone: row.maker_phone || null,
      makerFinishedAt: row.maker_finished_at || null,
      readyAt: row.ready_at || null,
      status: row.status || 'photo_queue',
      rawCreatedAt: row.created_at || null,
      createdAt: row.created_at ? new Date(row.created_at).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' }) : '',
      costs: [],
      collectedAmount: Number(row.collected_amount) || 0,
      paymentMethod: row.payment_method || null,
      sellerSubmittedAmount: Number(row.seller_submitted_amount) || 0,
      sellerSubmittedPending: Number(row.seller_submitted_pending) || 0,
      photographerCollectedAmount: meta.pca !== undefined ? Number(meta.pca) : (Number(row.photographer_collected_amount) || 0),
      photographerSubmittedAmount: meta.psa !== undefined ? Number(meta.psa) : (Number(row.photographer_submitted_amount) || 0),
      photographerSubmittedPending: meta.psp !== undefined ? Number(meta.psp) : (Number(row.photographer_submitted_pending) || 0),
      sellerCollectedAmount: meta.sca !== undefined ? Number(meta.sca) : (Number(row.seller_collected_amount) || 0),
      monthKey: meta.mk || (row.created_at ? new Date(row.created_at).toISOString().slice(0, 7) : undefined),
      seasonId: meta.mk || (row.created_at ? new Date(row.created_at).toISOString().slice(0, 7) : (row.season_id || '')),
      damagedCount: Number(row.damaged_count) || 0,
      damagedCost: Number(row.damaged_cost) || 0
    };
  },

  mapOrderToDb: (order) => {
    const meta = {
      pca: Number(order.photographerCollectedAmount) || 0,
      psa: Number(order.photographerSubmittedAmount) || 0,
      psp: Number(order.photographerSubmittedPending) || 0,
      sca: Number(order.sellerCollectedAmount) || 0,
      mk: order.monthKey || (/^\d{4}-\d{2}$/.test(order.seasonId || '') ? order.seasonId : undefined)
    };
    const encodedComment = SupabaseService.encodeNotesWithMeta(order.notes, meta);

    return {
      id: order.id,
      region: order.region,
      location_url: order.mapLink || null,
      university: order.university,
      faculty: order.faculty || null,
      group_name: order.group,
      faculty_group: `${order.faculty || ''} • ${order.group}`.trim(),
      leader_name: order.leaderName,
      leader_phone: order.leaderPhone,
      album_type: order.albumType,
      unit_price: order.pricePerStudent,
      student_count: order.studentCount,
      real_student_count: order.realStudentCount,
      photo_date: order.photoDate,
      comment: encodedComment,
      seller_id: order.sellerId,
      seller_name: order.sellerName,
      seller_phone: order.sellerPhone,
      photographer_id: order.photographerId,
      photographer_name: order.photographerName,
      photographer_phone: order.photographerPhone,
      photo_drive_link: order.photoDriveLink,
      editor_id: order.editorId,
      editor_name: order.editorName,
      editor_phone: order.editorPhone,
      editor_proof_link: order.editorProofLink || order.proofLink,
      editor_print_link: order.editorPrintLink,
      editor_finished_at: order.editorFinishedAt,
      maker_id: order.makerId,
      maker_name: order.makerName,
      maker_phone: order.makerPhone,
      maker_finished_at: order.makerFinishedAt,
      ready_at: order.readyAt,
      status: order.status,
      collected_amount: order.collectedAmount || 0,
      payment_method: order.paymentMethod,
      seller_submitted_amount: order.sellerSubmittedAmount || 0,
      seller_submitted_pending: order.sellerSubmittedPending || 0,
      season_id: (order.seasonId && String(order.seasonId).startsWith('season_')) ? order.seasonId : null,
      damaged_count: order.damagedCount || 0,
      damaged_cost: order.damagedCost || 0
    };
  },

  mapPaymentFromDb: (row) => {
    if (!row) return null;
    return {
      id: row.id,
      orderId: row.order_id,
      sellerId: row.seller_id,
      sellerName: row.seller_name || '',
      university: row.university || '',
      group: row.group_name || '',
      amount: Number(row.amount) || 0,
      percentage: row.percentage || '50%',
      paymentMethod: row.payment_type || 'cash',
      date: row.created_at ? new Date(row.created_at).toLocaleString('uz-UZ', { dateStyle: 'medium', timeStyle: 'short' }) : '',
      timestamp: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
      status: row.status || 'pending',
      confirmedBy: row.confirmed_by || null,
      confirmedAt: row.confirmed_at || null
    };
  },

  mapPaymentToDb: (sub) => {
    return {
      id: sub.id,
      order_id: sub.orderId,
      seller_id: sub.sellerId,
      seller_name: sub.sellerName,
      university: sub.university,
      group_name: sub.group,
      amount: sub.amount,
      percentage: sub.percentage,
      payment_type: sub.paymentMethod || 'cash',
      status: sub.status,
      confirmed_by: sub.confirmedBy || null,
      confirmed_at: sub.confirmedAt || null
    };
  },

  mapExpenseFromDb: (row) => {
    if (!row) return null;
    return {
      id: row.id,
      orderId: row.order_id,
      requesterId: row.user_id,
      requesterName: row.requester_name || '',
      requesterRole: row.requester_role || '',
      amount: Number(row.amount) || 0,
      category: row.category || 'other',
      description: row.title || '',
      proofLink: row.proof_url || '',
      date: row.created_at ? new Date(row.created_at).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' }) : '',
      status: row.status || 'pending'
    };
  },

  mapExpenseToDb: (exp) => {
    return {
      id: exp.id,
      order_id: exp.orderId,
      user_id: exp.requesterId || exp.userId,
      requester_name: exp.requesterName,
      requester_role: exp.requesterRole,
      amount: exp.amount,
      category: exp.category || 'other',
      title: exp.description || exp.title,
      proof_url: exp.proofLink || exp.proofUrl,
      status: exp.status || 'pending'
    };
  },

  mapProfileFromDb: (row) => {
    if (!row) return null;
    let startDate = undefined;
    let startMonth = undefined;
    if (row.created_at) {
      const dt = new Date(row.created_at);
      if (!isNaN(dt.getTime())) {
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        startDate = `${y}-${m}-${d}`;
        startMonth = `${y}-${m}`;
      }
    }
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      password: row.password || '',
      role: row.role,
      region: row.region || 'all',
      phone: row.phone || '',
      telegram: row.telegram || '',
      avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: row.status || 'active',
      payModel: row.salary_type || (row.role === 'seller' ? 'percent' : row.role === 'editor' ? 'per_student' : row.role === 'maker' ? 'by_album_type' : row.role === 'photographer' ? 'salary' : 'salary'),
      payRate: Number(row.rate) || 0,
      paidAmount: Number(row.paid_amount) || 0,
      paidCommission: Number(row.paid_amount) || 0,
      advanceTaken: Number(row.advance_taken) || 0,
      monthlySalary: Number(row.monthly_salary) || 0,
      createdAt: row.created_at || '',
      startDate,
      startMonth
    };
  },

  mapProfileToDb: (user) => {
    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      region: user.region || 'all',
      phone: user.phone,
      telegram: user.telegram,
      avatar: user.avatar,
      salary_type: user.payModel || 'salary',
      rate: user.payRate || 0,
      paid_amount: user.paidAmount || user.paidCommission || 0,
      advance_taken: user.advanceTaken || 0,
      monthly_salary: user.monthlySalary || 0,
      status: user.status || 'active'
    };
    if (user.startDate && /^\d{4}-\d{2}-\d{2}$/.test(user.startDate)) {
      payload.created_at = `${user.startDate}T12:00:00.000Z`;
    } else if (user.createdAt) {
      payload.created_at = user.createdAt;
    }
    return payload;
  },

  // UI Status Pill (Productionda yashirin, xatoliksiz)
  renderStatusPill: () => ''
};

window.SupabaseService = SupabaseService;
