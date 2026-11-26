/* ====================================================================
   VINETKA CRM & ERP - SELLER VIEW (SOTUVCHI PANELI)
   Mobile-First (Telegram Web App), Center on Desktop
   ==================================================================== */

const SellerView = {
  currentTab: 'home', // 'home' | 'orders' | 'ledger'
  activeCardIndex: 0, // 0: Ishlagan pulim, 1: Buxgalterga beriladigan pul
  activeFilter: 'all', // 'all', 'photo_queue', 'edit_queue', 'make_active', 'ready'
  activeRegionFilter: 'all', // 'all' | 'Toshkent shahri' | 'Samarqand' ...
  activeFilterLedger: 'all', // 'all' | 'approved' | 'pending'
  cashSubModalTab: 'all', // 'all'

  setRegionFilter: (region) => {
    SellerView.activeRegionFilter = region;
    App.render();
  },

  render: () => {
    const user = store.currentUser || {};
    const finance = store.getSellerFinance(user.id || '');
    const myOrders = store.orders.filter(o => o.sellerId === user.id);

    return `
      <div class="min-h-screen bg-[#F4F7FB] pb-28">
        <!-- O'zgarmas Header -->
        ${Components.Header(user, "App.openProfileModal()", "App.logout()")}

        <!-- Tab Content -->
        <main class="px-5 pt-4 max-w-md mx-auto">
          ${SellerView.currentTab === 'home' ? SellerView.renderHomeTab(finance, myOrders) : ''}
          ${SellerView.currentTab === 'orders' ? SellerView.renderOrdersTab(myOrders) : ''}
          ${SellerView.currentTab === 'ledger' ? SellerView.renderLedgerTab(finance) : ''}
        </main>

        <!-- Bottom Navigation Bar -->
        <nav class="payno-bottom-bar">
          <div onclick="SellerView.switchTab('home')" class="payno-nav-item ${SellerView.currentTab === 'home' ? 'active' : ''}">
            ${Icons.home('w-5 h-5')}
            <span>Asosiy</span>
          </div>
          <div onclick="SellerView.switchTab('orders')" class="payno-nav-item ${SellerView.currentTab === 'orders' ? 'active' : ''}">
            ${Icons.orders('w-5 h-5')}
            <span>Buyurtmalar</span>
          </div>
          <div onclick="SellerView.switchTab('ledger')" class="payno-nav-item ${SellerView.currentTab === 'ledger' ? 'active' : ''}">
            ${Icons.wallet('w-5 h-5')}
            <span>Pul daftarim</span>
          </div>
        </nav>
      </div>
    `;
  },

  // 1. Asosiy Tab (Home) - Toza, ortiqcha filtersiz, oxirgi buyurtmalar
  renderHomeTab: (finance, myOrders) => {
    const displayedOrders = myOrders.slice(0, 6);

    return `
      <!-- 1. Moliya Kartalari -->
      <section class="mb-5">
        <!-- Switcher Buttons (Design Namuna Pill Tabs) -->
        <div class="grid grid-cols-2 gap-2.5 mb-3">
          <button 
            onclick="SellerView.switchCard(0)" 
            class="text-center px-4 py-3.5 rounded-full text-[13px] font-extrabold transition-all min-h-[48px] ${SellerView.activeCardIndex === 0 ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
          >
            Ishlagan pulim
          </button>
          <button 
            onclick="SellerView.switchCard(1)" 
            class="text-center px-4 py-3.5 rounded-full text-[13px] font-extrabold transition-all min-h-[48px] ${SellerView.activeCardIndex === 1 ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
          >
            Buxgalterga beriladigan
          </button>
        </div>

        <!-- 1-Karta: Ishlagan Pulim -->
        <div id="seller-card-0" class="${SellerView.activeCardIndex === 0 ? 'block' : 'hidden'}">
          <div 
            onclick="SellerView.openEarnedDetailsModal()" 
            class="payno-finance-card-green p-6 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-[13px] font-semibold text-[#808080]">
                ${finance.netBalance < 0 ? 'Ishlagan pulim (Avans / Qarz)' : 'Ishlagan komissiyam'}
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
              <span class="font-extrabold text-[#000000] text-sm">${Store.formatMoney(finance.pendingEarned)}</span>
            </div>
          </div>
        </div>

        <!-- 2-Karta: Buxgalterga Beriladigan Pul -->
        <div id="seller-card-1" class="${SellerView.activeCardIndex === 1 ? 'block' : 'hidden'}">
          <div 
            onclick="SellerView.openCashSubmissionModal()" 
            class="payno-finance-card-red p-6 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-[13px] font-semibold text-[#808080]">
                Buxgalterga beriladigan pul
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

            <div class="grid grid-cols-2 gap-2.5">
              <div class="bg-[#F9F9F9] rounded-[22px] p-3.5">
                <div class="text-[11px] font-bold text-[#808080] mb-1">Buxgalter tasdig'ida</div>
                <div class="text-sm font-extrabold text-[#000000]">${Store.formatMoney(finance.cashSubmittedPending)}</div>
              </div>
              <div class="bg-[#d64138]/[0.06] rounded-[22px] p-3.5 flex flex-col justify-between">
                <div class="text-[11px] font-bold text-[#d64138] mb-1">Qarzdor guruhlar</div>
                <div class="inline-flex items-center gap-1 text-xs font-extrabold text-[#d64138]">
                  <span>Pul topshirish</span>
                  ${Icons.chevronRight('w-3.5 h-3.5')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Action Buttons: "+ Yangi buyurtma" va "+ Umumiy xarajat" -->
      <div class="grid grid-cols-2 gap-2.5 mb-5">
        <button 
          onclick="SellerView.openNewOrderModal()" 
          class="payno-pill-btn bg-[#d64138] hover:bg-[#bd352d] text-white py-3.5 px-4 text-[13px] font-bold active:scale-[0.98] min-h-[52px] flex items-center justify-between gap-2"
        >
          <span class="truncate pl-1">Yangi buyurtma</span>
          <span class="w-7 h-7 rounded-full bg-white text-[#d64138] flex items-center justify-center shrink-0">
            ${Icons.plus('w-4 h-4')}
          </span>
        </button>

        <button 
          onclick="SellerView.openGeneralExpenseModal()" 
          class="payno-pill-btn bg-white hover:bg-[#F0F0F0] text-[#d64138] py-3.5 px-4 text-[13px] font-bold active:scale-[0.98] min-h-[52px] flex items-center justify-center gap-2"
          title="Guruhga tegishli boʻlmagan umumiy xarajat soʻrovi yuborish"
        >
          <span class="w-7 h-7 rounded-full bg-[#d64138]/10 text-[#d64138] flex items-center justify-center shrink-0">
            ${Icons.receipt('w-4 h-4')}
          </span>
          <span class="truncate">+ Umumiy xarajat</span>
        </button>
      </div>

      <!-- 3. Oxirgi Buyurtmalar (Asosiy sahifada ortiqcha filtersiz, oxirgi 6 ta Card) -->
      <section class="mb-6">
        <div class="flex items-center justify-between mb-3 px-1">
          <h3 class="text-sm font-extrabold text-[#000000]">Oxirgi buyurtmalar</h3>
          <span class="text-xs font-bold text-[#808080]">${displayedOrders.length} / ${myOrders.length}</span>
        </div>

        ${displayedOrders.length === 0 ? `
          <div class="payno-card p-8 text-center text-[#808080]">
            <div class="w-12 h-12 mx-auto mb-2 text-[#A9A9A9]">${Icons.box('w-12 h-12')}</div>
            <p class="text-sm font-medium">Hozircha buyurtmalar yoʻq</p>
          </div>
        ` : `
          <div>
            ${displayedOrders.map(order => Components.OrderCard(order, `SellerView.openOrderDetail('${order.id}')`)).join('')}
          </div>
        `}

        <!-- Aniq "Barchasini ko'rish" tugmasi -->
        <button 
          onclick="SellerView.switchTab('orders')" 
          class="w-full py-3.5 mt-1.5 rounded-full bg-white hover:bg-[#F0F0F0] text-[#1C1C1E] font-extrabold text-[13px] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] min-h-[48px]"
        >
          <span>Barcha buyurtmalarni koʻrish (${myOrders.length} ta)</span>
          ${Icons.chevronRight('w-3.5 h-3.5')}
        </button>
      </section>
    `;
  },

  // 2. Buyurtmalar Tab (To'liq Ro'yxat va Status Filterlar shu yerda)
  renderOrdersTab: (myOrders) => {
    // Filtr bo'yicha saralash
    let filteredOrders = myOrders;
    if (SellerView.activeRegionFilter && SellerView.activeRegionFilter !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.region === SellerView.activeRegionFilter);
    }
    if (SellerView.activeFilter !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.status === SellerView.activeFilter);
    }

    return `
      <section class="py-2">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-lg font-bold text-[#1D1D1F] tracking-tight">Barcha buyurtmalarim</h2>
            <p class="text-xs text-[#86868B]">Viloyat va holat boʻyicha saralash</p>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[#1D1D1F] text-xs font-semibold">
            ${filteredOrders.length} ta
          </span>
        </div>

        <!-- 1. Viloyatlar filtri (Jarayon statuslari filtri tepasida) -->
        <div class="mb-4">
          <div class="text-[11px] font-bold text-[#808080] uppercase tracking-wider mb-2 px-1">
            Viloyat boʻyicha filter:
          </div>
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              onclick="SellerView.setRegionFilter('all')" 
              class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${SellerView.activeRegionFilter === 'all' ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              Barchasi (Umumiy)
            </button>
            ${store.getRegions().map(reg => `
              <button 
                onclick="SellerView.setRegionFilter('${reg}')" 
                class="px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all min-h-[40px] flex items-center justify-center ${SellerView.activeRegionFilter === reg ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
              >
                ${reg}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 2. Status Filterlar (Design Namuna Capsule Filter Buttons) -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 mb-5">
          <button 
            onclick="SellerView.setFilter('all')" 
            class="px-4 py-2.5 rounded-full text-[13px] font-bold shrink-0 transition-all min-h-[44px] flex items-center justify-center ${SellerView.activeFilter === 'all' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#808080] hover:text-[#1C1C1E]'}"
          >
            Barchasi (${myOrders.length})
          </button>
          <button 
            onclick="SellerView.setFilter('photo_queue')" 
            class="px-4 py-2.5 rounded-full text-[13px] font-bold shrink-0 transition-all flex items-center gap-1.5 min-h-[44px] ${SellerView.activeFilter === 'photo_queue' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#808080]'}"
          >
            ${Icons.camera('w-4 h-4')}
            <span>Foto navbatda</span>
          </button>
          <button 
            onclick="SellerView.setFilter('edit_queue')" 
            class="px-4 py-2.5 rounded-full text-[13px] font-bold shrink-0 transition-all flex items-center gap-1.5 min-h-[44px] ${SellerView.activeFilter === 'edit_queue' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#808080]'}"
          >
            ${Icons.palette('w-4 h-4')}
            <span>Edit navbatda</span>
          </button>
          <button 
            onclick="SellerView.setFilter('make_active')" 
            class="px-4 py-2.5 rounded-full text-[13px] font-bold shrink-0 transition-all flex items-center gap-1.5 min-h-[44px] ${SellerView.activeFilter === 'make_active' ? 'bg-[#d64138] text-white' : 'bg-white text-[#808080]'}"
          >
            ${Icons.layers('w-4 h-4')}
            <span>Yigʻilmoqda</span>
          </button>
          <button 
            onclick="SellerView.setFilter('ready')" 
            class="px-4 py-2.5 rounded-full text-[13px] font-bold shrink-0 transition-all flex items-center gap-1.5 min-h-[44px] ${SellerView.activeFilter === 'ready' ? 'bg-[#d64138] text-white' : 'bg-white text-[#808080]'}"
          >
            ${Icons.checkCircle('w-4 h-4')}
            <span>Tayyor</span>
          </button>
          <button 
            onclick="SellerView.setFilter('delivered')" 
            class="px-4 py-2.5 rounded-full text-[13px] font-bold shrink-0 transition-all flex items-center gap-1.5 min-h-[44px] ${SellerView.activeFilter === 'delivered' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#808080]'}"
          >
            ${Icons.check('w-4 h-4')}
            <span>Topshirilgan</span>
          </button>
        </div>

        ${filteredOrders.length === 0 ? `
          <div class="payno-card p-10 text-center text-slate-400">
            <p class="text-sm font-semibold">Ushbu holatda buyurtmalar mavjud emas</p>
          </div>
        ` : `
          <div>
            ${filteredOrders.map(order => Components.OrderCard(order, `SellerView.openOrderDetail('${order.id}')`)).join('')}
          </div>
        `}
      </section>
    `;
  },

  // 3. Pul Daftari Tab (Shaxsiy moliya statistikasi va topshirilgan pullar arxivi)
  renderLedgerTab: (finance) => {
    const user = store.currentUser;
    const submissions = store.getSellerCashSubmissions ? store.getSellerCashSubmissions(user.id) : [];

    const approvedSubs = submissions.filter(s => s.status === 'approved');
    const pendingSubs = submissions.filter(s => s.status === 'pending');

    let displayList = submissions;
    if (SellerView.activeFilterLedger === 'approved') {
      displayList = approvedSubs;
    } else if (SellerView.activeFilterLedger === 'pending') {
      displayList = pendingSubs;
    }

    return `
      <section class="py-2">
        <!-- Header -->
        <div class="mb-5">
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Pul daftarim</h2>
          <p class="text-xs text-slate-400 mt-0.5">Shaxsiy daromad statistikasi va topshirilgan toʻlovlar isboti</p>
        </div>

        <!-- 1. SHAXSIY DAROMAD STATISTIKASI (Design Namuna Hero Card + 2 Sub-boxes) -->
        <div class="space-y-3 mb-6">
          <!-- Asosiy Daromad Kartasi (Clickable -> Guruhlar hisoboti modali) -->
          <div 
            onclick="SellerView.openEarnedDetailsModal()" 
            class="payno-card p-6 bg-white cursor-pointer active:scale-[0.98] transition-all"
            title="Guruhlar hisobotini koʻrish uchun bosing"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-[13px] font-semibold text-[#808080]">
                ${finance.netBalance < 0 ? 'Hozirgi balans (Ortiqcha avans)' : 'Aniq ishlangan komissiya'}
              </span>
              <span class="w-10 h-10 rounded-full bg-[#d64138] text-white flex items-center justify-center shrink-0">
                ${Icons.arrowUpRight('w-4 h-4')}
              </span>
            </div>

            <div class="text-[32px] leading-tight font-extrabold ${finance.netBalance < 0 ? 'text-[#d64138]' : 'text-[#000000]'} tracking-tight mb-4">
              ${Store.formatMoney(finance.netBalance)}
            </div>

            <!-- 2 ta Moliyaviy Ko'rsatkichlar Gridi (tushum.svg uslubida karta ichida #F9F9F9 subcards) -->
            <div class="grid grid-cols-2 gap-2.5">
              <!-- 1) Qo'lga olingan daromad -->
              <div class="bg-[#F9F9F9] rounded-[24px] p-4">
                <div class="text-[11px] font-bold text-[#d64138] mb-1">
                  Toʻlab berilgan
                </div>
                <div class="text-base font-extrabold text-[#000000]">
                  ${Store.formatMoney(finance.paidCommission)}
                </div>
                <div class="text-[10px] text-[#808080] mt-0.5">
                  Qoʻlga olingan
                </div>
              </div>

              <!-- 2) Olingan avanslar -->
              <div class="bg-[#F9F9F9] rounded-[24px] p-4">
                <div class="text-[11px] font-bold text-[#FF0000] mb-1">
                  Olingan avans
                </div>
                <div class="text-base font-extrabold text-[#000000]">
                  ${Store.formatMoney(finance.advanceTaken || 0)}
                </div>
                <div class="text-[10px] text-[#808080] mt-0.5">
                  Hisobdan ayirilgan
                </div>
              </div>
            </div>
          </div>

          <!-- Buxgalterga topshirilishi kerak bo'lgan summa (Qo'ldagi qarz / Cash in hand) -->
          ${finance.cashInHand > 0 ? `
            <div class="payno-card p-5 bg-white flex items-center justify-between gap-3">
              <div>
                <div class="text-[11px] font-bold text-[#d64138] flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-[#d64138]"></span>
                  <span>Buxgalterga beriladigan qarz</span>
                </div>
                <div class="text-2xl font-extrabold text-[#000000] mt-1 tracking-tight">
                  ${Store.formatMoney(finance.cashInHand)}
                </div>
                <div class="text-[10px] text-[#808080] font-medium mt-0.5">
                  Qoʻldagi topshirilmagan buyurtma tushumlari
                </div>
              </div>
              <button 
                onclick="SellerView.openCashSubmissionModal()" 
                class="payno-pill-btn px-4 py-3 bg-[#d64138] hover:bg-[#bd352d] text-white text-xs font-bold flex items-center gap-1.5 active:scale-[0.98] transition-all shrink-0"
              >
                ${Icons.arrowDownLeft('w-3.5 h-3.5')}
                <span>Topshirish</span>
              </button>
            </div>
          ` : ''}
        </div>

        <!-- 2. BUXGALTERGA TOPSHIRILGAN TO'LOVLAR ARXIVI (Audit / Isbot ro'yxati) -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-3 px-1">
            <div>
              <h3 class="text-sm font-extrabold text-[#000000] tracking-tight">Topshirilgan pullar arxivi</h3>
              <p class="text-[11px] text-[#808080] font-medium">Buxgalterga berilgan toʻlovlarning sof auditi</p>
            </div>
            <span class="text-xs font-bold text-[#808080]">${submissions.length} ta toʻlov</span>
          </div>

          <!-- Filter Pill Tabs (Design Namuna Capsule Buttons) -->
          <div class="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
            <button 
              onclick="SellerView.setLedgerFilter('all')" 
              class="px-4 py-2.5 rounded-full text-xs font-bold transition-all min-h-[40px] ${SellerView.activeFilterLedger === 'all' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E]'}"
            >
              Barchasi (${submissions.length})
            </button>
            <button 
              onclick="SellerView.setLedgerFilter('approved')" 
              class="px-4 py-2.5 rounded-full text-xs font-bold transition-all min-h-[40px] ${SellerView.activeFilterLedger === 'approved' ? 'bg-[#d64138] text-white' : 'bg-white text-[#1C1C1E]'}"
            >
              Tasdiqlangan (${approvedSubs.length})
            </button>
            <button 
              onclick="SellerView.setLedgerFilter('pending')" 
              class="px-4 py-2.5 rounded-full text-xs font-bold transition-all min-h-[40px] ${SellerView.activeFilterLedger === 'pending' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E]'}"
            >
              Kutilmoqda (${pendingSubs.length})
            </button>
          </div>

          <!-- Tranzaksiyalar Tarixi (Audit Log) -->
          <div class="space-y-2.5">
            ${displayList.length === 0 ? `
              <div class="payno-card p-8 text-center text-slate-400">
                <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2 text-slate-400">
                  ${Icons.receipt('w-6 h-6')}
                </div>
                <p class="text-xs font-bold text-slate-700">Hozircha yozuvlar yoʻq</p>
                <p class="text-[11px] text-slate-400 mt-0.5">Buxgalterga toʻlov topshirganingizda ushbu joyda toʻliq sana, vaqt va guruh auditi saqlanadi.</p>
              </div>
            ` : `
              ${displayList.map(item => `
                <div class="payno-card p-4 bg-white border border-slate-100 hover:border-slate-200 shadow-xs transition-all">
                  <!-- Yuqori qism: Guruh va Summa -->
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="flex items-start gap-2.5">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80' :
                        (item.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-200/80' : 'bg-amber-50 text-amber-600 border border-amber-200/80')
                      }">
                        ${item.status === 'approved' ? Icons.check('w-4 h-4') : (item.status === 'rejected' ? Icons.x('w-4 h-4') : Icons.clock('w-4 h-4'))}
                      </div>
                      <div>
                        <div class="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>${item.orderId}</span>
                          <span class="text-slate-300">&bull;</span>
                          <span>${item.group}</span>
                        </div>
                        <div class="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">${item.university}</div>
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-sm font-extrabold text-slate-900">${Store.formatMoney(item.amount)}</div>
                      <div class="mt-1">
                        ${item.status === 'approved' ? `
                          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold">
                            ${Icons.check('w-3 h-3 text-emerald-600')}
                            <span>Tasdiqlandi</span>
                          </span>
                        ` : (item.status === 'rejected' ? `
                          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-bold">
                            ${Icons.x('w-3 h-3 text-rose-600')}
                            <span>Rad etildi</span>
                          </span>
                        ` : `
                          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-bold">
                            ${Icons.clock('w-3 h-3 text-amber-600')}
                            <span>Kutilmoqda</span>
                          </span>
                        `)}
                      </div>
                    </div>
                  </div>

                  <!-- Pastki qism: Sana, vaqt va to'lov turi -->
                  <div class="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
                    <div class="flex items-center gap-1 text-slate-500">
                      ${Icons.calendar('w-3.5 h-3.5 text-slate-400')}
                      <span>${item.date}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">${item.percentage || 'Toʻlov'}</span>
                      <span class="text-slate-400 font-medium text-[10px] capitalize">${item.paymentMethod === 'cash' ? 'Naqd pul' : 'Karta'}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            `}
          </div>
        </div>
      </section>
    `;
  },

  setLedgerFilter: (filter) => {
    SellerView.activeFilterLedger = filter;
    App.render();
  },

  // State boshqaruvi
  switchTab: (tab) => {
    SellerView.currentTab = tab;
    App.render();
  },

  switchCard: (index) => {
    SellerView.activeCardIndex = index;
    const c0 = document.getElementById('seller-card-0');
    const c1 = document.getElementById('seller-card-1');
    if (c0 && c1) {
      if (index === 0) {
        c0.classList.remove('hidden');
        c1.classList.add('hidden');
      } else {
        c0.classList.add('hidden');
        c1.classList.remove('hidden');
      }
    }
    App.render();
  },

  setFilter: (status) => {
    SellerView.activeFilter = status;
    App.render();
  },

  // 1-Karta: Ishlagan Pulim Modali (Detal tahlil modali)
  openEarnedDetailsModal: (seasonId = null) => {
    const user = store.currentUser;
    const targetSeasonId = store.normalizePeriodId(seasonId || store.getCurrentMonthKey());
    const finance = store.getSellerFinance(user.id, targetSeasonId);

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Oy va Yil boshqaruvi (Ixcham pill dropdown) -->
        <div class="flex items-center justify-between pb-2 border-b border-black/[0.05]">
          <span class="text-xs font-semibold text-[#86868B]">Oy va yil:</span>
          <div class="relative inline-block">
            <select 
              onchange="SellerView.openEarnedDetailsModal(this.value)" 
              class="text-xs font-semibold bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] rounded-full px-3 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              ${store.renderPeriodSelectOptions(targetSeasonId)}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#86868B]">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <!-- Yuqori qism: 2 TA ALOHIDA BLOK -->
        <div class="grid grid-cols-2 gap-2.5">
          <!-- 1-blok: Jarayondagi pul -->
          <div class="p-3.5 bg-[#F5F5F7] rounded-2xl border border-black/[0.04]">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-[#86868B] mb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#8E8E93]"></span>
              <span>Jarayondagi pul</span>
            </div>
            <div class="text-base font-bold text-[#1D1D1F] tracking-tight">
              ${Store.formatMoney(finance.pendingEarned)}
            </div>
            <div class="text-[10px] text-[#86868B] mt-1 font-medium">Hali toʻliq yopilmagan</div>
          </div>

          <!-- 2-blok: Shu oyda aniq tushgan pul -->
          <div class="p-3.5 bg-[#d64138]/5 rounded-2xl border border-[#d64138]/20">
            <div class="flex items-center gap-1.5 text-[11px] font-semibold text-[#d64138] mb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#d64138]"></span>
              <span>Shu oyda ishlagan</span>
            </div>
            <div class="text-base font-extrabold text-[#d64138] tracking-tight">
              ${Store.formatMoney(finance.periodEarned !== undefined ? finance.periodEarned : finance.confirmedEarned)}
            </div>
            <div class="text-[10px] text-[#d64138]/80 mt-1 font-medium">${finance.periodLabel || 'Joriy oy'}</div>
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

        ${finance.totalPaidOut > 0 ? `
          <div class="p-3 bg-slate-50 rounded-2xl border border-black/[0.04] flex items-center justify-between text-xs">
            <span class="text-[#86868B]">Shu oyda olingan toʻlov / avans:</span>
            <span class="font-bold text-rose-600">-${Store.formatMoney(finance.totalPaidOut)}</span>
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
              <div class="p-3 rounded-2xl ${item.isConfirmed ? 'bg-[#d64138]/[0.04] border border-[#d64138]/20' : 'bg-[#F5F5F7] border border-black/[0.04]'} flex items-center justify-between transition-all">
                <div>
                  <div class="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                    <span>${item.id}</span>
                    <span class="font-normal text-[#86868B]">(${item.group})</span>
                  </div>
                  <div class="text-[11px] ${item.isConfirmed ? 'text-[#d64138] font-semibold' : 'text-[#86868B] font-medium'} mt-0.5 flex items-center gap-1">
                    ${item.isConfirmed ? Icons.checkCircle('w-3 h-3 text-[#d64138]') : Icons.clock('w-3 h-3 text-[#86868B]')}
                    <span>${item.statusText}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-bold ${item.isConfirmed ? 'text-[#d64138]' : 'text-[#86868B]'}">
                    ${item.isConfirmed ? `+ ${Store.formatMoney(item.commission)}` : Store.formatMoney(item.commission)}
                  </div>
                  <div class="text-[10px] text-[#86868B]">Buyurtma: ${Store.formatMoney(item.total)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    App.openModal("Ishlagan komissiyalarim", bodyHtml);
  },

  switchCashSubModalTab: (tab) => {
    SellerView.cashSubModalTab = tab;
    SellerView.openCashSubmissionModal();
  },

  // 2-Karta: Buxgalterga Beriladigan Pul Modali (Guruhlar bo'yicha to'lov topshirish)
  openCashSubmissionModal: () => {
    const user = store.currentUser;
    const finance = store.getSellerFinance(user.id);
    
    // Guruhlarning ro'yxatda saqlanish qoidasi:
    // To qoldiq summa (collectedAmount - sellerSubmittedAmount - photographerSubmittedAmount) 0 bo'lmaguncha ro'yxatda turadi.
    const activeCashOrders = store.orders.filter(o => {
      if (o.sellerId !== user.id) return false;
      const photoSub = o.photographerSubmittedAmount || 0;
      const sellerSub = o.sellerSubmittedAmount || 0;
      const remainingDebt = Math.max(0, (o.collectedAmount || 0) - sellerSub - photoSub);
      return remainingDebt > 0;
    });

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Yuqori qism: Jami topshirilishi kerak pul -->
        <div class="text-center py-3.5 px-4 bg-[#F5F5F7] rounded-2xl border border-black/[0.04]">
          <div class="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
            Qoʻldagi topshirilishi kerak boʻlgan naqd pul
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
              Topshiriladigan qarzdor guruhlar yoʻq
            </p>
            <p class="text-[11px] text-[#86868B] mt-0.5">
              Barcha faol guruhlar boʻyicha toʻlovlar topshirilgan yoki mijozdan qarz yoʻq.
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
              const totalCollected = order.collectedAmount || 0;
              const sellerSubmitted = order.sellerSubmittedAmount || 0;
              const photoSubmitted = order.photographerSubmittedAmount || 0;
              const totalSubmitted = sellerSubmitted + photoSubmitted;
              const pending = order.sellerSubmittedPending || 0;
              const remainingDebt = Math.max(0, totalCollected - totalSubmitted);
              const percentPaid = totalCollected > 0 ? Math.round((totalSubmitted / totalCollected) * 100) : 0;
              const isPending = pending > 0;

              return `
                <div class="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-xs space-y-3">
                  <!-- Header: ID va Status -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-xs font-bold text-[#1D1D1F]">${order.id} &bull; ${order.group}</div>
                      <div class="text-[11px] text-[#86868B] font-medium">${order.university} (${order.region || 'Toshkent'})</div>
                    </div>
                    <div>
                      ${totalSubmitted > 0 ? `
                        <span class="px-2.5 py-0.5 rounded-full bg-[#d64138]/10 text-[#bd352d] border border-[#d64138]/20 text-[10px] font-semibold">
                          ${percentPaid}% berilgan (Qoldiq: ${Store.formatMoney(remainingDebt)})
                        </span>
                      ` : `
                        <span class="px-2.5 py-0.5 rounded-full bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20 text-[10px] font-semibold">
                          Qarz: ${Store.formatMoney(remainingDebt)}
                        </span>
                      `}
                    </div>
                  </div>

                  <!-- Qoldiq summa va hisob-kitob bloki -->
                  <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.02] text-center">
                    <div>
                      <div class="text-[9px] font-semibold uppercase text-[#86868B]">Jami tushum</div>
                      <div class="text-[11px] font-bold text-[#1D1D1F] mt-0.5">${Store.formatMoney(totalCollected)}</div>
                    </div>
                    <div>
                      <div class="text-[9px] font-semibold uppercase text-[#86868B]">Topshirilgan</div>
                      <div class="text-[11px] font-bold text-[#34C759] mt-0.5">${Store.formatMoney(totalSubmitted)}</div>
                      ${photoSubmitted > 0 ? `<div class="text-[8px] text-[#86868B]">(Fotograf: ${Store.formatMoney(photoSubmitted)})</div>` : ''}
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
                        <span>Buxgalter tasdigʻi kutilmoqda:</span>
                      </span>
                      <span class="font-bold">${Store.formatMoney(pending)}</span>
                    </div>
                  ` : ''}

                  <!-- Action: To'lov oynasiga o'tish -->
                  ${isPending ? `
                    <button 
                      disabled 
                      class="w-full payno-pill-btn bg-black/[0.04] text-[#86868B] py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed border border-black/[0.05]"
                      title="Ushbu guruh boʻyicha avval yuborilgan toʻlov tasdiqlanishi kutilmoqda"
                    >
                      ${Icons.clock('w-3.5 h-3.5 text-[#FF9500]')}
                      <span>Tasdiq kutilmoqda (Qayta yuborib boʻlmaydi)</span>
                    </button>
                  ` : `
                    <button 
                      onclick="SellerView.openPayGroupModal('${order.id}')" 
                      class="w-full payno-pill-btn payno-btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all"
                    >
                      ${Icons.arrowDownLeft('w-3.5 h-3.5')}
                      <span>Toʻlov topshirish</span>
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

  // Guruh bo'yicha to'lov kiritish modal (Ixtiyoriy qo'lda kiritiladigan summa)
  openPayGroupModal: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    if ((order.sellerSubmittedPending || 0) > 0) {
      App.showToast("Ushbu guruh boʻyicha avval yuborilgan toʻlov tasdiqlanishi kutilmoqda!", "warning");
      return;
    }

    const totalCollected = order.collectedAmount || 0;
    const sellerSubmitted = order.sellerSubmittedAmount || 0;
    const photoSubmitted = order.photographerSubmittedAmount || 0;
    const totalSubmitted = sellerSubmitted + photoSubmitted;
    const remainingDebt = Math.max(0, totalCollected - totalSubmitted);

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Guruh Qisqacha Info -->
        <div class="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-[#1D1D1F]">${order.id} &bull; ${order.group}</span>
            <span class="text-[11px] font-semibold text-[#86868B]">${order.university}</span>
          </div>

          <!-- Moliyaviy 3-blok ko'rinishi -->
          <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-black/[0.04] text-center">
            <div class="p-2 rounded-xl bg-white border border-black/[0.03]">
              <div class="text-[9px] font-semibold uppercase text-[#86868B]">Jami tushum</div>
              <div class="text-xs font-bold text-[#1D1D1F] mt-0.5">${Store.formatMoney(totalCollected)}</div>
            </div>
            <div class="p-2 rounded-xl bg-white border border-black/[0.03]">
              <div class="text-[9px] font-semibold uppercase text-[#86868B]">Topshirilgan</div>
              <div class="text-xs font-bold text-[#34C759] mt-0.5">${Store.formatMoney(totalSubmitted)}</div>
              ${photoSubmitted > 0 ? `<div class="text-[8px] text-[#86868B]">(Foto: ${Store.formatMoney(photoSubmitted)})</div>` : ''}
            </div>
            <div class="p-2 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20">
              <div class="text-[9px] font-semibold uppercase text-[#FF3B30]">Qolgan qarz</div>
              <div class="text-xs font-bold text-[#FF3B30] mt-0.5">${Store.formatMoney(remainingDebt)}</div>
            </div>
          </div>
        </div>

        <!-- To'lov kiritish (Qo'lda ixtiyoriy summa) -->
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
              id="cash-submit-custom-input" 
              value="${Store.formatNumber(remainingDebt)}"
              placeholder="Masalan: 350 000"
              oninput="App.formatMoneyInput(this); SellerView.onCustomAmountInput('${order.id}', ${remainingDebt})"
              class="payno-input pl-14 pr-16 text-sm font-bold text-[#1D1D1F]"
            />
            <span class="absolute right-4 text-xs font-semibold text-[#86868B]">soʻm</span>
          </div>
          
          <div id="cash-submit-hint" class="text-[11px] text-[#86868B] mt-1.5 pl-1 font-medium">
            Ushbu toʻlovdan soʻng qoladigan qarz: <strong class="text-[#34C759]">0 soʻm</strong>
          </div>
        </div>

        <div class="text-[11px] text-[#86868B] bg-[#F5F5F7] p-3 rounded-xl border border-black/[0.03] flex items-start gap-2">
          ${Icons.info('w-4 h-4 text-[#86868B] shrink-0 mt-0.5')}
          <div>
            <strong class="text-[#1D1D1F]">Eslatma:</strong> Siz kiritgan summa buxgalter tasdiqlashi bilanoq umumiy qarzingizdan chegiriladi va tranzaksiya tarixiga yoziladi.
          </div>
        </div>

        <!-- Tasdiqlash Tugmalari -->
        <div class="space-y-2 pt-1">
          <button 
            type="button" 
            onclick="SellerView.confirmCashSubmit('${order.id}')" 
            class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            ${Icons.check('w-4 h-4')}
            <span>Buxgalterga toʻlovni topshirish</span>
          </button>
          
          <button 
            type="button" 
            onclick="SellerView.openCashSubmissionModal()" 
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
    const input = document.getElementById('cash-submit-custom-input');
    const val = Store.parseMoney(input ? input.value : 0);
    SellerView.updateCashHint(remainingDebt, val);
  },

  updateCashHint: (remainingDebt, amount) => {
    const hint = document.getElementById('cash-submit-hint');
    if (!hint) return;
    const num = Store.parseMoney(amount) || 0;
    if (num > remainingDebt) {
      hint.innerHTML = `<span class="text-rose-600 font-bold">Ogohlantirish: Kiritilgan summa qoldiq qarzdan (${Store.formatMoney(remainingDebt)}) oshib ketdi!</span>`;
    } else {
      const remAfter = Math.max(0, remainingDebt - num);
      hint.innerHTML = `Ushbu toʻlovdan soʻng qoladigan qarz: <strong class="${remAfter === 0 ? 'text-[#34C759]' : 'text-rose-600'}">${Store.formatMoney(remAfter)}</strong>`;
    }
  },

  confirmCashSubmit: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    if ((order.sellerSubmittedPending || 0) > 0) {
      alert("Ushbu guruh boʻyicha soʻrov buxgalter tasdigʻida kutilmoqda. Qayta yuborib boʻlmaydi!");
      return;
    }

    const input = document.getElementById('cash-submit-custom-input');
    const amount = Store.parseMoney(input ? input.value : 0);

    const sellerSub = order.sellerSubmittedAmount || 0;
    const photoSub = order.photographerSubmittedAmount || 0;
    const remainingDebt = Math.max(0, (order.collectedAmount || 0) - sellerSub - photoSub);

    if (!amount || amount <= 0) {
      alert("Iltimos, toʻgʻri summa kiriting (0 dan katta boʻlishi kerak)!");
      return;
    }
    if (amount > remainingDebt) {
      alert(`Kiritilgan summa qoldiq qarzdan (${Store.formatMoney(remainingDebt)}) koʻp boʻlishi mumkin emas!`);
      return;
    }

    const res = store.submitCashToAccountant(orderId, 'Toʻlov topshirish', amount);
    if (res && res.success) {
      App.showToast(`Buxgalterga ${Store.formatMoney(amount)} toʻlov soʻrovi yuborildi!`);
      SellerView.openCashSubmissionModal();
      App.render();
    } else {
      alert(res ? res.message : "Xatolik yuz berdi!");
    }
  },

  // 3. Umumiy xarajat qo'shish modali (Guruhga bog'liq bo'lmagan xarajat)
  openGeneralExpenseModal: () => {
    const user = store.currentUser || {};

    const bodyHtml = `
      <form id="seller-general-expense-form" onsubmit="SellerView.handleGeneralExpenseSubmit(event)" class="space-y-4">
        <!-- 1. Xarajat nomi / Maqsadi -->
        <div>
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1">
            1. Xarajat maqsadi / Nomi (Nimaga sarflangani) <span class="text-rose-500">*</span>
          </label>
          <textarea 
            name="title" 
            required 
            rows="2"
            placeholder="Masalan: Viloyatga borish transport va yoʻl xarajati (izoh bilan)..." 
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

  // Yangi Buyurtma Qo'shish Modali
  openNewOrderModal: () => {
    const defaultTypes = store.albumTypes || [];
    const defaultPrice = defaultTypes.length > 0 ? defaultTypes[0].basePrice : 220000;

    const bodyHtml = `
      <form id="new-order-form" onsubmit="SellerView.handleNewOrderSubmit(event)" class="space-y-3.5">
        <!-- Viloyat (Hudud) tanlash -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            ${Icons.mapPin('w-3.5 h-3.5 text-blue-600')}
            <span>Viloyat (Hudud) tanlang <span class="text-rose-500">*</span></span>
          </label>
          <select id="order-region" required class="payno-input bg-slate-50 cursor-pointer font-bold text-slate-900">
            ${(store.getRegions()).map(r => `<option value="${r}">${r}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Universitet / Muassasa nomi</label>
          <input type="text" id="order-univ" required placeholder="Masalan: TDIU yoki SamDU" class="payno-input" />
        </div>

        <!-- Google Maps Lokatsiyasi -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span class="flex items-center gap-1">
              ${Icons.mapPin('w-3.5 h-3.5 text-emerald-600')}
              <span>Google Maps lokatsiyasi (Havola)</span>
            </span>
            <span class="text-[10px] text-slate-400 font-normal">Fotograf xaritada ochishi uchun</span>
          </label>
          <input type="url" id="order-map-link" placeholder="https://maps.google.com/?q=... yoki manzil" class="payno-input text-xs" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Fakultet</label>
            <input type="text" id="order-faculty" required placeholder="Moliya" class="payno-input" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Guruh raqami</label>
            <input type="text" id="order-group" required placeholder="MK-402" class="payno-input" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Guruh sardori ismi</label>
            <input type="text" id="order-leader-name" required placeholder="Nodirbek" class="payno-input" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Sardor telefoni</label>
            <input type="tel" id="order-leader-phone" required placeholder="+998 90 123 45 67" class="payno-input" />
          </div>
        </div>

        <!-- Rasmga tushish sanasi (Fotosessiya kuni) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            ${Icons.calendar('w-3.5 h-3.5 text-[#d64138]')}
            <span>Rasmga tushish sanasi (Fotosessiya kuni) <span class="text-rose-500">*</span></span>
          </label>
          <input type="date" id="order-photo-date" required class="payno-input font-bold text-slate-900 bg-slate-50 cursor-pointer" />
        </div>

        <!-- Dinamik Vinetka turlari katalogi -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Vinetka turi (Katalog)</label>
          <select id="order-type" onchange="SellerView.handleAlbumTypeChange(this.value)" class="payno-input bg-slate-50 cursor-pointer font-bold text-slate-800">
            ${defaultTypes.map(t => `<option value="${t.name}">${t.name} — ${Store.formatMoney(t.basePrice)}</option>`).join('')}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Dona narxi (soʻm)</label>
            <input 
              type="text" 
              inputmode="numeric" 
              id="order-price" 
              required 
              value="${Store.formatNumber(defaultPrice)}" 
              placeholder="Masalan: 250 000" 
              oninput="App.formatMoneyInput(this)" 
              class="payno-input font-bold" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Talabalar soni</label>
            <input type="number" id="order-students" required placeholder="28" min="5" max="150" class="payno-input" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Izoh (ixtiyoriy)</label>
          <textarea id="order-notes" rows="2" placeholder="Fotosessiya vaqti va maxsus talablar..." class="payno-input rounded-2xl resize-none"></textarea>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-sm font-bold shadow-md">
            Buyurtmani yaratish
          </button>
        </div>
      </form>
    `;

    App.openModal("Yangi buyurtma qoʻshish", bodyHtml);
  },

  handleAlbumTypeChange: (typeName) => {
    const selected = (store.albumTypes || []).find(t => t.name === typeName);
    if (selected) {
      const priceInput = document.getElementById('order-price');
      if (priceInput) priceInput.value = Store.formatNumber(selected.basePrice);
    }
  },

  handleNewOrderSubmit: (e) => {
    e.preventDefault();
    const data = {
      region: document.getElementById('order-region').value,
      mapLink: document.getElementById('order-map-link').value.trim(),
      university: document.getElementById('order-univ').value.trim(),
      faculty: document.getElementById('order-faculty').value.trim(),
      group: document.getElementById('order-group').value.trim(),
      leaderName: document.getElementById('order-leader-name').value.trim(),
      leaderPhone: document.getElementById('order-leader-phone').value.trim(),
      photoDate: document.getElementById('order-photo-date').value || null,
      albumType: document.getElementById('order-type').value,
      pricePerStudent: Store.parseMoney(document.getElementById('order-price').value),
      studentCount: Number(document.getElementById('order-students').value),
      notes: document.getElementById('order-notes').value.trim()
    };

    const newOrder = store.createOrder(data);
    App.closeModal();
    App.showToast(`Buyurtma ${newOrder.id} (${newOrder.region}) yaratildi!`);
    App.render();
  },

  // Buyurtma tafsilotlari modali
  openOrderDetail: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    const studentNum = order.realStudentCount || order.studentCount;
    const totalOrderSum = studentNum * order.pricePerStudent;

    const bodyHtml = `
      <div class="space-y-4">
        <!-- ID va Status -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div class="text-xs font-bold text-slate-400">Buyurtma ID</div>
            <div class="text-base font-extrabold text-slate-900">${order.id}</div>
          </div>
          <div>
            ${Components.StatusBadge(order)}
          </div>
        </div>

        <!-- Asosiy parametrlar -->
        <div class="space-y-2 text-xs">
          <div class="p-3 bg-slate-50 rounded-2xl">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-slate-400 font-semibold">Hudud:</span>
              <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-xs flex items-center gap-1">
                ${Icons.mapPin('w-3 h-3 text-blue-600')}
                <span>${order.region || 'Toshkent shahri'}</span>
              </span>
            </div>
            <span class="text-slate-900 font-bold text-sm block mt-0.5">${order.university}</span>
            <span class="text-slate-600 font-medium">${order.faculty} &bull; <strong>${order.group}</strong></span>

            <div class="mt-2 pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-[#86868B] font-medium">
              <div class="flex items-center justify-between">
                <span>Buyurtma olingan sana:</span>
                <span class="text-[#1D1D1F] font-normal">${order.createdAt || 'Koʻrsatilmagan'}</span>
              </div>
              ${order.photoDate ? `
                <div class="flex items-center justify-between">
                  <span>Fotosessiya sanasi:</span>
                  <span class="text-[#1D1D1F] font-normal">${order.photoDate}</span>
                </div>
              ` : ''}
            </div>

            ${order.mapLink ? `
              <div class="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span class="text-slate-500 font-medium text-xs">Xarita:</span>
                <a href="${order.mapLink}" target="_blank" class="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs flex items-center gap-1.5 transition-colors">
                  ${Icons.mapPin('w-3.5 h-3.5 text-blue-600')}
                  <span>Xaritada ochish (Google Maps)</span>
                  ${Icons.arrowUpRight('w-3 h-3')}
                </a>
              </div>
            ` : ''}
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="p-3 bg-slate-50 rounded-2xl">
              <span class="text-slate-400 font-semibold block">Sardor:</span>
              <span class="text-slate-900 font-bold block mt-0.5">${order.leaderName}</span>
              <a href="tel:${order.leaderPhone}" class="text-blue-600 font-semibold block mt-0.5">${order.leaderPhone}</a>
            </div>
            <div class="p-3 bg-slate-50 rounded-2xl">
              <span class="text-slate-400 font-semibold block">Vinetka va Narx:</span>
              <span class="text-slate-900 font-bold block mt-0.5">${order.albumType}</span>
              <span class="text-slate-700 font-semibold">${Store.formatMoney(order.pricePerStudent)} / dona</span>
            </div>
          </div>

          <div class="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div>
              <span class="text-emerald-800 text-[11px] font-bold block">Jami summa (${studentNum} dona):</span>
              <span class="text-slate-900 font-extrabold text-base block mt-0.5">${Store.formatMoney(totalOrderSum)}</span>
            </div>
            <div class="text-right">
              <span class="text-emerald-800 text-[11px] font-bold block">Sizning komissiyangiz:</span>
              <span class="text-emerald-700 font-extrabold text-base block mt-0.5">${Store.formatMoney(Math.round(totalOrderSum * 0.1))}</span>
            </div>
          </div>

          ${order.notes ? `
            <div class="p-3 bg-slate-50 rounded-2xl">
              <span class="text-slate-400 font-semibold block">Sotuvchi izohi:</span>
              <span class="text-slate-700 font-medium block mt-0.5">${order.notes}</span>
            </div>
          ` : ''}
        </div>

        <!-- Albom TAYYOR bo'lganda Sotuvchi harakati: [Albomni oldim] -->
        ${order.status === 'ready' ? `
          <div class="pt-2">
            <button 
              onclick="SellerView.openTakeAlbumModal('${order.id}')" 
              class="w-full payno-pill-btn payno-btn-success py-3.5 text-sm font-bold shadow-lg"
            >
              <span>${Icons.box('w-4 h-4')}</span>
              <span>Albomni javondan oldim & Mijozga topshirish</span>
            </button>
          </div>
        ` : ''}

        <!-- Qoldiq qarz bo'lsa pul topshirish tugmasi -->
        ${(order.collectedAmount > (order.sellerSubmittedAmount || 0)) ? `
          <div class="pt-2">
            <button 
              onclick="SellerView.openPayGroupModal('${order.id}')" 
              class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>${Icons.arrowDownLeft('w-3.5 h-3.5')}</span>
              <span>Ushbu guruh pulini buxgalterga topshirish</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    App.openModal("Buyurtma tafsilotlari", bodyHtml);
  },

  // Albomni javondan olish va Mijozga topshirish modali
  openTakeAlbumModal: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;
    const studentNum = order.realStudentCount || order.studentCount;
    const totalOrderSum = studentNum * order.pricePerStudent;
    const photoPaid = order.photographerCollectedAmount || 0;
    const remainingToCollect = photoPaid > 0 ? Math.max(0, totalOrderSum - photoPaid) : totalOrderSum;

    const bodyHtml = `
      <div class="space-y-4">
        <div class="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs space-y-1.5">
          <p class="font-bold text-emerald-900">Albom javonda tayyor!</p>
          <p class="text-emerald-700">Siz albomni olib talabalarga topshirasiz va pulni qabul qilasiz.</p>
          ${photoPaid > 0 ? `
            <div class="pt-2 mt-1 border-t border-emerald-200/60 flex items-center justify-between text-[11px]">
              <span class="text-emerald-800 font-medium">Jami shartnoma summasi:</span>
              <span class="font-bold text-slate-800">${Store.formatMoney(totalOrderSum)}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-emerald-800 font-medium">Fotograf fotosessiyada olgan:</span>
              <span class="font-bold text-amber-800">${Store.formatMoney(photoPaid)}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-200/40">
              <span class="text-emerald-900 font-bold">Mijozdan olinadigan qoldiq summa:</span>
              <span class="font-black text-rose-600 text-xs">${Store.formatMoney(remainingToCollect)}</span>
            </div>
          ` : ''}
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Mijozdan olingan summa (soʻm)</label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="collected-amount" 
            value="${Store.formatNumber(remainingToCollect)}" 
            placeholder="Masalan: 2 500 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold text-slate-900" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Toʻlov turi</label>
          <div class="grid grid-cols-2 gap-2">
            <label class="p-3 rounded-2xl border border-slate-200 flex items-center gap-2 cursor-pointer has-checked:border-slate-800 has-checked:bg-slate-50">
              <input type="radio" name="payment-method" value="cash" checked class="accent-slate-900" />
              <span class="text-xs font-bold text-slate-800">Naqd pul</span>
            </label>
            <label class="p-3 rounded-2xl border border-slate-200 flex items-center gap-2 cursor-pointer has-checked:border-slate-800 has-checked:bg-slate-50">
              <input type="radio" name="payment-method" value="card" class="accent-slate-900" />
              <span class="text-xs font-bold text-slate-800">Karta oʻtkazma</span>
            </label>
          </div>
        </div>

        <div class="pt-2">
          <button 
            onclick="SellerView.handleDeliverConfirm('${order.id}')" 
            class="w-full payno-pill-btn payno-btn-primary py-3.5 text-sm font-bold shadow-md"
          >
            Topshirdim va pulni qabul qildim
          </button>
        </div>
      </div>
    `;

    App.openModal("Albomni topshirish", bodyHtml);
  },

  handleDeliverConfirm: (orderId) => {
    const amount = Store.parseMoney(document.getElementById('collected-amount').value);
    const paymentMethodEl = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'cash';

    const success = store.deliverOrder(orderId, amount, paymentMethod);
    if (success) {
      App.closeModal();
      App.showToast("Albom mijozga topshirildi! Pul balansingizga qoʻshildi.");
      App.render();
    }
  }
};

window.SellerView = SellerView;

