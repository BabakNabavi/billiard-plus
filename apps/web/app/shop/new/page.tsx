'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import { uploadFile } from '../../../lib/supabase';
import { Package, X, Upload, Info, Plus, ChevronDown, Check } from 'lucide-react';
import api from '../../../lib/api';

// Custom Select Component
function CustomSelect({ options, value, onChange, placeholder = 'انتخاب کنید' }: {
  options: { value: string; label: string; icon?: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm bg-white transition-all ${open ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-400'}`}>
        <span className={selected ? 'text-gray-800 flex items-center gap-2' : 'text-gray-400'}>
          {selected ? <>{selected.icon && <span>{selected.icon}</span>}{selected.label}</> : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 transition-colors ${value === o.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'}`}>
                <span className="flex items-center gap-2">{o.icon && <span>{o.icon}</span>}{o.label}</span>
                {value === o.value && <Check size={16} className="text-green-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const categories = [
  { value: 'table', label: 'میز بیلیارد', icon: '🎱' },
  { value: 'cue', label: 'چوب بیلیارد', icon: '🪄' },
  { value: 'ball', label: 'توپ', icon: '⚪' },
  { value: 'accessory', label: 'لوازم جانبی', icon: '🔧' },
  { value: 'clothing', label: 'پوشاک', icon: '👕' },
  { value: 'educational', label: 'آموزشی', icon: '📚' },
  { value: 'other', label: 'سایر', icon: '📦' },
];

const conditions = [
  { value: 'new', label: 'نو', icon: '✨' },
  { value: 'like_new', label: 'در حد نو', icon: '👍' },
  { value: 'used', label: 'کارکرده', icon: '🔄' },
];

const shippingMethods = [
  { value: 'post', label: 'پست پیشتاز', icon: '📮' },
  { value: 'tipax', label: 'تیپاکس', icon: '🚚' },
  { value: 'snap', label: 'اسنپ‌باکس', icon: '📦' },
  { value: 'in_person', label: 'تحویل حضوری', icon: '🤝' },
  { value: 'free', label: 'ارسال رایگان', icon: '🎁' },
  { value: 'agreement', label: 'توافقی', icon: '💬' },
];

const iranCities = [
  'تهران', 'مشهد', 'اصفهان', 'کرج', 'شیراز', 'تبریز', 'اهواز', 'قم',
  'کرمانشاه', 'ارومیه', 'رشت', 'زاهدان', 'همدان', 'کرمان', 'یزد',
  'اردبیل', 'بندرعباس', 'اراک', 'زنجان', 'سنندج', 'قزوین',
  'خرم‌آباد', 'گرگان', 'ساری', 'بوشهر', 'بیرجند', 'سمنان',
].map(c => ({ value: c, label: c, icon: '📍' }));

const snookerSizes = ['۱۲ فوت (استاندارد)', '۱۰ فوت', '۹ فوت', 'ابعاد شخصی'].map(s => ({ value: s, label: s }));
const pocketSizes = ['۹ فوت', '۸ فوت', '۷ فوت', '۶ فوت (کودک)', 'ابعاد شخصی'].map(s => ({ value: s, label: s }));
const highballSizes = ['استاندارد', 'کوچک', 'ابعاد شخصی'].map(s => ({ value: s, label: s }));

const tableTypes = [
  { value: 'snooker', label: 'اسنوکر' },
  { value: 'pocket', label: 'پاکت بیلیارد' },
  { value: 'highball', label: 'هی‌بال' },
];

const sections = [
  { id: 'basic', label: 'اطلاعات اصلی' },
  { id: 'specs', label: 'مشخصات فنی' },
  { id: 'media', label: 'تصاویر' },
  { id: 'price', label: 'قیمت' },
  { id: 'shipping', label: 'ارسال' },
  { id: 'extra', label: 'نهایی' },
];

function numberToFarsiWords(num: number): string {
  if (!num || num === 0) return '';
  const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه',
    'ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];

  const convert = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n] ?? '';
    if (n < 100)
      return (tens[Math.floor(n / 10)] ?? '') + (n % 10 ? ' و ' + convert(n % 10) : '');
    return (hundreds[Math.floor(n / 100)] ?? '') + (n % 100 ? ' و ' + convert(n % 100) : '');
  };

  if (num >= 1000000000000) return convert(Math.floor(num / 1000000000000)) + ' تریلیون' + (num % 1000000000000 ? ' و ' + numberToFarsiWords(num % 1000000000000) : '');
  if (num >= 1000000000) return convert(Math.floor(num / 1000000000)) + ' میلیارد' + (num % 1000000000 ? ' و ' + numberToFarsiWords(num % 1000000000) : '');
  if (num >= 1000000) return convert(Math.floor(num / 1000000)) + ' میلیون' + (num % 1000000 ? ' و ' + numberToFarsiWords(num % 1000000) : '');
  if (num >= 1000) return convert(Math.floor(num / 1000)) + ' هزار' + (num % 1000 ? ' و ' + numberToFarsiWords(num % 1000) : '');
  return convert(num);
}

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [requestVerification, setRequestVerification] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  const [form, setForm] = useState({
    title: '', description: '', brand: '', model: '',
    price: '', discountPrice: '', category: 'table', condition: 'new',
    city: '', stock: '1', color: '', shippingMethod: 'agreement',
    allowExchange: false, phone: '', keywords: '',
    highlights: ['', '', ''],
    specs: [{ label: '', value: '' }],
    tableType: '', tableSize: '', tableCustomSize: '',
    cueLength: '', cueTip: '', cueWeight: '',
  });

  const set = (name: string, value: any) => setForm(f => ({ ...f, [name]: value }));

  const toFa = (v: string) => v.replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)] ?? d);
  const toEn = (v: string) => v.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

  const handleNumInput = (name: string, v: string) => {
    const english = toEn(v).replace(/[^0-9]/g, '');
    set(name, english);
  };

  const formatNumber = (v: string) => {
    if (!v) return '';
    return toFa(parseInt(v).toLocaleString('en-US'));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 8) { setError('حداکثر ۸ عکس مجاز است'); return; }
    setImageFiles(p => [...p, ...files]);
    setImagePreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImageFiles(p => p.filter((_, j) => j !== i));
    setImagePreviews(p => p.filter((_, j) => j !== i));
  };

  const updateHighlight = (i: number, v: string) => {
    const h = [...form.highlights]; h[i] = v; set('highlights', h);
  };

  const updateSpec = (i: number, f: 'label' | 'value', v: string) => {
    const s = [...form.specs];
    if (s[i]) s[i]![f] = v;
    set('specs', s);
  };

  const calcDiscount = () => {
    if (!form.price || !form.discountPrice) return 0;
    const p = parseInt(form.price), d = parseInt(form.discountPrice);
    if (p <= 0 || d >= p) return 0;
    return Math.round((1 - d / p) * 100);
  };

  const getTableSizes = () => {
    if (form.tableType === 'snooker') return snookerSizes;
    if (form.tableType === 'pocket') return pocketSizes;
    if (form.tableType === 'highball') return highballSizes;
    return [];
  };

  const handleSubmit = async () => {
    if (!user) { router.push('/login'); return; }
    if (!form.title || !form.price || !form.city) { setError('لطفاً فیلدهای اجباری را پر کنید'); return; }
    setLoading(true); setError('');
    try {
      const imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploadProgress('در حال آپلود عکس‌ها...');
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (!file) continue;
          const url = await uploadFile('club-media', file, `products/${Date.now()}-${i}-${file.name}`);
          if (url) imageUrls.push(url);
        }
      }
      let videoUrl = '';
      if (videoFile) {
        setUploadProgress('در حال آپلود ویدیو...');
        const url = await uploadFile('club-media', videoFile, `products/videos/${Date.now()}-${videoFile.name}`);
        if (url) videoUrl = url;
      }
      setUploadProgress('در حال ثبت محصول...');
      await api.post('/products', {
        ...form,
        price: parseInt(form.price),
        discountPrice: form.discountPrice ? parseInt(form.discountPrice) : null,
        discountPercent: calcDiscount(),
        stock: parseInt(form.stock),
        images: imageUrls,
        video: videoUrl || undefined,
        requestedVerification: requestVerification,
        highlights: form.highlights.filter(h => h.trim()),
        specs: form.specs.filter(s => s.label && s.value),
        tableSize: form.tableSize === 'ابعاد شخصی' ? form.tableCustomSize : form.tableSize,
      });
      router.push('/shop');
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ثبت محصول');
    } finally { setLoading(false); setUploadProgress(''); }
  };

  if (!user) return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <Package size={60} className="mx-auto mb-4 text-gray-300" />
      <h2 className="text-xl font-bold mb-4">برای فروش محصول باید وارد شوید</h2>
      <button onClick={() => router.push('/login')} className="bg-green-700 text-white px-8 py-3 rounded-xl hover:bg-green-800">ورود</button>
    </div>
  );

  const NavBtn = ({ to, label }: { to: string; label: string }) => (
    <button onClick={() => setActiveSection(to)} className="flex-1 bg-green-700 text-white py-3 rounded-xl hover:bg-green-800">{label} ←</button>
  );
  const BackBtn = ({ to }: { to: string }) => (
    <button onClick={() => setActiveSection(to)} className="flex-1 border border-gray-200 py-3 rounded-xl text-gray-600 hover:bg-gray-50">→ قبلی</button>
  );

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ثبت محصول جدید</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      {/* منو */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-colors ${activeSection === s.id ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* بخش ۱: اطلاعات اصلی */}
      {activeSection === 'basic' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-600 rounded-full"></span>اطلاعات اصلی
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان محصول *</label>
            <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="مثال: میز اسنوکر ویراکا مدل M1 Gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4} placeholder="توضیح کامل محصول..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نقاط قوت</label>
            {form.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <span className="text-green-600">•</span>
                <input type="text" value={h} onChange={e => updateHighlight(i, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`ویژگی ${toFa(String(i + 1))}`} />
              </div>
            ))}
            <button onClick={() => set('highlights', [...form.highlights, ''])}
              className="text-green-700 text-sm flex items-center gap-1 mt-1">
              <Plus size={14} /> افزودن ویژگی
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی *</label>
              <CustomSelect options={categories} value={form.category} onChange={v => set('category', v)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت کالا *</label>
              <CustomSelect options={conditions} value={form.condition} onChange={v => set('condition', v)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">برند/سازنده</label>
              <input type="text" value={form.brand} onChange={e => set('brand', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="مثال: ویراکا" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مدل</label>
              <input type="text" value={form.model} onChange={e => set('model', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="مثال: M1 Gold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رنگ</label>
              <input type="text" value={form.color} onChange={e => set('color', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="مثال: مشکی/طلایی" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">کلمات کلیدی</label>
              <input type="text" value={form.keywords} onChange={e => set('keywords', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="با کاما جدا کنید" />
            </div>
          </div>
          <NavBtn to="specs" label="بعدی: مشخصات فنی" />
        </div>
      )}

      {/* بخش ۲: مشخصات فنی */}
      {activeSection === 'specs' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-600 rounded-full"></span>مشخصات فنی
          </h2>

          {form.category === 'table' && (
            <div className="bg-green-50 rounded-2xl p-4 space-y-4 border border-green-100">
              <div className="font-medium text-green-800 text-sm">🎱 مشخصات میز بیلیارد</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع میز *</label>
                <CustomSelect options={tableTypes} value={form.tableType}
                  onChange={v => set('tableType', v)} placeholder="انتخاب نوع میز" />
              </div>
              {form.tableType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سایز میز</label>
                  <CustomSelect options={getTableSizes()} value={form.tableSize}
                    onChange={v => set('tableSize', v)} placeholder="انتخاب سایز" />
                  {form.tableSize === 'ابعاد شخصی' && (
                    <input type="text" value={form.tableCustomSize}
                      onChange={e => set('tableCustomSize', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="مثال: ۲۵۰ × ۱۳۰ سانتی‌متر" />
                  )}
                </div>
              )}
            </div>
          )}

          {form.category === 'cue' && (
            <div className="bg-amber-50 rounded-2xl p-4 space-y-4 border border-amber-100">
              <div className="font-medium text-amber-800 text-sm">🪄 مشخصات چوب بیلیارد</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">قد چوب (سانتی‌متر)</label>
                  <input type="text" inputMode="numeric" value={toFa(form.cueLength)}
                    onChange={e => handleNumInput('cueLength', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="۱۴۵" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اندازه بات (میلی‌متر)</label>
                  <input type="text" inputMode="numeric" value={toFa(form.cueTip)}
                    onChange={e => handleNumInput('cueTip', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="۹.۵" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وزن چوب (انس)</label>
                  <input type="text" inputMode="numeric" value={toFa(form.cueWeight)}
                    onChange={e => handleNumInput('cueWeight', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="۱۹" />
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">سایر مشخصات فنی</label>
              <button onClick={() => set('specs', [...form.specs, { label: '', value: '' }])}
                className="text-green-700 text-sm border border-green-300 px-3 py-1 rounded-lg hover:bg-green-50 flex items-center gap-1">
                <Plus size={13} /> افزودن
              </button>
            </div>
            <div className="space-y-2">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="مثال: جنس بدنه" />
                  <input type="text" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="مثال: MDF" />
                  {form.specs.length > 1 && (
                    <button onClick={() => set('specs', form.specs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <BackBtn to="basic" />
            <NavBtn to="media" label="بعدی: تصاویر" />
          </div>
        </div>
      )}

      {/* بخش ۳: تصاویر */}
      {activeSection === 'media' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-600 rounded-full"></span>تصاویر و ویدیو
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عکس‌های محصول <span className="text-gray-400 font-normal">(حداکثر ۸ — اولین عکس تصویر اصلی)</span>
            </label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                  {i === 0 && <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">اصلی</div>}
                  <button onClick={() => removeImage(i)} className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 8 && (
                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
                  <Upload size={24} className="text-gray-300 mb-1" />
                  <span className="text-xs text-gray-400">افزودن عکس</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ویدیوی محصول <span className="text-gray-400 font-normal">(اختیاری — حداکثر ۱۰۰MB)</span>
            </label>
            <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            {videoFile && <p className="text-sm text-green-600 mt-1">✅ {videoFile.name}</p>}
          </div>
          <div className="flex gap-3">
            <BackBtn to="specs" />
            <NavBtn to="price" label="بعدی: قیمت" />
          </div>
        </div>
      )}

      {/* بخش ۴: قیمت */}
      {activeSection === 'price' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-600 rounded-full"></span>قیمت‌گذاری
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">قیمت اصلی (تومان) *</label>
              <input type="text" inputMode="numeric"
                value={formatNumber(form.price)}
                onChange={e => handleNumInput('price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="۵،۰۰۰،۰۰۰" />
              {form.price && parseInt(form.price) > 0 && (
                <div className="text-xs text-green-700 mt-1 px-1">
                  {numberToFarsiWords(parseInt(form.price))} تومان
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">قیمت با تخفیف (اختیاری)</label>
              <input type="text" inputMode="numeric"
                value={formatNumber(form.discountPrice)}
                onChange={e => handleNumInput('discountPrice', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="۴،۵۰۰،۰۰۰" />
              {form.discountPrice && parseInt(form.discountPrice) > 0 && (
                <div className="text-xs text-red-600 mt-1 px-1">
                  {numberToFarsiWords(parseInt(form.discountPrice))} تومان
                </div>
              )}
            </div>
          </div>
          {calcDiscount() > 0 && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Info size={14} /> تخفیف: {calcDiscount().toLocaleString('fa-IR')}٪
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تعداد موجودی</label>
              <input type="text" inputMode="numeric" value={toFa(form.stock)}
                onChange={e => handleNumInput('stock', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شهر *</label>
              <CustomSelect options={iranCities} value={form.city}
                onChange={v => set('city', v)} placeholder="انتخاب شهر" />
            </div>
          </div>
          <div className="flex gap-3">
            <BackBtn to="media" />
            <NavBtn to="shipping" label="بعدی: ارسال" />
          </div>
        </div>
      )}

      {/* بخش ۵: ارسال */}
      {activeSection === 'shipping' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-600 rounded-full"></span>روش ارسال
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">روش ارسال</label>
            <CustomSelect options={shippingMethods} value={form.shippingMethod}
              onChange={v => set('shippingMethod', v)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس فروشنده</label>
            <input type="text" inputMode="numeric" value={toFa(form.phone)}
              onChange={e => handleNumInput('phone', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
          </div>
          <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:border-green-300 transition-colors">
            <input type="checkbox" checked={form.allowExchange}
              onChange={e => set('allowExchange', e.target.checked)} className="accent-green-600 w-4 h-4" />
            <div>
              <div className="font-medium text-sm">امکان معاوضه</div>
              <div className="text-xs text-gray-400">خریدار می‌تواند پیشنهاد معاوضه بدهد</div>
            </div>
          </label>
          <div className="flex gap-3">
            <BackBtn to="price" />
            <NavBtn to="extra" label="بعدی: نهایی" />
          </div>
        </div>
      )}

      {/* بخش ۶: نهایی */}
      {activeSection === 'extra' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-600 rounded-full"></span>درخواست تأیید
            </h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={requestVerification}
                onChange={e => setRequestVerification(e.target.checked)}
                className="accent-green-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800">درخواست تیک تأیید بیلیارد پلاس ✅</div>
                <div className="text-sm text-gray-500 mt-1">تیم بیلیارد پلاس محصول شما را بررسی و تأیید می‌کند.</div>
              </div>
            </label>
          </div>

          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
            <h3 className="font-bold text-green-800 mb-3">خلاصه محصول</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'عنوان', value: form.title || '—' },
                { label: 'دسته‌بندی', value: categories.find(c => c.value === form.category)?.label || '—' },
                { label: 'قیمت', value: form.price ? parseInt(form.price).toLocaleString('fa-IR') + ' تومان' : '—' },
                { label: 'تخفیف', value: calcDiscount() > 0 ? calcDiscount().toLocaleString('fa-IR') + '٪' : '—' },
                { label: 'تعداد عکس', value: toFa(String(imagePreviews.length)) },
                { label: 'شهر', value: form.city || '—' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500">{item.label}:</span>
                  <span className="font-medium text-gray-800 max-w-xs truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {uploadProgress && <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-sm text-center">{uploadProgress}</div>}

          <div className="flex gap-3">
            <BackBtn to="shipping" />
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-green-700 text-white py-4 rounded-2xl text-lg font-bold hover:bg-green-800 disabled:opacity-50">
              {loading ? 'در حال ثبت...' : '✅ ثبت محصول'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}