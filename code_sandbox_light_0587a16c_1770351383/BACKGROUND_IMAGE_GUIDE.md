# 📸 BACKGROUND IMAGE MANAGEMENT GUIDE

## 🎯 Easy Background Image System

I've created a simple system for you to easily add and manage background images!

---

## 📁 FOLDER STRUCTURE

```
jaredraylaw/
├── images/
│   ├── logo.png (existing)
│   └── backgrounds/  ← NEW FOLDER
│       ├── bg-1.jpg  ← Add your images here
│       ├── bg-2.jpg
│       ├── bg-3.jpg
│       ├── bg-4.jpg
│       ├── bg-5.jpg
│       └── ... (add more as needed)
```

---

## ✅ HOW TO ADD NEW BACKGROUND IMAGES

### **Step 1: Prepare Your Images**

**Best Practices:**
- **Format:** JPG (for photos)
- **Size:** 1920x1080 pixels (Full HD)
- **Orientation:** Landscape/horizontal
- **File Size:** Keep under 200KB each (compress if needed)
- **Naming:** bg-1.jpg, bg-2.jpg, bg-3.jpg, etc.

**For your coral reef photos:**
- They'll work great as backgrounds!
- Make sure they're landscape orientation
- Optimize/compress before uploading

---

### **Step 2: Add Images to Folder**

