'use client';

import { Users, CheckCircle, HelpCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Pelanggan } from '@/lib/supabase';

interface ScorecardsProps {
  data: Pelanggan[];
}

export default function Scorecards({ data }: ScorecardsProps) {
  const total = data.length;
  const minat = data.filter((d) => d.status_minat === 'minat').length;
  const pertimbangan = data.filter((d) => d.status_minat === 'pertimbangan').length;
  const tidakMinat = data.filter((d) => d.status_minat === 'tidak_minat').length;
  const diluarJaringan = data.filter((d) => d.status_minat === 'diluar_jaringan').length;

  const cards = [
    { label: 'Total Spreading', count: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Minat', count: minat, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pertimbangan', count: pertimbangan, icon: HelpCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Tidak Minat', count: tidakMinat, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Di Luar Jaringan', count: diluarJaringan, icon: AlertTriangle, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((c, idx) => {
        const IconComponent = c.icon;
        return (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${c.bg} ${c.color}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
              <h3 className={`text-xl font-bold ${c.color}`}>{c.count}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
