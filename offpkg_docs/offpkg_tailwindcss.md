# tailwindcss

> Utility-first CSS framework  
> **Version:** 4.2.2 · **Runtime:** bun · [Docs](https://tailwindcss.com) · [Cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)

---

> ✏️ **This file is yours to edit** — it lives at `~/.offpkg/docs/bun/tailwindcss.md`  
> To regenerate from original: `offpkg docs reset tailwindcss --runtime bun`

---

## My Notes

<!-- Add your own notes, snippets, and team conventions here -->

---

## Install & Setup (v4)

```bash
bun add -d tailwindcss @tailwindcss/vite   # with Vite
# or
bun add -d tailwindcss @tailwindcss/postcss postcss
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
plugins: [tailwindcss()]
```

```css
/* globals.css — v4: one import replaces all three directives */
@import "tailwindcss";

/* Custom theme tokens — generates bg-primary, text-primary, etc. */
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --font-sans: 'Inter', sans-serif;
  --spacing-18: 4.5rem;
}
```

> **v4 key change:** No `tailwind.config.js` needed. All config lives in your CSS file via `@theme {}`.

---

## SPACING SCALE

Default scale: `0 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 52 56 60 64 72 80 96`  
Each unit = `0.25rem` (4px). So `p-4` = `1rem` = `16px`, `p-8` = `2rem` = `32px`.

**Quick mental model:**
```
p-1  =  4px      p-2  =  8px      p-4  =  16px
p-6  =  24px     p-8  =  32px     p-12 =  48px
p-16 =  64px     p-24 =  96px
```

---

## LAYOUT

### Display
```
block inline inline-block flex inline-flex grid inline-grid
table hidden contents
```

**Examples:**
```html
<!-- Card layout -->
<div class="flex gap-4">
  <div class="hidden md:block">Sidebar</div>  <!-- hide on mobile -->
  <main class="flex-1">Content</main>
</div>

<!-- Inline badge -->
<span class="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
  New
</span>
```

### Position
```
static relative absolute fixed sticky
inset-0  inset-x-0  inset-y-0
top-0  right-0  bottom-0  left-0
top-4  -top-2  top-1/2
z-0  z-10  z-20  z-30  z-40  z-50  z-auto  -z-10
```

**Examples:**
```html
<!-- Overlay modal -->
<div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
  <div class="relative bg-white rounded-xl p-6 w-full max-w-md">
    <button class="absolute top-4 right-4">✕</button>
    Modal content
  </div>
</div>

<!-- Sticky header -->
<header class="sticky top-0 z-40 bg-white border-b shadow-sm">...</header>

<!-- Badge on avatar -->
<div class="relative inline-block">
  <img class="w-10 h-10 rounded-full" src="..." />
  <span class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
</div>
```

### Overflow
```
overflow-hidden  overflow-auto  overflow-scroll  overflow-visible
overflow-x-hidden  overflow-y-auto
```

**Examples:**
```html
<!-- Horizontal scrollable tabs -->
<div class="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
  <button class="shrink-0 px-4 py-2">Tab 1</button>
  <button class="shrink-0 px-4 py-2">Tab 2</button>
</div>

<!-- Clip image in card -->
<div class="rounded-xl overflow-hidden">
  <img class="w-full h-48 object-cover" src="..." />
</div>
```

---

## FLEXBOX

```
flex          flex-row         flex-col
flex-wrap     flex-nowrap      flex-wrap-reverse
flex-1        flex-auto        flex-none        flex-initial

justify-start   justify-center   justify-end
justify-between  justify-around  justify-evenly  justify-stretch

items-start   items-center   items-end   items-baseline  items-stretch

self-start    self-center    self-end    self-auto

grow          grow-0
shrink        shrink-0

gap-4         gap-x-4         gap-y-4
```

**Examples:**
```html
<!-- Navbar -->
<nav class="flex items-center justify-between px-6 py-4">
  <span class="font-bold text-lg">Logo</span>
  <div class="flex items-center gap-4">
    <a href="#">About</a>
    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg">Sign in</button>
  </div>
</nav>

<!-- Card with footer pinned to bottom -->
<div class="flex flex-col h-full">
  <div class="flex-1 p-4">Content grows here</div>
  <div class="p-4 border-t">Footer stays at bottom</div>
</div>

<!-- Centered hero -->
<section class="flex flex-col items-center justify-center min-h-screen text-center">
  <h1 class="text-5xl font-bold">Hello</h1>
  <p class="mt-4 text-gray-500 max-w-md">Subtitle goes here</p>
</section>

<!-- Tags that wrap -->
<div class="flex flex-wrap gap-2">
  <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">React</span>
  <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">TypeScript</span>
</div>
```

---

## GRID

```
grid
grid-cols-1  grid-cols-2  grid-cols-3 ... grid-cols-12  grid-cols-none
grid-rows-1  grid-rows-2 ...

col-span-1   col-span-2   col-span-full
col-start-1  col-end-3
row-span-2   row-start-1

gap-4    gap-x-4    gap-y-4

auto-cols-auto   auto-cols-fr   auto-cols-min   auto-cols-max
auto-rows-auto   auto-rows-fr
```

**Examples:**
```html
<!-- Responsive card grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white rounded-xl shadow p-4">Card 1</div>
  <div class="bg-white rounded-xl shadow p-4">Card 2</div>
  <div class="bg-white rounded-xl shadow p-4">Card 3</div>
</div>

<!-- Dashboard layout with sidebar -->
<div class="grid grid-cols-[240px_1fr] min-h-screen">
  <aside class="bg-gray-900 text-white p-4">Sidebar</aside>
  <main class="p-6">Main content</main>
</div>

<!-- Feature grid with featured item spanning 2 cols -->
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2 bg-blue-50 rounded-xl p-6">Featured</div>
  <div class="bg-gray-50 rounded-xl p-6">Side</div>
  <div class="bg-gray-50 rounded-xl p-6">Item</div>
  <div class="bg-gray-50 rounded-xl p-6">Item</div>
  <div class="bg-gray-50 rounded-xl p-6">Item</div>
</div>
```

---

## SIZING

### Width
```
w-0  w-px  w-0.5  w-1 ... w-96
w-auto  w-full  w-screen  w-svw  w-dvw
w-1/2  w-1/3  w-2/3  w-1/4  w-3/4
w-fit  w-min  w-max
w-[350px]  w-[50%]  w-[calc(100%-2rem)]
```

### Height
```
h-0 h-px ... h-96
h-auto  h-full  h-screen  h-svh  h-dvh
h-1/2  h-1/3  h-fit  h-min  h-max
h-[500px]
```

> **Tip:** Use `h-svh` / `w-svw` instead of `h-screen` on mobile — avoids the browser toolbar overlap issue.

### Min / Max
```
min-w-0   min-w-full   min-w-min   min-w-max   min-w-fit
max-w-xs  max-w-sm  max-w-md  max-w-lg  max-w-xl
max-w-2xl  max-w-3xl  max-w-4xl  max-w-5xl  max-w-6xl  max-w-7xl
max-w-full  max-w-screen-xl  max-w-none  max-w-prose
min-h-0   min-h-full   min-h-screen
max-h-full  max-h-screen  max-h-96
```

**Examples:**
```html
<!-- Centered page container -->
<div class="max-w-5xl mx-auto px-4">Page content</div>

<!-- Readable prose width -->
<article class="max-w-prose mx-auto">Long form text...</article>

<!-- Avatar sizes -->
<img class="w-8 h-8 rounded-full" />   <!-- small: 32px -->
<img class="w-10 h-10 rounded-full" /> <!-- medium: 40px -->
<img class="w-12 h-12 rounded-full" /> <!-- large: 48px -->

<!-- Full-height sidebar that scrolls -->
<aside class="w-64 min-h-screen overflow-y-auto">...</aside>
```

---

## SPACING

### Padding
```
p-4           px-4 py-4
pt-4 pr-4 pb-4 pl-4
ps-4 pe-4     (logical: start/end)
p-[1.25rem]
```

### Margin
```
m-4  mx-4  my-4  mx-auto
mt-4  mr-4  mb-4  ml-4
-mt-2  -mx-4
m-[20px]
```

### Space Between (flex/grid children)
```
space-x-4   space-y-4
space-x-reverse   space-y-reverse
```

> **`space-x` vs `gap`:** Prefer `gap` on flex/grid containers. `space-x` adds margin to children and can break with wrapping. `gap` is cleaner and works correctly with `flex-wrap`.

**Examples:**
```html
<!-- Section spacing -->
<section class="py-16 px-4">
  <h2 class="text-3xl font-bold mb-2">Title</h2>
  <p class="text-gray-500 mb-8">Subtitle</p>
  <div class="grid grid-cols-3 gap-6">...</div>
</section>

<!-- Button with icon -->
<button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
  <svg class="w-4 h-4">...</svg>
  <span>Download</span>
</button>

<!-- Negative margin pull trick -->
<div class="mt-8 -mx-4 px-4 bg-gray-50 py-6">
  Full-bleed section in a constrained container
</div>
```

---

## TYPOGRAPHY

### Font Size
```
text-xs    (0.75rem / 12px)
text-sm    (0.875rem / 14px)
text-base  (1rem / 16px)
text-lg    (1.125rem / 18px)
text-xl    (1.25rem / 20px)
text-2xl   (1.5rem / 24px)
text-3xl   (1.875rem / 30px)
text-4xl   (2.25rem / 36px)
text-5xl   (3rem / 48px)
text-6xl   (3.75rem / 60px)
text-7xl   (4.5rem / 72px)
text-8xl   (6rem / 96px)
text-9xl   (8rem / 128px)
text-[1.375rem]
```

### Font Weight
```
font-thin (100)    font-extralight (200)  font-light (300)
font-normal (400)  font-medium (500)      font-semibold (600)
font-bold (700)    font-extrabold (800)   font-black (900)
```

### Font Family
```
font-sans   font-serif   font-mono
```

### Text Alignment
```
text-left   text-center   text-right   text-justify   text-start   text-end
```

### Text Transform
```
uppercase   lowercase   capitalize   normal-case
```

### Text Decoration
```
underline   overline   line-through   no-underline
decoration-solid   decoration-dashed   decoration-dotted   decoration-double
decoration-blue-500   decoration-2
```

### Line Height
```
leading-none (1)    leading-tight (1.25)   leading-snug (1.375)
leading-normal (1.5) leading-relaxed (1.625) leading-loose (2)
leading-[1.8]
```

### Letter Spacing
```
tracking-tighter  tracking-tight  tracking-normal
tracking-wide     tracking-wider  tracking-widest
tracking-[0.05em]
```

### Truncate / Clamp
```
truncate         (single line ellipsis)
line-clamp-2     (clamp to 2 lines)
line-clamp-3
overflow-hidden
```

### Whitespace
```
whitespace-normal   whitespace-nowrap   whitespace-pre
whitespace-pre-wrap  whitespace-pre-line  whitespace-break-spaces
```

**Examples:**
```html
<!-- Page heading -->
<h1 class="text-4xl md:text-6xl font-black tracking-tight leading-tight">
  Build faster.
</h1>

<!-- Subheading with muted color -->
<p class="text-lg text-gray-500 leading-relaxed max-w-xl">
  A utility-first CSS framework packed with classes.
</p>

<!-- Label / caption -->
<span class="text-xs font-medium uppercase tracking-widest text-gray-400">
  Category
</span>

<!-- Card title that truncates -->
<h3 class="text-base font-semibold truncate">
  This is a very long title that will be cut off
</h3>

<!-- Multi-line clamp for card descriptions -->
<p class="text-sm text-gray-600 line-clamp-3">
  Long description text that will be clamped after 3 lines...
</p>

<!-- Monospace code block -->
<code class="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
  bun run dev
</code>

<!-- Price display -->
<div class="flex items-baseline gap-1">
  <span class="text-3xl font-bold">$29</span>
  <span class="text-gray-400 line-through text-sm">$49</span>
</div>
```

---

## COLORS

### Text
```
text-black   text-white   text-transparent   text-current
text-slate-500   text-gray-700   text-zinc-900
text-red-500     text-orange-500  text-amber-500  text-yellow-500
text-lime-500    text-green-500   text-emerald-500 text-teal-500
text-cyan-500    text-sky-500     text-blue-500   text-indigo-500
text-violet-500  text-purple-500  text-fuchsia-500 text-pink-500 text-rose-500
text-blue-500/75  (with 75% opacity)
```

Shades: `50 100 200 300 400 500 600 700 800 900 950`

### Background
```
bg-white   bg-black   bg-transparent
bg-blue-500   bg-blue-500/50    (50% opacity)
bg-gradient-to-r  from-blue-500  via-purple-500  to-pink-500
bg-gradient-to-br  from-slate-900  to-slate-700
```

### Background Size / Position
```
bg-auto   bg-cover   bg-contain
bg-center bg-top bg-bottom bg-left bg-right
bg-no-repeat  bg-repeat  bg-repeat-x  bg-repeat-y
```

### Border Color
```
border-gray-200   border-blue-500   border-transparent
```

**Examples:**
```html
<!-- Status badges -->
<span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Active</span>
<span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">Pending</span>
<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">Error</span>
<span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">Draft</span>

<!-- Gradient hero background -->
<section class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-24">
  <h1 class="text-5xl font-bold">Hello</h1>
</section>

<!-- Gradient text -->
<h1 class="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent text-5xl font-black">
  Gradient Text
</h1>

<!-- Semi-transparent overlay -->
<div class="absolute inset-0 bg-black/60 rounded-xl"></div>

<!-- Glass card -->
<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
  Glass effect
</div>

<!-- Hero image with overlay text -->
<div class="relative h-64 rounded-xl overflow-hidden">
  <img class="w-full h-full object-cover" src="..." />
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
  <p class="absolute bottom-4 left-4 text-white font-semibold">Caption text</p>
</div>
```

---

## BORDERS

```
border        (1px solid)
border-2      border-4      border-8
border-0      border-t-2    border-b    border-l-4    border-r

border-solid  border-dashed  border-dotted  border-double  border-none

border-gray-300   border-red-500

rounded-none   rounded-sm   rounded   rounded-md   rounded-lg
rounded-xl     rounded-2xl  rounded-3xl   rounded-full

rounded-t-lg   rounded-b-xl   rounded-l-md   rounded-r-full
rounded-tl-lg  rounded-tr-xl  rounded-bl-md  rounded-br-full
```

**Examples:**
```html
<!-- Card with subtle border -->
<div class="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">Card</div>

<!-- Input field -->
<input class="w-full border border-gray-300 rounded-lg px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

<!-- Input with error state -->
<input class="border-2 border-red-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />

<!-- Divider line -->
<hr class="border-t border-gray-100 my-6" />

<!-- Left accent border -->
<div class="border-l-4 border-blue-500 pl-4 text-gray-700">
  Info message with accent
</div>

<!-- Avatar / circle -->
<img class="w-12 h-12 rounded-full border-2 border-white ring-2 ring-blue-500" />

<!-- Pill / tag -->
<span class="border border-gray-300 rounded-full px-3 py-1 text-sm">Tag</span>

<!-- Dashed upload zone -->
<div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center
            hover:border-blue-400 transition-colors cursor-pointer">
  Drop files here
</div>
```

---

## SHADOWS

```
shadow-xs    shadow-sm    shadow    shadow-md
shadow-lg    shadow-xl    shadow-2xl   shadow-inner   shadow-none
shadow-blue-500/50    (colored shadow)
```

### Ring (outline ring)
```
ring         (3px)
ring-1  ring-2  ring-4  ring-8
ring-blue-500    ring-offset-2   ring-offset-white
ring-inset
```

**Examples:**
```html
<!-- Elevated card -->
<div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-5">
  Lifts on hover
</div>

<!-- Floating action button -->
<button class="bg-blue-600 text-white rounded-full p-4 shadow-lg shadow-blue-500/40
               hover:shadow-xl hover:shadow-blue-500/50 transition-all">
  <svg class="w-6 h-6">...</svg>
</button>

<!-- Focused input ring -->
<input class="border border-gray-300 rounded-lg px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />

<!-- Inset shadow (like pressed/sunken) -->
<div class="bg-gray-100 rounded-lg shadow-inner p-4">Inset input</div>
```

---

## EFFECTS

### Opacity
```
opacity-0   opacity-5   opacity-10   opacity-20   opacity-25
opacity-50  opacity-75  opacity-90   opacity-95   opacity-100
opacity-[0.35]
```

### Background Opacity (v4: use / modifier)
```
bg-black/50     text-white/80     border-gray-500/30
```

### Filter
```
blur-none  blur-sm  blur  blur-md  blur-lg  blur-xl  blur-2xl  blur-3xl
blur-[4px]
brightness-0  brightness-50  brightness-75  brightness-100  brightness-125  brightness-150
contrast-0   contrast-50   contrast-100   contrast-150   contrast-200
grayscale   grayscale-0
invert   invert-0
sepia    sepia-0
drop-shadow-md   drop-shadow-lg
backdrop-blur-sm  backdrop-blur-md  backdrop-blur-xl
backdrop-brightness-50  backdrop-contrast-150
```

**Examples:**
```html
<!-- Disabled state -->
<button class="opacity-50 cursor-not-allowed" disabled>Disabled</button>

<!-- Image hover: reveal on hover -->
<div class="group relative overflow-hidden rounded-xl">
  <img class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
    <span class="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
  </div>
</div>

<!-- Skeleton loader -->
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

<!-- Glassmorphism card -->
<div class="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6">
  Glass card
</div>

<!-- Blurred background behind modal -->
<div class="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"></div>

<!-- Grayscale image that colors on hover -->
<img class="grayscale hover:grayscale-0 transition-all duration-300" />
```

---

## TRANSFORMS

```
scale-0   scale-50   scale-75   scale-90   scale-95   scale-100   scale-105   scale-110   scale-125   scale-150
scale-x-0  scale-y-150
-scale-x-100   (flip horizontal)

rotate-0   rotate-1   rotate-2   rotate-3   rotate-6
rotate-12  rotate-45  rotate-90  rotate-180
-rotate-6  rotate-[17deg]

translate-x-4   translate-y-4  -translate-x-1/2   translate-y-1/2
translate-x-full  -translate-y-full

skew-x-2   skew-y-3

origin-center  origin-top  origin-top-right  origin-right
origin-bottom  origin-bottom-left  origin-left  origin-top-left
```

**Examples:**
```html
<!-- Button press effect -->
<button class="active:scale-95 transition-transform">Click me</button>

<!-- Hover lift -->
<div class="hover:-translate-y-1 transition-transform">Card</div>

<!-- Centered absolutely with translate trick -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  Perfectly centered
</div>

<!-- Rotate icon on state change -->
<svg class="transition-transform duration-200 rotate-0 group-open:rotate-180">
  <!-- chevron icon -->
</svg>

<!-- Flip horizontally (mirror) -->
<svg class="-scale-x-100">...</svg>

<!-- Card tilt on hover (with group) -->
<div class="group cursor-pointer">
  <div class="transition-transform duration-300 group-hover:rotate-1 group-hover:scale-105">
    Card content
  </div>
</div>
```

---

## TRANSITIONS & ANIMATION

```
transition-none   transition-all   transition   transition-colors
transition-opacity  transition-shadow  transition-transform

duration-75   duration-100   duration-150   duration-200
duration-300  duration-500   duration-700   duration-1000

ease-linear   ease-in   ease-out   ease-in-out

delay-0   delay-75   delay-100   delay-150   delay-300

animate-none
animate-spin      (rotate 360° loop)
animate-ping      (scale + fade loop — notifications)
animate-pulse     (opacity pulse — skeleton)
animate-bounce    (bounce loop)
```

> **Rule of thumb:** Use `duration-150` to `duration-200` for interactions (hover, click). Use `duration-300` to `duration-500` for entrance/exit animations. Faster feels snappier, slower feels heavier.

**Examples:**
```html
<!-- Smooth color + shadow on hover -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg
               transition-all duration-200
               hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30
               active:scale-95">
  Button
</button>

<!-- Notification dot (ping) -->
<span class="relative flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
</span>

<!-- Loading spinner -->
<svg class="animate-spin h-5 w-5 text-blue-600">
  <!-- spinner SVG path -->
</svg>

<!-- Skeleton loading card -->
<div class="animate-pulse rounded-xl bg-gray-200 h-40 w-full"></div>

<!-- Staggered fade-in (use with JS class toggle) -->
<div class="opacity-0 translate-y-4 transition-all duration-500 delay-100 [&.visible]:opacity-100 [&.visible]:translate-y-0">
  Item 1
</div>

<!-- Transition only specific properties -->
<div class="transition-colors duration-200 bg-gray-100 hover:bg-blue-50">
  Only color transitions — no layout jitter
</div>
```

---

## INTERACTIVITY

```
cursor-auto   cursor-default   cursor-pointer   cursor-wait
cursor-text   cursor-move      cursor-not-allowed   cursor-grab  cursor-grabbing

select-none   select-text   select-all   select-auto

pointer-events-none   pointer-events-auto

resize   resize-none   resize-x   resize-y

scroll-auto   scroll-smooth
scroll-m-4   scroll-p-4    (scroll margin/padding)
snap-start   snap-center   snap-end
snap-x   snap-y   snap-mandatory   snap-proximity
```

**Examples:**
```html
<!-- Drag handle -->
<div class="cursor-grab active:cursor-grabbing p-2 text-gray-400">⋮⋮</div>

<!-- Non-interactive overlay (clicks pass through) -->
<div class="pointer-events-none absolute inset-0 border-2 border-blue-500 rounded-xl"></div>

<!-- Prevent text selection on double-click (e.g. buttons) -->
<button class="select-none px-4 py-2">Click me</button>

<!-- Smooth scroll to section -->
<html class="scroll-smooth">
<!-- then: -->
<a href="#section">Go to section</a>
<section id="section" class="scroll-mt-20">  <!-- offset for sticky header -->

<!-- Horizontal snap carousel -->
<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4">
  <div class="snap-center shrink-0 w-80 bg-white rounded-xl p-4 shadow">Slide 1</div>
  <div class="snap-center shrink-0 w-80 bg-white rounded-xl p-4 shadow">Slide 2</div>
  <div class="snap-center shrink-0 w-80 bg-white rounded-xl p-4 shadow">Slide 3</div>
</div>
```

---

## RESPONSIVE PREFIXES

```
sm:   (640px+)
md:   (768px+)
lg:   (1024px+)
xl:   (1280px+)
2xl:  (1536px+)
```

> **Mobile-first:** Write the base style for mobile, then add `sm:` / `md:` / `lg:` overrides for larger screens.

**Examples:**
```html
<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

<!-- Responsive text -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Responsive heading</h1>

<!-- Show/hide per breakpoint -->
<div class="hidden md:block">Only on desktop</div>
<div class="block md:hidden">Only on mobile</div>

<!-- Stack on mobile, row on desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <aside class="w-full md:w-64">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>

<!-- Responsive padding -->
<div class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">Section</div>

<!-- Font size ramp -->
<p class="text-sm md:text-base lg:text-lg leading-relaxed">Body text</p>
```

---

## STATE VARIANTS

```
hover:bg-blue-600       focus:ring-2         active:scale-95
focus-within:border-blue-500
focus-visible:outline-2
disabled:opacity-50      disabled:cursor-not-allowed
checked:bg-blue-500
placeholder:text-gray-400
first:pt-0               last:pb-0           odd:bg-gray-50    even:bg-white
group-hover:text-blue-500   (parent has class="group")
peer-checked:text-blue-500  (sibling has class="peer")
```

**Examples:**
```html
<!-- Full interactive button -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium
               hover:bg-blue-700
               focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
               active:scale-95
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-150">
  Submit
</button>

<!-- Table with alternating rows -->
<tr class="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors">

<!-- List without extra padding on first/last items -->
<ul>
  <li class="py-3 first:pt-0 last:pb-0 border-b last:border-0">Item</li>
</ul>

<!-- Group hover — child reacts to parent hover -->
<div class="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
  <img class="w-10 h-10 rounded-full" />
  <div>
    <p class="font-medium group-hover:text-blue-600 transition-colors">Username</p>
    <p class="text-sm text-gray-500">@handle</p>
  </div>
  <svg class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
    <!-- chevron -->
  </svg>
</div>

<!-- Peer — custom checkbox label -->
<label class="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" class="peer sr-only" />
  <div class="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-blue-600 transition-colors"></div>
  Toggle
</label>

<!-- Focus within — highlight form field wrapper -->
<div class="border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all">
  <input class="outline-none px-3 py-2 w-full rounded-lg" placeholder="Search..." />
</div>

<!-- Placeholder styling -->
<input class="placeholder:text-gray-400 placeholder:italic px-3 py-2 border rounded-lg"
       placeholder="Enter your email" />
```

---

## DARK MODE

```css
@import "tailwindcss";
```

```html
<!-- Toggle with class on <html> -->
<html class="dark">
```

**Examples:**
```html
<!-- Page background -->
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

<!-- Card -->
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none">
  <h2 class="text-gray-900 dark:text-white font-semibold">Card title</h2>
  <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Description</p>
</div>

<!-- Input -->
<input class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              border border-gray-300 dark:border-gray-600
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />

<!-- Button -->
<button class="bg-blue-600 dark:bg-blue-500 text-white
               hover:bg-blue-700 dark:hover:bg-blue-400
               px-4 py-2 rounded-lg">
  Submit
</button>

<!-- Navigation sidebar -->
<nav class="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 p-4">
  <a class="hover:text-white dark:hover:text-white hover:bg-gray-800 dark:hover:bg-gray-800
            block px-3 py-2 rounded-lg transition-colors">
    Dashboard
  </a>
</nav>

<!-- Code block -->
<pre class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg p-4 text-sm font-mono overflow-x-auto">
  code here
</pre>
```

---

## ARBITRARY VALUES

```html
<!-- Sizing -->
w-[350px]           h-[calc(100vh-4rem)]       w-[calc(100%-2rem)]

<!-- Spacing -->
p-[1.25rem]        mt-[17px]                   gap-[1.375rem]

<!-- Typography -->
text-[1.375rem]    leading-[1.8]               tracking-[0.05em]

<!-- Colors -->
bg-[#1a1a2e]       text-[rgb(100,200,50)]      border-[#e5e7eb]

<!-- Position -->
top-[117px]        left-[calc(50%-11rem)]

<!-- Borders -->
border-[3px]       rounded-[10px]

<!-- Other -->
z-[100]            opacity-[0.35]              duration-[400ms]
bg-[url('/img/hero.png')]
grid-cols-[1fr_2fr_1fr]
shadow-[0_4px_24px_rgba(0,0,0,0.1)]
```

> **When to use arbitrary values:** For one-off pixel-precise values that don't fit the design system. If you're using the same arbitrary value in multiple places, add it to `@theme` instead.

---

## COMPONENT PATTERNS

### Button variants

```html
<!-- Primary -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg
               active:scale-95 transition-all duration-150 focus-visible:ring-2
               focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50">
  Primary
</button>

<!-- Secondary / outline -->
<button class="border border-gray-300 hover:border-gray-400 text-gray-700 bg-white
               hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition-all duration-150">
  Secondary
</button>

<!-- Ghost -->
<button class="text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors">
  Ghost
</button>

<!-- Destructive -->
<button class="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
  Delete
</button>
```

### Input field

```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    placeholder="you@example.com"
    class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm
           placeholder:text-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
           disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
           transition-shadow"
  />
  <p class="text-xs text-red-500">Error message here</p>
</div>
```

### Card

```html
<div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden
            hover:shadow-md transition-shadow duration-200">
  <img class="w-full h-48 object-cover" src="..." />
  <div class="p-5">
    <span class="text-xs font-medium uppercase tracking-wider text-blue-600">Category</span>
    <h3 class="mt-1 text-lg font-semibold text-gray-900 line-clamp-2">Card title here</h3>
    <p class="mt-2 text-sm text-gray-500 line-clamp-3">Description text...</p>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img class="w-6 h-6 rounded-full" src="..." />
        <span class="text-sm text-gray-600">Author Name</span>
      </div>
      <span class="text-xs text-gray-400">Mar 23</span>
    </div>
  </div>
</div>
```

### Alert / Toast

```html
<!-- Info -->
<div class="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
  <svg class="w-5 h-5 text-blue-500 shrink-0 mt-0.5">...</svg>
  <div>
    <p class="text-sm font-medium text-blue-800">Note</p>
    <p class="text-sm text-blue-700 mt-0.5">This is an informational message.</p>
  </div>
</div>

<!-- Error -->
<div class="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
  <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5">...</svg>
  <p class="text-sm text-red-700">Something went wrong. Please try again.</p>
</div>
```

### Avatar group

```html
<div class="flex -space-x-2">
  <img class="w-8 h-8 rounded-full border-2 border-white" src="..." />
  <img class="w-8 h-8 rounded-full border-2 border-white" src="..." />
  <img class="w-8 h-8 rounded-full border-2 border-white" src="..." />
  <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
    +4
  </div>
</div>
```

### Empty state

```html
<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
    <svg class="w-8 h-8 text-gray-400">...</svg>
  </div>
  <h3 class="text-base font-semibold text-gray-900">No results found</h3>
  <p class="mt-1 text-sm text-gray-500 max-w-xs">Try adjusting your search or filter.</p>
  <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
    Clear filters
  </button>
</div>
```

---

## v3 → v4 CLASS CHANGES

| v3 | v4 |
|----|----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `shadow-md` | `shadow-md` ✓ |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `ring` | `ring-3` |
| `outline-none` | `outline-hidden` |
| `flex-shrink` | `shrink` |
| `flex-grow` | `grow` |
| `bg-opacity-50` | `bg-black/50` |
| `text-opacity-75` | `text-white/75` |
| `border-opacity-50` | `border-gray-500/50` |
| `overflow-ellipsis` | `text-ellipsis` |
| `decoration-slice` | `box-decoration-slice` |

Upgrade: `bunx @tailwindcss/upgrade`

---

## Resources

- [Docs](https://tailwindcss.com/docs)
- [v4 Overview](https://tailwindcss.com/blog/tailwindcss-v4)
- [Interactive Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind UI](https://tailwindui.com) (paid components)
- [Heroicons](https://heroicons.com) (free SVG icons made for Tailwind)
- [shadcn/ui](https://ui.shadcn.com) (copy-paste component library)
EOF