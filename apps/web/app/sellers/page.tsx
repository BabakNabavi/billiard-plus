'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  verificationStatus: string;
  bio: string;
  city: string;
  avatar: string;
  sellerProfile: {
    shopName: string;
    productTypes: string;
    website: string;
  };
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/user/by-role/seller').then((res) => {
      setSellers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = sellers.filter(s =>
    `${s.firstName} ${s.lastName} ${s.city} ${s.sellerProfile?.shopName}`.includes(search)
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">🛍️ فروشندگان</h1>
        <span className="text-gray-500 text-sm">{sellers.length} فروشنده</span>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام یا شهر..."
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500" />

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">فروشنده‌ای پیدا نشد</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((seller) => (
            <Link key={seller.id} href={`/users/${seller.id}`}>
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {seller.avatar ? (
                      <img src={seller.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : seller.firstName?.[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {seller.firstName} {seller.lastName}
                      {seller.verificationStatus === 'verified' && (
                        <span className="text-green-600 mr-1">✓</span>
                      )}
                    </div>
                    {seller.city && <div className="text-sm text-gray-500">📍 {seller.city}</div>}
                  </div>
                </div>
                {seller.sellerProfile && (
                  <div className="space-y-1">
                    {seller.sellerProfile.shopName && (
                      <div className="text-sm font-medium text-green-700">
                        🏪 {seller.sellerProfile.shopName}
                      </div>
                    )}
                    {seller.sellerProfile.productTypes && (
                      <div className="text-xs text-gray-500">{seller.sellerProfile.productTypes}</div>
                    )}
                  </div>
                )}
                {seller.bio && <p className="text-sm text-gray-600 line-clamp-2 mt-2">{seller.bio}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}