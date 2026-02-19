-- FlipChecker Feature Parity Migration
-- Fixes tier limits to match pricing page, adds price_history table,
-- email_alerts_enabled flag, and re-adds ebay_sold source.

-- ============================================
-- 1. FIX get_tier_limits RPC
-- ============================================
CREATE OR REPLACE FUNCTION get_tier_limits(p_tier text)
RETURNS jsonb AS $$
BEGIN
  RETURN CASE p_tier
    WHEN 'free' THEN jsonb_build_object(
      'lookups_per_day', 10,
      'saved_deals', 25,
      'alerts', 1,
      'price_source', 'estimate',
      'price_history', false,
      'email_alerts', false,
      'analytics', false
    )
    WHEN 'flipper' THEN jsonb_build_object(
      'lookups_per_day', 150,
      'saved_deals', 1000,
      'alerts', 20,
      'price_source', 'ebay_active',
      'price_history', true,
      'email_alerts', true,
      'analytics', false
    )
    WHEN 'pro' THEN jsonb_build_object(
      'lookups_per_day', 10000,
      'saved_deals', -1,
      'alerts', 100,
      'price_source', 'ebay_sold',
      'price_history', true,
      'email_alerts', true,
      'analytics', true
    )
    ELSE jsonb_build_object(
      'lookups_per_day', 10,
      'saved_deals', 25,
      'alerts', 1,
      'price_source', 'estimate',
      'price_history', false,
      'email_alerts', false,
      'analytics', false
    )
  END;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. FIX increment_usage RPC (Flipper: 150, Pro: 10000)
-- ============================================
CREATE OR REPLACE FUNCTION increment_usage(p_user_id uuid, p_action text)
RETURNS jsonb AS $$
DECLARE
  v_profile public.profiles;
  v_limit int;
BEGIN
  -- Get current profile
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;

  -- Reset if needed
  IF v_profile.lookups_reset_at < now() - interval '24 hours' THEN
    UPDATE public.profiles
    SET lookups_used_today = 0, lookups_reset_at = now()
    WHERE id = p_user_id;
    v_profile.lookups_used_today := 0;
  END IF;

  -- Get limit based on tier (matches pricing page)
  v_limit := CASE v_profile.tier
    WHEN 'free' THEN 10
    WHEN 'flipper' THEN 150
    WHEN 'pro' THEN 10000
    ELSE 10
  END;

  -- Check if over limit
  IF v_profile.lookups_used_today >= v_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'used', v_profile.lookups_used_today,
      'limit', v_limit,
      'resets_at', v_profile.lookups_reset_at + interval '24 hours'
    );
  END IF;

  -- Increment usage
  UPDATE public.profiles
  SET lookups_used_today = lookups_used_today + 1
  WHERE id = p_user_id;

  -- Log usage
  INSERT INTO public.usage_logs (user_id, action)
  VALUES (p_user_id, p_action);

  RETURN jsonb_build_object(
    'allowed', true,
    'used', v_profile.lookups_used_today + 1,
    'limit', v_limit,
    'remaining', v_limit - v_profile.lookups_used_today - 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. CREATE price_history TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query text NOT NULL,
  category text,
  source text NOT NULL,
  sample_count int DEFAULT 0,
  price_low numeric,
  price_high numeric,
  price_avg numeric,
  price_median numeric,
  recorded_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS price_history_query_date_idx
  ON public.price_history (search_query, recorded_at DESC);

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read price history"
  ON public.price_history FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage price history"
  ON public.price_history FOR ALL
  USING (true);

-- ============================================
-- 4. ADD email_alerts_enabled TO profiles
-- ============================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_alerts_enabled boolean DEFAULT true;

-- ============================================
-- 5. RE-ADD ebay_sold TO price_cache source CHECK
-- ============================================
ALTER TABLE public.price_cache
  DROP CONSTRAINT IF EXISTS price_cache_source_check;

ALTER TABLE public.price_cache
  ADD CONSTRAINT price_cache_source_check
  CHECK (source IN ('ebay_browse', 'ebay_active', 'ebay_active_pro', 'ebay_sold', 'estimate'));
