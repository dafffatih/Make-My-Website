# The Design System: High-End Editorial Strategy

## 1. Overview & Creative North Star: "The Digital Architect"
This design system is built to transcend the "template" aesthetic prevalent in web development. Our Creative North Star is **"The Digital Architect"**—a philosophy that treats web interfaces like high-end physical galleries. We prioritize intentional asymmetry, oversized editorial typography, and tonal depth over rigid grids and standard borders. 

By leveraging "Make My Website’s" premium identity, we move away from "web-safe" layouts. We use overlapping elements (e.g., a high-headline-lg breaking across a surface-container-high card) and massive negative space to signal confidence, quality, and innovation.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in a dark, sophisticated atmosphere using deep charcoals and slate grays, punctuated by an "Electric Indigo" (`primary`) and "Liquid Gold" (`tertiary`).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be created exclusively through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting directly against a `surface` background.
2.  **Tonal Transitions:** Moving from `surface-container-lowest` to `surface-container-highest` to signal a change in content context.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Nesting should follow a logical progression to create "Visual Gravity":
*   **Base Layer:** `surface` (#131313) for the main body.
*   **Secondary Content:** `surface-container-low` (#1c1b1b) for large background sections.
*   **Interactive Cards:** `surface-container-high` (#2a2a2a) to draw the eye.
*   **High-Priority Modals:** `surface-container-highest` (#353534) for maximum "lift."

### Signature Textures & Glassmorphism
*   **The Glass Rule:** Floating navigation or overlay menus must use `surface_variant` with a 60% opacity and a `backdrop-blur` of 20px. 
*   **The Signature Gradient:** For Hero CTAs and primary actions, utilize a linear gradient from `primary` (#c3c0ff) to `primary_container` (#4f46e5) at a 135-degree angle. This provides a "soul" that flat colors lack.

---

## 3. Typography: Editorial Authority
We use a high-contrast scale to create an editorial rhythm. The pairing of **Manrope** (Display/Headline) and **Inter** (Body/Label) strikes a balance between technical precision and human warmth.

*   **Display-LG (3.5rem):** Reserved for hero statements. Use tight letter-spacing (-0.02em) to create a "block" of text that feels like a graphic element.
*   **Headline-MD (1.75rem):** Used for section starts. Often placed asymmetrically (e.g., left-aligned while content is center-right) to break the grid.
*   **Body-LG (1rem):** Our standard for readability. Ensure a line-height of 1.6 to maintain the "premium" airy feel.
*   **Label-SM (0.6875rem):** Use `on_surface_variant` and uppercase styling for "Meta" information or small categories to provide a technical, "coded" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are a fallback, not a standard. We achieve depth through the **Layering Principle**.

*   **Ambient Shadows:** When an element must float (e.g., a floating action button), use a shadow with a blur radius of 40px, a Y-offset of 20px, and an opacity of 6% using the `on_background` color as the tint.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline_variant` (#464555) at **15% opacity**. Never use 100% opaque lines.
*   **Shadow-to-Surface Mapping:**
    *   `surface-container-lowest` -> Inner shadow (recessed).
    *   `surface-container-highest` -> Ambient outer shadow (elevated).

---

## 5. Components: Refined Primitives

### Buttons: The Signature Action
*   **Primary:** Gradient fill (`primary` to `primary_container`), `full` roundedness, and `label-md` typography in uppercase.
*   **Secondary:** Ghost style. No background, `outline-variant` (20% opacity) border, and `on_surface` text.
*   **Hover State:** Increase the `surface_bright` exposure or shift the gradient intensity.

### Cards & Sections
*   **Constraint:** Zero divider lines.
*   **Separation:** Use `spacing-16` (5.5rem) or `spacing-20` (7rem) between major content blocks. 
*   **Nesting:** Place a `surface-container-highest` card inside a `surface-container-low` section to create natural contrast.

### Input Fields
*   **Style:** Minimalist. Only a bottom "Ghost Border" (10% opacity) that animates to 100% `primary` color on focus. 
*   **Floating Labels:** Use `label-md` for placeholder text that transitions into a `label-sm` above the input upon interaction.

### Modern Agency Additions
*   **The "Work" Grid:** Use staggered heights for portfolio items (asymmetry) instead of a uniform grid.
*   **The Cursor Follower:** A subtle 40px circle using `surface_tint` at 10% opacity that follows the mouse, interacting with `backdrop-blur` elements.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetric Margins:** Give elements room to "breathe" unevenly to create a custom, high-end feel.
*   **Leverage Tonal Contrast:** Use the difference between `surface_dim` and `surface_bright` to guide the user's eye.
*   **Embrace the "Big Type" Trend:** Let the `display-lg` typography do the heavy lifting for visual interest.

### Don't:
*   **Don't Use Pure Black (#000):** It kills the depth of the slate/charcoal palette. Stick to `surface` (#131313).
*   **Don't Use Dividers:** If you feel the need for a line, increase the `spacing` token instead.
*   **Don't Default to "Medium" Roundedness:** Use `none` for a brutalist look or `full` for a modern, tech-forward look. Avoid the middle-ground `md` (0.375rem) which can feel generic.
*   **Don't Overcrowd:** If a section feels "busy," delete one element and double the white space.