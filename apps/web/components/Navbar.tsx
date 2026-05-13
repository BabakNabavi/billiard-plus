'use client';

import Link from 'next/link';
import { useAuthStore } from '../store/auth.store';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-green-800 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          🎱 بیلیارد پلاس
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/clubs" className="hover:text-green-300">
            باشگاه‌ها
          </Link>
          <Link href="/booking" className="hover:text-green-300">
            رزرو
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-green-300">{user.firstName}</span>
              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hover:text-green-300"
              >
                ورود
              </Link>
              <Link
                href="/register"
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                ثبت‌ نام
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}