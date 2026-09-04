-- ============================================================================
-- Zen Store - Complete Supabase PostgreSQL Schema, RLS & Seed DDL
-- Execute this SQL script in your Supabase Project SQL Editor
-- ============================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'supplier', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending_whatsapp_confirmation',
        'confirmed',
        'processing',
        'assigned_to_supplier',
        'accepted',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('unpaid', 'cod', 'paid', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to automatically create a public.profiles record when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        'customer'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY DEFAULT ('SUP-' || floor(random() * 900 + 100)::text),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Active',
    payment_terms TEXT DEFAULT 'Net 15',
    total_payout NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('PROD-' || floor(random() * 9000 + 1000)::text),
    supplier_id TEXT REFERENCES public.suppliers(id) ON DELETE SET NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT DEFAULT '',
    short_description TEXT DEFAULT '',
    sku TEXT UNIQUE NOT NULL,
    brand TEXT DEFAULT 'Zen Store',
    mrp NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'Active',
    rating NUMERIC(3,2) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 0,
    main_image TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCT COSTS TABLE (SENSITIVE PRIVATE BUSINESS DATA - OWNER ACCESS ONLY)
CREATE TABLE IF NOT EXISTS public.product_costs (
    product_id TEXT PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    buy_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

-- 7. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE
);

-- 8. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY DEFAULT ('V-' || floor(random() * 9000 + 1000)::text),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value TEXT DEFAULT '',
    sku TEXT DEFAULT '',
    buy_price NUMERIC(10,2) DEFAULT 0.00,
    selling_price NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT DEFAULT ''
);

-- 9. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT DEFAULT '',
    area TEXT DEFAULT '',
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    supplier_id TEXT REFERENCES public.suppliers(id) ON DELETE SET NULL,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    shipping_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    buy_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    profit NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'Payment on WhatsApp / COD',
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    order_status order_status NOT NULL DEFAULT 'pending_whatsapp_confirmation',
    tracking_number TEXT DEFAULT '',
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ORDER ITEMS TABLE (PRICE SNAPSHOT AT TIME OF ORDER)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    supplier_id TEXT REFERENCES public.suppliers(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    sku TEXT DEFAULT '',
    variant_id TEXT DEFAULT '',
    variant_name TEXT DEFAULT '',
    variant_value TEXT DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 1,
    mrp NUMERIC(10,2) DEFAULT 0.00,
    selling_price NUMERIC(10,2) NOT NULL,
    buy_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(12,2) NOT NULL,
    image_url TEXT DEFAULT ''
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is Owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT (role = 'owner')
        FROM public.profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is Supplier
CREATE OR REPLACE FUNCTION public.get_current_supplier_id()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT id
        FROM public.suppliers
        WHERE profile_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES RLS
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Owner full profile access" ON public.profiles FOR ALL USING (public.is_owner());

-- SUPPLIERS RLS
CREATE POLICY "Public suppliers read" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Supplier update own company" ON public.suppliers FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Owner manage suppliers" ON public.suppliers FOR ALL USING (public.is_owner());

-- CATEGORIES RLS
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Owner manage categories" ON public.categories FOR ALL USING (public.is_owner());

-- PRODUCTS RLS
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Supplier read own products" ON public.products FOR SELECT USING (supplier_id = public.get_current_supplier_id());
CREATE POLICY "Owner manage products" ON public.products FOR ALL USING (public.is_owner());
CREATE POLICY "Allow public write products for store admin sync" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- PRODUCT COSTS RLS (STRICTLY RESTRICTED TO OWNER ONLY)
CREATE POLICY "Owner only read costs" ON public.product_costs FOR SELECT USING (public.is_owner());
CREATE POLICY "Owner only manage costs" ON public.product_costs FOR ALL USING (public.is_owner());

-- PRODUCT IMAGES & VARIANTS RLS
CREATE POLICY "Public read images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Owner manage images" ON public.product_images FOR ALL USING (public.is_owner());
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Owner manage variants" ON public.product_variants FOR ALL USING (public.is_owner());

-- ADDRESSES RLS
CREATE POLICY "Users read own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner view addresses" ON public.addresses FOR SELECT USING (public.is_owner());

-- ORDERS RLS
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Suppliers view assigned orders" ON public.orders FOR SELECT USING (
    supplier_id = public.get_current_supplier_id() OR
    EXISTS (SELECT 1 FROM public.order_items WHERE order_items.order_id = orders.id AND order_items.supplier_id = public.get_current_supplier_id())
);
CREATE POLICY "Suppliers update assigned orders" ON public.orders FOR UPDATE USING (
    supplier_id = public.get_current_supplier_id() OR
    EXISTS (SELECT 1 FROM public.order_items WHERE order_items.order_id = orders.id AND order_items.supplier_id = public.get_current_supplier_id())
);
CREATE POLICY "Owner manage all orders" ON public.orders FOR ALL USING (public.is_owner());

