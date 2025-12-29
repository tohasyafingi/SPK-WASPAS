# Supabase Setup Guide untuk SPK WASPAS

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Project Name**: `spk-waspas` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for it to initialize (5-10 minutes)

## 2. Get Your Credentials

1. After project creation, go to **Settings** > **API**
2. Copy and save:
   - **Project URL** → `SUPABASE_URL` in `.env`
   - **Public anon key** → `SUPABASE_ANON_KEY` in `.env`
   - **Service role key** (optional, for admin operations)

Example:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Create Database Tables

### Option A: Using Supabase UI (Easiest)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `supabase/migrations/001_init_schema.sql`
4. Paste it in the SQL editor
5. Click "Run" button

### Option B: Using psql (Command Line)

```bash
# Get connection string from Settings > Database
psql "postgresql://postgres:[password]@[host]:5432/postgres" < supabase/migrations/001_init_schema.sql
```

## 4. Update Backend Configuration

1. Copy `.env.example.supabase` to `.env`:
   ```bash
   cp backend/.env.example.supabase backend/.env
   ```

2. Edit `backend/.env` and fill in:
   ```bash
   SUPABASE_URL=your-project-url
   SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=generate-random-32-chars
   ```

3. Generate JWT_SECRET (PowerShell):
   ```powershell
   [Convert]::ToBase64String(([byte[]](Get-Random -Count 32 -Maximum 256)))
   ```

## 5. Install Dependencies

```bash
cd backend
npm install
```

## 6. Update Import Paths (Important!)

Replace SQLite imports with Supabase imports in your code:

### In `src/index.js`:
```javascript
// Change from:
import { initDatabase } from './database/db.js';

// To:
import { initDatabase } from './database/db.supabase.js';
```

### In Repository files:
```javascript
// Change from:
import { getDatabase } from '../database/db.js';

// To:
import supabase from '../config/supabase.js';

// And use Supabase client directly:
const { data, error } = await supabase
  .from('users')
  .select('*');
```

## 7. Test Connection

```bash
npm start
```

You should see: `✓ Database initialized successfully`

If you get an error:
- Check your SUPABASE_URL and SUPABASE_ANON_KEY
- Make sure tables were created in SQL Editor
- Check Supabase project status (Settings > Status)

## 8. Create Admin User (Optional)

Run in backend directory:
```bash
node -e "
import * as UserRepo from './src/repository/UserRepository.supabase.js';
import bcrypt from 'bcryptjs';

const password = await bcrypt.hash('admin123', 10);
await UserRepo.create({
  username: 'admin',
  password,
  email: 'admin@spk.local',
  nama_lengkap: 'Administrator',
  role: 'admin'
});
console.log('Admin user created!');
"
```

## 9. Deploy to Railway with Supabase

### Backend Configuration:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-anon-key
  JWT_SECRET=your-generated-secret
  NODE_ENV=production
  CORS_ORIGIN=https://frontend-domain.railway.app
  ```

### Frontend Configuration:
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  REACT_APP_API_URL=https://backend-domain.railway.app/api
  ```

## 10. Verify Everything Works

1. Test API health:
   ```bash
   curl https://backend-domain.railway.app/api/health
   ```

2. Access frontend:
   ```
   https://frontend-domain.railway.app
   ```

3. Login with admin credentials

## Troubleshooting

### Error: "Missing Supabase configuration"
- Check SUPABASE_URL and SUPABASE_ANON_KEY are set in `.env`
- Verify values are correct from Supabase Settings > API

### Error: "Database connection failed"
- Make sure tables are created in Supabase SQL Editor
- Check your internet connection
- Verify Supabase project status is "Healthy"

### Error: "PGRST116"
- This is normal (means row not found)
- Code handles this automatically

### Tables not showing in Supabase UI
- Refresh the page (F5)
- Check SQL Editor > Query results for successful execution
- Look at the "Tables" section in the left sidebar

## Next Steps

1. Import sample data (kriteria, kandidat)
2. Test WASPAS calculation functionality
3. Monitor performance in Supabase Metrics
4. Set up backup schedule (Supabase does this automatically)

## Additional Resources

- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript/introduction
- SQL Guide: https://supabase.com/docs/guides/database
