import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type StatusMinat = 'minat' | 'pertimbangan' | 'tidak_minat' | 'diluar_jaringan';

export interface Pelanggan {
  id: string;
  nama_pelanggan: string;
  alamat: string;
  latitude: number;
  longitude: number;
  status_minat: StatusMinat;
  sales_name: string;
  zona_area: string;
  catatan?: string;
  created_at: string;
}
