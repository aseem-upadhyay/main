import { useEffect, useState } from "react";

const GEAR_COUNT = 6;

function Gear({
  size,
  x,
  y,
  speed,
  teeth,
  reverse = false,
}: {
  size: number;
  x: number;
  y: number;
  speed: number;
  teeth: number;
  reverse?: boolean;
}) {
  const r = size / 2;
  const innerR = r * 0.6;
  const toothH = r * 0.25;
  const toothW = (2 * Math.PI * r) / (teeth * 2.5);

  const toothPath = Array.from({ length: teeth }, (_, i) => {
    const angle = (i / teeth) * 2 * Math.PI;
    const a1 = angle - toothW / r / 2;
    const a2 = angle + toothW / r / 2;
    const outerR = r + toothH;
    return [
      `L ${r + innerR * Math.cos(a1)} ${r + innerR * Math.sin(a1)}`,
      `L ${r + outerR * Math.cos(a1)} ${r + outerR * Math.sin(a1)}`,
      `L ${r + outerR * Math.cos(a2)} ${r + outerR * Math.sin(a2)}`,
      `L ${r + innerR * Math.cos(a2)} ${r + innerR * Math.sin(a2)}`,
    ].join(" ");
  }).join(" ");

  const d = `M ${r + innerR} ${r} ${toothPath} Z`;

  return (
    <g style={{ transform: `translate(${x}px, ${y}px)` }}>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={reverse ? `0 ${r} ${r};360 ${r} ${r}` : `360 ${r} ${r};0 ${r} ${r}`}
        dur={`${speed}s`}
        repeatCount="indefinite"
        additive="sum"
      />
      <circle cx={r} cy={r} r={r} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d={d} fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={r} cy={r} r={innerR * 0.35} fill="currentColor" opacity="0.4" />
    </g>
  );
}

function FloatingParticles() {
  return (
    <svg className="particles" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 18 }, (_, i) => {
        const cx = ((i * 137.5) % 800).toFixed(1);
        const cy = ((i * 89.3) % 600).toFixed(1);
        const dur = (3 + (i % 4)).toFixed(1);
        const r = (2 + (i % 3)).toFixed(1);
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.4">
            <animate
              attributeName="cy"
              values={`${cy};${Math.max(0, parseFloat(cy) - 80)};${cy}`}
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${(i * 0.4).toFixed(1)}s`}
            />
            <animate
              attributeName="opacity"
              values="0.1;0.5;0.1"
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${(i * 0.4).toFixed(1)}s`}
            />
          </circle>
        );
      })}
    </svg>
  );
}

function ProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(38), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>Progress</span>
        <span>{width}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function UnderConstruction() {
  const gears = [
    { size: 140, x: -40, y: -40, speed: 12, teeth: 12 },
    { size: 90, x: 80, y: 30, speed: 8, teeth: 8, reverse: true },
    { size: 60, x: 155, y: 70, speed: 5, teeth: 6 },
    { size: 120, x: 560, y: -20, speed: 10, teeth: 10, reverse: true },
    { size: 80, x: 660, y: 60, speed: 7, teeth: 7 },
    { size: 50, x: 725, y: 100, speed: 4, teeth: 5, reverse: true },
  ];

  return (
    <div className="uc-root">
      <FloatingParticles />

      <svg className="gears-svg" viewBox="0 0 800 300" overflow="visible">
        {gears.map((g, i) => (
          <Gear key={i} {...g} />
        ))}
      </svg>

      <main className="uc-main">
        <div className="badge">COMING SOON</div>

        <h1 className="uc-title">
          <span className="title-line">Under</span>
          <span className="title-line accent">Construction</span>
        </h1>

        <p className="uc-sub">
          Something great is under works. Check back soon!
        </p>

        <ProgressBar />

        <div className="tools-row">
          {["Design", "Development", "Testing"].map((s) => (
            <div className="tool-chip" key={s}>{s}</div>
          ))}
        </div>
      </main>

      <style>{`
        .uc-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #09090b;
          color: #e4e4e7;
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
          position: relative;
        }

        .particles {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          color: #6366f1;
          pointer-events: none;
        }

        .gears-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 300px;
          color: #6366f1;
          pointer-events: none;
          opacity: 0.6;
        }

        .uc-main {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
          padding: 2rem;
        }

        .badge {
          background: #6366f133;
          border: 1px solid #6366f155;
          color: #818cf8;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          animation: pulse-badge 2.5s ease-in-out infinite;
        }

        @keyframes pulse-badge {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 #6366f144; }
          50% { opacity: 0.8; box-shadow: 0 0 0 8px #6366f100; }
        }

        .uc-title {
          display: flex;
          flex-direction: column;
          gap: 0.1em;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .title-line {
          display: block;
          animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .title-line:nth-child(2) { animation-delay: 0.1s; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .accent {
          background: linear-gradient(135deg, #6366f1, #a78bfa, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .uc-sub {
          color: #71717a;
          font-size: 1.1rem;
          max-width: 30ch;
          margin: 0;
          animation: slide-up 0.7s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .progress-wrap {
          width: min(360px, 90vw);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          animation: slide-up 0.7s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #52525b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .progress-track {
          height: 6px;
          background: #27272a;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          border-radius: 999px;
          transition: width 1.8s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 12px #6366f177;
        }

        .tools-row {
          display: flex;
          gap: 0.6rem;
          animation: slide-up 0.7s 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .tool-chip {
          background: #18181b;
          border: 1px solid #27272a;
          color: #a1a1aa;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          transition: border-color 0.2s, color 0.2s;
        }

        .tool-chip:hover {
          border-color: #6366f1;
          color: #818cf8;
        }
      `}</style>
    </div>
  );
}
