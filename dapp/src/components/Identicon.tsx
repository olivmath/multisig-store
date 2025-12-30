import { useMemo } from "react";

interface IdenticonProps {
  address: string;
  size?: number;
  className?: string;
}

const Identicon = ({ address, size = 32, className = "" }: IdenticonProps) => {
  const { gradient } = useMemo(() => {
    // Generate deterministic colors from address
    const hash = address.toLowerCase().slice(2);

    // Generate hue from first part of address
    const hue1 = parseInt(hash.slice(0, 2), 16) % 360;
    const hue2 = (hue1 + 60) % 360;
    const hue3 = (hue1 + 120) % 360;

    // Generate rotation angle
    const rotation = parseInt(hash.slice(2, 4), 16) % 360;

    // Create gradient stops with gold/black theme
    const color1 = `hsl(${hue1}, 75%, 55%)`;
    const color2 = `hsl(${hue2}, 70%, 45%)`;
    const color3 = `hsl(${hue3}, 65%, 40%)`;

    return {
      gradient: `linear-gradient(${rotation}deg, ${color1}, ${color2}, ${color3})`,
      rotation
    };
  }, [address]);

  return (
    <div
      className={`flex-shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    />
  );
};

export default Identicon;
