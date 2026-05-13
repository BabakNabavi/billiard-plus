'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      setAuth(res.data.user, res.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-800">
          ثبت‌نام در بیلیارد پلاس
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">نام</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="نام"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">نام خانوادگی</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="نام خانوادگی"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ایمیل</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="example@email.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">شماره تلفن</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="09123456789"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">رمز عبور</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="حداقل ۶ کاراکتر"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          حساب دارید؟{' '}
          <Link href="/login" className="text-green-700 font-medium">
            ورود
          </Link>
        </p>
      </div>
    </div>
  );
}