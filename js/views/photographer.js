/* ====================================================================
   VINETKA CRM & ERP - PHOTOGRAPHER VIEW (FOTOGRAF PANELI)
   Mobile-First (Telegram Web App), Center on Desktop
   Apple HIG & Payno Fintech UI
   ==================================================================== */

const PhotographerView = {
  currentTab: 'queue', // 'queue' | 'my_work' | 'history'
  activeRegionFilter: 'all', // 'all' | 'Toshkent shahri' | 'Samarqand' ...

  setRegionFilter: (region) => {
    PhotographerView.activeRegionFilter = region;
    App.render();
  },

  render: () => {
    const user = store.currentUser || {};
    const finance = store.getPhotographerFinance(user.id || '');

    // Viloyat filtri bo'yicha saralash
    let allQueue = store.orders.filter(o => o.status === 'photo_queue');
    let allMyActive = store.orders.filter(o => o.status === 'photo_active' && o.photographerId === user.id);
    let allMyHistory = store.orders.filter(o => o.photographerId === user.id && o.status !== 'photo_active' && o.status !== 'photo_queue');

    if (PhotographerView.activeRegionFilter && PhotographerView.activeRegionFilter !== 'all') {
      allQueue = allQueue.filter(o => o.region === PhotographerView.activeRegionFilter);
      allMyActive = allMyActive.filter(o => o.region === PhotographerView.activeRegionFilter);
      allMyHistory = allMyHistory.filter(o => o.region === PhotographerView.activeRegionFilter);
    }

    const regions = store.getRegions ? store.getRegions() : ['Toshkent shahri', 'Samarqand', 'Buxoro', 'Fargʻona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', 'Qoraqalpogʻiston'];

    return `
      <div class="min-h-screen bg-[#F4F7FB] pb-24">
        <!-- O'zgarmas Header -->
        ${Components.Header(user, "App.openProfileModal()", "App.logout()")}

        <!-- Asosiy Kontent -->
        <main class="px-5 pt-4 max-w-md mx-auto">
          <!-- 1. Moliya Kartalari -->
          <section class="space-y-3 mb-5">
            <!-- Qarz kartasi (agar mijozdan pul olingan bo'lsa va buxgalterga topshirilishi kerak bo'lsa) -->
            ${(finance.cashInHand > 0 || finance.cashSubmittedPending > 0) ? `
              <div 
                onclick="PhotographerView.openCashSubmissionModal()" 
                class="payno-finance-card-red p-6 cursor-pointer active:scale-[0.98] transition-all"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[13px] font-semibold text-[#d64138] flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-[#d64138] animate-pulse"></span>
                    <span>Buxgalterga beriladigan summa (Qarz)</span>
                  </span>
                  <div class="w-10 h-10 rounded-full bg-[#d64138] text-white flex items-center justify-center shrink-0">
                    ${Icons.arrowDownLeft('w-4 h-4')}
                  </div>
                </div>

                <div class="mb-4">
                  <div class="text-[32px] leading-tight font-extrabold text-[#000000] tracking-tight">
                    ${Store.formatMoney(finance.cashInHand)}
                  </div>
                </div>

                <div class="bg-[#F9F9F9] rounded-[24px] p-3.5 flex items-center justify-between text-xs">
                  <span class="text-[#808080] font-semibold">Buxgalterga topshirish uchun bosing:</span>
                  <span class="font-extrabold text-[#d64138]">Topshirish &rarr;</span>
                </div>

                ${finance.cashSubmittedPending > 0 ? `
                  <div class="mt-2.5 text-[11px] font-bold text-[#d64138] bg-[#d64138]/[0.06] py-2 px-3 rounded-[16px] flex items-center gap-1.5">
                    ${Icons.clock('w-3.5 h-3.5 text-[#d64138]')}
                    <span>${Store.formatMoney(finance.cashSubmittedPending)} buxgalter tasdigʻida kutilmoqda</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- "Pulim" kartasi (Oylik maosh / Gonorar) -->
            <div 
              onclick="PhotographerView.openSalaryModal()" 
              class="payno-finance-card-blue p-6 cursor-pointer active:scale-[0.98] transition-all"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[13px] font-semibold text-[#808080]">
                  ${finance.payModel === 'salary' ? 'Oylik maoshim' : 'Ishlagan gonorarim'}
                </span>
                <div class="w-10 h-10 rounded-full bg-[#d64138] text-white flex items-center justify-center shrink-0">
                  ${Icons.arrowUpRight('w-4 h-4')}
                </div>
              </div>

              <div class="mb-4">
                <div class="text-[32px] leading-tight font-extrabold text-[#000000] tracking-tight">
                  ${Store.formatMoney(finance.totalEarned)}
                </div>
              </div>

              <div class="bg-[#F9F9F9] rounded-[24px] p-4 flex items-center justify-between text-xs">
                <span class="text-[#808080] font-semibold">Qolgan summa:</span>
                <span class="font-extrabold text-[#d64138] text-sm">${Store.formatMoney(finance.remainingSalary)}</span>
              </div>
            </div>
          </section>

          <!-- 2. Action: "+ Umumiy xarajat" tugmasi -->
          <div class="mb-4">
            <button 
              onclick="PhotographerView.openGeneralExpenseModal()" 
              class="w-full payno-pill-btn bg-white hover:bg-[#F0F0F0] text-[#d64138] py-3.5 px-5 text-xs font-extrabold active:scale-[0.98] flex items-center justify-center gap-2 min-h-[50px]"
            >
              <span class="w-7 h-7 rounded-full bg-[#d64138]/10 flex items-center justify-center shrink-0">
                ${Icons.receipt('w-4 h-4 text-[#d64138]')}
              </span>
              <span>+ Umumiy xarajat joʻnatish</span>
            </button>
          </div>

          <!-- 3. Viloyatlar filtri (Buyurtmalar bo'limi tepasida) -->
          <div class="mb-4">
            <div class="text-[11px] font-bold text-[#808080] uppercase tracking-wider mb-2 px-1">
              Viloyat boʻyicha filter:
            </div>
            <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button 
                onclick="PhotographerView.setRegionFilter('all')" 
                class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${PhotographerView.activeRegionFilter === 'all' ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
              >
                Barchasi (Umumiy)
              </button>
              ${regions.map(reg => `
                <button 
                  onclick="PhotographerView.setRegionFilter('${reg}')" 
                  class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${PhotographerView.activeRegionFilter === reg ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
                >
                  ${reg}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 4. 3 ta Bo'lim Switcheri (Navbat | Ishim | Tarix) — Design Namuna Pill Tabs -->
          <div class="grid grid-cols-3 gap-2 mb-5 text-xs font-bold">
            <button 
              onclick="PhotographerView.switchTab('queue')" 
              class="py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[13px] min-h-[50px] font-extrabold ${PhotographerView.currentTab === 'queue' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              <span>Navbat</span>
              <span class="px-2 py-0.5 ${PhotographerView.currentTab === 'queue' ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#1C1C1E]'} rounded-full text-[11px] font-extrabold">${allQueue.length}</span>
            </button>
            <button 
              onclick="PhotographerView.switchTab('my_work')" 
              class="py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[13px] min-h-[50px] font-extrabold ${PhotographerView.currentTab === 'my_work' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              <span>Ishim</span>
              <span class="px-2 py-0.5 ${PhotographerView.currentTab === 'my_work' ? 'bg-[#d64138] text-white' : 'bg-[#d64138]/10 text-[#d64138]'} rounded-full text-[11px] font-extrabold">${allMyActive.length}</span>
            </button>
            <button 
              onclick="PhotographerView.switchTab('history')" 
              class="py-3.5 rounded-full transition-all text-[13px] min-h-[50px] font-extrabold flex items-center justify-center ${PhotographerView.currentTab === 'history' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              Tarix (${allMyHistory.length})
            </button>
          </div>

          <!-- Tab Content (Kompakt kartochkalar) -->
          ${PhotographerView.currentTab === 'queue' ? PhotographerView.renderQueueTab(allQueue) : ''}
          ${PhotographerView.currentTab === 'my_work' ? PhotographerView.renderMyWorkTab(allMyActive) : ''}
          ${PhotographerView.currentTab === 'history' ? PhotographerView.renderHistoryTab(allMyHistory) : ''}
        </main>
      </div>
    `;
  },

  switchTab: (tab) => {
    PhotographerView.currentTab = tab;
    App.render();
  },

  // 1. Navbat (Umumiy Stol) - Kompakt kartochkalar
  renderQueueTab: (orders) => {
    if (orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <div class="w-12 h-12 mx-auto mb-2 text-slate-300">${Icons.camera('w-12 h-12')}</div>
          <p class="text-sm font-semibold">Fotograflar navbatida boʻsh buyurtma yoʻq</p>
        </div>
      `;
    }

    return `
      <div class="space-y-2">
        ${orders.map(order => Components.OrderCard(order, `PhotographerView.openOrderDetail('${order.id}')`)).join('')}
      </div>
    `;
  },

  // 2. Ishim (Fotografning aktiv guruhi) - Kompakt kartochkalar
  renderMyWorkTab: (orders) => {
    if (orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <p class="text-sm font-semibold">Hozirda faol fotosessiyangiz yoʻq</p>
          <button 
            onclick="PhotographerView.switchTab('queue')" 
            class="mt-3 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold inline-block"
          >
            Navbatdan ish olish
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-2">
        ${orders.map(order => Components.OrderCard(order, `PhotographerView.openOrderDetail('${order.id}')`)).join('')}
      </div>
    `;
  },

  // 3. Tarix (Bajarilgan guruhlar) - Kompakt kartochkalar
  renderHistoryTab: (orders) => {
    if (orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <p class="text-sm font-semibold">Tarixda bajarilgan guruhlar yoʻq</p>
        </div>
      `;
    }

    return `
      <div class="space-y-2">
        ${orders.map(order => Components.OrderCard(order, `PhotographerView.openOrderDetail('${order.id}')`)).join('')}
      </div>
    `;
  },

  // Buyurtma batafsil modali (Kompakt kartochka bosilganda)
  openOrderDetail: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    const user = store.currentUser || {};
    const sellerUser = (store.users || []).find(u => u.id === order.sellerId);
    const sellerName = order.sellerName || (sellerUser ? sellerUser.name : 'Sotuvchi');
    const sellerPhone = order.sellerPhone || (sellerUser ? sellerUser.phone : '');
    const mapUrl = order.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.university + ' ' + (order.region || ''))}`;
    const isMyActive = order.status === 'photo_active' && order.photographerId === user.id;
    const isQueue = order.status === 'photo_queue';

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Tepasi: Kod va Status -->
        <div class="flex items-center justify-between pb-3 border-b border-black/[0.05]">
          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold tracking-tight text-[#1D1D1F] bg-black/[0.05] px-2.5 py-1 rounded-full">
              ${order.id}
            </span>
            <span class="text-xs font-bold text-[#d64138] flex items-center gap-1">
              ${Icons.mapPin('w-3.5 h-3.5 text-[#d64138]')}
              <span>${order.region || 'Toshkent shahri'}</span>
            </span>
          </div>
          <div>
            ${Components.StatusBadge(order)}
          </div>
        </div>

        <!-- Asosiy guruh ma'lumotlari -->
        <div class="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-2 text-xs">
          <div>
            <div class="text-[10px] uppercase font-bold text-[#86868B]">Universitet va Fakultet</div>
            <div class="text-sm font-bold text-[#1D1D1F] mt-0.5">${order.university}</div>
            <div class="text-xs text-[#86868B]">${order.faculty} &bull; <strong class="text-[#1D1D1F]">${order.group}</strong></div>
          </div>

          ${order.photoDate ? `
            <div class="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <span class="text-amber-900 font-bold flex items-center gap-1.5">
                ${Icons.calendar('w-3.5 h-3.5 text-amber-600')}
                <span>Fotosessiya sanasi:</span>
              </span>
              <span class="font-extrabold text-amber-900">${order.photoDate}</span>
            </div>
          ` : ''}

          <div class="flex items-center justify-between pt-1">
            <span class="text-[#86868B]">Guruh sardori:</span>
            <span class="font-bold text-[#1D1D1F]">${order.leaderName}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-[#86868B]">Telefon raqami:</span>
            <a href="tel:${order.leaderPhone}" class="font-bold text-[#d64138] flex items-center gap-1">
              ${Icons.phone('w-3.5 h-3.5')}
              <span>${order.leaderPhone}</span>
            </a>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-[#86868B]">Kutilayotgan talabalar:</span>
            <span class="font-bold text-[#1D1D1F]">${order.studentCount} ta</span>
          </div>

          <!-- Mas'ul Sotuvchi (Muloqot va savollar uchun) -->
          <div class="mt-2 pt-2 border-t border-black/[0.05] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-[#d64138] shrink-0">
                ${(sellerName || 'S').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div class="text-[9px] uppercase font-bold text-[#86868B]">Masʼul Sotuvchi</div>
                <div class="text-xs font-bold text-[#1D1D1F]">${sellerName}</div>
              </div>
            </div>
            ${sellerPhone ? `
              <a href="tel:${sellerPhone}" class="px-2.5 py-1 rounded-full bg-[#d64138]/10 text-[#d64138] hover:bg-[#d64138]/20 text-[11px] font-bold flex items-center gap-1 transition-all">
                ${Icons.phone('w-3 h-3')}
                <span>${sellerPhone}</span>
              </a>
            ` : ''}
          </div>

          ${order.notes ? `
            <div class="pt-2 border-t border-black/[0.05]">
              <span class="text-[#86868B] block text-[10px] uppercase font-bold">Sotuvchi izohi:</span>
              <span class="text-[#1D1D1F] font-medium text-xs">${order.notes}</span>
            </div>
          ` : ''}
        </div>

        <!-- Google Maps Lokatsiyasi -->
        <div>
          <a 
            href="${mapUrl}" 
            target="_blank" 
            class="flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-all"
          >
            <span class="flex items-center gap-2">
              ${Icons.mapPin('w-4 h-4 text-blue-600')}
              <span>Xaritada ochish (Google Maps)</span>
            </span>
            ${Icons.arrowUpRight('w-3.5 h-3.5 text-blue-600')}
          </a>
        </div>

        <!-- Agar Ishim (Faol fotosessiya) bo'lsa: Xarajatlar va Yakunlash -->
        ${isMyActive ? `
          <div class="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[#1D1D1F]">Ushbu guruh xarajatlari:</span>
              <button 
                onclick="PhotographerView.openAddCostModal('${order.id}')" 
                class="text-xs font-bold text-[#d64138] hover:underline flex items-center gap-1"
              >
                ${Icons.plus('w-3.5 h-3.5')}
                <span>+ Xarajat qoʻshish</span>
              </button>
            </div>

            ${(!order.costs || order.costs.length === 0) ? `
              <div class="p-2.5 rounded-xl bg-[#F5F5F7] text-[11px] text-[#86868B] text-center">
                Xarajatlar kiritilmagan
              </div>
            ` : `
              <div class="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                ${order.costs.map(c => `
                  <div class="p-2 rounded-xl bg-[#F5F5F7] flex items-center justify-between text-xs">
                    <div>
                      <div class="font-semibold text-[#1D1D1F]">${c.title}</div>
                      <div class="text-[10px] text-[#86868B]">${c.date}</div>
                    </div>
                    <div class="font-extrabold text-[#1D1D1F]">${Store.formatMoney(c.amount)}</div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Yakunlash tugmasi -->
          <button 
            onclick="PhotographerView.openCompleteModal('${order.id}', ${order.studentCount})" 
            class="w-full payno-pill-btn payno-btn-success py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            ${Icons.checkCircle('w-4 h-4')}
            <span>Fotosessiyani tugatdim (Mijozdan pul olish)</span>
          </button>
        ` : ''}

        <!-- Agar Navbatda bo'lsa: "Ishni o'zimga olish" -->
        ${isQueue ? `
          <button 
            onclick="PhotographerView.claimOrder('${order.id}')" 
            class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            ${Icons.camera('w-4 h-4')}
            <span>Ishni oʻzimga olish</span>
          </button>
        ` : ''}

        <!-- Agar Yakunlangan / Tarixda bo'lsa -->
        ${(!isMyActive && !isQueue) ? `
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-[#86868B]">Real tushgan talabalar:</span>
              <span class="font-extrabold text-[#34C759]">${order.realStudentCount || order.studentCount} ta</span>
            </div>
            ${order.photoDriveLink ? `
              <div class="pt-1 flex items-center justify-between">
                <span class="text-[#86868B]">Rasmlar havolasi:</span>
                <a href="${order.photoDriveLink}" target="_blank" class="font-bold text-[#d64138] hover:underline flex items-center gap-1">
                  <span>Havolani ochish</span>
                  ${Icons.arrowUpRight('w-3 h-3')}
                </a>
              </div>
            ` : ''}
            ${order.photographerCollectedAmount ? `
              <div class="pt-1 flex items-center justify-between border-t border-black/[0.04]">
                <span class="text-[#86868B]">Mijozdan olingan summa:</span>
                <span class="font-extrabold text-[#FF3B30]">${Store.formatMoney(order.photographerCollectedAmount)}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;

    App.openModal("Buyurtma tafsilotlari", bodyHtml);
  },

  claimOrder: (orderId) => {
    const success = store.claimPhotoOrder(orderId);
    if (success) {
      App.closeModal();
      PhotographerView.currentTab = 'my_work';
      App.showToast("Buyurtma sizning ishingizga biriktirildi!");
      App.render();
    }
  },

  // Fotosessiyani yakunlash modali: Rasmlar havolasi + MIJOZDAN PUL OLISH
  openCompleteModal: (orderId, defaultCount) => {
    PhotographerView.clientCashSelected = false;
    const bodyHtml = `
      <form id="photo-complete-form" onsubmit="PhotographerView.handleCompleteSubmit(event, '${orderId}')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Real nechta talaba suratga tushdi? (dona) *</label>
          <input type="number" id="real-students-count" required value="${defaultCount}" min="1" max="250" class="payno-input font-bold" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Rasmlar havolasi (Telegram / Drive link) *</label>
          <input type="url" id="photo-drive-link" required placeholder="https://drive.google.com/drive/folders/..." class="payno-input" />
          <span class="text-[11px] text-slate-400 mt-1 block">Dizaynerlar ushbu havola orqali montajni boshlaydi.</span>
        </div>

        <!-- 2. YANGI JARAYON: Mijozdan pul oldingizmi? -->
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
              ${Icons.receipt('w-4 h-4 text-amber-700')}
              <span>Mijozdan pul oldingizmi?</span>
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-2 p-1 bg-amber-100/60 rounded-xl text-xs font-bold">
            <button 
              type="button" 
              id="btn-photo-cash-no"
              onclick="PhotographerView.toggleClientCash(false)"
              class="py-2 rounded-lg bg-white text-slate-900 shadow-xs transition-all"
            >
              Yoʻq, pul olmadim
            </button>
            <button 
              type="button" 
              id="btn-photo-cash-yes"
              onclick="PhotographerView.toggleClientCash(true)"
              class="py-2 rounded-lg text-amber-900 transition-all"
            >
              Ha, pul oldim
            </button>
          </div>

          <div id="photo-cash-amount-container" class="hidden pt-1.5 space-y-1">
            <label class="block text-[11px] font-bold text-amber-950">
              Mijozdan olingan naqd pul summasi (soʻm):
            </label>
            <div class="relative flex items-center">
              <span class="absolute left-3 text-slate-400 font-bold text-xs">UZS</span>
              <input 
                type="text" 
                inputmode="numeric"
                id="photo-client-cash-input" 
                placeholder="Masalan: 500 000" 
                oninput="App.formatMoneyInput(this)"
                class="payno-input pl-12 pr-4 text-xs font-bold bg-white" 
              />
            </div>
            <p class="text-[10px] text-amber-800 leading-tight pt-1">
              * Ushbu summa sizning balansingizda "Buxgalterga beriladigan summa" (qarz) sifatida saqlanadi va topshirilgach sotuvchi qarzidan ayrib tashlanadi.
            </p>
          </div>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5">
            ${Icons.check('w-4 h-4')}
            <span>Fotosessiyani yakunlash</span>
          </button>
        </div>
      </form>
    `;

    App.openModal("Fotosessiyani yakunlash", bodyHtml);
  },

  clientCashSelected: false,

  toggleClientCash: (hasCash) => {
    PhotographerView.clientCashSelected = hasCash;
    const btnNo = document.getElementById('btn-photo-cash-no');
    const btnYes = document.getElementById('btn-photo-cash-yes');
    const container = document.getElementById('photo-cash-amount-container');
    const input = document.getElementById('photo-client-cash-input');

    if (btnNo && btnYes && container) {
      if (hasCash) {
        btnYes.className = "py-2 rounded-lg bg-amber-600 text-white font-extrabold shadow-xs transition-all";
        btnNo.className = "py-2 rounded-lg text-slate-600 transition-all";
        container.classList.remove('hidden');
        if (input) input.focus();
      } else {
        btnNo.className = "py-2 rounded-lg bg-white text-slate-900 font-extrabold shadow-xs transition-all";
        btnYes.className = "py-2 rounded-lg text-amber-900 transition-all";
        container.classList.add('hidden');
        if (input) input.value = '';
      }
    }
  },

  handleCompleteSubmit: (e, orderId) => {
    e.preventDefault();
    const realCount = document.getElementById('real-students-count').value;
    const driveLink = document.getElementById('photo-drive-link').value.trim();
    
    let cashAmount = 0;
    if (PhotographerView.clientCashSelected) {
      const input = document.getElementById('photo-client-cash-input');
      cashAmount = Store.parseMoney(input ? input.value : 0);
      if (cashAmount <= 0) {
        alert("Iltimos, mijozdan olingan summani toʻgʻri kiriting yoki 'Yoʻq, pul olmadim' ni tanlang!");
        return;
      }
    }

    const success = store.completePhotoOrder(orderId, realCount, driveLink, cashAmount);
    if (success) {
      PhotographerView.clientCashSelected = false;
      App.closeModal();
      PhotographerView.currentTab = 'history';
      if (cashAmount > 0) {
        App.showToast(`Suratlar topshirildi! Mijozdan ${Store.formatMoney(cashAmount)} naqd pul qabul qilindi.`);
      } else {
        App.showToast(`Suratlar topshirildi! Guruh Dizaynerlar navbatiga oʻtdi.`);
      }
      App.render();
    }
  },

  // 2-Karta: Buxgalterga Beriladigan Pul Modali (Fotograf mijozdan olgan pullarni topshirishi)
  openCashSubmissionModal: () => {
    const user = store.currentUser || {};
    const finance = store.getPhotographerFinance(user.id);
    
    // Fotograf mijozdan pul olgan va hali topshirmagan guruhlar
    const activeCashOrders = store.orders.filter(o => 
      o.photographerId === user.id && 
      (o.photographerCollectedAmount || 0) > (o.photographerSubmittedAmount || 0)
    );

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Yuqori qism: Jami topshirilishi kerak pul -->
        <div class="text-center py-3.5 px-4 bg-[#F5F5F7] rounded-2xl border border-black/[0.04]">
          <div class="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
            Qoʻldagi buxgalterga topshirilishi kerak boʻlgan summa
          </div>
          <div class="text-3xl font-extrabold text-[#1D1D1F] tracking-tight">
            ${Store.formatMoney(finance.cashInHand)}
          </div>
          ${finance.cashSubmittedPending > 0 ? `
            <div class="mt-2 text-xs font-semibold text-[#C96F00] bg-[#FF9500]/10 py-1 px-3 rounded-full inline-flex items-center gap-1.5 border border-[#FF9500]/20">
              ${Icons.clock('w-3.5 h-3.5')}
              <span>${Store.formatMoney(finance.cashSubmittedPending)} buxgalter tasdigʻida kutilmoqda</span>
            </div>
          ` : ''}
        </div>

        ${activeCashOrders.length === 0 ? `
          <div class="text-center py-8 text-[#86868B] bg-white rounded-2xl border border-black/[0.04] p-5">
            <div class="w-12 h-12 rounded-full bg-black/[0.04] text-[#86868B] flex items-center justify-center mx-auto mb-2">
              ${Icons.checkCircle('w-6 h-6')}
            </div>
            <p class="text-xs font-bold text-[#1D1D1F]">
              Topshiriladigan qarzlar yoʻq
            </p>
            <p class="text-[11px] text-[#86868B] mt-0.5">
              Mijozlardan olingan barcha pullar buxgalterga topshirilgan.
            </p>
          </div>
        ` : `
          <div class="space-y-3">
            <div class="flex items-center justify-between px-1">
              <span class="text-xs font-bold text-[#1D1D1F]">
                Toʻlov topshiriladigan guruhlar:
              </span>
              <span class="text-[11px] font-semibold text-[#86868B]">${activeCashOrders.length} ta guruh</span>
            </div>

            ${activeCashOrders.map(order => {
              const collected = order.photographerCollectedAmount || 0;
              const submitted = order.photographerSubmittedAmount || 0;
              const pending = order.photographerSubmittedPending || 0;
              const remainingDebt = Math.max(0, collected - submitted);
              const isPending = pending > 0;

              return `
                <div class="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-xs space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-xs font-bold text-[#1D1D1F]">${order.id} &bull; ${order.group}</div>
                      <div class="text-[11px] text-[#86868B] font-medium">${order.university} (${order.region || 'Toshkent'})</div>
                    </div>
                    <div>
                      <span class="px-2.5 py-0.5 rounded-full bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20 text-[10px] font-semibold">
                        Qarz: ${Store.formatMoney(remainingDebt)}
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.02] text-center">
                    <div>
                      <div class="text-[9px] font-semibold uppercase text-[#86868B]">Olingan pul</div>
                      <div class="text-[11px] font-bold text-[#1D1D1F] mt-0.5">${Store.formatMoney(collected)}</div>
                    </div>
                    <div>
                      <div class="text-[9px] font-semibold uppercase text-[#86868B]">Topshirilgan</div>
                      <div class="text-[11px] font-bold text-[#34C759] mt-0.5">${Store.formatMoney(submitted)}</div>
                    </div>
                    <div>
                      <div class="text-[9px] font-semibold uppercase text-[#FF3B30]">Qolgan qarz</div>
                      <div class="text-[11px] font-bold text-[#FF3B30] mt-0.5">${Store.formatMoney(remainingDebt)}</div>
                    </div>
                  </div>

                  ${isPending ? `
                    <div class="p-2.5 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/20 text-[11px] text-[#C96F00] font-semibold flex items-center justify-between">
                      <span class="flex items-center gap-1.5">
                        ${Icons.clock('w-3.5 h-3.5 text-[#FF9500]')}
                        <span>Tasdiq kutilmoqda:</span>
                      </span>
                      <span class="font-bold">${Store.formatMoney(pending)}</span>
                    </div>
                  ` : ''}

                  <!-- Action: To'lov oynasiga o'tish -->
                  ${isPending ? `
                    <button 
                      disabled 
                      class="w-full payno-pill-btn bg-black/[0.04] text-[#86868B] py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed border border-black/[0.05]"
                    >
                      ${Icons.clock('w-3.5 h-3.5 text-[#FF9500]')}
                      <span>Tasdiq kutilmoqda</span>
                    </button>
                  ` : `
                    <button 
                      onclick="PhotographerView.openPayGroupModal('${order.id}')" 
                      class="w-full payno-pill-btn payno-btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
                    >
                      ${Icons.arrowDownLeft('w-3.5 h-3.5')}
                      <span>Toʻlov topshirish (Qoʻlda summa)</span>
                    </button>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    App.openModal("Buxgalterga pul topshirish", bodyHtml);
  },

  // Guruh bo'yicha to'lov topshirish (Qo'lda ixtiyoriy summa, 50%/100% tugmalari YO'Q!)
  openPayGroupModal: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    if ((order.photographerSubmittedPending || 0) > 0) {
      App.showToast("Ushbu guruh boʻyicha avval yuborilgan toʻlov tasdiqlanishi kutilmoqda!", "warning");
      return;
    }

    const collected = order.photographerCollectedAmount || 0;
    const submitted = order.photographerSubmittedAmount || 0;
    const remainingDebt = Math.max(0, collected - submitted);

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Guruh Qisqacha Info -->
        <div class="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-[#1D1D1F]">${order.id} &bull; ${order.group}</span>
            <span class="text-[11px] font-semibold text-[#86868B]">${order.university}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-black/[0.04] text-center">
            <div class="p-2 rounded-xl bg-white border border-black/[0.03]">
              <div class="text-[9px] font-semibold uppercase text-[#86868B]">Olingan pul</div>
              <div class="text-xs font-bold text-[#1D1D1F] mt-0.5">${Store.formatMoney(collected)}</div>
            </div>
            <div class="p-2 rounded-xl bg-white border border-black/[0.03]">
              <div class="text-[9px] font-semibold uppercase text-[#86868B]">Topshirilgan</div>
              <div class="text-xs font-bold text-[#34C759] mt-0.5">${Store.formatMoney(submitted)}</div>
            </div>
            <div class="p-2 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20">
              <div class="text-[9px] font-semibold uppercase text-[#FF3B30]">Qolgan qarz</div>
              <div class="text-xs font-bold text-[#FF3B30] mt-0.5">${Store.formatMoney(remainingDebt)}</div>
            </div>
          </div>
        </div>

        <!-- Qo'lda ixtiyoriy summa kiritish -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-[#1D1D1F]">
              Topshirilayotgan summa miqdori:
            </label>
            <span class="text-[11px] font-bold text-[#FF3B30]">
              Qolgan qarz: ${Store.formatMoney(remainingDebt)}
            </span>
          </div>
          <div class="relative flex items-center">
            <span class="absolute left-4 text-[#86868B] font-bold text-xs">UZS</span>
            <input 
              type="text" 
              inputmode="numeric"
              id="photo-cash-submit-custom-input" 
              value="${Store.formatNumber(remainingDebt)}"
              placeholder="Masalan: 350 000"
              oninput="App.formatMoneyInput(this); PhotographerView.onCustomAmountInput('${order.id}', ${remainingDebt})"
              class="payno-input pl-14 pr-16 text-sm font-bold text-[#1D1D1F]"
            />
            <span class="absolute right-4 text-xs font-semibold text-[#86868B]">soʻm</span>
          </div>
          
          <div id="photo-cash-submit-hint" class="text-[11px] text-[#86868B] mt-1.5 pl-1 font-medium">
            Ushbu toʻlovdan soʻng qoladigan qarz: <strong class="text-[#34C759]">0 soʻm</strong>
          </div>
        </div>

        <div class="text-[11px] text-[#86868B] bg-[#F5F5F7] p-3 rounded-xl border border-black/[0.03] flex items-start gap-2">
          ${Icons.info('w-4 h-4 text-[#d64138] shrink-0 mt-0.5')}
          <div>
            <strong class="text-[#1D1D1F]">Muhim:</strong> Buxgalter ushbu toʻlovni tasdiqlagach, bu summa avtomatik ravishda SOTUVCHINING ushbu guruh boʻyicha qarzidan ham ayirib tashlanadi!
          </div>
        </div>

        <!-- Tasdiqlash Tugmalari -->
        <div class="space-y-2 pt-1">
          <button 
            type="button" 
            onclick="PhotographerView.confirmCashSubmit('${order.id}')" 
            class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            ${Icons.check('w-4 h-4')}
            <span>Buxgalterga toʻlovni topshirish</span>
          </button>
          
          <button 
            type="button" 
            onclick="PhotographerView.openCashSubmissionModal()" 
            class="w-full payno-pill-btn bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] py-2.5 text-xs font-semibold transition-all"
          >
            Ortga qaytish
          </button>
        </div>
      </div>
    `;

    App.openModal("Toʻlov topshirish", bodyHtml);
  },

  onCustomAmountInput: (orderId, remainingDebt) => {
    const input = document.getElementById('photo-cash-submit-custom-input');
    const val = Store.parseMoney(input ? input.value : 0);
    const hint = document.getElementById('photo-cash-submit-hint');
    if (!hint) return;

    if (val > remainingDebt) {
      hint.innerHTML = `<span class="text-rose-600 font-bold">Ogohlantirish: Kiritilgan summa qoldiq qarzdan (${Store.formatMoney(remainingDebt)}) oshib ketdi!</span>`;
    } else {
      const remAfter = Math.max(0, remainingDebt - val);
      hint.innerHTML = `Ushbu toʻlovdan soʻng qoladigan qarz: <strong class="${remAfter === 0 ? 'text-[#34C759]' : 'text-rose-600'}">${Store.formatMoney(remAfter)}</strong>`;
    }
  },

  confirmCashSubmit: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    if ((order.photographerSubmittedPending || 0) > 0) {
      alert("Ushbu guruh boʻyicha soʻrov buxgalter tasdigʻida kutilmoqda. Qayta yuborib boʻlmaydi!");
      return;
    }

    const input = document.getElementById('photo-cash-submit-custom-input');
    const amount = Store.parseMoney(input ? input.value : 0);

    const collected = order.photographerCollectedAmount || 0;
    const submitted = order.photographerSubmittedAmount || 0;
    const remainingDebt = Math.max(0, collected - submitted);

    if (!amount || amount <= 0) {
      alert("Iltimos, toʻgʻri summa kiriting (0 dan katta boʻlishi kerak)!");
      return;
    }
    if (amount > remainingDebt) {
      alert(`Kiritilgan summa qoldiq qarzdan (${Store.formatMoney(remainingDebt)}) koʻp boʻlishi mumkin emas!`);
      return;
    }

    const res = store.submitPhotographerCash(orderId, amount);
    if (res && res.success) {
      App.showToast(`Buxgalterga ${Store.formatMoney(amount)} toʻlov soʻrovi yuborildi!`);
      PhotographerView.openCashSubmissionModal();
      App.render();
    } else {
      alert((res && res.message) || "Xatolik yuz berdi!");
    }
  },

  // 3. Umumiy xarajat qo'shish modali (Guruhga bog'liq bo'lmagan xarajat)
  openGeneralExpenseModal: () => {
    const user = store.currentUser || {};

    const bodyHtml = `
      <form id="photo-general-expense-form" onsubmit="PhotographerView.handleGeneralExpenseSubmit(event)" class="space-y-4">
        <!-- 1. Xarajat nomi / Maqsadi -->
        <div>
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1">
            1. Xarajat maqsadi / Nomi (Nimaga sarflangani) <span class="text-rose-500">*</span>
          </label>
          <textarea 
            name="title" 
            required 
            rows="2"
            placeholder="Masalan: Fotosessiya rekvizitlari yoki yoʻl xarajati (izoh bilan)..." 
            class="payno-input text-xs py-2.5"
          ></textarea>
        </div>

        <!-- 2. Summasi -->
        <div>
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1">
            2. Summasi (soʻm) <span class="text-rose-500">*</span>
          </label>
          <div class="relative flex items-center">
            <span class="absolute left-4 text-[#86868B] font-bold text-xs">UZS</span>
            <input 
              type="text" 
              inputmode="numeric" 
              name="amount" 
              required 
              placeholder="Masalan: 50 000" 
              oninput="App.formatMoneyInput(this)"
              class="payno-input pl-14 pr-4 text-xs font-bold"
            />
          </div>
        </div>

        <!-- 3. Isbot cheki (Telegram havolasi) -->
        <div>
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1.5">
            3. Chek / Isbot havolasi (Telegram link)
          </label>
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-[#d64138]">
              ${Icons.link('w-4 h-4')}
            </span>
            <input 
              type="url" 
              name="receiptUrl" 
              placeholder="https://t.me/... (Telegramdagi chek yoki rasm havolasi)" 
              class="payno-input pl-10 pr-4 text-xs font-medium"
            />
          </div>
          <p class="text-[10px] text-[#86868B] mt-1 leading-tight">
            * Telegram guruh yoki postdagi chek havolasini kiriting.
          </p>
        </div>

        <div class="p-3 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-[11px] text-[#86868B] flex items-center gap-2">
          ${Icons.info('w-4 h-4 text-[#d64138] shrink-0')}
          <span>Ushbu xarajat sizning viloyatingiz (${user.region || 'Toshkent shahri'}) boʻyicha buxgalter tasdiqlash markaziga tushadi. Buxgalter tasdiqlashda tegishli kategoriyani belgilaydi.</span>
        </div>

        <div class="space-y-2 pt-2">
          <button 
            type="submit" 
            class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-xs active:scale-[0.98]"
          >
            Buxgalterga soʻrov yuborish
          </button>
          <button 
            type="button" 
            onclick="App.closeModal()" 
            class="w-full payno-pill-btn bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] py-2.5 text-xs font-semibold"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    `;

    App.openModal("Umumiy xarajat kiritish", bodyHtml);
  },

  handleGeneralExpenseSubmit: (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const amount = Store.parseMoney(form.amount.value);
    const receiptUrl = form.receiptUrl ? form.receiptUrl.value.trim() : '';

    if (!title || !amount || amount <= 0) {
      alert("Iltimos, xarajat maqsadi va summani toʻgʻri kiriting!");
      return;
    }

    const res = store.addGeneralExpense({
      title,
      amount,
      category: '', // Buxgalter tasdiqlashda tanlaydi!
      receiptUrl,
      comment: title
    });

    if (res && res.success) {
      App.closeModal();
      App.showToast(`Buxgalterga ${Store.formatMoney(amount)} umumiy xarajat soʻrovi yuborildi!`);
      App.render();
    } else {
      alert((res && res.message) || "Xatolik yuz berdi!");
    }
  },

  // Xarajat qo'shish modali (Guruh fotosessiyasi xarajati)
  openAddCostModal: (orderId) => {
    const bodyHtml = `
      <form id="photo-cost-form" onsubmit="PhotographerView.handleAddCostSubmit(event, '${orderId}')" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Xarajat maqsadi *</label>
          <input type="text" id="cost-title" required placeholder="Masalan: Taksi xarajati (OʻzMU - Studiya)" class="payno-input" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Summa (soʻm) *</label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="cost-amount" 
            required 
            placeholder="Masalan: 80 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Chek / Dalolat havolasi (Telegram / Drive link)</label>
          <input type="url" id="cost-proof" placeholder="https://t.me/cheklar/..." class="payno-input" />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Xarajatni buxgalter tasdigʻiga joʻnatish
          </button>
        </div>
      </form>
    `;

    App.openModal("Guruh xarajatini qoʻshish", bodyHtml);
  },

  handleAddCostSubmit: (e, orderId) => {
    e.preventDefault();
    const costData = {
      title: document.getElementById('cost-title').value.trim(),
      amount: Store.parseMoney(document.getElementById('cost-amount').value),
      proofLink: document.getElementById('cost-proof').value.trim()
    };
    store.addPhotoCost(orderId, costData);
    App.closeModal();
    App.showToast("Xarajat buxgalteriya tasdigʻiga yuborildi!");
    App.render();
  },

  // Oylik maosh tafsiloti modali
  openSalaryModal: (seasonId = null) => {
    const user = store.currentUser;
    const targetSeasonId = store.normalizePeriodId(seasonId || store.getCurrentMonthKey());
    const finance = store.getPhotographerFinance(user.id, targetSeasonId);

    const myOrders = store.orders.filter(o => 
      o.photographerId === user.id && store.matchesPeriod(o, targetSeasonId)
    );

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Oy va Yil boshqaruvi (Ixcham pill dropdown) -->
        <div class="flex items-center justify-between pb-2 border-b border-black/[0.05]">
          <span class="text-xs font-semibold text-[#86868B]">Oy va yil:</span>
          <div class="relative inline-block">
            <select 
              onchange="PhotographerView.openSalaryModal(this.value)" 
              class="text-xs font-semibold bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] rounded-full px-3 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              ${store.renderPeriodSelectOptions(targetSeasonId)}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86868B]">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
          <div class="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            ${finance.payModel === 'salary' ? `${finance.periodLabel || 'Shu oy'} uchun hisoblangan maosh` : 'Shu oyda hisoblangan gonorar'}
          </div>
          <div class="text-3xl font-extrabold text-slate-900">${Store.formatMoney(finance.periodEarned !== undefined ? finance.periodEarned : finance.monthlySalary)}</div>
          ${finance.payModel === 'salary' && finance.isProrated ? `
            <div class="mt-2 inline-block px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-[11px] font-bold border border-amber-200">
              ${finance.startDay}-sanadan oy yakunigacha: ${finance.workedDays} kunlik hisob (30 kunga: ${Store.formatMoney(finance.payRate)})
            </div>
          ` : ''}
        </div>

        ${finance.carryOverBalance !== 0 ? `
          <div class="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/70 flex items-center justify-between text-xs">
            <span class="text-slate-700 font-semibold">Oldingi oydan qoldiq (Qoʻshib beriladigan pul):</span>
            <span class="font-extrabold ${finance.carryOverBalance > 0 ? 'text-[#d64138]' : 'text-rose-600'}">
              ${finance.carryOverBalance > 0 ? '+' : ''}${Store.formatMoney(finance.carryOverBalance)}
            </span>
          </div>
        ` : ''}

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span class="text-slate-400 block font-semibold">Olingan avans / toʻlov:</span>
            <span class="text-rose-600 font-extrabold text-sm block mt-1">-${Store.formatMoney(finance.advanceTaken)}</span>
          </div>
          <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span class="text-emerald-700 block font-semibold">Olishga tayyor qoldiq:</span>
            <span class="text-emerald-800 font-extrabold text-sm block mt-1">${Store.formatMoney(finance.remainingSalary)}</span>
          </div>
        </div>

        <!-- Guruhlar bo'yicha hisobot -->
        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-xs font-bold text-[#86868B] uppercase tracking-wider">Guruhlar boʻyicha hisobot</span>
            <span class="text-[11px] text-[#86868B] font-medium">${myOrders.length} ta guruh</span>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
            ${myOrders.length === 0 ? `
              <div class="text-center py-6 text-xs text-[#86868B] bg-[#F5F5F7] rounded-2xl">
                Ushbu oyda buyurtmalar topilmadi
              </div>
            ` : myOrders.map(order => {
              const students = order.realStudentCount || order.studentCount || 0;
              const isCompleted = order.status !== 'photo_active' && order.status !== 'photo_queue';
              return `
                <div class="p-3 rounded-2xl ${isCompleted ? 'bg-[#d64138]/[0.04] border border-[#d64138]/20' : 'bg-[#F5F5F7] border border-black/[0.04]'} flex items-center justify-between text-xs transition-all">
                  <div>
                    <div class="font-bold text-[#1D1D1F]">${order.id} &bull; ${order.group}</div>
                    <div class="text-[11px] text-[#86868B]">${order.university} (${students} talaba)</div>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold ${isCompleted ? 'text-blue-600' : 'text-amber-600'}">
                      ${isCompleted ? Icons.checkCircle('w-3 h-3 text-blue-600') : Icons.clock('w-3 h-3 text-amber-600')}
                      <span>${isCompleted ? 'Tugatilgan' : 'Jarayonda'}</span>
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    App.openModal("Mening maoshim", bodyHtml);
  }
};

window.PhotographerView = PhotographerView;
