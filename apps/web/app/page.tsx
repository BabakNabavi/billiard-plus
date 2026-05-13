import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-green-800 mb-6">
          🎱 بیلیارد پلاس
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          پلتفرم جهانی بیلیارد — رزرو میز، یافتن باشگاه، و رقابت با بهترین‌ها
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/clubs"
            className="bg-green-700 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-800"
          >
            یافتن باشگاه
          </Link>
          <Link
            href="/register"
            className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg text-lg hover:bg-green-50"
          >
            ثبت‌نام رایگان
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-xl font-bold mb-2">یافتن باشگاه</h3>
          <p className="text-gray-600">نزدیک‌ترین باشگاه‌های بیلیارد را پیدا کنید</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">رزرو آنلاین</h3>
          <p className="text-gray-600">میز مورد نظر را به راحتی رزرو کنید</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">رنکینگ جهانی</h3>
          <p className="text-gray-600">در رقابت‌های جهانی شرکت کنید</p>
        </div>
      </div>
    </div>
  );
}