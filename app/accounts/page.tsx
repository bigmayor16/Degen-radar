const demoAccounts = [
  { username: '@solwhale_alerts', category: 'KOL', followers: '412K' },
  { username: '@degencaller_x', category: 'Degen Caller', followers: '88K' },
  { username: '@memepagesol', category: 'Meme Page', followers: '210K' },
];

const categoryColor: Record<string, string> = {
  KOL: 'text-kol border-kol/40',
  'Degen Caller': 'text-signal border-signal/40',
  'Meme Page': 'text-growth border-growth/40',
};

export default function AccountsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Accounts</h1>
        <button className="text-xs font-mono border border-signal/50 text-signal rounded-full px-3 py-1.5">
          + Add
        </button>
      </div>
      <div className="space-y-2.5">
        {demoAccounts.map((a) => (
          <div
            key={a.username}
            className="rounded-lg border border-line bg-panel p-3.5 flex items-center justify-between"
          >
            <div>
              <p className="font-mono text-sm">{a.username}</p>
              <p className="text-[11px] text-muted font-mono mt-0.5">
                {a.followers} followers
              </p>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-1 rounded-full border ${categoryColor[a.category]}`}
            >
              {a.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
