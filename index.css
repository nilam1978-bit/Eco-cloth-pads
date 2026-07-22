import React from 'react';

// WonderPads Reusables — traced pad silhouette shapes
//
// Each shape is a single SVG path on a 0-0-220-300 viewBox (matches the
// proportions traced from real patterns). The component scales height by
// lengthInches relative to each shape's natural min/max range, and applies
// the chosen fabric image as a pattern fill so the preview actually shows
// the customer's selected print.

export interface ShapeDefinition {
  name: string;
  minLength: number;
  maxLength: number;
  viewBox: string;
  path: string;
  snaps: Array<{ cx: number; cy: number }>;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const SHAPES: Record<string, ShapeDefinition> = {
  staple: {
    name: 'Staple',
    minLength: 7,
    maxLength: 18,
    viewBox: '0 0 680 460',
    xMin: 220,
    xMax: 460,
    yMin: 65,
    yMax: 365,
    path: `
      M 340 65
      C 372 65, 396 84, 400 110
      L 400 165
      L 460 185
      L 460 225
      L 400 245
      L 400 320
      C 396 346, 372 365, 340 365
      C 308 365, 284 346, 280 320
      L 280 245
      L 220 225
      L 220 185
      L 280 165
      L 280 110
      C 284 84, 308 65, 340 65
      Z
    `,
    snaps: [
      { cx: 228, cy: 205 },
      { cx: 452, cy: 205 },
    ],
  },

  moon_rise: {
    name: 'Moon Rise',
    minLength: 6,
    maxLength: 18,
    viewBox: '0 0 680 460',
    xMin: 220,
    xMax: 460,
    yMin: 60,
    yMax: 340,
    path: `
      M 340 60
      C 386 60, 415 92, 415 130
      C 415 150, 408 165, 398 175
      L 398 178
      L 460 178
      L 460 222
      L 398 222
      L 398 225
      C 408 235, 415 250, 415 270
      C 415 308, 386 340, 340 340
      C 294 340, 265 308, 265 270
      C 265 250, 272 235, 282 225
      L 282 222
      L 220 222
      L 220 178
      L 282 178
      L 282 175
      C 272 165, 265 150, 265 130
      C 265 92, 294 60, 340 60
      Z
    `,
    snaps: [
      { cx: 230, cy: 200 },
      { cx: 450, cy: 200 },
    ],
  },

  sunglow: {
    name: 'Sunglow',
    minLength: 6,
    maxLength: 20,
    viewBox: '0 0 680 420',
    xMin: 210,
    xMax: 470,
    yMin: 58,
    yMax: 402,
    path: `
      M 340 58
      C 388 58, 418 90, 418 128
      C 418 145, 412 158, 404 168
      L 408 173
      L 470 230
      L 408 287
      L 404 292
      C 412 302, 418 315, 418 332
      C 418 372, 388 402, 340 402
      C 292 402, 262 372, 262 332
      C 262 315, 268 302, 276 292
      L 272 287
      L 210 230
      L 272 173
      L 276 168
      C 268 158, 262 145, 262 128
      C 262 90, 292 58, 340 58
      Z
    `,
    snaps: [
      { cx: 240, cy: 230 },
      { cx: 440, cy: 230 },
    ],
  },

  mega_pad: {
    name: 'Mega Pad',
    minLength: 12,
    maxLength: 20,
    viewBox: '0 0 680 540',
    xMin: 255,
    xMax: 425,
    yMin: 58,
    yMax: 490,
    path: `
      M 340 58
      C 310 58, 278 88, 272 130
      C 266 172, 282 220, 315 248
      L 310 252
      L 255 265
      L 255 283
      L 310 296
      L 315 300
      C 282 328, 266 376, 272 418
      C 278 460, 310 490, 340 490
      C 370 490, 402 460, 408 418
      C 414 376, 398 328, 365 300
      L 370 296
      L 425 283
      L 425 265
      L 370 252
      L 365 248
      C 398 220, 414 172, 408 130
      C 402 88, 370 58, 340 58
      Z
    `,
    snaps: [
      { cx: 263, cy: 274 },
      { cx: 417, cy: 274 },
    ],
  },
};

export interface PadShapeProps {
  shapeId?: string;
  lengthInches?: number;
  fabricImageUrl?: string | null;
  backingColor?: string;
  showSnaps?: boolean;
  width?: number;
  fitCanvas?: boolean;
  sizeId?: string; // category key (liner, light, moderate, heavy, extra_long)
}

export interface CategoryConfig {
  id: string;
  name: string;
  minLength: number;
  maxLength: number;
  widthScale: number;
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  liner: { id: 'liner', name: 'Liner', minLength: 6, maxLength: 9, widthScale: 0.65 },
  light: { id: 'light', name: 'Light', minLength: 8, maxLength: 12, widthScale: 0.74 },
  moderate: { id: 'moderate', name: 'Moderate', minLength: 10, maxLength: 14, widthScale: 0.83 },
  heavy: { id: 'heavy', name: 'Heavy', minLength: 10, maxLength: 14, widthScale: 0.90 },
  extra_long: { id: 'extra_long', name: 'Extra Long', minLength: 15, maxLength: 20, widthScale: 1.05 }
};

export function PadShape({
  shapeId = 'moon_rise',
  lengthInches,
  fabricImageUrl,
  backingColor = '#ece2cc',
  showSnaps = true,
  width = 180,
  fitCanvas = false,
  sizeId,
}: PadShapeProps) {
  const shape = SHAPES[shapeId] || SHAPES.moon_rise;
  const len = lengthInches ?? shape.minLength;

  // Determine category
  let category = CATEGORIES[sizeId || ''];
  if (!category) {
    if (len <= 9) category = CATEGORIES.liner;
    else if (len <= 12) category = CATEGORIES.light;
    else if (len <= 14) {
      category = shapeId === 'mega_pad' ? CATEGORIES.extra_long : CATEGORIES.moderate;
    } else {
      category = CATEGORIES.extra_long;
    }
  }

  // Consistent Silhouette Scaling: Keep width scale constant within each category
  const widthScale = category.widthScale;
  
  // Height scale is linear with respect to selected length in inches (10" = scale 1.0)
  const heightScale = len / 10;

  // Maximum height scale for this category (used to define the fixed bounds of the canvas)
  const maxHeightScale = category.maxLength / 10;

  const [, , vbW, vbH] = shape.viewBox.split(' ').map(Number);

  // Calculate dynamic but FIXED bounds based on the MAX length of this category
  const xMinScaled = (shape.xMin - vbW / 2) * widthScale + vbW / 2;
  const xMaxScaled = (shape.xMax - vbW / 2) * widthScale + vbW / 2;
  const yMinScaledMax = (shape.yMin - vbH / 2) * maxHeightScale + vbH / 2;
  const yMaxScaledMax = (shape.yMax - vbH / 2) * maxHeightScale + vbH / 2;

  const padWidth = xMaxScaled - xMinScaled;
  const maxPadHeight = yMaxScaledMax - yMinScaledMax;

  // Set the viewBox height so the MAX pad height occupies exactly 78% of the canvas (gives more vertical breathing room to prevent cutting off the top)
  const tightVbH = maxPadHeight / 0.78;

  // Set the viewBox width so the pad width occupies exactly 72% of the canvas (gives 14% margin each side)
  const tightVbW = padWidth / 0.72;

  // Center of the pad at maximum dimensions
  const xCenterScaledMax = (xMinScaled + xMaxScaled) / 2;
  const yCenterScaledMax = (yMinScaledMax + yMaxScaledMax) / 2;

  // Center the viewBox around the actual scaled center of the pad
  const tightVbX = xCenterScaledMax - (tightVbW / 2);
  const tightVbY = yCenterScaledMax - (tightVbH / 2);

  const dynamicViewBox = `${tightVbX} ${tightVbY} ${tightVbW} ${tightVbH}`;
  const patternId = `fabric-${shapeId}-${Math.round(len * 10)}-${Math.random().toString(36).substr(2, 5)}`;

  // Side Ruler layout: faint tick marks on the left
  const rulerX = xCenterScaledMax - (padWidth / 2) - 16;
  const ticks: React.ReactNode[] = [];
  
  if (fitCanvas) {
    for (let L = category.minLength; L <= category.maxLength; L++) {
      const yTopL = (shape.yMin - vbH / 2) * (L / 10) + vbH / 2;
      const yBottomL = (shape.yMax - vbH / 2) * (L / 10) + vbH / 2;
      
      const isCurrent = L === len;
      const opacityVal = isCurrent ? 0.22 : 0.07;
      const textWeight = isCurrent ? 'bold' : 'normal';

      ticks.push(
        <g key={`ruler-${L}`} className="transition-opacity duration-300">
          {/* Top Tick */}
          <line
            x1={rulerX}
            y1={yTopL}
            x2={rulerX + 5}
            y2={yTopL}
            stroke="#8A5A87"
            strokeWidth={isCurrent ? "1.5" : "1"}
            opacity={opacityVal}
          />
          {/* Bottom Tick */}
          <line
            x1={rulerX}
            y1={yBottomL}
            x2={rulerX + 5}
            y2={yBottomL}
            stroke="#8A5A87"
            strokeWidth={isCurrent ? "1.5" : "1"}
            opacity={opacityVal}
          />
          {/* Text label next to top tick */}
          <text
            x={rulerX - 5}
            y={yTopL + 3}
            fill="#8A5A87"
            fontSize="8px"
            fontWeight={textWeight}
            textAnchor="end"
            fontFamily="monospace"
            opacity={opacityVal + 0.05}
          >
            {L}"
          </text>
        </g>
      );
    }
  }

  return (
    <svg
      width={fitCanvas ? "100%" : width}
      height={fitCanvas ? "100%" : width * (vbH / vbW) * heightScale}
      viewBox={fitCanvas ? dynamicViewBox : shape.viewBox}
      role="img"
      aria-label={`${shape.name} pad shape preview, ${len} inches`}
      className="transition-all duration-300 ease-out drop-shadow-sm filter"
      style={fitCanvas ? { maxWidth: '100%', maxHeight: '100%' } : undefined}
    >
      <defs>
        {fabricImageUrl ? (
          <pattern
            id={patternId}
            patternUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <image
              href={fabricImageUrl}
              x="0"
              y="0"
              width={vbW}
              height={vbH}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        ) : null}
      </defs>

      {/* BACKGROUND: Faint vertical dashed center line guide */}
      {fitCanvas && (
        <line
          x1={vbW / 2}
          y1={tightVbY + 8}
          x2={vbW / 2}
          y2={tightVbY + tightVbH - 8}
          stroke="#8A5A87"
          strokeDasharray="4,4"
          strokeWidth="1.2"
          opacity="0.08"
        />
      )}

      {/* BACKGROUND: Side Ruler Tick marks */}
      {ticks}

      {/* Group to scale the pad paths from the center of the viewBox */}
      <g transform={`translate(${vbW / 2}, ${vbH / 2}) scale(${widthScale}, ${heightScale}) translate(${-vbW / 2}, ${-vbH / 2})`}>
        {/* Ambient shadow back outline */}
        <path
          d={shape.path}
          fill="rgba(0,0,0,0.03)"
          transform="translate(2, 4)"
        />

        <path
          d={shape.path}
          fill={fabricImageUrl ? `url(#${patternId})` : backingColor}
          stroke="#8b3a52"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Render snaps at dynamically calculated coordinates so they scale positions but remain perfect circles */}
      {showSnaps &&
        shape.snaps.map((s, i) => {
          const cxScaled = (s.cx - vbW / 2) * widthScale + vbW / 2;
          const cyScaled = (s.cy - vbH / 2) * heightScale + vbH / 2;
          return (
            <g key={i} className="transition-opacity duration-350">
              {/* Outer snap rim */}
              <circle
                cx={cxScaled}
                cy={cyScaled}
                r="7"
                fill="#FAF7FB"
                stroke="#8B7080"
                strokeWidth="1.2"
                opacity="0.9"
              />
              {/* Inner snap core */}
              <circle
                cx={cxScaled}
                cy={cyScaled}
                r="3.5"
                fill="#8B7080"
                opacity="0.95"
              />
            </g>
          );
        })}
    </svg>
  );
}