-- ORDER ITEMS RLS
CREATE POLICY "Public insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
);
CREATE POLICY "Suppliers view assigned order items" ON public.order_items FOR SELECT USING (
    supplier_id = public.get_current_supplier_id()
);
CREATE POLICY "Owner manage order items" ON public.order_items FOR ALL USING (public.is_owner());

-- ============================================================================
-- ATOMIC RPC FUNCTION: CREATE ORDER WITH SAFE STOCK CHECK & RESERVATION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_order_with_stock_check(
    p_order_id TEXT,
    p_customer_id UUID,
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_shipping_address JSONB,
    p_items JSONB,
    p_subtotal NUMERIC,
    p_shipping_cost NUMERIC,
    p_tax NUMERIC,
    p_total NUMERIC,
    p_buy_cost NUMERIC,
    p_profit NUMERIC,
    p_payment_method TEXT DEFAULT 'Payment on WhatsApp / COD',
    p_payment_status payment_status DEFAULT 'unpaid',
    p_order_status order_status DEFAULT 'pending_whatsapp_confirmation'
)
RETURNS JSONB AS $$
DECLARE
    v_item JSONB;
    v_prod_id TEXT;
    v_qty INT;
    v_current_stock INT;
    v_primary_supplier_id TEXT := NULL;
BEGIN
    -- 1. Check stock for each line item before proceeding
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_prod_id := v_item->>'productId';
        v_qty := (v_item->>'qty')::INT;

        SELECT stock INTO v_current_stock FROM public.products WHERE id = v_prod_id FOR UPDATE;
        
        IF v_current_stock IS NULL THEN
            RAISE EXCEPTION 'Product % not found', v_prod_id;
        END IF;

        IF v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for product %. Requested %, available %', v_prod_id, v_qty, v_current_stock;
        END IF;
    END LOOP;

    -- Extract primary supplier ID from first item
    SELECT (p_items->0->>'supplierId') INTO v_primary_supplier_id;

    -- 2. Insert Order
    INSERT INTO public.orders (
        id, order_number, customer_id, customer_name, customer_email, customer_phone,
        supplier_id, subtotal, shipping_cost, tax, total, buy_cost, profit,
        payment_method, payment_status, order_status, shipping_address
    ) VALUES (
        p_order_id, p_order_id, p_customer_id, p_customer_name, p_customer_email, p_customer_phone,
        v_primary_supplier_id, p_subtotal, p_shipping_cost, p_tax, p_total, p_buy_cost, p_profit,
        p_payment_method, p_payment_status, p_order_status, p_shipping_address
    );

    -- 3. Insert Order Items & Deduct Stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_prod_id := v_item->>'productId';
        v_qty := (v_item->>'qty')::INT;

        INSERT INTO public.order_items (
            order_id, product_id, supplier_id, product_name, sku,
            variant_id, variant_name, quantity, mrp, selling_price, buy_price, subtotal, image_url
        ) VALUES (
            p_order_id,
            v_prod_id,
            v_item->>'supplierId',
            v_item->>'name',
            COALESCE(v_item->>'sku', ''),
            COALESCE(v_item->>'variantId', ''),
            COALESCE(v_item->>'variantName', ''),
            v_qty,
            COALESCE((v_item->>'mrp')::NUMERIC, 0),
            (v_item->>'sellingPrice')::NUMERIC,
            COALESCE((v_item->>'buyPrice')::NUMERIC, 0),
            ((v_item->>'sellingPrice')::NUMERIC * v_qty),
            COALESCE(v_item->>'image', '')
        );

        -- Safely update inventory stock
        UPDATE public.products
        SET stock = stock - v_qty, updated_at = NOW()
        WHERE id = v_prod_id;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'orderId', p_order_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL SEED DATA FOR SUPABASE
