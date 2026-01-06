
import React from 'react';
import { Prize } from '../types';

interface PrizeStepProps {
  prizes: Prize[];
  setPrizes: (p: Prize[]) => void;
  next: () => void;
}

const PrizeStep: React.FC<PrizeStepProps> = ({ prizes, setPrizes, next }) => {
  const updatePrize = (id: number, field: keyof Prize, value: any) => {
    setPrizes(prizes.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        if (field === 'quantity') updated.remaining = value;
        return updated;
      }
      return p;
    }));
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => updatePrize(id, 'imageUrl', evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#fcf9f2] p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-2">Thiết Lập Quà Tặng</h2>
          <p className="text-slate-400 font-medium">Tùy chỉnh thông tin phần thưởng cho đợt quay số này</p>
        </div>
        <button 
          onClick={next}
          className="bg-[#6abf4b] px-12 py-5 rounded-2xl font-black text-white shadow-xl shadow-[#6abf4b]/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-lg"
        >
          Bắt Đầu Chương Trình
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {prizes.map((prize) => (
          <div key={prize.id} className="bg-[#fcf9f2] p-8 rounded-[2.5rem] border border-slate-200 flex flex-wrap items-center gap-10 shadow-sm transition-all hover:shadow-md group">
            <div className="w-20 h-20 bg-[#6abf4b] rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-lg shadow-[#6abf4b]/10">
              {prize.id}
            </div>
            
            <div className="w-36 h-36 relative group/img cursor-pointer">
               {prize.imageUrl ? (
                 <img src={prize.imageUrl} className="w-full h-full object-cover rounded-2xl border-2 border-slate-200 shadow-inner" alt={prize.giftName} />
               ) : (
                 <div className="w-full h-full bg-white/60 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 text-[10px] text-center p-4 group-hover/img:bg-white transition-colors">
                   <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                   Tải Ảnh Lên
                 </div>
               )}
               <input 
                 type="file" 
                 accept="image/*" 
                 className="absolute inset-0 opacity-0 cursor-pointer" 
                 onChange={(e) => handleImageUpload(prize.id, e)}
               />
               <div className="absolute -top-2 -right-2 bg-[#6abf4b] text-white p-2 rounded-xl shadow-lg transform scale-0 group-hover/img:scale-100 transition-transform">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" /></svg>
               </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#6abf4b] mb-2 font-black">Hạng Giải</label>
              <input 
                value={prize.label}
                onChange={(e) => updatePrize(prize.id, 'label', e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-xl font-black text-slate-800 w-full focus:ring-2 focus:ring-[#6abf4b]/20 focus:border-[#6abf4b] transition-all outline-none"
              />
            </div>

            <div className="flex-[2] min-w-[250px]">
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#6abf4b] mb-2 font-black">Tên Quà Tặng</label>
              <input 
                value={prize.giftName}
                onChange={(e) => updatePrize(prize.id, 'giftName', e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-800 w-full focus:ring-2 focus:ring-[#6abf4b]/20 focus:border-[#6abf4b] transition-all outline-none font-bold text-lg"
                placeholder="Ví dụ: Xe máy, iPhone..."
              />
            </div>

            <div className="w-32">
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#6abf4b] mb-2 font-black">Số Lượng</label>
              <div className="relative">
                <input 
                  type="number"
                  min="1"
                  value={prize.quantity}
                  onChange={(e) => updatePrize(prize.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-800 w-full focus:ring-2 focus:ring-[#6abf4b]/20 focus:border-[#6abf4b] transition-all outline-none font-black text-xl text-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrizeStep;
