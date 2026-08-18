---
name: Majestic Heritage
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4d4635'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#7f7663'
  outline-variant: '#d0c5af'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#e9c349'
  secondary: '#b41d11'
  on-secondary: '#ffffff'
  secondary-container: '#d83828'
  on-secondary-container: '#fffbff'
  tertiary: '#60603e'
  on-tertiary: '#ffffff'
  tertiary-container: '#b6b58c'
  on-tertiary-container: '#474727'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930000'
  tertiary-fixed: '#e6e5b9'
  tertiary-fixed-dim: '#cac99f'
  on-tertiary-fixed: '#1d1d03'
  on-tertiary-fixed-variant: '#484828'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  section-padding: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is anchored in a **Modern Luxury / Editorial** style that blends the opulence of traditional royal aesthetics with the clean execution of high-end hospitality digital products. It targets high-net-worth clients and wedding planners, evoking feelings of exclusivity, timelessness, and absolute confidence in the venue's scale.

The visual narrative relies on high-contrast layouts, generous whitespace to allow photography to "breathe," and delicate metallic accents. The "Palace" aesthetic is achieved through structural symmetry and the use of ornate digital "jewelry"—such as hairline gold dividers and custom vector flourishes—that frame logistical data with the same care as a wedding invitation.

## Colors

The palette is rooted in regal tradition.
- **Creamy White (#FFFDD0):** Acts as the primary canvas, replacing pure white to create a warmer, more "expensive" paper-like feel.
- **Deep Royal Gold (#D4AF37):** Used for interactive elements, ornamental accents, and brand-critical iconography.
- **Crimson Red (#990000):** Reserved for high-importance call-to-actions, status indicators (like "Limited Availability"), and primary heading underlines.
- **Neutral (#1A1A1A):** Used for primary typography to ensure maximum legibility against the cream background.

## Typography

Typography follows a strict hierarchy. **Playfair Display** provides the editorial "Grandeur" required for headings, while **Montserrat** handles the "Logistical Ease," providing a functional contrast for details like capacity counts and parking instructions.

For large displays, use `display-lg` with tight letter spacing. All navigational labels and small metadata should use `label-caps` to maintain a structured, sophisticated appearance.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system (12 columns on desktop) with centered containers to evoke a sense of balance and stability. 

- **Desktop:** 1280px max-width with 24px gutters.
- **Sectioning:** Use large vertical padding (`section-padding`) to separate logistical information (Capacity/Parking) from emotional imagery, preventing the UI from feeling cluttered.
- **Logistical Cards:** Information regarding venue specs should be grouped in a 3-column grid to allow quick scanning of key data points.

## Elevation & Depth

This design system eschews heavy shadows in favor of **Tonal Layers** and **Gold Outlines**. 

- **Surfaces:** Use subtle shifts between the Creamy White background and a slightly lighter "Highlight Cream" for card surfaces.
- **Borders:** Instead of shadows, use 1px solid Gold (#D4AF37) borders for primary containers. 
- **The "Hero" Lift:** Only the primary inquiry form and high-priority modals should use a very soft, diffused amber-tinted shadow to suggest they are floating above the "palace floor."

## Shapes

The shape language is **Sharp (0)**. To communicate architectural grandeur and "Royal" precision, we utilize 90-degree corners for all buttons, input fields, and image containers. 

Softness is introduced through typography and flourishes rather than corner radii. Rectangular framing suggests structural integrity and formal elegance.

## Components

### Buttons
- **Primary:** Solid Crimson Red (#990000) background, white Montserrat caps text, sharp corners.
- **Secondary:** Transparent background, 1px Gold (#D4AF37) border, Gold text. 
- **Hover State:** Primary buttons transition to a deeper shade of red; secondary buttons fill with a light gold wash.

### Ornate Borders
- Use a "Double-Line" border style for featured sections: a 1px gold outer border and a 0.5px gold inner border with a 4px gap.

### Capacity & Logistical Chips
- Small, rectangular blocks with a Gold stroke and background color set to 10% opacity Gold. These display "1000+ Guests" or "Valet Parking" in `label-caps`.

### Input Fields
- Minimalist design. Only a bottom border (1px Gold). Label sits above in Montserrat 12px.

### Image Gallery
- "The Palace Frame": Use high-quality photography with a 12px internal padding of Creamy White between the image and its Gold-bordered container.