/** Ordinary per-field appearance hooks; preview references are absent from saved project data. */
export interface VisualCopy {
  visualStyles?: Record<string, string>;
  __aiwaVisual?: Record<string, string>;
}
export function visualCopy(value: VisualCopy | undefined, field: string, className = '') {
  const style = value?.visualStyles?.[field];
  const ref = value?.__aiwaVisual?.[field]?.split(':');
  return {
    className: [className, style && /^aiwa-ve-[a-f0-9]{16}$/.test(style) ? style : ''].filter(Boolean).join(' '),
    ...(ref && /^[a-f0-9]{16}$/.test(ref[0]) && /^[a-f0-9]{64}$/.test(ref[1]) ? { 'data-aiwa-ve': ref[0], 'data-aiwa-vh': ref[1] } : {}),
  };
}
