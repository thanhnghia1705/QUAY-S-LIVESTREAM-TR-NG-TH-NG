
import React from 'react';
import { Winner } from '../types';
import * as XLSX from 'xlsx';

interface ResultsStepProps {
  winners: Winner[];
}

const ResultsStep: React.FC<ResultsStepProps> = ({ winners }) => {
  const exportToExcel = () => {
    const data = winners.map(w => ({
      'Hạng Giải': w.prize.label,
      'Quà Tặng': w.prize.giftName,
      'Khu Vực': w.pharmacy.area,
      'Mã Nhà Thuốc': w.pharmacy.code,
      'Tên Nhà Thuốc': w.pharmacy.name,
      'Thời Gian': w.timestamp,
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Winners");
    XLSX.writeFile(wb, "Danh_Sach_Trung_Thuong_SANTAV.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#fcf9f2] p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-2">Bảng Vàng Danh Dự</h2>
          <p className="text-slate-400 font-medium">Đã ghi nhận {winners.length} nhà thuốc trúng thưởng thành công</p>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-3 bg-[#6abf4b] px-10 py-5 rounded-2xl font-black text-white hover:brightness-105 active:scale-95 transition-all shadow-xl shadow-[#6abf4b]/20 uppercase tracking-widest"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Tải Báo Cáo (.XLSX)
        </button>
      </div>

      <div className="bg-[#fcf9f2] rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-200/40 text-[10px] uppercase tracking-[0.3em] text-[#6abf4b] font-black border-b border-slate-200">
                <th className="px-8 py-6">Thời Điểm</th>
                <th className="px-8 py-6">Phần Thưởng</th>
                <th className="px-8 py-6">Tên Nhà Thuốc</th>
                <th className="px-8 py-6">Địa Phương</th>
                <th className="px-8 py-6">Định Danh</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {winners.map((w, idx) => (
                <tr key={idx} className="hover:bg-white/40 transition-colors group">
                  <td className="px-8 py-6 text-slate-400 font-mono text-xs">{w.timestamp}</td>
                  <td className="px-8 py-6">
                    <span className="bg-[#6abf4b] text-white text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest inline-block mb-1 shadow-sm">
                        {w.prize.label}
                    </span>
                    <div className="text-slate-800 font-bold text-xs">{w.prize.giftName}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-slate-900 font-black text-base uppercase tracking-tight">{w.pharmacy.name}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-slate-500 font-bold uppercase text-xs">{w.pharmacy.area}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-white/60 text-slate-500 px-4 py-2 rounded-xl font-mono text-xs font-black border border-slate-200">
                      {w.pharmacy.code}
                    </span>
                  </td>
                </tr>
              ))}
              {winners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                        <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <p className="text-slate-500 font-black uppercase tracking-[0.4em]">Chưa có dữ liệu trúng thưởng</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsStep;
