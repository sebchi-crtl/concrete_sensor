-- Supabase Database Setup for Concrete Maturity Monitor
-- This works with your existing temperature_data table

-- Your existing table structure (for reference):
-- CREATE TABLE public.temperature_data (
--   id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
--   timestamp timestamp with time zone NOT NULL,
--   avg_temperature real NOT NULL,
--   battery_level real NOT NULL,
--   sensor_count integer NOT NULL,
--   network_time timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'Africa/Lagos'::text),
--   CONSTRAINT temperature_data_pkey PRIMARY KEY (id)
-- );

-- Create indexes on your existing temperature_data table for better query performance
CREATE INDEX IF NOT EXISTS idx_temperature_data_timestamp ON temperature_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_temperature_data_network_time ON temperature_data(network_time DESC);

-- Enable Row Level Security (RLS) on your existing table
ALTER TABLE temperature_data ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You can modify this based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON temperature_data
    FOR ALL USING (auth.role() = 'authenticated');

-- Create a policy for anonymous access (if needed for your use case)
-- Uncomment the following lines if you want to allow anonymous access
-- CREATE POLICY "Allow anonymous read access" ON temperature_data
--     FOR SELECT USING (true);

-- Insert some sample data (optional) - adjust based on your existing data
-- INSERT INTO temperature_data (timestamp, avg_temperature, battery_level, sensor_count, network_time) VALUES
-- (NOW() - INTERVAL '1 hour', 25.5, 85.2, 3, NOW() AT TIME ZONE 'Africa/Lagos'),
-- (NOW() - INTERVAL '30 minutes', 26.1, 84.9, 3, NOW() AT TIME ZONE 'Africa/Lagos'),
-- (NOW() - INTERVAL '15 minutes', 24.8, 84.1, 3, NOW() AT TIME ZONE 'Africa/Lagos'),
-- (NOW() - INTERVAL '5 minutes', 27.3, 83.7, 3, NOW() AT TIME ZONE 'Africa/Lagos'),
-- (NOW(), 25.9, 83.4, 3, NOW() AT TIME ZONE 'Africa/Lagos');

-- Create a view for maturity calculations using your existing table
CREATE OR REPLACE VIEW maturity_calculations AS
SELECT 
    id,
    avg_temperature,
    battery_level,
    sensor_count,
    timestamp,
    network_time,
    -- Calculate maturity using the formula: M = (Ta - To) * Δt
    -- Where To = 10°C, Δt = 0.5 hours
    (avg_temperature - 10.0) * 0.5 as calculated_maturity
FROM temperature_data
ORDER BY timestamp DESC;

-- Create a function to calculate cumulative maturity
CREATE OR REPLACE FUNCTION calculate_cumulative_maturity(
    device_id_param VARCHAR(255) DEFAULT NULL,
    location_param VARCHAR(255) DEFAULT NULL,
    hours_back INTEGER DEFAULT 24
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    cumulative_maturity DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM((temperature - 10.0) * 0.5), 0)
    INTO cumulative_maturity
    FROM readings
    WHERE timestamp >= NOW() - INTERVAL '1 hour' * hours_back
    AND (device_id_param IS NULL OR device_id = device_id_param)
    AND (location_param IS NULL OR location = location_param);
    
    RETURN cumulative_maturity;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE readings TO anon, authenticated;
GRANT ALL ON VIEW maturity_calculations TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_cumulative_maturity TO anon, authenticated;
