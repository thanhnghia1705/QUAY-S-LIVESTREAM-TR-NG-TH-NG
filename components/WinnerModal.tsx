
import React, { useState, useEffect } from 'react';
import { Winner } from '../types';
import { generateWinnerCongratulation } from '../services/geminiService';
import confetti from 'canvas-confetti';

interface WinnerModalProps {
  winner: Winner;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  const [aiMessage, setAiMessage] = useState<string>("Đang soạn lời chúc mừng từ SANTAV...");

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000, colors: ['#6abf4b', '#ffffff', '#22c55e'] };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      const msg = await generateWinnerCongratulation(winner.pharmacy.name, winner.prize.label);
      setAiMessage(msg);
    };
    fetchMessage();
  }, [winner]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
      {/* Clickable Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-500 cursor-pointer" 
        onClick={onClose} 
      />
      
      {/* Modal Container: Added max-h and overflow-y-auto to fix content getting cut off */}
      <div className="relative bg-[#fcf9f2] w-full max-w-4xl max-h-[95vh] rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 border border-white/20">
        
        {/* Close Icon for better UX */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 z-20 text-slate-400 hover:text-slate-800 transition-colors p-2"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute top-0 left-0 w-full h-3 bg-[#6abf4b]" />
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 scrollbar-hide">
          <div className="flex flex-col items-center">
            <div className="bg-[#6abf4b] text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-8 shadow-md">
               XIN CHÚC MỪNG
            </div>

            <div className="mb-10 text-center w-full">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Nhà thuốc trúng thưởng:</h2>
              {/* Updated: Reduced font size by 50% and changed to red color */}
              <div className="text-xl md:text-3xl font-black text-red-600 tracking-tighter uppercase leading-tight mb-6 px-4">
                {winner.pharmacy.name}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                 <div className="bg-white/80 px-6 py-2 rounded-xl border border-slate-200 text-slate-600 font-black text-sm uppercase">
                    {winner.pharmacy.area}
                 </div>
                 <div className="bg-[#6abf4b]/10 px-6 py-2 rounded-xl border border-[#6abf4b]/20 text-[#6abf4b] font-black text-sm uppercase">
                    Mã: {winner.pharmacy.code}
                 </div>
              </div>
            </div>

            {/* Prize Section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/50 p-8 rounded-[2.5rem] border-2 border-white shadow-sm mb-10">
              <div className="flex items-center justify-center">
                {winner.prize.imageUrl ? (
                    <div className="w-full aspect-square max-w-[220px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                        <img src={winner.prize.imageUrl} className="w-full h-full object-cover" alt={winner.prize.giftName} />
                    </div>
                ) : (
                    <div className="w-full aspect-square max-w-[220px] bg-white rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
                        <span className="text-8xl animate-bounce-subtle">🎁</span>
                    </div>
                )}
              </div>
              <div className="flex flex-col justify-center text-center md:text-left">
                  <div className="bg-[#6abf4b] text-white inline-block px-5 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-3 shadow-sm w-fit mx-auto md:mx-0">
                    {winner.prize.label}
                  </div>
                  <div className="text-slate-800 text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase">
                    {winner.prize.giftName}
                  </div>
              </div>
            </div>

            <div className="max-w-xl mb-10 text-center">
              <p className="text-[#6abf4b] italic text-xl leading-relaxed font-semibold">
                "{aiMessage}"
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-md bg-[#6abf4b] text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all shadow-lg hover:shadow-[#6abf4b]/30 mb-4"
            >
              TIẾP TỤC CHƯƠNG TRÌNH
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              SANTAV - Hệ thống quay số minh bạch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
