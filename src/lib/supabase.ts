import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Country {
  id: string;
  name: string;
  flag_emoji: string;
  emission_reduction_target: number;
  current_reduction: number;
  renewable_energy_percent: number;
  forest_coverage_percent: number;
  electric_vehicle_adoption: number;
  carbon_offset_tons: number;
  last_updated: string;
  created_at: string;
}

export interface ClimateProposal {
  id: string;
  title: string;
  description: string;
  category: string;
  proposed_by: string;
  votes_for: number;
  votes_against: number;
  status: string;
  deadline: string;
  created_at: string;
}

export interface ClimateMetric {
  id: string;
  metric_name: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend: string;
  last_updated: string;
  created_at: string;
}

export interface GreenProject {
  id: string;
  name: string;
  country_id: string;
  type: string;
  carbon_reduction_tons: number;
  investment_usd: number;
  status: string;
  completion_percent: number;
  created_at: string;
}
