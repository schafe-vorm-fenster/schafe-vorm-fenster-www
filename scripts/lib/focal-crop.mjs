/**
 * The crop a declared focal point asks for.
 *
 * DEC-0105 §2 makes the motif's focal point the crop's anchor: "`object-position`
 * comes from the motif's declared focal point, never `center` by default", and
 * for a sky-heavy motif it "sits at or above 40 %, so the sky crops away and the
 * motif lands above the scrim's opaque band". The same value serves two places —
 * `photo-surface` reads it as `background-position` (`src/components/photo-surface/url.ts`),
 * and `scripts/generate-images.mjs` reads it here, when it cuts a photograph to a
 * ratio box. One number, both ends: a rendition cropped somewhere else than the
 * surface positions it would make the declaration a lie.
 *
 * The rule is one sentence: **the largest window of the target ratio that fits
 * inside the frame, centred on the focal point and pushed back inside the frame
 * where the centre would hang over an edge.** It never scales up and never
 * zooms in — a crop that drops resolution to move a subject is a second
 * decision, and this one is not it.
 */

/**
 * What `photo-surface` falls back to without a declared focal point
 * (`photo-surface.module.css`: `background-position: var(--photo-focal, 50% 40%)`).
 * The crop uses the same pair, so an entry without a `focal` is cropped exactly
 * where the surface would have positioned it.
 */
export const DEFAULT_FOCAL = Object.freeze({ x: 50, y: 40 });

const percent = (value, name) => {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`focal-crop: ${name} is a percentage of the frame, 0–100: ${value}`);
  }
  return value / 100;
};

const positive = (value, name) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`focal-crop: ${name} is a positive pixel count: ${value}`);
  }
  return value;
};

/**
 * @param {{ width: number, height: number }} source the photograph's pixels
 * @param {{ width: number, height: number }} out    the ratio box it is cut to
 * @param {{ x: number, y: number } | undefined} focal the motif's focal point in per cent
 * @returns {{ left: number, top: number, width: number, height: number }}
 *   the window to `extract`, in source pixels
 */
export function cropWindow(source, out, focal = DEFAULT_FOCAL) {
  const sourceWidth = positive(source?.width, "source width");
  const sourceHeight = positive(source?.height, "source height");
  const outWidth = positive(out?.width, "target width");
  const outHeight = positive(out?.height, "target height");
  const fx = percent(focal?.x ?? DEFAULT_FOCAL.x, "focal.x");
  const fy = percent(focal?.y ?? DEFAULT_FOCAL.y, "focal.y");

  const ratio = outWidth / outHeight;
  // The larger of the two windows that fit: full width when the frame is
  // taller than the box wants, full height when it is wider.
  let width = sourceWidth;
  let height = Math.round(sourceWidth / ratio);
  if (height > sourceHeight) {
    height = sourceHeight;
    width = Math.round(sourceHeight * ratio);
  }
  width = Math.min(width, sourceWidth);
  height = Math.min(height, sourceHeight);

  const clamp = (value, span, frame) => Math.round(Math.min(Math.max(value, 0), frame - span));
  return {
    left: clamp(sourceWidth * fx - width / 2, width, sourceWidth),
    top: clamp(sourceHeight * fy - height / 2, height, sourceHeight),
    width,
    height,
  };
}

/**
 * The crop for a box whose lower part is covered — DEC-0153.
 *
 * `cropWindow` centres the focal point, which is right for a picture nobody
 * writes on. A story stage or a hero lays a reading band over its lower half
 * (SRC-0014 §The scrim: clear above 38 %, darkening to 0.72 at the bottom), so
 * a focal point centred at 50 % — or a village motif sitting at 60 % under a
 * sky — ends up under the quote. Here the caller names the **anchor**: where in
 * the output box the focal point has to land (`{x: 50, y: 28}` puts it in the
 * clear band). The window is the **largest** one of the target ratio that
 * puts the focal point exactly there without leaving the frame; it zooms in
 * only as far as that takes, and never below `minWidth` source pixels, the
 * resolution floor for the box it fills. Where the floor or the frame stops it
 * short, the focal point lands as close to the anchor as the frame allows, and
 * `landed` says where — the build reports it instead of hiding it.
 *
 * @param {{ width: number, height: number }} source
 * @param {{ width: number, height: number }} out
 * @param {{ x: number, y: number } | undefined} focal  per cent of the frame
 * @param {{ x: number, y: number }} anchor             per cent of the output box
 * @param {{ minWidth?: number }} [options]             defaults to `out.width`
 * @returns {{ left: number, top: number, width: number, height: number,
 *             landed: { x: number, y: number }, anchored: boolean }}
 */
export function anchoredCropWindow(source, out, focal, anchor, { minWidth } = {}) {
  const W = positive(source?.width, "source width");
  const H = positive(source?.height, "source height");
  const outWidth = positive(out?.width, "target width");
  const outHeight = positive(out?.height, "target height");
  const fx = percent(focal?.x ?? DEFAULT_FOCAL.x, "focal.x");
  const fy = percent(focal?.y ?? DEFAULT_FOCAL.y, "focal.y");
  const ax = percent(anchor?.x ?? 50, "anchor.x");
  const ay = percent(anchor?.y ?? 50, "anchor.y");
  const ratio = outWidth / outHeight;
  const floor = Math.min(minWidth ?? outWidth, W, Math.round(H * ratio));

  // Every bound on the window's width that keeps the focal point at the
  // anchor inside the frame; a zero share means "no bound from that side".
  const bounds = [W, H * ratio];
  if (ax > 0) bounds.push((fx * W) / ax);
  if (ax < 1) bounds.push(((1 - fx) * W) / (1 - ax));
  if (ay > 0) bounds.push(((fy * H) / ay) * ratio);
  if (ay < 1) bounds.push((((1 - fy) * H) / (1 - ay)) * ratio);
  const exact = Math.min(...bounds);

  const width = Math.round(Math.max(exact, floor));
  const height = Math.round(width / ratio);
  const clamp = (value, span, frame) => Math.round(Math.min(Math.max(value, 0), frame - span));
  const left = clamp(fx * W - ax * width, width, W);
  const top = clamp(fy * H - ay * height, height, H);
  const landed = {
    x: Math.round(((fx * W - left) / width) * 1000) / 10,
    y: Math.round(((fy * H - top) / height) * 1000) / 10,
  };
  return {
    left,
    top,
    width,
    height,
    landed,
    anchored: Math.abs(landed.x - ax * 100) <= 1 && Math.abs(landed.y - ay * 100) <= 1,
  };
}
