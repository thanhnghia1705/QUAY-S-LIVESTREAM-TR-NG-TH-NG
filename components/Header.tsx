
import React from 'react';
import { Step } from '../types';

interface HeaderProps {
  step: Step;
  setStep: (s: Step) => void;
  logo: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ step, setStep, logo, onLogoUpload, onReset }) => {
  return (
    <div className="flex flex-col w-full z-50">
      {/* Top Brand Bar */}
      <div className="bg-[#6abf4b] py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-end items-center gap-6 text-white text-sm font-medium">
          <a href="mailto:cskh@santav.vn" className="hover:underline flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
            cskh@santav.vn
          </a>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Hotline: 1800 28 28 02
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-[#fcf9f2] border-b border-slate-200/50 py-4 px-6 sticky top-0 backdrop-blur-md bg-[#fcf9f2]/95">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              {logo ? (
                <img src={logo} alt="SANTAV Logo" className="h-10 w-auto object-contain cursor-pointer transition-transform hover:scale-105" />
              ) : (
                <div className="h-10 px-4 bg-white/50 rounded-lg flex items-center justify-center border border-slate-200 cursor-pointer hover:bg-white transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={onLogoUpload} 
              />
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div className="text-center md:text-left">
              <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                LIVESTREAM QUAY SỐ TRÚNG THƯỞNG NHÀ THUỐC - FOSIBIO
              </h1>
              <p className="text-[10px] text-[#6abf4b] font-bold tracking-[0.2em] uppercase">SANTAV., JSC - Nâng tầm sức khỏe Việt</p>
            </div>
          </div>

          {step !== 'intro' && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <nav className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl">
                {(['setup', 'prizes', 'draw', 'results'] as Step[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStep(s)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider ${
                      step === s 
                        ? 'bg-[#6abf4b] text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {s === 'setup' && 'Dữ liệu'}
                    {s === 'prizes' && 'Quà tặng'}
                    {s === 'draw' && 'Quay số'}
                    {s === 'results' && 'Kết quả'}
                  </button>
                ))}
              </nav>

              <button 
                onClick={onReset}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Làm mới toàn bộ"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
