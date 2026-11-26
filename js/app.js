/* ====================================================================
   VINETKA CRM & ERP - MAIN APPLICATION CONTROLLER
   ==================================================================== */

const App = {
  init: () => {
    // Supabase mijozini ishga tushirish va Realtime monitoring
    if (typeof SupabaseService !== 'undefined') {
      SupabaseService.init();
      SupabaseService.onStatusChange(() => {
        App.render();
      });
    }

    // Store o'zgarishlariga avtomatik obuna bo'lish (Reactivity)
    store.subscribe(() => {
      App.render();
    });

    // Supabase bilan dastlabki sinxronizatsiya (agar ulangan bo'lsa)
    if (store && typeof store.syncWithSupabase === 'function') {
      store.syncWithSupabase();
    }

    // Modal va Toast konteynerlarini sahifaga qo'shish
    document.body.insertAdjacentHTML('beforeend', Components.ModalContainer());
    document.body.insertAdjacentHTML('beforeend', Components.ToastContainer());

    // ESC tugmasi bosilganda modalni yopish
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') App.closeModal();
    });

    App.render();
  },

  render: () => {
    const root = document.getElementById('app-root');
    if (!root) return;

    if (!store.currentUser) {
      root.innerHTML = LoginView.render();
      return;
    }

    const role = store.currentUser.role;
    let html = '';

    switch (role) {
      case 'seller':
        html = SellerView.render();
        break;
      case 'photographer':
        html = PhotographerView.render();
        break;
      case 'editor':
        html = EditorView.render();
        break;
      case 'maker':
        html = MakerView.render();
        break;
      case 'accountant':
        html = AccountantView.render();
        break;
      case 'ceo':
        html = CEOView.render();
        break;
      default:
        html = LoginView.render();
    }

    root.innerHTML = html;
  },

  logout: () => {
    if (confirm("Tizimdan chiqishni xohlaysizmi?")) {
      store.logout();
      App.showToast("Tizimdan chiqildi");
      App.render();
    }
  },

  // Modal boshqaruvi
  openModal: (title, bodyHtml) => {
    const backdrop = document.getElementById('payno-modal-backdrop');
    const titleEl = document.getElementById('payno-modal-title');
    const bodyEl = document.getElementById('payno-modal-body');

    if (backdrop && titleEl && bodyEl) {
      titleEl.innerHTML = title;
      bodyEl.innerHTML = bodyHtml;
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal: () => {
    const backdrop = document.getElementById('payno-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  handleBackdropClick: (e) => {
    if (e.target && e.target.id === 'payno-modal-backdrop') {
      App.closeModal();
    }
  },

  // Summa kiritish maydonlarini real-time bo'shliq bilan formatlash (5000000 -> "5 000 000")
  formatMoneyInput: (input) => {
    if (!input) return;
    const raw = String(input.value || '');
    const cursor = input.selectionStart || 0;
    const digitsBefore = raw.slice(0, cursor).replace(/\D/g, '').length;
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      input.value = '';
      return;
    }
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    input.value = formatted;
    let newCursor = 0;
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) count++;
      if (count === digitsBefore) {
        newCursor = i + 1;
        break;
      }
    }
    if (newCursor === 0 && digitsBefore === 0) newCursor = 0;
    if (newCursor === 0 && digitsBefore > 0) newCursor = formatted.length;
    try { input.setSelectionRange(newCursor, newCursor); } catch (e) {}
  },

  // Toast bildirishnoma
  showToast: (message) => {
    const toast = document.getElementById('payno-toast');
    const msgEl = document.getElementById('payno-toast-message');
    const iconEl = document.getElementById('payno-toast-icon');

    if (toast && msgEl) {
      msgEl.innerText = message;
      if (iconEl) iconEl.innerHTML = Icons.checkCircle('w-5 h-5 text-emerald-400');
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  },

  // Profil tahrirlash modali
  openProfileModal: () => {
    const user = store.currentUser;
    if (!user) return;

    const bodyHtml = `
      <form id="profile-edit-form" onsubmit="App.handleProfileSave(event)" class="space-y-4">
        <div class="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <img id="avatar-preview" src="${user.avatar}" class="w-16 h-16 rounded-full object-cover ring-2 ring-slate-300 shrink-0" />
          <div class="flex-1 min-w-0">
            <label class="block text-xs font-bold text-slate-700 mb-0.5">Profil rasmi</label>
            ${user.role === 'ceo' ? `
              <input 
                type="url" 
                id="profile-avatar" 
                value="${user.avatar}" 
                oninput="document.getElementById('avatar-preview').src = this.value"
                class="payno-input text-xs sm:text-xs py-2" 
                placeholder="Rasm URL havolasi"
              />
            ` : `
              <p class="text-[11px] text-slate-500 font-medium leading-tight">
                Profil rasmini faqat <strong>Rahbar (CEO)</strong> oʻzgartirishi mumkin.
              </p>
              <input type="hidden" id="profile-avatar" value="${user.avatar}" />
            `}
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Ism va Familiya</label>
          <input type="text" id="profile-name" value="${user.name}" required class="payno-input" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Telefon raqam</label>
          <input type="tel" id="profile-phone" value="${user.phone || ''}" required class="payno-input" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Telegram manzil</label>
          <input type="text" id="profile-telegram" value="${user.telegram || ''}" placeholder="@username" class="payno-input" />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full payno-pill-btn payno-btn-primary py-3.5 text-sm sm:text-xs font-bold shadow-md min-h-[48px] sm:min-h-0">
            Saqlash
          </button>
        </div>
      </form>
    `;

    App.openModal("Mening profilim", bodyHtml);
  },

  handleProfileSave: (e) => {
    e.preventDefault();
    const user = store.currentUser || {};
    const avatarInput = document.getElementById('profile-avatar');
    const avatar = (user.role === 'ceo' && avatarInput) ? avatarInput.value.trim() : (user.avatar || '');

    const data = {
      name: document.getElementById('profile-name').value.trim(),
      phone: document.getElementById('profile-phone').value.trim(),
      telegram: document.getElementById('profile-telegram').value.trim(),
      avatar: avatar
    };

    store.updateProfile(user.id, data);
    App.closeModal();
    App.showToast("Profil muvaffaqiyatli saqlandi!");
    App.render();
  },

  // Status detail popup
  showStatusDetail: (orderId, statusText, holderRole, holderName, holderPhone) => {
    let iconSvg = Icons.camera('w-7 h-7 text-amber-600');
    let iconBg = 'bg-amber-100/80';
    if (statusText.includes('Fotosessiya')) {
      iconSvg = Icons.aperture('w-7 h-7 text-orange-600');
      iconBg = 'bg-orange-100/80';
    } else if (statusText.includes('Edit')) {
      iconSvg = Icons.palette('w-7 h-7 text-purple-600');
      iconBg = 'bg-purple-100/80';
    } else if (statusText.includes('Yig')) {
      iconSvg = Icons.layers('w-7 h-7 text-blue-600');
      iconBg = 'bg-blue-100/80';
    } else if (statusText.includes('Tayyor') || statusText.includes('TAYYOR')) {
      iconSvg = Icons.checkCircle('w-7 h-7 text-emerald-600');
      iconBg = 'bg-emerald-100/80';
    } else if (statusText.includes('Topshirildi')) {
      iconSvg = Icons.check('w-7 h-7 text-teal-600');
      iconBg = 'bg-teal-100/80';
    } else if (statusText.includes('Yopilgan')) {
      iconSvg = Icons.receipt('w-7 h-7 text-slate-600');
      iconBg = 'bg-slate-100';
    }

    const bodyHtml = `
      <div class="text-center py-4 space-y-4">
        <div class="w-16 h-16 rounded-full bg-[#d64138]/10 text-[#d64138] flex items-center justify-center mx-auto mb-1">
          ${iconSvg}
        </div>
        <div>
          <h4 class="text-base font-extrabold text-[#000000]">${orderId}</h4>
          <span class="inline-block mt-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#F0F0F0] text-[#1C1C1E]">
            ${statusText}
          </span>
        </div>

        <div class="p-4 bg-[#F9F9F9] rounded-[25px] text-left space-y-2.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[#808080] font-medium">Hozirgi bosqich:</span>
            <span class="font-bold text-[#1C1C1E]">${holderRole}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[#808080] font-medium">Masʼul shaxs:</span>
            <span class="font-bold text-[#000000]">${holderName}</span>
          </div>
          ${holderPhone && holderPhone !== '-' ? `
            <div class="flex items-center justify-between pt-2 border-t border-[#EDEDED]">
              <span class="text-[#808080] font-medium">Aloqa:</span>
              <a href="tel:${holderPhone}" class="font-extrabold text-[#d64138] flex items-center gap-1">
                ${Icons.phone('w-3.5 h-3.5')}
                <span>${holderPhone}</span>
              </a>
            </div>
          ` : ''}
        </div>

        <button 
          onclick="App.closeModal()" 
          class="w-full payno-pill-btn bg-[#1C1C1E] hover:bg-black text-white py-3.5 text-xs font-bold"
        >
          Tushunarli
        </button>
      </div>
    `;

    App.openModal("Buyurtma holati", bodyHtml);
  }
};

// Dastur yuklanganda ishga tushirish
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}

window.App = App;
window.formatMoneyInput = (el) => App.formatMoneyInput(el);

