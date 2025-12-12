# MediCare Portal - Design System Guide

## 🎨 Color Palette

### Primary Colors
```
Background: #0a0118 (Deep Dark Purple)
Foreground: #f8f9fa (Off White)
```

### Gradient Colors
```
Purple: #667eea → #764ba2
Pink:   #f093fb → #f5576c  
Cyan:   #38bdf8 → #0ea5e9
```

### Status Colors
```
Success (Approved): #10b981 (Green)
Warning (Pending):  #f59e0b (Yellow/Orange)
Error (Rejected):   #ef4444 (Red)
Info:               #38bdf8 (Cyan)
```

### UI Element Colors
```
Glass Card Background: rgba(255, 255, 255, 0.05)
Border: rgba(255, 255, 255, 0.1)
Input Background: rgba(255, 255, 255, 0.05)
Text Muted: #94a3b8
Text Secondary: #a78bfa
```

---

## 📐 Spacing & Sizing

### Border Radius
```
Small:  0.5rem (8px)
Medium: 1rem (16px)
Large:  1.5rem (24px)
XL:     2rem (32px)
2XL:    3rem (48px)
```

### Shadows
```
Glass Card: 0 8px 32px 0 rgba(102, 126, 234, 0.2)
Hover:      0 8px 32px 0 rgba(240, 147, 251, 0.3)
Pulse:      0 0 20px rgba(168, 85, 247, 0.4)
```

---

## 🎯 Component Classes

### Cards
```css
.glass-card
  - backdrop-blur-xl
  - bg-white/5
  - border border-white/10
  - shadow-2xl

.glass-card-hover
  - All glass-card properties
  - transition-all duration-300
  - hover:bg-white/10
  - hover:-translate-y-1
  - hover:shadow-[0_8px_32px_0_rgba(240,147,251,0.3)]
```

### Buttons
```css
.gradient-button
  - bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500
  - hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600
  - text-white
  - font-semibold
  - rounded-2xl
  - shadow-lg
  - hover:shadow-xl
  - transition-all duration-300
  - hover:scale-105
```

### Text
```css
.gradient-text
  - bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400
  - bg-clip-text
  - text-transparent
```

### Inputs
```css
.input-glow
  - bg-white/5
  - border border-purple-500/30
  - focus:border-pink-500/50
  - focus:ring-2 focus:ring-pink-500/20
  - text-white
  - placeholder:text-gray-400
  - rounded-xl
  - transition-all duration-300
```

---

## 🎬 Animations

### Floating Animation
```css
@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

Duration: 6s ease-in-out infinite
```

### Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
  50% { box-shadow: 0 0 30px rgba(240, 147, 251, 0.6); }
}

Duration: 2s ease-in-out infinite
```

---

## 📱 Layout Patterns

### Split Screen (Login/Register)
```
Desktop: 50% branding | 50% form
Tablet:  Hidden | 100% form
Mobile:  Hidden | 100% form
```

### Dashboard Layout
```
1. Header Card (Full width)
2. Stats Grid (1-3-4 columns responsive)
3. Notifications Section (Conditional)
4. Main Content Cards (Full width)
5. Table/List Section (Full width)
```

### Card Grid
```
Mobile:  1 column
Tablet:  2 columns
Desktop: 3-4 columns
```

---

## 🎨 Background Pattern

```css
body {
  background-color: #0a0118;
  background-image: 
    radial-gradient(at 0% 0%, rgba(102, 126, 234, 0.15), transparent 50%),
    radial-gradient(at 100% 0%, rgba(240, 147, 251, 0.15), transparent 50%),
    radial-gradient(at 100% 100%, rgba(118, 75, 162, 0.15), transparent 50%),
    radial-gradient(at 0% 100%, rgba(56, 189, 248, 0.15), transparent 50%);
  background-attachment: fixed;
}
```

---

## 🔤 Typography Scale

```
Display: 7xl-8xl (72px-96px) - Hero headings
H1:      4xl (36px) - Page titles
H2:      3xl (30px) - Section titles
H3:      2xl (24px) - Card titles
H4:      xl (20px) - Subsections
Body:    base (16px) - Regular text
Small:   sm (14px) - Captions
Tiny:    xs (12px) - Meta info
```

---

## 🎯 Icon System

Using emoji icons throughout:
```
🏥 - Healthcare/Hospital
👤 - Patient
👨‍⚕️ - Doctor
📅 - Appointments/Calendar
🔔 - Notifications
✅ - Approved/Success
⏳ - Pending
❌ - Rejected/Cancel
🔐 - Login/Security
✨ - New/Create
🔄 - Sync/Refresh
📊 - Statistics
🔒 - Security
📋 - List/Records
➕ - Add/Create
```

---

## 🎪 Status Badge Styling

```css
Approved:
  - bg-green-500/20
  - text-green-300
  - border border-green-500/50

Pending:
  - bg-yellow-500/20
  - text-yellow-300
  - border border-yellow-500/50

Rejected:
  - bg-red-500/20
  - text-red-300
  - border border-red-500/50
```

---

## 💡 Best Practices

1. **Always use glass-card** for container elements
2. **Apply gradient-text** to major headings
3. **Use gradient-button** for primary actions
4. **Add floating-animation** to background elements
5. **Include pulse-glow** on important cards
6. **Maintain consistent border-radius** (2xl/3xl)
7. **Use emoji icons** for visual appeal
8. **Ensure hover effects** on interactive elements
9. **Keep backgrounds semi-transparent** for depth
10. **Layer elements** with z-index for proper stacking

---

## 🔧 Customization

To modify the theme:

1. **Colors**: Edit CSS variables in `globals.css`
2. **Animations**: Adjust keyframes timing
3. **Spacing**: Modify Tailwind spacing values
4. **Gradients**: Change gradient color stops
5. **Glass Effect**: Adjust backdrop-blur and opacity

---

## 🎉 Result

A cohesive, modern design system that creates a unique and memorable user experience while maintaining excellent usability and accessibility.

