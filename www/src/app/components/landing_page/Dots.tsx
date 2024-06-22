export interface DotsProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number;
  radius?: number;
  gap?: number; // Optional, default is 20
}

export function Dots({
  size = 400,
  radius = 2.5,
  gap = 20,
  ...others
}: DotsProps) {
  const numDots = Math.ceil(size / gap);

  const rects = [];
  for (let y = 0; y < numDots; y++) {
    for (let x = 0; x < numDots; x++) {
      rects.push(
        <rect
          key={`rect-${x}-${y}`}
          width="5"
          height="5"
          x={x * gap}
          y={y * gap}
          rx={radius}
        />
      );
    }
  }

  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      {...others}
    >
      {rects}
    </svg>
  );
}
