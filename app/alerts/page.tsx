'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type AlertRow = {
  id: string;
  alert_type: string;
  sent_at: string;
};

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('alerts')
      .select('id, alert_type, sent_at')
      .order('sent_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setAlerts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Alerts</h1>

      {loading ? (
        <p className="text-sm text-muted font-mono py-10 text-center">Loading...</p>
      ) : alerts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-muted font-mono mb-2">No alerts sent yet.</p>
          <p className="text-[11px] text-muted font-mono">
            Connect Telegram in Settings and tokens above your momentum threshold
            will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="rounded-lg border border-line bg-panel p-3.5 flex items-center justify-between"
            >
              <p className="font-mono text-sm">{a.alert_type}</p>
              <span className="text-[11px] text-muted font-mono shrink-0 ml-2">
                {timeAgo(a.sent_at)}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted font-mono mt-4">
        Connect Telegram in Settings to get these pushed to your phone.
      </p>
    </div>
  );
}
