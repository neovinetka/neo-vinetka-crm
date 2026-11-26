/* ====================================================================
   VINETKA CRM & ERP - PRODUCTION LOGIN VIEW (APPLE HIG / PAYNO STYLE)
   Clean, Secure Production Authentication
   ==================================================================== */

const LoginView = {
  render: () => {
    return `
      <div class="min-h-screen payno-bg flex flex-col justify-center items-center px-4 py-8">
        <!-- Markaziy Apple Container (Mobile & Desktop) -->
        <div class="w-full max-w-sm">
          <!-- Brend nomi: Neo Vinetka -->
          <div class="text-center mb-6">
            <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-[#1C1C1E] select-none">
              Neo <span class="text-[#d64138]">Vinetka</span>
            </h1>
            <p class="text-xs font-semibold text-[#808080] mt-1.5">Bitiruv albomlari boshqaruv va moliya tizimi</p>
          </div>

          <!-- Asosiy Login Card -->
          <div class="payno-card p-6 sm:p-7 bg-white">
            <div class="mb-5 text-center">
              <h2 class="text-xl font-extrabold text-[#000000]">Tizimga kirish</h2>
              <p class="text-xs text-[#808080] mt-0.5">Davom etish uchun login va parolingizni kiriting</p>
            </div>

            <!-- Login Form -->
            <form id="payno-login-form" onsubmit="LoginView.handleSubmit(event)" class="space-y-3.5">
              <!-- Login Input -->
              <div>
                <label for="login-username" class="block text-[11px] font-bold text-[#808080] mb-1">Login</label>
                <div class="relative flex items-center">
                  <span class="absolute left-4 text-[#A9A9A9]">
                    ${Icons.user('w-4 h-4')}
                  </span>
                  <input 
                    type="text" 
                    id="login-username" 
                    name="username"
                    required 
                    autocomplete="username"
                    placeholder="Login / Foydalanuvchi nomi" 
                    value=""
                    class="payno-input pl-11 text-xs font-semibold"
                  />
                </div>
              </div>

              <!-- Parol Input -->
              <div>
                <label for="login-password" class="block text-[11px] font-bold text-[#808080] mb-1">Parol</label>
                <div class="relative flex items-center">
                  <span class="absolute left-4 text-[#A9A9A9]">
                    ${Icons.settings('w-4 h-4')}
                  </span>
                  <input 
                    type="password" 
                    id="login-password" 
                    name="password"
                    required 
                    autocomplete="current-password"
                    placeholder="Parol" 
                    value=""
                    class="payno-input pl-11 pr-11 text-xs font-semibold"
                  />
                  <button 
                    type="button" 
                    onclick="LoginView.togglePasswordVisibility()" 
                    class="absolute right-4 text-[#A9A9A9] hover:text-[#1C1C1E] transition-colors"
                    title="Parolni koʻrsatish/yashirish"
                  >
                    ${Icons.eye('w-4 h-4')}
                  </button>
                </div>
              </div>

              <!-- Eslab qolish va Parol tiklash -->
              <div class="flex items-center justify-between text-xs pt-1">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked class="accent-[#d64138] rounded" />
                  <span class="text-[#808080] font-medium">Eslab qolish</span>
                </label>
                <a href="#" onclick="alert('Parolingizni tiklash yoki oʻzgartirish uchun kompaniya rahbariga (CEO) murojaat qiling.')" class="text-[#808080] hover:text-[#d64138] font-semibold transition-colors">Parolni unutdingizmi?</a>
              </div>

              <!-- Sign In Button -->
              <div class="pt-2">
                <button 
                  type="submit" 
                  id="login-submit-btn"
                  class="w-full payno-pill-btn payno-btn-primary py-3.5 text-sm font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Tizimga kirish</span>
                </button>
              </div>
            </form>
          </div>

          <!-- DEMO / ONE-CLICK TEST REJIMI (Vaqtinchalik sinov uchun) -->
          <div class="mt-4 payno-card p-5 bg-white relative">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-[#d64138] animate-pulse"></span>
                <span class="text-xs font-extrabold text-[#000000]">1-Click Demo Kirish</span>
              </div>
              <span class="text-[10px] font-bold text-[#d64138] bg-[#d64138]/10 px-2.5 py-0.5 rounded-full">
                Sinov rejimi
              </span>
            </div>
            <p class="text-[11px] text-[#808080] mb-3 leading-snug">
              Har bir xodim paneli va funksiyasini tekshirish uchun bitta bosish bilan kiring:
            </p>

            <div class="grid grid-cols-2 gap-2.5">
              <!-- 1. Rahbar (CEO) -->
              <button 
                type="button" 
                onclick="LoginView.demoLogin('ceo')" 
                class="flex items-center gap-2.5 p-3 rounded-[22px] bg-[#F9F9F9] hover:bg-[#d64138]/[0.08] text-left transition-all active:scale-[0.97]"
                title="Rahbar sifatida kirish"
              >
                <div class="w-9 h-9 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shrink-0">
                  ${Icons.user('w-4 h-4')}
                </div>
                <div class="min-w-0">
                  <div class="text-[11.5px] font-extrabold text-[#000000] truncate">Rahbar (CEO)</div>
                  <div class="text-[10px] text-[#808080] truncate">Boshqaruv</div>
                </div>
              </button>

              <!-- 2. Buxgalter -->
              <button 
                type="button" 
                onclick="LoginView.demoLogin('accountant')" 
                class="flex items-center gap-2.5 p-3 rounded-[22px] bg-[#F9F9F9] hover:bg-[#d64138]/[0.08] text-left transition-all active:scale-[0.97]"
                title="Buxgalter sifatida kirish"
              >
                <div class="w-9 h-9 rounded-full bg-[#d64138] text-white flex items-center justify-center shrink-0">
                  ${Icons.wallet('w-4 h-4')}
                </div>
                <div class="min-w-0">
                  <div class="text-[11.5px] font-extrabold text-[#000000] truncate">Buxgalter</div>
                  <div class="text-[10px] text-[#808080] truncate">Moliya</div>
                </div>
              </button>

              <!-- 3. Sotuvchi -->
              <button 
                type="button" 
                onclick="LoginView.demoLogin('seller')" 
                class="flex items-center gap-2.5 p-3 rounded-[22px] bg-[#F9F9F9] hover:bg-[#d64138]/[0.08] text-left transition-all active:scale-[0.97]"
                title="Sotuvchi sifatida kirish"
              >
                <div class="w-9 h-9 rounded-full bg-[#d64138]/10 text-[#d64138] flex items-center justify-center shrink-0">
                  ${Icons.orders('w-4 h-4')}
                </div>
                <div class="min-w-0">
                  <div class="text-[11.5px] font-extrabold text-[#000000] truncate">Sotuvchi</div>
                  <div class="text-[10px] text-[#808080] truncate">Buyurtmalar</div>
                </div>
              </button>

              <!-- 4. Fotograf -->
              <button 
                type="button" 
                onclick="LoginView.demoLogin('photographer')" 
                class="flex items-center gap-2.5 p-3 rounded-[22px] bg-[#F9F9F9] hover:bg-[#d64138]/[0.08] text-left transition-all active:scale-[0.97]"
                title="Fotograf sifatida kirish"
              >
                <div class="w-9 h-9 rounded-full bg-[#d64138]/10 text-[#d64138] flex items-center justify-center shrink-0">
                  ${Icons.camera('w-4 h-4')}
                </div>
                <div class="min-w-0">
                  <div class="text-[11.5px] font-extrabold text-[#000000] truncate">Fotograf</div>
                  <div class="text-[10px] text-[#808080] truncate">Fotosessiya</div>
                </div>
              </button>

              <!-- 5. Dizayner -->
              <button 
                type="button" 
                onclick="LoginView.demoLogin('editor')" 
                class="flex items-center gap-2.5 p-3 rounded-[22px] bg-[#F9F9F9] hover:bg-[#d64138]/[0.08] text-left transition-all active:scale-[0.97]"
                title="Dizayner sifatida kirish"
              >
                <div class="w-9 h-9 rounded-full bg-[#d64138]/10 text-[#d64138] flex items-center justify-center shrink-0">
                  ${Icons.palette('w-4 h-4')}
                </div>
                <div class="min-w-0">
                  <div class="text-[11.5px] font-extrabold text-[#000000] truncate">Dizayner</div>
                  <div class="text-[10px] text-[#808080] truncate">Montaj</div>
                </div>
              </button>

              <!-- 6. Albomchi -->
              <button 
                type="button" 
                onclick="LoginView.demoLogin('maker')" 
                class="flex items-center gap-2.5 p-3 rounded-[22px] bg-[#F9F9F9] hover:bg-[#d64138]/[0.08] text-left transition-all active:scale-[0.97]"
                title="Albom yasovchi sifatida kirish"
              >
                <div class="w-9 h-9 rounded-full bg-[#d64138]/10 text-[#d64138] flex items-center justify-center shrink-0">
                  ${Icons.layers('w-4 h-4')}
                </div>
                <div class="min-w-0">
                  <div class="text-[11.5px] font-extrabold text-[#000000] truncate">Albomchi</div>
                  <div class="text-[10px] text-[#808080] truncate">Yigʻuvchi</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  togglePasswordVisibility: () => {
    const input = document.getElementById('login-password');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  },

  handleSubmit: async (e) => {
    e.preventDefault();
    const usernameEl = document.getElementById('login-username');
    const passwordEl = document.getElementById('login-password');
    const submitBtn = document.getElementById('login-submit-btn');

    const u = (usernameEl?.value || '').trim();
    const p = (passwordEl?.value || '').trim();

    if (!u || !p) {
      alert("Iltimos, login va parolni kiriting!");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Tekshirilmoqda...</span>`;
    }

    try {
      const res = await store.login(u, p);
      if (res.success) {
        App.showToast(`Xush kelibsiz, ${res.user.name}!`);
        App.render();
      } else {
        alert(res.message);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Tizimga kirish</span>`;
        }
      }
    } catch (err) {
      console.error("Login xatolik:", err);
      alert("Kirishda xatolik yuz berdi. Iltimos, qayta urinib koʻring.");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Tizimga kirish</span>`;
      }
    }
  },

  // 1-Click Demo Kirish (Sinov uchun to'g'ridan-to'g'ri tizimga kirish)
  demoLogin: async (role) => {
    // 1. Avval mavjud xodimlar ichidan shu roldagi faol foydalanuvchini qidiramiz
    let user = (store.users || []).find(u => u.role === role && u.status !== 'blocked') 
            || (store.users || []).find(u => u.role === role);

    // 2. Agar mavjud bo'lmasa, ushbu rol uchun to'liq demo profil yaratamiz
    if (!user) {
      const demoTemplates = {
        ceo: {
          name: 'Doniyor Zufarov',
          username: 'admin',
          password: '123',
          role: 'ceo',
          phone: '+998 90 999 88 77',
          telegram: '@doniyor_ceo',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          region: 'all'
        },
        accountant: {
          name: 'Nodira Buxgalter',
          username: 'accountant',
          password: '123',
          role: 'accountant',
          phone: '+998 90 123 45 67',
          telegram: '@nodira_bux',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          region: 'all'
        },
        seller: {
          name: 'Jamshid Sotuvchi',
          username: 'seller',
          password: '123',
          role: 'seller',
          phone: '+998 93 555 44 33',
          telegram: '@jamshid_seller',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          region: 'Toshkent shahri',
          payModel: 'percent',
          payRate: 10
        },
        photographer: {
          name: 'Bobur Fotograf',
          username: 'photographer',
          password: '123',
          role: 'photographer',
          phone: '+998 97 777 66 55',
          telegram: '@bobur_photo',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          region: 'Toshkent shahri',
          payModel: 'salary',
          payRate: 6000000,
          monthlySalary: 6000000
        },
        editor: {
          name: 'Sardor Dizayner',
          username: 'editor',
          password: '123',
          role: 'editor',
          phone: '+998 99 888 11 22',
          telegram: '@sardor_editor',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          region: 'Toshkent shahri',
          payModel: 'per_student',
          payRate: 15000
        },
        maker: {
          name: 'Jasur Albomchi',
          username: 'maker',
          password: '123',
          role: 'maker',
          phone: '+998 91 333 22 11',
          telegram: '@jasur_maker',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          region: 'Toshkent shahri',
          payModel: 'by_album_type',
          payRate: 25000
        }
      };

      const tpl = demoTemplates[role];
      if (tpl) {
        user = store.addUser(tpl);
      }
    }

    if (user) {
      if (user.status === 'blocked') {
        user.status = 'active';
      }
      store.currentUser = user;
      store.save();
      App.showToast(`Xush kelibsiz, ${user.name}!`);
      App.render();
    }
  }
};

window.LoginView = LoginView;
