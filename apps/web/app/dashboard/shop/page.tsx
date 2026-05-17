'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/auth.store';
import { Package, Edit, Trash2, Eye, CheckCircle, Clock, XCircle, Plus, ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  category: string;
  condition: string;
  city: string;
  images: string[];
  isVerified: boolean;
  isOfficialStore: boolean;
  status: string;
  stock: number;
  views: number;
  requestedVerification: boolean;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  table: 'میز بیلیارد',
  cue: 'چوب بیلیارد',
  ball: 'توپ',
  accessory: 'لوازم جانبی',
  clothing: 'پوشاک',
  educational: 'آموزشی',
  other: 'سایر',
};

const conditionLabels: Record<string, string> = {
  new: 'نو',
  like_new: 'در حد نو',
  used: 'کارکرده',
};

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: 'فعال', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
  sold: { label: 'فروخته شده', color: 'bg-gray-100 text-gray-600', icon: <CheckCircle size={12} /> },
  inactive: { label: 'غیرفعال', color: 'bg-red-100 text-red-600', icon: <XCircle size={12} /> },
};

export default function MyShopPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api.get('/products/my-products').then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئنی؟')) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = activeTab === 'all' ? products :
    activeTab === 'pending' ? products.filter(p => p.requestedVerification && !p.isVerified) :
    products.filter(p => p.status === activeTab);

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    sold: products.filter(p => p.status === 'sold').length,
    pending: products.filter(p => p.requestedVerification && !p.isVerified).length,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">فروشگاه من</h1>
        <Link href="/shop/new"
          className="bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-green-800 flex items-center gap-2 font-medium">
          <Plus size={16} />
          محصول جدید
        </Link>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'کل محصولات', value: stats.total, color: 'text-gray-800', bg: 'bg-white' },
          { label: 'محصولات فعال', value: stats.active, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'فروخته شده', value: stats.sold, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'کل بازدید', value: stats.totalViews, color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} rounded-2xl p-4 shadow-sm text-center border border-gray-100`}>
            <div className={`text-3xl font-black ${item.color}`}>
              {item.value.toLocaleString('fa-IR')}
            </div>
            <div className="text-sm text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* تب‌ها */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'all', label: 'همه', count: stats.total },
            { id: 'active', label: 'فعال', count: stats.active },
            { id: 'sold', label: 'فروخته شده', count: stats.sold },
            { id: 'pending', label: 'در انتظار تأیید', count: stats.pending },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium flex-shrink-0 border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count.toLocaleString('fa-IR')}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-16 text-gray-400">در حال بارگذاری...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">
                {activeTab === 'all' ? 'هنوز محصولی ثبت نکردی' : 'محصولی در این دسته نیست'}
              </p>
              {activeTab === 'all' && (
                <Link href="/shop/new" className="bg-green-700 text-white px-6 py-2.5 rounded-xl hover:bg-green-800 text-sm">
                  ثبت اولین محصول
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(product => (
                <div key={product.id} className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 hover:border-green-200 transition-colors">
                  {/* عکس */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.images?.length > 0 ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package size={28} className="text-gray-300" />
                    )}
                  </div>

                  {/* اطلاعات */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-sm truncate">{product.title}</h3>
                      {product.isVerified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <CheckCircle size={10} />
                          تأیید شده
                        </span>
                      )}
                      {product.requestedVerification && !product.isVerified && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <Clock size={10} />
                          در انتظار تأیید
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>{categoryLabels[product.category]}</span>
                      <span>•</span>
                      <span>{conditionLabels[product.condition]}</span>
                      <span>•</span>
                      <span>{product.city}</span>
                      <span>•</span>
                      <span>{(product.views || 0).toLocaleString('fa-IR')} بازدید</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {product.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 line-through">{product.price.toLocaleString('fa-IR')}</span>
                          <span className="font-bold text-green-700 text-sm">{product.discountPrice.toLocaleString('fa-IR')} تومان</span>
                          <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">{product.discountPercent}٪</span>
                        </div>
                      ) : (
                        <span className="font-bold text-green-700 text-sm">{product.price.toLocaleString('fa-IR')} تومان</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusLabels[product.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[product.status]?.icon}
                        {statusLabels[product.status]?.label || product.status}
                      </span>
                    </div>
                  </div>

                  {/* دکمه‌ها */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/shop/${product.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="مشاهده">
                      <Eye size={18} />
                    </Link>
                    <Link href={`/shop/edit/${product.id}`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors" title="ویرایش">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50" title="حذف">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}