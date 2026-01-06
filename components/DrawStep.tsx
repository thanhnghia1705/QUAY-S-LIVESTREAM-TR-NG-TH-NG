
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

// Định mức giải thưởng theo yêu cầu của bạn
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

  const eligiblePharmacies = useMemo(() => {
    const notWonYet = pharmacies.filter(p => !winners.find(w => w.pharmacy.code === p.code));
    const quotaRule = AREA_QUOTAS[selectedPrize.rank];
    
    if (quotaRule) {
      const areaCounts: Record<string, number> = {};
      winners.filter(w => w.prize.rank === selectedPrize.rank).forEach(w => {
        areaCounts[w.pharmacy.area] = (areaCounts[w.pharmacy.area] || 0) + 1;
      });

      return notWonYet.filter(p => {
        const targetQuota = quotaRule[p.area];
        if (targetQuota === undefined) return false; 
        return (areaCounts[p.area] || 0) < targetQuota;
      });
    }
    return notWonYet;
  }, [pharmacies, winners, selectedPrize.rank]);

  const startRoll = () => {
    if (eligiblePharmacies.length === 0) {
      alert("Hết nhà thuốc hợp lệ cho quy tắc phân bổ của giải này!");
      return;
    }
    if (selectedPrize.remaining <= 0) {
      alert("Giải thưởng này đã hết!");
      return;
    }

    setIsRolling(true);
    let counter = 0;
    const roll = () => {
      const randomPharmacy = eligiblePharmacies[Math.floor(Math.random() * eligiblePharmacies.length)];
      setRollingPharmacy(randomPharmacy);
      counter++;
      if (counter < 60) {
        timerRef.current = window.setTimeout(roll, counter < 40 ? 50 : 150);
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
    setTimeout(() => setShowWinnerModal(true), 800);
    setPrizes(prizes.map(p => p.id === selectedPrizeId ? { ...p, remaining: p.remaining - 1 } : p));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-4 h-full">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Hạng giải</h3>
        <div className="grid grid-cols-1 gap-2">
          {sortedPrizes.map(prize => (
            <button
              key={prize.id}
              onClick={() => !isRolling && setSelectedPrizeId(prize.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedPrizeId === prize.id ? 'bg-white border-[#6abf4b] shadow-lg' : 'bg-white/40 border-slate-200/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedPrizeId === prize.id ? 'bg-[#6abf4b] text-white' : 'bg-slate-200 text-slate-500'}`}>{prize.rank}</div>
                <div className="flex-1">
                  <div className={`text-[10px] font-bold uppercase ${selectedPrizeId === prize.id ? 'text-[#6abf4b]' : 'text-slate-400'}`}>{prize.label}</div>
                  <div className="text-slate-800 font-bold text-xs">{prize.giftName}</div>
                </div>
                <div className="text-sm font-black">{prize.remaining}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="flex-1 bg-[#fcf9f2] rounded-[3rem] border-4 border-white shadow-2xl flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden">
          <div className="relative z-10 text-center w-full">
            <div className="mb-10">
              <div className="inline-block px-8 py-3 bg-[#6abf4b] rounded-full text-white text-sm font-black uppercase tracking-[0.3em] shadow-lg mb-6">Đang Quay Giải</div>
              <h2 className="text-5xl font-black text-slate-800 uppercase tracking-tighter mb-2">{selectedPrize.label}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest">{selectedPrize.giftName}</p>
            </div>

            <div className="min-h-[250px] flex flex-col items-center justify-center mb-12">
              {rollingPharmacy ? (
                <div className="animate-in fade-in zoom-in duration-150">
                   <div className="inline-flex items-center gap-2 mb-6">
                     <div className="bg-[#6abf4b] text-white px-4 py-1.5 rounded-lg font-black text-sm shadow-md">{rollingPharmacy.area}</div>
                     <div className="bg-white text-slate-500 px-4 py-1.5 rounded-lg font-black text-sm border border-slate-200">{rollingPharmacy.code}</div>
                   </div>
                  {/* Cỡ chữ nhỏ hơn 50% (text-xl/3xl thay vì 3xl/5xl) và màu Đỏ */}
                  <div className="text-xl md:text-3xl font-black text-red-600 tracking-tighter leading-tight uppercase px-4">
                    {rollingPharmacy.name}
                  </div>
                </div>
              ) : (
                <div className="text-4xl md:text-6xl font-black text-slate-200/50 uppercase tracking-tighter select-none opacity-50">SẴN SÀNG</div>
              )}
            </div>

            <button
                onClick={startRoll}
                disabled={isRolling || selectedPrize.remaining <= 0}
                className={`px-16 py-8 rounded-[2rem] font-black text-2xl uppercase tracking-[0.2em] transition-all transform ${isRolling ? 'bg-slate-200 text-slate-400' : 'bg-[#6abf4b] text-white hover:scale-105 shadow-2xl'}`}
            >
                {isRolling ? "ĐANG CHẠY..." : "QUAY SỐ NGAY"}
            </button>
          </div>
        </div>
      </div>

      {showWinnerModal && lastWinner && (
        <WinnerModal winner={lastWinner} onClose={() => setShowWinnerModal(false)} />
      )}
    </div>
  );
};

export default DrawStep;
