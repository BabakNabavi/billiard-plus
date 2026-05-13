'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Club {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clubs');
      setClubs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchByCity = async () => {
    if (!city) return fetchClubs();
    setLoading(true);
    try {
      const res = await api.get(`/clubs/city/${city}`);
      setClubs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">باشگاه‌های بیلیارد</h1>
        <Link
          href="/clubs/new"
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
        >
          + ثبت باشگاه
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="جستجو بر اساس شهر..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={searchByCity}
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
        >
          جستجو
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          باشگاهی پیدا نشد
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club.id} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-2 text-green-800">{club.name}</h2>
              <p className="text-gray-600 mb-1">📍 {club.address}</p>
              <p className="text-gray-600 mb-1">🏙️ {club.city}</p>
              {club.phone && (
                <p className="text-gray-600 mb-4">📞 {club.phone}</p>
              )}
              <Link
                href={`/clubs/${club.id}`}
                className="block text-center bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
              >
                مشاهده و رزرو
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
