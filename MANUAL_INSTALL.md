# Cascade Manual Installation Guide

## Quick Fix for Missing Dependencies

The issue is that npm install was interrupted. Here's how to fix it:

### Step 1: Install Dependencies Manually
Run these commands one by one in PowerShell:

```powershell
# Install root dependencies
"C:\Program Files\nodejs\npm.cmd" install

# Install Excel add-in dependencies
cd excel-addin
"C:\Program Files\nodejs\npm.cmd" install
cd ..

# Install backend dependencies
cd backend
"C:\Program Files\nodejs\npm.cmd" install
cd ..
```

### Step 2: Start Servers Manually
Instead of using npm run dev, start each server separately:

**Terminal 1 (Backend):**
```powershell
cd backend
"C:\Program Files\nodejs\npm.cmd" run dev
```

**Terminal 2 (Excel Add-in):**
```powershell
cd excel-addin
"C:\Program Files\nodejs\npm.cmd" run dev
```

### Step 3: Alternative - Use the Batch Script
If npm install works, you can use:
```powershell
.\start-dev.bat
```

### Step 4: Load Excel Add-in
1. Open Microsoft Excel
2. Go to Insert → Office Add-ins
3. Click "Upload My Add-in"
4. Select `excel-addin\manifest.xml`

## Troubleshooting

### If npm install keeps failing:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `Remove-Item -Recurse -Force node_modules`
3. Try installing with: `npm install --legacy-peer-deps`

### If ports are busy:
- Backend: Change PORT in backend/.env
- Add-in: Change port in excel-addin/vite.config.ts

### If Excel add-in won't load:
- Ensure HTTPS is enabled
- Check browser console for errors
- Try reloading Excel

## Success Indicators
- Backend: http://localhost:3000/health returns JSON
- Add-in: https://localhost:3001 loads without errors
- Excel: Cascade tab appears in ribbon

