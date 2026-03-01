import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Layers,
  Equal,
  Info,
  Settings,
  Hash,
  Coins,
  User,
  MapPin,
  Save,
  History,
  Trash2
} from 'lucide-react';

type FormatMethod = 'round' | 'truncate';

interface HistoryRecord {
  id: string;
  owner: string;
  village: string;
  kanal: string;
  marla: string;
  sqft: string;
  pricePerAcre: string;
  acres: string;
  totalValue: string;
  timestamp: number;
}

export default function App() {
  // Assessment Info
  const [ownerName, setOwnerName] = useState<string>('');
  const [villageName, setVillageName] = useState<string>('');

  // Area Inputs
  const [kanal, setKanal] = useState<string>('0');
  const [marla, setMarla] = useState<string>('0');
  const [sqft, setSqft] = useState<string>('0');
  
  // Price per Acre (PKR)
  const [pricePerAcre, setPricePerAcre] = useState<string>('0');

  // Formatting Options
  const [decimalPlaces, setDecimalPlaces] = useState<number>(2);
  const [formatMethod, setFormatMethod] = useState<FormatMethod>('round');
  const [showSettings, setShowSettings] = useState(false);

  // History State
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('landcalc_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('landcalc_history', JSON.stringify(history));
  }, [history]);

  // Precise Calculation Logic
  const calculation = useMemo(() => {
    const k = parseFloat(kanal) || 0;
    const m = parseFloat(marla) || 0;
    const s = parseFloat(sqft) || 0;
    const price = parseFloat(pricePerAcre) || 0;

    const totalSqFt = (k * 5445) + (m * 272.25) + s;
    const finalResult = totalSqFt / 43560;
    const totalValue = finalResult * price;

    return {
      finalResult,
      totalSqFt,
      totalValue
    };
  }, [kanal, marla, sqft, pricePerAcre]);

  const formatResult = (num: number, decimals: number = decimalPlaces) => {
    let processedNum = num;
    const factor = Math.pow(10, decimals);

    if (formatMethod === 'truncate') {
      processedNum = Math.floor(num * factor) / factor;
    } else {
      processedNum = Math.round(num * factor) / factor;
    }

    return processedNum.toLocaleString('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    });
  };

  const handleSave = () => {
    const newRecord: HistoryRecord = {
      id: crypto.randomUUID(),
      owner: ownerName || 'Unknown Owner',
      village: villageName || 'Unknown Village',
      kanal,
      marla,
      sqft,
      pricePerAcre,
      acres: formatResult(calculation.finalResult),
      totalValue: formatResult(calculation.totalValue),
      timestamp: Date.now()
    };
    setHistory([newRecord, ...history]);
    setShowHistory(true);
  };

  const deleteRecord = (id: string) => {
    setHistory(history.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 pb-10">
      {/* Compact Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 h-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Calculator className="text-blue-600" size={18} />
          <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Kanal Marla Acre</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1.5 rounded-lg transition-colors ${showHistory ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <History size={18} />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg transition-colors ${showSettings ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-3 space-y-3">
        {/* Assessment Info - Compact */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Owner Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full h-9 pl-8 pr-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Village Name"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                className="w-full h-9 pl-8 pr-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Area Inputs - Single Row for Mobile */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="text-blue-500" size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Land Area</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Kanal</label>
              <input
                type="number"
                value={kanal}
                onChange={(e) => setKanal(e.target.value)}
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Marla</label>
              <input
                type="number"
                value={marla}
                onChange={(e) => setMarla(e.target.value)}
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Sq Ft</label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Valuation - Compact */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Coins className="text-emerald-500" size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Valuation</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600">PKR</span>
            <input
              type="number"
              value={pricePerAcre}
              onChange={(e) => setPricePerAcre(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-emerald-50/30 border border-emerald-100 rounded-lg text-sm font-bold text-emerald-700 focus:ring-1 focus:ring-emerald-500 outline-none"
              placeholder="Price per Acre"
            />
          </div>
        </section>

        {/* Settings - Collapsible */}
        <AnimatePresence>
          {showSettings && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Hash size={10} /> Decimals
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={decimalPlaces}
                      onChange={(e) => setDecimalPlaces(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-bold text-blue-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">Method</label>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg h-8">
                      <button
                        onClick={() => setFormatMethod('round')}
                        className={`flex-1 rounded-md text-[10px] font-bold transition-all ${formatMethod === 'round' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                      >
                        Round
                      </button>
                      <button
                        onClick={() => setFormatMethod('truncate')}
                        className={`flex-1 rounded-md text-[10px] font-bold transition-all ${formatMethod === 'truncate' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                      >
                        Trunc
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Result Card - Compact & High Impact */}
        <motion.section 
          layout
          className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Equal size={80} />
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-blue-100 text-[9px] font-bold uppercase tracking-widest mb-1">Total Acreage</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tracking-tighter leading-none">
                    {formatResult(calculation.finalResult)}
                  </span>
                  <span className="text-sm font-medium opacity-70">Acres</span>
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Save size={16} />
                <span className="text-[10px] font-bold uppercase">Save</span>
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-end">
              <div>
                <div className="text-blue-100 text-[9px] font-bold uppercase tracking-widest mb-0.5">Overall Value</div>
                <div className="text-xl font-bold flex items-center gap-1">
                  <span className="opacity-60 text-xs">PKR</span>
                  {formatResult(calculation.totalValue)}
                </div>
              </div>
              <div className="text-[8px] font-medium text-blue-200 italic opacity-60">
                1 Acre = 43,560 ft²
              </div>
            </div>
          </div>
        </motion.section>

        {/* History Section - Collapsible */}
        <AnimatePresence>
          {showHistory && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assessment History</h2>
                <button 
                  onClick={() => { if(confirm('Clear all history?')) setHistory([]) }}
                  className="text-[10px] font-bold text-red-400 hover:text-red-500"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    No records saved yet.
                  </div>
                ) : (
                  history.map((record) => (
                    <div key={record.id} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm relative group">
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="absolute top-2 right-2 text-slate-300 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-y-1 mb-2">
                        <div>
                          <div className="text-[8px] font-bold text-slate-400 uppercase">Owner</div>
                          <div className="text-xs font-bold text-slate-800 truncate pr-4">{record.owner}</div>
                        </div>
                        <div>
                          <div className="text-[8px] font-bold text-slate-400 uppercase">Village</div>
                          <div className="text-xs font-bold text-slate-800 truncate">{record.village}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex gap-3">
                          <div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase">Area</div>
                            <div className="text-[10px] font-bold text-blue-600">{record.acres} ac</div>
                          </div>
                          <div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase">Value</div>
                            <div className="text-[10px] font-bold text-emerald-600">{record.totalValue}</div>
                          </div>
                        </div>
                        <div className="text-[8px] text-slate-300">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Technical Info - Tiny */}
        <div className="flex items-center justify-center gap-2 text-slate-300 pt-2">
          <Info size={10} />
          <span className="text-[8px] font-medium uppercase tracking-widest">
            1 Kanal = 5,445 ft² | 1 Marla = 272.25 ft²
          </span>
        </div>
      </main>
    </div>
  );
}
