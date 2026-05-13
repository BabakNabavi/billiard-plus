'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth.store';

interface Club {
    id: string;
    name: string;
    managerName: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    phone: string;
    website: string;
    snookerTables: number;
    pocketTables: number;
    highballTables: number;
    vipSnookerTables: number;
    vipPocketTables: number;
    airHockeyTables: number;
    dartBoards: number;
    playstations: number;
    hasCafe: boolean;
    hasParking: boolean;
    hasWifi: boolean;
    hasProfessionalCoach: boolean;
    specialFeatures: string;
    workingHours: any;
    images: string[];
    videos: string[];
}

const dayNames: Record<string, string> = {
    saturday: 'شنبه',
    sunday: 'یکشنبه',
    monday: 'دوشنبه',
    tuesday: 'سه‌شنبه',
    wednesday: 'چهارشنبه',
    thursday: 'پنجشنبه',
    friday: 'جمعه',
};

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return d < 1 ? `${Math.round(d * 1000)} متر` : `${d.toFixed(1)} کیلومتر`;
}

export default function ClubProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { user } = useAuthStore();
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        api.get(`/clubs/${id}`).then((res) => {
            setClub(res.data);
            setLoading(false);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const dist = calcDistance(
                        pos.coords.latitude,
                        pos.coords.longitude,
                        res.data.latitude,
                        res.data.longitude
                    );
                    setDistance(dist);
                });
            }
        }).catch(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="text-center py-20">در حال بارگذاری...</div>;
    }

    if (!club) {
        return <div className="text-center py-20">باشگاه پیدا نشد</div>;
    }

    const mapsUrl = `https://www.google.com/maps?q=${club.latitude},${club.longitude}`;

    const facilities = [
        { key: 'snookerTables', label: 'اسنوکر', icon: '🎱' },
        { key: 'pocketTables', label: 'پاکت بیلیارد', icon: '🎱' },
        { key: 'highballTables', label: 'هی‌بال', icon: '🎱' },
        { key: 'vipSnookerTables', label: 'VIP اسنوکر', icon: '⭐' },
        { key: 'vipPocketTables', label: 'VIP پاکت', icon: '⭐' },
        { key: 'airHockeyTables', label: 'ایرهاکی', icon: '🏒' },
        { key: 'dartBoards', label: 'دارت', icon: '🎯' },
        { key: 'playstations', label: 'پلی‌استیشن', icon: '🎮' },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-10">

            {club.images && club.images.length > 0 ? (
                <div className="mb-6">
                    <img
                        src={club.images[activeImage]}
                        alt={club.name}
                        className="w-full h-72 object-cover rounded-xl"
                    />
                    {club.images.length > 1 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto">
                            {club.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt=""
                                    onClick={() => setActiveImage(i)}
                                    className={`h-16 w-24 object-cover rounded cursor-pointer border-2 ${activeImage === i ? 'border-green-600' : 'border-transparent'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full h-48 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-6xl">🎱</span>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">{club.name}</h1>
                        {club.managerName && (
                            <p className="text-gray-500 text-sm mt-1">مدیر: {club.managerName}</p>
                        )}
                    </div>
                    {distance && (
                        <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                            📍 {distance} تا شما
                        </div>
                    )}
                </div>

                {club.description && (
                    <p className="text-gray-600 mb-4">{club.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📍 {club.address}، {club.city}، {club.country}</p>
                    {club.phone && <p>📞 {club.phone}</p>}
                    {club.website && (
                        <p>🌐 <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{club.website}</a></p>
                    )}
                </div>


                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  <span>{"مشاهده در Google Maps"}</span>
                </a>
            </div>


        <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-lg font-bold text-green-700 mb-4">🎱 میزها و امکانات</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {facilities.filter((item) => (club as any)[item.key] > 0).map((item) => (
                    <div key={item.key} className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-green-700 font-bold">{(club as any)[item.key]} عدد</div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {club.hasCafe && <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">☕ کافه</span>}
                {club.hasParking && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">🅿️ پارکینگ</span>}
                {club.hasWifi && <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">📶 WiFi</span>}
                {club.hasProfessionalCoach && <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">👨‍🏫 مربی حرفه‌ای</span>}
            </div>

            {club.specialFeatures && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">⭐ امکانات ویژه:</p>
                    <p className="text-sm text-yellow-700 mt-1">{club.specialFeatures}</p>
                </div>
            )}
        </div>

    {
        club.workingHours && (
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-lg font-bold text-green-700 mb-4">🕐 ساعات کاری</h2>
                <div className="space-y-2">
                    {Object.entries(club.workingHours).map(([day, hours]: any) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                            <span className="font-medium w-20">{dayNames[day]}</span>
                            {hours.isOpen ? (
                                <span className="text-gray-600">{hours.open} تا {hours.close}</span>
                            ) : (
                                <span className="text-red-500">تعطیل</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    {
        club.videos && club.videos.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-lg font-bold text-green-700 mb-4">🎬 ویدیوی باشگاه</h2>
                <video controls className="w-full rounded-lg" src={club.videos[0]} />
            </div>
        )
    }

    <button
        onClick={() => user ? router.push(`/booking/${club.id}`) : router.push('/login')}
        className="w-full bg-green-700 text-white py-4 rounded-xl text-lg font-bold hover:bg-green-800"
    >
        📅 رزرو میز
    </button>

    </div >
  );
}