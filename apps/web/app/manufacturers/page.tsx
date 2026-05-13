'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Manufacturer {
  id: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  bio: string;
  city: string;
  avatar: string;
  manufacturerProfile: {
    companyName: string;
    brandName: string;
    products: string;
    website: string;
  };
}

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/user/by-role/manufacturer').then((res) => {
      setManufacturers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = manufacturers.filter(m =>
    `${m.firstName} ${m.lastName} ${m.city} ${m.manufacturerProfile?.companyName} ${m.manufacturerProfile?.brandName}`.includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">🏭 تولیدکنندگان</h1>
        <span className="text-gray-500 text-sm">{manufacturers.length} تولیدکننده</span>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام، برند یا شهر..."
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500" />

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">تولیدکننده‌ای پیدا نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <Link key={m.id} href={`/users/${m.id}`}>
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {m.avatar ? (
                      <img src={m.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : m.firstName?.[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {m.firstName} {m.lastName}
                      {m.verificationStatus === 'verified' && (
                        <span className="text-green-600 mr-1">✓</span>
                      )}
                    </div>
                    {m.city && <div className="text-sm text-gray-500">📍 {m.city}</div>}
                  </div>
                </div>
                {m.manufacturerProfile && (
                  <div className="space-y-1">
                    {m.manufacturerProfile.brandName && (
                      <div className="text-sm font-medium text-green-700">
                        🏷️ {m.manufacturerProfile.brandName}
                      </div>
                    )}
                    {m.manufacturerProfile.companyName && (
                      <div className="text-xs text-gray-500">{m.manufacturerProfile.companyName}</div>
                    )}
                    {m.manufacturerProfile.products && (
                      <div className="text-xs text-gray-400">{m.manufacturerProfile.products}</div>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}