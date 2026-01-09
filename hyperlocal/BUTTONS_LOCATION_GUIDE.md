# 🎨 Dark Mode & Language Selector - Location Guide

## 📍 Where to Find Them

### Location: **TOP-RIGHT CORNER OF HEADER**

The Dark Mode toggle and Language selector are located in the header, on the **right side** next to the title.

```
┌─────────────────────────────────────────────────────────────┐
│  🌩️ Hyderabad Hyperlocal PM2.5 Monitoring System  [తె हि EN] [🌙 Dark] │
│  Zone-level PM2.5 estimation tool...                         │
│  Status: ● LIVE | Last Synchronized: 11:40:08 AM             │
│  [📄 DOWNLOAD ALERT REPORT]                                  │
└─────────────────────────────────────────────────────────────┘
                                                    ↑        ↑
                                              Language  Dark Mode
```

---

## 🔍 Visual Appearance

### Language Selector:
- **Looks like**: Three buttons in a row: `EN` `తె` `हि`
- **Background**: Semi-transparent white with border
- **Active language**: Highlighted with brighter background
- **Location**: Right side of header, before Dark Mode button

### Dark Mode Toggle:
- **Looks like**: Button with moon/sun icon + text
- **Light mode**: 🌙 Moon icon + "Dark" text
- **Dark mode**: ☀️ Sun icon + "Light" text
- **Background**: Semi-transparent white with border
- **Location**: Right side of header, after Language selector

---

## ✅ What I Just Fixed

### Made Buttons MORE VISIBLE:
1. **Stronger background**: Changed from 10% to 25% opacity
2. **Thicker borders**: Changed from 1px to 2px
3. **Better shadows**: Added drop shadows
4. **Larger padding**: Increased from 8px to 10px
5. **Bolder text**: Changed from 600 to 700 font-weight
6. **Higher contrast**: Brighter colors

### Before vs After:
- **Before**: Faint, barely visible buttons
- **After**: Clear, prominent buttons with shadows

---

## 🧪 How to See Them

### Step 1: Hard Refresh
Press **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac) to force reload CSS

### Step 2: Check Header
Look at the **top-right corner** of the page header (dark blue section)

### Step 3: Look For:
- **Language selector**: Three small buttons (EN, తె, हि)
- **Dark mode button**: Button with moon icon and "Dark" text

---

## 🎯 Expected Appearance

### Desktop View:
```
Header (Dark Blue Background)
┌────────────────────────────────────────────────────────┐
│ 🌩️ Title                    [తె हि EN] [🌙 Dark]      │
│ Description                                             │
└────────────────────────────────────────────────────────┘
```

### Mobile View:
```
Header
┌─────────────────┐
│ 🌩️ Title        │
│ Description     │
│ [తె हि EN]      │
│ [🌙 Dark]       │
└─────────────────┘
```

---

## 🐛 Troubleshooting

### If you still don't see them:

#### 1. **Hard Refresh**
- Windows/Linux: **Ctrl+Shift+R**
- Mac: **Cmd+Shift+R**
- This clears the CSS cache

#### 2. **Check Browser Console**
- Press **F12**
- Go to **Console** tab
- Look for any errors

#### 3. **Verify CSS Version**
- Press **F12**
- Go to **Network** tab
- Refresh page
- Look for `dark-mode.css?v=2.0`
- Should show version **2.0** (not 1.0)

#### 4. **Check Element**
- Press **F12**
- Click inspector tool
- Click on header area
- Look for elements with classes:
  - `.theme-toggle`
  - `.language-selector`

#### 5. **Clear All Cache**
- Chrome: Settings → Privacy → Clear browsing data
- Firefox: Settings → Privacy → Clear Data
- Edge: Settings → Privacy → Choose what to clear

---

## 📱 Mobile View

On mobile devices (< 768px width):
- Buttons stack vertically below the title
- Slightly smaller font size (0.65rem)
- Still visible and clickable
- Touch-friendly (40px minimum)

---

## 🎨 Button Styles

### Theme Toggle Button:
```css
Background: Semi-transparent white (25% opacity)
Border: 2px solid white (40% opacity)
Color: White
Padding: 10px 18px
Shadow: Soft drop shadow
Font: Bold (700 weight)
```

### Language Selector:
```css
Background: Semi-transparent white (25% opacity)
Border: 2px solid white (40% opacity)
Buttons: EN, తె, हि
Active: Brighter background + shadow
Font: Bold (700 weight)
```

---

## ✅ Verification

After hard refresh, you should see:

- [ ] **Language selector visible** (3 buttons: EN, తె, हि)
- [ ] **Dark mode button visible** (moon icon + "Dark" text)
- [ ] **Buttons have white semi-transparent background**
- [ ] **Buttons have visible borders**
- [ ] **Buttons have drop shadows**
- [ ] **Clicking language changes text**
- [ ] **Clicking dark mode changes theme**

---

## 🚀 Quick Test

1. **Open**: http://localhost:8080
2. **Hard Refresh**: Ctrl+Shift+R
3. **Look**: Top-right corner of header
4. **Click**: Language buttons (EN, తె, हि)
5. **Click**: Dark mode button (🌙 Dark)
6. **Verify**: Page changes theme

---

## 📸 What You Should See

### In the Header (Top-Right):
```
[తె] [हि] [EN]  [🌙 Dark]
 ↑    ↑    ↑      ↑
Telugu Hindi English  Dark Mode
```

### When You Click Dark Mode:
- Icon changes: 🌙 → ☀️
- Text changes: "Dark" → "Light"
- Entire page becomes dark
- Buttons remain visible

### When You Click Language:
- Active button gets highlighted
- All text on page changes language
- Chart labels change
- Button labels change

---

## 🎯 Current Status

✅ **Buttons are in the HTML** (lines 32-44)
✅ **CSS styles are defined** (dark-mode.css)
✅ **JavaScript functions exist** (script.js)
✅ **Styles are now MORE VISIBLE** (v2.0)

**Version**: dark-mode.css v2.0
**Status**: FIXED - Buttons should be clearly visible now!

---

**Last Updated**: January 9, 2026, 11:42 AM IST
**Action Required**: Hard refresh browser (Ctrl+Shift+R)
