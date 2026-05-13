'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Installer {
  id: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  bio: string;
  city: string;
  avatar: string;
  installerProfile: {
    specialties: string[];
    experience: string;
    cities: string;
  };
}

export default function InstallersPage() {
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/user/by-role/installer').then((res) => {
      setInstallers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = installers.filter(i =>
    `${i.firstName} ${i.lastName} ${i.city} ${i.installerProfile?.cities}`.includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">🔧 متخصصین نصب</h1>
        <span className="text-gray-500 text-sm">{installers.length} متخصص</span>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام یا شهر..."
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500" />

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">متخصصی پیدا نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((installer) => (
            <Link key={installer.id} href={`/users/${installer.id}`}>
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {installer.avatar ? (
                      <img src={installer.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : installer.firstName?.[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {installer.firstName} {installer.lastName}
                      {installer.verificationStatus === 'verified' && (
                        <span className="text-green-600 mr-1">✓</span>
                      )}
                    </div>
                    {installer.city && <div className="text-sm text-gray-500">📍 {installer.city}</div>}
                  </div>
                </div>
                {installer.installerProfile && (
                  <div className="space-y-2">
                    {installer.installerProfile.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {installer.installerProfile.specialties.slice(0, 3).map((s: string) => (
                          <span key={s} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                    {installer.installerProfile.cities && (
                      <div className="text-xs text-gray-500">📍 {installer.installerProfile.cities}</div>
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