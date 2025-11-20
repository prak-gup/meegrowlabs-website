# Meegrowlabs Landing Page

A modern, responsive one-page marketing website for Meegrowlabs - an AI automation studio that designs and builds custom AI systems for real-world workflows.

## Features

- ⚡ Built with React 18, TypeScript, and Tailwind CSS
- 🎨 Distinctive dark mode design with animated neural network background
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible with semantic HTML and proper ARIA labels
- 🎭 Smooth animations and micro-interactions
- 🚀 Optimized for performance with Vite

## Tech Stack

- **React 18.3+** - UI framework
- **TypeScript 5.4+** - Type safety
- **Tailwind CSS 3.4+** - Styling
- **Vite 5.2+** - Build tool
- **Space Grotesk & Inter** - Typography

## Project Structure

```
meegrowlabs-landing/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx       # Sticky header with WhatsApp CTA
│   │   ├── AnimatedBackground.tsx # Canvas-based neural network animation
│   │   ├── Hero.tsx            # Hero section with stats
│   │   ├── WhatWeDo.tsx        # Company description
│   │   ├── Automations.tsx     # Showcase of automation types
│   │   ├── HowItWorks.tsx      # 4-step process
│   │   ├── WhoItsFor.tsx       # Target audience
│   │   └── FinalCTA.tsx        # Final call-to-action + footer
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── index.html                  # HTML entry
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Design Features

### Color Palette

- **Primary Background**: `#0a0e1a`
- **Accent Colors**:
  - Cyan: `#06b6d4`
  - Purple: `#a855f7`
  - Pink: `#ec4899`
  - Orange: `#f97316`

### Typography

- **Display Font**: Space Grotesk (headings, numbers)
- **Body Font**: Inter (paragraphs, UI text)

### Animations

- Neural network particle system in the background
- Scroll-triggered animations for sections
- Hover effects on cards and buttons
- Smooth transitions throughout

## WhatsApp Integration

The primary CTA opens a WhatsApp chat with pre-filled message:
- Phone: `+91 9910580555`
- Message: "Hi I want to explore AI automation with Meegrow"

## Customization

### Updating Content

All content is component-based. Edit the respective files in `src/components/`:

- **Hero text**: `Hero.tsx`
- **Automation cards**: `Automations.tsx`
- **Process steps**: `HowItWorks.tsx`
- **Target audience**: `WhoItsFor.tsx`

### Changing Colors

Update the color variables in:
- `src/index.css` (CSS variables)
- `tailwind.config.js` (Tailwind theme)

### Modifying Animations

- Background animation: `AnimatedBackground.tsx`
- Scroll animations: `App.tsx` (Intersection Observer)
- Tailwind animations: `tailwind.config.js`

## SEO & Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy (h1, h2, h3)
- Meta description in `index.html`
- Alt text for meaningful content
- Color contrast meets WCAG AA standards
- Keyboard navigation support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for off-screen content
- CSS-based animations (hardware accelerated)
- Optimized bundle size with Vite
- Minimal external dependencies

## License

© 2024 Meegrowlabs. All rights reserved.

## Contact

For questions or support, reach out via WhatsApp: [+91 9910580555](https://wa.me/919910580555)
