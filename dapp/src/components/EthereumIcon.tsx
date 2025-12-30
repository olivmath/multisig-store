interface EthereumIconProps {
  className?: string;
  size?: number;
}

export function EthereumIcon({ className = "w-5 h-5", size }: EthereumIconProps) {
  const sizeClass = size ? `w-${size} h-${size}` : className;

  return (
    <svg
      className={sizeClass}
      viewBox="0 0 256 417"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillOpacity="0.6"
        d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
      />
      <path
        d="M127.962 0L0 212.32l127.962 75.639V154.158z"
      />
      <path
        fillOpacity="0.6"
        d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601L256 236.587z"
      />
      <path
        d="M127.962 416.905v-104.72L0 236.585z"
      />
      <path
        fillOpacity="0.2"
        d="M127.961 287.958l127.96-75.637-127.96-58.162z"
      />
      <path
        fillOpacity="0.6"
        d="M0 212.32l127.96 75.638v-133.8z"
      />
    </svg>
  );
}
