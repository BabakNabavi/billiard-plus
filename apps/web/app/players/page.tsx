'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  primaryRole: string;
  verificationStatus: string;
  bio: string;
  city: string;
  avatar: string;
  playerProfile: {
    level: string;
    specialty: string;
    experience: string;
    achievements: string;
  };
}

const levelLabels: Record<string, string> = {
  league1: 'لیگ یک',
  premier: 'دسته برتر',
  national: 'تیم ملی',
  world_pro: 'World Professional',
};

const specialtyLabels: Record<string, string> = {
  snooker: 'اسنوکر',
  pocket: 'پاکت بیلیارد',
  highball: 'هی‌بال',
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/user/by-role/player').then((res) => {
      setPlayers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = players.filter(p =>
    `${p.firstName} ${p.lastName} ${p.city}`.includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">🎱 بازیکنان</h1>
        <span className="text-gray-500 text-sm">{players.length} بازیکن</span>
      </div>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام یا شهر..."
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">بازیکنی پیدا نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((player) => (
            <Link key={player.id} href={`/users/${player.id}`}>
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {player.avatar ? (
                      <img src={player.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      player.firstName?.[0]
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {player.firstName} {player.lastName}
                      {player.verificationStatus === 'verified' && (
                        <span className="text-green-600 mr-1">✓</span>
                      )}
                    </div>
                    {player.city && <div className="text-sm text-gray-500">📍 {player.city}</div>}
                  </div>
                </div>

                {player.playerProfile && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      {levelLabels[player.playerProfile.level] || player.playerProfile.level}
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {specialtyLabels[player.playerProfile.specialty] || player.playerProfile.specialty}
                    </span>
                    {player.playerProfile.experience && (
                      <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {player.playerProfile.experience} سال سابقه
                      </span>
                    )}
                  </div>
                )}

                {player.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{player.bio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}