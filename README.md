# FORGE Marketing Site

Marketing and landing page for FORGE Travel Tools.

## Structure

```
forge-marketing/
├── index.html          # Main landing page
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Waitlist form + interactions
└── assets/
    ├── forge-logo.png       # Logo for nav (dark, for light bg)
    ├── forge-logo-light.png # Logo for footer (light, for dark bg)
    ├── forge-icon.png       # Favicon
    └── hero-screenshot.png  # Product screenshot for hero
```

## Setup

1. Add logo files to `/assets`
2. Add hero screenshot to `/assets`
3. Create `waitlist` table in Supabase (see below)
4. Deploy to Cloudflare Pages
5. Connect `forgetravel.co` domain

## Supabase Waitlist Table

Run this SQL in Supabase:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public inserts (no auth required)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);
```

## Deployment

Connected to Cloudflare Pages project: `forge-marketing`
Domain: `forgetravel.co`
