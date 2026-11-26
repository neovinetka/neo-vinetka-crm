-- ====================================================================
-- VINETKA CRM & ERP - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Continuous Real-time Sync, Shared Pool Workflow & RLS Security
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP TABLES IF NEEDED (Clean migration)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS payroll_logs CASCADE;
DROP TABLE IF EXISTS company_expenses CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- ====================================================================
-- JADVAL 1: PROFILES (Xodimlar va Foydalanuvchilar)
-- ====================================================================
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL DEFAULT '123',
  role TEXT NOT NULL CHECK (role IN ('seller', 'photographer', 'editor', 'maker', 'accountant', 'ceo', 'worker')),
  region TEXT DEFAULT 'all',
  phone TEXT,
  telegram TEXT,
  avatar TEXT,
  salary_type TEXT DEFAULT 'percent', -- 'percent', 'salary', 'per_student', 'per_group', 'by_album_type', 'fixed_per_album'
  rate NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  advance_taken NUMERIC DEFAULT 0,
  monthly_salary NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- JADVAL 2: SEASONS (Mavsumlar va Davrlar)
-- ====================================================================
CREATE TABLE seasons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- JADVAL 3: SETTINGS (Dinamik parametrlar: Viloyatlar, Albom turlari, Tariflar)
-- ====================================================================
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- JADVAL 4: ORDERS (Bitiruv guruhlari va buyurtmalar - Shared Pool)
-- ====================================================================
CREATE TABLE orders (
  id TEXT PRIMARY KEY, -- masalan: #VIN-0048
  region TEXT NOT NULL,
  university TEXT,
  faculty TEXT,
  group_name TEXT,
  faculty_group TEXT,
  leader_name TEXT,
  leader_phone TEXT,
  album_type TEXT,
  unit_price NUMERIC NOT NULL DEFAULT 0, -- pricePerStudent
  student_count INTEGER DEFAULT 0,
  real_student_count INTEGER,
  photo_date TEXT,
  status TEXT NOT NULL DEFAULT 'photo_queue' CHECK (
    status IN ('photo_queue', 'photo_active', 'edit_queue', 'edit_active', 'make_queue', 'make_active', 'ready', 'delivered', 'closed')
  ),
  current_holder_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  location_url TEXT, -- Google Maps link
  comment TEXT, -- notes
  season_id TEXT REFERENCES seasons(id) ON DELETE SET NULL,

  -- Mas'ul xodimlar
  seller_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  seller_name TEXT,
  seller_phone TEXT,

  photographer_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  photographer_name TEXT,
  photographer_phone TEXT,
  photo_drive_link TEXT,

  editor_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  editor_name TEXT,
  editor_phone TEXT,
  editor_proof_link TEXT,
  editor_print_link TEXT,
  editor_finished_at TEXT,

  maker_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  maker_name TEXT,
  maker_phone TEXT,
  maker_finished_at TEXT,
  ready_at TEXT,

  -- Moliya va sifat nazorati
  damaged_count INTEGER DEFAULT 0,
  damaged_cost NUMERIC DEFAULT 0,
  collected_amount NUMERIC DEFAULT 0,
  payment_method TEXT, -- 'cash', 'card', 'bank'
  seller_submitted_amount NUMERIC DEFAULT 0,
  seller_submitted_pending NUMERIC DEFAULT 0,
  photographer_collected_amount NUMERIC DEFAULT 0,
  photographer_submitted_amount NUMERIC DEFAULT 0,
  photographer_submitted_pending NUMERIC DEFAULT 0,
  seller_collected_amount NUMERIC DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- JADVAL 5: PAYMENTS (Sotuvchidan buxgalterga topshirilgan to'lovlar)
-- ====================================================================
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  seller_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  seller_name TEXT,
  university TEXT,
  group_name TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_type TEXT DEFAULT 'cash', -- 'cash', 'card'
  percentage TEXT DEFAULT '50%', -- '50%', '100%', 'custom'
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  confirmed_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  confirmed_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- JADVAL 6: EXPENSES (Buyurtma va fotograf/yasovchi xarajatlari)
-- ====================================================================
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  requester_name TEXT,
  requester_role TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'other', -- 'transport', 'studio', 'print', 'damage', 'other'
  title TEXT NOT NULL,
  proof_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- JADVAL 7: PAYROLL_LOGS (Oylik va Gonorar to'lovlari tarixi)
-- ====================================================================
CREATE TABLE payroll_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT,
  role TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  type TEXT DEFAULT 'commission', -- 'advance', 'salary', 'commission', 'piecework'
  note TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- JADVAL 8: COMPANY_EXPENSES (Doimiy umumiy kompaniya xarajatlari)
-- ====================================================================
CREATE TABLE company_expenses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'general', -- 'rent', 'utilities', 'material', 'general'
  note TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TRIGGER: UPDATED_AT AVTOMATIK YANGILANISHI
-- ====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ====================================================================
-- TRIGGER: XODIM PROFILI O'ZGARISHLARINI ORDERS VA TO'LOVLARGA KASKAD TARQATISH
-- Agar xodim ism-familiyasi yoki telefonini o'zgartirsa, u mas'ul bo'lgan
-- barcha tarixdagi va faol buyurtmalar, kassa to'lovlari, xarajatlar va oylik loglarida
-- uning ismi va telefon raqami avtomatik ravishda to'liq yangilanadi.
-- ====================================================================
CREATE OR REPLACE FUNCTION cascade_profile_updates()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.name <> OLD.name OR NEW.phone IS DISTINCT FROM OLD.phone) THEN
    -- Orders: Sotuvchi bo'lgan barcha buyurtmalar (faol, tayyor va topshirilgan tarix)
    UPDATE orders 
    SET seller_name = NEW.name, 
        seller_phone = NEW.phone 
    WHERE seller_id = NEW.id;

    -- Orders: Fotograf bo'lgan barcha buyurtmalar
    UPDATE orders 
    SET photographer_name = NEW.name, 
        photographer_phone = NEW.phone 
    WHERE photographer_id = NEW.id;

    -- Orders: Dizayner bo'lgan barcha buyurtmalar
    UPDATE orders 
    SET editor_name = NEW.name, 
        editor_phone = NEW.phone 
    WHERE editor_id = NEW.id;

    -- Orders: Albom yasovchi bo'lgan barcha buyurtmalar
    UPDATE orders 
    SET maker_name = NEW.name, 
        maker_phone = NEW.phone 
    WHERE maker_id = NEW.id;

    -- Payments: Sotuvchining kassa to'lovlari
    UPDATE payments 
    SET seller_name = NEW.name 
    WHERE seller_id = NEW.id;

    -- Expenses: Xodimning xarajat so'rovlari
    UPDATE expenses 
    SET requester_name = NEW.name 
    WHERE user_id = NEW.id;

    -- Payroll logs: Xodimning oylik va gonorar loglari
    UPDATE payroll_logs 
    SET user_name = NEW.name 
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cascade_profile_updates ON profiles;
CREATE TRIGGER trigger_cascade_profile_updates
AFTER UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE cascade_profile_updates();

-- ====================================================================
-- REALTIME SOZLAMALARI (Real-time postgres_changes uchun)
-- ====================================================================
ALTER TABLE profiles REPLICA IDENTITY FULL;
ALTER TABLE seasons REPLICA IDENTITY FULL;
ALTER TABLE settings REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE payments REPLICA IDENTITY FULL;
ALTER TABLE expenses REPLICA IDENTITY FULL;
ALTER TABLE payroll_logs REPLICA IDENTITY FULL;
ALTER TABLE company_expenses REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE seasons;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE payroll_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE company_expenses;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) XAVFSIZLIK QOIDALARI
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_expenses ENABLE ROW LEVEL SECURITY;

-- 20-50 nafar xodim uchun anon / authenticated xavfsiz ruxsatlar
CREATE POLICY "Profiles read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles write access" ON profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Seasons read access" ON seasons FOR SELECT USING (true);
CREATE POLICY "Seasons write access" ON seasons FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Settings read access" ON settings FOR SELECT USING (true);
CREATE POLICY "Settings write access" ON settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Orders read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders write access" ON orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Payments read access" ON payments FOR SELECT USING (true);
CREATE POLICY "Payments write access" ON payments FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Expenses read access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Expenses write access" ON expenses FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Payroll logs read access" ON payroll_logs FOR SELECT USING (true);
CREATE POLICY "Payroll logs write access" ON payroll_logs FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Company expenses read access" ON company_expenses FOR SELECT USING (true);
CREATE POLICY "Company expenses write access" ON company_expenses FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- BOSHLANG'ICH REAL MA'LUMOTLAR (SEED DATA)
-- ====================================================================

-- 1. Mavsumlar
INSERT INTO seasons (id, name, start_date, end_date, is_active, is_current) VALUES
('season_2026_spring', '2026-yil Bahor mavsumi', '2026-01-01', '2026-06-30', TRUE, TRUE),
('season_2025_autumn', '2025-yil Kuz mavsumi', '2025-09-01', '2025-12-31', FALSE, FALSE);

-- 2. Standart Sozlamalar (Viloyatlar, Albom turlari, Tariflar)
INSERT INTO settings (key, value) VALUES
('regions', '[
  "Toshkent shahri", "Toshkent viloyati", "Samarqand", "Buxoro", "Andijon",
  "Farg''ona", "Namangan", "Qashqadaryo", "Surxondaryo", "Xorazm",
  "Navoiy", "Jizzax", "Sirdaryo", "Qoraqalpog''iston Respublikasi"
]'::jsonb),

('album_types', '[
  {"id": "type_1", "name": "Premium Glossy (A4)", "basePrice": 220000, "makerRate": 25000},
  {"id": "type_2", "name": "Luxe Velvet Soft-touch", "basePrice": 250000, "makerRate": 30000},
  {"id": "type_3", "name": "Standard Book Hardcover", "basePrice": 190000, "makerRate": 20000},
  {"id": "type_4", "name": "Royal Leather Embossed", "basePrice": 280000, "makerRate": 35000}
]'::jsonb),

('rates', '{
  "sellerCommissionPercent": 10,
  "editorRatePerStudent": 15000,
  "makerRatePerAlbum": 25000,
  "photographerSalary": 6000000
}'::jsonb);

-- 3. Xodimlar (Profiles - 1-Click Demo Login uchun 6 ta toza hisob, balanslar 0)
INSERT INTO profiles (id, name, username, password, role, region, phone, telegram, avatar, salary_type, rate, paid_amount, advance_taken, monthly_salary, status) VALUES
('usr_ceo_1', 'Doniyor Zufarov', 'admin', '123', 'ceo', 'all', '+998 90 999 88 77', '@doniyor_ceo', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'salary', 0, 0, 0, 0, 'active'),
('usr_acc_1', 'Nodira Buxgalter', 'accountant', '123', 'accountant', 'all', '+998 90 123 45 67', '@nodira_bux', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'salary', 0, 0, 0, 0, 'active'),
('usr_sel_1', 'Jamshid Sotuvchi', 'seller', '123', 'seller', 'Toshkent shahri', '+998 93 555 44 33', '@jamshid_seller', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'percent', 10, 0, 0, 0, 'active'),
('usr_pho_1', 'Bobur Fotograf', 'photographer', '123', 'photographer', 'Toshkent shahri', '+998 97 777 66 55', '@bobur_photo', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'salary', 6000000, 0, 0, 6000000, 'active'),
('usr_edi_1', 'Sardor Dizayner', 'editor', '123', 'editor', 'Toshkent shahri', '+998 99 888 11 22', '@sardor_editor', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'per_student', 15000, 0, 0, 0, 'active'),
('usr_mak_1', 'Jasur Albomchi', 'maker', '123', 'maker', 'Toshkent shahri', '+998 91 333 22 11', '@jasur_maker', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'by_album_type', 25000, 0, 0, 0, 'active')
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  paid_amount = EXCLUDED.paid_amount,
  advance_taken = EXCLUDED.advance_taken;

-- ====================================================================
-- DEMO VA TEST MA'LUMOTLARINI BUTUNLAY TOZALASH (CLEAN SLATE):
-- Agar bazada avval kiritilgan test buyurtmalar va demo loginlar bo'lsa,
-- ularni to'liq tozalab, faqat Rahbar hisobini qoldirish uchun
-- quyidagi SQL buyruqlarini Supabase SQL Editor'da bajaring:
--
-- TRUNCATE TABLE payments, expenses, orders, payroll_logs, company_expenses CASCADE;
-- DELETE FROM profiles WHERE id != 'usr_ceo_1';
-- UPDATE profiles SET paid_amount = 0, advance_taken = 0 WHERE id = 'usr_ceo_1';
-- ====================================================================

