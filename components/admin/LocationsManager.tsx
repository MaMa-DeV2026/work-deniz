'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminGet, adminSend } from '@/lib/admin-api';

type Location = {
  id: string;
  city_fa: string;
  city_en: string;
  address_fa: string;
  address_en: string;
  phone: string;
  isActive: boolean;
  sortOrder: number;
};

type Draft = {
  address_fa: string;
  address_en: string;
  phone: string;
  isActive: boolean;
};

function LocationCard({ location, onSaved }: { location: Location; onSaved: (l: Location) => void }) {
  const [draft, setDraft] = useState<Draft>({
    address_fa: location.address_fa,
    address_en: location.address_en,
    phone: location.phone,
    isActive: location.isActive,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [field]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      const { location: updated } = await adminSend<{ location: Location }>('/api/admin/locations', 'PUT', {
        id: location.id,
        ...draft,
      });
      onSaved(updated);
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-accent/60 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-primary">{location.city_en}</h3>
          <p className="font-fa text-body-sm text-text-muted">{location.city_fa}</p>
        </div>
        <label className="flex items-center gap-2 text-body-sm text-text-dark">
          <input
            type="checkbox"
            checked={draft.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
            className="h-4 w-4 accent-[#1B3A5C]"
          />
          Active
        </label>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="Persian Address" value={draft.address_fa} onChange={(e) => set('address_fa', e.target.value)} />
        <Input label="English Address" value={draft.address_en} onChange={(e) => set('address_en', e.target.value)} />
      </div>
      <div className="mt-3">
        <Input label="Phone" value={draft.phone} onChange={(e) => set('phone', e.target.value)} />
      </div>
      {error && <p className="mt-2 text-caption text-red-500">{error}</p>}
      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default function LocationsManager() {
  const [items, setItems] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await adminGet<{ locations: Location[] }>('/api/admin/locations');
      setItems(data.locations);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleSaved(updated: Location) {
    setItems((list) => list.map((x) => (x.id === updated.id ? updated : x)));
  }

  return (
    <div>
      <h1 className="font-display text-display-md font-semibold text-primary">Manage Locations</h1>
      <p className="mt-2 text-body-sm text-text-muted">
        Toggle a city on/off and edit its address &amp; phone. Changes save individually.
      </p>

      {loading ? (
        <div className="mt-8 flex justify-center text-text-muted">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((l) => (
            <LocationCard key={l.id} location={l} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </div>
  );
}
