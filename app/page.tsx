'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase, Pelanggan } from '@/lib/supabase';
import Scorecards from '@/components/Scorecards';
import { Filter } from 'lucide-react';

const GisMap = dynamic(() => import('@/components/GisMap'), { ssr: false });

export default function DashboardPage() {
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [selectedZona, setSelectedZona] = useState<string>('ALL');
  const [selectedSales, setSelectedSales] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPelanggan();
  }, []);

  const fetchPelanggan = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pelanggan').select('*');
    if (!error && data) {
      setPelanggan(data);
    }
    setLoading(false);
  };

  const zonaList = Array.from(new Set(pelanggan.map((p) => p.zona_area)));
  const salesList = Array.from(new Set(pelanggan.map((p) => p.sales_name)));

  const filteredData = pelanggan.filter((p) => {
    const matchZona = selectedZona === 'ALL' || p.zona_area === selectedZona;
    const matchSales = selectedSales === 'ALL' || p.sales_name === selectedSales;
    return matchZona && matchSales;
  });

  const salesPerformance = salesList.map((sales) => {
    const items = filteredData.filter((p) => p.sales_name === sales);
    return {
      sales,
      total: items.length,
      minat: items.filter((p) => p.status_minat === 'minat').length,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard GIS Pemetaan Pelanggan PAM</h1>
          <p className="text-sm text-slate-500">AETRA Tangerang - Potensi Sambungan Baru</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedZona}
              onChange={(e) => setSelectedZona(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Zona</option>
              {zonaList.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
            <select
              value={selectedSales}
              onChange={(e) => setSelectedSales(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Sales</option>
              {salesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Scorecards data={filteredData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="w-full h-[550px] bg-white rounded-xl flex items-center justify-center border border-slate-200">
              <p className="text-sm text-slate-400">Memuat data peta...</p>
            </div>
          ) : (
            <GisMap dataPelanggan={filteredData} />
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Akumulasi Minat per Sales</h3>
            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-2">
              {salesPerformance.map((sp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-700">{sp.sales}</p>
                    <p className="text-[10px] text-slate-400">{sp.total} Total Kunjungan</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600">{sp.minat} Minat</span>
                    <p className="text-[10px] text-slate-400">
                      {sp.total > 0 ? ((sp.minat / sp.total) * 100).toFixed(0) : 0}% Konversi
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
