export default function LeafDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-2 ${className}`}>
      <div className="h-px w-16 bg-sage opacity-40" />
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M16 2 C8 2, 2 8, 2 10 C2 12, 8 18, 16 18 C24 18, 30 12, 30 10 C30 8, 24 2, 16 2Z"
          stroke="#7A9471"
          strokeWidth="1.2"
          fill="#7A9471"
          fillOpacity="0.15"
        />
        <line x1="16" y1="2" x2="16" y2="18" stroke="#7A9471" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="10" y1="7" x2="22" y2="13" stroke="#7A9471" strokeWidth="0.8" strokeOpacity="0.6" />
        <line x1="10" y1="13" x2="22" y2="7" stroke="#7A9471" strokeWidth="0.8" strokeOpacity="0.6" />
      </svg>
      <div className="h-px w-16 bg-sage opacity-40" />
    </div>
  );
}
