/* ====================================================================
   VINETKA CRM & ERP - ALBUM MAKER VIEW (ALBOM YASOVCHI PANELI)
   Mobile-First (Telegram Web App), Center on Desktop
   ==================================================================== */

const MakerView = {
  currentTab: 'queue', // 'queue' | 'my_work' | 'history'
  activeRegionFilter: 'all',

  setRegionFilter: (reg) => {
    MakerView.activeRegionFilter = reg;
    App.render();
  },

  render: () => {
    const user = store.currentUser || {};
    const finance = store.getMakerFinance(user.id || '');
    const regions = store.getRegions ? store.getRegions() : ['Toshkent', 'Samarqand', 'Buxoro', 'Fargʻona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', 'Qoraqalpogʻiston'];

    let queueOrders = store.orders.filter(o => o.status === 'make_queue');
    let myActiveOrders = store.orders.filter(o => o.status === 'make_active' && o.makerId === user.id);
    let myHistoryOrders = store.orders.filter(o => o.makerId === user.id && o.status !== 'make_active' && o.status !== 'make_queue');

    if (MakerView.activeRegionFilter !== 'all') {
      const matchReg = (o) => {
        const c = (o.city || '').toLowerCase();
        const r = (MakerView.activeRegionFilter || '').toLowerCase();
        return c.includes(r) || r.includes(c);
      };
      queueOrders = queueOrders.filter(matchReg);
      myActiveOrders = myActiveOrders.filter(matchReg);
      myHistoryOrders = myHistoryOrders.filter(matchReg);
    }

    return `
      <div class="min-h-screen bg-[#F4F7FB] pb-24">
        <!-- O'zgarmas Header -->
        ${Components.Header(user, "App.openProfileModal()", "App.logout()")}

        <main class="px-5 pt-4 max-w-md mx-auto">
          <!-- Moliya Kartasi (Yasalgan albomlar sonidan chiqqan pul) -->
          <section class="mb-5">
            <div 
              onclick="MakerView.openFinanceModal()" 
              class="payno-finance-card-blue p-6 cursor-pointer active:scale-[0.98] transition-all"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[13px] font-semibold text-[#808080]">
                  Yasalgan albomlar haqi
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
                <span class="text-[#808080] font-semibold">Yechishga tayyor:</span>
                <span class="font-extrabold text-[#d64138] text-sm">${Store.formatMoney(finance.availableToWithdraw)}</span>
              </div>
            </div>
          </section>

          <!-- Viloyatlar filtri -->
          <div class="mb-4">
            <div class="text-[11px] font-bold text-[#808080] uppercase tracking-wider mb-2 px-1">
              Viloyat boʻyicha filter:
            </div>
            <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button 
                onclick="MakerView.setRegionFilter('all')" 
                class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${MakerView.activeRegionFilter === 'all' ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
              >
                Barchasi (Umumiy)
              </button>
              ${regions.map(reg => `
                <button 
                  onclick="MakerView.setRegionFilter('${reg}')" 
                  class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${MakerView.activeRegionFilter === reg ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
                >
                  ${reg}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 3 ta Bo'lim Switcheri (Navbat | Ishim | Tarix) — Design Namuna Pill Tabs -->
          <div class="grid grid-cols-3 gap-2 mb-5 text-xs font-bold">
            <button 
              onclick="MakerView.switchTab('queue')" 
              class="py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[13px] min-h-[50px] font-extrabold ${MakerView.currentTab === 'queue' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              <span>Navbat</span>
              <span class="px-2 py-0.5 ${MakerView.currentTab === 'queue' ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#1C1C1E]'} rounded-full text-[11px] font-extrabold">${queueOrders.length}</span>
            </button>
            <button 
              onclick="MakerView.switchTab('my_work')" 
              class="py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[13px] min-h-[50px] font-extrabold ${MakerView.currentTab === 'my_work' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              <span>Ishim</span>
              <span class="px-2 py-0.5 ${MakerView.currentTab === 'my_work' ? 'bg-[#d64138] text-white' : 'bg-[#d64138]/10 text-[#d64138]'} rounded-full text-[11px] font-extrabold">${myActiveOrders.length}</span>
            </button>
            <button 
              onclick="MakerView.switchTab('history')" 
              class="py-3.5 rounded-full transition-all text-[13px] min-h-[50px] font-extrabold flex items-center justify-center ${MakerView.currentTab === 'history' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              Tarix (${myHistoryOrders.length})
            </button>
          </div>

          <!-- Tab Content -->
          ${MakerView.currentTab === 'queue' ? MakerView.renderQueueTab(queueOrders) : ''}
          ${MakerView.currentTab === 'my_work' ? MakerView.renderMyWorkTab(myActiveOrders) : ''}
          ${MakerView.currentTab === 'history' ? MakerView.renderHistoryTab(myHistoryOrders) : ''}
        </main>
      </div>
    `;
  },

  switchTab: (tab) => {
    MakerView.currentTab = tab;
    App.render();
  },

  // 1. Navbat (Dizayner tugatgan guruhlar)
  renderQueueTab: (orders) => {
    if (orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <div class="w-12 h-12 mx-auto mb-2 text-slate-300">${Icons.album('w-12 h-12')}</div>
          <p class="text-sm font-semibold">Albom yasash navbatida yangi buyurtma yoʻq</p>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        ${orders.map(order => `
          <div class="payno-card p-5 bg-white border border-slate-100">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-extrabold tracking-tight text-slate-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                ${order.id}
              </span>
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60 inline-flex items-center gap-1">
                ${Icons.layers('w-3 h-3 text-blue-600')}
                <span>Yigʻish navbatda</span>
              </span>
            </div>

            <h4 class="text-base font-bold text-slate-900 mb-1 leading-snug">${order.university}</h4>
            <p class="text-xs font-medium text-slate-500 mb-3">${order.faculty} &bull; <strong>${order.group}</strong></p>

            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs mb-3">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Yasalishi kerak boʻlgan albomlar:</span>
                <span class="font-extrabold text-slate-900 text-sm">${order.realStudentCount} dona</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Vinetka turi / Muqova:</span>
                <span class="font-semibold text-slate-800">${order.albumType}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Montaj qilgan dizayner:</span>
                <span class="font-semibold text-slate-700">${((store.users || []).find(u => u.id === order.editorId))?.name || order.editorName || 'Dizayner'}</span>
              </div>
            </div>

            <button 
              onclick="MakerView.claimOrder('${order.id}')" 
              class="w-full payno-pill-btn payno-btn-primary py-3.5 sm:py-3 text-[14px] sm:text-xs font-bold shadow-md flex items-center justify-center gap-1.5 min-h-[46px] sm:min-h-0"
            >
              ${Icons.layers('w-4 h-4')}
              <span>Buyurtmani olish va yigʻishni boshlash</span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  claimOrder: (orderId) => {
    const success = store.claimMakeOrder(orderId);
    if (success) {
      MakerView.currentTab = 'my_work';
      App.showToast("Buyurtma yigʻish uchun qabul qilindi!");
      App.render();
    }
  },

  // 2. Ishim (Yasovchi aktiv yig'ayotgan guruh)
  renderMyWorkTab: (orders) => {
    if (orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <p class="text-sm font-semibold">Hozirda yigʻilayotgan buyurtmangiz yoʻq</p>
          <button 
            onclick="MakerView.switchTab('queue')" 
            class="mt-3 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold inline-block"
          >
            Navbatdan buyurtma olish
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        ${orders.map(order => `
          <div class="payno-card p-5 bg-white border border-slate-200 shadow-md">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full">
                ${order.id}
              </span>
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60 inline-flex items-center gap-1">
                ${Icons.layers('w-3 h-3 text-blue-600')}
                <span>Yigʻilmoqda</span>
              </span>
            </div>

            <h4 class="text-base font-bold text-slate-900 mb-1 leading-snug">${order.university}</h4>
            <p class="text-xs font-medium text-slate-500 mb-3">${order.faculty} &bull; <strong>${order.group}</strong></p>

            <!-- Montaj linki va Dizayner kontaktlari -->
            <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-xs mb-4">
              <div class="flex items-center justify-between">
                <span class="text-slate-500 font-medium">Albomlar soni:</span>
                <span class="font-extrabold text-slate-900 text-sm">${order.realStudentCount} dona</span>
              </div>

              <!-- Pechat fayli havolasi -->
              <div class="pt-2 border-t border-slate-200/60">
                <span class="text-slate-500 block mb-1 font-medium">Tayyor pechat fayli (Dizayner topshirgan):</span>
                <a 
                  href="${order.editorPrintLink || '#'}" 
                  target="_blank" 
                  class="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <span class="flex items-center gap-1.5">
                    ${Icons.link('w-4 h-4 text-blue-600')}
                    <span>Pechat faylini ochish / yuklab olish</span>
                  </span>
                  ${Icons.arrowUpRight('w-4 h-4 text-blue-600')}
                </a>
              </div>

              <!-- Dizaynerning ismi va telefon raqami -->
              ${(() => {
                const editorUser = (store.users || []).find(u => u.id === order.editorId);
                const edName = editorUser?.name || order.editorName || 'Dizayner';
                const edPhone = editorUser?.phone || order.editorPhone || '';
                return `
                  <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span class="text-[11px] text-slate-400 block">Montaj qilgan dizayner:</span>
                      <span class="font-bold text-slate-800">${edName}</span>
                    </div>
                    ${edPhone ? `
                      <a 
                        href="tel:${edPhone}" 
                        class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                      >
                        ${Icons.phone('w-3.5 h-3.5')}
                        <span>${edPhone}</span>
                      </a>
                    ` : ''}
                  </div>
                `;
              })()}
            </div>

            <!-- Agar brak yoki qo'shimcha xarajat bo'lsa -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-700">Brak yoki material xarajati:</span>
                <button 
                  onclick="MakerView.openAddCostModal('${order.id}')" 
                  class="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  ${Icons.plus('w-3.5 h-3.5')}
                  <span>+ Xarajat kiritish</span>
                </button>
              </div>

              ${(!order.costs || order.costs.length === 0) ? `
                <div class="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-400 text-center">
                  Qoʻshimcha xarajatlar yoʻq
                </div>
              ` : `
                <div class="space-y-1.5">
                  ${order.costs.map(c => `
                    <div class="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs">
                      <span class="font-semibold text-slate-800">${c.title}</span>
                      <span class="font-extrabold text-rose-700">${Store.formatMoney(c.amount)}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Tugatdim tugmasi -->
            <button 
              onclick="MakerView.completeOrder('${order.id}')" 
              class="w-full payno-pill-btn payno-btn-success py-3.5 sm:py-3 text-[14px] sm:text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 min-h-[46px] sm:min-h-0"
            >
              ${Icons.checkCircle('w-4 h-4')}
              <span>Tayyor / Javonga topshirdim</span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  openAddCostModal: (orderId) => {
    const bodyHtml = `
      <form id="maker-cost-form" onsubmit="MakerView.handleAddCostSubmit(event, '${orderId}')" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Xarajat / Brak sababi</label>
          <input type="text" id="maker-cost-title" required placeholder="Masalan: Qayta pechat yoki laminatsiya braki" class="payno-input" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Summa (soʻm)</label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="maker-cost-amount" 
            required 
            placeholder="Masalan: 50 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Chek havolasi (ixtiyoriy)</label>
          <input type="url" id="maker-cost-proof" placeholder="https://t.me/cheklar/..." class="payno-input" />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-danger py-3.5 text-xs font-bold shadow-md">
            Xarajatni kiritish
          </button>
        </div>
      </form>
    `;

    App.openModal("Brak / Xarajat kiritish", bodyHtml);
  },

  handleAddCostSubmit: (e, orderId) => {
    e.preventDefault();
    const costData = {
      title: document.getElementById('maker-cost-title').value.trim(),
      amount: Store.parseMoney(document.getElementById('maker-cost-amount').value),
      proofLink: document.getElementById('maker-cost-proof').value.trim()
    };
    store.addMakerCost(orderId, costData);
    App.closeModal();
    App.showToast("Xarajat buxgalter tasdigʻiga joʻnatildi!");
    App.render();
  },

  completeOrder: (orderId) => {
    if (confirm("Albomlar toʻliq tayyor boʻlib javonga topshirildimi?")) {
      const success = store.completeMakeOrder(orderId);
      if (success) {
        MakerView.currentTab = 'history';
        App.showToast("Albomlar javonga qoʻyildi! Sotuvchi xabardor qilindi.");
        App.render();
      }
    }
  },

  // 3. Tarix Tab
  renderHistoryTab: (orders) => {
    const user = store.currentUser;

    if (!orders || orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <div class="w-12 h-12 mx-auto mb-2 text-slate-300">${Icons.album('w-12 h-12')}</div>
          <p class="text-sm font-semibold">Tarixda yasalgan guruhlar yoʻq</p>
          <p class="text-xs text-slate-400 mt-1">Yigʻib tayyorlangan va javonga qoʻyilgan buyurtmalar bu yerda saqlanadi</p>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        ${orders.map(order => {
          const students = order.realStudentCount || order.studentCount || 0;
          let rate = user?.payRate !== undefined ? user.payRate : 25000;
          if (user?.payModel === 'by_album_type') {
            const at = (store.albumTypes || []).find(t => t.name === order.albumType);
            if (at && at.makerRate) rate = at.makerRate;
          }
          const fee = students * rate;
          const finishDate = order.makerFinishedAt || order.readyAt || order.createdAt || 'Tayyorlangan';

          return `
            <div class="payno-card p-4 sm:p-5 bg-white border border-slate-200/80 rounded-3xl overflow-hidden flex flex-col gap-3 hover:border-slate-300 transition-all shadow-xs">
              <!-- Guruh va Status -->
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-extrabold tracking-tight text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">${order.id}</span>
                    <span class="text-slate-300 text-xs font-bold">&bull;</span>
                    <span class="text-xs font-bold text-slate-800 truncate">${order.group}</span>
                  </div>
                  <div class="text-[11px] font-medium text-slate-500 mt-1 truncate" title="${order.university}">${order.university}</div>
                </div>
                <div class="shrink-0">
                  ${Components.StatusBadge(order)}
                </div>
              </div>

              <!-- Buyurtma ma'lumotlari -->
              <div class="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-400 text-[11px] shrink-0">Yasalgan albomlar:</span>
                  <span class="font-bold text-slate-800 text-right text-xs">${students} dona</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-400 text-[11px] shrink-0">Vinetka turi:</span>
                  <span class="font-bold text-blue-700 text-right text-xs truncate max-w-[170px]" title="${order.albumType || 'Standart'}">${order.albumType || 'Standart'}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-400 text-[11px] shrink-0">Topshirilgan sana:</span>
                  <span class="font-medium text-slate-600 text-right text-xs truncate">${finishDate}</span>
                </div>
              </div>

              <!-- Haq -->
              <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                <div class="min-w-0">
                  <span class="text-slate-500 font-medium block">Hisoblangan haq:</span>
                  <span class="text-[10px] text-slate-400 font-normal">(${Store.formatMoney(rate)} / dona)</span>
                </div>
                <span class="font-extrabold text-emerald-600 text-sm shrink-0">+${Store.formatMoney(fee)}</span>
              </div>

              ${(order.damagedCount || 0) > 0 ? `
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-amber-700 bg-amber-50/60 p-2.5 rounded-xl">
                  <span class="text-[11px] font-medium shrink-0">Brak albomlar:</span>
                  <span class="font-bold text-right text-xs shrink-0">${order.damagedCount} dona (${Store.formatMoney(order.damagedCost || 0)})</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Moliya modali
  openFinanceModal: (seasonId = null) => {
    const user = store.currentUser;
    const targetSeasonId = store.normalizePeriodId(seasonId || store.getCurrentMonthKey());
    const finance = store.getMakerFinance(user.id, targetSeasonId);

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Oy va Yil boshqaruvi (Ixcham pill dropdown) -->
        <div class="flex items-center justify-between pb-2 border-b border-black/[0.05]">
          <span class="text-xs font-semibold text-[#86868B]">Oy va yil:</span>
          <div class="relative inline-block">
            <select 
              onchange="MakerView.openFinanceModal(this.value)" 
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
          <div class="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">Shu oyda ishlangan haq (${finance.periodLabel || 'Joriy oy'})</div>
          <div class="text-3xl font-extrabold text-slate-900">${Store.formatMoney(finance.periodEarned !== undefined ? finance.periodEarned : finance.totalEarned)}</div>
          ${finance.payModel === 'salary' && finance.isProrated ? `
            <div class="mt-1.5 inline-block px-3 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[11px] font-bold border border-amber-200">
              ${finance.startDay}-sanadan oy yakunigacha: ${finance.workedDays} kunlik hisob (30 kunga: ${Store.formatMoney(finance.payRate)})
            </div>
          ` : ''}
          <div class="mt-2 text-xs font-bold text-emerald-700">
            Hozir olishingiz mumkin (Available): ${Store.formatMoney(finance.availableToWithdraw)}
          </div>
        </div>

        ${finance.carryOverBalance !== 0 ? `
          <div class="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/70 flex items-center justify-between text-xs">
            <span class="text-slate-700 font-semibold">Oldingi oylardan qoldiq (Qoʻshib beriladigan):</span>
            <span class="font-extrabold ${finance.carryOverBalance > 0 ? 'text-[#d64138]' : 'text-rose-600'}">
              ${finance.carryOverBalance > 0 ? '+' : ''}${Store.formatMoney(finance.carryOverBalance)}
            </span>
          </div>
        ` : ''}

        ${finance.totalPaid > 0 ? `
          <div class="p-3 bg-slate-50 rounded-2xl border border-black/[0.04] flex items-center justify-between text-xs">
            <span class="text-[#86868B]">Shu oyda olingan toʻlov / avans:</span>
            <span class="font-bold text-rose-600">-${Store.formatMoney(finance.totalPaid)}</span>
          </div>
        ` : ''}

        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Yasalgan albomlar hisoboti</span>
            <span class="text-[11px] text-[#86868B] font-medium">${finance.breakdown.length} ta guruh</span>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
            ${finance.breakdown.length === 0 ? `
              <div class="text-center py-6 text-xs text-[#86868B] bg-[#F5F5F7] rounded-2xl">
                Ushbu oyda buyurtmalar topilmadi
              </div>
            ` : finance.breakdown.map(item => `
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div class="font-bold text-slate-800">${item.id} (${item.group})</div>
                  <div class="text-[11px] text-slate-500">${item.albums} dona &times; ${Store.formatMoney(item.rate)}</div>
                </div>
                <div class="font-extrabold text-slate-900">${Store.formatMoney(item.amount)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    App.openModal("Albom yasovchi hisoboti", bodyHtml);
  }
};

window.MakerView = MakerView;