-- ============================================================================

INSERT INTO public.categories (id, name, slug, description, image_url) VALUES
('CAT-ELEC', 'Electronics & Audio', 'electronics-audio', 'Wireless earbuds, premium speakers, and soundbars', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'),
('CAT-WEAR', 'Smart Wearables', 'smart-wearables', 'Smartwatches, fitness bands, and tracking devices', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'),
('CAT-HOME', 'Home & Office', 'home-office', 'Ambient lighting, ergonomic decor, and smart home gadgets', 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&q=80'),
('CAT-PERC', 'Personal Care & Tech', 'personal-care', 'Grooming tools, wellness devices, and lifestyle accessories', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.suppliers (id, company_name, email, phone, address, status, payment_terms, total_payout) VALUES
('SUP-101', 'TechCraft Logistics India', 'supplier1@techcraft.in', '+91 98765 11001', '74 Industrial Layout, Electronic City, Bengaluru, Karnataka 560100', 'Active', 'Net 15', 245000),
('SUP-102', 'NextGen Electronics Ltd', 'supplier2@nextgen.in', '+91 98200 44321', 'Plot 12, SEZ MIDC, Andheri East, Mumbai, Maharashtra 400093', 'Active', 'Net 30', 182000),
('SUP-103', 'Apex Global Supply Hub', 'supplier3@apexglobal.in', '+91 99100 88776', 'A-45 Okhla Industrial Area Phase II, New Delhi 110020', 'Active', 'Net 7', 129000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, supplier_id, category_id, name, slug, description, short_description, sku, brand, mrp, selling_price, stock, status, rating, reviews_count, main_image) VALUES
('PROD-101', 'SUP-101', 'CAT-ELEC', 'ZenPods Pro Wireless ANC Earbuds', 'zenpods-pro-wireless-anc-earbuds', 'Active Noise Cancellation with 36H Battery & Spatial Audio', '45dB hybrid ANC, 11mm drivers', 'ZP-ANC-01', 'Zen', 3999, 2499, 65, 'Active', 4.8, 142, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'),
('PROD-102', 'SUP-102', 'CAT-WEAR', 'ZenFit Smartwatch Ultra AMOLED', 'zenfit-smartwatch-ultra-amoled', '1.96" HD AMOLED Display, BT Calling, 100+ Sports Modes', '1.96" AMOLED display', 'ZF-ULT-02', 'ZenFit', 5999, 3299, 42, 'Active', 4.7, 98, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'),
('PROD-103', 'SUP-103', 'CAT-HOME', 'Aura Ambient RGB Desk Lamp', 'aura-ambient-rgb-desk-lamp', 'Smart App Control, 16 Million RGB Colors, Wireless Charging Pad', 'Smart RGB lamp & wireless charger', 'AU-RGB-03', 'Aura', 2999, 1899, 30, 'Active', 4.6, 76, 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=800&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_costs (product_id, buy_price, shipping_cost, platform_fee, tax) VALUES
('PROD-101', 1100, 70, 40, 180),
('PROD-102', 1550, 90, 50, 250),
('PROD-103', 850, 80, 30, 140)
ON CONFLICT (product_id) DO NOTHING;
