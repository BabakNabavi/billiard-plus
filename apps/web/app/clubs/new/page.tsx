'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { uploadFile } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/auth.store';

export default function NewClubPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    managerName: '',
    description: '',
    address: '',
    city: '',
    country: 'Iran',
    latitude: '',
    longitude: '',
    phone: '',
    website: '',
    timezone: 'Asia/Tehran',
    snookerTables: 0,
    pocketTables: 0,
    highballTables: 0,
    vipSnookerTables: 0,
    vipPocketTables: 0,
    airHockeyTables: 0,
    dartBoards: 0,
    playstations: 0,
    hasCafe: false,
    hasParking: false,
    hasWifi: false,
    hasProfessionalCoach: false,
    specialFeatures: '',
    workingHours: {
      saturday: { open: '09:00', close: '23:00', isOpen: true },
      sunday: { open: '09:00', close: '23:00', isOpen: true },
      monday: { open: '09:00', close: '23:00', isOpen: true },
      tuesday: { open: '09:00', close: '23:00', isOpen: true },
      wednesday: { open: '09:00', close: '23:00', isOpen: true },
      thursday: { open: '09:00', close: '23:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
    },
  });

  const days = [
    { key: 'saturday', label: 'شنبه' },
    { key: 'sunday', label: 'یکشنبه' },
    { key: 'monday', label: 'دوشنبه' },
    { key: 'tuesday', label: 'سه‌شنبه' },
    { key: 'wednesday', label: 'چهارشنبه' },
    { key: 'thursday', label: 'پنجشنبه' },
    { key: 'friday', label: 'جمعه' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleNumberChange = (name: string, value: number) => {
    setForm({ ...form, [name]: value });
  };

  const handleWorkingHours = (day: string, field: string, value: any) => {
    setForm({
      ...form,
      workingHours: {
        ...form.workingHours,
        [day]: { ...(form.workingHours as any)[day], [field]: value },
      },
    });
  };

  const getLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        });
        setLocationLoading(false);
      },
      () => {
        setError('دسترسی به موقعیت مکانی رد شد');
        setLocationLoading(false);
      }
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      setError('حداکثر ۱۰ عکس مجاز است');
      return;
    }
    setImageFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      setError('حجم ویدیو نباید بیشتر از ۱۰۰ مگابایت باشد');
      return;
    }
    setVideoFile(file);
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) { router.push('/login'); return; }
    if (!form.latitude || !form.longitude) {
      setError('لطفاً موقعیت مکانی باشگاه را دریافت کنید');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const clubId = `${Date.now()}`;
      const imageUrls: string[] = [];
      let videoUrl = '';

      // آپلود عکس‌ها
      if (imageFiles.length > 0) {
        setUploadProgress('در حال آپلود عکس‌ها...');
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (!file) continue;
          const url = await uploadFile(
            'club-media',
            file,
            `clubs/${clubId}/images/${i}-${file.name}`
          );
          if (url) imageUrls.push(url);
        }
      }

      // آپلود ویدیو
      if (videoFile) {
        setUploadProgress('در حال آپلود ویدیو...');
        const url = await uploadFile(
          'club-media',
          videoFile,
          `clubs/${clubId}/videos/${videoFile.name}`
        );
        if (url) videoUrl = url;
      }

      setUploadProgress('در حال ثبت اطلاعات...');

      await api.post('/clubs', {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        images: imageUrls,
        videos: videoUrl ? [videoUrl] : [],
      });

      router.push('/clubs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ثبت باشگاه');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-green-800 mb-6">ثبت باشگاه جدید</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      {/* اطلاعات پایه */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 text-green-700">📋 اطلاعات پایه</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">نام باشگاه *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="نام باشگاه" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">نام مدیر باشگاه</label>
            <input type="text" name="managerName" value={form.managerName} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="نام و نام خانوادگی" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">توضیحات</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3} placeholder="معرفی باشگاه..." />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">آدرس *</label>
          <input type="text" name="address" value={form.address} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="آدرس کامل" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">شهر *</label>
            <input type="text" name="city" value={form.city} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="تهران" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">کشور</label>
            <input type="text" name="country" value={form.country} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">موقعیت مکانی *</label>
          <button type="button" onClick={getLocation} disabled={locationLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-2">
            {locationLoading ? 'در حال دریافت...' : '📍 دریافت موقعیت فعلی'}
          </button>
          {form.latitude && form.longitude && (
            <p className="text-sm text-green-600 mt-1">
              ✅ موقعیت دریافت شد: {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">تلفن</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="02112345678" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">وبسایت</label>
            <input type="url" name="website" value={form.website} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* تعداد میزها */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 text-green-700">🎱 تعداد میزها</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'snookerTables', label: 'میز اسنوکر' },
            { key: 'pocketTables', label: 'میز پاکت بیلیارد' },
            { key: 'highballTables', label: 'میز هی‌بال' },
            { key: 'vipSnookerTables', label: 'میز VIP اسنوکر' },
            { key: 'vipPocketTables', label: 'میز VIP پاکت' },
            { key: 'airHockeyTables', label: 'ایرهاکی' },
            { key: 'dartBoards', label: 'دارت' },
            { key: 'playstations', label: 'پلی‌استیشن' },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-sm font-medium mb-1">{item.label}</label>
              <input type="number" min="0"
                value={(form as any)[item.key]}
                onChange={(e) => handleNumberChange(item.key, parseInt(e.target.value) || 0)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          ))}
        </div>
      </div>

      {/* امکانات رفاهی */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 text-green-700">✨ امکانات رفاهی</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'hasCafe', label: 'کافه' },
            { key: 'hasParking', label: 'پارکینگ' },
            { key: 'hasWifi', label: 'WiFi' },
            { key: 'hasProfessionalCoach', label: 'مربی حرفه‌ای' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name={item.key}
                checked={(form as any)[item.key]}
                onChange={handleChange}
                className="w-4 h-4 accent-green-600" />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* امکانات ویژه */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 text-green-700">⭐ امکانات ویژه</h2>
        <textarea name="specialFeatures" value={form.specialFeatures} onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3} placeholder="هر امکانات ویژه‌ای که باشگاه دارد را اینجا بنویسید..." />
      </div>

      {/* ساعات کاری */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 text-green-700">🕐 ساعات کاری</h2>
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day.key} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium">{day.label}</div>
              <input type="checkbox"
                checked={(form.workingHours as any)[day.key].isOpen}
                onChange={(e) => handleWorkingHours(day.key, 'isOpen', e.target.checked)}
                className="w-4 h-4 accent-green-600" />
              {(form.workingHours as any)[day.key].isOpen ? (
                <>
                  <input type="time"
                    value={(form.workingHours as any)[day.key].open}
                    onChange={(e) => handleWorkingHours(day.key, 'open', e.target.value)}
                    className="border rounded px-2 py-1 text-sm" />
                  <span className="text-sm">تا</span>
                  <input type="time"
                    value={(form.workingHours as any)[day.key].close}
                    onChange={(e) => handleWorkingHours(day.key, 'close', e.target.value)}
                    className="border rounded px-2 py-1 text-sm" />
                </>
              ) : (
                <span className="text-sm text-red-500">تعطیل</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* آپلود عکس */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 text-green-700">📸 عکس‌های باشگاه</h2>
        <p className="text-sm text-gray-500 mb-3">حداکثر ۱۰ عکس — فرمت JPG، PNG</p>
        <input type="file" accept="image/*" multiple onChange={handleImageSelect}
          className="w-full border rounded-lg px-3 py-2 text-sm" />
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt="" className="w-full h-20 object-cover rounded-lg" />
                <button onClick={() => removeImage(i)}
                  className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* آپلود ویدیو */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4 text-green-700">🎬 ویدیوی باشگاه</h2>
        <p className="text-sm text-gray-500 mb-3">یک ویدیوی معرفی — حداکثر ۱۰۰ مگابایت — فرمت MP4</p>
        <input type="file" accept="video/mp4,video/*" onChange={handleVideoSelect}
          className="w-full border rounded-lg px-3 py-2 text-sm" />
        {videoFile && (
          <p className="text-sm text-green-600 mt-2">✅ {videoFile.name} انتخاب شد</p>
        )}
      </div>

      {uploadProgress && (
        <div className="bg-blue-50 text-blue-600 p-3 rounded mb-4 text-sm text-center">
          {uploadProgress}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-green-700 text-white py-4 rounded-xl text-lg hover:bg-green-800 disabled:opacity-50">
        {loading ? uploadProgress || 'در حال ثبت...' : '✅ ثبت باشگاه'}
      </button>
    </div>
  );
}