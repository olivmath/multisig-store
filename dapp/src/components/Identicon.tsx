import { useEffect, useRef, useState } from "react";
import { toSvg } from "jdenticon";
import { Check } from "lucide-react";

interface IdenticonProps {
  address: string;
  size?: number;
  className?: string;
  copyable?: boolean;
}

const Identicon = ({ address, size = 32, className = "", copyable = false }: IdenticonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async (e: React.MouseEvent) => {
    if (!copyable) return;
    e.stopPropagation();
    e.preventDefault();
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (copyable) {
    return (
      <button
        onClick={handleCopy}
        className={`flex-shrink-0 rounded-full overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all ${className}`}
        style={{
          width: size,
          height: size,
        }}
        title={`Copy: ${address}`}
      >
        <div ref={containerRef} className="w-full h-full" />
        {copied && (
          <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-full">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </button>
    );
  }

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
