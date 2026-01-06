
import React, { useState, useEffect } from 'react';
import { Winner } from '../types';
import { generateWinnerCongratulation } from '../services/geminiService';
import confetti from 'canvas-confetti';

interface WinnerModalProps {
  winner: Winner;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  const [aiMessage, setAiMessage] = useState<string>("Đang soạn lời chúc mừng...");

  useEffect(() => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      confetti({ particleCount: 40, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#6abf4b', '#ffffff'] });
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    generateWinnerCongratulation(winner.pharmacy.name, winner.prize.label).then(setAiMessage);
  }, [winner]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      <div className="relative bg-[#fcf9f2] w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide text-center">
          <div className="bg-[#6abf4b] text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">XIN CHÚC MỪNG</div>
          
          <div className="mb-8">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nhà thuốc trúng thưởng:</h2>
            {/* Cỡ chữ nhỏ hơn 50% và màu Đỏ */}
            <div className="text-xl md:text-2xl font-black text-red-600 uppercase mb-4">{winner.pharmacy.name}</div>
            <div className="flex justify-center gap-2">
               <span className="bg-white px-4 py-1 rounded-lg text-slate-500 font-bold text-[10px] uppercase border border-slate-200">{winner.pharmacy.area}</span>
               <span className="bg-[#6abf4b]/10 px-4 py-1 rounded-lg text-[#6abf4b] font-bold text-[10px] uppercase">Mã: {winner.pharmacy.code}</span>
            </div>
          </div>

          <div className="bg-white/50 p-6 rounded-3xl border border-white mb-8 flex flex-col items-center">
             <div className="text-[#6abf4b] font-black text-[10px] uppercase tracking-widest mb-2">{winner.prize.label}</div>
             <div className="text-slate-800 text-2xl font-black uppercase leading-tight mb-4">{winner.prize.giftName}</div>
             {winner.prize.imageUrl && <img src={winner.prize.imageUrl} className="w-32 h-32 object-contain rounded-xl shadow-md" />}
          </div>

          <p className="text-[#6abf4b] italic text-lg font-semibold mb-8">"{aiMessage}"</p>

          <button onClick={onClose} className="w-full bg-[#6abf4b] text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg hover:brightness-105 transition-all">TIẾP TỤC</button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
