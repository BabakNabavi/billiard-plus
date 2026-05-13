'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  bio: string;
  city: string;
  avatar: string;
  coachProfile: {
    specialty: string;
    experience: string;
    pricePerHour: string;
  };
}

const specialtyLabels: Record<string, string> = {
  snooker: 'اسنوکر',
  pocket: 'پاکت بیلیارد',
  highball: 'هی‌بال',
};

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/user/by-role/coach').then((res) => {
      setCoaches(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = coaches.filter(c =>
    `${c.firstName} ${c.lastName} ${c.city}`.includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">👨‍🏫 مربیان</h1>
        <span className="text-gray-500 text-sm">{coaches.length} مربی</span>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام یا شهر..."
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500" />

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">مربیی پیدا نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coach) => (
            <Link key={coach.id} href={`/users/${coach.id}`}>
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {coach.avatar ? (
                      <img src={coach.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : coach.firstName?.[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {coach.firstName} {coach.lastName}
                      {coach.verificationStatus === 'verified' && (
                        <span className="text-green-600 mr-1">✓</span>
                      )}
                    </div>
                    {coach.city && <div className="text-sm text-gray-500">📍 {coach.city}</div>}
                  </div>
                </div>
                {coach.coachProfile && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      {specialtyLabels[coach.coachProfile.specialty] || coach.coachProfile.specialty}
                    </span>
                    {coach.coachProfile.experience && (
                      <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {coach.coachProfile.experience} سال سابقه
                      </span>
                    )}
                    {coach.coachProfile.pricePerHour && (
                      <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        {parseInt(coach.coachProfile.pricePerHour).toLocaleString('fa-IR')} تومان/ساعت
                      </span>
                    )}
                  </div>
                )}
                {coach.bio && <p className="text-sm text-gray-600 line-clamp-2">{coach.bio}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}