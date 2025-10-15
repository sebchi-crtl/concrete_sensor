# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Create a new project
4. Wait for the project to be set up

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase credentials.

## 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-temperature-data-setup.sql` into the editor
3. Click **Run** to execute the SQL

This will set up:
- Indexes on your existing `temperature_data` table for better performance
- Row Level Security policies
- Helper functions and views for maturity calculations
- Functions to work with your existing data structure

**Note:** Your existing `temperature_data` table structure is already perfect for this application!

## 5. Test the Connection

1. Start your development server: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. You should see the Concrete Maturity Monitor with Supabase data

## Maturity Calculation

The system now calculates concrete maturity using the formula:
**Maturity M = Σ (Ta - To) Δt**

Where:
- **To** = 10°C (base temperature)
- **Ta** = Average Temperature (from your `avg_temperature` field)
- **Δt** = 0.5 hours (time interval)

The maturity value is displayed prominently in the main dashboard and indicates the concrete's curing progress.

## Data Structure

Your existing `temperature_data` table is used with these fields:
- `avg_temperature`: The average temperature reading (used for maturity calculation)
- `battery_level`: Battery level of the sensors
- `sensor_count`: Number of active sensors
- `timestamp`: When the reading was taken
- `network_time`: Network timestamp in Africa/Lagos timezone

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure the database table was created successfully

### No Data Showing
- Check if the `readings` table has data
- Verify Row Level Security policies allow your access
- Check the browser console for any error messages

### Maturity Calculation Issues
- Ensure temperature readings are in Celsius
- Verify the time intervals are consistent
- Check that the base temperature (10°C) is appropriate for your use case
