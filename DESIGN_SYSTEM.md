# 🛡️ Assura Design System

This document outlines the foundation of the visual identity and user interface guidelines for **Assura**, a modern, enterprise-grade Insurance Management Platform. These guidelines ensure the application communicates **Trust, Security, Professionalism, Simplicity, and Premium Quality** while remaining clean, spacious, and free of visual noise.

---

## 👁️ Brand Philosophy
Assura's interface acts as a silent assurance of security. The platform's visual design avoids gimmicks, heavy glow effect overlays, and neon gradients in favor of high-legibility layouts, structural elegance, and clear interaction hierarchies. Every component's purpose should be instantly recognizable, fostering confidence for customers, agents, and administrators alike.

---

## 🎨 Color Palette
Assura utilizes a curated light-theme palette to enforce a modern, high-contrast, yet soft visual space. **Note:** Dark mode is *not* supported or permitted in this specification.

| Role | Color Name | Hex Code | Utility Class (Tailwind) | Application / Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | Violet | `#7C3AED` | `text-primary` / `bg-primary` | Primary brand touchpoints, active states, key interactive buttons. |
| **Secondary** | Royal Blue | `#3B82F6` | `text-secondary` / `bg-secondary` | Secondary brand accents, highlights, informational states. |
| **Accent** | Cyan | `#22D3EE` | `text-accent` / `bg-accent` | Progressive indicators, subtle tag links, and focused status metrics. |
| **Background** | White | `#FFFFFF` | `bg-bg-base` | Main application background. Spacious and flat. |
| **Surface** | Slate Ice | `#F8FAFC` | `bg-surface` | Card backgrounds, sidebar/navigation backgrounds, table headers. |
| **Border** | Slate Mist | `#E2E8F0` | `border-border-custom` | Input boundaries, divider lines, card strokes. |
| **Primary Text** | Slate Dark | `#0F172A` | `text-text-primary` | Maximum contrast headings, body content, labels. |
| **Secondary Text**| Slate Medium | `#475569` | `text-text-secondary` | Supporting text, captions, placeholders, inactive states. |
| **Success** | Emerald | `#22C55E` | `text-success` / `bg-success` | Paid premiums, approved claims, active policies. |
| **Warning** | Amber | `#F59E0B` | `text-warning` / `bg-warning` | Pending approvals, late premiums, warnings. |
| **Error** | Rose | `#EF4444` | `text-error` / `bg-error` | Rejected claims, failed payments, destructive operations. |

---

## 🔠 Typography
High-legibility typography forms the core of Assura's editorial-style interface. 

- **Primary Font**: `Plus Jakarta Sans` (for all interface copy, headings, labels, and numbers)
- **Code Font**: `JetBrains Mono` (for data values, transaction IDs, tables, and system logs)

### Font Scale & Hierarchy
*   **Hero Headers**: `text-4xl` (36px) | Bold (`font-bold` / `font-extrabold`) | Leading 1.2
*   **Section Headers**: `text-2xl` (24px) | Semi-Bold (`font-semibold`) | Leading 1.3
*   **Subheadings / Card Titles**: `text-lg` (18px) | Medium (`font-medium` / `font-semibold`) | Leading 1.4
*   **Body Copy (Default)**: `text-base` (16px) | Regular (`font-normal`) | Leading 1.6
*   **Supporting / UI Labels**: `text-sm` (14px) | Medium (`font-medium`) | Leading 1.4
*   **Captions / Mini Data**: `text-xs` (12px) | Regular/Medium | Leading 1.4

---

## 📏 Spacing Rules
Maintain a strict, spacious grid using standard Tailwind spacing scale values to prevent cognitive load.

