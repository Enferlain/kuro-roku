# Kuro-Roku Styling Guide

Guidelines for maintaining consistent styling across components.

---

## Token Hierarchy

The design system uses a layered token approach. **Always use the most semantic token available.**

```
Base Palette → Semantic Tokens → Component Tokens → Tailwind Classes
```

| Layer                | Example                                | Use When                                   |
| -------------------- | -------------------------------------- | ------------------------------------------ |
| **Base Palette**     | `--color-violet-500`                   | Never directly - only in design-system.css |
| **Semantic Tokens**  | `--primary-color`, `--base-foreground` | Rarely - CSS custom properties             |
| **Tailwind Classes** | `bg-primary`, `text-foreground`        | Always - in components                     |

---

## Color Classes

### Text Colors

| Class                       | Use For                           |
| --------------------------- | --------------------------------- |
| `text-foreground`           | Primary text                      |
| `text-secondary-foreground` | Less prominent text               |
| `text-muted-foreground`     | Subtle text, labels, placeholders |
| `text-primary`              | Accent text, links, highlights    |
| `text-error`                | Error messages                    |

### Background Colors

| Class                              | Use For                                          |
| ---------------------------------- | ------------------------------------------------ |
| `bg-background`                    | Page background (rarely used, body handles this) |
| `bg-elevated-background`           | Cards, panels, overlays                          |
| `bg-secondary-background`          | Inputs, inactive buttons, subtle sections        |
| `bg-secondary-background-hover`    | Hover states                                     |
| `bg-secondary-background-selected` | Active/selected states                           |
| `bg-primary`                       | Primary buttons, accents                         |

### Border Colors

| Class                   | Use For                        |
| ----------------------- | ------------------------------ |
| `border-border-subtle`  | Default borders, dividers      |
| `border-border-default` | Emphasized borders             |
| `border-border-strong`  | High contrast borders          |
| `border-primary`        | Focus states, active selection |

---

## Component Patterns

### Hover States

```tsx
// ✅ Good - semantic hover
className = "hover:bg-secondary-background-hover";

// ❌ Bad - hardcoded color
className = "hover:bg-white/10";
```

### Active/Selected States

```tsx
// ✅ Good - semantic selection
className={active ? "bg-secondary-background-selected" : ""}

// ❌ Bad - hardcoded
className={active ? "bg-gray-700" : ""}
```

### Focus States

```tsx
// ✅ Good - using ring with primary
className = "focus-visible:ring-2 focus-visible:ring-primary";
```

### Buttons

Use the `Button` component from `@/components/ui/shared`:

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="icon"><Icon /></Button>
```

### Cards

Use the `Card` component:

```tsx
<Card onClick={handleClick} selected={isSelected}>
  {children}
</Card>
```

### Badges

```tsx
<Badge variant="neutral">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

---

## File Type Colors

For file type indicators, use these Tailwind classes:

| Type     | Background         | Text                 |
| -------- | ------------------ | -------------------- |
| Video    | `bg-violet-500/20` | `text-file-video`    |
| Image    | `bg-azure-500/20`  | `text-file-image`    |
| Audio    | `bg-jade-500/20`   | `text-file-audio`    |
| Document | `bg-gold-500/20`   | `text-file-document` |
| Other    | `bg-kuro-400`      | `text-file-other`    |

---

## Spacing & Layout

Use Tailwind's spacing scale consistently:

| Spacing         | Use For                  |
| --------------- | ------------------------ |
| `gap-1` / `p-1` | Tight internal spacing   |
| `gap-2` / `p-2` | Default internal spacing |
| `gap-3` / `p-3` | Card padding             |
| `gap-4` / `p-4` | Section padding          |
| `gap-6` / `p-6` | Large content areas      |

### Panel Margins

```tsx
// Main content area
className = "mx-2 my-2"; // Or equivalent

// Sidebar
className = "pt-4 pb-6 pl-4 pr-2";
```

---

## Typography

### Font Families

- **Body text**: Default (Inter) - no class needed
- **Monospace**: `font-mono` (JetBrains Mono)

### Text Sizes

| Class       | Use For                    |
| ----------- | -------------------------- |
| `text-xs`   | Labels, badges, metadata   |
| `text-sm`   | Default body text, buttons |
| `text-base` | Headers, emphasis          |
| `text-lg`   | Section titles             |

### Section Headers

```tsx
<span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
  SECTION TITLE
</span>
```

---

## Shadows & Effects

| Class               | Use For               |
| ------------------- | --------------------- |
| `shadow-sm`         | Subtle elevation      |
| `shadow-lg`         | Cards, dropdowns      |
| `shadow-xl`         | Panels, modals        |
| `shadow-primary/20` | Primary button glow   |
| `backdrop-blur-xl`  | Glassmorphism effects |

---

## Transitions

Standard transition for interactive elements:

```tsx
className = "transition-all duration-200";
// Or more specific
className = "transition-colors duration-200";
```

---

## Do's and Don'ts

### ✅ Do

- Use semantic token classes (`text-muted-foreground`, `bg-secondary-background`)
- Use shared components (`Button`, `Card`, `Badge`)
- Keep opacity in the class (`bg-primary/20`) rather than a separate opacity utility
- Use `ring-` for focus states, `border-` for structural borders

### ❌ Don't

- Hardcode colors (`#ffffff`, `rgba(255,255,255,0.1)`)
- Use arbitrary values for common patterns (`bg-[#1a1a1a]`)
- Create one-off color variants - add to design-system.css if needed
- Use `opacity-*` utilities for colored backgrounds - use `bg-color/opacity` syntax

---

## Adding New Tokens

If you need a new color/token:

1. Add base color to `@theme` in `design-system.css`:

   ```css
   --color-newcolor-500: #hexvalue;
   ```

2. Add semantic token in `:root` and `.dark`:

   ```css
   --new-semantic-token: var(--color-newcolor-500);
   ```

3. Add Tailwind bridge in `@theme inline`:

   ```css
   --color-new-semantic-token: var(--new-semantic-token);
   ```

4. Document it in this guide!
