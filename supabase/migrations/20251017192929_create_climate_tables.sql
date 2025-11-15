/*
  # ClimateGuard Database Schema
  
  1. New Tables
    - `countries`
      - `id` (uuid, primary key)
      - `name` (text) - Country name
      - `flag_emoji` (text) - Country flag emoji
      - `emission_reduction_target` (integer) - Target % reduction
      - `current_reduction` (integer) - Current % achieved
      - `renewable_energy_percent` (integer) - % of renewable energy
      - `forest_coverage_percent` (integer) - % forest coverage
      - `electric_vehicle_adoption` (integer) - % EV adoption
      - `carbon_offset_tons` (bigint) - Total carbon offset in tons
      - `last_updated` (timestamp)
      - `created_at` (timestamp)
    
    - `climate_proposals`
      - `id` (uuid, primary key)
      - `title` (text) - Proposal title
      - `description` (text) - Detailed description
      - `category` (text) - ocean, forest, energy, transport, etc.
      - `proposed_by` (text) - Country or organization
      - `votes_for` (integer) - Yes votes
      - `votes_against` (integer) - No votes
      - `status` (text) - active, passed, rejected
      - `deadline` (timestamp)
      - `created_at` (timestamp)
    
    - `climate_metrics`
      - `id` (uuid, primary key)
      - `metric_name` (text) - Name of the metric
      - `current_value` (decimal) - Current value
      - `target_value` (decimal) - Target value
      - `unit` (text) - Unit of measurement
      - `trend` (text) - up, down, stable
      - `last_updated` (timestamp)
      - `created_at` (timestamp)
    
    - `green_projects`
      - `id` (uuid, primary key)
      - `name` (text) - Project name
      - `country_id` (uuid) - Related country
      - `type` (text) - solar, wind, ev, reforestation, etc.
      - `carbon_reduction_tons` (bigint) - Carbon reduction impact
      - `investment_usd` (bigint) - Investment amount
      - `status` (text) - verified, pending, active
      - `completion_percent` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for MVP demo purposes)
*/

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  flag_emoji text NOT NULL,
  emission_reduction_target integer NOT NULL DEFAULT 0,
  current_reduction integer NOT NULL DEFAULT 0,
  renewable_energy_percent integer NOT NULL DEFAULT 0,
  forest_coverage_percent integer NOT NULL DEFAULT 0,
  electric_vehicle_adoption integer NOT NULL DEFAULT 0,
  carbon_offset_tons bigint NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Climate Proposals Table
CREATE TABLE IF NOT EXISTS climate_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  proposed_by text NOT NULL,
  votes_for integer NOT NULL DEFAULT 0,
  votes_against integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  deadline timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Climate Metrics Table
CREATE TABLE IF NOT EXISTS climate_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  current_value decimal NOT NULL,
  target_value decimal NOT NULL,
  unit text NOT NULL,
  trend text NOT NULL DEFAULT 'stable',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Green Projects Table
CREATE TABLE IF NOT EXISTS green_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_id uuid REFERENCES countries(id),
  type text NOT NULL,
  carbon_reduction_tons bigint NOT NULL DEFAULT 0,
  investment_usd bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  completion_percent integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE climate_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE climate_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_projects ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (MVP Demo)
CREATE POLICY "Anyone can view countries"
  ON countries FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can view climate proposals"
  ON climate_proposals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can view climate metrics"
  ON climate_metrics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can view green projects"
  ON green_projects FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON climate_proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_deadline ON climate_proposals(deadline);
CREATE INDEX IF NOT EXISTS idx_projects_country ON green_projects(country_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON green_projects(type);