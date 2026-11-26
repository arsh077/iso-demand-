import React, { useId } from 'react';

interface RibbonProps {
  shortName: string;
}

export const LeftBlueRibbon: React.FC<RibbonProps> = ({ shortName }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `ribbon-grad-${uid}`;
  const patternId = `ribbon-pattern-${uid}`;
  const clipId = `ribbon-clip-${uid}`;
  const label = (shortName || 'QRO').trim().slice(0, 6).toUpperCase();

  return (
    <svg
      viewBox="0 0 240 1123"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-y-0 left-0 h-full w-[240px]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B75CE" />
          <stop offset="50%" stopColor="#1260B0" />
          <stop offset="100%" stopColor="#1A71C7" />
        </linearGradient>

        {/* Tiled mini QRO emblem pattern matching reference left ribbon */}
        <pattern
          id={patternId}
          width="54"
          height="36"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-12)"
        >
          <g opacity="0.26">
            <circle
              cx="14"
              cy="17"
              r="9.5"
              stroke="#FFFFFF"
              strokeWidth="2.1"
              fill="none"
            />
            <path
              d="M9 17.5 L12.8 21 L22 11.5"
              stroke="#FFFFFF"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M9 24.5 Q18 28 28 24.5"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            <text
              x="25"
              y="20.5"
              fill="#FFFFFF"
              fontSize="7.8"
              fontWeight="800"
              fontFamily="Plus Jakarta Sans, sans-serif"
              letterSpacing="0.3"
            >
              {label}
            </text>
          </g>
        </pattern>

        <clipPath id={clipId}>
          <path d="M 0,0 L 210,0 C 160,128 52,320 54,545 C 56,775 74,960 86,1123 L 0,1123 Z" />
        </clipPath>
      </defs>

      {/* Soft light-blue outer wave shadow strip */}
      <path
        d="M 210,0 C 160,128 52,320 54,545 C 56,775 74,960 86,1123 L 96,1123 C 84,960 66,775 64,545 C 62,320 170,128 220,0 Z"
        fill="#DCE9F6"
        opacity="0.7"
      />

      {/* Main blue ribbon fill */}
      <path
        d="M 0,0 L 210,0 C 160,128 52,320 54,545 C 56,775 74,960 86,1123 L 0,1123 Z"
        fill={`url(#${gradId})`}
      />

      {/* Tiled QRO watermark inside clipped ribbon */}
      <rect
        x="0"
        y="0"
        width="240"
        height="1123"
        fill={`url(#${patternId})`}
        clipPath={`url(#${clipId})`}
      />

      {/* Crisp white inner curve highlight */}
      <path
        d="M 206,0 C 156,128 48,320 50,545 C 52,775 70,960 82,1123"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        opacity="0.55"
        fill="none"
      />
    </svg>
  );
};

interface BrandLogoProps {
  shortName: string;
  fullName: string;
  className?: string;
}

export const QroBrandLogo: React.FC<BrandLogoProps> = ({
  shortName,
  fullName,
  className = 'w-[248px] h-auto',
}) => {
  const uid = useId().replace(/:/g, '');
  const arcId = `qro-arc-${uid}`;
  const shortText = (shortName || 'QRO').trim();
  const fullText = (fullName || 'QUALITY RESEARCH ORGANIZATION').trim().toUpperCase();

  return (
    <svg
      viewBox="0 0 280 124"
      className={className}
      role="img"
      aria-label={`${shortText} — ${fullText}`}
    >
      <defs>
        <path id={arcId} d="M 8,92 Q 140,130 272,92" fill="none" />
      </defs>

      {/* Blue circular C/Q swoosh */}
      <path
        d="M 118,54 C 114,72 98,84 79,84 C 57,84 39,66 39,44 C 39,22 57,4 79,4 C 95,4 109,13 115,27 L 101,33 C 97,23 89,17 79,17 C 64,17 52,29 52,44 C 52,59 64,71 79,71 C 92,71 102,63 105,51 L 118,54 Z"
        fill="#1365B8"
      />
      {/* Bottom sweeping wave swoosh under QRO */}
      <path
        d="M 55,74 C 82,84 115,82 145,70 C 180,57 212,68 238,83 C 204,76 177,67 146,79 C 115,91 79,90 55,74 Z"
        fill="#1365B8"
      />
      {/* Red Checkmark */}
      <path
        d="M 60,41 L 76,56 L 122,8 L 127,13 L 76,68 L 54,46 Z"
        fill="#E01E2B"
      />

      {/* Short Certification Body Name (e.g. QRO) */}
      <text
        x="126"
        y="61"
        fill="#111111"
        fontSize={shortText.length > 4 ? '36' : '46'}
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="-1"
      >
        {shortText}
      </text>
      <text
        x={shortText.length > 4 ? '248' : '232'}
        y="32"
        fill="#111111"
        fontSize="14"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        ®
      </text>

      {/* Curved Full Name along bottom arc */}
      <text
        fill="#111111"
        fontSize={fullText.length > 32 ? '8.8' : '10.2'}
        fontWeight="600"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="0.35"
      >
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
          {fullText}
        </textPath>
      </text>
    </svg>
  );
};

