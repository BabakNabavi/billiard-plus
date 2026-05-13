'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-800">
          ورود به بیلیارد پلاس
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ایمیل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="example@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="رمز عبور"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          حساب ندارید؟{' '}
          <Link href="/register" className="text-green-700 font-medium">
            ثبت‌نام
          </Link>
        </p>
      </div>
    </div>
  );
}