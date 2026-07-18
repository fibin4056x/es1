---
name: Zenith Edu
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#89ceff'
  on-tertiary: '#00344d'
  tertiary-container: '#009ada'
  on-tertiary-container: '#002d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  mono-code:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system embodies **Enterprise Luxury** for the education sector. It moves away from the typical "playful" school aesthetic toward a **Futuristic Minimalist** environment that honors the gravity of academic administration. The brand personality is authoritative yet frictionless, mimicking the precision of high-end developer tools like Vercel or Linear.

The visual style is a blend of **Glassmorphism** and **Minimalism**. It utilizes deep obsidian surfaces, ultra-thin strokes, and soft-glow lighting to create a sense of infinite depth. The goal is to evoke a "command center" feel—calm, organized, and technologically superior—reducing the cognitive load for principals and teachers managing complex data.

## Colors
The palette is rooted in a **Deep Midnight (#0A0A0B)** foundation. This "ink-trap" background allows secondary accents to pop with high-energy vibrancy. 

- **Primary Indigo (#6366F1):** Used for primary actions and focus states.
- **Vibrant Violet (#A855F7):** Used for success indicators, specialized data sets, and premium features.
- **Glass Surfaces:** Utilizes semi-transparent layers with `backdrop-filter: blur(20px)` to create hierarchy without the need for heavy color shifts.
- **Contrast Strategy:** All primary text is "Crisp White" (#FAFAFA), while supporting UI labels use "Muted Slate" (#71717A) to maintain a sophisticated hierarchy.

## Typography
This design system utilizes **Inter** for its global versatility and professional clarity. For headings, we apply **tight tracking** (negative letter-spacing) to achieve the high-end SaaS aesthetic seen in premium editorial layouts.

- **Headlines:** Use Bold and Semi-Bold weights with reduced letter-spacing to create a compact, impactful look.
- **UI Labels:** **Geist** (or a similar technical sans) is introduced for small labels, data points, and metadata to provide a subtle "tooling" feel.
- **Body:** Standardized at 16px for optimal legibility against dark backgrounds, ensuring that complex reports remain easy to scan.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width of 1440px. We use a 12-column system for desktop views, transitioning to a single-column stack for mobile.

- **Rhythm:** An 8px/4px based linear scale ensures consistent vertical rhythm.
- **Safe Zones:** Generous margins (24px - 40px) around the viewport edges prevent the UI from feeling claustrophobic, reinforcing the "Luxury" narrative.
- **Information Density:** For administrative dashboards, use "Compact" spacing (sm/md), but for student profiles or report narratives, increase to "Spacious" (md/lg) to improve focus.

## Elevation & Depth
Depth is created through **Volumetric Lighting** and **Tonal Layering** rather than traditional drop shadows.

- **Level 1 (Base):** The #0A0A0B background.
- **Level 2 (Surface):** Glassmorphic cards with a 1px border of `white @ 8%` and a subtle inner glow.
- **Level 3 (Popovers):** Elements like modals or dropdowns use a "Linear Shadow"—a multi-layered shadow stack (0px 4px 20px rgba(0,0,0,0.5)) combined with a slightly more opaque glass background.
- **Accent Glows:** Primary buttons and active states feature a soft indigo "Ambient Blur" behind the element, suggesting a light source emanating from within the UI.

## Shapes
We employ a **Rounded** shape language to soften the "Enterprise" feel and make the software feel modern and approachable. 

- **Primary Elements:** Buttons and Input fields use a standard 8px (0.5rem) radius.
- **Containers:** Large dashboard cards and modals use a 16px (1rem) radius.
- **Pill Tags:** Use fully rounded corners for status indicators (e.g., "Active", "Pending") to differentiate them from functional buttons.

## Components
- **Buttons:** Primary buttons feature a subtle vertical gradient (Indigo to Violet) with a 1px top-border highlight. Hover states should trigger a "glow" effect via a soft box-shadow.
- **Inputs:** Fields are dark-filled with a subtle border. On focus, the border transitions to Primary Indigo and the background increases in transparency, creating a "lens" effect.
- **Cards:** Use a glassmorphic treatment. Background: `rgba(255, 255, 255, 0.03)`. Blur: `20px`. Border: `1px solid rgba(255, 255, 255, 0.08)`.
- **Chips/Badges:** Small, low-profile elements with ghost-style borders. For alerts, use high-saturation text but keep the background semi-transparent to avoid "color-blocking" the layout.
- **Lists:** Clean rows separated by 1px "hairline" dividers. Use chevron icons only when an action is required; otherwise, rely on hover-state background shifts to indicate interactivity.
- **Data Tables:** High-density with sticky headers. Use "Zebra" striping only on hover to maintain the clean minimalist aesthetic of the static view.