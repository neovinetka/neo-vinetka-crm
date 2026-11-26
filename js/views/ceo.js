/* ====================================================================
   VINETKA CRM & ERP - CEO / RAHBAR VIEW (BOSHQARUV VA HR PANELI)
   Desktop Web Dashboard (Sidebar + Grid) + Fully Responsive Mobile
   ==================================================================== */

const CEOView = {
  currentTab: 'dashboard', // 'dashboard' | 'funnel' | 'hr' | 'album_types' | 'seasons'
  selectedHRRegion: 'all', // 'all' | 'Toshkent shahri' | 'Samarqand' ...

  setHRRegion: (region) => {
    CEOView.selectedHRRegion = region;
    App.render();
  },

  render: () => {
    const user = store.currentUser;
    const overview = store.getCompanyOverview();
    if (CEOView.currentTab === 'rates') CEOView.currentTab = 'dashboard';

    return `
      <div class="min-h-screen bg-[#F4F7FB] pb-16">
        <!-- O'zgarmas Header -->
        ${Components.Header(user, "App.openProfileModal()", "App.logout()")}

        <!-- Desktop va Mobile layout -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <!-- CEO Navigatsiya Tablari (Design Namuna Pill Tabs) -->
          <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-4 mb-4">
            <button 
              onclick="CEOView.switchTab('dashboard')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2 ${CEOView.currentTab === 'dashboard' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.home('w-4 h-4')}
              <span>Boshqaruv (Dashboard)</span>
            </button>

            <button 
              onclick="CEOView.switchTab('funnel')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2 ${CEOView.currentTab === 'funnel' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.box('w-4 h-4')}
              <span>Jarayon voronkasi (${overview.activeOrdersCount} ta faol)</span>
            </button>

            <button 
              onclick="CEOView.switchTab('hr')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2 ${CEOView.currentTab === 'hr' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.users('w-4 h-4')}
              <span>Xodimlar boshqaruvi (HR)</span>
            </button>

            <button 
              onclick="CEOView.switchTab('album_types')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2 ${CEOView.currentTab === 'album_types' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.album('w-4 h-4')}
              <span>Vinetka turlari (${(store.albumTypes || []).length} ta)</span>
            </button>

            <button 
              onclick="CEOView.switchTab('seasons')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2 ${CEOView.currentTab === 'seasons' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.calendar('w-4 h-4')}
              <span>Oylar hisoboti (${store.getPeriodLabel(store.selectedSeasonId)})</span>
            </button>

            <button 
              onclick="CEOView.switchTab('regions')" 
              class="payno-pill-btn px-5 py-3.5 min-h-[50px] text-xs sm:text-[13px] font-extrabold transition-all shrink-0 flex items-center gap-2 ${CEOView.currentTab === 'regions' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#1C1C1E] hover:bg-[#F0F0F0]'}"
            >
              ${Icons.mapPin('w-4 h-4')}
              <span>Viloyatlar (${(store.getRegions()).length} ta)</span>
            </button>

            <div class="ml-auto flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shrink-0">
              <span class="text-xs font-semibold text-[#808080] flex items-center gap-1.5">
                ${Icons.calendar('w-3.5 h-3.5 text-[#d64138]')}
                <span>Oy va Yil:</span>
              </span>
              <select 
                onchange="CEOView.handlePeriodChange(this.value)" 
                class="text-xs font-extrabold text-[#000000] bg-transparent border-0 outline-none cursor-pointer"
              >
                ${store.renderPeriodSelectOptions(store.selectedSeasonId)}
              </select>
            </div>
          </div>

          <!-- Tab Content Display -->
          ${CEOView.currentTab === 'dashboard' ? CEOView.renderDashboardTab(overview) : ''}
          ${CEOView.currentTab === 'funnel' ? CEOView.renderFunnelTab(overview) : ''}
          ${CEOView.currentTab === 'hr' ? CEOView.renderHRTab() : ''}
          ${CEOView.currentTab === 'album_types' ? CEOView.renderAlbumTypesTab() : ''}
          ${CEOView.currentTab === 'seasons' ? CEOView.renderSeasonsTab() : ''}
          ${CEOView.currentTab === 'regions' ? CEOView.renderRegionsTab() : ''}
        </div>
      </div>
    `;
  },

  switchTab: (tab) => {
    CEOView.currentTab = tab;
    App.render();
  },

  handlePeriodChange: (periodId) => {
    store.setSelectedSeason(periodId);
    App.render();
  },

  // 1. Boshqaruv Ko'rsatkichlari (Payno Earning ekrani uslubida)
  renderDashboardTab: (overview) => {
    return `
      <!-- Top Big Earning Card (Design Namuna Hero White Card + 4 Soft Inner Stat Boxes) -->
      <section class="mb-6">
        <div class="payno-card p-6 sm:p-7 bg-white relative overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-semibold text-[#808080]">
              Kompaniya sof foydasi
            </span>
            <span class="px-3.5 py-1 rounded-full bg-[#1C1C1E] text-white text-xs font-bold">
              ${overview.activeOrdersCount} faol guruh / ${overview.totalOrdersCount} jami
            </span>
          </div>

          <div class="mb-6">
            <div class="text-4xl sm:text-5xl font-extrabold text-[#000000] tracking-tight">
              ${Store.formatMoney(overview.netProfit)}
            </div>
            <p class="text-xs text-[#808080] mt-2">Tasdiqlangan barcha tushumlardan jami xarajatlar chiqarilgandan keyingi sof daromad</p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="bg-[#F9F9F9] rounded-[24px] p-4">
              <span class="text-[#808080] font-semibold block text-[11px] mb-1">Jami kassa tushumi</span>
              <span class="text-[#000000] font-extrabold text-base">${Store.formatMoney(overview.totalRevenue)}</span>
            </div>
            <div class="bg-[#F9F9F9] rounded-[24px] p-4">
              <span class="text-[#FF0000] font-bold block text-[11px] mb-1">Jami xarajatlar</span>
              <span class="text-[#000000] font-extrabold text-base">-${Store.formatMoney(overview.totalExpenses)}</span>
            </div>
            <div class="bg-[#d64138]/[0.06] rounded-[24px] p-4">
              <span class="text-[#d64138] font-bold block text-[11px] mb-1">Xodimlardagi naqd</span>
              <span class="text-[#d64138] font-extrabold text-base">${Store.formatMoney(overview.totalSellerCashInHand)}</span>
            </div>
            <div class="bg-[#F9F9F9] rounded-[24px] p-4">
              <span class="text-[#808080] font-semibold block text-[11px] mb-1">Jami albomlar (tiraj)</span>
              <span class="text-[#000000] font-extrabold text-base">${overview.totalPiecesProduced} dona</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tezkor Statistika Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <!-- 1. Voronka Qisqa Holati -->
        <div class="payno-card p-6 bg-white">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-900">Jarayon holati</h4>
            <span onclick="CEOView.switchTab('funnel')" class="text-xs font-bold text-blue-600 cursor-pointer hover:underline">Voronka &rarr;</span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-600 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Fotosessiyada</span>
              </span>
              <span class="font-extrabold text-slate-900">${overview.funnel.photoQueue + overview.funnel.photoActive} guruh</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Dizayn va montajda</span>
              </span>
              <span class="font-extrabold text-slate-900">${overview.funnel.editQueue + overview.funnel.editActive} guruh</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Yigʻish jarayonida</span>
              </span>
              <span class="font-extrabold text-slate-900">${overview.funnel.makeQueue + overview.funnel.makeActive} guruh</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Tayyor / Javonda</span>
              </span>
              <span class="font-extrabold text-slate-900">${overview.funnel.ready} guruh</span>
            </div>
          </div>
        </div>

        <!-- 2. Xarajatlar Strukturasi -->
        <div class="payno-card p-6 bg-white">
          <h4 class="text-sm font-bold text-slate-900 mb-4">Xarajatlar taqsimoti</h4>
          <div class="space-y-2.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Sotuvchilar komissiyasi:</span>
              <span class="font-bold text-slate-900">${Store.formatMoney(overview.details.totalCommissionsPaid)}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Dizaynerlar haqi:</span>
              <span class="font-bold text-slate-900">${Store.formatMoney(overview.details.totalEditorCosts)}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Albom yasovchilar haqi:</span>
              <span class="font-bold text-slate-900">${Store.formatMoney(overview.details.totalMakerCosts)}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Fotograf oylik maoshi:</span>
              <span class="font-bold text-slate-900">${Store.formatMoney(overview.details.totalSalaries)}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Ofis va doimiy xarajatlar:</span>
              <span class="font-bold text-slate-900">${Store.formatMoney(overview.details.totalCompanyExpenses)}</span>
            </div>
          </div>
        </div>

        <!-- 3. Xodimlar Ro'yxati Tezkor -->
        <div class="payno-card p-6 bg-white">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-900">Jamoa xodimlari</h4>
            <span onclick="CEOView.switchTab('hr')" class="text-xs font-bold text-blue-600 cursor-pointer hover:underline">HR &rarr;</span>
          </div>

          <div class="space-y-2.5">
            ${store.users.slice(0, 4).map(u => `
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <img src="${u.avatar}" class="w-6 h-6 rounded-full object-cover" />
                  <span class="font-bold text-slate-800">${u.name}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold capitalize">${u.role}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Barcha Buyurtmalar Ro'yxati (Boshqaruv va Override) -->
      <section class="payno-card p-6 bg-white">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900">Barcha buyurtmalar va nazorat (Override)</h3>
            <p class="text-xs text-slate-400">Har qanday buyurtma ichiga kirib status yoki maʼlumotlarni oʻzgartirish huquqi</p>
          </div>
        </div>

        <div class="space-y-3">
          ${store.orders.filter(o => store.matchesPeriod(o, store.selectedSeasonId)).map(order => `
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-extrabold text-slate-900">${order.id}</span>
                  <span class="text-xs font-bold text-slate-700">${order.university} (${order.group})</span>
                </div>
                <div class="text-[11px] text-slate-500">
                  Sotuvchi: <strong>${((store.users || []).find(u => u.id === order.sellerId))?.name || order.sellerName || 'Sotuvchi'}</strong> &bull; Sardor: <strong>${order.leaderName} (${order.leaderPhone})</strong>
                </div>
              </div>

              <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div>
                  ${Components.StatusBadge(order)}
                </div>
                <button 
                  onclick="CEOView.openOverrideModal('${order.id}')" 
                  class="payno-pill-btn px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                >
                  ${Icons.edit('w-3.5 h-3.5')}
                  <span>Tahrirlash</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  // 2. Jarayon Voronkasi (Funnel)
  renderFunnelTab: (overview) => {
    const f = overview.funnel;

    return `
      <div class="payno-card p-6 bg-white mb-6">
        <h3 class="text-base font-bold text-slate-900 mb-1">Buyurtmalar jarayon voronkasi</h3>
        <p class="text-xs text-slate-400 mb-6">Har bir bosqichdagi guruhlar soni va dinamikasi</p>

        <!-- Voronka Vizual Ustunlari (Payno Bar pattern) -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div class="text-2xl font-extrabold text-amber-700 mb-1">${f.photoQueue + f.photoActive}</div>
            <div class="text-xs font-bold text-amber-900">1. Fotosessiya</div>
            <div class="text-[10px] text-amber-600 mt-1">${f.photoQueue} navbat / ${f.photoActive} aktiv</div>
          </div>

          <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <div class="text-2xl font-extrabold text-purple-700 mb-1">${f.editQueue + f.editActive}</div>
            <div class="text-xs font-bold text-purple-900">2. Dizayn / Edit</div>
            <div class="text-[10px] text-purple-600 mt-1">${f.editQueue} navbat / ${f.editActive} aktiv</div>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
            <div class="text-2xl font-extrabold text-blue-700 mb-1">${f.makeQueue + f.makeActive}</div>
            <div class="text-xs font-bold text-blue-900">3. Albom yigʻish</div>
            <div class="text-[10px] text-blue-600 mt-1">${f.makeQueue} navbat / ${f.makeActive} aktiv</div>
          </div>

          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div class="text-2xl font-extrabold text-emerald-700 mb-1">${f.ready}</div>
            <div class="text-xs font-bold text-emerald-900">4. Javonda (Tayyor)</div>
            <div class="text-[10px] text-emerald-600 mt-1">Sotuvchi olishi kerak</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center col-span-2 sm:col-span-1">
            <div class="text-2xl font-extrabold text-slate-800 mb-1">${f.delivered + f.closed}</div>
            <div class="text-xs font-bold text-slate-900">5. Topshirilgan</div>
            <div class="text-[10px] text-slate-500 mt-1">${f.closed} ta toʻliq yopilgan</div>
          </div>
        </div>

        <!-- Bosqichlar bo'yicha guruhlar ro'yxati -->
        <div class="space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Hozir navbatda turgan va jarayondagi guruhlar</h4>
          <div class="space-y-2">
            ${store.orders.filter(o => o.status !== 'closed').map(order => `
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span class="text-xs font-extrabold text-slate-900">${order.id} &bull; ${order.group}</span>
                  <div class="text-[11px] text-slate-500">${order.university}</div>
                </div>
                <div>
                  ${Components.StatusBadge(order)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // 3. Xodimlar Boshqaruvi (HR - Yangi xodim, Login/Parol, Bloklash, O'chirish)
  renderHRTab: () => {
    const activeRegions = store.getRegions ? store.getRegions() : [];
    let userList = store.users;
    if (CEOView.selectedHRRegion && CEOView.selectedHRRegion !== 'all') {
      userList = userList.filter(u => u.region === CEOView.selectedHRRegion);
    }

    return `
      <div class="payno-card p-6 bg-white mb-6">
        <!-- Viloyatlar filtri (Xodimlar bo'limida eng tepada) -->
        <div class="mb-4 pb-3 border-b border-slate-100">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Viloyatlar boʻyicha filter:
          </div>
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              onclick="CEOView.setHRRegion('all')" 
              class="px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] font-extrabold shrink-0 transition-all min-h-[40px] flex items-center justify-center shadow-2xs ${CEOView.selectedHRRegion === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'}"
            >
              Barcha viloyatlar (Umumiy: ${store.users.length} nafar)
            </button>
            ${activeRegions.map(reg => {
              const regCount = store.users.filter(u => u.region === reg).length;
              const isSel = CEOView.selectedHRRegion === reg;
              return `
                <button 
                  onclick="CEOView.setHRRegion('${reg}')" 
                  class="px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold shrink-0 transition-all min-h-[40px] flex items-center gap-1.5 shadow-2xs ${isSel ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'}"
                >
                  <span>${reg}</span>
                  ${regCount > 0 ? `<span class="px-1.5 py-0.5 rounded-full text-[10px] font-black ${isSel ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'}">${regCount}</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h3 class="text-base font-bold text-slate-900">Xodimlar roʻyxati</h3>
            <p class="text-xs text-slate-400">
              ${CEOView.selectedHRRegion === 'all' 
                ? 'Kompaniyaning barcha hududlardagi va umumiy xodimlari' 
                : `Hozir faqat <strong>${CEOView.selectedHRRegion}</strong> viloyatidagi xodimlar koʻrsatilmoqda`}
            </p>
          </div>
          <button 
            onclick="CEOView.openAddUserModal()" 
            class="payno-pill-btn payno-btn-primary px-4 py-2.5 text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            ${Icons.plus('w-3.5 h-3.5')}
            <span>+ ${CEOView.selectedHRRegion !== 'all' ? `${CEOView.selectedHRRegion}ga xodim qoʻshish` : 'Yangi xodim qoʻshish'}</span>
          </button>
        </div>

        ${userList.length === 0 ? `
          <div class="py-12 text-center text-slate-400 text-xs font-semibold bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-2">
            ${CEOView.selectedHRRegion} viloyatida hozircha xodimlar mavjud emas.<br>
            <span class="text-[11px] text-slate-400 mt-1 block font-normal">
              Yuqoridagi "+ ${CEOView.selectedHRRegion}ga xodim qoʻshish" tugmasini bosib toʻgʻridan-toʻgʻri shu viloyatga biriktirishingiz mumkin.
            </span>
          </div>
        ` : `
          <div class="space-y-3">
            ${userList.map(u => `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img src="${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}" class="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200" />
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-slate-900 text-sm">${u.name}</span>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'blocked' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}">
                        ${u.status === 'blocked' ? 'Bloklangan' : 'Faol'}
                      </span>
                      ${u.role === 'worker' ? `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Oddiy ishchi (Rollsiz)
                        </span>
                      ` : ''}
                      ${u.role !== 'ceo' ? `
                        ${u.region && u.region !== 'all' ? `
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200/80 flex items-center gap-1 shadow-2xs">
                            ${Icons.mapPin('w-2.5 h-2.5 text-blue-600')}
                            <span>${u.region}</span>
                          </span>
                        ` : `
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                            Umumiy xodim (Viloyatsiz)
                          </span>
                        `}
                      ` : ''}
                    </div>
                    <div class="text-xs text-slate-500 mt-0.5">
                      Kasbi: <strong class="capitalize">${u.role === 'worker' ? 'Oddiy ishchi' : u.role}</strong>
                      ${u.role !== 'worker' ? `
                        &bull; Login: <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-800">${u.username}</code> &bull; Parol: <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-800">${u.password}</code>
                      ` : ' &bull; <span class="text-slate-400 italic">Saytga kirmaydi (Faqat payroll)</span>'}
                    </div>
                    <div class="text-[11px] text-slate-400 mt-0.5">
                      Tel: ${u.phone} &bull; TG: ${u.telegram || '-'}
                    </div>
                  </div>
                </div>

                <!-- Harakatlar (Ism/Tel, Hudud, Rasm, Parol, Bloklash, O'chirish) -->
                <div class="flex items-center gap-1.5 self-end sm:self-center flex-wrap">
                  <button 
                    onclick="CEOView.openEditUserModal('${u.id}')" 
                    class="payno-pill-btn px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                    title="Xodimning ism-familiyasi va telefonini tahrirlash"
                  >
                    ${Icons.edit('w-3.5 h-3.5 text-slate-600')}
                    <span>Tahrirlash</span>
                  </button>

                  ${u.role !== 'ceo' ? `
                    <button 
                      onclick="CEOView.openEditUserPhotoModal('${u.id}', '${u.name}', '${u.avatar || ''}')" 
                      class="payno-pill-btn px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                      title="Profil rasmini yuklash yoki oʻzgartirish"
                    >
                      ${Icons.camera('w-3.5 h-3.5 text-indigo-600')}
                      <span>Rasm</span>
                    </button>

                    <button 
                      onclick="CEOView.openEditUserRegionModal('${u.id}', '${u.name}', '${u.region || 'all'}')" 
                      class="payno-pill-btn px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                      title="Viloyatni belgilash yoki oʻzgartirish"
                    >
                      ${Icons.mapPin('w-3.5 h-3.5 text-blue-600')}
                      <span>Hudud</span>
                    </button>
                  ` : ''}

                  ${u.role !== 'worker' ? `
                    <button 
                      onclick="CEOView.openChangePasswordModal('${u.id}', '${u.name}')" 
                      class="payno-pill-btn px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold shadow-2xs"
                      title="Parolni yangilash"
                    >
                      ${Icons.edit('w-3.5 h-3.5')}
                      <span>Parol</span>
                    </button>
                  ` : ''}

                  ${u.role !== 'ceo' ? `
                    <button 
                      onclick="CEOView.toggleUserStatus('${u.id}')" 
                      class="payno-pill-btn px-3 py-1.5 text-xs font-bold shadow-2xs ${u.status === 'blocked' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}"
                    >
                      ${u.status === 'blocked' ? 'Aktivlashtirish' : 'Bloklash'}
                    </button>

                    <button 
                      onclick="CEOView.deleteUser('${u.id}', '${u.name}')" 
                      class="payno-pill-btn px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold shadow-2xs"
                      title="Tizimdan oʻchirish"
                    >
                      ${Icons.trash('w-3.5 h-3.5')}
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  openAddUserModal: () => {
    const isFiltered = CEOView.selectedHRRegion && CEOView.selectedHRRegion !== 'all';
    const assignedRegion = isFiltered ? CEOView.selectedHRRegion : 'all';

    const bodyHtml = `
      <form id="add-user-form" onsubmit="CEOView.handleAddUserSubmit(event)" class="space-y-3.5">
        <!-- 1. Avtomatik Viloyat Belgilanishi Barchasi (Form ichida tanlanmaydi!) -->
        ${isFiltered ? `
          <div class="p-3 bg-blue-50 rounded-2xl border border-blue-200/80 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              ${Icons.mapPin('w-4 h-4 text-blue-600')}
              <span class="text-slate-600">Biriktiriladigan viloyat:</span>
              <strong class="text-blue-900">${assignedRegion} viloyati</strong>
            </div>
            <span class="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">Avtomatik</span>
            <input type="hidden" id="new-user-region" value="${assignedRegion}" />
          </div>
        ` : `
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              ${Icons.mapPin('w-4 h-4 text-slate-500')}
              <span class="text-slate-600">Faoliyat hududi:</span>
              <strong class="text-slate-900">Umumiy xodim (Viloyatsiz)</strong>
            </div>
            <span class="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">Umumiy</span>
            <input type="hidden" id="new-user-region" value="all" />
          </div>
        `}

        <!-- 2. MAJBURIY Xodim rasmi yuklash (Fayl / Galereya) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">
            Xodim rasmi <span class="text-rose-500">* (Majburiy)</span>
          </label>
          <div class="flex items-center gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
            <img 
              id="avatar-preview-img" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" 
              class="w-14 h-14 rounded-full object-cover border-2 border-white shrink-0 shadow-sm" 
            />
            <div class="flex-1 min-w-0">
              <input 
                type="file" 
                id="new-user-photo-file" 
                accept="image/*" 
                class="hidden" 
                onchange="CEOView.handlePhotoUpload(this, 'avatar-preview-img', 'new-user-avatar', 'new-user-file-name')"
              />
              <input type="hidden" id="new-user-avatar" value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" />
              
              <button 
                type="button" 
                onclick="document.getElementById('new-user-photo-file').click()" 
                class="payno-pill-btn bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 flex items-center gap-1.5 shadow-2xs transition-all"
              >
                ${Icons.camera('w-3.5 h-3.5 text-indigo-600')}
                <span>Rasm tanlash (Galereya / Kompyuter)</span>
              </button>
              <div id="new-user-file-name" class="text-[11px] text-slate-500 mt-1 truncate">
                Standart rasm tanlangan (oʻzgartirish uchun tugmani bosing)
              </div>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-1 leading-tight">
            * Xodim profil rasmini oʻzi oʻzgartira olmaydi. Rasm faqat Rahbar tomonidan yuklanadi.
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Ism-familiya <span class="text-rose-500">*</span></label>
          <input type="text" id="new-user-name" required placeholder="Masalan: Bekzod Ergashev" class="payno-input font-bold" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Tizimdagi roli <span class="text-rose-500">*</span></label>
            <select id="new-user-role" onchange="CEOView.handleRoleSelectChange(this.value)" class="payno-input bg-slate-50 font-bold text-xs">
              <option value="seller">Sotuvchi (Seller)</option>
              <option value="photographer">Fotograf</option>
              <option value="editor">Dizayner (Editor)</option>
              <option value="maker">Albom yasovchi</option>
              <option value="accountant">Buxgalter</option>
              <option value="worker">Oddiy ishchi (Rollsiz)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Telefon raqam <span class="text-rose-500">*</span></label>
            <input type="tel" id="new-user-phone" required placeholder="+998 90 123 45 67" class="payno-input text-xs" />
          </div>
        </div>

        <!-- Oddiy ishchi haqida eslatma -->
        <div id="worker-role-notice" class="hidden p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs text-amber-900">
          <strong>Oddiy ishchi:</strong> Ushbu ishchi tizimga kirmaydi (Login/Parol shart emas). Faqatgina buxgalteriya hisob-kitobi va oylik chiqarish uchun roʻyxatga olinadi.
        </div>

        <!-- Login va Parol (Worker uchun yashiriladi) -->
        <div id="login-creds-wrapper" class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Login (Kirish uchun) <span class="text-rose-500">*</span></label>
            <input type="text" id="new-user-username" required placeholder="bekzod" class="payno-input font-bold text-xs" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Parol <span class="text-rose-500">*</span></label>
            <input type="text" id="new-user-password" required value="123" class="payno-input font-bold text-xs" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Ishga kirgan sanasi <span class="text-rose-500">*</span></label>
            <input type="date" id="new-user-start-date" required value="${store.getTodayIsoDate()}" class="payno-input font-bold text-xs" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Telegram username (ixtiyoriy)</label>
            <input type="text" id="new-user-tg" placeholder="@bekzod_vin" class="payno-input text-xs" />
          </div>
        </div>
        <p class="text-[10px] text-slate-400 -mt-1 leading-tight">
          * Oylikka (stavka) ishlovchilar uchun 1-oylik maosh shu sanadan oy oxirigacha (30 kunlik hisobda) avtomatik hisoblanadi.
        </p>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Xodimni roʻyxatdan oʻtkazish
          </button>
        </div>
      </form>
    `;

    App.openModal("Yangi xodim qoʻshish", bodyHtml);
  },

  handleRoleSelectChange: (role) => {
    const credsWrapper = document.getElementById('login-creds-wrapper');
    const workerNotice = document.getElementById('worker-role-notice');
    const usernameInput = document.getElementById('new-user-username');
    const passwordInput = document.getElementById('new-user-password');

    if (role === 'worker') {
      if (credsWrapper) credsWrapper.classList.add('hidden');
      if (workerNotice) workerNotice.classList.remove('hidden');
      if (usernameInput) usernameInput.removeAttribute('required');
      if (passwordInput) passwordInput.removeAttribute('required');
    } else {
      if (credsWrapper) credsWrapper.classList.remove('hidden');
      if (workerNotice) workerNotice.classList.add('hidden');
      if (usernameInput) usernameInput.setAttribute('required', 'required');
      if (passwordInput) passwordInput.setAttribute('required', 'required');
    }
  },

  handlePhotoUpload: (input, previewId, targetId, labelId) => {
    const file = input.files && input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Iltimos, faqat rasm faylini tanlang (JPG, PNG, WebP)!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Rasm hajmi juda katta (maksimal 10MB)!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const previewImg = document.getElementById(previewId);
      const targetInput = document.getElementById(targetId);
      const nameLabel = document.getElementById(labelId);

      if (previewImg) previewImg.src = dataUrl;
      if (targetInput) targetInput.value = dataUrl;
      if (nameLabel) {
        nameLabel.innerHTML = `<span class="text-emerald-600 font-bold">✓ ${file.name}</span> (${(file.size / 1024).toFixed(1)} KB)`;
      }
    };
    reader.readAsDataURL(file);
  },

  openEditUserPhotoModal: (userId, userName, currentAvatar) => {
    const avatar = currentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
    const bodyHtml = `
      <form id="edit-user-photo-form" onsubmit="CEOView.handleEditUserPhotoSubmit(event, '${userId}')" class="space-y-4">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <span class="text-slate-400 font-medium">Xodim:</span>
          <strong class="text-slate-900 ml-1 text-sm">${userName}</strong>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">
            Profil rasmini yangilash <span class="text-rose-500">*</span>
          </label>
          <div class="flex items-center gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
            <img 
              id="edit-avatar-preview" 
              src="${avatar}" 
              class="w-16 h-16 rounded-full object-cover border-2 border-white shrink-0 shadow-sm" 
            />
            <div class="flex-1 min-w-0">
              <input 
                type="file" 
                id="edit-user-photo-file" 
                accept="image/*" 
                class="hidden" 
                onchange="CEOView.handlePhotoUpload(this, 'edit-avatar-preview', 'edit-user-avatar-val', 'edit-user-file-name')"
              />
              <input type="hidden" id="edit-user-avatar-val" value="${avatar}" />
              
              <button 
                type="button" 
                onclick="document.getElementById('edit-user-photo-file').click()" 
                class="payno-pill-btn bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 flex items-center gap-1.5 shadow-2xs transition-all"
              >
                ${Icons.camera('w-3.5 h-3.5 text-indigo-600')}
                <span>Yangi rasm tanlash</span>
              </button>
              <div id="edit-user-file-name" class="text-[11px] text-slate-500 mt-1 truncate">
                Galereya yoki kompyuterdan tanlash
              </div>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-1.5">
            Xodim profil rasmini oʻzi oʻzgartira olmaydi. Rasm faqat Rahbar tomonidan yuklanadi.
          </p>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3 text-xs font-bold shadow-md">
            Rasmni saqlash
          </button>
        </div>
      </form>
    `;

    App.openModal(`${userName} - Profil rasmini yangilash`, bodyHtml);
  },

  handleEditUserPhotoSubmit: (e, userId) => {
    e.preventDefault();
    const avatar = document.getElementById('edit-user-avatar-val').value;
    if (!avatar) {
      alert("Iltimos, rasm tanlang!");
      return;
    }
    store.updateUserAvatar(userId, avatar);
    App.closeModal();
    App.showToast("Xodim profil rasmi muvaffaqiyatli yangilandi!");
    App.render();
  },

  handleAddUserSubmit: (e) => {
    e.preventDefault();
    const role = document.getElementById('new-user-role').value;
    const name = document.getElementById('new-user-name').value.trim();
    const region = document.getElementById('new-user-region').value;
    const phone = document.getElementById('new-user-phone').value.trim();
    const avatar = document.getElementById('new-user-avatar').value.trim();
    const usernameInput = document.getElementById('new-user-username');
    const passwordInput = document.getElementById('new-user-password');
    const telegram = document.getElementById('new-user-tg') ? document.getElementById('new-user-tg').value.trim() : '';

    if (!avatar) {
      alert("Xodim rasmini yuklash majburiy!");
      return;
    }

    const username = (usernameInput && usernameInput.value.trim()) || `worker_${Date.now()}`;
    const password = (passwordInput && passwordInput.value.trim()) || `123`;
    const startDate = document.getElementById('new-user-start-date')?.value || store.getTodayIsoDate();

    const data = {
      name,
      role,
      region,
      phone,
      avatar,
      username,
      password,
      telegram,
      startDate
    };

    store.addUser(data);
    App.closeModal();
    App.showToast(`${data.name} (${data.region === 'all' ? 'Umumiy' : data.region}) tizimga muvaffaqiyatli qoʻshildi!`);
    App.render();
  },

  openEditUserRegionModal: (userId, userName, currentRegion) => {
    const activeRegions = store.getRegions();
    const curr = currentRegion || 'all';

    const bodyHtml = `
      <form id="edit-user-region-form" onsubmit="CEOView.handleEditUserRegionSubmit(event, '${userId}')" class="space-y-4">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <span class="text-slate-400 font-medium">Xodim:</span>
          <strong class="text-slate-900 ml-1 text-sm">${userName}</strong>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            ${Icons.mapPin('w-3.5 h-3.5 text-blue-600')}
            <span>Biriktirilgan faoliyat hududi (Viloyat):</span>
          </label>
          <select id="edit-user-region-val" class="payno-input bg-slate-50 font-bold text-slate-900 cursor-pointer">
            <option value="all" ${curr === 'all' ? 'selected' : ''}>Umumiy xodim (Viloyatsiz — faqat umumiy hisobda turadi)</option>
            ${activeRegions.map(r => `
              <option value="${r}" ${curr === r ? 'selected' : ''}>${r} viloyati</option>
            `).join('')}
          </select>
          <p class="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Agar viloyat tanlansa, bu xodim buxgalteriya boʻlimida oʻsha viloyat tanlanganda va barcha viloyatlar (umumiy)da koʻrinadi. Agar "Umumiy xodim" boʻlsa, faqat umumiy hisob-kitobda koʻrinadi.
          </p>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Hududni saqlash
          </button>
        </div>
      </form>
    `;

    App.openModal("Xodim hududini sozlash", bodyHtml);
  },

  handleEditUserRegionSubmit: (e, userId) => {
    e.preventDefault();
    const region = document.getElementById('edit-user-region-val').value;
    store.updateUserRegion(userId, region);
    App.closeModal();
    App.showToast("Xodim faoliyat hududi muvaffaqiyatli saqlandi!");
    App.render();
  },

  // Xodimning ism-familiyasi va telefonini tahrirlash (Kaskad hamma joyda o'zgaradi)
  openEditUserModal: (userId) => {
    const user = store.users.find(u => u.id === userId);
    if (!user) return;

    const bodyHtml = `
      <form id="edit-user-info-form" onsubmit="CEOView.handleEditUserSubmit(event, '${userId}')" class="space-y-3.5">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <div class="text-xs font-bold text-slate-900">${user.name}</div>
            <div class="text-[11px] text-slate-500 font-medium">@${user.username} &bull; ${user.role}</div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Ism va Familiya</label>
          <input type="text" id="edit-user-name" value="${user.name}" required class="payno-input font-bold" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Telefon raqam</label>
          <input type="tel" id="edit-user-phone" value="${user.phone || ''}" required class="payno-input font-bold" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Telegram manzil</label>
          <input type="text" id="edit-user-telegram" value="${user.telegram || ''}" placeholder="@username" class="payno-input" />
        </div>

        <div class="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900">
          <strong>Avtomatik sinxronizatsiya:</strong> Ism yoki telefon oʻzgartirilganda, ushbu xodim masʼul boʻlgan barcha buyurtmalar (faol va topshirilgan arxivlar), kassa toʻlovlari va oylik qaydlari barcha joyda avtomatik yangilanadi.
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Saqlash va hamma joyda yangilash
          </button>
        </div>
      </form>
    `;

    App.openModal("Xodim maʼlumotlarini tahrirlash", bodyHtml);
  },

  handleEditUserSubmit: (e, userId) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('edit-user-name').value.trim(),
      phone: document.getElementById('edit-user-phone').value.trim(),
      telegram: document.getElementById('edit-user-telegram').value.trim()
    };

    store.updateProfile(userId, data);
    App.closeModal();
    App.showToast("Xodim maʼlumotlari va barcha buyurtmalar muvaffaqiyatli yangilandi!");
    App.render();
  },

  toggleUserStatus: (userId) => {
    const status = store.toggleUserStatus(userId);
    App.showToast(`Xodim holati: ${status === 'blocked' ? 'Bloklandi' : 'Faollashtirildi'}`);
    App.render();
  },

  deleteUser: (userId, name) => {
    if (confirm(`${name} ni tizimdan oʻchirishga ishonchingiz komilmi?`)) {
      const res = store.deleteUser(userId);
      if (res.success) {
        App.showToast("Xodim oʻchirildi!");
        App.render();
      } else {
        alert(res.message);
      }
    }
  },

  openChangePasswordModal: (userId, userName) => {
    const bodyHtml = `
      <form id="change-pwd-form" onsubmit="CEOView.handleChangePasswordSubmit(event, '${userId}')" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">${userName} uchun yangi parol:</label>
          <input type="text" id="new-pwd-val" required placeholder="Yangi parol kiriting" class="payno-input" />
        </div>
        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3 text-xs font-bold shadow-md">
            Parolni yangilash
          </button>
        </div>
      </form>
    `;

    App.openModal("Parolni oʻzgartirish", bodyHtml);
  },

  handleChangePasswordSubmit: (e, userId) => {
    e.preventDefault();
    const newPwd = document.getElementById('new-pwd-val').value.trim();
    store.updateUserPassword(userId, newPwd);
    App.closeModal();
    App.showToast("Parol muvaffaqiyatli oʻzgartirildi!");
    App.render();
  },

  // 4. Vinetka Turlari Katalogi (Rahbar dinamik boshqaradi)
  renderAlbumTypesTab: () => {
    const types = store.albumTypes || [];

    return `
      <div class="payno-card p-6 bg-white mb-6">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900">Vinetka turlari katalogi</h3>
            <p class="text-xs text-slate-400">Yangi vinetka modeli qoʻshish, narxini oʻzgartirish yoki oʻchirish</p>
          </div>
          <button 
            onclick="CEOView.openAddAlbumTypeModal()" 
            class="payno-pill-btn payno-btn-primary px-4 py-2.5 text-xs font-bold shadow-md"
          >
            ${Icons.plus('w-3.5 h-3.5')}
            <span>+ Yangi vinetka turi</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${types.map(t => {
            const usedCount = store.orders.filter(o => o.albumType === t.name).length;
            const makerRate = t.makerRate || 25000;
            return `
              <div class="p-5 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
                      ${Icons.album('w-3.5 h-3.5 inline mr-1')}
                      Model
                    </span>
                    <span class="text-xs font-semibold text-slate-400">
                      ${usedCount} ta guruhda tanlangan
                    </span>
                  </div>

                  <h4 class="text-base font-extrabold text-slate-900 mb-1">${t.name}</h4>
                  <div class="text-sm font-extrabold text-emerald-700 mb-1">
                    ${Store.formatMoney(t.basePrice)} <span class="text-[11px] font-normal text-slate-500">/ dona sotuv narxi</span>
                  </div>
                  <div class="text-xs font-bold text-slate-700 mb-4 flex items-center gap-1.5">
                    <span class="text-slate-400 font-medium">Yasovchi haqi:</span>
                    <span class="text-blue-700 font-extrabold">${Store.formatMoney(makerRate)} / dona</span>
                  </div>
                </div>

                <div class="flex items-center gap-2 pt-3 border-t border-slate-200/60">
                  <button 
                    onclick="CEOView.openEditAlbumTypeModal('${t.id}', '${t.name.replace(/'/g, "\\'")}', ${t.basePrice}, ${makerRate})" 
                    class="flex-1 payno-pill-btn px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
                  >
                    ${Icons.edit('w-3.5 h-3.5')}
                    <span>Tahrirlash</span>
                  </button>
                  <button 
                    onclick="CEOView.deleteAlbumType('${t.id}', '${t.name.replace(/'/g, "\\'")}')" 
                    class="payno-pill-btn px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold transition-all"
                    title="Oʻchirish"
                  >
                    ${Icons.trash('w-3.5 h-3.5')}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  openAddAlbumTypeModal: () => {
    const bodyHtml = `
      <form id="add-album-type-form" onsubmit="CEOView.handleAddAlbumTypeSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Vinetka turi nomi <span class="text-rose-500">*</span></label>
          <input type="text" id="new-type-name" required placeholder="Masalan: Diamond Sparkle Edition" class="payno-input" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Bazaviy sotuv narxi (soʻm / dona) <span class="text-rose-500">*</span></label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="new-type-price" 
            required 
            placeholder="Masalan: 240 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold" 
          />
          <span class="text-[11px] text-slate-400 mt-1 block">Sotuvchi buyurtma ochganda shu narx avtomatik taklif etiladi.</span>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Albom yasovchi (Maker) haqi (soʻm / dona) <span class="text-rose-500">*</span></label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="new-type-maker-rate" 
            required 
            value="25 000" 
            placeholder="Masalan: 25 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold text-blue-900" 
          />
          <span class="text-[11px] text-slate-400 mt-1 block">Ushbu model yigʻilganda yasovchiga hisoblanadigan dona stavkasi.</span>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Katalogga qoʻshish
          </button>
        </div>
      </form>
    `;

    App.openModal("Yangi vinetka turi qoʻshish", bodyHtml);
  },

  handleAddAlbumTypeSubmit: (e) => {
    e.preventDefault();
    const name = document.getElementById('new-type-name').value.trim();
    const price = Store.parseMoney(document.getElementById('new-type-price').value);
    const makerRate = Store.parseMoney(document.getElementById('new-type-maker-rate').value);

    const newType = store.addAlbumType(name, price, makerRate);
    App.closeModal();
    App.showToast(`"${newType.name}" katalogga qoʻshildi!`);
    App.render();
  },

  openEditAlbumTypeModal: (id, currentName, currentPrice, currentMakerRate = 25000) => {
    const bodyHtml = `
      <form id="edit-album-type-form" onsubmit="CEOView.handleEditAlbumTypeSubmit(event, '${id}')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Vinetka turi nomi</label>
          <input type="text" id="edit-type-name" required value="${currentName}" class="payno-input" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Bazaviy sotuv narxi (soʻm / dona)</label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="edit-type-price" 
            required 
            value="${Store.formatNumber(currentPrice)}" 
            placeholder="Masalan: 240 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Albom yasovchi haqi (soʻm / dona)</label>
          <input 
            type="text" 
            inputmode="numeric" 
            id="edit-type-maker-rate" 
            required 
            value="${Store.formatNumber(currentMakerRate)}" 
            placeholder="Masalan: 25 000" 
            oninput="App.formatMoneyInput(this)" 
            class="payno-input font-bold text-blue-900" 
          />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Oʻzgarishlarni saqlash
          </button>
        </div>
      </form>
    `;

    App.openModal("Vinetka turini tahrirlash", bodyHtml);
  },

  handleEditAlbumTypeSubmit: (e, id) => {
    e.preventDefault();
    const name = document.getElementById('edit-type-name').value.trim();
    const price = Store.parseMoney(document.getElementById('edit-type-price').value);
    const makerRate = Store.parseMoney(document.getElementById('edit-type-maker-rate').value);

    store.updateAlbumType(id, name, price, makerRate);
    App.closeModal();
    App.showToast("Vinetka turi yangilandi!");
    App.render();
  },

  deleteAlbumType: (id, name) => {
    if (confirm(`"${name}" vinetka modelini oʻchirmoqchimisiz?`)) {
      const res = store.deleteAlbumType(id);
      if (res.success) {
        App.showToast("Vinetka turi oʻchirildi!");
        App.render();
      } else {
        alert(res.message);
      }
    }
  },

  // 5. Oylar va Yillik Hisobotlar Boshqaruvi (CEO & Rahbar - Ixcham ko'rinish)
  renderSeasonsTab: () => {
    const periods = store.getMonthlyPeriodsList();
    const activePeriodId = store.normalizePeriodId(store.selectedSeasonId);
    const yearPeriod = periods.find(p => p.isYearSummary);
    const monthPeriods = periods.filter(p => !p.isYearSummary);

    return `
      <div class="space-y-4 max-w-4xl mx-auto">
        <!-- Ixcham Boshqaruv Kartasi -->
        <div class="payno-card p-5 bg-white border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Oy va Yil boʻyicha moliya hisobotlari</h3>
              <p class="text-[11px] text-slate-400">Joriy yil umumiy koʻrsatkichi hamda har bir oyning alohida moliyaviy tarixi</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-blue-50 text-[#d64138] text-xs font-extrabold border border-blue-200/60">
              Faol filtr: ${store.getPeriodLabel(activePeriodId)}
            </span>
          </div>

          <!-- 1. Eng tepada: Joriy Yil umumiy hisoboti -->
          ${yearPeriod ? (() => {
            const sum = store.getSeasonSummary(yearPeriod.id);
            const isSelected = activePeriodId === yearPeriod.id;
            return `
              <div class="mb-4">
                <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 px-1">Yillik umumiy hisobot</span>
                <div class="p-4 rounded-2xl ${isSelected ? 'bg-blue-50/70 border-2 border-[#d64138]' : 'bg-slate-900 text-white'} flex items-center justify-between flex-wrap gap-3 shadow-xs">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-extrabold text-sm ${isSelected ? 'text-slate-900' : 'text-white'}">${yearPeriod.name}</span>
                      <span class="px-2 py-0.5 rounded-full bg-[#d64138] text-white text-[9px] font-extrabold">
                        Yillik jami
                      </span>
                    </div>
                    <div class="text-xs ${isSelected ? 'text-slate-600' : 'text-slate-300'} flex items-center gap-3 flex-wrap">
                      <span>Buyurtmalar: <strong class="${isSelected ? 'text-slate-900' : 'text-white'}">${sum.totalOrders} ta</strong></span>
                      <span>Tushum: <strong class="${isSelected ? 'text-emerald-700' : 'text-emerald-400'}">${Store.formatMoney(sum.totalRevenue)}</strong></span>
                      <span>Sof foyda: <strong class="${sum.netProfit >= 0 ? (isSelected ? 'text-emerald-700' : 'text-emerald-400') : 'text-rose-400'}">${Store.formatMoney(sum.netProfit)}</strong></span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button 
                      onclick="CEOView.handlePeriodChange('${yearPeriod.id}')" 
                      class="payno-pill-btn px-3 py-1.5 ${isSelected ? 'bg-[#d64138] text-white' : 'bg-white/15 hover:bg-white/25 text-white'} text-[11px] font-bold"
                    >
                      ${isSelected ? 'Tanlangan' : 'Filtrda koʻrish'}
                    </button>
                    <button 
                      onclick="CEOView.openSeasonDetailsModal('${yearPeriod.id}')" 
                      class="payno-pill-btn px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold shadow-2xs"
                    >
                      Batafsil
                    </button>
                  </div>
                </div>
              </div>
            `;
          })() : ''}

          <!-- 2. Oylar ro'yxati -->
          <div class="pt-3 border-t border-slate-100">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 px-1">Oylar boʻyicha hisobotlar (${monthPeriods.length} ta oy)</span>
            <div class="space-y-2">
              ${monthPeriods.map(mp => {
                const sum = store.getSeasonSummary(mp.id);
                const isSelected = activePeriodId === mp.id;
                return `
                  <div class="p-3.5 rounded-2xl ${isSelected ? 'bg-blue-50/60 border border-blue-200 shadow-2xs' : 'bg-slate-50/70 border border-slate-200/60'} flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-extrabold text-slate-900 text-xs">${mp.name}</span>
                        ${mp.isCurrent ? `
                          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">Joriy oy</span>
                        ` : ''}
                      </div>
                      <div class="text-[11px] text-slate-500 mt-0.5">
                        ${sum.totalOrders} ta buyurtma &bull; Tushum: <strong class="text-emerald-700">${Store.formatMoney(sum.totalRevenue)}</strong> &bull; Sof foyda: <strong class="${sum.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}">${Store.formatMoney(sum.netProfit)}</strong>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <button 
                        onclick="CEOView.handlePeriodChange('${mp.id}')" 
                        class="payno-pill-btn px-3 py-1.5 ${isSelected ? 'bg-[#d64138] text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'} text-[11px] font-bold"
                      >
                        ${isSelected ? 'Tanlangan' : 'Tanlash'}
                      </button>
                      <button 
                        onclick="CEOView.openSeasonDetailsModal('${mp.id}')" 
                        class="payno-pill-btn px-3 py-1.5 bg-white text-slate-700 border border-slate-200 text-[11px] font-bold"
                      >
                        Hisobot
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  openSeasonDetailsModal: (seasonId) => {
    const sum = store.getSeasonSummary(seasonId);
    const bodyHtml = `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div class="flex items-center justify-between mb-1">
            <h4 class="text-base font-extrabold text-slate-900">${sum.season?.name || 'Oy hisoboti'}</h4>
            <span class="px-2 py-0.5 rounded-full ${sum.season?.isCurrent ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'} text-[10px] font-bold">
              ${sum.season?.isCurrent ? 'Joriy oy' : 'Oy/Yil hisoboti'}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-white rounded-2xl border border-slate-100">
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Jami buyurtmalar</span>
            <span class="text-base font-extrabold text-slate-900">${sum.totalOrders} ta</span>
            <span class="text-[11px] text-slate-400 block mt-0.5">${sum.closedOrders} ta toʻliq yopilgan</span>
          </div>
          <div class="p-3 bg-white rounded-2xl border border-slate-100">
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Jami tiraj</span>
            <span class="text-base font-extrabold text-slate-900">${sum.totalPiecesProduced} dona</span>
            <span class="text-[11px] text-slate-400 block mt-0.5">Bitiruvchi talabalar</span>
          </div>
          <div class="p-3 bg-white rounded-2xl border border-slate-100">
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Kassaga tushum</span>
            <span class="text-base font-extrabold text-emerald-700">${Store.formatMoney(sum.totalRevenue)}</span>
            <span class="text-[11px] text-emerald-600 block mt-0.5">Tasdiqlangan</span>
          </div>
          <div class="p-3 bg-white rounded-2xl border border-slate-100">
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Jami xarajatlar</span>
            <span class="text-base font-extrabold text-rose-600">-${Store.formatMoney(sum.totalExpenses)}</span>
            <span class="text-[11px] text-slate-400 block mt-0.5">Ish haqi, ofis, xarajat</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-900 text-white">
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-300 font-semibold">Sof foyda (${sum.season?.name || ''}):</span>
            <span class="text-lg font-extrabold ${sum.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
              ${Store.formatMoney(sum.netProfit)}
            </span>
          </div>
        </div>
      </div>
    `;

    App.openModal(`Hisobot: ${sum.season?.name || ''}`, bodyHtml);
  },

  // 6. Viloyatlar (Hududlar) Boshqaruvi
  renderRegionsTab: () => {
    const regions = store.getRegions();
    const orders = store.orders || [];

    return `
      <div class="space-y-4 max-w-4xl mx-auto">
        <div class="payno-card p-6 bg-white border border-slate-200/80 shadow-xs">
          <div class="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Faol viloyatlar (Hududlar) boshqaruvi</h3>
              <p class="text-[11px] text-slate-400">
                Sotuvchilar buyurtma olishi va buxgalteriya filtrlashi mumkin boʻlgan amaldagi hududlar
              </p>
            </div>
            <button 
              onclick="CEOView.openAddRegionModal()" 
              class="payno-pill-btn payno-btn-primary px-3.5 py-2 text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              ${Icons.plus('w-3.5 h-3.5')}
              <span>+ Yangi viloyat qoʻshish</span>
            </button>
          </div>

          <div class="p-3 mb-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 flex items-start gap-2.5">
            <span class="text-blue-600 mt-0.5">${Icons.mapPin('w-4 h-4')}</span>
            <div>
              <strong>Eslatma:</strong> Bu yerda qoʻshilgan viloyatlar Sotuvchining yangi buyurtma yaratish oynasida va Buxgalteriyaning viloyatlar filtrida avtomatik aks etadi. Ish toʻxtagan viloyatni oʻchirsangiz, u yangi buyurtmalar qabul qilish roʻyxatidan olib tashlanadi.
            </div>
          </div>

          <!-- Viloyatlar Ro'yxati Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${regions.map(r => {
              const regOrders = orders.filter(o => o.region === r);
              const activeCount = regOrders.filter(o => o.status !== 'closed').length;
              const revenue = regOrders.reduce((sum, o) => sum + ((o.sellerSubmittedAmount || 0) + (o.photographerSubmittedAmount || 0)), 0);

              return `
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <span class="text-blue-600">${Icons.mapPin('w-3.5 h-3.5')}</span>
                        <span>${r}</span>
                      </div>
                      <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        ${regOrders.length} guruh
                      </span>
                    </div>

                    <div class="text-[11px] text-slate-500 space-y-1 mb-3">
                      <div class="flex items-center justify-between">
                        <span>Faol guruhlar:</span>
                        <strong class="text-slate-800">${activeCount} ta</strong>
                      </div>
                      <div class="flex items-center justify-between">
                        <span>Kassaga tushum:</span>
                        <strong class="text-emerald-700">${Store.formatMoney(revenue)}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                    <button 
                      onclick="CEOView.handleDeleteRegion('${r.replace(/'/g, "\\'")}')" 
                      class="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex items-center gap-1"
                      title="Ushbu viloyatni oʻchirish"
                    >
                      ${Icons.trash('w-3 h-3')}
                      <span>Oʻchirish</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  openAddRegionModal: () => {
    const existing = store.getRegions();
    const commonSuggestions = [
      'Toshkent shahri', 'Toshkent viloyati', 'Samarqand', 'Buxoro',
      'Andijon', "Farg'ona", 'Namangan', 'Qashqadaryo',
      'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax',
      'Sirdaryo', "Qoraqalpog'iston Respublikasi"
    ].filter(r => !existing.includes(r));

    const bodyHtml = `
      <form id="add-region-form" onsubmit="CEOView.handleAddRegionSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            Viloyat (Hudud) nomi <span class="text-rose-500">*</span>
          </label>
          <input 
            type="text" 
            id="new-region-name" 
            required 
            placeholder="Masalan: Samarqand yoki Toshkent shahri" 
            class="payno-input font-bold" 
          />
        </div>

        ${commonSuggestions.length > 0 ? `
          <div>
            <span class="text-[11px] font-bold text-slate-500 block mb-1.5">Tezkor tanlash (Tavsiya qilingan hududlar):</span>
            <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              ${commonSuggestions.map(s => `
                <button 
                  type="button" 
                  onclick="document.getElementById('new-region-name').value = '${s.replace(/'/g, "\\'")}'"
                  class="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-900 rounded-full text-xs font-medium text-slate-700 transition-all"
                >
                  + ${s}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          Ushbu viloyat qoʻshilgach, Sotuvchi yangi buyurtma olishda uni tanlay oladi va Buxgalteriya sahifasida viloyat filtri sifatida paydo boʻladi.
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Viloyatni tizimga qoʻshish
          </button>
        </div>
      </form>
    `;

    App.openModal("Yangi faol viloyat qoʻshish", bodyHtml);
  },

  handleAddRegionSubmit: (e) => {
    e.preventDefault();
    const name = document.getElementById('new-region-name').value.trim();
    const res = store.addRegion(name);
    if (res.success) {
      App.closeModal();
      App.showToast(res.message);
      App.render();
    } else {
      alert(res.message);
    }
  },

  handleDeleteRegion: (name) => {
    if (confirm(`"${name}" viloyatini faol hududlar roʻyxatidan oʻchirmoqchimisiz?`)) {
      const res = store.deleteRegion(name);
      if (res.success) {
        App.showToast(res.message);
        App.render();
      } else {
        alert(res.message);
      }
    }
  },

  // Rahbar uchun buyurtmani to'liq o'zgartirish (Override) modali
  openOverrideModal: (orderId) => {
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    const sellers = (store.users || []).filter(u => u.role === 'seller' || u.role === 'ceo');
    const photographers = (store.users || []).filter(u => u.role === 'photographer');
    const editors = (store.users || []).filter(u => u.role === 'editor');
    const makers = (store.users || []).filter(u => u.role === 'maker');

    const bodyHtml = `
      <form id="override-form" onsubmit="CEOView.handleOverrideSubmit(event, '${order.id}')" class="space-y-3.5">
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <span class="font-bold text-slate-900">${order.id} &bull; ${order.university} (${order.group})</span>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Buyurtma statusi (Override)</label>
          <select id="ovr-status" class="payno-input bg-slate-50 font-bold">
            <option value="photo_queue" ${order.status === 'photo_queue' ? 'selected' : ''}>Foto navbatda</option>
            <option value="photo_active" ${order.status === 'photo_active' ? 'selected' : ''}>Fotosessiyada</option>
            <option value="edit_queue" ${order.status === 'edit_queue' ? 'selected' : ''}>Edit navbatda</option>
            <option value="edit_active" ${order.status === 'edit_active' ? 'selected' : ''}>Editda</option>
            <option value="make_queue" ${order.status === 'make_queue' ? 'selected' : ''}>Yigʻish navbatda</option>
            <option value="make_active" ${order.status === 'make_active' ? 'selected' : ''}>Yigʻilmoqda</option>
            <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Tayyor (Javonda)</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Topshirildi</option>
            <option value="closed" ${order.status === 'closed' ? 'selected' : ''}>Yopilgan</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Talabalar soni</label>
            <input type="number" id="ovr-students" value="${order.realStudentCount || order.studentCount}" class="payno-input font-bold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Dona narxi (soʻm)</label>
            <input 
              type="text" 
              inputmode="numeric" 
              id="ovr-price" 
              value="${Store.formatNumber(order.pricePerStudent)}" 
              placeholder="Masalan: 240 000" 
              oninput="App.formatMoneyInput(this)" 
              class="payno-input font-bold" 
            />
          </div>
        </div>

        <!-- Mas'ul xodimlarni tayinlash / o'zgartirish (Barcha tarixdagi va faol buyurtmalar uchun) -->
        <div class="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2.5">
          <div class="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
            ${Icons.user('w-3.5 h-3.5 text-indigo-600')}
            <span>Masʼul xodimlarni biriktirish / oʻzgartirish</span>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Masʼul Sotuvchi</label>
            <select id="ovr-seller" class="payno-input text-xs font-semibold">
              <option value="">-- Sotuvchi tanlanmagan --</option>
              ${sellers.map(s => `
                <option value="${s.id}" ${order.sellerId === s.id ? 'selected' : ''}>
                  ${s.name} (${s.phone || 'Tel koʻrsatilmagan'})
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Masʼul Fotograf</label>
            <select id="ovr-photographer" class="payno-input text-xs font-semibold">
              <option value="">-- Fotograf biriktirilmagan (Navbatda) --</option>
              ${photographers.map(p => `
                <option value="${p.id}" ${order.photographerId === p.id ? 'selected' : ''}>
                  ${p.name} (${p.phone || 'Tel koʻrsatilmagan'})
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Masʼul Dizayner / Editor</label>
            <select id="ovr-editor" class="payno-input text-xs font-semibold">
              <option value="">-- Dizayner biriktirilmagan (Navbatda) --</option>
              ${editors.map(e => `
                <option value="${e.id}" ${order.editorId === e.id ? 'selected' : ''}>
                  ${e.name} (${e.phone || 'Tel koʻrsatilmagan'})
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Masʼul Albom yasovchi</label>
            <select id="ovr-maker" class="payno-input text-xs font-semibold">
              <option value="">-- Albom yasovchi biriktirilmagan (Navbatda) --</option>
              ${makers.map(m => `
                <option value="${m.id}" ${order.makerId === m.id ? 'selected' : ''}>
                  ${m.name} (${m.phone || 'Tel koʻrsatilmagan'})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-xs font-bold shadow-md">
            Oʻzgarishlarni tasdiqlash (Override)
          </button>
        </div>
      </form>
    `;

    App.openModal("Buyurtmani tahrirlash (CEO)", bodyHtml);
  },

  handleOverrideSubmit: (e, orderId) => {
    e.preventDefault();
    const updateData = {
      status: document.getElementById('ovr-status').value,
      realStudentCount: Number(document.getElementById('ovr-students').value),
      pricePerStudent: Store.parseMoney(document.getElementById('ovr-price').value),
      sellerId: document.getElementById('ovr-seller').value || null,
      photographerId: document.getElementById('ovr-photographer').value || null,
      editorId: document.getElementById('ovr-editor').value || null,
      makerId: document.getElementById('ovr-maker').value || null
    };

    store.overrideOrder(orderId, updateData);
    App.closeModal();
    App.showToast("Buyurtma va masʼul xodimlar muvaffaqiyatli yangilandi!");
    App.render();
  }
};

window.CEOView = CEOView;

