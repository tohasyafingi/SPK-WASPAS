# Migration: SQLite to Supabase

Complete guide to migrate your SPK WASPAS system from SQLite to Supabase.

## Overview

The system now supports **both** SQLite and Supabase:
- **SQLite** (Original): `src/database/db.js` - Local file-based database
- **Supabase** (New): `src/database/db.supabase.js` - Cloud PostgreSQL database

## Step-by-Step Migration

### Phase 1: Setup Supabase (10 minutes)

1. **Create Supabase Project** (see SUPABASE_SETUP.md)
2. **Get Credentials**:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
3. **Create Tables** - Run SQL from `supabase/migrations/001_init_schema.sql`

### Phase 2: Update Code (15 minutes)

#### Option A: Use Supabase Everywhere (Recommended)

1. **Update `backend/src/index.js`**:
   ```javascript
   // Line 8: Change from
   import { initDatabase } from './database/db.js';
   // To:
   import { initDatabase } from './database/db.supabase.js';
   ```

2. **Update Repository Imports**:

   In each controller/service that uses repositories, change:
   ```javascript
   // From:
   import * as UserRepository from '../repository/UserRepository.js';
   import KandidatRepository from '../repository/KandidatRepository.js';
   
   // To:
   import * as UserRepository from '../repository/UserRepository.supabase.js';
   import KandidatRepository from '../repository/KandidatRepository.supabase.js';
   ```

3. **Files to Update**:
   - `src/controller/AuthController.js`
   - `src/controller/KandidatController.js`
   - `src/controller/KriteriController.js`
   - `src/controller/PenilaianController.js`
   - `src/service/AuthService.js`
   - `src/service/KandidatService.js`
   - `src/service/KriteriaService.js`
   - `src/service/PenilaianService.js`
   - `src/service/WaspasService.js`

#### Option B: Keep Both (For Testing)

Keep old files for reference:
- Keep `src/database/db.js` (SQLite)
- Use `src/database/db.supabase.js` (Supabase)
- Keep old repositories for fallback

### Phase 3: Migrate Data (If You Have Existing Data)

#### From SQLite to Supabase:

1. **Export SQLite Data to JSON**:
   ```javascript
   // Node script to export data
   import sqlite3 from 'sqlite3';
   import fs from 'fs';

   const db = new sqlite3.Database('./src/database/spk_waspas.db');
   
   const data = {
     users: [],
     kandidat: [],
     kriteria: [],
     penilaian: []
   };

   db.all('SELECT * FROM users', (err, rows) => {
     if (!err) data.users = rows;
   });

   db.all('SELECT * FROM kandidat', (err, rows) => {
     if (!err) data.kandidat = rows;
   });

   db.all('SELECT * FROM kriteria', (err, rows) => {
     if (!err) data.kriteria = rows;
   });

   db.all('SELECT * FROM penilaian', (err, rows) => {
     if (!err) data.penilaian = rows;
   });

   setTimeout(() => {
     fs.writeFileSync('export.json', JSON.stringify(data, null, 2));
     db.close();
   }, 1000);
   ```

2. **Import to Supabase**:
   ```javascript
   // Node script to import data
   import supabase from './src/config/supabase.js';
   import fs from 'fs';

   const data = JSON.parse(fs.readFileSync('export.json', 'utf8'));

   // Insert users
   for (const user of data.users) {
     await supabase.from('users').insert(user);
   }

   // Insert kandidat
   for (const kandidat of data.kandidat) {
     await supabase.from('kandidat').insert(kandidat);
   }

   // Insert kriteria
   for (const kriteria of data.kriteria) {
     await supabase.from('kriteria').insert(kriteria);
   }

   // Insert penilaian
   for (const penilaian of data.penilaian) {
     await supabase.from('penilaian').insert(penilaian);
   }

   console.log('Migration complete!');
   ```

### Phase 4: Environment Setup

1. **Create `.env` from template**:
   ```bash
   cp backend/.env.example.supabase backend/.env
   ```

2. **Fill in Your Credentials**:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=your-generated-secret
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

### Phase 5: Test Locally

```bash
npm start
```

Check logs for:
```
✓ Database initialized successfully
```

### Phase 6: Deploy to Railway

See RAILWAY_FIX_MONOREPO.md for Railway setup, but with these env vars:

**Backend Environment Variables in Railway**:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secret
NODE_ENV=production
CORS_ORIGIN=https://frontend-domain.railway.app
```

**No need for**:
- ❌ `DB_PATH` (SQLite specific)
- ❌ Database file migrations

## Repository Comparison

### SQLite Repository Example:
```javascript
export async function getAll() {
  const db = getDatabase();
  const users = await db.all('SELECT * FROM users');
  return users || [];
}
```

### Supabase Repository Example:
```javascript
export async function getAll() {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data || [];
}
```

## Key Differences

| Feature | SQLite | Supabase |
|---------|--------|----------|
| Database Type | File-based (local) | Cloud PostgreSQL |
| Scalability | Limited to single instance | Unlimited, auto-scaling |
| Real-time | No | Yes (optional) |
| Backups | Manual | Automatic |
| Cost | Free (local) | Free tier generous, then paid |
| Performance | Suitable for dev | Production-grade |
| Collaboration | Single server | Multi-user ready |

## Rollback Plan

If you need to go back to SQLite:

1. **Revert imports** in `src/index.js` to `./database/db.js`
2. **Revert repository imports** to non-supabase versions
3. **Restore SQLite database file** from backup
4. **Restart server**

## Troubleshooting

### Error: "Unknown column" in migration
- SQLite and PostgreSQL have slight syntax differences
- Check `supabase/migrations/001_init_schema.sql` for PostgreSQL syntax
- Fix in SQL Editor before running

### Error: "UNIQUE constraint violation"
- Data might already exist in Supabase
- Check Supabase table contents
- Delete and re-import if needed

### Performance Issue
- Check Supabase Metrics (Settings > Metrics)
- Ensure indexes are created (see SQL migration)
- Optimize queries if needed

### JWT token errors
- Make sure JWT_SECRET is set in .env
- Should be at least 32 characters
- Regenerate if unsure

## Success Criteria

✓ Server starts without errors
✓ `/api/health` returns 200 status
✓ Login works with valid credentials
✓ Can CRUD kandidat, kriteria, penilaian
✓ WASPAS calculation produces correct results
✓ Frontend loads and connects to backend

## Next Steps

1. Update CI/CD pipelines if using them
2. Monitor Supabase usage (free tier limits)
3. Set up automated backups (Supabase does this)
4. Test edge cases and error handling
5. Update documentation

## Support

- Supabase Issues: https://github.com/supabase/supabase/issues
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Supabase Community: https://discord.supabase.io

---

**Last Updated**: December 2024
**Status**: Ready for Production
