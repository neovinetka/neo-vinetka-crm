/* ====================================================================
   VINETKA CRM & ERP - ACCOUNTANT VIEW (BUXGALTER PANELI)
   Desktop Web Dashboard + Fully Responsive Mobile
   Viloyatlar bo'yicha alohida hisob-kitoblar va moliya filtri
   ==================================================================== */

const AccountantView = {
  currentTab: 'inbox', // 'inbox' | 'payroll' | 'groups_finance' | 'company_expenses'
  selectedRegion: 'all', // Viloyat filtri: 'all' (Umumiy) | 'Samarqand' | 'Toshkent shahri' | ...

  render: () => {
    const user = store.currentUser;
    const activeRegions = store.getRegions();
    if (AccountantView.selectedRegion !== 'all' && !activeRegions.includes(AccountantView.selectedRegion)) {
      AccountantView.selectedRegion = 'all';
    }

    // Tanlangan viloyat va mavsum bo'yicha umumiy hisob-kitob
    const overview = store.getCompanyOverview(AccountantView.selectedRegion, store.selectedSeasonId);
    const currentSeason = store.getCurrentSeason();

    // Tanlangan viloyatga mos kutilayotgan so'rovlar soni
    let pendingCash = store.cashSubmissions.filter(s => s.status === 'pending');
    let pendingExpenses = store.expenseRequests.filter(e => e.status === 'pending');
    if (AccountantView.selectedRegion !== 'all') {
      pendingCash = pendingCash.filter(item => {
        const order = store.orders.find(o => o.id === item.orderId);
        return (order?.region || item.region) === AccountantView.selectedRegion;
      });
      pendingExpenses = pendingExpenses.filter(item => {
        const order = store.orders.find(o => o.id === item.orderId);
        return (order?.region || item.region) === AccountantView.selectedRegion;
      });
    }
    const totalInboxCount = pendingCash.length + pendingExpenses.length;

    // Tanlangan viloyat va Oy/Yilga mos guruhlar va doimiy xarajatlar soni
    const periodOrders = (store.orders || []).filter(o => store.matchesPeriod(o, store.selectedSeasonId));
    const regionOrdersCount = AccountantView.selectedRegion === 'all'
      ? periodOrders.length
      : periodOrders.filter(o => o.region === AccountantView.selectedRegion).length;

    const periodCompExpenses = (store.companyExpenses || []).filter(e => store.matchesPeriod(e, store.selectedSeasonId));
    const regionExpCount = AccountantView.selectedRegion === 'all'
      ? periodCompExpenses.length
      : periodCompExpenses.filter(e => e.region === AccountantView.selectedRegion).length;

    // Tanlangan viloyatga mos xodimlar soni
    const regionEmployeesCount = AccountantView.selectedRegion === 'all'
      ? store.users.filter(u => u.role !== 'ceo' && u.role !== 'accountant').length
      : store.users.filter(u => u.role !== 'ceo' && u.role !== 'accountant' && u.region === AccountantView.selectedRegion).length;

    return `
      <div class="min-h-screen bg-[#F4F7FB]">
        <!-- O'zgarmas Header -->
        ${Components.Header(user, "App.openProfileModal()", "App.logout()")}

        <!-- Desktop va Mobile uchun moslashuvchan asosiy layout -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <!-- ============================================================== -->
          <!-- 1. ENG TEPADA: KATTALASHTIRILGAN VILOYATLAR BO'YICHA MOLIYA FILTRI -->
          <!-- ============================================================== -->
          <div class="mb-6 payno-card p-5 sm:p-6 bg-white">
            <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-full bg-[#d64138]/10 text-[#d64138] flex items-center justify-center">
                  ${Icons.mapPin('w-5 h-5')}
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h2 class="text-base sm:text-lg font-extrabold text-[#000000] tracking-tight">
                      Viloyatlar boʻyicha moliya filtri
                    </h2>
                    ${AccountantView.selectedRegion === 'all' ? `
                      <span class="px-3 py-0.5 rounded-full bg-[#1C1C1E] text-white text-[11px] font-extrabold">
                        Umumiy (Barcha viloyatlar)
                      </span>
                    ` : `
                      <span class="px-3 py-0.5 rounded-full bg-[#d64138] text-white text-[11px] font-extrabold">
                        ${AccountantView.selectedRegion} viloyati
                      </span>
                    `}
                  </div>
                  <p class="text-xs text-[#808080] font-medium mt-0.5">
                    Har bir viloyatning kassa tushumi, guruhlari, xodimlari va doimiy xarajatlarini alohida boshqaring
                  </p>
                </div>
              </div>

              ${AccountantView.selectedRegion !== 'all' ? `
                <button 
                  onclick="AccountantView.selectRegion('all')" 
                  class="payno-pill-btn px-4 py-2.5 bg-[#F0F0F0] hover:bg-[#E5E5E5] text-[#1C1C1E] text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  ${Icons.x('w-3.5 h-3.5 text-[#808080]')}
                  <span>Filtrni tozalash (Umumiy koʻrish)</span>
                </button>
              ` : ''}
            </div>

            <!-- Katta Viloyatlar Tugmalari (Gorizontal scrollable & wrap) -->
            <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              <!-- Bitta Umumiy tugma (Barcha viloyatlar) -->
              <button 
                onclick="AccountantView.selectRegion('all')" 
                class="px-5 py-3 min-h-[48px] text-xs sm:text-[13px] font-extrabold shrink-0 transition-all flex items-center gap-2.5 rounded-full ${AccountantView.selectedRegion === 'all' ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#1C1C1E]'}"
              >
                <span class="w-2 h-2 rounded-full ${AccountantView.selectedRegion === 'all' ? 'bg-[#d64138]' : 'bg-[#A9A9A9]'}"></span>
                <span>Barcha viloyatlar (Umumiy)</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${AccountantView.selectedRegion === 'all' ? 'bg-white/20 text-white' : 'bg-white text-[#1C1C1E]'}">
                  ${(store.orders || []).length} ta guruh
                </span>
              </button>

              <!-- Har bir viloyat tugmasi -->
              ${activeRegions.map(r => {
                const regOrdersCount = (store.orders || []).filter(o => o.region === r).length;
                const isSelected = AccountantView.selectedRegion === r;

                return `
                  <button 
                    onclick="AccountantView.selectRegion('${r}')" 
                    class="px-4 py-3 min-h-[48px] text-xs sm:text-[13px] rounded-full font-bold shrink-0 transition-all flex items-center gap-2 ${isSelected ? 'bg-[#d64138] text-white' : 'bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#1C1C1E]'}"
                  >
                    ${isSelected ? '<span class="w-2 h-2 rounded-full bg-white"></span>' : ''}
                    <span>${r}</span>
                    ${regOrdersCount > 0 ? `
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#d64138]'}">
                        ${regOrdersCount}
                      </span>
                    ` : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 2. OY VA YIL FILTRI HAMDA ASOSIY MOLIYA METRIKALARI            -->
          <!-- ============================================================== -->
          <div class="flex items-center justify-between mb-4 flex-wrap gap-2.5">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full">
                <span class="text-xs font-semibold text-[#808080] flex items-center gap-1.5">
                  ${Icons.calendar('w-3.5 h-3.5 text-[#d64138]')}
                  <span>Oy va Yil:</span>
                </span>
                <select 
                  onchange="AccountantView.handleSeasonChange(this.value)" 
                  class="text-xs font-extrabold text-[#000000] bg-transparent border-0 outline-none cursor-pointer"
                >
                  ${store.renderPeriodSelectOptions(store.selectedSeasonId)}
                </select>
              </div>
            </div>

            <button 
              onclick="AccountantView.openArchivedSeasonsModal()" 
              class="payno-pill-btn px-4 py-2.5 bg-white hover:bg-[#F0F0F0] text-[#1C1C1E] text-xs font-bold flex items-center gap-1.5"
            >
              ${Icons.fileText('w-3.5 h-3.5 text-[#d64138]')}
              <span>Oylar boʻyicha hisobotlar</span>
            </button>
          </div>

          <!-- 4 ta Asosiy Ko'rsatkich Kartalari (Tanlangan viloyatga mos) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="payno-card p-6 bg-white">
              <span class="text-xs font-semibold text-[#808080] block mb-1.5">
                ${AccountantView.selectedRegion === 'all' ? 'Jami tushum (Kassada)' : `${AccountantView.selectedRegion} tushumi`}
              </span>
              <div class="text-2xl font-extrabold text-[#000000]">${Store.formatMoney(overview.totalRevenue)}</div>
              <span class="text-[11px] text-[#808080] font-medium block mt-1.5">Tasdiqlangan mablagʻlar</span>
            </div>

            <div 
              onclick="AccountantView.openCashInHandDetailsModal()" 
              class="payno-card p-6 bg-white cursor-pointer active:scale-[0.98] transition-all group"
              title="Xodimlardagi (sotuvchi va fotograf) naqd pullar va qarzdorliklar roʻyxatini koʻrish uchun bosing"
            >
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-semibold text-[#d64138]">
                  ${AccountantView.selectedRegion === 'all' ? 'Xodimlardagi naqd' : `Xodimlardagi naqd (${AccountantView.selectedRegion})`}
                </span>
                <span class="w-8 h-8 rounded-full bg-[#d64138] text-white flex items-center justify-center shrink-0">
                  ${Icons.arrowUpRight('w-3.5 h-3.5')}
                </span>
              </div>
              <div class="text-2xl font-extrabold text-[#000000]">${Store.formatMoney(overview.totalSellerCashInHand)}</div>
              <span class="text-[11px] text-[#d64138] font-bold block mt-1.5 flex items-center gap-1">
                <span>Batafsil roʻyxat &rarr;</span>
              </span>
            </div>

            <div 
              onclick="AccountantView.openExpenseAnalyticsModal()" 
              class="payno-card p-6 bg-white cursor-pointer active:scale-[0.98] transition-all group"
              title="Xarajatlar tahlili, kategoriyalar va tranzaksiya tarixini koʻrish uchun bosing"
            >
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-semibold text-[#808080]">
                  ${AccountantView.selectedRegion === 'all' ? 'Jami xarajatlar' : `${AccountantView.selectedRegion} xarajatlari`}
                </span>
                <span class="w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shrink-0">
                  ${Icons.arrowUpRight('w-3.5 h-3.5')}
                </span>
              </div>
              <div class="text-2xl font-extrabold text-[#000000]">${Store.formatMoney(overview.totalExpenses)}</div>
              <span class="text-[11px] text-[#d64138] font-bold block mt-1.5 flex items-center gap-1">
                <span>Tahlil va kategoriyalar &rarr;</span>
              </span>
            </div>

            <div class="payno-card p-6 bg-white">
              <span class="text-xs font-semibold text-[#d64138] block mb-1.5">
                ${AccountantView.selectedRegion === 'all' ? 'Kompaniya sof foydasi' : `${AccountantView.selectedRegion} sof foydasi`}
              </span>
              <div class="text-2xl font-extrabold text-[#d64138]">
                ${Store.formatMoney(overview.netProfit)}
              </div>
              <span class="text-[11px] text-[#808080] font-medium block mt-1.5">Tushum minus xarajat</span>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 3. PASDAN 4 TA ASOSIY BO'LIM TABLARI (Design Namuna Pill Tabs) -->
          <!-- ============================================================== -->
          <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-5">
            <!-- 1. Tasdiqlash markazi -->
            <button 
              onclick="AccountantView.switchTab('inbox')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2.5 ${AccountantView.currentTab === 'inbox' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              <span>Tasdiqlash markazi (Inbox)</span>
              ${totalInboxCount > 0 ? `
                <span class="px-2 py-0.5 rounded-full bg-[#d64138] text-white text-[10px] font-extrabold animate-pulse">
                  ${totalInboxCount}
                </span>
              ` : ''}
            </button>

            <!-- 2. Xodimlar hisob-kitobi -->
            <button 
              onclick="AccountantView.switchTab('payroll')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2.5 ${AccountantView.currentTab === 'payroll' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.wallet('w-4 h-4')}
              <span>Xodim hisob-kitoblari (Payroll)</span>
              ${regionEmployeesCount > 0 ? `
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${AccountantView.currentTab === 'payroll' ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#1C1C1E]'}">
                  ${regionEmployeesCount} nafar
                </span>
              ` : ''}
            </button>

            <!-- 3. Guruhlar moliyasi -->
            <button 
              onclick="AccountantView.switchTab('groups_finance')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2.5 ${AccountantView.currentTab === 'groups_finance' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.orders('w-4 h-4')}
              <span>Guruhlar moliyasi</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${AccountantView.currentTab === 'groups_finance' ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#1C1C1E]'}">
                ${regionOrdersCount} ta
              </span>
            </button>

            <!-- 4. Doimiy xarajatlar -->
            <button 
              onclick="AccountantView.switchTab('company_expenses')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2.5 ${AccountantView.currentTab === 'company_expenses' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.receipt('w-4 h-4')}
              <span>Doimiy xarajatlar</span>
              ${regionExpCount > 0 ? `
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${AccountantView.currentTab === 'company_expenses' ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#1C1C1E]'}">
                  ${regionExpCount}
                </span>
              ` : ''}
            </button>
          </div>

          <!-- ============================================================== -->
          <!-- 4. TANLANGAN TAB KONTENTI (VILOYATGA MOS FILTRLANGAN)          -->
          <!-- ============================================================== -->
          ${AccountantView.currentTab === 'inbox' ? AccountantView.renderInboxTab() : ''}
          ${AccountantView.currentTab === 'payroll' ? AccountantView.renderPayrollTab() : ''}
          ${AccountantView.currentTab === 'groups_finance' ? AccountantView.renderGroupsFinanceTab() : ''}
          ${AccountantView.currentTab === 'company_expenses' ? AccountantView.renderCompanyExpensesTab() : ''}
        </div>
      </div>
    `;
  },

  selectRegion: (region) => {
    AccountantView.selectedRegion = region;
    App.render();
  },

  switchTab: (tab) => {
    AccountantView.currentTab = tab;
    App.render();
  },

  // ==================================================================
  // 1. TASDIQLASH MARKAZI (INBOX) - VILOYAT FILTRI BILAN
  // ==================================================================
  renderInboxTab: () => {
    let pendingCash = store.cashSubmissions.filter(s => s.status === 'pending');
    let pendingExpenses = store.expenseRequests.filter(e => e.status === 'pending');

    // Agar viloyat tanlangan bo'lsa, faqat o'sha viloyat buyurtmalarini ko'rsatish
    if (AccountantView.selectedRegion !== 'all') {
      pendingCash = pendingCash.filter(item => {
        const order = store.orders.find(o => o.id === item.orderId);
        return (order?.region || item.region || 'Toshkent shahri') === AccountantView.selectedRegion;
      });
      pendingExpenses = pendingExpenses.filter(item => {
        const order = store.orders.find(o => o.id === item.orderId);
        return (order?.region || item.region || 'Toshkent shahri') === AccountantView.selectedRegion;
      });
    }

    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 1) Xodimlardan (Sotuvchi va Fotograf) topshirilgan pullar -->
        <div class="payno-card p-6 bg-white border border-slate-100">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-900">Topshirilgan naqd pullar</h3>
                ${AccountantView.selectedRegion !== 'all' ? `
                  <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                    ${AccountantView.selectedRegion}
                  </span>
                ` : ''}
              </div>
              <p class="text-xs text-slate-400">Sotuvchi va fotograf tomonidan mijozdan olingan pullar</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              ${pendingCash.length} ta
            </span>
          </div>

          ${pendingCash.length === 0 ? `
            <div class="py-12 text-center text-slate-400 text-xs font-semibold">
              ${AccountantView.selectedRegion === 'all' ? 'Kutilayotgan naqd pul soʻrovlari yoʻq' : `${AccountantView.selectedRegion} viloyati boʻyicha kutilayotgan naqd pul soʻrovlari yoʻq`}
            </div>
          ` : `
            <div class="space-y-3">
              ${pendingCash.map(item => {
                const order = store.orders.find(o => o.id === item.orderId);
                const orderRegion = order?.region || item.region || 'Toshkent shahri';
                const isPhotographer = item.role === 'photographer';

                return `
                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-extrabold text-slate-900">${item.orderId} &bull; ${item.group}</span>
                        <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold">
                          ${orderRegion}
                        </span>
                        ${isPhotographer ? `
                          <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                            Fotograf topshirishi
                          </span>
                        ` : ''}
                      </div>
                      <span class="text-base font-extrabold text-emerald-600">${Store.formatMoney(item.amount)}</span>
                    </div>
                    <div class="text-xs text-slate-600 mb-1">
                      Xodim: <strong class="text-slate-800">${item.sellerName}</strong> (${isPhotographer ? 'Fotograf' : 'Sotuvchi'} &bull; ${item.percentage || 'Toʻlov'})
                    </div>
                    ${isPhotographer ? `
                      <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 font-semibold mb-2">
                        * Muhim: Tasdiqlangach, ushbu ${Store.formatMoney(item.amount)} avtomatik ravishda Sotuvchining bu guruh uchun qarzidan ayirib tashlanadi!
                      </div>
                    ` : ''}
                    <div class="text-[11px] text-slate-400 mb-3">
                      ${item.university} &bull; ${item.date} &bull; <span class="capitalize">${item.paymentMethod === 'cash' ? 'Naqd pul' : 'Karta'}</span>
                    </div>

                    <!-- Tasdiqlash tugmasi -->
                    <div class="flex items-center gap-2">
                      <button 
                        onclick="AccountantView.approveCash('${item.id}')" 
                        class="flex-1 payno-pill-btn payno-btn-success py-2.5 text-xs font-bold shadow-sm"
                      >
                        ${Icons.check('w-3.5 h-3.5')}
                        <span>Qabul qildim va Tasdiqlash</span>
                      </button>
                      <button 
                        onclick="AccountantView.rejectCash('${item.id}')" 
                        class="px-4 payno-pill-btn bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 py-2.5 text-xs font-bold"
                      >
                        Rad etish
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- 2) Xarajat so'rovlari (Fotograf, sotuvchi, umumiy xarajatlar) -->
        <div class="payno-card p-6 bg-white border border-slate-100">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-900">Xarajat soʻrovlari</h3>
                ${AccountantView.selectedRegion !== 'all' ? `
                  <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                    ${AccountantView.selectedRegion}
                  </span>
                ` : ''}
              </div>
              <p class="text-xs text-slate-400">Guruh xarajatlari va umumiy xarajat soʻrovlari</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              ${pendingExpenses.length} ta
            </span>
          </div>

          ${pendingExpenses.length === 0 ? `
            <div class="py-12 text-center text-slate-400 text-xs font-semibold">
              ${AccountantView.selectedRegion === 'all' ? 'Kutilayotgan xarajat soʻrovlari yoʻq' : `${AccountantView.selectedRegion} viloyati boʻyicha kutilayotgan xarajat soʻrovlari yoʻq`}
            </div>
          ` : `
            <div class="space-y-3">
              ${pendingExpenses.map(item => {
                const order = store.orders.find(o => o.id === item.orderId);
                const orderRegion = order?.region || item.region || 'Toshkent shahri';
                const isGeneral = item.isGeneral || !item.orderId || item.orderId === 'UMUMIY';

                return `
                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-extrabold text-slate-900">${isGeneral ? 'Umumiy xarajat' : item.orderId}</span>
                        <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold">
                          ${orderRegion}
                        </span>
                        ${isGeneral ? `
                          <span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-extrabold">
                            Umumiy xarajat
                          </span>
                        ` : ''}
                        ${item.category ? `
                          <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold">
                            ${item.category}
                          </span>
                        ` : ''}
                      </div>
                      <span class="text-base font-extrabold text-rose-600">${Store.formatMoney(item.amount)}</span>
                    </div>
                    <div class="text-xs font-semibold text-slate-800 mb-1">
                      ${item.description || item.comment || item.title || 'Xarajat'}
                    </div>
                    <div class="text-[11px] text-slate-500 mb-2">
                      Xodim: <strong>${item.requesterName}</strong> (${item.requesterRole}) &bull; ${item.date}
                    </div>

                    ${item.proofLink ? `
                      <div class="mb-3">
                        <a href="${item.proofLink}" target="_blank" class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                          ${Icons.receipt('w-3.5 h-3.5')}
                          <span>Chek yoki dalolat havolasini koʻrish</span>
                        </a>
                      </div>
                    ` : ''}

                    <!-- Tasdiqlash / Rad etish -->
                    <div class="flex items-center gap-2">
                      <button 
                        onclick="AccountantView.openApproveExpenseModal('${item.id}')" 
                        class="flex-1 payno-pill-btn payno-btn-primary py-2.5 text-xs font-bold shadow-sm"
                      >
                        ${Icons.check('w-3.5 h-3.5')}
                        <span>Xarajatni tasdiqlash</span>
                      </button>
                      <button 
                        onclick="AccountantView.rejectExpense('${item.id}')" 
                        class="px-4 payno-pill-btn bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 py-2.5 text-xs font-bold"
                      >
                        Rad etish
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  },

  approveCash: (subId) => {
    const success = store.approveCashSubmission(subId);
    if (success) {
      App.showToast("Naqd pul qabul qilindi va hisobga olindi!");
      App.render();
    }
  },

  rejectCash: (subId) => {
    if (confirm("Ushbu topshirish soʻrovini rad etmoqchimisiz?")) {
      store.rejectCashSubmission(subId);
      App.showToast("Soʻrov rad etildi!");
      App.render();
    }
  },

  // 5. Buxgalter xarajatni tasdiqlashida kategoriya tanlash modali
  openApproveExpenseModal: (expId) => {
    const item = (store.expenseRequests || []).find(e => e.id === expId);
    if (!item) {
      alert("Xarajat soʻrovi topilmadi!");
      return;
    }

    const categories = store.getExpenseCategories ? store.getExpenseCategories() : ['Ofis va Ijara', 'Taksi va Transport', 'Pechat va Materiallar', 'Oylik va Gonorar', 'Boshqa'];
    const order = store.orders.find(o => o.id === item.orderId);
    const orderRegion = order?.region || item.region || 'Toshkent shahri';
    const isGeneral = item.isGeneral || !item.orderId || item.orderId === 'UMUMIY';

    const isImage = item.proofLink && (
      item.proofLink.startsWith('data:image/') || 
      item.proofLink.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i)
    );

    const bodyHtml = `
      <form id="approve-expense-form" onsubmit="AccountantView.handleConfirmApproveExpense(event, '${item.id}')" class="space-y-4">
        <!-- Xarajat Tafsilotlari -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold ${isGeneral ? 'bg-purple-100 text-purple-900' : 'bg-blue-100 text-blue-900'}">
              ${isGeneral ? 'Umumiy xarajat' : `Guruh: ${item.orderId}`}
            </span>
            <span class="text-lg font-extrabold text-rose-600">
              -${Store.formatMoney(item.amount)}
            </span>
          </div>

          <div class="text-xs text-slate-700 font-semibold pt-1">
            ${item.description || item.comment || item.title || 'Xarajat'}
          </div>

          <div class="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 pt-2 flex-wrap gap-1">
            <span>Xodim: <strong class="text-slate-800">${item.requesterName}</strong> (${item.requesterRole})</span>
            <span>Hudud: <strong class="text-slate-800">${orderRegion}</strong></span>
          </div>
        </div>

        <!-- Chek / Isbot ko'rinishi -->
        ${item.proofLink ? `
          <div class="p-3 bg-white rounded-2xl border border-slate-200">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Isbot cheki:
            </label>
            ${isImage ? `
              <div class="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                <img src="${item.proofLink}" alt="Chek" class="max-h-48 w-full object-contain" />
              </div>
            ` : `
              <a href="${item.proofLink}" target="_blank" class="payno-pill-btn bg-slate-100 hover:bg-blue-50 text-blue-700 text-xs font-bold py-2 px-3 inline-flex items-center gap-1.5 transition-all">
                ${Icons.receipt('w-4 h-4')}
                <span>Chek yoki havolani ochish &nearr;</span>
              </a>
            `}
          </div>
        ` : ''}

        <!-- Kategoriya Tanlash (Dropdown) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">
            Xarajat qaysi kategoriyaga tegishli? <span class="text-rose-500">*</span>
          </label>
          <select id="approve-expense-category-select" required class="payno-input bg-slate-50 font-bold text-slate-900 cursor-pointer">
            ${categories.map(cat => `
              <option value="${cat}" ${item.category === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
          <p class="text-[10px] text-slate-400 mt-1">
            * Tanlangan kategoriya boʻyicha ushbu summa xarajatlar tahlili va kategoriyalar roʻyxatida hisoblanadi.
          </p>
        </div>

        <!-- Tugmalar -->
        <div class="pt-2 flex items-center gap-2">
          <button 
            type="submit" 
            class="flex-1 payno-pill-btn payno-btn-primary py-3 text-xs font-bold shadow-md"
          >
            ${Icons.check('w-4 h-4')}
            <span>Tasdiqlash va saqlash</span>
          </button>
          <button 
            type="button" 
            onclick="App.closeModal()" 
            class="px-4 payno-pill-btn bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 text-xs font-bold"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    `;

    App.openModal("Xarajatni tasdiqlash va kategoriya biriktirish", bodyHtml);
  },

  handleConfirmApproveExpense: (e, expId) => {
    e.preventDefault();
    const select = document.getElementById('approve-expense-category-select');
    const selectedCategory = select ? select.value : 'Boshqa';

    const success = store.approveExpense(expId, selectedCategory);
    if (success) {
      App.closeModal();
      App.showToast(`Xarajat tasdiqlandi va "${selectedCategory}" kategoriyasiga biriktirildi!`);
      App.render();
    } else {
      App.showToast("Xarajatni tasdiqlashda xatolik yuz berdi!", "warning");
    }
  },

  approveExpense: (expId, category = null) => {
    const success = store.approveExpense(expId, category);
    if (success) {
      App.showToast("Xarajat tasdiqlandi!");
      App.render();
    }
  },

  rejectExpense: (expId) => {
    if (confirm("Ushbu xarajatni rad etmoqchimisiz?")) {
      store.rejectExpense(expId);
      App.showToast("Xarajat rad etildi!");
      App.render();
    }
  },

  // ==================================================================
  // 2. XODIMLAR HISOB-KITOBLARI (PAYROLL) - VILOYAT BO'YICHA ALOHIDA
  // ==================================================================
  renderPayrollTab: () => {
    const isFiltered = AccountantView.selectedRegion !== 'all';
    const overview = store.getCompanyOverview(AccountantView.selectedRegion, store.selectedSeasonId);
    let employees = store.users.filter(u => u.role !== 'accountant');

    if (isFiltered) {
      // Faqat ushbu viloyatga biriktirilgan xodimlar va viloyatsiz umumiy xodimlar/CEO umumiy ko'rinishda bo'ladi
      employees = employees.filter(u => u.role === 'ceo' || u.region === AccountantView.selectedRegion);
    }

    return `
      <div class="payno-card p-6 bg-white border border-slate-100">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-900">Xodimlar hisob-kitobi (Payroll)</h3>
              ${isFiltered ? `
                <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold">
                  ${AccountantView.selectedRegion} viloyati xodimlari
                </span>
              ` : `
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  Barcha viloyatlar va umumiy xodimlar
                </span>
              `}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              ${isFiltered 
                ? `Hozir faqat <strong>${AccountantView.selectedRegion}</strong> viloyatiga biriktirilgan xodimlarning hisob-kitoblari koʻrsatilmoqda.` 
                : 'Barcha viloyatlardagi va umumiy korporativ xodimlarning hisob-kitoblari jamlangan holda koʻrsatilmoqda.'}
            </p>
          </div>
          <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            ${employees.length} nafar xodim
          </span>
        </div>

        ${employees.length === 0 ? `
          <div class="py-12 text-center text-slate-400 text-xs font-semibold bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-2">
            ${AccountantView.selectedRegion} viloyatiga biriktirilgan xodimlar mavjud emas.<br>
            <span class="text-[11px] text-slate-400 mt-1 block font-normal">
              CEO (Rahbar) HR boʻlimidan xodim qoʻshishda yoki tahrirlashda ularning viloyatini belgilashi mumkin.
            </span>
          </div>
        ` : `
          <div class="overflow-x-auto rounded-2xl border border-slate-200/70">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50/90 text-slate-500 border-b border-slate-200/80 uppercase tracking-wider font-extrabold text-[11px]">
                  <th class="py-3.5 pl-4 pr-5 text-left whitespace-nowrap min-w-[220px]">Xodim</th>
                  <th class="py-3.5 px-5 text-left border-l border-slate-200/60 whitespace-nowrap min-w-[190px]">Kasbi va individual tarifi</th>
                  <th class="py-3.5 px-5 text-center border-l border-slate-200/60 whitespace-nowrap min-w-[165px]">
                    ${isFiltered ? `${AccountantView.selectedRegion}da ishlagan` : 'Jami ishlagan puli'}
                  </th>
                  <th class="py-3.5 px-5 text-center border-l border-slate-200/60 whitespace-nowrap min-w-[150px]">Avans / Ushlanma</th>
                  <th class="py-3.5 px-5 text-center border-l border-slate-200/60 whitespace-nowrap min-w-[165px]">Hozir berish kerak</th>
                  <th class="py-3.5 px-4 text-center border-l border-slate-200/60 whitespace-nowrap min-w-[230px]">Harakat</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                ${employees.map(emp => {
                  const summary = AccountantView.getEmployeePayrollSummary(emp, overview);
                  const { totalEarned, advance, available, roleTitle, payDesc, ordersCount } = summary;

                  return `
                    <tr 
                      onclick="AccountantView.openPayrollDetailModal('${emp.id}')" 
                      class="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                      title="Xodimning detal hisob-kitob oynasini ochish uchun bosing"
                    >
                      <td class="py-3.5 pl-4 pr-5 align-middle">
                        <div class="flex items-center gap-2.5">
                          <img src="${emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}" class="w-8 h-8 rounded-full object-cover ring-1 ring-black/[0.06] group-hover:ring-[#d64138]/40 transition-all shrink-0" />
                          <div class="min-w-0">
                            <div class="flex items-center gap-1.5 flex-wrap">
                              <span class="font-bold text-slate-900 group-hover:text-[#d64138] transition-colors whitespace-nowrap">${emp.name}</span>
                              ${emp.region && emp.region !== 'all' ? `
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200 whitespace-nowrap">
                                  ${emp.region}
                                </span>
                              ` : `
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-200 text-slate-700 whitespace-nowrap">
                                  Umumiy xodim
                                </span>
                              `}
                            </div>
                            <div class="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                              <span>${emp.phone}</span>
                              ${isFiltered ? `
                                <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-bold">
                                  ${ordersCount} ta guruh
                                </span>
                              ` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-5 align-middle border-l border-slate-100 whitespace-nowrap">
                        <div class="font-bold text-slate-900">${roleTitle}</div>
                        <div class="text-[11px] text-blue-700 font-extrabold mt-0.5">${payDesc}</div>
                      </td>
                      <td class="py-3.5 px-5 text-center align-middle border-l border-slate-100 whitespace-nowrap">
                        <div class="font-extrabold text-slate-900 text-[13px]">${Store.formatMoney(totalEarned)}</div>
                        ${summary.isProrated ? `
                          <div class="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full inline-block mt-1">
                            ${summary.startDay}-sanadan: ${summary.workedDays} kunlik
                          </div>
                        ` : ''}
                        ${summary.carryOverBalance !== 0 ? `
                          <div class="text-[10px] font-bold ${summary.carryOverBalance > 0 ? 'text-[#d64138]' : 'text-rose-600'} mt-0.5">
                            Oldingi oydan: ${summary.carryOverBalance > 0 ? '+' : ''}${Store.formatMoney(summary.carryOverBalance)}
                          </div>
                        ` : ''}
                      </td>
                      <td class="py-3.5 px-5 text-center align-middle border-l border-slate-100 font-bold text-rose-600 text-[13px] whitespace-nowrap">
                        -${Store.formatMoney(advance)}
                      </td>
                      <td class="py-3.5 px-5 text-center align-middle border-l border-slate-100 whitespace-nowrap">
                        <span class="inline-block px-3 py-1 rounded-xl font-extrabold text-[13px] ${
                          available < 0 
                            ? 'bg-rose-50 text-rose-600 border border-rose-200/70' 
                            : available > 0 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70' 
                              : 'bg-slate-100 text-slate-500'
                        }">
                          ${Store.formatMoney(available)}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-center align-middle border-l border-slate-100 whitespace-nowrap" onclick="event.stopPropagation()">
                        <div class="flex items-center justify-center gap-1.5">
                          <button 
                            onclick="AccountantView.openPayrollDetailModal('${emp.id}')" 
                            class="payno-pill-btn px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#d64138] text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                            title="Toʻliq detal hisob-kitobni koʻrish"
                          >
                            ${Icons.eye('w-3.5 h-3.5')}
                            <span>Koʻrish</span>
                          </button>
                          ${emp.role === 'ceo' ? `
                            <button 
                              onclick="AccountantView.openCeoPayoutModal('${emp.id}')" 
                              class="payno-pill-btn px-4 py-1.5 bg-[#d64138] hover:bg-[#bd352d] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                              title="Rahbarga dividend yoki pul chiqarish"
                            >
                              ${Icons.wallet('w-3.5 h-3.5')}
                              <span>Dividend berish</span>
                            </button>
                          ` : `
                            <button 
                              onclick="AccountantView.openCompensationModal('${emp.id}')" 
                              class="payno-pill-btn px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                              title="Individual oylik yoki foiz tarifini sozlash"
                            >
                              ${Icons.settings('w-3 h-3 text-slate-500')}
                              <span>Tarif</span>
                            </button>
                            <button 
                              onclick="AccountantView.openPayModal('${emp.id}', '${emp.name.replace(/'/g, "\\'")}', '${roleTitle}', ${available}, '${AccountantView.selectedRegion}')" 
                              class="payno-pill-btn px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                            >
                              ${Icons.wallet('w-3.5 h-3.5')}
                              <span>Toʻlash / Avans</span>
                            </button>
                          `}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  },

  // Xodimning oylik, tarif, ishlangan pul, oldingi oydan qoldiq (carry-over), ayirmalar va yakuniy qoldiq hisob-kitobi
  getEmployeePayrollSummary: (emp, overviewObj = null) => {
    const region = AccountantView.selectedRegion || 'all';
    const seasonId = store.selectedSeasonId || store.getCurrentMonthKey();
    const overview = overviewObj || store.getCompanyOverview(region, seasonId);
    const periodLabel = store.getPeriodLabel(seasonId);

    let periodEarned = 0;
    let carryOverBalance = 0;
    let totalEarned = 0;
    let pendingEarned = 0;
    let advanceOnly = 0;
    let paidOnly = 0;
    let advance = 0;
    let available = 0;
    let roleTitle = '';
    let payDesc = '';
    let tariffLabel = '';
    let workSummaryText = '';
    let ordersCount = 0;
    let breakdown = [];
    let isProrated = false;
    let workedDays = 30;
    let totalDays = 30;
    let dailyRate = 0;
    let startDay = 1;
    let startDateIso = '';
    let baseMonthlySalary = 0;
    let notStartedYet = false;

    const formatSalariedLabels = (rateVal, fObj, extraSuffix = '') => {
      baseMonthlySalary = rateVal;
      isProrated = Boolean(fObj.isProrated);
      workedDays = fObj.workedDays !== undefined ? fObj.workedDays : 30;
      totalDays = fObj.totalDays || 30;
      dailyRate = fObj.dailyRate || Math.round(rateVal / 30);
      startDay = fObj.startDay || 1;
      startDateIso = fObj.startDateIso || '';
      notStartedYet = Boolean(fObj.notStartedYet);

      tariffLabel = `Qatʼiy oylik: ${Store.formatMoney(rateVal)} (30 kunga — kuniga ${Store.formatMoney(dailyRate)})`;
      if (notStartedYet) {
        payDesc = `${Store.formatMoney(rateVal)} / 30 kun (Shu oyda hali ishga kirmagan)`;
        workSummaryText = `Xodim ${startDateIso || ''} sanada ishga kirgan (tanlangan oyda ishlamagan)`;
      } else if (isProrated) {
        payDesc = `${Store.formatMoney(rateVal)} / 30 kun (${startDay}-sanadan: ${workedDays} kun)`;
        workSummaryText = `Oyning ${startDay}-sanasida ishga kirgan: 30 kundan ${workedDays} kun × ${Store.formatMoney(dailyRate)} = ${Store.formatMoney(fObj.periodEarned)}${extraSuffix}`;
      } else {
        payDesc = `${Store.formatMoney(rateVal)} / oy (30 kunlik oylik)`;
        workSummaryText = `${periodLabel}: Toʻliq 30 kunlik oylik maosh${extraSuffix}`;
      }
    };

    // Xodimga tegishli to'lov va avans loglari (Tanlangan Oy/Yil va Viloyat bo'yicha)
    const logs = (store.payrollLogs || []).filter(p => {
      if (p.userId !== emp.id) return false;
      if (region && region !== 'all' && p.region && p.region !== 'all' && p.region !== region) return false;
      if (seasonId && seasonId !== 'all' && !store.matchesPeriod(p, seasonId)) return false;
      return true;
    });

    if (emp.role === 'ceo') {
      roleTitle = 'Rahbar (CEO)';
      periodEarned = overview.totalRevenue;
      carryOverBalance = 0;
      totalEarned = overview.totalRevenue;
      const payouts = store.getEmployeePayoutsSplit(emp.id, seasonId, region);
      paidOnly = payouts.periodPaid;
      advanceOnly = payouts.periodAdvance;
      advance = payouts.periodTotalPaid;
      available = overview.netProfit;
      payDesc = 'Kompaniya dividendi / ulushi';
      tariffLabel = 'Kompaniya sof foydasi va dividendlari';
      workSummaryText = `${periodLabel} kompaniya tushumi asosida (Sof foyda: ${Store.formatMoney(overview.netProfit)})`;
    } else if (emp.role === 'worker') {
      roleTitle = 'Oddiy ishchi';
      const rate = emp.payRate || 3500000;
      const payouts = store.getEmployeePayoutsSplit(emp.id, seasonId, region);
      const salCalc = store.computeSalariedCarryOver(emp, seasonId, rate, payouts, []);
      periodEarned = salCalc.periodEarned;
      carryOverBalance = salCalc.carryOverBalance;
      totalEarned = salCalc.totalEarned;
      paidOnly = payouts.periodPaid;
      advanceOnly = payouts.periodAdvance;
      advance = payouts.periodTotalPaid;
      available = salCalc.netBalance;
      formatSalariedLabels(rate, salCalc);
    } else if (emp.role === 'seller') {
      roleTitle = 'Sotuvchi';
      const f = store.getSellerFinance(emp.id, seasonId, region);
      periodEarned = f.periodEarned !== undefined ? f.periodEarned : f.confirmedEarned;
      carryOverBalance = f.carryOverBalance || 0;
      totalEarned = f.confirmedEarned;
      pendingEarned = f.pendingEarned || 0;
      advanceOnly = f.advanceTaken || 0;
      paidOnly = f.paidCommission || 0;
      advance = f.totalPaidOut;
      available = f.netBalance;
      ordersCount = f.breakdown ? f.breakdown.length : 0;

      if (emp.payModel === 'percent' || !emp.payModel) {
        const r = emp.payRate !== undefined ? emp.payRate : 10;
        payDesc = `${r}% komissiya`;
        tariffLabel = `Foiz: ${r}% (Guruh tushumidan komissiya)`;
      } else if (emp.payModel === 'per_student') {
        const r = emp.payRate || 15000;
        payDesc = `${Store.formatMoney(r)} / talaba`;
        tariffLabel = `Odam boshiga: ${Store.formatMoney(r)}`;
      } else if (emp.payModel === 'per_group') {
        const r = emp.payRate || 300000;
        payDesc = `${Store.formatMoney(r)} / guruh`;
        tariffLabel = `Guruh boshiga: ${Store.formatMoney(r)}`;
      }

      const confirmedCount = (f.breakdown || []).filter(b => b.isConfirmed).length;
      workSummaryText = `${periodLabel}: ${confirmedCount} ta tasdiqlangan guruh (jami ${ordersCount} ta guruhdan)`;
      breakdown = (f.breakdown || []).map(b => ({
        id: b.id,
        group: b.group,
        region: b.region,
        calcText: (emp.payModel === 'percent' || !emp.payModel)
          ? `Tushum: ${Store.formatMoney(b.total)} × ${emp.payRate || 10}%`
          : (emp.payModel === 'per_student' ? `Talaba boshiga stavka` : `Guruh stavkasi`),
        amount: b.commission,
        isConfirmed: b.isConfirmed,
        statusText: b.isConfirmed ? '50%+ tasdiqlangan' : 'Jarayonda (50% kutilmoqda)'
      }));
    } else if (emp.role === 'photographer') {
      roleTitle = 'Fotograf';
      const f = store.getPhotographerFinance(emp.id, seasonId, region);
      periodEarned = f.periodEarned !== undefined ? f.periodEarned : f.confirmedEarned;
      carryOverBalance = f.carryOverBalance || 0;
      totalEarned = f.confirmedEarned;
      pendingEarned = f.pendingEarned || 0;
      advanceOnly = f.advanceOnly !== undefined ? f.advanceOnly : (emp.advanceTaken || 0);
      paidOnly = f.paidAmount !== undefined ? f.paidAmount : (emp.paidAmount || 0);
      advance = f.advanceTaken;
      available = f.remainingSalary;
      ordersCount = f.completedGroupsCount || 0;

      if (emp.payModel === 'salary' || !emp.payModel) {
        const r = emp.payRate || 6000000;
        formatSalariedLabels(r, f, ` (${ordersCount} ta guruh suratga olingan)`);
      } else if (emp.payModel === 'per_group') {
        const r = emp.payRate || 250000;
        payDesc = `${Store.formatMoney(r)} / guruh`;
        tariffLabel = `Guruh boshiga: ${Store.formatMoney(r)}`;
        workSummaryText = `${periodLabel}: ${ordersCount} ta suratga olingan guruh boʻyicha`;
      } else if (emp.payModel === 'per_student') {
        const r = emp.payRate || 10000;
        payDesc = `${Store.formatMoney(r)} / talaba`;
        tariffLabel = `Odam boshiga: ${Store.formatMoney(r)}`;
        workSummaryText = `${periodLabel}: ${ordersCount} ta suratga olingan guruh talabalari boʻyicha`;
      }

      breakdown = (f.breakdown || []).map(b => ({
        id: b.id,
        group: b.group,
        region: b.region,
        calcText: (emp.payModel === 'salary' || !emp.payModel)
          ? `${b.students} ta talaba (Qatʼiy oylik ichida)`
          : (emp.payModel === 'per_group'
              ? `1 ta guruh × ${Store.formatMoney(emp.payRate || 250000)}`
              : `${b.students} ta talaba × ${Store.formatMoney(emp.payRate || 10000)}`),
        amount: b.amount,
        isConfirmed: b.isUnlocked,
        statusText: b.isUnlocked ? 'Tasdiqlangan' : 'Jarayonda'
      }));
    } else if (emp.role === 'editor') {
      roleTitle = 'Dizayner';
      const f = store.getEditorFinance(emp.id, seasonId, region);
      periodEarned = f.periodEarned !== undefined ? f.periodEarned : f.confirmedEarned;
      carryOverBalance = f.carryOverBalance || 0;
      totalEarned = f.confirmedEarned;
      pendingEarned = f.pendingEarned || 0;
      advanceOnly = f.advanceTaken || 0;
      paidOnly = f.paidAmount || 0;
      advance = f.totalPaid;
      available = f.netBalance;
      ordersCount = f.breakdown ? f.breakdown.length : 0;

      if (emp.payModel === 'per_student' || !emp.payModel) {
        const r = emp.payRate || 15000;
        payDesc = `${Store.formatMoney(r)} / talaba`;
        tariffLabel = `Odam boshiga: ${Store.formatMoney(r)}`;
      } else if (emp.payModel === 'per_group') {
        const r = emp.payRate || 350000;
        payDesc = `${Store.formatMoney(r)} / guruh`;
        tariffLabel = `Guruh boshiga: ${Store.formatMoney(r)}`;
      } else if (emp.payModel === 'salary') {
        const r = emp.payRate || 5000000;
        payDesc = `${Store.formatMoney(r)} / oy (Oylik)`;
        tariffLabel = `Qatʼiy oylik: ${Store.formatMoney(r)}`;
      }

      const confirmedCount = (f.breakdown || []).filter(b => b.isUnlocked).length;
      const totalStudents = (f.breakdown || []).filter(b => b.isUnlocked).reduce((sum, b) => sum + (b.students || 0), 0);
      if (emp.payModel === 'salary') {
        const r = emp.payRate || 5000000;
        formatSalariedLabels(r, f, ` (${ordersCount} ta guruh)`);
      } else {
        workSummaryText = `${periodLabel}: ${confirmedCount} ta tasdiqlangan guruh (${totalStudents} ta talaba dizayni)`;
      }

      breakdown = (f.breakdown || []).map(b => ({
        id: b.id,
        group: b.group,
        region: b.region,
        calcText: (emp.payModel === 'per_student' || !emp.payModel)
          ? `${b.students} ta talaba × ${Store.formatMoney(b.rate)}`
          : (emp.payModel === 'per_group' ? `1 ta guruh × ${Store.formatMoney(b.rate)}` : `${b.students} ta talaba`),
        amount: b.amount,
        isConfirmed: b.isUnlocked,
        statusText: b.isUnlocked ? '50%+ tasdiqlangan' : (b.isCompleted ? 'Montaj tayyor (50% kutilmoqda)' : 'Montajda')
      }));
    } else if (emp.role === 'maker') {
      roleTitle = 'Albom yasovchi';
      const f = store.getMakerFinance(emp.id, seasonId, region);
      periodEarned = f.periodEarned !== undefined ? f.periodEarned : f.confirmedEarned;
      carryOverBalance = f.carryOverBalance || 0;
      totalEarned = f.confirmedEarned;
      pendingEarned = f.pendingEarned || 0;
      advanceOnly = f.advanceTaken || 0;
      paidOnly = f.paidAmount || 0;
      advance = f.totalPaid;
      available = f.netBalance;
      ordersCount = f.breakdown ? f.breakdown.length : 0;

      if (emp.payModel === 'by_album_type' || !emp.payModel) {
        payDesc = 'Model boʻyicha (katalogdan)';
        tariffLabel = 'Albom modeli boʻyicha (Katalog narxlarida)';
      } else if (emp.payModel === 'fixed_per_album') {
        const r = emp.payRate || 25000;
        payDesc = `${Store.formatMoney(r)} / albom`;
        tariffLabel = `Dona boshiga: ${Store.formatMoney(r)}`;
      } else if (emp.payModel === 'salary') {
        const r = emp.payRate || 5500000;
        payDesc = `${Store.formatMoney(r)} / oy (Oylik)`;
        tariffLabel = `Qatʼiy oylik: ${Store.formatMoney(r)}`;
      }

      const confirmedCount = (f.breakdown || []).filter(b => b.isUnlocked).length;
      const totalAlbums = (f.breakdown || []).filter(b => b.isUnlocked).reduce((sum, b) => sum + (b.albums || 0), 0);
      if (emp.payModel === 'salary') {
        const r = emp.payRate || 5500000;
        formatSalariedLabels(r, f, ` (${ordersCount} ta guruh)`);
      } else {
        workSummaryText = `${periodLabel}: ${confirmedCount} ta tayyor guruh (${totalAlbums} dona albom yasalgan)`;
      }

      breakdown = (f.breakdown || []).map(b => ({
        id: b.id,
        group: b.group,
        region: b.region,
        calcText: `${b.albumType || 'Albom'}: ${b.albums} dona × ${Store.formatMoney(b.rate)}`,
        amount: b.amount,
        isConfirmed: b.isUnlocked,
        statusText: b.isUnlocked ? 'Tayyor + 50% tasdiqlangan' : (b.isCompleted ? 'Tayyor (50% kutilmoqda)' : 'Yigʻilmoqda')
      }));
    }

    return {
      periodLabel,
      periodEarned,
      carryOverBalance,
      totalEarned,
      pendingEarned,
      advanceOnly,
      paidOnly,
      advance,
      available,
      roleTitle,
      payDesc,
      tariffLabel,
      workSummaryText,
      ordersCount,
      isProrated,
      workedDays,
      totalDays,
      dailyRate,
      startDay,
      startDateIso,
      baseMonthlySalary,
      notStartedYet,
      breakdown,
      logs
    };
  },

  // 2.0 XODIM DETAL HISOB-KITOB OYNASI (SHAFFOF OYLIK VA DAROMAD TAHLILI + SHU YERDA TO'LOV)
  openPayrollDetailModal: (userId, initialPayType = null) => {
    const emp = store.users.find(u => u.id === userId);
    if (!emp) return;

    const s = AccountantView.getEmployeePayrollSummary(emp);
    const activeRegions = store.getRegions();
    const currentRegion = (emp.region && emp.region !== 'all')
      ? emp.region
      : (AccountantView.selectedRegion || 'all');
    const selectedSeason = store.getSelectedSeason();

    const bodyHtml = `
      <div class="space-y-4">
        <!-- 1. Xodim Profil Karta -->
        <div class="p-3.5 bg-[#F5F5F7] rounded-2xl border border-black/[0.04] flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <img src="${emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}" class="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0" />
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h4 class="font-extrabold text-sm text-[#1D1D1F] truncate">${emp.name}</h4>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#d64138]">
                  ${s.roleTitle}
                </span>
              </div>
              <div class="text-[11px] text-[#86868B] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>${emp.phone || 'Tel koʻrsatilmagan'}</span>
                <span>&bull;</span>
                <span class="font-semibold text-slate-600">${emp.region && emp.region !== 'all' ? emp.region : 'Umumiy xodim'}</span>
              </div>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[10px] uppercase font-bold text-[#86868B] block">Oy va yil</span>
            <span class="text-[11px] font-extrabold text-[#1D1D1F]">${s.periodLabel || (selectedSeason ? selectedSeason.name : '')}</span>
          </div>
        </div>

        <!-- 2. To'liq Shaffof Hisob-kitob Qatorlari -->
        <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div class="text-[11px] font-extrabold uppercase tracking-wider text-[#86868B] border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>Oylik va daromad hisob-kitobi</span>
            ${emp.role !== 'ceo' ? `
              <button 
                type="button"
                onclick="AccountantView.openCompensationModal('${emp.id}')" 
                class="text-[#d64138] hover:underline font-bold text-[11px] flex items-center gap-1"
              >
                ${Icons.settings('w-3 h-3')}
                <span>Tarifni oʻzgartirish</span>
              </button>
            ` : ''}
          </div>

          <!-- Qator 1: Belgilangan tarif / Oylik turi -->
          <div class="flex items-start justify-between gap-2 py-1 border-b border-slate-100/80">
            <div>
              <div class="text-xs font-bold text-slate-700">Belgilangan tarif / Oylik turi</div>
              <div class="text-[11px] text-[#86868B]">Asosiy hisoblash mezoni</div>
            </div>
            <div class="text-right">
              <span class="inline-block px-2.5 py-1 rounded-xl bg-blue-50 text-[#d64138] font-extrabold text-xs border border-blue-100">
                ${s.tariffLabel}
              </span>
            </div>
          </div>

          <!-- Qator 2: Jami ishlangan summa (shu oy + oldingi oydan qoldiq) -->
          <div class="py-1 border-b border-slate-100/80 space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="text-xs font-bold text-slate-700">Jami ishlangan summa</div>
                <div class="text-[11px] text-[#86868B]">${s.workSummaryText}</div>
                ${s.pendingEarned > 0 ? `
                  <div class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1 border border-amber-200/60">
                    Jarayondagi (50% toʻlov kutilayotgan): +${Store.formatMoney(s.pendingEarned)}
                  </div>
                ` : ''}
              </div>
              <div class="text-right font-extrabold text-sm text-[#1D1D1F] shrink-0">
                ${Store.formatMoney(s.totalEarned)}
              </div>
            </div>

            ${s.isProrated ? `
              <div class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 space-y-1 text-[11px]">
                <div class="flex items-center justify-between text-slate-600">
                  <span>30 kunlik toʻliq oylik stavka:</span>
                  <span class="font-bold text-slate-900">${Store.formatMoney(s.baseMonthlySalary)} (1 kun = ${Store.formatMoney(s.dailyRate)})</span>
                </div>
                <div class="flex items-center justify-between text-amber-800">
                  <span>${s.startDay}-sanadan oy yakunigacha (${s.workedDays} kun):</span>
                  <span class="font-extrabold">${s.workedDays} kun × ${Store.formatMoney(s.dailyRate)} = ${Store.formatMoney(s.periodEarned)}</span>
                </div>
              </div>
            ` : ''}

            ${s.carryOverBalance !== 0 ? `
              <div class="pl-3 border-l-2 border-blue-200 space-y-1 text-[11px]">
                <div class="flex items-center justify-between text-slate-600">
                  <span>Joriy oy hisobi (${s.periodLabel}):</span>
                  <span class="font-bold text-slate-900">${Store.formatMoney(s.periodEarned)}</span>
                </div>
                <div class="flex items-center justify-between ${s.carryOverBalance > 0 ? 'text-[#d64138]' : 'text-rose-600'}">
                  <span>Oldingi oydan qoldiq (Qoʻshib beriladigan pul):</span>
                  <span class="font-extrabold">${s.carryOverBalance > 0 ? '+' : ''}${Store.formatMoney(s.carryOverBalance)}</span>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Qator 3: Ayirmalar (Minuslar) -->
          <div class="py-1 border-b border-slate-100/80 space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="text-xs font-bold text-slate-700">Ayirmalar (Minuslar)</div>
                <div class="text-[11px] text-[#86868B]">Berilgan avanslar va toʻlab berilgan summalar</div>
              </div>
              <div class="text-right font-extrabold text-sm text-[#FF3B30] shrink-0">
                -${Store.formatMoney(s.advance)}
              </div>
            </div>

            ${s.advance > 0 ? `
              <div class="pl-3 border-l-2 border-rose-200 space-y-1 text-[11px]">
                ${s.advanceOnly > 0 ? `
                  <div class="flex items-center justify-between text-rose-600">
                    <span>Olingan avanslar:</span>
                    <span class="font-bold">-${Store.formatMoney(s.advanceOnly)}</span>
                  </div>
                ` : ''}
                ${s.paidOnly > 0 ? `
                  <div class="flex items-center justify-between text-rose-600">
                    <span>Avval toʻlangan ish haqi / komissiya:</span>
                    <span class="font-bold">-${Store.formatMoney(s.paidOnly)}</span>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <!-- Qator 4: Yakuniy to'lanadigan qoldiq (Available) -->
          <div class="p-3.5 rounded-2xl ${s.available < 0 ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50/90 border border-emerald-200'} flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-extrabold ${s.available < 0 ? 'text-rose-900' : 'text-emerald-950'}">
                Yakuniy toʻlanadigan qoldiq (Available)
              </div>
              <div class="text-[11px] font-medium ${s.available < 0 ? 'text-rose-700' : 'text-emerald-700'} mt-0.5">
                ${Store.formatMoney(s.totalEarned)} − ${Store.formatMoney(s.advance)}
              </div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-lg sm:text-xl font-extrabold ${s.available < 0 ? 'text-[#FF3B30]' : 'text-[#34C759]'}">
                ${Store.formatMoney(s.available)}
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider ${s.available < 0 ? 'text-rose-600' : 'text-[#d64138]'}">
                ${s.available < 0 ? 'Ortiqcha avans (Qarz)' : 'Toʻlashga tayyor'}
              </span>
            </div>
          </div>
        </div>

        <!-- 3. Guruhlar kesimida hisob-kitob tafsiloti (Agar mavjud bo'lsa) -->
        ${s.breakdown && s.breakdown.length > 0 ? `
          <div class="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-2">
            <div class="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#86868B]">
              <span>Guruhlar kesimida hisoblangan (${s.breakdown.length} ta)</span>
              <span>Ulush / Haq</span>
            </div>
            <div class="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              ${s.breakdown.map(b => `
                <div class="p-2.5 rounded-xl bg-white border border-black/[0.04] flex items-center justify-between gap-2 text-xs">
                  <div class="min-w-0">
                    <div class="font-bold text-[#1D1D1F] truncate">${b.id} &bull; ${b.group}</div>
                    <div class="text-[11px] text-[#86868B] truncate">${b.calcText}</div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="font-extrabold ${b.isConfirmed ? 'text-emerald-700' : 'text-amber-600'}">
                      ${b.amount > 0 ? `+${Store.formatMoney(b.amount)}` : 'Oylik ichida'}
                    </div>
                    <div class="text-[9px] font-bold ${b.isConfirmed ? 'text-emerald-600' : 'text-amber-600'}">
                      ${b.statusText}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 4. Berilgan avans va to'lovlar tarixi (Minuslar ro'yxati) -->
        ${s.logs && s.logs.length > 0 ? `
          <div class="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2">
            <div class="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-rose-800">
              <span>Berilgan avans va toʻlovlar tarixi (${s.logs.length} ta)</span>
              <span>Minus summa</span>
            </div>
            <div class="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              ${s.logs.map(log => `
                <div class="p-2.5 rounded-xl bg-white border border-rose-100/80 flex items-center justify-between gap-2 text-xs">
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold ${log.type === 'advance' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
                        ${log.type === 'advance' ? 'Avans' : (log.type === 'commission' ? 'Komissiya' : 'Oylik toʻlov')}
                      </span>
                      <span class="text-[11px] font-semibold text-slate-500">${log.date || ''}</span>
                    </div>
                    ${log.note ? `<div class="text-[11px] text-slate-600 mt-0.5 truncate">${log.note}</div>` : ''}
                  </div>
                  <div class="text-right font-extrabold text-[#FF3B30] shrink-0">
                    -${Store.formatMoney(log.amount)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 5. To'lov amallari shu yerning o'zida (Pul berish va Avans yozish) -->
        ${emp.role === 'ceo' ? `
          <div class="pt-2 border-t border-slate-100">
            <button 
              type="button"
              onclick="AccountantView.openCeoPayoutModal('${emp.id}')" 
              class="w-full payno-pill-btn bg-[#d64138] hover:bg-[#bd352d] text-white py-3.5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              ${Icons.wallet('w-4 h-4')}
              <span>Dividend / Foyda yechish</span>
            </button>
          </div>
        ` : `
          <div class="pt-2 border-t border-slate-100 space-y-3">
            <!-- Asosiy 2 ta tugma: Pul berish (To'lash) va Avans yozish -->
            <div class="grid grid-cols-2 gap-2.5">
              <button 
                type="button"
                id="btn-mode-salary"
                onclick="AccountantView.toggleDetailInlinePay('salary', ${s.available > 0 ? s.available : 0}, '${emp.role}')" 
                class="payno-pill-btn payno-btn-success py-3.5 text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5"
              >
                ${Icons.checkCircle('w-4 h-4')}
                <span>Pul berish (Toʻlash)</span>
              </button>
              <button 
                type="button"
                id="btn-mode-advance"
                onclick="AccountantView.toggleDetailInlinePay('advance', 500000, '${emp.role}')" 
                class="payno-pill-btn payno-btn-primary py-3.5 text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5"
              >
                ${Icons.wallet('w-4 h-4')}
                <span>Avans yozish</span>
              </button>
            </div>

            <!-- Shu oynaning o'zida ochiladigan tezkor To'lov / Avans formasi -->
            <form 
              id="detail-inline-pay-form" 
              onsubmit="AccountantView.handleDetailInlinePaySubmit(event, '${emp.id}')" 
              class="${initialPayType ? '' : 'hidden'} p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 transition-all"
            >
              <div class="flex items-center justify-between">
                <span id="detail-pay-form-title" class="text-xs font-extrabold text-[#1D1D1F]">
                  ${initialPayType === 'advance' ? 'Avans yozish (Keyinchalik oylikdan ayiriladi)' : 'Pul berish (Ish haqi / Toʻliq hisob-kitob)'}
                </span>
                <span id="detail-pay-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${initialPayType === 'advance' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}">
                  ${initialPayType === 'advance' ? 'Avans' : 'Oylik / Ulush'}
                </span>
              </div>

              <input type="hidden" id="detail-pay-type" value="${initialPayType === 'advance' ? 'advance' : (emp.role === 'seller' ? 'commission' : 'salary')}" />

              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Summa (soʻm) <span class="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  inputmode="numeric" 
                  id="detail-pay-amount" 
                  required 
                  value="${Store.formatNumber(initialPayType === 'advance' ? 500000 : (s.available > 0 ? s.available : 500000))}" 
                  placeholder="Masalan: 1 500 000" 
                  oninput="App.formatMoneyInput(this)" 
                  class="payno-input font-extrabold text-slate-900 bg-white" 
                />
                <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
                  ${s.available > 0 ? `
                    <button type="button" onclick="AccountantView.setDetailQuickAmount(${s.available})" class="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-extrabold transition-colors">
                      Qoldiq: ${Store.formatMoney(s.available)}
                    </button>
                  ` : ''}
                  <button type="button" onclick="AccountantView.setDetailQuickAmount(500000)" class="px-2 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[10px] font-bold transition-colors">
                    500 000
                  </button>
                  <button type="button" onclick="AccountantView.setDetailQuickAmount(1000000)" class="px-2 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[10px] font-bold transition-colors">
                    1 000 000
                  </button>
                  <button type="button" onclick="AccountantView.setDetailQuickAmount(2000000)" class="px-2 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[10px] font-bold transition-colors">
                    2 000 000
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">Viloyat hisobi</label>
                  <select id="detail-pay-region" class="payno-input bg-white text-xs font-bold text-slate-900 py-2.5">
                    <option value="all" ${currentRegion === 'all' ? 'selected' : ''}>Umumiy kompaniya</option>
                    ${activeRegions.map(r => `
                      <option value="${r}" ${currentRegion === r ? 'selected' : ''}>${r}</option>
                    `).join('')}
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">Izoh (ixtiyoriy)</label>
                  <input type="text" id="detail-pay-note" placeholder="Naqd / Karta orqali..." class="payno-input bg-white text-xs py-2.5" />
                </div>
              </div>

              <button 
                type="submit" 
                id="detail-pay-submit-btn"
                class="w-full payno-pill-btn ${initialPayType === 'advance' ? 'payno-btn-primary' : 'payno-btn-success'} py-3 text-xs font-extrabold shadow-md"
              >
                ${initialPayType === 'advance' ? 'Avansni tasdiqlash va yozish' : 'Toʻlovni tasdiqlash va yopish'}
              </button>
            </form>
          </div>
        `}
      </div>
    `;

    App.openModal("Xodim detal hisob-kitobi", bodyHtml);
  },

  toggleDetailInlinePay: (mode, defaultAmount, role = 'worker') => {
    const form = document.getElementById('detail-inline-pay-form');
    const titleEl = document.getElementById('detail-pay-form-title');
    const badgeEl = document.getElementById('detail-pay-badge');
    const typeInput = document.getElementById('detail-pay-type');
    const amountInput = document.getElementById('detail-pay-amount');
    const submitBtn = document.getElementById('detail-pay-submit-btn');

    if (!form) return;
    form.classList.remove('hidden');

    if (mode === 'advance') {
      if (titleEl) titleEl.innerText = 'Avans yozish (Keyinchalik oylikdan ayiriladi)';
      if (badgeEl) {
        badgeEl.innerText = 'Avans';
        badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900';
      }
      if (typeInput) typeInput.value = 'advance';
      if (amountInput) amountInput.value = Store.formatNumber(defaultAmount > 0 ? defaultAmount : 500000);
      if (submitBtn) {
        submitBtn.innerText = 'Avansni tasdiqlash va yozish';
        submitBtn.className = 'w-full payno-pill-btn payno-btn-primary py-3 text-xs font-extrabold shadow-md';
      }
    } else {
      if (titleEl) titleEl.innerText = 'Pul berish (Ish haqi / Toʻliq hisob-kitob)';
      if (badgeEl) {
        badgeEl.innerText = 'Oylik / Ulush';
        badgeEl.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900';
      }
      if (typeInput) typeInput.value = role === 'seller' ? 'commission' : 'salary';
      if (amountInput) amountInput.value = Store.formatNumber(defaultAmount > 0 ? defaultAmount : 500000);
      if (submitBtn) {
        submitBtn.innerText = 'Toʻlovni tasdiqlash va yopish';
        submitBtn.className = 'w-full payno-pill-btn payno-btn-success py-3 text-xs font-extrabold shadow-md';
      }
    }

    if (amountInput) {
      amountInput.focus();
      try { form.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
    }
  },

  setDetailQuickAmount: (amount) => {
    const amountInput = document.getElementById('detail-pay-amount');
    if (amountInput) {
      amountInput.value = Store.formatNumber(amount);
    }
  },

  handleDetailInlinePaySubmit: (e, userId) => {
    e.preventDefault();
    const amount = Store.parseMoney(document.getElementById('detail-pay-amount').value);
    const type = document.getElementById('detail-pay-type').value;
    const region = document.getElementById('detail-pay-region')?.value || AccountantView.selectedRegion || 'all';
    const note = document.getElementById('detail-pay-note').value.trim();

    if (!amount || amount <= 0) {
      alert("Iltimos, toʻlov summasini toʻgʻri kiriting!");
      return;
    }

    const success = store.payEmployee(userId, amount, type, note, region);
    if (success) {
      App.closeModal();
      App.showToast(type === 'advance' ? "Avans muvaffaqiyatli yozildi!" : "Toʻlov muvaffaqiyatli amalga oshirildi!");
      App.render();
    }
  },

  openCompensationModal: (userId) => {
    const emp = store.users.find(u => u.id === userId);
    if (!emp) return;

    let modelOptions = '';
    let defaultRate = emp.payRate || '';
    let rateLabel = 'Stavka miqdori';
    let isRateDisabled = false;
    const currentModel = emp.payModel || (emp.role === 'seller' ? 'percent' : emp.role === 'editor' ? 'per_student' : emp.role === 'maker' ? 'by_album_type' : 'salary');
    const startInfo = store.getEmployeeStartDateInfo(emp);
    const defaultStartDate = startInfo.startDateIso || store.getTodayIsoDate();

    if (emp.role === 'seller') {
      modelOptions = `
        <option value="percent" ${currentModel === 'percent' ? 'selected' : ''}>Sotuv foizi (%) — masalan: 10%</option>
        <option value="per_student" ${currentModel === 'per_student' ? 'selected' : ''}>Har bir talaba uchun qatʼiy summa (soʻm)</option>
        <option value="per_group" ${currentModel === 'per_group' ? 'selected' : ''}>Har bir guruh uchun qatʼiy summa (soʻm)</option>
      `;
      rateLabel = currentModel === 'percent' ? 'Komissiya foizi (%)' : 'Summa (soʻm)';
    } else if (emp.role === 'photographer') {
      modelOptions = `
        <option value="salary" ${currentModel === 'salary' ? 'selected' : ''}>Oylik qatʼiy maosh (soʻm / 30 kun)</option>
        <option value="per_group" ${currentModel === 'per_group' ? 'selected' : ''}>Har bir suratga olingan guruh uchun (soʻm)</option>
        <option value="per_student" ${currentModel === 'per_student' ? 'selected' : ''}>Har bir suratga tushgan talaba uchun (soʻm)</option>
      `;
      rateLabel = 'Oylik yoki stavka miqdori (soʻm)';
    } else if (emp.role === 'editor') {
      modelOptions = `
        <option value="per_student" ${currentModel === 'per_student' ? 'selected' : ''}>Har bir talaba dizayni uchun (soʻm)</option>
        <option value="per_group" ${currentModel === 'per_group' ? 'selected' : ''}>Har bir guruh montaji uchun (soʻm)</option>
        <option value="salary" ${currentModel === 'salary' ? 'selected' : ''}>Oylik qatʼiy maosh (soʻm / 30 kun)</option>
      `;
      rateLabel = 'Stavka yoki oylik (soʻm)';
    } else if (emp.role === 'maker') {
      modelOptions = `
        <option value="by_album_type" ${currentModel === 'by_album_type' ? 'selected' : ''}>Har bir albom modeli boʻyicha katalogdan (Dinamik)</option>
        <option value="fixed_per_album" ${currentModel === 'fixed_per_album' ? 'selected' : ''}>Barcha albomlar uchun bir xil stavka (soʻm / dona)</option>
        <option value="salary" ${currentModel === 'salary' ? 'selected' : ''}>Oylik qatʼiy maosh (soʻm / 30 kun)</option>
      `;
      rateLabel = 'Stavka yoki oylik (soʻm)';
      if (currentModel === 'by_album_type') isRateDisabled = true;
    }

    const bodyHtml = `
      <form id="comp-form" onsubmit="AccountantView.handleCompensationSubmit(event, '${emp.id}')" class="space-y-4">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
          <img src="${emp.avatar}" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <h4 class="font-extrabold text-sm text-slate-900">${emp.name}</h4>
            <span class="text-xs text-slate-400 capitalize">${emp.role}</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Ish haqi hisoblash modeli <span class="text-rose-500">*</span></label>
          <select 
            id="comp-model" 
            onchange="AccountantView.handleCompModelChange(this.value, '${emp.role}')" 
            class="payno-input text-xs font-bold text-slate-900"
          >
            ${modelOptions}
          </select>
        </div>

        <div id="comp-rate-wrapper" class="${isRateDisabled ? 'opacity-50 pointer-events-none' : ''}">
          <label id="comp-rate-label" class="block text-xs font-bold text-slate-700 mb-1">${rateLabel} <span class="text-rose-500">*</span></label>
          <input 
            type="text" 
            inputmode="numeric"
            id="comp-rate" 
            required 
            value="${Store.formatNumber(defaultRate)}" 
            oninput="App.formatMoneyInput(this); AccountantView.updateCompProratePreview();"
            class="payno-input font-bold" 
            placeholder="Qiymat kiriting"
          />
          <span id="comp-rate-hint" class="text-[11px] text-slate-400 mt-1 block">
            ${isRateDisabled ? 'Tarif albom turlari katalogidagi har bir model stavkasi boʻyicha avtomatik olinadi.' : 'Ushbu xodimning barcha daromadlari shu stavka asosida hisoblanadi.'}
          </span>
        </div>

        <!-- Oylikka (Stavka / salary) ishlovchilar uchun Ishga kirgan sana va 30 kunlik kunbay hisob -->
        <div id="comp-salary-date-wrapper" class="${currentModel === 'salary' ? '' : 'hidden'} space-y-2.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Ishga kirgan sanasi (1-oylik kunbay hisob uchun) <span class="text-rose-500">*</span>
            </label>
            <input 
              type="date" 
              id="comp-start-date" 
              value="${defaultStartDate}" 
              oninput="AccountantView.updateCompProratePreview()"
              onchange="AccountantView.updateCompProratePreview()"
              class="payno-input text-xs font-bold text-slate-900"
            />
            <span class="text-[10px] text-slate-400 mt-1 block">
              Umumiy oylik 30 kunga belgilanadi. Xodim oyning qaysi sanasida ishga kirsa, oy oxirigacha qolgan kunlari hisoblanadi.
            </span>
          </div>

          <div id="comp-prorate-preview" class="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs space-y-1"></div>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Tarifni saqlash
          </button>
        </div>
      </form>
    `;

    App.openModal("Individual ish haqi tarifini sozlash", bodyHtml);
    setTimeout(() => AccountantView.updateCompProratePreview(), 10);
  },

  updateCompProratePreview: () => {
    const modelEl = document.getElementById('comp-model');
    const rateEl = document.getElementById('comp-rate');
    const dateEl = document.getElementById('comp-start-date');
    const previewEl = document.getElementById('comp-prorate-preview');
    const dateWrapper = document.getElementById('comp-salary-date-wrapper');

    if (!modelEl || !previewEl || !dateWrapper) return;
    if (modelEl.value !== 'salary') {
      dateWrapper.classList.add('hidden');
      return;
    }
    dateWrapper.classList.remove('hidden');

    const baseRate = Store.parseMoney(rateEl ? rateEl.value : 0);
    const dateVal = (dateEl && dateEl.value) ? dateEl.value : store.getTodayIsoDate();
    const parts = dateVal.split('-');
    const startDay = parts.length === 3 ? parseInt(parts[2], 10) : 1;
    const monthKey = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : store.getCurrentMonthKey();

    const isProrated = startDay > 1;
    const workedDays = isProrated ? Math.max(1, 30 - startDay) : 30;
    const dailyRate = Math.round(baseRate / 30);
    const firstMonthSalary = isProrated ? Math.round((baseRate / 30) * workedDays) : baseRate;

    previewEl.innerHTML = `
      <div class="flex items-center justify-between text-slate-600">
        <span>30 kunlik oylik stavka:</span>
        <strong class="text-slate-900">${Store.formatMoney(baseRate)} (${Store.formatMoney(dailyRate)} / kun)</strong>
      </div>
      <div class="flex items-center justify-between text-slate-600">
        <span>${store.getPeriodLabel(monthKey)}dagi ish kunlari:</span>
        <strong class="text-blue-700">${isProrated ? `${startDay}-sanadan oy yakunigacha: ${workedDays} kun` : 'Toʻliq oy (30 kun)'}</strong>
      </div>
      <div class="flex items-center justify-between pt-1.5 border-t border-blue-200/70">
        <span class="font-bold text-slate-800">1-oy uchun hisoblangan maosh:</span>
        <strong class="text-sm font-extrabold text-emerald-700">${Store.formatMoney(firstMonthSalary)}</strong>
      </div>
    `;
  },

  handleCompModelChange: (model, role) => {
    const rateWrapper = document.getElementById('comp-rate-wrapper');
    const rateInput = document.getElementById('comp-rate');
    const rateLabel = document.getElementById('comp-rate-label');
    const rateHint = document.getElementById('comp-rate-hint');
    const dateWrapper = document.getElementById('comp-salary-date-wrapper');

    if (dateWrapper) {
      if (model === 'salary') dateWrapper.classList.remove('hidden');
      else dateWrapper.classList.add('hidden');
    }

    if (role === 'maker' && model === 'by_album_type') {
      rateWrapper.classList.add('opacity-50', 'pointer-events-none');
      rateHint.innerText = 'Tarif albom turlari katalogidagi har bir model stavkasi boʻyicha avtomatik olinadi.';
      rateInput.value = '25000';
    } else {
      rateWrapper.classList.remove('opacity-50', 'pointer-events-none');
      if (model === 'percent') {
        rateLabel.innerText = 'Komissiya foizi (%)';
        rateHint.innerText = 'Masalan: 5, 7, 10 (%)';
        rateInput.placeholder = '10';
      } else if (model === 'salary') {
        rateLabel.innerText = '30 kunlik oylik maosh miqdori (soʻm)';
        rateHint.innerText = 'Oylik 30 kunga belgilanadi. Xodim oyning oʻrtasida kirsa, qolgan kunlarga proporsional hisoblanadi.';
        rateInput.placeholder = '6 000 000';
      } else {
        rateLabel.innerText = 'Stavka miqdori (soʻm)';
        rateHint.innerText = 'Ushbu xodimning barcha daromadlari shu stavka asosida hisoblanadi.';
        rateInput.placeholder = '15 000';
      }
    }
    AccountantView.updateCompProratePreview();
  },

  handleCompensationSubmit: (e, userId) => {
    e.preventDefault();
    const model = document.getElementById('comp-model').value;
    const rate = Store.parseMoney(document.getElementById('comp-rate').value);
    const startDate = document.getElementById('comp-start-date')?.value || undefined;

    store.updateEmployeeCompensation(userId, { payModel: model, payRate: rate, startDate });
    App.closeModal();
    App.showToast("Xodimning individual tarifi muvaffaqiyatli saqlandi!");
    App.render();
  },

  handleSeasonChange: (seasonId) => {
    store.setSelectedSeason(seasonId);
    App.render();
  },

  openArchivedSeasonsModal: () => {
    const periods = store.getMonthlyPeriodsList();
    const activePeriodId = store.normalizePeriodId(store.selectedSeasonId);

    const bodyHtml = `
      <div class="space-y-4">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <h4 class="text-sm font-bold text-slate-900 mb-1">Yillik va oylik moliyaviy hisobotlar</h4>
          <p class="text-xs text-slate-500">Istalgan oyni yoki yilni tanlab, oʻsha davrdagi toʻliq moliya va statistika tarixini ochishingiz mumkin</p>
        </div>

        <div class="space-y-3 max-h-[65vh] overflow-y-auto no-scrollbar pr-1">
          ${periods.map(p => {
            const sum = store.getSeasonSummary(p.id);
            const isSelected = p.id === activePeriodId;
            return `
              <div 
                onclick="AccountantView.handleSeasonChange('${p.id}'); App.closeModal();"
                class="p-4 rounded-2xl bg-white border ${isSelected ? 'border-[#d64138] ring-2 ring-[#d64138]/20' : 'border-slate-200/80 hover:border-slate-300'} shadow-2xs cursor-pointer transition-all"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold text-sm text-slate-900">${p.name}</span>
                    ${p.isYearSummary ? `
                      <span class="px-2 py-0.5 rounded-full bg-blue-100 text-[#d64138] text-[10px] font-extrabold">Yillik jami</span>
                    ` : ''}
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full ${p.isCurrent ? 'bg-emerald-100 text-emerald-800' : (isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700')} text-[10px] font-bold">
                    ${p.isCurrent ? 'Joriy oy' : (isSelected ? 'Tanlangan' : 'Koʻrish &rarr;')}
                  </span>
                </div>
                <div class="text-xs text-slate-400 mb-3">
                  ${p.subtitle || ''}
                </div>

                <div class="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Buyurtmalar</span>
                    <span class="font-extrabold text-slate-800">${sum.totalOrders} ta</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Tushum</span>
                    <span class="font-extrabold text-emerald-700">${Store.formatMoney(sum.totalRevenue)}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Sof foyda</span>
                    <span class="font-extrabold ${sum.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}">${Store.formatMoney(sum.netProfit)}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    App.openModal("Oylar va yillik hisobotlar", bodyHtml);
  },

  openPayModal: (userId, userName, roleTitle, availableAmount, region = 'all') => {
    const activeRegions = store.getRegions();
    const targetUser = store.users.find(u => u.id === userId);
    const currentRegion = (targetUser && targetUser.region && targetUser.region !== 'all') 
      ? targetUser.region 
      : (region || AccountantView.selectedRegion || 'all');

    const bodyHtml = `
      <form id="payroll-form" onsubmit="AccountantView.handlePayrollSubmit(event, '${userId}')" class="space-y-4">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div class="text-slate-500">Xodim: <strong class="text-slate-900">${userName} (${roleTitle})</strong></div>
          <div class="mt-1 ${availableAmount < 0 ? 'text-rose-600' : 'text-emerald-700'} font-bold">
            ${availableAmount < 0 ? 'Hozirgi qarz balansi (minusda):' : 'Hozir toʻlashga tayyor qoldiq:'} ${Store.formatMoney(availableAmount)}
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Toʻlanayotgan summa (soʻm) <span class="text-rose-500">*</span></label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="pay-amount" 
            required 
            value="${Store.formatNumber(availableAmount > 0 ? availableAmount : 500000)}" 
            placeholder="Masalan: 1 500 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Qaysi viloyat hisobidan? <span class="text-rose-500">*</span></label>
          <select id="pay-region" class="payno-input bg-slate-50 font-bold text-slate-900 cursor-pointer">
            <option value="all" ${currentRegion === 'all' ? 'selected' : ''}>Barcha viloyatlar uchun (Umumiy kompaniya)</option>
            ${activeRegions.map(r => `
              <option value="${r}" ${currentRegion === r ? 'selected' : ''}>${r} viloyati</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Toʻlov turi</label>
          <select id="pay-type" class="payno-input bg-slate-50 font-bold">
            <option value="salary" selected>Ish haqi / Toʻliq toʻlov</option>
            <option value="advance">Avans berish</option>
            <option value="commission">Komissiya toʻlovi</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Izoh (ixtiyoriy)</label>
          <input type="text" id="pay-note" placeholder="Masalan: Karta orqali oʻtkazildi" class="payno-input" />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-success py-3.5 text-xs font-bold shadow-md">
            Toʻlovni amalga oshirish
          </button>
        </div>
      </form>
    `;

    App.openModal("Xodimga toʻlov qilish", bodyHtml);
  },

  handlePayrollSubmit: (e, userId) => {
    e.preventDefault();
    const amount = Store.parseMoney(document.getElementById('pay-amount').value);
    const type = document.getElementById('pay-type').value;
    const region = document.getElementById('pay-region')?.value || AccountantView.selectedRegion || 'all';
    const note = document.getElementById('pay-note').value.trim();

    const success = store.payEmployee(userId, amount, type, note, region);
    if (success) {
      App.closeModal();
      App.showToast("Toʻlov muvaffaqiyatli amalga oshirildi!");
      App.render();
    }
  },

  // 2.1 Rahbarga pul chiqarish (Dividend) Modali
  openCeoPayoutModal: (ceoId) => {
    const ceo = store.users.find(u => u.id === ceoId) || store.users.find(u => u.role === 'ceo');
    if (!ceo) return;

    const regions = store.getRegions ? store.getRegions() : ['Toshkent shahri', 'Samarqand'];

    const bodyHtml = `
      <form id="ceo-payout-form" onsubmit="AccountantView.handleCeoPayoutSubmit(event, '${ceo.id}')" class="space-y-4">
        <div class="p-3.5 bg-[#F5F5F7] rounded-2xl border border-black/[0.04] flex items-center gap-3">
          <img src="${ceo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}" class="w-11 h-11 rounded-full object-cover border border-black/10" />
          <div>
            <h4 class="font-bold text-sm text-[#1D1D1F]">${ceo.name}</h4>
            <span class="text-xs text-[#d64138] font-bold">Kompaniya Rahbari (CEO)</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1">Chiqarilayotgan summa (soʻm) *</label>
          <div class="relative flex items-center">
            <span class="absolute left-4 text-[#86868B] font-bold text-xs">UZS</span>
            <input 
              type="text" 
              inputmode="numeric" 
              name="amount" 
              required 
              placeholder="Masalan: 5 000 000" 
              oninput="App.formatMoneyInput(this)" 
              class="payno-input pl-14 pr-4 font-bold text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1">Toʻlov izohi / Maqsadi *</label>
          <input 
            type="text" 
            name="comment" 
            required 
            placeholder="Masalan: Noyabr 2026 dividendi yoki taʼsischiga avans" 
            class="payno-input text-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1">Qaysi kassa / viloyat hisobidan:</label>
          <select name="region" class="payno-input text-xs bg-white font-semibold">
            <option value="all">Barcha viloyatlar uchun (Umumiy kassa)</option>
            ${regions.map(r => `
              <option value="${r}" ${AccountantView.selectedRegion === r ? 'selected' : ''}>${r} viloyati</option>
            `).join('')}
          </select>
        </div>

        <div class="pt-2 space-y-2">
          <button 
            type="submit" 
            class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-xs active:scale-[0.98]"
          >
            Rahbarga pul chiqarishni tasdiqlash
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

    App.openModal("Rahbarga pul chiqarish (Dividend)", bodyHtml);
  },

  handleCeoPayoutSubmit: (e, ceoId) => {
    e.preventDefault();
    const form = e.target;
    const amount = Store.parseMoney(form.amount.value);
    const comment = form.comment.value.trim();
    const region = form.region.value;
    const ceo = store.users.find(u => u.id === ceoId);

    if (!amount || amount <= 0) {
      alert("Iltimos, toʻgʻri summa kiriting!");
      return;
    }

    const res = store.addCeoPayout({
      ceoId,
      ceoName: ceo ? ceo.name : 'Rahbar (CEO)',
      amount,
      comment,
      region
    });

    if (res && res.success) {
      App.closeModal();
      App.showToast(`Rahbarga ${Store.formatMoney(amount)} muvaffaqiyatli chiqarildi!`);
      App.render();
    } else {
      alert((res && res.message) || "Xatolik yuz berdi!");
    }
  },

  cashModalRoleFilter: 'all',

  // 2.1 Xodimlardagi naqd pullar va qarzdorliklar modali (Sotuvchilardagi naqd bosilganda)
  openCashInHandDetailsModal: (roleFilter = null) => {
    if (roleFilter !== null) {
      AccountantView.cashModalRoleFilter = roleFilter;
    }
    const currentFilter = AccountantView.cashModalRoleFilter || 'all';
    const isFiltered = AccountantView.selectedRegion !== 'all';
    const activeRegion = AccountantView.selectedRegion;
    const allItems = store.getEmployeesCashInHandList(activeRegion, store.selectedSeasonId);

    const totalCash = allItems.reduce((sum, item) => sum + item.cashInHand, 0);
    const photoItems = allItems.filter(item => item.role === 'photographer');
    const sellerItems = allItems.filter(item => item.role === 'seller');
    const totalPhotoCash = photoItems.reduce((sum, item) => sum + item.cashInHand, 0);
    const totalSellerCash = sellerItems.reduce((sum, item) => sum + item.cashInHand, 0);
    const totalPendingCash = allItems.reduce((sum, item) => sum + (item.pendingAmount || 0), 0);

    const filteredItems = currentFilter === 'all' ? allItems : allItems.filter(item => item.role === currentFilter);

    const bodyHtml = `
      <div class="space-y-5">
        <!-- 1. Yuqori qism: Umumiy summa va Filtr -->
        <div class="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div class="text-[11px] font-bold uppercase text-rose-700 tracking-wider">
              ${isFiltered ? `${activeRegion} — Xodimlardagi naqd pul` : 'Kompaniya xodimlaridagi jami naqd pul'}
            </div>
            <div class="text-2xl font-black text-rose-600 mt-0.5 tracking-tight">
              ${Store.formatMoney(totalCash)}
            </div>
            <p class="text-xs text-rose-600/80 mt-1 font-medium">
              Mijozlardan olingan va hali kassaga topshirilmagan (Buxgalter olishi kerak boʻlgan) pullar
            </p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold ${isFiltered ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-200/80 text-rose-900'}">
            ${isFiltered ? `${activeRegion} filtri faol` : 'Barcha viloyatlar'}
          </span>
        </div>

        <!-- 2. Qisqacha taqsimot kartalari (Fotograf vs Sotuvchi vs Inbox) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div 
            onclick="AccountantView.openCashInHandDetailsModal('photographer')" 
            class="p-3 rounded-2xl border transition-all cursor-pointer ${currentFilter === 'photographer' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30' : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70'}"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-slate-500 font-bold flex items-center gap-1">
                ${Icons.camera('w-3.5 h-3.5 text-amber-600')}
                <span>Fotograflarda:</span>
              </span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">${photoItems.length} ta</span>
            </div>
            <div class="text-base font-extrabold text-amber-800">${Store.formatMoney(totalPhotoCash)}</div>
          </div>

          <div 
            onclick="AccountantView.openCashInHandDetailsModal('seller')" 
            class="p-3 rounded-2xl border transition-all cursor-pointer ${currentFilter === 'seller' ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/30' : 'bg-slate-50 hover:bg-slate-100 border-slate-200/70'}"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-slate-500 font-bold flex items-center gap-1">
                ${Icons.users('w-3.5 h-3.5 text-blue-600')}
                <span>Sotuvchilarda:</span>
              </span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">${sellerItems.length} ta</span>
            </div>
            <div class="text-base font-extrabold text-blue-800">${Store.formatMoney(totalSellerCash)}</div>
          </div>

          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-slate-500 font-bold flex items-center gap-1">
                ${Icons.clock('w-3.5 h-3.5 text-slate-500')}
                <span>Tasdiq kutilmoqda:</span>
              </span>
            </div>
            <div class="text-base font-extrabold text-slate-800">${Store.formatMoney(totalPendingCash)}</div>
          </div>
        </div>

        <!-- 3. Rol Filtr Tugmalari (Barchasi | Fotograflar | Sotuvchilar) -->
        <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button 
            onclick="AccountantView.openCashInHandDetailsModal('all')" 
            class="px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] flex items-center gap-1.5 ${currentFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
          >
            <span>Barchasi</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${currentFilter === 'all' ? 'bg-white/20 text-white' : 'bg-white text-slate-700'}">${allItems.length}</span>
          </button>
          <button 
            onclick="AccountantView.openCashInHandDetailsModal('photographer')" 
            class="px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] flex items-center gap-1.5 ${currentFilter === 'photographer' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'}"
          >
            ${Icons.camera('w-3.5 h-3.5')}
            <span>Fotograflar</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${currentFilter === 'photographer' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'}">${photoItems.length}</span>
          </button>
          <button 
            onclick="AccountantView.openCashInHandDetailsModal('seller')" 
            class="px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] flex items-center gap-1.5 ${currentFilter === 'seller' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60'}"
          >
            ${Icons.users('w-3.5 h-3.5')}
            <span>Sotuvchilar</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${currentFilter === 'seller' ? 'bg-white/20 text-white' : 'bg-blue-200 text-blue-900'}">${sellerItems.length}</span>
          </button>
        </div>

        <!-- 4. Xodimlar va Guruhlar Ro'yxati -->
        ${filteredItems.length === 0 ? `
          <div class="py-12 text-center text-slate-400">
            <div class="w-12 h-12 mx-auto mb-2 text-emerald-500">${Icons.checkCircle('w-12 h-12')}</div>
            <p class="text-sm font-bold text-slate-800">Topshirilishi kerak boʻlgan naqd pul yoʻq</p>
            <p class="text-xs text-slate-400 mt-1">Ushbu roʻyxat boʻyicha barcha yigʻilgan pullar kassaga topshirilgan.</p>
          </div>
        ` : `
          <div class="space-y-3.5 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
            ${filteredItems.map(item => `
              <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-3">
                <!-- Xodim ma'lumoti va Telefon raqami -->
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.role === 'photographer' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-blue-100 text-blue-900 border border-blue-200'}">
                      ${item.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-extrabold text-slate-900 text-sm">${item.userName}</span>
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.role === 'photographer' ? 'bg-amber-50 text-amber-800 border border-amber-200/60' : 'bg-blue-50 text-blue-800 border border-blue-200/60'}">
                          ${item.role === 'photographer' ? Icons.camera('w-3 h-3 text-amber-600') : Icons.users('w-3 h-3 text-blue-600')}
                          <span>${item.roleName}</span>
                        </span>
                      </div>
                      <span class="text-[11px] text-slate-500 font-medium">${item.source}</span>
                    </div>
                  </div>

                  <!-- Qo'ng'iroq qilish tugmasi -->
                  <a 
                    href="tel:${item.userPhone}" 
                    class="payno-pill-btn px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Xodimga qoʻngʻiroq qilish"
                  >
                    ${Icons.phone('w-3.5 h-3.5 text-emerald-600')}
                    <span>${item.userPhone}</span>
                  </a>
                </div>

                <!-- Guruh va Hudud ma'lumoti -->
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">${item.orderId}</span>
                    <span class="text-slate-500 font-semibold flex items-center gap-1">
                      ${Icons.mapPin('w-3 h-3 text-slate-400')}
                      <span>${item.region}</span>
                    </span>
                  </div>
                  <div class="font-bold text-slate-800 text-[13px] pt-0.5">${item.university}</div>
                  <div class="text-slate-500 font-medium">${item.faculty} &bull; <strong class="text-slate-800 font-bold">${item.group}</strong></div>
                </div>

                <!-- Moliyaviy taqsimot va Xodim qo'lidagi qarz -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div class="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block">Mijozdan olingan:</span>
                    <span class="font-bold text-slate-700">${Store.formatMoney(item.collectedAmount)}</span>
                  </div>
                  <div class="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block">Kassaga berilgan:</span>
                    <span class="font-bold text-emerald-600">${Store.formatMoney(item.submittedAmount)}</span>
                  </div>
                  <div class="col-span-2 sm:col-span-1 p-2 rounded-xl bg-rose-50 border border-rose-100 flex flex-col justify-center">
                    <span class="text-[10px] uppercase font-bold text-rose-600 block">Hozir xodimda (Qarz):</span>
                    <span class="text-sm font-black text-rose-600 tracking-tight">${Store.formatMoney(item.cashInHand)}</span>
                  </div>
                </div>

                <!-- Holat va harakat tugmasi -->
                ${item.hasPendingRequest ? `
                  <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span class="text-amber-800 font-bold flex items-center gap-1.5">
                      ${Icons.clock('w-3.5 h-3.5 text-amber-600 animate-pulse')}
                      <span>Kassaga ${Store.formatMoney(item.pendingAmount)} topshirish soʻrovi yuborilgan</span>
                    </span>
                    <button 
                      onclick="AccountantView.goToInboxFromCashModal('${item.orderId}')" 
                      class="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                    >
                      <span>Tasdiqlash markazi &rarr;</span>
                    </button>
                  </div>
                ` : `
                  <div class="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Pul toʻliq xodim qoʻlida (Hali kassaga soʻrov yuborilmagan)</span>
                    </span>
                    <a href="tel:${item.userPhone}" class="font-bold text-blue-600 hover:underline">
                      Bogʻlanish &rarr;
                    </a>
                  </div>
                `}
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    App.openModal("Xodimlardagi naqd pullar (Qarzdorliklar)", bodyHtml);
  },

  goToInboxFromCashModal: (orderId) => {
    App.closeModal();
    AccountantView.switchTab('inbox');
  },

  // 2.2 Xarajatlar tahlili va kategoriyalar modali (Jami xarajatlar bosilganda)
  openExpenseAnalyticsModal: () => {
    const isFiltered = AccountantView.selectedRegion !== 'all';
    const activeRegion = AccountantView.selectedRegion;
    const overview = store.getCompanyOverview(activeRegion, store.selectedSeasonId);
    const categories = store.getExpenseCategories ? store.getExpenseCategories() : ['Ofis va Ijara', 'Taksi va Transport', 'Pechat va Materiallar', 'Oylik va Gonorar', 'Boshqa'];

    // 1. Ma'lumotlarni yig'ish (Tanlangan Oy/Yil va Viloyat bo'yicha)
    let compExpenses = (store.companyExpenses || []).filter(e => store.matchesPeriod(e, store.selectedSeasonId));
    if (isFiltered) {
      compExpenses = compExpenses.filter(e => e.region === activeRegion);
    }

    let approvedRequests = (store.expenseRequests || []).filter(r => r.status === 'approved' && store.matchesPeriod(r, store.selectedSeasonId));
    if (isFiltered) {
      approvedRequests = approvedRequests.filter(r => {
        const o = store.orders.find(ord => ord.id === r.orderId);
        return (o?.region || r.region) === activeRegion;
      });
    }

    let logs = (store.payrollLogs || []).filter(l => store.matchesPeriod(l, store.selectedSeasonId));
    if (isFiltered) {
      logs = logs.filter(l => !l.region || l.region === 'all' || l.region === activeRegion);
    }

    // Kategoriyalar statistikasi
    const catMap = {};
    categories.forEach(c => { catMap[c] = 0; });
    catMap['Ish haqi / Payroll'] = 0;

    compExpenses.forEach(e => {
      const cat = e.category || 'Ofis va Ijara';
      catMap[cat] = (catMap[cat] || 0) + (Number(e.amount) || 0);
    });

    approvedRequests.forEach(r => {
      const cat = r.category || 'Taksi va Transport';
      catMap[cat] = (catMap[cat] || 0) + (Number(r.amount) || 0);
    });

    logs.forEach(l => {
      catMap['Ish haqi / Payroll'] = (catMap['Ish haqi / Payroll'] || 0) + (Number(l.amount) || 0);
    });

    const totalCatAmount = Object.values(catMap).reduce((a, b) => a + b, 0) || overview.totalExpenses || 1;

    const sortedCats = Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount, percent: Math.round((amount / totalCatAmount) * 100) }))
      .sort((a, b) => b.amount - a.amount);

    // 2. Qatorma-qator Tranzaksiya tarixi
    const transactions = [];

    compExpenses.forEach(e => {
      transactions.push({
        id: e.id,
        date: e.date || '—',
        timestamp: e.timestamp || 0,
        recipient: e.title || 'Doimiy xarajat',
        role: 'Kompaniya',
        category: e.category || 'Ofis va Ijara',
        region: e.region || 'Umumiy',
        comment: e.comment || e.title || '',
        amount: Number(e.amount) || 0
      });
    });

    approvedRequests.forEach(r => {
      transactions.push({
        id: r.id,
        date: r.date || '—',
        timestamp: r.timestamp || 0,
        recipient: r.requesterName || 'Xodim',
        role: r.requesterRole || 'Xodim',
        category: r.category || 'Guruh xarajati',
        region: r.region || 'Toshkent shahri',
        comment: r.description || r.comment || '',
        amount: Number(r.amount) || 0
      });
    });

    logs.forEach(l => {
      transactions.push({
        id: l.id,
        date: l.date || '—',
        timestamp: l.timestamp || 0,
        recipient: l.userName || 'Xodim',
        role: l.role === 'ceo' ? 'Rahbar' : (l.type === 'dividend' ? 'Dividend' : 'Ish haqi'),
        category: 'Ish haqi / Payroll',
        region: l.region || 'all',
        comment: l.comment || l.type || 'Toʻlov',
        amount: Number(l.amount) || 0
      });
    });

    transactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    const bodyHtml = `
      <div class="space-y-5">
        <!-- 1. Yuqori qism: Umumiy summa va Filtr -->
        <div class="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex items-center justify-between flex-wrap gap-2">
          <div>
            <div class="text-[11px] font-bold uppercase text-[#86868B] tracking-wider">
              ${isFiltered ? `${activeRegion} xarajatlari` : 'Kompaniya jami xarajatlari'}
            </div>
            <div class="text-2xl font-extrabold text-[#1D1D1F] mt-0.5">
              ${Store.formatMoney(totalCatAmount)}
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold ${isFiltered ? 'bg-[#d64138]/10 text-[#d64138] border border-[#d64138]/20' : 'bg-black/[0.05] text-[#1D1D1F]'}">
            ${isFiltered ? `${activeRegion} filtri faol` : 'Barcha viloyatlar'}
          </span>
        </div>

        <!-- 2. Kategoriyalar bo'yicha taqsimot -->
        <div>
          <div class="flex items-center justify-between mb-3 px-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
              Kategoriyalar boʻyicha tahlil:
            </h4>
            <span class="text-[11px] text-[#86868B] font-semibold">${sortedCats.length} ta kategoriya</span>
          </div>

          <div class="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar pr-1" id="cat-analytics-content">
            ${sortedCats.map(cat => `
              <div 
                onclick="AccountantView.openCategoryDetailModal('${cat.name}')" 
                class="p-3 rounded-2xl bg-white border border-black/[0.05] shadow-2xs space-y-1.5 cursor-pointer hover:border-blue-400 hover:shadow-xs transition-all group"
                title="Batafsil tranzaksiyalarni koʻrish uchun bosing"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-[#1D1D1F] group-hover:text-blue-600 transition-colors">${cat.name}</span>
                  <div class="text-right">
                    <span class="font-extrabold text-[#1D1D1F]">${Store.formatMoney(cat.amount)}</span>
                    <span class="text-[10px] text-[#86868B] ml-1">(${cat.percent}%)</span>
                  </div>
                </div>
                <div class="w-full h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                  <div class="h-full bg-[#d64138] rounded-full transition-all duration-300" style="width: ${Math.min(100, Math.max(4, cat.percent))}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3. Yangi Kategoriya qo'shish formasi -->
        <div class="p-3.5 rounded-2xl bg-[#d64138]/5 border border-[#d64138]/15">
          <label class="block text-xs font-bold text-[#1D1D1F] mb-1.5 flex items-center gap-1.5">
            ${Icons.plus('w-3.5 h-3.5 text-[#d64138]')}
            <span>Yangi xarajat kategoriyasi qoʻshish</span>
          </label>
          <form onsubmit="AccountantView.handleAddExpenseCategory(event)" class="flex items-center gap-2">
            <input 
              type="text" 
              name="catName" 
              required 
              placeholder="Masalan: Logistika, Reklama, Texnika..." 
              class="payno-input text-xs flex-1 bg-white" 
            />
            <button 
              type="submit" 
              class="payno-pill-btn payno-btn-primary px-4 py-2.5 text-xs font-bold shrink-0 shadow-2xs"
            >
              Qoʻshish
            </button>
          </form>
        </div>

        <!-- 4. Tranzaksiya Tarixi (Qatorma-qator) -->
        <div>
          <div class="flex items-center justify-between mb-2.5 px-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
              Xarajatlar tranzaksiyalari tarixi:
            </h4>
            <span class="text-[11px] text-[#86868B] font-semibold">${transactions.length} ta yozuv</span>
          </div>

          ${transactions.length === 0 ? `
            <div class="text-center py-8 text-xs text-[#86868B] bg-[#F5F5F7] rounded-2xl">
              Xarajat tranzaksiyalari topilmadi
            </div>
          ` : `
            <div class="max-h-72 overflow-y-auto no-scrollbar rounded-2xl border border-black/[0.05] bg-white divide-y divide-black/[0.04]">
              <div class="sticky top-0 bg-[#F5F5F7] text-[10px] font-bold uppercase tracking-wider text-[#86868B] p-2.5 grid grid-cols-12 gap-2 border-b border-black/[0.05]">
                <div class="col-span-3">Sana / Vaqt</div>
                <div class="col-span-3">Kimga / Nomi</div>
                <div class="col-span-3">Kategoriya / Izoh</div>
                <div class="col-span-3 text-right">Summa</div>
              </div>

              ${transactions.map(t => `
                <div class="p-2.5 text-xs grid grid-cols-12 gap-2 items-center hover:bg-slate-50 transition-colors">
                  <div class="col-span-3">
                    <div class="font-bold text-[#1D1D1F] text-[11px] leading-tight">${t.date}</div>
                    <span class="text-[9px] text-[#d64138] font-semibold">${t.region === 'all' ? 'Umumiy' : t.region}</span>
                  </div>
                  <div class="col-span-3 min-w-0">
                    <div class="font-bold text-[#1D1D1F] truncate text-[11px]">${t.recipient}</div>
                    <div class="text-[9px] text-[#86868B] truncate">${t.role}</div>
                  </div>
                  <div class="col-span-3 min-w-0">
                    <span class="inline-block px-1.5 py-0.2 rounded bg-black/[0.04] text-[#1D1D1F] font-semibold text-[9px] truncate max-w-full">
                      ${t.category}
                    </span>
                    ${t.comment ? `<div class="text-[10px] text-[#86868B] truncate mt-0.5" title="${t.comment}">${t.comment}</div>` : ''}
                  </div>
                  <div class="col-span-3 text-right">
                    <span class="font-extrabold text-[#D70015] text-xs">-${Store.formatMoney(t.amount)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    App.openModal("Xarajatlar tahlili va kategoriyalar", bodyHtml);
  },

  handleAddExpenseCategory: (e) => {
    e.preventDefault();
    const input = e.target.catName;
    const val = input ? input.value.trim() : '';
    if (!val) return;

    const added = store.addExpenseCategory(val);
    if (added) {
      App.showToast(`"${val}" kategoriyasi qoʻshildi!`);
      if (document.getElementById('cat-analytics-content')) {
        AccountantView.openExpenseAnalyticsModal();
      } else {
        App.render();
      }
    } else {
      App.showToast(`"${val}" kategoriyasi mavjud yoki xatolik!`, "warning");
    }
  },

  handleDeleteExpenseCategory: (catName) => {
    if (confirm(`"${catName}" kategoriyasini roʻyxatdan oʻchirmoqchimisiz?`)) {
      const deleted = store.deleteExpenseCategory(catName);
      if (deleted) {
        App.showToast(`"${catName}" kategoriyasi oʻchirildi!`);
        App.closeModal();
        App.render();
      } else {
        App.showToast("Kategoriyani oʻchirib boʻlmadi!", "warning");
      }
    }
  },

  getCategoryTotal: (categoryName, regionFilter = null) => {
    let total = 0;
    const catLower = (categoryName || '').toLowerCase().trim();

    // 1. Company expenses
    (store.companyExpenses || []).forEach(e => {
      if (regionFilter && regionFilter !== 'all' && e.region && e.region !== 'all' && e.region !== regionFilter) return;
      if ((e.category || '').toLowerCase().trim() === catLower) {
        total += Number(e.amount) || 0;
      }
    });

    // 2. Approved requests
    (store.expenseRequests || []).forEach(r => {
      if (r.status !== 'approved') return;
      if (regionFilter && regionFilter !== 'all') {
        const o = (store.orders || []).find(ord => ord.id === r.orderId);
        const rReg = o?.region || r.region;
        if (rReg && rReg !== 'all' && rReg !== regionFilter) return;
      }
      if ((r.category || '').toLowerCase().trim() === catLower) {
        total += Number(r.amount) || 0;
      }
    });

    // 3. Order costs
    (store.orders || []).forEach(o => {
      if (regionFilter && regionFilter !== 'all' && o.region && o.region !== regionFilter) return;
      (o.costs || []).forEach(c => {
        if (c.status === 'rejected') return;
        if ((c.category || '').toLowerCase().trim() === catLower) {
          total += Number(c.amount) || 0;
        }
      });
    });

    // 4. Payroll if matching
    if (catLower.includes('oylik') || catLower.includes('payroll') || catLower.includes('ish haqi')) {
      (store.payrollLogs || []).forEach(l => {
        if (regionFilter && regionFilter !== 'all' && l.region && l.region !== 'all' && l.region !== regionFilter) return;
        total += Number(l.amount) || 0;
      });
    }

    return total;
  },

  // Kategoriya bo'yicha batafsil tranzaksiyalar tarixi modali
  openCategoryDetailModal: (categoryName) => {
    const isFiltered = AccountantView.selectedRegion !== 'all';
    const activeRegion = AccountantView.selectedRegion;
    const catLower = (categoryName || '').toLowerCase().trim();

    const transactions = [];

    // 1. Doimiy xarajatlar
    (store.companyExpenses || []).forEach(e => {
      if (isFiltered && e.region && e.region !== 'all' && e.region !== activeRegion) return;
      if ((e.category || '').toLowerCase().trim() === catLower) {
        transactions.push({
          id: e.id,
          date: e.date || '—',
          timestamp: e.timestamp || 0,
          title: e.title || 'Doimiy xarajat',
          role: 'Kompaniya',
          region: e.region || 'all',
          comment: e.note || e.title || '',
          proofLink: e.proofLink || null,
          amount: Number(e.amount) || 0
        });
      }
    });

    // 2. Tasdiqlangan xodim xarajatlari
    (store.expenseRequests || []).forEach(r => {
      if (r.status !== 'approved') return;
      if (isFiltered) {
        const o = (store.orders || []).find(ord => ord.id === r.orderId);
        const rReg = o?.region || r.region;
        if (rReg && rReg !== 'all' && rReg !== activeRegion) return;
      }
      if ((r.category || '').toLowerCase().trim() === catLower) {
        transactions.push({
          id: r.id,
          date: r.date || '—',
          timestamp: r.timestamp || 0,
          title: r.requesterName || 'Xodim',
          role: r.requesterRole || 'Xodim',
          region: r.region || 'Toshkent shahri',
          comment: r.description || r.comment || '',
          proofLink: r.proofLink || null,
          amount: Number(r.amount) || 0
        });
      }
    });

    // 3. Buyurtma / Guruh xarajatlari
    (store.orders || []).forEach(o => {
      if (isFiltered && o.region && o.region !== activeRegion) return;
      (o.costs || []).forEach(c => {
        if (c.status === 'rejected') return;
        if ((c.category || '').toLowerCase().trim() === catLower) {
          transactions.push({
            id: c.id || `${o.id}_${Math.random()}`,
            date: c.date || o.date || '—',
            timestamp: c.timestamp || 0,
            title: `${o.id} (${o.university || ''})`,
            role: 'Guruh xarajati',
            region: o.region || 'Toshkent shahri',
            comment: c.title || 'Xarajat',
            proofLink: c.proofLink || null,
            amount: Number(c.amount) || 0
          });
        }
      });
    });

    // 4. Payroll agar tegishli bo'lsa
    if (catLower.includes('oylik') || catLower.includes('payroll') || catLower.includes('ish haqi')) {
      (store.payrollLogs || []).forEach(l => {
        if (isFiltered && l.region && l.region !== 'all' && l.region !== activeRegion) return;
        transactions.push({
          id: l.id,
          date: l.date || '—',
          timestamp: l.timestamp || 0,
          title: l.userName || 'Xodim',
          role: l.role === 'ceo' ? 'Rahbar' : (l.type === 'dividend' ? 'Dividend' : 'Oylik toʻlovi'),
          region: l.region || 'Umumiy',
          comment: l.comment || l.type || 'Toʻlov',
          proofLink: null,
          amount: Number(l.amount) || 0
        });
      });
    }

    transactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Yuqori qism: Kategoriya ma'lumoti va umumiy summa -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Kategoriya:</span>
              <strong class="text-base text-slate-900 font-extrabold">${categoryName}</strong>
            </div>
            <div class="text-xl font-extrabold text-rose-600 mt-1">
              -${Store.formatMoney(totalAmount)}
            </div>
          </div>
          <div class="text-right">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${isFiltered ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-slate-200 text-slate-800'}">
              ${isFiltered ? `${activeRegion} viloyati` : 'Barcha viloyatlar'}
            </span>
            <span class="block text-[11px] text-slate-400 mt-1 font-semibold">${transactions.length} ta tranzaksiya</span>
          </div>
        </div>

        <!-- Tranzaksiyalar ro'yxati -->
        <div>
          ${transactions.length === 0 ? `
            <div class="py-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-dashed border-slate-200">
              "${categoryName}" kategoriyasi boʻyicha tranzaksiyalar mavjud emas
            </div>
          ` : `
            <div class="max-h-96 overflow-y-auto no-scrollbar rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-2xs">
              <div class="sticky top-0 bg-slate-100/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-slate-500 p-3 grid grid-cols-12 gap-2 border-b border-slate-200 z-10">
                <div class="col-span-3">Sana / Viloyat</div>
                <div class="col-span-3">Kimga / Nomi</div>
                <div class="col-span-3">Izoh / Chek</div>
                <div class="col-span-3 text-right">Summa</div>
              </div>

              ${transactions.map(t => {
                return `
                  <div class="p-3 text-xs grid grid-cols-12 gap-2 items-center hover:bg-slate-50 transition-colors">
                    <div class="col-span-3">
                      <div class="font-bold text-slate-900 text-[11px] leading-tight">${t.date}</div>
                      <span class="text-[9px] text-blue-600 font-semibold">${t.region === 'all' ? 'Umumiy' : t.region}</span>
                    </div>
                    <div class="col-span-3 min-w-0">
                      <div class="font-bold text-slate-900 truncate text-[11px]">${t.title}</div>
                      <div class="text-[9px] text-slate-400 truncate">${t.role}</div>
                    </div>
                    <div class="col-span-3 min-w-0">
                      <div class="text-[11px] text-slate-600 truncate" title="${t.comment}">${t.comment || '—'}</div>
                      ${t.proofLink ? `
                        <a href="${t.proofLink}" target="_blank" class="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5 font-bold mt-0.5">
                          ${Icons.link('w-3 h-3')}
                          <span>Telegram cheki &nearr;</span>
                        </a>
                      ` : ''}
                    </div>
                    <div class="col-span-3 text-right">
                      <span class="font-extrabold text-rose-600 text-xs">-${Store.formatMoney(t.amount)}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <div class="pt-2 flex items-center justify-between">
          <button 
            type="button" 
            onclick="AccountantView.handleDeleteExpenseCategory('${categoryName}')"
            class="payno-pill-btn bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-2 flex items-center gap-1.5 transition-all"
          >
            ${Icons.trash('w-3.5 h-3.5')}
            <span>Kategoriyani oʻchirish</span>
          </button>
          <button 
            type="button" 
            onclick="App.closeModal()" 
            class="payno-pill-btn bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2"
          >
            Yopish
          </button>
        </div>
      </div>
    `;

    App.openModal(`Kategoriya: ${categoryName}`, bodyHtml);
  },

  // ==================================================================
  // 3. GURUHLAR MOLIYASI - VILOYAT BO'YICHA FILTRLANGAN
  // ==================================================================
  renderGroupsFinanceTab: () => {
    let targetOrders = (store.orders || []).filter(o => store.matchesPeriod(o, store.selectedSeasonId));
    if (AccountantView.selectedRegion !== 'all') {
      targetOrders = targetOrders.filter(o => o.region === AccountantView.selectedRegion);
    }

    // Guruhlar bo'yicha moliyaviy umumiy yig'indilar
    const totalContract = targetOrders.reduce((sum, o) => sum + ((o.realStudentCount || o.studentCount || 0) * (o.pricePerStudent || 0)), 0);
    const totalCollected = targetOrders.reduce((sum, o) => sum + ((o.sellerSubmittedAmount || 0) + (o.photographerSubmittedAmount || 0)), 0);
    const totalProfits = targetOrders.reduce((sum, o) => sum + store.getOrderCosts(o).profit, 0);

    return `
      <div class="payno-card p-6 bg-white border border-slate-100">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-900">Guruhlar moliyaviy balansi va tannarxi</h3>
              ${AccountantView.selectedRegion !== 'all' ? `
                <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold">
                  ${AccountantView.selectedRegion}
                </span>
              ` : `
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  Barcha viloyatlar
                </span>
              `}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              ${AccountantView.selectedRegion === 'all' 
                ? 'Barcha hududlar boʻyicha guruhlar roʻyxati' 
                : `Faqat ${AccountantView.selectedRegion} viloyatidagi guruhlar moliyasi`}
            </p>
          </div>
          <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            ${targetOrders.length} ta guruh
          </span>
        </div>

        <!-- Guruhlar umumiy qisqacha ko'rsatkichi -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 mb-4 text-xs">
          <div>
            <span class="text-slate-400 text-[10px] font-bold uppercase block">Jami shartnoma summasi</span>
            <span class="text-base font-extrabold text-slate-900">${Store.formatMoney(totalContract)}</span>
          </div>
          <div>
            <span class="text-slate-400 text-[10px] font-bold uppercase block">Kassaga tushgan</span>
            <span class="text-base font-extrabold text-emerald-600">${Store.formatMoney(totalCollected)}</span>
          </div>
          <div>
            <span class="text-slate-400 text-[10px] font-bold uppercase block">Guruhlardan sof foyda</span>
            <span class="text-base font-extrabold ${totalProfits >= 0 ? 'text-emerald-700' : 'text-rose-600'}">${Store.formatMoney(totalProfits)}</span>
          </div>
        </div>

        ${targetOrders.length === 0 ? `
          <div class="py-12 text-center text-slate-400 text-xs font-semibold">
            ${AccountantView.selectedRegion === 'all' ? 'Buyurtmalar mavjud emas' : `${AccountantView.selectedRegion} boʻyicha buyurtmalar topilmadi`}
          </div>
        ` : `
          <div class="space-y-3">
            ${targetOrders.map(order => {
              const studentNum = order.realStudentCount || order.studentCount || 0;
              const orderTotalSum = studentNum * (order.pricePerStudent || 0);
              const costs = store.getOrderCosts(order);
              const productionCost = costs.editorCost + costs.makerCost + costs.photoCost + costs.extraCosts;
              const sellerComm = costs.sellerComm;
              const profit = costs.profit;
              const approvedCostsCount = (order.costs || []).filter(c => c.status === 'approved').length;

              return `
                <div class="p-5 rounded-[30px] bg-[#FAFAFA] transition-all">
                  <div class="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E8E8]">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs font-extrabold text-[#1C1C1E] bg-[#F0F0F0] px-3 py-1 rounded-full">${order.id}</span>
                      <span class="px-2.5 py-0.5 rounded-full bg-[#d64138]/10 text-[#d64138] text-[10px] font-bold">
                        ${order.region || 'Toshkent shahri'}
                      </span>
                      <span class="text-sm font-extrabold text-[#000000]">${order.university} (${order.group})</span>
                    </div>
                    <div>
                      ${Components.StatusBadge(order)}
                    </div>
                  </div>

                  <!-- ombor.svg / partiyalar.svg uslubidagi ichki stat kapsulalar -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-3">
                    <div class="bg-[#F5F5F5] rounded-[22px] p-3 text-center">
                      <span class="text-[#808080] block text-[10px] font-semibold mb-0.5">Kassaga tushgan</span>
                      <span class="font-extrabold text-[#000000]">${Store.formatMoney((order.sellerSubmittedAmount || 0) + (order.photographerSubmittedAmount || 0))}</span>
                    </div>
                    <div class="bg-[#F5F5F5] rounded-[22px] p-3 text-center">
                      <span class="text-[#808080] block text-[10px] font-semibold mb-0.5">Ishlab chiqarish (${approvedCostsCount} ta)</span>
                      <span class="font-extrabold text-[#000000]">${Store.formatMoney(productionCost)}</span>
                    </div>
                    <div class="bg-[#F5F5F5] rounded-[22px] p-3 text-center">
                      <span class="text-[#808080] block text-[10px] font-semibold mb-0.5">Sotuvchi komissiyasi</span>
                      <span class="font-extrabold text-[#000000]">${Store.formatMoney(sellerComm)}</span>
                    </div>
                    <div class="bg-[#d64138]/[0.06] rounded-[22px] p-3 text-center">
                      <span class="text-[#d64138] block text-[10px] font-bold mb-0.5">Guruh sof foydasi</span>
                      <span class="font-extrabold text-[#d64138]">${Store.formatMoney(profit)}</span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-2.5 border-t border-[#E8E8E8] flex-wrap gap-2 text-xs">
                    <div class="text-[11px] text-[#808080]">
                      <span>Sotuvchi: <strong class="text-[#1C1C1E]">${order.sellerName || 'Alisher'}</strong></span>
                      <span class="mx-1.5">&bull;</span>
                      <span>Shartnoma: <strong class="text-[#1C1C1E]">${Store.formatMoney(orderTotalSum)}</strong> (${studentNum} talaba)</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <button 
                        onclick="AccountantView.openAddGroupExpenseModal('${order.id}')"
                        class="payno-pill-btn px-3.5 py-1.5 bg-[#F0F0F0] hover:bg-[#E4E4E4] text-[#1C1C1E] text-xs font-bold transition-all flex items-center gap-1"
                        title="Guruhga xarajat kiritish"
                      >
                        ${Icons.plus('w-3 h-3 text-[#d64138]')}
                        <span>+ Xarajat qoʻshish</span>
                      </button>
                      <button 
                        onclick="AccountantView.openGroupFinanceModal('${order.id}')"
                        class="payno-pill-btn px-4 py-1.5 bg-[#d64138] hover:bg-[#bd352d] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        ${Icons.arrowUpRight('w-3.5 h-3.5')}
                        <span>Batafsil moliya</span>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  },

  // ==================================================================
  // 4. DOIMIY XARAJATLAR - VILOYATLAR BO'YICHA ALOHIDA HISOB
  // ==================================================================
  renderCompanyExpensesTab: () => {
    const isFiltered = AccountantView.selectedRegion !== 'all';
    const categories = store.getExpenseCategories ? store.getExpenseCategories() : ['Ofis va Ijara', 'Taksi va Transport', 'Pechat va Materiallar', 'Oylik va Gonorar', 'Boshqa'];
    const allPeriodExpenses = (store.companyExpenses || []).filter(e => store.matchesPeriod(e, store.selectedSeasonId));
    let regionExpenses = allPeriodExpenses;
    let commonExpenses = [];

    if (isFiltered) {
      regionExpenses = allPeriodExpenses.filter(e => e.region === AccountantView.selectedRegion);
      commonExpenses = allPeriodExpenses.filter(e => !e.region || e.region === 'all');
    }

    const totalRegionExp = regionExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalCommonExp = commonExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    return `
      <div class="payno-card p-6 bg-white border border-slate-100">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-900">Kompaniya doimiy xarajatlari</h3>
              ${isFiltered ? `
                <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold">
                  ${AccountantView.selectedRegion} viloyati
                </span>
              ` : `
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  Barcha viloyatlar
                </span>
              `}
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              ${isFiltered 
                ? `${AccountantView.selectedRegion} viloyati filiali, ofis ijarasi va kommunal xarajatlari`
                : 'Ofis ijarasi, kommunal toʻlovlar, umumiy xom-ashyo va hududiy xarajatlar'}
            </p>
          </div>
          <button 
            onclick="AccountantView.openAddCompanyExpenseModal()" 
            class="payno-pill-btn payno-btn-primary px-4 py-2 text-xs font-bold shadow-md"
          >
            ${Icons.plus('w-3.5 h-3.5')}
            <span>+ Yangi doimiy xarajat kiritish</span>
          </button>
        </div>

        <!-- Jami xarajat ko'rsatkichi -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 mb-4 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div>
            <span class="text-slate-400 text-[10px] uppercase font-bold block">
              ${isFiltered ? `${AccountantView.selectedRegion} xarajatlari jami:` : 'Jami doimiy xarajatlar:'}
            </span>
            <span class="text-lg font-extrabold text-rose-600">-${Store.formatMoney(totalRegionExp)}</span>
          </div>
          ${isFiltered ? `
            <div class="text-[11px] text-slate-500">
              Umumiy korporativ xarajatlar: <strong class="text-slate-700">${Store.formatMoney(totalCommonExp)}</strong>
            </div>
          ` : ''}
        </div>

        <!-- KATEGORIYALAR BOSHQARUVI -->
        <div class="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">Xarajat kategoriyalari</h4>
                <span class="text-[10px] text-slate-400 font-semibold">(${categories.length} ta)</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5">
                Kategoriya ustiga bosib, uning barcha tranzaksiyalari tarixini koʻring yoki yangi kategoriya qoʻshing/oʻchiring
              </p>
            </div>
            
            <!-- Yangi kategoriya qo'shish inline formasi -->
            <form onsubmit="AccountantView.handleAddExpenseCategory(event)" class="flex items-center gap-1.5">
              <input 
                type="text" 
                name="catName" 
                required 
                placeholder="+ Yangi kategoriya" 
                class="payno-input text-xs py-1.5 px-3 bg-white w-44 shadow-2xs" 
              />
              <button 
                type="submit" 
                class="payno-pill-btn payno-btn-primary px-3 py-1.5 text-xs font-bold shadow-2xs"
              >
                Qoʻshish
              </button>
            </form>
          </div>

          <!-- Kategoriyalar ro'yxati (Pill / Cards) -->
          <div class="flex flex-wrap gap-2">
            ${categories.map(cat => {
              const catSum = AccountantView.getCategoryTotal(cat, isFiltered ? AccountantView.selectedRegion : null);
              return `
                <button 
                  type="button"
                  onclick="AccountantView.openCategoryDetailModal('${cat}')" 
                  class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
                  title="Ushbu kategoriya boʻyicha batafsil tranzaksiyalarni koʻrish va boshqarish"
                >
                  <span class="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">${cat}</span>
                  <span class="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                    ${catSum > 0 ? `-${Store.formatMoney(catSum)}` : '0'}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        ${regionExpenses.length === 0 ? `
          <div class="py-12 text-center text-slate-400 text-xs font-semibold bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            ${isFiltered ? `${AccountantView.selectedRegion} viloyati boʻyicha doimiy xarajatlar kiritilmagan` : 'Doimiy xarajatlar mavjud emas'}
          </div>
        ` : `
          <div class="space-y-3">
            ${regionExpenses.map(exp => `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:border-slate-300 transition-all">
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-bold text-slate-900">${exp.title}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${exp.region && exp.region !== 'all' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-700'}">
                      ${exp.region && exp.region !== 'all' ? exp.region : 'Umumiy kompaniya'}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">
                    ${exp.date} &bull; ${exp.note || 'Doimiy xarajat'}
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-base font-extrabold text-rose-600">
                    -${Store.formatMoney(exp.amount)}
                  </div>
                  <button 
                    onclick="AccountantView.handleDeleteCompanyExpense('${exp.id}')"
                    class="p-1.5 rounded-full text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title="Xarajatni oʻchirish"
                  >
                    ${Icons.trash('w-4 h-4')}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        ${isFiltered && commonExpenses.length > 0 ? `
          <!-- Alohida bo'lim: Umumiy kompaniya xarajatlari -->
          <div class="mt-6 pt-5 border-t border-slate-200/60">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Umumiy kompaniya xarajatlari (${commonExpenses.length} ta)
            </h4>
            <div class="space-y-2.5 opacity-80">
              ${commonExpenses.map(exp => `
                <div class="p-3.5 rounded-2xl bg-white border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span class="font-bold text-slate-800">${exp.title}</span>
                    <span class="text-slate-400 block text-[10px] mt-0.5">${exp.date} &bull; Umumiy</span>
                  </div>
                  <span class="font-extrabold text-slate-700">-${Store.formatMoney(exp.amount)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  openAddCompanyExpenseModal: () => {
    const activeRegions = store.getRegions();
    const currentRegion = AccountantView.selectedRegion || 'all';

    const bodyHtml = `
      <form id="comp-expense-form" onsubmit="AccountantView.handleAddCompanyExpenseSubmit(event)" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Xarajat nomi <span class="text-rose-500">*</span></label>
          <input type="text" id="comp-exp-title" required placeholder="Masalan: Filial ofis ijarasi yoki kommunal" class="payno-input font-bold" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Summa (soʻm) <span class="text-rose-500">*</span></label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="comp-exp-amount" 
            required 
            placeholder="Masalan: 5 000 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-extrabold text-base" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Viloyat / Hudud <span class="text-rose-500">*</span></label>
          <select id="comp-exp-region" class="payno-input bg-slate-50 font-bold text-slate-900 cursor-pointer">
            <option value="all" ${currentRegion === 'all' ? 'selected' : ''}>Barcha viloyatlar uchun (Umumiy kompaniya)</option>
            ${activeRegions.map(r => `
              <option value="${r}" ${currentRegion === r ? 'selected' : ''}>${r} viloyati</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Kategoriya</label>
          <select id="comp-exp-cat" class="payno-input bg-slate-50 font-bold text-xs cursor-pointer">
            ${(store.getExpenseCategories ? store.getExpenseCategories() : ['Ofis va Ijara', 'Taksi va Transport', 'Pechat va Materiallar', 'Oylik va Gonorar', 'Boshqa']).map(cat => `
              <option value="${cat}">${cat}</option>
            `).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Izoh (ixtiyoriy)</label>
          <input type="text" id="comp-exp-note" placeholder="Masalan: Samarqand filiali uchun" class="payno-input" />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Xarajatni saqlash
          </button>
        </div>
      </form>
    `;

    App.openModal("Kompaniya xarajatini qoʻshish", bodyHtml);
  },

  handleAddCompanyExpenseSubmit: (e) => {
    e.preventDefault();
    const data = {
      title: document.getElementById('comp-exp-title').value.trim(),
      amount: document.getElementById('comp-exp-amount').value,
      category: document.getElementById('comp-exp-cat').value,
      region: document.getElementById('comp-exp-region').value,
      note: document.getElementById('comp-exp-note').value.trim()
    };

    store.addCompanyExpense(data);
    App.closeModal();
    App.showToast("Kompaniya xarajati kiritildi!");
    App.render();
  },

  handleDeleteCompanyExpense: (expId) => {
    if (confirm("Ushbu doimiy xarajatni roʻyxatdan oʻchirmoqchimisiz?")) {
      store.deleteCompanyExpense(expId);
      App.showToast("Xarajat oʻchirildi!");
      App.render();
    }
  },

  // ==================================================================
  // MODALLAR VA YORDAMCHI METODLAR
  // ==================================================================

  // Guruh moliyasini batafsil ko'rish modali
  openGroupFinanceModal: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    const studentNum = order.realStudentCount || order.studentCount || 0;
    const orderTotalSum = studentNum * (order.pricePerStudent || 0);
    const costs = store.getOrderCosts(order);
    const orderCosts = order.costs || [];
    
    const photoSubmitted = order.photographerSubmittedAmount || 0;
    const sellerSubmitted = order.sellerSubmittedAmount || 0;
    const totalKassaCollected = photoSubmitted + sellerSubmitted;

    const photoCollected = order.photographerCollectedAmount || 0;
    const photoCashInHand = Math.max(0, photoCollected - photoSubmitted);

    const totalCol = order.collectedAmount || 0;
    const sellerCol = Math.max(0, totalCol - photoCollected);
    const sellerCashInHand = Math.max(0, sellerCol - sellerSubmitted);
    const totalCashInHand = photoCashInHand + sellerCashInHand;

    const bodyHtml = `
      <div class="space-y-4">
        <!-- Guruh Sarlavhasi -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div class="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span class="text-base font-extrabold text-slate-900">${order.id}</span>
              <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
                ${order.region || 'Toshkent shahri'}
              </span>
            </div>
            <div>${Components.StatusBadge(order)}</div>
          </div>
          <div class="text-xs text-slate-600 font-medium">
            ${order.university} &bull; ${order.faculty || ''} &bull; ${order.group}
          </div>
        </div>

        <!-- Moliya Balansi Ko'rsatkichlari -->
        <div class="grid grid-cols-2 gap-2.5 text-xs">
          <div class="p-3 bg-white rounded-2xl border border-slate-100">
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Jami shartnoma</span>
            <span class="text-base font-extrabold text-slate-900">${Store.formatMoney(orderTotalSum)}</span>
            <span class="text-[11px] text-slate-400 block mt-0.5">${studentNum} dona &times; ${Store.formatMoney(order.pricePerStudent)}</span>
          </div>

          <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span class="text-emerald-700 block text-[10px] uppercase font-bold">Kassaga tushgan</span>
            <span class="text-base font-extrabold text-emerald-800">${Store.formatMoney(totalKassaCollected)}</span>
            <span class="text-[11px] text-emerald-600 block mt-0.5">
              ${photoSubmitted > 0 ? `Foto: ${Store.formatMoney(photoSubmitted)} &bull; ` : ''}Sotuv: ${Store.formatMoney(sellerSubmitted)}
            </span>
          </div>

          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Xodimlardagi naqd pul</span>
            <span class="text-base font-extrabold ${totalCashInHand > 0 ? 'text-rose-600' : 'text-slate-800'}">
              ${Store.formatMoney(totalCashInHand)}
            </span>
            <span class="text-[11px] text-slate-400 block mt-0.5">
              ${photoCashInHand > 0 ? `Fotograf: ${Store.formatMoney(photoCashInHand)}${sellerCashInHand > 0 ? ' &bull; ' : ''}` : ''}${sellerCashInHand > 0 ? `Sotuvchi: ${Store.formatMoney(sellerCashInHand)}` : (photoCashInHand === 0 ? 'Qarz yoʻq' : '')}
            </span>
          </div>

          <div class="p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <span class="text-purple-700 block text-[10px] uppercase font-bold">Vinetka modeli</span>
            <span class="text-sm font-extrabold text-purple-900 truncate block mt-0.5">${order.albumType || 'Standart'}</span>
            <span class="text-[11px] text-purple-600 block mt-0.5">Turi boʻyicha</span>
          </div>
        </div>

        <!-- Xodimlar haqi va Tannarx taqsimoti -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tannarx va Xizmat haqlari taqsimoti</div>
          
          <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-600">Sotuvchi komissiyasi (${order.sellerName || 'Sotuvchi'}):</span>
            <span class="font-extrabold text-slate-900">${Store.formatMoney(costs.sellerComm)}</span>
          </div>

          <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-600">Dizayner gonorari (${order.editorName || 'Dizayner'}):</span>
            <span class="font-extrabold text-slate-900">${Store.formatMoney(costs.editorCost)}</span>
          </div>

          <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-600">Albom yasovchi haqi (${order.makerName || 'Yasovchi'}):</span>
            <span class="font-extrabold text-slate-900">${Store.formatMoney(costs.makerCost)}</span>
          </div>

          ${costs.photoCost > 0 ? `
            <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span class="text-slate-600">Fotograf haqi (${order.photographerName || 'Fotograf'}):</span>
              <span class="font-extrabold text-slate-900">${Store.formatMoney(costs.photoCost)}</span>
            </div>
          ` : ''}

          <div class="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-600">Ishlab chiqarish va boshqa xarajatlar:</span>
            <span class="font-extrabold text-rose-600">${Store.formatMoney(costs.extraCosts)}</span>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="font-bold text-slate-900">Jami xarajat (Tannarx):</span>
            <span class="font-extrabold text-slate-900">${Store.formatMoney(costs.totalCosts)}</span>
          </div>
        </div>

        <!-- Sof Foyda Bloki -->
        <div class="p-4 rounded-2xl ${costs.profit >= 0 ? 'bg-slate-900 text-white' : 'bg-rose-900 text-white'}">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-300 font-semibold block">Guruhdan qolgan sof foyda:</span>
              <span class="text-[11px] text-slate-400">Kassaga tushgan minus jami tannarx</span>
            </div>
            <div class="text-2xl font-extrabold ${costs.profit >= 0 ? 'text-emerald-400' : 'text-rose-300'}">
              ${Store.formatMoney(costs.profit)}
            </div>
          </div>
        </div>

        <!-- Guruhga bog'langan xarajatlar ro'yxati -->
        <div>
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Guruh xarajatlari (${orderCosts.length} ta)</span>
            <button 
              onclick="AccountantView.openAddGroupExpenseModal('${order.id}')"
              class="payno-pill-btn px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 transition-all"
            >
              ${Icons.plus('w-3 h-3')}
              <span>+ Xarajat qoʻshish</span>
            </button>
          </div>

          <div class="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            ${orderCosts.length === 0 ? `
              <div class="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                Ushbu guruhga hali qoʻshimcha xarajat kiritilmagan
              </div>
            ` : orderCosts.map(c => `
              <div class="p-3 bg-white rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div class="font-bold text-slate-800">${c.title || 'Xarajat'}</div>
                  <div class="text-[11px] text-slate-400 mt-0.5">
                    <span>${c.date || 'Bugun'}</span>
                    ${c.proofLink ? ` &bull; <a href="${c.proofLink}" target="_blank" class="text-blue-600 underline">Chek</a>` : ''}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-rose-600">-${Store.formatMoney(c.amount)}</span>
                  <button 
                    onclick="AccountantView.handleDeleteGroupExpense('${order.id}', '${c.id}')"
                    class="p-1 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    title="Xarajatni oʻchirish"
                  >
                    ${Icons.trash('w-3.5 h-3.5')}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    App.openModal(`Guruh moliyasi: ${order.id}`, bodyHtml);
  },

  // Guruhga xarajat qo'shish modali
  openAddGroupExpenseModal: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    const bodyHtml = `
      <form id="group-expense-form" onsubmit="AccountantView.handleAddGroupExpenseSubmit(event, '${order.id}')" class="space-y-4">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div class="font-extrabold text-slate-900">${order.id} &bull; ${order.university} (${order.group})</div>
          <div class="text-slate-400 text-[11px] mt-0.5">Viloyat: ${order.region || 'Toshkent shahri'} &bull; ${order.realStudentCount || order.studentCount} ta talaba</div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Xarajat summasi (soʻm) <span class="text-rose-500">*</span></label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="grp-exp-amount" 
            required 
            placeholder="Masalan: 350 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold text-base" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Xarajat maqsadi / Turi <span class="text-rose-500">*</span></label>
          <select 
            id="grp-exp-preset" 
            onchange="document.getElementById('grp-exp-title').value = this.value"
            class="payno-input bg-slate-50 text-xs font-bold mb-2 cursor-pointer"
          >
            <option value="Bosmaxona va pechat toʻlovi">Bosmaxona va pechat toʻlovi</option>
            <option value="Transport va taksi xarajati">Transport va taksi xarajati</option>
            <option value="Studiya va yoritgich arendasi">Studiya va yoritgich arendasi</option>
            <option value="Laminatsiya va muqova xom-ashyosi">Laminatsiya va muqova xom-ashyosi</option>
            <option value="Rekvizit va aksessuarlar">Rekvizit va aksessuarlar</option>
            <option value="Kuryer va yetkazib berish">Kuryer va yetkazib berish</option>
            <option value="">Boshqa (qoʻlda yozish)</option>
          </select>
          <input 
            type="text" 
            id="grp-exp-title" 
            required 
            value="Bosmaxona va pechat toʻlovi" 
            placeholder="Xarajat nomi yoki tafsiloti" 
            class="payno-input" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Chek yoki toʻlov hujjati havolasi (ixtiyoriy)</label>
          <input 
            type="url" 
            id="grp-exp-link" 
            placeholder="https://t.me/cheklar/... yoki havola" 
            class="payno-input text-xs" 
          />
        </div>

        <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs text-amber-800">
          <strong>Diqqat:</strong> Ushbu kiritilgan xarajat toʻgʻridan-toʻgʻri ushbu guruhning tannarxiga qoʻshiladi va uning sof foydasi darhol avtomatik qayta hisoblanadi.
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Xarajatni kiritish va tannarxga qoʻshish
          </button>
        </div>
      </form>
    `;

    App.openModal(`Xarajat qoʻshish: ${order.id}`, bodyHtml);
  },

  handleAddGroupExpenseSubmit: (e, orderId) => {
    e.preventDefault();
    const amount = Store.parseMoney(document.getElementById('grp-exp-amount').value);
    const title = document.getElementById('grp-exp-title').value.trim();
    const proofLink = document.getElementById('grp-exp-link').value.trim();

    const result = store.addOrderExpense(orderId, { amount, title, proofLink });
    if (result.success) {
      App.closeModal();
      App.showToast(result.message);
      App.render();
    } else {
      alert(result.message);
    }
  },

  handleDeleteGroupExpense: (orderId, costId) => {
    if (confirm("Haqiqatan ham ushbu xarajatni guruhdan oʻchirmoqchimisiz?")) {
      store.deleteOrderExpense(orderId, costId);
      App.showToast("Xarajat oʻchirildi!");
      AccountantView.openGroupFinanceModal(orderId);
      App.render();
    }
  }
};

window.AccountantView = AccountantView;
