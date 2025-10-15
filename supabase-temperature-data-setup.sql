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
CREATE POLICY "Allow all operations for authenticated users" ON temperature_data
    FOR ALL USING (auth.role() = 'authenticated');

-- Create a policy for anonymous access (if needed for your use case)
-- Uncomment the following lines if you want to allow anonymous access
CREATE POLICY "Allow anonymous read access" ON temperature_data
    FOR SELECT USING (true);

-- Create a view for maturity calculations using your existing data
CREATE OR REPLACE VIEW maturity_calculations AS
SELECT 
    id,
    timestamp,
    avg_temperature,
    battery_level,
    sensor_count,
    network_time,
    -- Calculate maturity using the formula: M = (Ta - To) * Δt
    -- Where To = 10°C, Δt = 0.5 hours
    (avg_temperature - 10.0) * 0.5 as calculated_maturity,
    -- Add some derived fields for better monitoring
    CASE 
        WHEN avg_temperature < 10 THEN 'Below Base'
        WHEN avg_temperature BETWEEN 10 AND 20 THEN 'Low'
        WHEN avg_temperature BETWEEN 20 AND 30 THEN 'Moderate'
        WHEN avg_temperature BETWEEN 30 AND 40 THEN 'High'
        ELSE 'Very High'
    END as temperature_category
FROM temperature_data
ORDER BY timestamp DESC;

-- Create a function to calculate cumulative maturity from your temperature_data
CREATE OR REPLACE FUNCTION calculate_cumulative_maturity_from_temperature_data(
    hours_back INTEGER DEFAULT 24
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    cumulative_maturity DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM((avg_temperature - 10.0) * 0.5), 0)
    INTO cumulative_maturity
    FROM temperature_data
    WHERE timestamp >= NOW() - INTERVAL '1 hour' * hours_back;
    
    RETURN cumulative_maturity;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get maturity status
CREATE OR REPLACE FUNCTION get_maturity_status(maturity_value DECIMAL)
RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN maturity_value < 50 THEN RETURN 'low';
        WHEN maturity_value < 100 THEN RETURN 'moderate';
        WHEN maturity_value < 200 THEN RETURN 'high';
        ELSE RETURN 'critical';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get recent temperature statistics
CREATE OR REPLACE FUNCTION get_recent_temperature_stats(
    hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
    avg_temp DECIMAL(5,2),
    min_temp DECIMAL(5,2),
    max_temp DECIMAL(5,2),
    reading_count BIGINT,
    cumulative_maturity DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(avg_temperature)::DECIMAL, 2) as avg_temp,
        ROUND(MIN(avg_temperature)::DECIMAL, 2) as min_temp,
        ROUND(MAX(avg_temperature)::DECIMAL, 2) as max_temp,
        COUNT(*) as reading_count,
        ROUND(SUM((avg_temperature - 10.0) * 0.5)::DECIMAL, 2) as cumulative_maturity
    FROM temperature_data
    WHERE timestamp >= NOW() - INTERVAL '1 hour' * hours_back;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE temperature_data TO anon, authenticated;
GRANT ALL ON VIEW maturity_calculations TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_cumulative_maturity_from_temperature_data TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_maturity_status TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_recent_temperature_stats TO anon, authenticated;

-- Insert some sample data if your table is empty (optional)
-- Uncomment the following lines if you want to add sample data
/*
INSERT INTO temperature_data (timestamp, avg_temperature, battery_level, sensor_count) VALUES
(NOW() - INTERVAL '1 hour', 25.5, 85.2, 3),
(NOW() - INTERVAL '2 hours', 26.1, 84.9, 3),
(NOW() - INTERVAL '3 hours', 24.8, 85.1, 3),
(NOW() - INTERVAL '4 hours', 27.3, 84.7, 3),
(NOW() - INTERVAL '5 hours', 25.9, 85.0, 3);
*/
