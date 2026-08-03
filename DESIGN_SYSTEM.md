# 🎨 Assura Prismatic UI Design System

> **Version**: 2.0  
> **Theme**: Prismatic Light Theme (Violet / Indigo / Blue / Cyan)  
> **Brand Persona**: Secure, Professional, Spacious, Modern Enterprise

---

## 👁️ Brand Identity & Logo System

Assura's interface embodies security, transparency, and premium craftsmanship.

### Logo Header Specs
- **Logo Emblem**: Clean border-free 3D shield icon (`scale-[1.4]`).
- **Brand Title**: `ASSURA` rendered with a vibrant gradient text mask:
  - Class: `text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500`
- **Tagline**: `INSURE • PROTECT • ASSURE` rendered in bold solid black text:
  - Class: `text-[8px] font-black text-text-primary tracking-wider uppercase leading-none mt-1`

---

## 🎨 Color Palette & Tokens

Assura uses a curated light-theme token palette.

| Token Key | Color Name | Hex Value | Tailwind Class | Application |
| :--- | :--- | :--- | :--- | :--- |
| `--color-primary` | Violet | `#7C3AED` | `text-primary`, `bg-primary` | Primary action buttons, active navigation indicators, key links. |
| `--color-secondary` | Royal Blue | `#3B82F6` | `text-secondary`, `bg-secondary` | Secondary buttons, informational highlights, accent borders. |
| `--color-accent` | Cyan | `#22D3EE` | `text-accent`, `bg-accent` | Gradient stops, active cover badges, dynamic trend highlights. |
| `--color-bg-base` | Pure White | `#FFFFFF` | `bg-bg-base` | Main application background and elevated card surfaces. |
| `--color-surface` | Slate Ice | `#F8FAFC` | `bg-surface` | Page body background, table headers, sidebar active states. |
| `--color-border-custom` | Slate Mist | `#E2E8F0` | `border-border-custom` | Input borders, card outlines, table grid dividers. |
| `--color-text-primary` | Slate Dark | `#0F172A` | `text-text-primary` | Primary headings, body copy, key text metrics. |
| `--color-text-secondary`| Slate Medium| `#475569` | `text-text-secondary` | Captions, placeholders, subheaders, timestamps. |
| `--color-success` | Emerald | `#10B981` | `text-success`, `bg-success/10` | Active policies, paid premiums, approved claims. |
| `--color-warning` | Amber | `#F59E0B` | `text-warning`, `bg-warning/10` | Pending policies/claims, upcoming due dates, warnings. |
| `--color-error` | Rose | `#EF4444` | `text-error`, `bg-error/10` | Cancelled/expired policies, rejected claims, delete actions. |

---

## 🔠 Typography & Fonts

- **Primary Sans**: `Plus Jakarta Sans`, sans-serif
- **Data / Mono**: `JetBrains Mono`, monospace (used for Policy Numbers, Claim Numbers, Transaction IDs, Currency values)

```css
--font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

---

## 🧭 Navigation & Layout Components

### 1. Active Navigation Pill (`DashboardLayout.jsx`)
- **Active State**: Gradient pill container with shadow accent:
  - Class: `bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-white font-bold shadow-md shadow-purple-500/20 rounded-xl`
- **Inactive State**: Muted text with soft purple hover fill:
  - Class: `text-text-secondary hover:bg-purple-50/50 hover:text-text-primary font-medium rounded-xl`

### 2. Top Header & Interactive Profile Dropdown
- **Header Heights**: `h-20` (80px) sticky header with backdrop blur (`backdrop-blur-md`).
- **Interactive Profile Chip**: Clickable avatar + user email + role badge with rotating `ChevronDown` arrow.
- **Auto-Close Outside Handler**: Built with `useRef` + `useEffect` `mousedown` listener to close dropdown automatically when clicking anywhere outside.

### 3. Reusable `ConfirmModal` Component
Replaces browser `window.confirm()` across all deletion workflows:
- **Overlay**: Backdrop blur `fixed inset-0 z-50 bg-black/50 backdrop-blur-sm`.
- **Card**: `max-w-md bg-bg-base border-border-custom rounded-2xl p-6 shadow-2xl`.
- **Variants**: `danger` (red alert icon + danger action button), `warning`, `primary`.

---

## 📐 Border Radius & Shadows

- **Buttons & Inputs**: `rounded-xl` (12px)
- **Cards & Modals**: `rounded-2xl` (16px)
- **Status Badges**: `rounded-full` (9999px)
- **Shadows**: Muted elevation (`shadow-md`, `shadow-xl`) reserved for popovers, modals, and toasts.

---

## 📱 Responsive Layout System

- **Mobile (`< 768px`)**: Collapsible mobile sidebar overlay with hamburger menu button.
- **Tablet & Desktop (`>= 768px`)**: Fixed left navigation sidebar, sticky top header bar, and centered content container (`max-w-7xl mx-auto`).
