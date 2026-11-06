export default function ShootingStarBorder() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* trail */}
        <rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          rx="0"
          fill="none"
          stroke="#f97316"
          strokeWidth="0.4"
          strokeOpacity="0.55"
          pathLength={1}
          strokeDasharray="0.1 0.9"
          className="star-trail"
          filter="url(#starGlow)"
        />

        {/* head */}
        <rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          rx="0"
          fill="none"
          stroke="#ff9a3c"
          strokeWidth="0.7"
          pathLength={1}
          strokeDasharray="0.015 0.985"
          className="star-head"
          filter="url(#starGlow)"
        />
      </svg>
    </div>
  );
}
