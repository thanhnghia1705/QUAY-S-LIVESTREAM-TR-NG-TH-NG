
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Pharmacy, Prize, Winner } from '../types';
import WinnerModal from './WinnerModal';

interface DrawStepProps {
  pharmacies: Pharmacy[];
  prizes: Prize[];
  setPrizes: (p: Prize[]) => void;
  winners: Winner[];
  onWinner: (w: Winner) => void;
}

// Cấu hình định mức giải thưởng theo khu vực
const AREA_QUOTAS: Record<number, Record<string, number>> = {
  1: { // Giải Nhất (Rank 1) - Tổng 6
    "50000828-Nguyễn Văn Thăng": 2,
    "50000863-Trần Kim Trị": 2,
    "50000851-Ngô Thành Phú": 1,
    "50006934-Lê Hoàng Minh Bảo": 1
  },
  2: { // Giải Nhì (Rank 2) - Tổng 12
    "50000828-Nguyễn Văn Thăng": 4,
    "50000863-Trần Kim Trị": 2,
    "50000851-Ngô Thành Phú": 4,
    "50006934-Lê Hoàng Minh Bảo": 2
  }
};

const DrawStep: React.FC<DrawStepProps> = ({ pharmacies, prizes, setPrizes, winners, onWinner }) => {
  const sortedPrizes = [...prizes].sort((a, b) => b.rank - a.rank);
  
  const [selectedPrizeId, setSelectedPrizeId] = useState<number>(sortedPrizes[0].id);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingPharmacy, setRollingPharmacy] = useState<Pharmacy | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [lastWinner, setLastWinner] = useState<Winner | null>(null);
  
  const timerRef = useRef<number | null>(null);

  const selectedPrize = prizes.find(p => p.id === selectedPrizeId)!;

  // Tính toán danh sách nhà thuốc đủ điều kiện dựa trên quy tắc phân bổ
  const eligiblePharmacies = useMemo(() => {
    // 1. Loại bỏ những nhà thuốc đã trúng giải trước đó
    const notWonYet = pharmacies.filter(p => !winners.find(w => w.pharmacy.code === p.code));
    
    const quotaRule = AREA_QUOTAS[selectedPrize.rank];
    
    // Nếu giải này có quy tắc phân bổ khu vực (Giải Nhất, Nhì)
    if (quotaRule) {
      // Đếm số lượng đã trúng của từng khu vực cho GIẢI HIỆN TẠI
      const areaCounts: Record<string, number> = {};
      winners.filter(w => w.prize.rank === selectedPrize.rank).forEach(w => {
        areaCounts[w.pharmacy.area] = (areaCounts[w.pharmacy.area] || 0) + 1;
      });

      // Chỉ giữ lại nhà thuốc thuộc khu vực chưa hết "quota"
      return notWonYet.filter(p => {
        const targetQuota = quotaRule[p.area];
        if (targetQuota === undefined) return false; // Khu vực không nằm trong danh sách được trúng giải này
        const currentCount = areaCounts[p.area] || 0;
        return currentCount < targetQuota;
      });
    }

    // Đối với Giải Ba, Tư: Quay đều trên toàn bộ khu vực
    return notWonYet;
  }, [pharmacies, winners, selectedPrize.rank]);

  const startRoll = () => {
    if (eligiblePharmacies.length === 0) {
      alert("Không tìm thấy nhà thuốc hợp lệ cho quy tắc phân bổ của giải này hoặc các khu vực được chỉ định đã hết nhà thuốc!");
      return;
    }
    if (selectedPrize.remaining <= 0) {
      alert("Giải thưởng này đã hết số lượng!");
      return;
    }

    setIsRolling(true);
    let counter = 0;
    const maxRolls = 60;
    
    const roll = () => {
      const randomPharmacy = eligiblePharmacies[Math.floor(Math.random() * eligiblePharmacies.length)];
      setRollingPharmacy(randomPharmacy);
      
      counter++;
      if (counter < maxRolls) {
        const delay = counter < 40 ? 50 : counter < 55 ? 100 : 200;
        timerRef.current = window.setTimeout(roll, delay);
      } else {
        finishRoll(randomPharmacy);
      }
    };

    roll();
  };

  const finishRoll = (winnerPharmacy: Pharmacy) => {
    setIsRolling(false);
    const winner: Winner = {
      pharmacy: winnerPharmacy,
      prize: selectedPrize,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setLastWinner(winner);
    onWinner(winner);
    
    setTimeout(() => {
        setShowWinnerModal(true);
    }, 800);

    setPrizes(prizes.map(p => 
      p.id === selectedPrizeId ? { ...p, remaining: p.remaining - 1 } : p
    ));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-4 h-full">
      {/* Prize Selector (Sidebar) */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Hạng giải</h3>
        <div className="grid grid-cols-1 gap-2">
          {sortedPrizes.map(prize => (
            <button
              key={prize.id}
              onClick={() => !isRolling && setSelectedPrizeId(prize.id)}
              disabled={isRolling}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selectedPrizeId === prize.id 
                  ? 'bg-white border-[#6abf4b] shadow-lg ring-4 ring-[#6abf4b]/5' 
                  : 'bg-white/40 border-slate-200/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    selectedPrizeId === prize.id ? 'bg-[#6abf4b] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                   {prize.rank}
                </div>
                <div className="flex-1">
                  <div className={`text-[10px] font-bold uppercase ${selectedPrizeId === prize.id ? 'text-[#6abf4b]' : 'text-slate-400'}`}>
                    {prize.label}
                  </div>
                  <div className="text-slate-800 font-bold text-xs">{prize.giftName}</div>
                </div>
                <div className={`text-sm font-black ${prize.remaining > 0 ? 'text-[#6abf4b]' : 'text-slate-300'}`}>
                    {prize.remaining}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Drawing Stage */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="flex-1 bg-[#fcf9f2] rounded-[3rem] border-4 border-white shadow-2xl flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#6abf4b]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#6abf4b]/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center w-full max-w-5xl">
            <div className="mb-10">
                <div className="inline-block px-8 py-3 bg-[#6abf4b] rounded-full text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg mb-6 animate-subtle-pulse">
                    Đang Quay Giải
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter mb-2">
                    {selectedPrize.label}
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest">{selectedPrize.giftName}</p>
                {AREA_QUOTAS[selectedPrize.rank] && (
                  <div className="mt-2 text-[10px] font-bold text-[#6abf4b] uppercase tracking-widest opacity-70">
                    * Giải thưởng áp dụng phân bổ khu vực riêng biệt
                  </div>
                )}
            </div>

            <div className="min-h-[320px] flex flex-col items-center justify-center mb-12">
              {rollingPharmacy ? (
                <div className="animate-in fade-in zoom-in duration-150">
                   <div className="inline-flex items-center gap-2 mb-8">
                     <div className="bg-[#6abf4b] text-white px-6 py-2 rounded-lg font-black text-lg shadow-md">
                        {rollingPharmacy.area}
                     </div>
                     <div className="bg-white text-slate-500 px-6 py-2 rounded-lg font-black text-lg border border-slate-200">
                        {rollingPharmacy.code}
                     </div>
                   </div>
                  <div className="text-3xl md:text-5xl font-black text-red-600 tracking-tighter leading-tight uppercase drop-shadow-sm px-4">
                    {rollingPharmacy.name}
                  </div>
                </div>
              ) : (
                <div className="text-6xl md:text-8xl font-black text-slate-200/50 uppercase tracking-tighter select-none opacity-50">
                  NHẤN ĐỂ BẮT ĐẦU
                </div>
              )}
            </div>

            <button
                onClick={startRoll}
                disabled={isRolling || selectedPrize.remaining <= 0}
                className={`group relative px-20 py-10 rounded-[2rem] font-black text-3xl uppercase tracking-[0.2em] transition-all transform ${
                    isRolling || selectedPrize.remaining <= 0
                    ? 'bg-slate-200 text-slate-400 scale-95 cursor-not-allowed'
                    : 'bg-[#6abf4b] text-white hover:scale-105 hover:shadow-[0_25px_60px_rgba(106,191,75,0.4)] active:scale-95 shadow-2xl'
                }`}
            >
                <span className="relative z-10">{isRolling ? "ĐANG CHẠY..." : "QUAY SỐ NGAY"}</span>
            </button>
            
            <div className="mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Ứng viên hợp lệ: {eligiblePharmacies.length} nhà thuốc
            </div>
          </div>
        </div>

        {/* Live Winners Ticker */}
        <div className="bg-[#fcf9f2] p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
           <div className="flex items-center justify-between mb-4 px-2">
               <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                   Danh sách trúng thưởng vừa cập nhật
               </h4>
               <span className="text-[10px] text-[#6abf4b] font-black uppercase bg-[#6abf4b]/10 px-3 py-1 rounded-full">
                  {winners.length} nhà thuốc
               </span>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {winners.map((w, idx) => (
                <div key={idx} className="flex-shrink-0 bg-white/60 p-5 rounded-2xl border border-slate-100 min-w-[300px] shadow-sm animate-in slide-in-from-right duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-[#6abf4b] text-white text-[10px] font-black px-3 py-1 rounded-md uppercase">
                        {w.prize.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{w.timestamp}</span>
                  </div>
                  <div className="text-slate-900 font-black text-base truncate mb-1 uppercase">{w.pharmacy.name}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wide opacity-70">
                    {w.pharmacy.area} • Mã: {w.pharmacy.code}
                  </div>
                </div>
              ))}
              {winners.length === 0 && (
                <div className="text-slate-300 text-xs italic py-8 w-full text-center uppercase tracking-widest font-bold opacity-30">Chưa có kết quả</div>
              )}
           </div>
        </div>
      </div>

      {showWinnerModal && lastWinner && (
        <WinnerModal 
          winner={lastWinner} 
          onClose={() => setShowWinnerModal(false)} 
        />
      )}
    </div>
  );
};

export default DrawStep;