- **Component Padding (Large)**: `p-8` (32px) / `gap-8` — Used for main layout views and large card sections.
- **Component Padding (Medium)**: `p-6` (24px) / `gap-6` — Standard card interiors, tables, and dashboards.
- **Component Padding (Small)**: `p-4` (16px) / `gap-4` — Dropdowns, list items, navigation items.
- **Inline Elements / Labels**: `p-2` (8px) or `p-3` (12px) / `gap-2` or `gap-3`.
- **Strict rule**: Do *not* define arbitrary values like `p-[21px]`. Stick to the Tailwind spacing intervals.

---

## 📐 Border Radius
To enforce a approachable yet professional tone, Assura utilizes a curved geometric aesthetic.

- **Buttons**: `rounded-xl` (12px) — Gives interactive actions a defined, click-friendly appearance.
- **Inputs**: `rounded-xl` (12px) — Standardizes search, text fields, select lists.
- **Cards**: `rounded-2xl` (16px) — Smooth structural containers holding core dashboard features.
- **Badges / Status Indicators**: `rounded-full` (9999px) — Pill containers displaying text-based statuses.

---

## 👤 Shadows
Assura relies on strict flat structural layouts. Avoid heavy decorative drop-shadows, glow outlines, or dimensional textures.

- **Interactive Elements**: Use `shadow-sm` or `shadow-md` at most for floating popovers, menus, and cards.
- **Standard Cards**: Layer using solid borders (`border border-border-custom`) on a flat `bg-surface` background rather than relying on shadow offsets.
- **Forbidden Styles**:
  - Glassmorphic backdrops (no opacity card layering except basic hover states)
  - Neumorphism (no inner/outer simulated bevel offsets)
  - Heavy glow overlays (no glowing color drop-shadows)

---

## 🎨 Icons
- **Library**: `lucide-react`
- **Style**: **Outline icons only** (avoid solid or colored filled shapes unless state-specific).
- **Line Stroke**: `stroke-width={2}` (keep outlines crisp and thin).
- **Sizing Guide**:
  - Main nav icons: `h-5 w-5` (20px)
  - Inline input/button icons: `h-4 w-4` (16px)
  - Empty state / large visual icons: `h-8 w-8` (32px) or `h-12 w-12` (48px)

---

## 🎬 Animation Guidelines
Transitions must feel instantaneous and highly responsive.
- **Duration**: `duration-150` (150ms) to `duration-200` (200ms).
- **Timing Function**: `ease-in-out` or `ease-out`.
- **Restrictions**: 
  - No bouncy easing curves (`ease-bounce` is strictly forbidden).
  - No flashy scales or rotational animations.
  - Hover states should subtly change backgrounds or border-colors (e.g. `hover:bg-slate-100` or `hover:border-primary/50`).

---

## 🎨 Theme Rules
- **Light Theme ONLY**: Keep the background bright (`#FFFFFF`) and surfaces soft and crisp.
- **No Dark Mode Support**: The application does not contain dark-mode selectors. Dark styling classes (`dark:...`) must not be used in markup.

---

## 🏛 UI Principles
1. **Content is King**: Rely on clean typography, consistent spacing, and colored badges rather than decorative graphics.
2. **Clear Contrast**: Maintain a color contrast ratio exceeding WCAG AA standards (especially for text-secondary on bg-surface).
3. **Empty States**: Present clean, helpful illustrations and contextual action buttons when lists or tables are unpopulated.

---

## ⚡ Interaction States

To ensure user actions are tactile and responsive, common UI elements must define explicit interaction styles. Below are the design specifications and Tailwind utility classes for each state:

### 1. Primary Button
- **Default**: Solid brand primary color.
  - Class: `bg-primary text-white font-semibold rounded-xl px-4 py-2.5 transition-all duration-150`
- **Hover**: Subtle shift to a darker violet.
  - Class: `hover:bg-primary/95`
- **Active**: Slight scale down indicating a press action.
  - Class: `active:scale-[0.98]`
- **Disabled**: Lowered opacity, standard cursor block.
  - Class: `disabled:opacity-50 disabled:cursor-not-allowed`

