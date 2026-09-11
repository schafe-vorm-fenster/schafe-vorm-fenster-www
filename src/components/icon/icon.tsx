import {
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  Church,
  CircleCheck,
  CircleX,
  Clock,
  Download,
  ExternalLink,
  Globe,
  HeartPulse,
  House,
  Info,
  Landmark,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Monitor,
  Music,
  PartyPopper,
  Phone,
  Plus,
  QrCode,
  Search,
  Share2,
  ShoppingBasket,
  Smartphone,
  Sprout,
  Store,
  Theater,
  Tractor,
  TriangleAlert,
  Trophy,
  Truck,
  Users,
  Utensils,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

/**
 * The role → glyph table of the design system (SRC-014 §Icons), verbatim.
 * "Any new requirement takes the matching Lucide glyph" — it is added here,
 * never drawn by hand and never taken from another family. `arrow-up` is the
 * one addition M2 needs (`back-to-top`), and it is a Lucide glyph.
 */
const GLYPHS = {
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "map-pin": MapPin,
  "calendar-days": CalendarDays,
  check: Check,
  "circle-check": CircleCheck,
  "circle-x": CircleX,
  "triangle-alert": TriangleAlert,
  info: Info,
  smartphone: Smartphone,
  globe: Globe,
  landmark: Landmark,
  theater: Theater,
  truck: Truck,
  store: Store,
  "shopping-basket": ShoppingBasket,
  tractor: Tractor,
  sprout: Sprout,
  church: Church,
  users: Users,
  "party-popper": PartyPopper,
  "heart-pulse": HeartPulse,
  trophy: Trophy,
  megaphone: Megaphone,
  "qr-code": QrCode,
  download: Download,
  mail: Mail,
  phone: Phone,
  clock: Clock,
  monitor: Monitor,
  menu: Menu,
  search: Search,
  "share-2": Share2,
  "external-link": ExternalLink,
  house: House,
  plus: Plus,
  utensils: Utensils,
  music: Music,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof GLYPHS;

/** 24 standard · 18 inside a badge or kicker · 32 as a section lead. No other size. */
export const ICON_SIZES = [18, 24, 32] as const;
export type IconSize = (typeof ICON_SIZES)[number];

export const ICON_NAMES = Object.keys(GLYPHS) as IconName[];

export interface IconProps {
  readonly name: IconName;
  readonly size?: IconSize;
  readonly className?: string;
}

/**
 * 20 `icon` [PROPOSED] — SRC-014 §Icons.
 *
 * Structure: Lucide only, 24 × 24 grid, 2 px stroke, round caps; the
 * role → glyph table above is the allowed set, and the type makes anything
 * outside it a compile error.
 * States: none.
 * Inherits: monochrome, one token colour through `currentColor`; never
 * filled, never two-tone, never in a coloured circle unless that circle is a
 * 44 px control well.
 * Space: 24 px standard, 18 px inside a badge/kicker, 32 px section lead.
 * A11y: decorative and always accompanied by text, so `aria-hidden`. An icon
 * that would need a label is a missing text label, not a labelled icon.
 */
export function Icon({ name, size = 24, className }: IconProps) {
  const Glyph = GLYPHS[name];

  return (
    <Glyph
      absoluteStrokeWidth
      aria-hidden="true"
      className={className}
      focusable="false"
      height={size}
      strokeWidth={2}
      width={size}
    />
  );
}