1. **Create folder** (if doesn't exist):
   ```
   C:\jaredraylaw\jaredraylaw\images\backgrounds\
   ```

2. **Copy your images** to this folder:
   ```
   images/backgrounds/bg-1.jpg
   images/backgrounds/bg-2.jpg
   images/backgrounds/bg-3.jpg
   (and so on...)
   ```

3. **Also copy to public folder:**
   ```
   public/images/backgrounds/bg-1.jpg
   public/images/backgrounds/bg-2.jpg
   etc.
   ```

---

### **Step 3: Update the JavaScript (Optional)**

If you add more than 5 images, edit `js/backgrounds.js`:

```javascript
const backgroundImages = [
    'bg-1.jpg',
    'bg-2.jpg',
    'bg-3.jpg',
    'bg-4.jpg',
    'bg-5.jpg',
    'bg-6.jpg',  ← Add new ones here
    'bg-7.jpg',
    'bg-8.jpg'
];
```

---

### **Step 4: Deploy**

```bash
git add images/backgrounds public/images/backgrounds
git commit -m "Add background images"
git push origin main
```

**That's it!** Images will automatically rotate every 10 seconds!

---

## ⚙️ CONFIGURATION OPTIONS

### **Change Rotation Speed**

In `js/backgrounds.js`, change this line:

```javascript
const ROTATION_INTERVAL = 10000; // milliseconds

// Examples:
// 5 seconds:  5000
// 10 seconds: 10000
// 15 seconds: 15000
// 30 seconds: 30000
```

---

### **Disable Auto-Rotation**

If you want just ONE background image without rotation:

```javascript
const ENABLE_ROTATION = false; // Turn off rotation
```

Then only `bg-1.jpg` will show.

---

### **Change Image Opacity**

In `css/backgrounds.css`, change the opacity:

```css
.hero::before {
    opacity: 0.15;  /* Current: 15% visible */
}

/* Examples: */
/* More visible:   0.25 (25%) */
/* Less visible:   0.10 (10%) */
/* Very subtle:    0.05 (5%)  */
```

---

## 🎨 WHERE BACKGROUNDS APPEAR

### **1. Hero Section** (Main)
- Large background behind main heading
- "Affordable Legal Advice and Assistance"
- Rotates automatically

### **2. CTA Banners** (Optional)
- Can add backgrounds to call-to-action sections
- Very subtle (5-10% opacity)

### **3. Practice Areas** (Optional)
- Can add background to services section
- Very subtle to not distract from content

---

## 📋 CURRENT SETUP

### **Files Created:**
- ✅ `css/backgrounds.css` - Styling for backgrounds
- ✅ `js/backgrounds.js` - Rotation logic
- ✅ Documentation ready

### **Files Needed:**
- ⏳ `images/backgrounds/` folder
- ⏳ Your coral reef photos (to be added)

---

## 🖼️ IMAGE OPTIMIZATION TIPS

### **Before Uploading:**

1. **Resize to 1920x1080:**
   - Use online tool: tinypng.com or compressor.io
   - Or Windows Photos app
   - Or Mac Preview app

2. **Compress:**
   - Target: Under 200KB per image
   - TinyPNG: https://tinypng.com/
   - Compressor.io: https://compressor.io/

3. **Check Orientation:**
   - Must be landscape (horizontal)
   - Not portrait (vertical)

---

## 🚀 QUICK START CHECKLIST

When you're ready to add your coral reef photos:

- [ ] 1. Create folder: `images/backgrounds/`
- [ ] 2. Rename photos: bg-1.jpg, bg-2.jpg, etc.
- [ ] 3. Optimize images (resize + compress)
- [ ] 4. Copy to `images/backgrounds/`
- [ ] 5. Copy to `public/images/backgrounds/`
- [ ] 6. Update `js/backgrounds.js` if adding more than 5
- [ ] 7. Test locally (open index.html)
- [ ] 8. Deploy: git add, commit, push
- [ ] 9. Wait 2 minutes for deployment
- [ ] 10. Check jaredraylaw.pages.dev

---

## 💡 EXAMPLE: Adding 10 Coral Reef Photos

### **Folder Structure:**
```
images/backgrounds/
├── bg-1.jpg  (coral-reef-1.jpg → renamed)
├── bg-2.jpg  (coral-reef-2.jpg → renamed)
├── bg-3.jpg  (coral-reef-3.jpg → renamed)
├── bg-4.jpg  (coral-reef-4.jpg → renamed)
├── bg-5.jpg  (coral-reef-5.jpg → renamed)
├── bg-6.jpg  (coral-reef-6.jpg → renamed)
├── bg-7.jpg  (coral-reef-7.jpg → renamed)
├── bg-8.jpg  (coral-reef-8.jpg → renamed)
├── bg-9.jpg  (coral-reef-9.jpg → renamed)
└── bg-10.jpg (coral-reef-10.jpg → renamed)
```

### **Update js/backgrounds.js:**
```javascript
const backgroundImages = [
    'bg-1.jpg',
    'bg-2.jpg',
    'bg-3.jpg',
    'bg-4.jpg',
    'bg-5.jpg',
    'bg-6.jpg',
    'bg-7.jpg',
    'bg-8.jpg',
    'bg-9.jpg',
    'bg-10.jpg'
];
```

### **Deploy:**
```bash
git add images/backgrounds public/images/backgrounds js/backgrounds.js
git commit -m "Add 10 coral reef background images"
git push origin main
```

**Done!** 🎉

---

## 🎯 ADVANTAGES OF THIS SYSTEM

1. ✅ **Easy to Add** - Just drop files in folder
2. ✅ **Automatic Rotation** - No manual work
3. ✅ **Preloading** - Smooth transitions
4. ✅ **Configurable** - Adjust speed, opacity
5. ✅ **Non-Intrusive** - Subtle, doesn't distract
6. ✅ **Professional** - Adds visual interest
7. ✅ **Optimized** - Won't slow down site

---

## 📞 NEED HELP?

**When we meet in person:**
- AirDrop your coral reef photos to me
- I'll optimize and add them
- We'll adjust opacity/speed together
- Test on different devices

**Or do it yourself:**
- Follow this guide
- It's designed to be super simple
- Just copy files and deploy!

---

## 🎨 VISUAL PREVIEW

**How it will look:**
```
┌─────────────────────────────────────────────┐
│                                             │
│    [Coral Reef Background - Very Subtle]    │
│                                             │
│    AFFORDABLE LEGAL ADVICE AND ASSISTANCE   │
│    North East Ohio Assets Lawyer | Notary   │
│                                             │
│    [Call Button]  [Contact Button]          │
│                                             │
└─────────────────────────────────────────────┘
```
- Background: 15% opacity (subtle)
- Text: Fully readable
- Buttons: Clear and clickable
- Professional appearance

---

**Your background image system is ready to use!** 🎉

**Just add your coral reef photos when ready!** 🐠🪸