### 2. Secondary Button
- **Default**: Slate-white background with a clean border stroke.
  - Class: `bg-bg-base border border-border-custom text-text-primary font-medium rounded-xl px-4 py-2.5 transition-all duration-150`
- **Hover**: Subtle slate tint.
  - Class: `hover:bg-surface hover:border-slate-300`
- **Active**: Press scale down.
  - Class: `active:scale-[0.98]`
- **Disabled**: Lowered opacity, cursor block.
  - Class: `disabled:opacity-50 disabled:cursor-not-allowed`

### 3. Danger Button
- **Default**: High-visibility warning red.
  - Class: `bg-error text-white font-semibold rounded-xl px-4 py-2.5 transition-all duration-150`
- **Hover**: Darker red tint.
  - Class: `hover:bg-error/95`
- **Active**: Press scale down.
  - Class: `active:scale-[0.98]`
- **Disabled**: Lowered opacity, cursor block.
  - Class: `disabled:opacity-50 disabled:cursor-not-allowed`

### 4. Inputs
- **Default**: Crisp border, slate background placeholder.
  - Class: `w-full bg-bg-base border border-border-custom text-text-primary rounded-xl px-4 py-2.5 text-sm placeholder-text-secondary transition-all duration-150 outline-none`
- **Hover**: Subtle border darkener.
  - Class: `hover:border-slate-300`
- **Focus**: Distinct primary ring for keyboard focus accessibility.
  - Class: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none`
- **Disabled**: Light gray fill, cursor block.
  - Class: `disabled:bg-surface disabled:text-text-secondary disabled:cursor-not-allowed`
- **Error**: High contrast red border ring.
  - Class: `border-error focus-visible:ring-error`

### 5. Cards
- **Default**: Border stroke without layout depth.
  - Class: `bg-surface border border-border-custom rounded-2xl p-6 transition-all duration-150`
- **Hover**: Subtle border contrast increase.
  - Class: `hover:border-slate-300`

### 6. Navigation Items
- **Default**: Neutral text.
  - Class: `text-text-secondary rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150`
- **Hover**: Subtle background tint.
  - Class: `hover:bg-surface hover:text-text-primary`
- **Active**: Muted background tint in primary color.
  - Class: `bg-primary/10 text-primary`

---

## ♿ Accessibility Guidelines

Assura must comply with accessibility principles to ensure equal access to all users, adhering to **WCAG AA** standards:

1. **WCAG AA Contrast**: Ensure all text elements meet contrast requirements. Body text (`text-text-primary`) on light backgrounds must exceed a contrast ratio of 4.5:1. Active state colors must not be used alone to communicate status changes (combine with icons or text labels).
2. **Visible Focus Indicators**: Interactive elements must exhibit clear focus rings. Avoid suppressing the browser focus ring without providing a custom styling equivalent.
   - **Standard Focus Style**: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none`
3. **Keyboard Navigation**:
   - Every interactive element (buttons, links, inputs) must be focusable using `Tab` and triggerable using `Enter` or `Spacebar`.
   - Modals and dropdowns must trap focus when active and close cleanly via the `Escape` key.
