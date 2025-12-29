import { useMemo } from "react";

interface IdenticonProps {
  address: string;
  size?: number;
  className?: string;
}

const Identicon = ({ address, size = 32, className = "" }: IdenticonProps) => {
  const colors = useMemo(() => {
    // Generate deterministic colors from address
    const hash = address.toLowerCase().slice(2, 10);
    const hue1 = parseInt(hash.slice(0, 2), 16) % 360;
    const hue2 = (hue1 + 40) % 360;
    return [`hsl(${hue1}, 70%, 50%)`, `hsl(${hue2}, 60%, 60%)`];
  }, [address]);

  const pattern = useMemo(() => {
    const hash = address.toLowerCase().slice(2);
    const cells = [];
    for (let i = 0; i < 25; i++) {
      const char = hash.charCodeAt(i % hash.length);
      cells.push(char % 2 === 0);
    }
    return cells;
  }, [address]);

  const cellSize = size / 5;

  return (
    <div 
      className={`identicon-circle flex-shrink-0 ${className}`}
      style={{ width: size + 4, height: size + 4 }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="rounded-full overflow-hidden"
      >
        <rect width={size} height={size} fill={colors[1]} />
        {pattern.map((filled, i) => {
          if (!filled) return null;
          const x = (i % 5) * cellSize;
          const y = Math.floor(i / 5) * cellSize;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              fill={colors[0]}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Identicon;
