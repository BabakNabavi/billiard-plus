'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Referee {
  id: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  bio: string;
  city: string;
  avatar: string;
  refereeProfile: {
    degree: string;
    experience: string;
  };
}

const degreeLabels: Record<string, string> = {
  club: 'باشگاهی',
  provincial: 'استانی',
  national: 'ملی',
};

export default function RefereesPage() {
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/user/by-role/referee').then((res) => {
      setReferees(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = referees.filter(r =>
    `${r.firstName} ${r.lastName} ${r.city}`.includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">🏁 داوران</h1>
        <span className="text-gray-500 text-sm">{referees.length} داور</span>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام یا شهر..."
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500" />

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">داوری پیدا نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((referee) => (
            <Link key={referee.id} href={`/users/${referee.id}`}>
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {referee.avatar ? (
                      <img src={referee.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : referee.firstName?.[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {referee.firstName} {referee.lastName}
                      {referee.verificationStatus === 'verified' && (
                        <span className="text-green-600 mr-1">✓</span>
                      )}
                    </div>
                    {referee.city && <div className="text-sm text-gray-500">📍 {referee.city}</div>}
                  </div>
                </div>
                {referee.refereeProfile && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      {degreeLabels[referee.refereeProfile.degree] || referee.refereeProfile.degree}
                    </span>
                    {referee.refereeProfile.experience && (
                      <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {referee.refereeProfile.experience} سال سابقه
                      </span>
                    )}
                  </div>
                )}
                {referee.bio && <p className="text-sm text-gray-600 line-clamp-2">{referee.bio}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}