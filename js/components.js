/* ====================================================================
   VINETKA CRM & ERP - SHARED UI COMPONENTS (PAYNO FINTECH PATTERNS)
   ==================================================================== */

const Components = {
  // 1. O'zgarmas Header Component
  Header: (user, onProfileClick, onLogoutClick) => {
    if (!user) return '';

    const roleNames = {
      seller: 'Sotuvchi',
      photographer: 'Fotograf',
      editor: 'Dizayner / Editor',
      maker: 'Albom yasovchi',
      accountant: 'Buxgalter',
      ceo: 'Rahbar (CEO)',
      worker: 'Oddiy ishchi'
    };

    return `
      <header class="payno-app-header flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 bg-[#F6F6F6]/90 backdrop-blur-xl sticky top-0 z-40 transition-all">
        <!-- Chapda: Profil rasmi va ism-familiya (Bosilganda profil ochiladi) -->
        <div onclick="${onProfileClick}" class="flex items-center gap-3 cursor-pointer group select-none py-1.5 pl-1.5 pr-3.5 rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all" title="Profilni tahrirlash">
          <div class="relative shrink-0">
            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover" />
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-[#34C759] border-2 border-white rounded-full"></span>
          </div>
          <div class="min-w-0">
            <div class="text-[10px] font-bold tracking-wider uppercase text-[#808080] leading-none mb-1 truncate">
              ${roleNames[user.role] || user.role}
            </div>
            <div class="text-[13.5px] font-extrabold text-[#1C1C1E] flex items-center gap-1.5 transition-colors leading-tight">
              <span class="truncate max-w-[125px] sm:max-w-[190px]">${user.name}</span>
              <span class="text-[#d64138] shrink-0">${Icons.edit('w-3.5 h-3.5')}</span>
            </div>
          </div>
        </div>

        <!-- O'rtada: Kompaniya nomi -->
        <div class="hidden sm:flex items-center gap-2 select-none px-5 py-2.5 rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.06)]">
          <span class="text-sm font-black text-[#1C1C1E] tracking-tight">Neo <span class="text-[#d64138]">Vinetka</span></span>
        </div>

        <!-- O'ngda: Chiqish (Logout) tugmasi -->
        <div class="flex items-center gap-2">
          <button onclick="${onLogoutClick}" title="Tizimdan chiqish" class="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#d64138] text-[#d64138] hover:text-white shadow-[0_0_20px_rgba(0,0,0,0.06)] transition-all active:scale-[0.96] text-xs font-bold min-h-[42px]">
            <span class="shrink-0">${Icons.logout('w-4 h-4')}</span>
            <span class="font-bold">Chiqish</span>
          </button>
        </div>
      </header>
    `;
  },

  // 2. Status Badge Generator (Apple iOS 18 Capsule Badge system)
  StatusBadge: (order) => {
    let badgeClass = 'badge-photo-queue';
    let badgeText = 'Foto navbatda';
    let iconSvg = Icons.camera('w-3.5 h-3.5');
    let holderRole = 'Fotograflar stoli';
    let holderName = 'Umumiy navbatda';
    let holderPhone = '-';

    const users = (typeof store !== 'undefined' && store.users) ? store.users : [];
    const photoUser = users.find(u => u.id === order.photographerId);
    const editorUser = users.find(u => u.id === order.editorId);
    const makerUser = users.find(u => u.id === order.makerId);
    const sellerUser = users.find(u => u.id === order.sellerId);

    const photoName = photoUser?.name || order.photographerName || 'Fotograf';
    const photoPhone = photoUser?.phone || order.photographerPhone || '';
    const editorName = editorUser?.name || order.editorName || 'Dizayner';
    const editorPhone = editorUser?.phone || order.editorPhone || '';
    const makerName = makerUser?.name || order.makerName || 'Albom yasovchi';
    const makerPhone = makerUser?.phone || order.makerPhone || '';
    const sellerName = sellerUser?.name || order.sellerName || 'Sotuvchi';
    const sellerPhone = sellerUser?.phone || order.sellerPhone || '';

    switch (order.status) {
      case 'photo_queue':
        badgeClass = 'badge-photo-queue';
        badgeText = 'Foto navbatda';
        iconSvg = Icons.camera('w-3.5 h-3.5');
        holderRole = 'Fotograflar stoli';
        holderName = 'Hali hech kim olmagan (Navbatda)';
        break;
      case 'photo_active':
        badgeClass = 'badge-photo-active';
        badgeText = 'Fotosessiyada';
        iconSvg = Icons.aperture('w-3.5 h-3.5');
        holderRole = 'Fotograf';
        holderName = photoName;
        holderPhone = photoPhone;
        break;
      case 'edit_queue':
        badgeClass = 'badge-edit-queue';
        badgeText = 'Edit navbatda';
        iconSvg = Icons.palette('w-3.5 h-3.5');
        holderRole = 'Dizaynerlar stoli';
        holderName = 'Suratlar topshirilgan (Navbatda)';
        break;
      case 'edit_active':
        badgeClass = 'badge-edit-active';
        badgeText = 'Editda';
        iconSvg = Icons.palette('w-3.5 h-3.5');
        holderRole = 'Dizayner';
        holderName = editorName;
        holderPhone = editorPhone;
        break;
      case 'make_queue':
        badgeClass = 'badge-make-queue';
        badgeText = 'Yigʻish navbatda';
        iconSvg = Icons.layers('w-3.5 h-3.5');
        holderRole = 'Albomchilar stoli';
        holderName = 'Maket tasdiqlangan (Pechat navbatda)';
        break;
      case 'make_active':
        badgeClass = 'badge-make-active';
        badgeText = 'Yigʻilmoqda';
        iconSvg = Icons.layers('w-3.5 h-3.5');
        holderRole = 'Albom yasovchi';
        holderName = makerName;
        holderPhone = makerPhone;
        break;
      case 'ready':
        badgeClass = 'badge-ready pulse-badge';
        badgeText = 'Tayyor (Javonda)';
        iconSvg = Icons.checkCircle('w-3.5 h-3.5');
        holderRole = 'Tayyor mahsulot javoni';
        holderName = 'Albomlar javonda kutmoqda (Sotuvchi olishi kerak)';
        break;
      case 'delivered':
        badgeClass = 'badge-delivered';
        badgeText = 'Topshirildi';
        iconSvg = Icons.check('w-3.5 h-3.5');
        holderRole = 'Mijozga topshirgan: ' + sellerName;
        holderName = sellerName;
        holderPhone = sellerPhone;
        break;
      case 'closed':
        badgeClass = 'badge-closed';
        badgeText = 'Yopilgan';
        iconSvg = Icons.receipt('w-3.5 h-3.5');
        holderRole = 'Buxgalteriya';
        holderName = 'Toʻliq hisob-kitob yopilgan';
        break;
    }

    return `
      <div 
        onclick="event.stopPropagation(); App.showStatusDetail('${order.id}', '${badgeText.replace(/'/g, "\\'")}', '${holderRole.replace(/'/g, "\\'")}', '${holderName.replace(/'/g, "\\'")}', '${holderPhone.replace(/'/g, "\\'")}')"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeClass} cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shadow-2xs"
        title="Hozir kimdaligini koʻrish uchun bosing"
      >
        <span class="shrink-0 flex items-center justify-center">${iconSvg}</span>
        <span>${badgeText}</span>
      </div>
    `;
  },

  // 3. Compact Order Card Component (Sotuvchi, Fotograf, Dizayner uchun ixcham karta)
  // Tashqi ko'rinishida faqatgina Vinetka kodi (ID), Shahar, Universitet, Fakultet va Ism ko'rinadi
  OrderCard: (order, onClickAction) => {
    return `
      <div 
        onclick="${onClickAction}" 
        class="payno-card p-4 mb-2.5 bg-white relative cursor-pointer active:scale-[0.98] transition-all group"
        title="Batafsil maʻlumotlarni koʻrish uchun bosing"
      >
        <!-- Tepasi: Vinetka ID, Shahar/Viloyat va Status Badge -->
        <div class="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#EDEDED]">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-xs font-extrabold tracking-tight text-[#1C1C1E] bg-[#F0F0F0] px-3 py-1 rounded-full shrink-0">
              ${order.id}
            </span>
            <span class="text-[11px] font-bold text-[#d64138] flex items-center gap-1 truncate shrink-0">
              ${Icons.mapPin('w-3.5 h-3.5 text-[#d64138] shrink-0')}
              <span>${order.region || 'Toshkent shahri'}</span>
            </span>
          </div>
          <div class="shrink-0">
            ${Components.StatusBadge(order)}
          </div>
        </div>

        <!-- O'rtasi va Pasti: Universitet, Fakultet, Guruh va Ism (Sardor va Sotuvchi) -->
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h4 class="text-[14px] sm:text-[15px] font-extrabold text-[#000000] group-hover:text-[#d64138] transition-colors truncate leading-tight">
              ${order.university}
            </h4>
            <p class="text-[11.5px] sm:text-xs text-[#808080] truncate mt-1">
              ${order.faculty} &bull; <strong class="text-[#1C1C1E] font-bold">${order.group}</strong>
            </p>
          </div>
          <div class="flex flex-col items-end gap-1 shrink-0">
            <div class="text-[11px] font-bold text-[#1C1C1E] flex items-center gap-1.5 bg-[#F0F0F0] px-3 py-1 rounded-full" title="Guruh sardori / Mijoz">
              ${Icons.user('w-3 h-3 text-[#808080] shrink-0')}
              <span class="truncate max-w-[95px] sm:max-w-[130px]">${order.leaderName || 'Mijoz'}</span>
            </div>
            ${order.sellerName ? `
              <div class="text-[10px] font-medium text-[#80808B] flex items-center gap-1 px-1" title="Masʼul sotuvchi">
                <span class="text-[9px] text-[#808080]">Sotuvchi:</span>
                <span class="font-bold text-[#1C1C1E] truncate max-w-[85px] sm:max-w-[110px]">${order.sellerName}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // To'liq karta kerak bo'lganda (masalan batafsil ko'rish uchun)
  OrderCardFull: (order, onClickAction) => {
    const studentNum = order.realStudentCount || order.studentCount;
    const totalOrderSum = studentNum * order.pricePerStudent;

    return `
      <div 
        onclick="${onClickAction}" 
        class="payno-card p-5 mb-3 bg-white relative cursor-pointer active:scale-[0.98] transition-transform duration-150 group"
      >
        <!-- Tepasi: Guruh ID va Status Badge -->
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold tracking-tight text-[#1C1C1E] bg-[#F0F0F0] px-3 py-1 rounded-full">
              ${order.id}
            </span>
            <span class="text-[11px] font-semibold text-[#808080]">
              ${order.createdAt ? order.createdAt.split(',')[0] : ''}
            </span>
          </div>
          <div>
            ${Components.StatusBadge(order)}
          </div>
        </div>

        <!-- O'rtasi: Universitet, fakultet, guruh va viloyat -->
        <div class="mb-3">
          <div class="flex items-center gap-1.5 text-[11px] font-bold text-[#d64138] mb-1">
            <span class="text-[#d64138]">${Icons.mapPin('w-3.5 h-3.5')}</span>
            <span>${order.region || 'Toshkent shahri'}</span>
          </div>
          <h4 class="text-[15px] font-extrabold text-[#000000] group-hover:text-[#d64138] transition-colors line-clamp-1 leading-snug">
            ${order.university}
          </h4>
          <p class="text-xs font-medium text-[#808080] line-clamp-1 mt-0.5">
            ${order.faculty} &bull; <strong class="text-[#1C1C1E] font-bold">${order.group}</strong>
          </p>
        </div>

        <!-- Albom turi va Sardor -->
        <div class="bg-[#F5F5F5] rounded-[22px] p-3.5 mb-3 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 text-[#1C1C1E]">
            <span class="text-[#808080]">${Icons.album('w-4 h-4')}</span>
            <span class="font-semibold">${order.albumType}</span>
          </div>
          <div class="text-[#d64138] font-extrabold">
            ${studentNum} dona
          </div>
        </div>

        <!-- Pastki qismi: Sardor va Summa -->
        <div class="flex items-center justify-between pt-2 border-t border-[#EDEDED] text-xs text-[#808080]">
          <div class="flex items-center gap-1.5 font-semibold truncate max-w-[55%]">
            <span class="text-[#808080]">${Icons.user('w-3.5 h-3.5')}</span>
            <span class="truncate text-[#1C1C1E]">${order.leaderName}</span>
          </div>
          <div class="text-right font-extrabold text-[14px] text-[#000000] tracking-tight">
            ${Store.formatMoney(totalOrderSum)}
          </div>
        </div>
      </div>
    `;
  },

  // 4. Modal / Bottom Sheet Framework
  ModalContainer: () => `
    <div id="payno-modal-backdrop" class="payno-backdrop" onclick="App.handleBackdropClick(event)">
      <div class="payno-modal-content p-6 sm:p-7 relative shadow-2xl">
        <!-- Tepada yumaloq ( X ) yopish tugmasi -->
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#EDEDED]">
          <h3 id="payno-modal-title" class="text-lg font-extrabold text-[#000000]"></h3>
          <button onclick="App.closeModal()" class="payno-close-btn" title="Yopish">
            ${Icons.x('w-5 h-5')}
          </button>
        </div>
        <!-- Modal kontenti -->
        <div id="payno-modal-body" class="no-scrollbar"></div>
      </div>
    </div>
  `,

  // 5. Toast Notification Component
  ToastContainer: () => `
    <div id="payno-toast" class="payno-toast">
      <span id="payno-toast-icon"></span>
      <span id="payno-toast-message"></span>
    </div>
  `
};

window.Components = Components;

