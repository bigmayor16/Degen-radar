const demoAlerts = [
  { ticker: '$FROGE', type: 'Momentum > 80', time: '2m ago' },
  { ticker: '$NUKEDOG', type: 'Rapid mention acceleration', time: '19m ago' },
  { ticker: '$SOLKITTY', type: 'New CA detected', time: '41m ago' },
];

export default function AlertsPage() {
  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Alerts</h1>
      <div className="space-y-2.5">
        {demoAlerts.map((a, i) => (
          <div
            key={i}
            className="rounded-lg border border-line bg-panel p-3.5 flex items-center justify-between"
          >
            <div>
              <p className="font-mono text-sm">{a.ticker}</p>
              <p className="text-[11px] text-muted font-mono mt-0.5">{a.type}</p>
            </div>
            <span className="text-[11px] text-muted font-mono">{a.time}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted font-mono mt-4">
        Connect Telegram in Settings to get these pushed to your phone.
      </p>
    </div>
  );
}
