'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { kml } from '@tmcw/togeojson';
import { Pelanggan } from '@/lib/supabase';
import { Upload } from 'lucide-react';

const createCustomIcon = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="30" height="30" stroke="#ffffff" stroke-width="1.5"><path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>`;
  return L.divIcon({
    className: 'custom-icon',
    html: svg,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const icons = {
  minat: createCustomIcon('#22C55E'),
  pertimbangan: createCustomIcon('#F59E0B'),
  tidak_minat: createCustomIcon('#EF4444'),
  diluar_jaringan: createCustomIcon('#8B5CF6'),
};

interface GisMapProps {
  dataPelanggan: Pelanggan[];
}

export default function GisMap({ dataPelanggan }: GisMapProps) {
  const [pipeGeoJson, setPipeGeoJson] = useState<any[]>([]);
  const centerTangerang: [number, number] = [-6.178306, 106.631889];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const dom = new DOMParser().parseFromString(text, 'text/xml');
    const convertedGeoJson = kml(dom);

    const lines: any[] = [];
    convertedGeoJson.features.forEach((feature) => {
      if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
        lines.push(feature);
      }
    });

    setPipeGeoJson(lines);
  };

  return (
    <div className="relative w-full h-[550px] rounded-xl overflow-hidden shadow-sm border border-slate-200">
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-md border border-slate-200 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
          <Upload className="w-4 h-4 text-blue-600" />
          <span>Upload Pipa Jaringan (KML)</span>
          <input type="file" accept=".kml,.xml" onChange={handleFileUpload} className="hidden" />
        </label>
        {pipeGeoJson.length > 0 && (
          <p className="mt-1 text-[10px] text-emerald-600 font-semibold">
            ✓ Layer Pipa Dimuat ({pipeGeoJson.length} segmen)
          </p>
        )}
      </div>

      <MapContainer center={centerTangerang} zoom={13} className="w-full h-full z-0">Tentu! Agar kode yang dibuat sesuai dengan kebutuhan, silakan jelaskan detail berikut:

1. **Tujuan/Fungsi:** Program atau fitur apa yang ingin dibuat? (misal: *web scraping*, sistem login, kalkulasi data, visualisasi, dll.)
2. **Bahasa Pemrograman / Framework:** Bahasa apa yang ingin digunakan? (misal: Python, JavaScript, PHP, C++, React, dll.)
3. **Detail Khusus (opsional):** Apakah ada library khusus, format input/output, atau spesifikasi sistem yang perlu disesuaikan?

Setelah Anda memberikan gambaran singkatnya, saya akan langsung buatkan kodenya secara lengkap dan siap dijalankan.
