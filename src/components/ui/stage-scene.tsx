/**
 * The About full-bleed slot. No stage photograph ships with this build, so
 * the band is drawn as an offline stage composition in the brand's ink and
 * blue: spotlight cones from a radial light source, a layered stage floor
 * with perspective hairlines, and a paper-grain texture - never a flat
 * placeholder and never a silhouette. The verbatim description sits bottom
 * left on a scrim at AA contrast, exactly where the photograph's caption
 * column will live.
 */
export function StageScene() {
  const gid = 'stage-light'
  const fid = 'stage-grain'
  return (
    <div className="absolute inset-0 overflow-hidden bg-foreground text-background" aria-hidden="true">
      <svg preserveAspectRatio="xMidYMax slice" viewBox="0 0 1200 620" className="absolute inset-0 h-full w-full text-background">
        <defs>
          <radialGradient id={gid} cx="50%" cy="0%" r="85%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="45%" stopColor="var(--color-foreground)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-background)" stopOpacity="0" />
          </radialGradient>
          <filter id={fid}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* house light rising from the rig */}
        <rect x="0" y="0" width="1200" height="620" fill={`url(#${gid})`} />

        {/* spotlight cones - layered depth */}
        <g opacity="0.5">
          <polygon points="470,0 610,0 760,420 320,420" fill="currentColor" opacity="0.07" />
          <polygon points="150,0 235,0 420,420 60,420" fill="currentColor" opacity="0.05" />
          <polygon points="965,0 1050,0 1140,420 780,420" fill="currentColor" opacity="0.05" />
        </g>

        {/* the stage - platform edge and floor perspective lines */}
        <g>
          <rect x="0" y="418" width="1200" height="4" fill="var(--color-primary)" opacity="0.65" />
          <line x1="0" y1="422" x2="1200" y2="422" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          {[-140, -60, 20, 100, 180, 260, 340, 420, 500, 580, 660, 740, 820, 900, 980, 1060, 1140, 1220, 1300, 1380].map((x, i) => (
            <line
              key={i}
              x1={600 + (x - 600) * 0.55}
              y1="422"
              x2={x}
              y2="620"
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
          ))}
          {[460, 505, 552, 620].map((y, i) => (
            <line key={i} x1="0" y1={y} x2="1200" y2={y} stroke="currentColor" strokeOpacity={0.1 - i * 0.02} strokeWidth="1" />
          ))}
        </g>

        {/* registration motifs on the backline */}
        <g stroke="var(--color-primary)" strokeOpacity="0.55" strokeWidth="1.3" fill="none">
          <g transform="translate(936 96)">
            <circle r="13" />
            <line x1="0" y1="-26" x2="0" y2="26" />
            <line x1="-26" y1="0" x2="26" y2="0" />
          </g>
          <g transform="translate(246 128)" opacity="0.7">
            <circle r="9" />
            <line x1="0" y1="-18" x2="0" y2="18" />
            <line x1="-18" y1="0" x2="18" y2="0" />
          </g>
        </g>

        {/* paper grain over the whole house */}
        <rect x="0" y="0" width="1200" height="620" filter={`url(#${fid})`} opacity="0.08" />
      </svg>

      {/* scrim - keeps the description column at AA contrast over any future photo */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(75deg, color-mix(in srgb, var(--color-foreground) 92%, transparent) 0%, color-mix(in srgb, var(--color-foreground) 55%, transparent) 48%, color-mix(in srgb, var(--color-foreground) 15%, transparent) 100%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--color-foreground) 90%, transparent), transparent)' }} />
    </div>
  )
}