# RESPONSIVE DESIGN QUICK REFERENCE

## Responsive Utility Classes

### Display/Visibility

```css
.show-mobile   /* Display only on mobile (≤ 768px) */
.show-tablet   /* Display only on tablets (641px-1024px) */
.show-desktop  /* Display only on desktop (≥ 1025px) */

.hide-mobile   /* Hide on mobile */
.hide-tablet   /* Hide on tablets */
.hide-desktop  /* Hide on desktop */
```

### Spacing (Auto-scales with viewport)

```css
.px-responsive   /* Horizontal padding: 1rem → 2rem */
.py-responsive   /* Vertical padding: 1rem → 2rem */
.mx-responsive   /* Horizontal margin: 1rem → 2rem */
.my-responsive   /* Vertical margin: 1rem → 2rem */
.gap-responsive  /* Gap: 0.75rem → 1.5rem */
```

### Typography

```css
.text-responsive   /* Font size: 0.95rem → 1.1rem */
.container-responsive /* Container with responsive padding */
```

---

## Tailwind Responsive Prefixes

### Breakpoints

```
sm:  640px   → .sm:text-2xl
md:  768px   → .md:grid-cols-2
lg:  1024px  → .lg:px-8
xl:  1280px  → .xl:grid-cols-4
2xl: 1536px  → .2xl:max-w-7xl
```

### Common Patterns

```jsx
/* Grid: 1 column mobile → 4 columns desktop */
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

/* Padding: Small mobile → Large desktop */
<div className="px-4 sm:px-6 md:px-8 lg:px-10">

/* Typography: Scale with screen */
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

/* Hide/Show: Mobile vs Desktop */
<div className="hidden lg:block">Desktop Only</div>
<div className="lg:hidden">Mobile Only</div>

/* Flex: Stack mobile → Row desktop */
<div className="flex flex-col md:flex-row gap-4 md:gap-8">
```

---

## Quick Implementation Examples

### Responsive Card

```jsx
<div className="px-4 sm:px-6 lg:px-8 py-responsive">
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Responsive Card</h2>
    <p className="text-sm sm:text-base mt-2">Content adapts to screen size</p>
  </div>
</div>
```

### Responsive Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-responsive">
  {/* Items automatically arrange */}
  {items.map((item) => (
    <Item key={item.id} {...item} />
  ))}
</div>
```

### Responsive Form

```jsx
<form className="max-w-2xl mx-auto px-responsive space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input className="w-full px-4 py-3" placeholder="First Name" />
    <input className="w-full px-4 py-3" placeholder="Last Name" />
  </div>
  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded">Submit</button>
</form>
```

---

## Breakpoint Strategy

### Mobile First (320px - 640px)

```css
/* Base styles for mobile */
.card {
  padding: 1rem;
}

/* Add more space on larger screens */
@media (min-width: 640px) {
  .card {
    padding: 1.5rem;
  }
}
```

### Development Workflow

```
1. Design for mobile (320px)
2. Test at 640px (small phone)
3. Test at 768px (tablet)
4. Test at 1024px (large tablet)
5. Test at 1280px (desktop)
```

---

## Testing Checklist

### Mobile (< 640px)

- [ ] No horizontal scroll
- [ ] Buttons are tappable (44px minimum)
- [ ] Text readable without zoom
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Images scale

### Tablet (640px - 1024px)

- [ ] Grid shows 2-3 columns
- [ ] Sidebar visible/accessible
- [ ] Spacing is balanced
- [ ] Touch areas adequate

### Desktop (> 1024px)

- [ ] Full 4-5 column grids
- [ ] Sidebar always visible
- [ ] Hover effects work
- [ ] Optimal spacing

---

## Common Responsive Issues & Fixes

### Issue: Text too small on mobile

```jsx
/* ❌ Wrong */
<p className="text-2xl">Small on mobile!</p>

/* ✅ Correct */
<p className="text-lg sm:text-xl md:text-2xl">
  Scales properly
</p>
```

### Issue: Grid doesn't respond

```jsx
/* ❌ Wrong */
<div className="grid grid-cols-4 gap-4">

