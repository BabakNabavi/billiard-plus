'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = 'انتخاب کنید', label }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm transition-all ${
          open ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-400'
        } bg-white`}>
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.icon && <span>{selected.icon}</span>}
              {selected.label}
            </span>
          ) : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 transition-colors ${
                  value === option.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                }`}>
                <span className="flex items-center gap-2">
                  {option.icon && <span>{option.icon}</span>}
                  {option.label}
                </span>
                {value === option.value && <Check size={16} className="text-green-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}