export const CenterWatermark: React.FC<{ shortName: string }> = ({
  shortName,
}) => {
  const shortText = (shortName || 'QRO').trim();
  return (
    <svg
      viewBox="0 0 360 150"
      className="pointer-events-none w-[470px] opacity-[0.065]"
      aria-hidden="true"
    >
      <path
        d="M 135,78 C 129,106 104,126 75,126 C 41,126 14,99 14,65 C 14,31 41,4 75,4 C 100,4 122,19 131,41 L 111,49 C 105,34 91,23 75,23 C 52,23 34,42 34,65 C 34,88 52,107 75,107 C 95,107 111,93 115,74 L 135,78 Z"
        fill="#1365B8"
      />
      <path
        d="M 46,112 C 88,128 140,124 185,106 C 238,85 288,104 328,126 C 276,115 234,102 186,120 C 138,138 82,136 46,112 Z"
        fill="#1365B8"
      />
      <path
        d="M 48,60 L 72,84 L 144,10 L 152,18 L 72,102 L 38,68 Z"
        fill="#1365B8"
      />
      <text
        x="148"
        y="92"
        fill="#1365B8"
        fontSize={shortText.length > 4 ? '54' : '68'}
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {shortText}
      </text>
    </svg>
  );
};

export const EgacAccreditationMark: React.FC<{ cabNumber?: string }> = ({
  cabNumber,
}) => {
  const trimmedCab = cabNumber?.trim() ?? '';
  const usesBakedCab = trimmedCab === 'CAB # 011905';

  if (usesBakedCab) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <img
          src="/assets/aistudio/EGAC_Accreditation_Logo_with_Golden_Peaks_ded373d9.png"
          alt="EGAC Accreditation Mark — CAB # 011905"
          referrerPolicy="no-referrer"
          className="w-[114px] h-[92px] object-contain mix-blend-multiply brightness-105 contrast-105"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-[114px] h-[74px] overflow-hidden">
        <img
          src="/assets/aistudio/EGAC_Accreditation_Logo_with_Golden_Peaks_ded373d9.png"
          alt="EGAC Accreditation Mark"
          referrerPolicy="no-referrer"
          className="w-[114px] h-[92px] max-w-none object-contain object-top mix-blend-multiply brightness-105 contrast-105"
        />
      </div>
      {trimmedCab ? (
        <div className="mt-0.5 text-[10.5px] font-semibold tracking-tight text-slate-900 tabular-nums">
          {trimmedCab}
        </div>
      ) : null}
    </div>
  );
};

export const IafMlaBadge: React.FC = () => {
  const uid = useId().replace(/:/g, '');
  const topArc = `iaf-top-${uid}`;
  const botArc = `iaf-bot-${uid}`;

  return (
    <svg
      viewBox="0 0 144 104"
      className="w-[124px] h-[88px]"
      role="img"
      aria-label="IAF Member of Multilateral Recognition Arrangement"
    >
      <defs>
        <path id={topArc} d="M 21,50 A 51,36 0 1,1 123,50" fill="none" />
        <path id={botArc} d="M 20,56 A 52,36 0 0,0 124,56" fill="none" />
      </defs>

      {/* Outer oval border */}
      <ellipse
        cx="72"
        cy="52"
        rx="66"
        ry="46"
        fill="#FFFFFF"
        stroke="#0B5EA8"
        strokeWidth="3.2"
      />
      <ellipse
        cx="72"
        cy="52"
        rx="44"
        ry="28"
        fill="#0B5EA8"
      />

      {/* Globe meridian/latitude lines */}
      <ellipse
        cx="72"
        cy="52"
        rx="28"
        ry="28"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.55"
      />
      <ellipse
        cx="72"
        cy="52"
        rx="13"
        ry="28"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.55"
      />
      <line
        x1="30"
        y1="40"
        x2="114"
        y2="40"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="30"
        y1="64"
        x2="114"
        y2="64"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Center IAF typography */}
      <text
        x="72"
        y="61"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="26"
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="2"
      >
        IAF
      </text>

      {/* Top & bottom curved text */}
      <text
        fill="#0B5EA8"
        fontSize="7.4"
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="0.25"
      >
        <textPath href={`#${topArc}`} startOffset="50%" textAnchor="middle">
          MEMBER OF MULTILATERAL
        </textPath>
      </text>
      <text
        fill="#0B5EA8"
        fontSize="7.0"
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="0.15"
      >
        <textPath href={`#${botArc}`} startOffset="50%" textAnchor="middle">
          RECOGNITION ARRANGEMENT
        </textPath>
      </text>
    </svg>
  );
};

export const HeadSignatureSvg: React.FC = () => (
  <svg
    viewBox="0 0 180 56"
    className="w-[138px] h-[44px]"
    aria-hidden="true"
  >
    <path
      d="M 18,40 C 12,24 30,8 40,14 C 48,19 36,38 22,42 C 16,44 26,44 40,38 C 48,34 55,20 58,13 C 54,28 50,41 56,41 C 61,41 68,28 73,27 C 77,26 73,37 78,37 C 83,37 88,28 93,28 C 98,28 96,36 102,35 C 109,34 116,22 120,16 C 117,28 112,48 109,52 C 114,42 124,25 133,24 C 139,23 134,35 142,32 C 150,29 162,21 172,18"
      fill="none"
      stroke="#1D4E9E"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="47" cy="39" r="1.4" fill="#1D4E9E" />
  </svg>
);
