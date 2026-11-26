/* ====================================================================
   VINETKA CRM & ERP - EDITOR / DESIGNER VIEW (DIZAYNER PANELI)
   Mobile-First (Telegram Web App), Center on Desktop
   Apple HIG & Payno Fintech UI
   ==================================================================== */

const EditorView = {
  currentTab: 'queue', // 'queue' | 'my_work' | 'history'
  activeRegionFilter: 'all', // 'all' | 'Toshkent shahri' | 'Samarqand' ...

  setRegionFilter: (region) => {
    EditorView.activeRegionFilter = region;
    App.render();
  },

  render: () => {
    const user = store.currentUser || {};
    const finance = store.getEditorFinance(user.id || '');

    // Viloyat filtri bo'yicha saralash
    let allQueue = store.orders.filter(o => o.status === 'edit_queue');
    let allMyActive = store.orders.filter(o => o.status === 'edit_active' && o.editorId === user.id);
    let allMyHistory = store.orders.filter(o => o.editorId === user.id && o.status !== 'edit_active' && o.status !== 'edit_queue');

    if (EditorView.activeRegionFilter && EditorView.activeRegionFilter !== 'all') {
      allQueue = allQueue.filter(o => o.region === EditorView.activeRegionFilter);
      allMyActive = allMyActive.filter(o => o.region === EditorView.activeRegionFilter);
      allMyHistory = allMyHistory.filter(o => o.region === EditorView.activeRegionFilter);
    }

    const regions = store.getRegions ? store.getRegions() : ['Toshkent shahri', 'Samarqand', 'Buxoro', 'Fargʻona', 'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', 'Qoraqalpogʻiston'];

    return `
      <div class="min-h-screen bg-[#F4F7FB] pb-24">
        <!-- O'zgarmas Header -->
        ${Components.Header(user, "App.openProfileModal()", "App.logout()")}

        <main class="px-5 pt-4 max-w-md mx-auto">
          <!-- 1. Moliya Kartasi (Ishlagan pulim - talabalar soniga hisoblangan) -->
          <section class="mb-4">
            <div 
              onclick="EditorView.openFinanceModal()" 
              class="payno-finance-card-dark p-6 cursor-pointer active:scale-[0.98] transition-all"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[13px] font-semibold text-[#808080]">
                  ${finance.netBalance < 0 ? 'Gonorarim (Avans qarzi)' : 'Ishlagan gonorarim'}
                </span>
                <div class="w-10 h-10 rounded-full bg-[#d64138] text-white flex items-center justify-center shrink-0">
                  ${Icons.arrowUpRight('w-4 h-4')}
                </div>
              </div>

              <div class="mb-4">
                <div class="text-[32px] leading-tight font-extrabold ${finance.netBalance < 0 ? 'text-[#d64138]' : 'text-[#000000]'} tracking-tight">
                  ${Store.formatMoney(finance.netBalance)}
                </div>
              </div>

              <div class="bg-[#F9F9F9] rounded-[24px] p-4 flex items-center justify-between text-xs">
                <span class="text-[#808080] font-semibold">Jarayondagi kutilayotgan:</span>
                <span class="font-extrabold text-[#d64138] text-sm">${Store.formatMoney(finance.pendingEarned)}</span>
              </div>
            </div>
          </section>

          <!-- 2. Viloyatlar filtri (Buyurtmalar bo'limi tepasida) -->
          <div class="mb-4">
            <div class="text-[11px] font-bold text-[#808080] uppercase tracking-wider mb-2 px-1">
              Viloyat boʻyicha filter:
            </div>
            <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button 
                onclick="EditorView.setRegionFilter('all')" 
                class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${EditorView.activeRegionFilter === 'all' ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
              >
                Barchasi (Umumiy)
              </button>
              ${regions.map(reg => `
                <button 
                  onclick="EditorView.setRegionFilter('${reg}')" 
                  class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${EditorView.activeRegionFilter === reg ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
                >
                  ${reg}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 3. 3 ta Bo'lim Switcheri (Navbat | Ishim | Tarix) — Design Namuna Pill Tabs -->
          <div class="grid grid-cols-3 gap-2 mb-5 text-xs font-bold">
            <button 
              onclick="EditorView.switchTab('queue')" 
              class="py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[13px] min-h-[50px] font-extrabold ${EditorView.currentTab === 'queue' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              <span>Navbat</span>
              <span class="px-2 py-0.5 ${EditorView.currentTab === 'queue' ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#1C1C1E]'} rounded-full text-[11px] font-extrabold">${allQueue.length}</span>
            </button>
            <button 
              onclick="EditorView.switchTab('my_work')" 
              class="py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[13px] min-h-[50px] font-extrabold ${EditorView.currentTab === 'my_work' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              <span>Ishim</span>
              <span class="px-2 py-0.5 ${EditorView.currentTab === 'my_work' ? 'bg-[#d64138] text-white' : 'bg-[#d64138]/10 text-[#d64138]'} rounded-full text-[11px] font-extrabold">${allMyActive.length}</span>
            </button>
            <button 
              onclick="EditorView.switchTab('history')" 
              class="py-3.5 rounded-full transition-all text-[13px] min-h-[50px] font-extrabold flex items-center justify-center ${EditorView.currentTab === 'history' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              Tarix (${allMyHistory.length})
            </button>
          </div>

          <!-- Tab Content (Ixcham kartochkalar) -->
          ${EditorView.currentTab === 'queue' ? EditorView.renderQueueTab(allQueue) : ''}
          ${EditorView.currentTab === 'my_work' ? EditorView.renderMyWorkTab(allMyActive) : ''}
          ${EditorView.currentTab === 'history' ? EditorView.renderHistoryTab(allMyHistory) : ''}
        </main>
      </div>
    `;
  },

  switchTab: (tab) => {
    EditorView.currentTab = tab;
    App.render();
  },

  // 1. Navbat (Fotograf tugatgan guruhlar) - Kompakt kartochkalar
  renderQueueTab: (orders) => {
    if (orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <div class="w-12 h-12 mx-auto mb-2 text-slate-300">${Icons.edit('w-12 h-12')}</div>
          <p class="text-sm font-semibold">Dizaynerlar navbatida guruhlar yoʻq</p>
        </div>
      `;
    }

    return `
      <div class="space-y-2">
        ${orders.map(order => Components.OrderCard(order, `EditorView.openOrderDetail('${order.id}')`)).join('')}
      </div>
    `;
  },

  // 2. Ishim (Dizayner o'ziga olgan guruh) - Kompakt kartochkalar
  renderMyWorkTab: (orders) => {
    if (orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <p class="text-sm font-semibold">Hozirda montajdagi buyurtmangiz yoʻq</p>
          <button 
            onclick="EditorView.switchTab('queue')" 
            class="mt-3 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold inline-block"
          >
            Navbatdan ish olish
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-2">
        ${orders.map(order => Components.OrderCard(order, `EditorView.openOrderDetail('${order.id}')`)).join('')}
      </div>
    `;
  },

  // 3. Tarix Tab - Kompakt kartochkalar
  renderHistoryTab: (orders) => {
    if (!orders || orders.length === 0) {
      return `
        <div class="payno-card p-10 text-center text-slate-400">
          <div class="w-12 h-12 mx-auto mb-2 text-slate-300">${Icons.checkCircle('w-12 h-12')}</div>
          <p class="text-sm font-semibold">Tarixda montaj qilingan guruhlar yoʻq</p>
          <p class="text-xs text-slate-400 mt-1">Montaji tugatilgan guruhlar ushbu roʻyxatda saqlanadi</p>
        </div>
      `;
    }

    return `
      <div class="space-y-2">
        ${orders.map(order => Components.OrderCard(order, `EditorView.openOrderDetail('${order.id}')`)).join('')}
      </div>
    `;
  },

  // Buyurtma batafsil modali (Kompakt kartochka bosilganda ochiladi)
  openOrderDetail: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    const user = store.currentUser || {};
    const photoUser = (store.users || []).find(u => u.id === order.photographerId);
    const photoName = order.photographerName || (photoUser ? photoUser.name : 'Fotograf');
    const photoPhone = order.photographerPhone || (photoUser ? photoUser.phone : '');
    const isQueue = order.status === 'edit_queue';
    const isMyActive = order.status === 'edit_active' && order.editorId === user.id;
    const students = order.realStudentCount || order.studentCount || 0;
    const rate = user?.payRate !== undefined ? user.payRate : 15000;
    const fee = students * rate;

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

          <div class="grid grid-cols-2 gap-2 pt-1 border-t border-black/[0.04]">
            <div>
              <span class="text-[#86868B] block text-[10px] uppercase font-bold">Talabalar soni:</span>
              <span class="font-extrabold text-[#1D1D1F] text-xs">${students} ta talaba</span>
            </div>
            <div>
              <span class="text-[#86868B] block text-[10px] uppercase font-bold">Vinetka turi:</span>
              <span class="font-bold text-purple-700 text-xs">${order.albumType || 'Standart'}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-[#86868B]">Guruh sardori (Mijoz):</span>
            <span class="font-bold text-[#1D1D1F]">${order.leaderName}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-[#86868B]">Sardor telefoni:</span>
            <a href="tel:${order.leaderPhone}" class="font-bold text-[#d64138] flex items-center gap-1">
              ${Icons.phone('w-3.5 h-3.5')}
              <span>${order.leaderPhone}</span>
            </a>
          </div>

          <!-- Mas'ul Fotograf (Suratga olgan mutaxassis) -->
          <div class="mt-2 pt-2 border-t border-black/[0.05] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center font-bold text-xs text-purple-700 shrink-0">
                ${(photoName || 'F').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div class="text-[9px] uppercase font-bold text-[#86868B]">Masʼul Fotograf</div>
                <div class="text-xs font-bold text-[#1D1D1F]">${photoName}</div>
              </div>
            </div>
            ${photoPhone ? `
              <a href="tel:${photoPhone}" class="px-2.5 py-1 rounded-full bg-purple-600/10 text-purple-700 hover:bg-purple-600/20 text-[11px] font-bold flex items-center gap-1 transition-all">
                ${Icons.phone('w-3 h-3')}
                <span>${photoPhone}</span>
              </a>
            ` : ''}
          </div>

          ${order.photoDriveLink ? `
            <div class="pt-2 border-t border-black/[0.04] flex items-center justify-between">
              <span class="text-[#86868B]">Xom suratlar havolasi:</span>
              <a href="${order.photoDriveLink}" target="_blank" class="font-bold text-[#d64138] hover:underline flex items-center gap-1">
                ${Icons.link('w-3.5 h-3.5')}
                <span>Diskdan yuklab olish</span>
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Gonorar Info -->
        <div class="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
          <span class="text-purple-900 font-semibold">Ushbu guruh uchun gonorar:</span>
          <span class="font-extrabold text-purple-900 text-sm">+${Store.formatMoney(fee)}</span>
        </div>

        <!-- Agar Navbatda bo'lsa: "Qabul qilish / Boshlash" -->
        ${isQueue ? `
          <button 
            onclick="EditorView.claimOrder('${order.id}')" 
            class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            ${Icons.palette('w-4 h-4')}
            <span>Qabul qildim / Boshlash</span>
          </button>
        ` : ''}

        <!-- Agar Dizayner montaj qilayotgan bo'lsa: Yakunlash -->
        ${isMyActive ? `
          <button 
            onclick="EditorView.openCompleteModal('${order.id}')" 
            class="w-full payno-pill-btn payno-btn-success py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            ${Icons.checkCircle('w-4 h-4')}
            <span>Montajni tugatdim (Havolalar kiritish)</span>
          </button>
        ` : ''}

        <!-- Agar Yakunlangan / Tarixda bo'lsa: Proof va Print linklar -->
        ${(!isQueue && !isMyActive) ? `
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            ${order.proofLink ? `
              <div class="flex items-center justify-between">
                <span class="text-[#86868B]">Mijoz tasdiqlagan maket:</span>
                <a href="${order.proofLink}" target="_blank" class="font-bold text-[#d64138] hover:underline flex items-center gap-1">
                  <span>Maketni koʻrish</span>
                  ${Icons.arrowUpRight('w-3 h-3')}
                </a>
              </div>
            ` : ''}
            ${order.printLink ? `
              <div class="flex items-center justify-between pt-1 border-t border-black/[0.04]">
                <span class="text-[#86868B]">Pechatga tayyor fayl:</span>
                <a href="${order.printLink}" target="_blank" class="font-bold text-[#34C759] hover:underline flex items-center gap-1">
                  <span>Pechat faylini ochish</span>
                  ${Icons.arrowUpRight('w-3 h-3')}
                </a>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;

    App.openModal("Buyurtma tafsilotlari", bodyHtml);
  },

  claimOrder: (orderId) => {
    const success = store.claimEditOrder(orderId);
    if (success) {
      App.closeModal();
      EditorView.currentTab = 'my_work';
      App.showToast("Buyurtma montajga qabul qilindi!");
      App.render();
    }
  },

  // Montajni yakunlash modali (Proof link va Print link majburiy!)
  openCompleteModal: (orderId) => {
    const bodyHtml = `
      <form id="editor-complete-form" onsubmit="EditorView.handleCompleteSubmit(event, '${orderId}')" class="space-y-4">
        <div class="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900">
          <p class="font-bold">Eslatma:</p>
          <p class="mt-0.5">Ikkala havola ham kiritilishi majburiy. Havolalar toʻliq kiritilmaguncha ish albom yigʻuvchilarga oʻtmaydi.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            1) Mijoz tasdigʻi havolasi (Proof link) <span class="text-rose-500">*</span>
          </label>
          <input type="url" id="proof-link" required placeholder="https://t.me/vinetka_proof/..." class="payno-input" />
          <span class="text-[11px] text-slate-400 mt-1 block">Mijoz roziligi olingan skrinshot yoki Telegram posti.</span>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            2) Tayyor montaj fayli havolasi (Pechatga tayyor copy link) <span class="text-rose-500">*</span>
          </label>
          <input type="url" id="print-link" required placeholder="https://drive.google.com/drive/folders/..." class="payno-input" />
          <span class="text-[11px] text-slate-400 mt-1 block">Albom yasovchi ushbu faylni pechat qilib yigʻadi.</span>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-1.5">
            ${Icons.check('w-4 h-4')}
            <span>Tugatdim va Albomchilarga oʻtkazish</span>
          </button>
        </div>
      </form>
    `;

    App.openModal("Montajni yakunlash", bodyHtml);
  },

  handleCompleteSubmit: (e, orderId) => {
    e.preventDefault();
    const proofLink = document.getElementById('proof-link').value.trim();
    const printLink = document.getElementById('print-link').value.trim();

    if (!proofLink || !printLink) {
      alert("Ikkala havola ham majburiy!");
      return;
    }

    const success = store.completeEditOrder(orderId, proofLink, printLink);
    if (success) {
      App.closeModal();
      EditorView.currentTab = 'history';
      App.showToast("Guruh tayyorlandi va Albom yasovchilar navbatiga oʻtdi!");
      App.render();
    }
  },

  // Dizayner moliya modali (Sotuvchinikidek Apple HIG tuzilmasida)
  openFinanceModal: (seasonId = null) => {
    const user = store.currentUser;
    const targetSeasonId = store.normalizePeriodId(seasonId || store.getCurrentMonthKey());
    const finance = store.getEditorFinance(user.id, targetSeasonId);

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Oy va Yil boshqaruvi (Ixcham pill dropdown) -->
        <div class="flex items-center justify-between pb-2 border-b border-black/[0.05]">
          <span class="text-xs font-semibold text-[#86868B]">Oy va yil:</span>
          <div class="relative inline-block">
            <select 
              onchange="EditorView.openFinanceModal(this.value)" 
              class="text-xs font-semibold bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] rounded-full px-3 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              ${store.renderPeriodSelectOptions(targetSeasonId)}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86868B]">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <!-- Tepada 2 ta ko'rsatkich: "Jarayondagi pullar" va "Shu oyda ishlagan" -->
        <div class="grid grid-cols-2 gap-2.5">
          <!-- 1-blok: Jarayondagi pullar -->
          <div class="p-3.5 bg-[#F5F5F7] rounded-2xl border border-black/[0.04]">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-[#86868B] mb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#8E8E93]"></span>
              <span>Jarayondagi pullar</span>
            </div>
            <div class="text-base font-bold text-[#1D1D1F] tracking-tight">
              ${Store.formatMoney(finance.pendingEarned)}
            </div>
            <div class="text-[10px] text-[#86868B] mt-1 font-medium">Hozirda montajda</div>
          </div>

          <!-- 2-blok: Shu oyda ishlagan -->
          <div class="p-3.5 bg-[#d64138]/5 rounded-2xl border border-[#d64138]/20">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-[#d64138] mb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#d64138]"></span>
              <span>Shu oyda ishlagan</span>
            </div>
            <div class="text-base font-extrabold text-[#d64138] tracking-tight">
              ${Store.formatMoney(finance.periodEarned !== undefined ? finance.periodEarned : finance.confirmedEarned)}
            </div>
            <div class="text-[10px] text-[#d64138]/80 mt-1 font-medium">
              ${finance.payModel === 'salary' && finance.isProrated ? `${finance.startDay}-sanadan: ${finance.workedDays} kunlik` : (finance.periodLabel || 'Joriy oy')}
            </div>
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

        <div class="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
          <span class="font-extrabold text-emerald-950">Yakuniy olishga tayyor balans (Available):</span>
          <span class="text-base font-extrabold ${finance.availableToWithdraw < 0 ? 'text-rose-600' : 'text-emerald-700'}">
            ${Store.formatMoney(finance.availableToWithdraw)}
          </span>
        </div>

        <!-- Guruhlar bo'yicha hisobot -->
        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-xs font-bold text-[#86868B] uppercase tracking-wider">Guruhlar boʻyicha hisobot</span>
            <span class="text-[11px] text-[#86868B] font-medium">${finance.breakdown.length} ta guruh</span>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
            ${finance.breakdown.length === 0 ? `
              <div class="text-center py-8 text-xs text-[#86868B] bg-[#F5F5F7] rounded-2xl">
                Ushbu oyda buyurtmalar topilmadi
              </div>
            ` : finance.breakdown.map(item => `
              <div class="p-3 rounded-2xl ${item.isCompleted ? 'bg-[#d64138]/[0.04] border border-[#d64138]/20' : 'bg-[#F5F5F7] border border-black/[0.04]'} flex items-center justify-between transition-all">
                <div>
                  <div class="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                    <span>${item.id}</span>
                    <span class="font-normal text-[#86868B]">(${item.group})</span>
                  </div>
                  <div class="text-[11px] ${item.isCompleted ? 'text-[#d64138] font-semibold' : 'text-[#86868B] font-medium'} mt-0.5 flex items-center gap-1">
                    ${item.isCompleted ? Icons.checkCircle('w-3 h-3 text-[#d64138]') : Icons.clock('w-3 h-3 text-[#86868B]')}
                    <span>${item.isCompleted ? 'Montaji bitgan (Tasdiqlangan)' : 'Montaj jarayonida'}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-bold ${item.isCompleted ? 'text-[#d64138]' : 'text-[#86868B]'}">
                    ${item.isCompleted ? `+ ${Store.formatMoney(item.amount)}` : Store.formatMoney(item.amount)}
                  </div>
                  <div class="text-[10px] text-[#86868B]">${item.students} ta &bull; ${Store.formatMoney(item.rate)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    App.openModal("Dizayner hisoboti", bodyHtml);
  }
};

window.EditorView = EditorView;
