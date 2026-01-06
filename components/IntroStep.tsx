
import React, { useEffect, useState } from 'react';

interface IntroStepProps {
  image: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStart: () => void;
}

const FallingItem = ({ delay, type }: { delay: number; type: 'dollar' | 'voucher' | 'sparkle' }) => {
  const [left] = useState(Math.random() * 100);
  const [duration] = useState(3 + Math.random() * 5);
  const [size] = useState(24 + Math.random() * 36);
  const [rotation] = useState(Math.random() * 360);

  const getIcon = () => {
    if (type === 'dollar') return '💵';
    if (type === 'voucher') return '🎫';
    return '✨';
  };

  return (
    <div
      className="fixed pointer-events-none select-none z-0 animate-fall"
      style={{
        left: `${left}%`,
        top: '-100px',
        fontSize: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        transform: `rotate(${rotation}deg)`,
        opacity: 0.8,
      }}
    >
      {getIcon()}
    </div>
  );
};

const IntroStep: React.FC<IntroStepProps> = ({ image, onImageUpload, onStart }) => {
  const [items, setItems] = useState<{ id: number; delay: number; type: 'dollar' | 'voucher' | 'sparkle' }[]>([]);

  useEffect(() => {
    const newItems = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      type: (i % 3 === 0 ? 'dollar' : i % 3 === 1 ? 'voucher' : 'sparkle') as any,
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#e0f2fe] via-white to-[#fef3c7] shadow-2xl border border-white/50">
      {/* Falling Elements Background */}
      {items.map((item) => (
        <FallingItem key={item.id} delay={item.delay} type={item.type} />
      ))}

      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.9; }
            90% { opacity: 0.9; }
            100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
          }
          .animate-fall {
            animation: fall linear infinite;
          }
        `}
      </style>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full p-4 flex flex-col items-center justify-center">
        {image ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
            <div className="relative group w-full max-w-6xl aspect-video md:aspect-[21/9] flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-[1.01]" onClick={onStart}>
              <img
                src={image}
                alt="Banner Giải Thưởng"
                className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[2rem]"
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-[2rem]" />
              
              {/* Pulsing "START" Indicator Overlay */}
              <div className="absolute bottom-10 flex items-center justify-center w-full">
                <div className="bg-white/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 animate-pulse">
                  Nhấn vào ảnh hoặc nút bên dưới để bắt đầu
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center border-2 border-dashed border-[#6abf4b] group hover:scale-110 transition-transform cursor-pointer relative">
               <svg className="w-12 h-12 text-[#6abf4b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={onImageUpload} 
              />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-4">Tải Ảnh Banner Giải Thưởng</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm max-w-lg">
                Hãy tải lên tấm ảnh full màn hình giới thiệu các giải thưởng hấp dẫn để làm nổi bật chương trình của bạn.
              </p>
            </div>
          </div>
        )}

        {/* Footer Action */}
        {image && (
          <div className="bg-white/90 backdrop-blur-xl px-16 py-10 rounded-[3.5rem] border border-white shadow-[0_30px_80px_rgba(0,0,0,0.1)] flex flex-col items-center gap-5 mt-6 relative z-20 animate-in slide-up-from-bottom-10 delay-300 duration-700">
             <div className="flex flex-col items-center">
               <h1 className="text-4xl font-[900] text-slate-800 uppercase tracking-tighter text-center">
                 CHƯƠNG TRÌNH QUAY SỐ MAY MẮN - FOSIBIO
               </h1>
               <p className="text-[#6abf4b] font-black uppercase tracking-[0.4em] text-[10px] mt-2">SANTAV., JSC - Nâng tầm sức khỏe Việt</p>
             </div>
             
             <button
              onClick={onStart}
              className="mt-2 bg-[#6abf4b] text-white px-28 py-7 rounded-[2.5rem] font-black text-4xl uppercase tracking-[0.15em] shadow-[0_25px_60px_rgba(106,191,75,0.5)] hover:brightness-110 active:scale-95 transition-all transform hover:-translate-y-1"
            >
              BẮT ĐẦU NGAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroStep;
