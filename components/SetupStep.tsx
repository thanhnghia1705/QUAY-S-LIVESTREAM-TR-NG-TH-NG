
import React from 'react';

interface SetupStepProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dataLoaded: boolean;
}

const SetupStep: React.FC<SetupStepProps> = ({ onFileUpload, dataLoaded }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#fcf9f2] p-12 rounded-[3rem] border border-slate-200/60 shadow-xl text-center space-y-10 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6abf4b]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="w-24 h-24 bg-[#6abf4b] rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-[#6abf4b]/20 relative z-10">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight uppercase">Nhập Dữ Liệu Nhà Thuốc</h2>
          <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
            Hãy tải lên tệp Excel (.xlsx) chứa danh sách các nhà thuốc tham gia. 
            <br/><span className="text-[#6abf4b] font-bold">Cột yêu cầu: Khu vực, Mã nhà thuốc, Tên nhà thuốc.</span>
          </p>
        </div>

        <div className="relative group z-10">
          <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-slate-200 rounded-[2.5rem] cursor-pointer hover:border-[#6abf4b]/40 hover:bg-[#6abf4b]/5 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#6abf4b] group-hover:text-white transition-colors">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="mb-2 text-sm text-slate-600 font-bold uppercase tracking-widest">
                Nhấn để tải lên <span className="text-slate-400/60">hoặc kéo thả</span>
              </p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">XLSX, XLS (Tối đa 10MB)</p>
            </div>
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={onFileUpload} />
          </label>
        </div>

        {dataLoaded && (
          <div className="flex items-center justify-center gap-3 text-[#6abf4b] bg-[#6abf4b]/10 py-4 rounded-2xl border border-[#6abf4b]/20 animate-in zoom-in duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-black text-sm uppercase tracking-wider">Dữ liệu đã sẵn sàng!</span>
          </div>
        )}

        <div className="text-left bg-white/40 p-8 rounded-[2rem] border border-slate-200 relative z-10">
          <h4 className="text-slate-400 font-black mb-4 text-[10px] uppercase tracking-[0.2em]">Cấu trúc tệp mẫu chuẩn:</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-black text-[#6abf4b] uppercase block mb-1">Cột 1</span>
              <span className="text-xs font-bold text-slate-700">Khu vực</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-black text-[#6abf4b] uppercase block mb-1">Cột 2</span>
              <span className="text-xs font-bold text-slate-700">Mã nhà thuốc</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-black text-[#6abf4b] uppercase block mb-1">Cột 3</span>
              <span className="text-xs font-bold text-slate-700">Tên nhà thuốc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupStep;