4. **Semantic HTML**: Use native HTML5 landmarks (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`) instead of generic nested `<div>`s to guide screen readers.
5. **Accessible Form Labels**: Always associate `<label>` elements explicitly with inputs via `htmlFor`. Utilize `aria-describedby` to link validation errors or helper captions with their respective input fields.
6. **ARIA Attributes**:
   - `aria-expanded` must be toggled on dropdown buttons.
   - `aria-hidden="true"` must be placed on purely decorative layout shapes and icons to prevent screen reader noise.
   - `aria-current="page"` must be applied to active navigation items.
7. **Reduced Motion**: Respect system motion preferences by overriding transition rates.
   - Use `motion-reduce:transition-none` or `motion-reduce:animate-none` for layouts containing subtle sliding views.

---

## 📱 Responsive Design Rules

Assura layout pages scale from mobile up to desktop viewports, using a **mobile-first** development approach.

### 1. Breakpoints
Utilize Tailwind's standard breakpoint width constraints:
- **Mobile (`sm`)**: `640px` (smaller screens and standard mobile width)
- **Tablet (`md`)**: `768px` (small tablets and wide landscape phones)
- **Small Desktop (`lg`)**: `1024px` (laptops and standard desktop views)
- **Large Desktop (`xl`)**: `1280px` (large screens and high-resolution monitors)
- **Widescreen (`2xl`)**: `1536px` (extra-large display screens)

### 2. Layout Width Controls
- **Maximum Content Width**: All primary dashboard views must be bounded inside a container to prevent over-stretching.
  - Class: `max-w-7xl` (`1280px`) or `max-w-[1440px]`
  - Centering: `mx-auto`
- **Responsive Layout Behaviors**:
  - **Mobile**: Single-column vertical scrolling stack. Sidebar panel menus are hidden behind a sliding drawer menu or static top bar header.
  - **Tablet**: Multi-column grids (up to 2 columns for card grids). The sidebar is collapsed into a narrow toolbar.
  - **Desktop**: Fixed left navigation sidebar, top sticky navbar, and full content workspace container.

### 3. Responsive Spacing
Page margins and internal component padding must scale dynamically using responsive Tailwind modifiers:
- **Mobile**: Grid gap `gap-4`, page padding `p-4`
- **Tablet**: Grid gap `gap-6`, page padding `p-6`
- **Desktop**: Grid gap `gap-6` or `gap-8`, page padding `p-8`

---

## 📐 Layout Standards

Consistent structural alignment ensures page layouts are predictable and readable.

| Layout Property | Recommended Range / Value | Tailwind Utility Class | Usage |
| :--- | :--- | :--- | :--- |
| **Dashboard Page Padding**| `16px` to `32px` | `p-4 sm:p-6 lg:p-8` | Outer workspace content spacing. |
| **Section Spacing** | `24px` to `32px` | `space-y-6 lg:space-y-8` | Vertical spacing between block sections. |
| **Card Grid Spacing** | `24px` | `gap-6` | Grid gap between dashboard statistic cards. |
| **Sidebar Width** | `240px` to `280px` | `w-60` to `w-72` | Left navigation width. |
| **Navbar Height** | `64px` | `h-16` | Top global sticky header height. |
| **Max Content Container** | `1280px` | `max-w-7xl` | Centralized page content box constraint. |

---

## 🔝 Z-Index Policy

To prevent layer overlaps, Assura enforces a strict z-index stacking hierarchy:

| Stacking Layer | Z-Index Value | Tailwind Utility | Description / Application |
| :--- | :--- | :--- | :--- |
| **Base Content** | `0` | `z-0` | Normal inline text, cards, content blocks. |
| **Sticky Header** | `10` | `z-10` | Top global navigation bar (sticky). |
| **Sidebar** | `20` | `z-20` | Fixed left navigation panel. |
| **Dropdown** | `30` | `z-30` | User account menu, filter lists. |
| **Popover** | `40` | `z-40` | Contextual action panels, tooltip grids. |
| **Modal / Overlay** | `50` | `z-50` | Fullscreen modal cards, dim backdrop layer. |
| **Toast** | `60` | `z-60` | Notification alerts (React Hot Toast). |
| **Tooltip** | `70` | `z-70` | Focus/Hover descriptive metadata. |

---

## 🏷️ Component Naming Convention

Assura uses structured naming conventions to ensure maintainability. All React files and folders must follow these standards:

### 1. PascalCase Components
All UI and feature components must use **PascalCase** naming:
- **General Components**: `<PrimaryButton />`, `<StatsCard />`, `<PolicyTable />`
- **Layout components**: Ending with `Layout`, e.g., `<DashboardLayout />`, `<AuthLayout />`
- **Form components**: Ending with `Form`, e.g., `<LoginForm />`, `<PolicyForm />`

### 2. Files & Hooks
- **Component Files**: Save in PascalCase matching the component name (e.g., `StatsCard.jsx`, `PolicyTable.jsx`).
- **Icons**: Utilize PascalCase named imports from `lucide-react` directly (e.g., `Shield`, `Mail`, `Lock`).
- **Hooks**: Use **camelCase** prefixed with `use` (e.g., `useAuth.js`, `usePolicyClaims.js`).

---

## 🎨 Semantic Status Colors

State colors represent specific operational responses. Use the following combinations of soft backgrounds, border strokes, and contrasting text classes to represent semantic states:

### 1. Success
- **Background**: Soft Emerald (`#EBFDF5` / `bg-success/10`)
- **Border**: Emerald Line (`#22C55E` / `border-success`)
- **Text**: Deep Emerald (`#15803D` / `text-emerald-700`)
- **Typical Usage**: Approved claim states, paid invoice badges, active policies.

### 2. Warning
- **Background**: Soft Amber (`#FEF3C7` / `bg-warning/10`)
- **Border**: Amber Line (`#F59E0B` / `border-warning`)
- **Text**: Deep Amber (`#B45309` / `text-amber-700`)
- **Typical Usage**: Expiring contract warnings, pending agent reviews, payment grace periods.

### 3. Error
- **Background**: Soft Rose (`#FEF2F2` / `bg-error/10`)
- **Border**: Rose Line (`#EF4444` / `border-error`)
- **Text**: Deep Rose (`#B91C1C` / `text-rose-700`)
- **Typical Usage**: Rejected claims, overdue billing alerts, failed authorization errors.

### 4. Info
- **Background**: Soft Slate-Blue (`#EFF6FF` / `bg-secondary/10`)
- **Border**: Royal Blue Line (`#3B82F6` / `border-secondary`)
- **Text**: Deep Royal Blue (`#1D4ED8` / `text-blue-700`)
- **Typical Usage**: Policy descriptions, system notification alerts, guide tooltips.

---

## 🗻 Elevation System

Assura maintains a clean, flat aesthetic. Elevation is structured logically through surface shading and crisp border outlines rather than relying on shadow blur.

- **Level 0 (Application Background)**:
  - Color: `#FFFFFF` / `bg-bg-base`
  - Usage: Flat body background workspace.
- **Level 1 (Cards & Structural Modules)**:
  - Color: `#F8FAFC` / `bg-surface` with solid border `border border-border-custom`.
  - Shadow: None or `shadow-sm` at most.
  - Usage: Default cards, list boards, summary items.
- **Level 2 (Dropdowns & Popovers)**:
  - Color: `#FFFFFF` / `bg-bg-base` with border `border border-border-custom`.
  - Shadow: Muted shadow (`shadow-md`).
  - Usage: Floating selection dropdowns, filter menus.
- **Level 3 (Modals & Dialogs)**:
  - Color: `#FFFFFF` / `bg-bg-base` with border `border border-border-custom`.
  - Shadow: Stronger backdrop separation shadow (`shadow-lg`).
  - Usage: Standard overlays, action dialog cards.
- **Level 4 (Toasts & Notifications)**:
  - Color: `#FFFFFF` / `bg-bg-base` or `#0F172A` / `bg-slate-900` (for high-contrast popups).
  - Shadow: Floating depth shadow (`shadow-xl`).
  - Usage: User activity toast alerts.

### Borders vs. Shadows Guidelines
Borders should always be preferred over shadows for standard grouping elements (like Cards, Section headers, and Input fields) to maintain the platform's flat, clean, and professional enterprise aesthetic. Shadows should be reserved strictly for floating/elevated contextual overlays (like Dropdowns, Popovers, Modals, and Toasts) where vertical depth is required to denote overlay separation.

