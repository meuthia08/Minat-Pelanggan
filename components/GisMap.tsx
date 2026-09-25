'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { kml } from '@tmcw/togeojson';
import JSZip from 'jszip';
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

    let kmlText = '';

    if (file.name.endsWith('.kmz')) {
      const zip = await JSZip.loadAsync(file);
      const kmlFile = Object.keys(zip.files).find((filename) => filename.endsWith('.kml'));
      if (kmlFile) {
        kmlText = await zip.files[kmlFile].async('string');
      }
    } else {
      kmlText = await file.text();
    }

    if (!kmlText) return;

    const dom = new DOMParser().parseFromString(kmlText, 'text/xml');
    const convertedGeoJson = kml(dom);

    const lines: any[] = [];
    convertedGeoJson.features.forEach((feature) => {
      if (feature.geometry && (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString')) {
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
          <span>Upload Pipa Jaringan (KMZ/KML)</span>
          <input type="file" accept=".kml,.kmz,.xml" onChange={handleFileUpload} className="hidden" />
        </label>
        {pipeGeoJson.length > 0 && (
          <p className="mt-1 text-[10px] text-emerald-600 font-semibold">
            ✓ Layer Pipa Dimuat ({pipeGeoJson.length} segmen)
          </p>
        )}
      </div>

      <MapContainer center={centerTangerang} zoom={13} className="w-full h-full z-0">
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          maxZoom={20}
          attribution="&copy; Google Maps Satellite"
        />

        {pipeGeoJson.map((geo, idx) => {
          if (geo.geometry.type === 'LineString') {
            const coords = geo.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
            return <Polyline key={idx} positions={coords} pathOptions={{ color: '#0284C7', weight: 4, opacity: 0.8 }} />;
          }
          return null;
        })}

        {dataPelanggan.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            icon={icons[p.status_minat] || icons.diluar_jaringan}
          >
            <Popup>
              <div className="p-1 space-y-1 text-slate-800">
                <h4 className="font-bold text-sm text-blue-900">{p.nama_pelanggan}</h4>
                <p className="text-xs text-slate-600">{p.alamat}</p>
                <div className="flex items-center gap-1 text-[11px] mt-2">
                  <span className="font-semibold">Status:</span>
                  <span
                    className="capitalize px-2 py-0.5 rounded text-white text-[10px]"
                    style={{
                      backgroundColor:
                        p.status_minat === 'minat'
                          ? '#22C55E'
                          : p.status_minat === 'pertimbangan'
                          ? '#F59E0B'
                          : p.status_minat === 'tidak_minat'
                          ? '#EF4444'
                          : '#8B5CF6',
                    }}
                  >
                    {p.status_minat.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px]">
                  <span className="font-semibold">Sales:</span> {p.sales_name}
                </p>
                <p className="text-[11px]">
                  <span className="font-semibold">Zona:</span> {p.zona_area}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
