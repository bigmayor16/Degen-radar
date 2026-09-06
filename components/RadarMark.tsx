export default function RadarMark({ size = 24 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex rounded-full border border-signal/50"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full border border-line" />
      <span
        className="absolute inset-0 origin-center animate-sweep"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(255,176,32,0.55), transparent 35%)',
          borderRadius: '9999px',
        }}
      />
      <span className="absolute inset-[38%] rounded-full bg-signal" />
    </span>
  );
}
