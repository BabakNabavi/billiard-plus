'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import api from '../../../lib/api';
import { CheckCircle, XCircle, Eye, Star, Clock } from 'lucide-react';

interface VerificationRequest {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  primaryRole: string;
  city: string;
  verificationStatus: string;
  bio?: string;
  createdAt: string;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  player: { label: 'بازیکن', color: 'text-orange-600' },
  coach: { label: 'مربی', color: 'text-blue-600' },
  referee: { label: 'داور', color: 'text-indigo-600' },
  club_owner: { label: 'مالک باشگاه', color: 'text-green-600' },
  seller: { label: 'فروشگاه', color: 'text-purple-600' },
  manufacturer: { label: 'تولیدکننده', color: 'text-red-600' },
  installer: { label: 'متخصص نصب', color: 'text-teal-600' },
};

export default function AdminVerificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (!user || user.primaryRole !== 'admin') { router.push('/'); return; }
    api.get('/user/all').then(res => {
      const pending = res.data.filter((u: any) => u.verificationStatus === 'pending' || u.verificationStatus === 'verified' || u.verificationStatus === 'rejected');
      setRequests(pending);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleVerify = async (userId: string, status: string) => {
    try {
      await api.put(`/user/${userId}/verify`, { status });
      setRequests(requests.map(r => r.id === userId ? { ...r, verificationStatus: status } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = requests.filter(r => r.verificationStatus === activeTab);

  const counts = {
    pending: requests.filter(r => r.verificationStatus === 'pending').length,
    verified: requests.filter(r => r.verificationStatus === 'verified').length,
    rejected: requests.filter(r => r.verificationStatus === 'rejected').length,
  };

  if (!user || user.primaryRole !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Star size={24} className="text-yellow-500" />
          تأیید کاربران
        </h1>
        {counts.pending > 0 && (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Clock size={14} />
            {counts.pending.toLocaleString('fa-IR')} در انتظار
          </span>
        )}
      </div>

      {/* تب‌ها */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'pending', label: 'در انتظار', count: counts.pending, color: 'bg-yellow-500' },
          { id: 'verified', label: 'تأیید شده', count: counts.verified, color: 'bg-green-500' },
          { id: 'rejected', label: 'رد شده', count: counts.rejected, color: 'bg-red-500' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}>
            {tab.label}
            {tab.count > 0 && (
              <span className={`${tab.color} text-white text-xs w-5 h-5 rounded-full flex items-center justify-center`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* لیست */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Star size={48} className="mx-auto mb-4 text-gray-300" />
          <p>درخواستی در این بخش وجود ندارد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                    {req.firstName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800">{req.firstName} {req.lastName}</h3>
                      <span className={`text-xs font-medium ${roleLabels[req.primaryRole]?.color || 'text-gray-600'}`}>
                        {roleLabels[req.primaryRole]?.label || req.primaryRole}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                      <span>📱 {req.phone}</span>
                      {req.city && <span>📍 {req.city}</span>}
                      <span>📅 {req.createdAt ? new Date(req.createdAt).toLocaleDateString('fa-IR') : '—'}</span>
                    </div>
                    {req.bio && (
                      <p className="text-sm text-gray-600 leading-6 bg-gray-50 rounded-xl p-3">{req.bio}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => router.push(`/users/${req.id}`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="مشاهده پروفایل">
                    <Eye size={18} />
                  </button>
                  {activeTab !== 'verified' && (
                    <button onClick={() => handleVerify(req.id, 'verified')}
                      className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                      <CheckCircle size={15} />
                      تأیید
                    </button>
                  )}
                  {activeTab !== 'rejected' && (
                    <button onClick={() => handleVerify(req.id, 'rejected')}
                      className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                      <XCircle size={15} />
                      رد
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}