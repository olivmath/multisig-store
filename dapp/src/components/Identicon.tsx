import { useEffect, useRef } from "react";
import { toSvg } from "jdenticon";

interface IdenticonProps {
  address: string;
  size?: number;
  className?: string;
}

const Identicon = ({ address, size = 32, className = "" }: IdenticonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && address) {
      const svg = toSvg(address, size, {
        lightness: {
          color: [0.35, 0.65],
          grayscale: [0.25, 0.75],
        },
        saturation: {
          color: 0.6,
          grayscale: 0.0,
        },
        backColor: "transparent",
      });
      containerRef.current.innerHTML = svg;
    }
  }, [address, size]);

  return (
    <div
      ref={containerRef}
      className={`flex-shrink-0 rounded-full overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default Identicon;
