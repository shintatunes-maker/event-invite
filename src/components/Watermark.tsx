export default function Watermark() {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <span className="inline-flex items-center gap-1 rounded-full bg-black/70 text-white text-xs px-3 py-1.5 backdrop-blur">
        🎉 Powered by <span className="font-bold">イベント招待</span>
      </span>
    </div>
  );
}