/* ✅ Correct */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
```

### Issue: Padding inconsistent

```jsx
/* ❌ Wrong */
<div className="p-8"> <!-- Too much on mobile! -->

/* ✅ Correct */
<div className="px-responsive py-responsive">
```

### Issue: Button not touch-friendly

```jsx
/* ❌ Wrong */
<button className="px-2 py-1"> <!-- Too small! -->

/* ✅ Correct */
<button className="px-4 py-3 min-h-[44px]">
```

---

## Dark Mode + Responsive

### Combine both

```jsx
<div className="bg-white dark:bg-gray-800 px-responsive">
  <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl">Works in light & dark mode</h1>
</div>
```

---

## Performance Tips

### Do ✅

- Use utility classes consistently
- Test on actual mobile devices
- Optimize images for mobile
- Use responsive-utilities.css patterns
- Lazy load heavy images

### Don't ❌

- Create custom breakpoints
- Hardcode pixel values
- Use `!important` for responsive
- Skip mobile testing
- Use too many media queries

---

## Key Files Location

| File                                             | Purpose                      |
| ------------------------------------------------ | ---------------------------- |
| `/frontend/src/styles/responsive-utilities.css`  | Frontend responsive classes  |
| `/dashboard/src/styles/responsive-utilities.css` | Dashboard responsive classes |
| `/frontend/src/index.css`                        | Imports responsive utilities |
| `/dashboard/src/index.css`                       | Imports responsive utilities |

---

## CSS Media Query Reference

### Mobile First Pattern

```css
/* Mobile (base) */
.container {
  padding: 1rem;
}

/* Tablets and up */
@media (min-width: 641px) {
  .container {
    padding: 1.5rem;
  }
}

/* Large screens and up */
@media (min-width: 1025px) {
  .container {
    padding: 2rem;
  }
}
```

### All Breakpoints

```css
@media (max-width: 480px) {
  /* Extra small */
}
@media (min-width: 481px) and (max-width: 640px) {
  /* Small */
}
@media (min-width: 641px) and (max-width: 768px) {
  /* Medium */
}
@media (min-width: 769px) and (max-width: 1024px) {
  /* Large */
}
@media (min-width: 1025px) {
  /* Desktop */
}
```

---

## Troubleshooting Commands

### Check responsive utilities are imported

```bash
# Check frontend
grep "responsive-utilities" /frontend/src/index.css

# Check dashboard
grep "responsive-utilities" /dashboard/src/index.css
```

### Test in browser DevTools

```
1. Press F12 (or Cmd+Option+I on Mac)
2. Click device toggle (Ctrl+Shift+M or Cmd+Shift+M)
3. Resize and test at different breakpoints
4. Check CSS in Elements tab
```

---

## Getting Help

### Check These First

1. **RESPONSIVE_DESIGN_COMPLETE.md** - Full documentation
2. **RESPONSIVE_IMPLEMENTATION_SUMMARY.md** - Quick overview
3. **Browser DevTools** - Inspect elements
4. **Tailwind Docs** - https://tailwindcss.com/docs/responsive-design

### Common Questions

**Q: Where are responsive utilities defined?**
A: `src/styles/responsive-utilities.css` in both frontend and dashboard

**Q: How do I add new responsive styles?**
A: Use the utility classes provided or add media queries to CSS modules

**Q: Why isn't my responsive design working?**
A: Check that responsive-utilities.css is imported in index.css

**Q: Which devices should I test?**
A: iPhone (320-414px), iPad (768px), Desktop (1280px+)

---

## Production Checklist

- [ ] Tested on iPhone (320-414px)
- [ ] Tested on iPad (768px)
- [ ] Tested on desktop (1280px+)
- [ ] Dark mode verified
- [ ] Touch targets are 44px+
- [ ] No horizontal scrolling
- [ ] Forms work on mobile
- [ ] Payment flow tested on phone
- [ ] Images load correctly
- [ ] Navigation accessible

---

**Remember**: Mobile users are your primary audience! Always test on real devices.

Last Updated: February 6, 2026
