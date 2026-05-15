# Performance Budget

Performance targets for the Community Calendar frontend.

## Core Web Vitals Targets

| Metric | Target | Description |
| ------ | ------ | ----------- |
| **LCP** (Largest Contentful Paint) | < 2.5s | Main content should render quickly |
| **FID** (First Input Delay) | < 100ms | Interactive elements respond fast |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability during load |
| **FCP** (First Contentful Paint) | < 800ms | Initial content visible quickly |
| **TTFB** (Time to First Byte) | < 200ms | Server response time |

## Bundle Size Budgets

| Asset Type | Budget | Notes |
| ---------- | ------ | ----- |
| Initial HTML | < 50KB | Compressed, includes critical CSS |
| JavaScript (total) | < 100KB | Compressed, all bundles combined |
| CSS (total) | < 30KB | Compressed, includes Tailwind |
| Web fonts | < 50KB | Variable font, woff2 format |
| Images (per image) | < 100KB | WebP/AVIF preferred |

## Cache Strategy

| Content Type | Edge Cache | Stale-While-Revalidate |
| ------------ | ---------- | ---------------------- |
| Geographic pages | 5 min | 1 hour |
| Event listings | 2 min | 15 min |
| Event details | 5 min | 30 min |
| Static pages | 1 hour | 24 hours |
| API responses | 1 min | 5 min |

## Loading Strategy

1. **Critical CSS**: Inline in `<head>` for above-fold content
2. **Fonts**: Self-hosted variable fonts with `font-display: swap`
3. **JavaScript**: Defer non-critical, use `client:visible` for islands
4. **Images**: Lazy load below-fold, eager load hero images

## Monitoring

Performance is monitored via:
- Vercel Analytics (Core Web Vitals)
- Lighthouse CI in GitHub Actions
- Real User Monitoring (RUM) for production

## Performance Checklist

Before deploying, verify:

- [ ] Bundle size within budget (`pnpm turbo:build`)
- [ ] No render-blocking resources
- [ ] Images optimized and lazy-loaded
- [ ] Fonts preloaded and using `font-display: swap`
- [ ] Cache headers set correctly per content type
- [ ] No layout shifts from dynamic content
