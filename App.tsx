
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Pharmacy, Prize, Winner, Step } from './types';
import IntroStep from './components/IntroStep';
import SetupStep from './components/SetupStep';
import PrizeStep from './components/PrizeStep';
import DrawStep from './components/DrawStep';
import ResultsStep from './components/ResultsStep';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [introImage, setIntroImage] = useState<string | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([
    { id: 1, rank: 1, label: 'GIẢI NHẤT', giftName: '1 Tờ 100 USD', quantity: 6, remaining: 6 },
    { id: 2, rank: 2, label: 'GIẢI NHÌ', giftName: '1 Tờ 50 USD', quantity: 12, remaining: 12 },
    { id: 3, rank: 3, label: 'GIẢI BA', giftName: 'Voucher Got It 500K', quantity: 24, remaining: 24 },
    { id: 4, rank: 4, label: 'GIẢI TƯ', giftName: 'Voucher Gonsa 100K (Fosibio)', quantity: 200, remaining: 200 },
  ]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [logo, setLogo] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];
      
      const mappedData: Pharmacy[] = data.map(row => ({
        area: String(row['Khu vực'] || row['Area'] || row['khu vuc'] || ''),
        code: String(row['Mã nhà thuốc'] || row['Code'] || row['ma nha thuoc'] || ''),
        name: String(row['Tên nhà thuốc'] || row['Name'] || row['ten nha thuoc'] || ''),
      })).filter(p => p.name && p.name !== 'undefined');

      setPharmacies(mappedData);
      setCurrentStep('prizes');
    };
    reader.readAsBinaryString(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setLogo(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIntroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setIntroImage(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    if (window.confirm("Bạn có chắc muốn làm mới toàn bộ dữ liệu?")) {
      setPharmacies([]);
      setWinners([]);
      setIntroImage(null);
      setCurrentStep('intro');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f2] overflow-x-hidden">
      <Header 
        step={currentStep} 
        setStep={setCurrentStep} 
        logo={logo} 
        onLogoUpload={handleLogoUpload} 
        onReset={resetAll}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
        {currentStep === 'intro' && (
          <IntroStep 
            image={introImage} 
            onImageUpload={handleIntroImageUpload}
            onStart={() => setCurrentStep('setup')} 
          />
        )}

        {currentStep === 'setup' && (
          <SetupStep onFileUpload={handleFileUpload} dataLoaded={pharmacies.length > 0} />
        )}
        
        {currentStep === 'prizes' && (
          <PrizeStep prizes={prizes} setPrizes={setPrizes} next={() => setCurrentStep('draw')} />
        )}
        
        {currentStep === 'draw' && (
          <DrawStep 
            pharmacies={pharmacies} 
            prizes={prizes} 
            setPrizes={setPrizes}
            winners={winners} 
            onWinner={(winner) => setWinners(prev => [winner, ...prev])}
          />
        )}
        
        {currentStep === 'results' && (
          <ResultsStep winners={winners} />
        )}
      </main>

      <footer className="py-6 border-t border-slate-200/50 text-center text-slate-400 text-[11px] uppercase tracking-widest bg-[#fcf9f2]">
        &copy; 2024 SANTAV., JSC • PROFESSIONAL LUCKY DRAW SYSTEM
      </footer>
    </div>
  );
};

export default App;
