import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Calendar,
  LayoutDashboard,
  UploadCloud,
  Sun,
  Moon,
  User,
  Users,
  BookOpen,
  MapPin,
  ChevronRight,
  Info
} from 'lucide-react';

/**
 * MASTER DATA - Mapped from SLRTCE Timetable PDFs
 * Includes: Faculty, Batch, Subject, and Department context.
 */
const INITIAL_TIMETABLE = [
  // --- FLOOR 1 ---
  { room: 'IT-101', floor: 1, day: 'Friday', start: '10:15', end: '11:15', subject: 'Engineering Chemistry', faculty: 'Dr. Lahu Teli', batch: 'FE EXTC Div-A', dept: 'EXTC' },
  { room: 'IT-101', floor: 1, day: 'Friday', start: '13:15', end: '13:45', subject: 'Engineering Mechanics', faculty: 'Dr. Abhijit Samanta', batch: 'FE EXTC Div-A', dept: 'EXTC' },
  { room: 'IT-106', floor: 1, day: 'Friday', start: '10:15', end: '11:15', subject: 'Universal Human Values', faculty: 'Ms. Vaishnavi Tripathi', batch: 'FE ECS-A All', dept: 'ECS' },
  { room: 'IT-107', floor: 1, day: 'Friday', start: '11:15', end: '12:15', subject: 'Universal Human Values', faculty: 'Ms. Vaishnavi Tripathi', batch: 'FE IT-A All', dept: 'IT' },
  { room: 'IT-110', floor: 1, day: 'Friday', start: '10:15', end: '11:15', subject: 'Data Structure', faculty: 'Dr. Bhushan Nemade', batch: 'FE CMPN-D All', dept: 'CMPN' },
  { room: 'IT-110', floor: 1, day: 'Friday', start: '13:45', end: '14:45', subject: 'Data Structure', faculty: 'Ms. Supriya Singh', batch: 'FE IT-B All', dept: 'IT' },

  // --- FLOOR 2 ---
  { room: 'IT-201', floor: 2, day: 'Friday', start: '10:15', end: '12:15', subject: 'Data Structure', faculty: 'Dr. Vinayak Shinde', batch: 'FE CMPN-A All', dept: 'CMPN' },
  { room: 'IT-206', floor: 2, day: 'Friday', start: '10:15', end: '11:15', subject: 'Digital Electronics', faculty: 'Ms. Manjiri Gogate', batch: 'FE ECS-B All', dept: 'ECS' },
  { room: 'IT-208', floor: 2, day: 'Friday', start: '09:15', end: '11:15', subject: 'Data Structure', faculty: 'Ms. Neha Kulkarni', batch: 'FE IT-D All', dept: 'IT' },
  { room: 'IT-208', floor: 2, day: 'Friday', start: '13:15', end: '14:45', subject: 'Modern Programming', faculty: 'Ms. Pooja Sarage', batch: 'CMPN-B Batch B1', dept: 'CMPN' },

  // --- FLOOR 3 ---
  { room: 'IT-301', floor: 3, day: 'Friday', start: '09:15', end: '11:15', subject: 'Maths IV (MAM)', faculty: 'Mr. Manthan Joshi', batch: 'SE CMPN-A CS', dept: 'CMPN' },
  { room: 'IT-302', floor: 3, day: 'Friday', start: '09:15', end: '10:15', subject: 'SEPM', faculty: 'Ms. Pooja Sarage', batch: 'SE CMPN-B CS', dept: 'CMPN' },
  { room: 'IT-313', floor: 3, day: 'Friday', start: '10:15', end: '11:15', subject: 'MAM (SS)', faculty: 'Ms. Utkarsha Patil', batch: 'SE CMPN-C CS', dept: 'CMPN' },

  // --- FLOOR 5 (LABS) ---
  { room: 'LAB-502', floor: 5, day: 'Friday', start: '09:15', end: '11:15', subject: 'Data Structure Lab', faculty: 'Ms. Sonu Kumawat', batch: 'FE IT-A (A2)', dept: 'IT' },
  { room: 'LAB-502', floor: 5, day: 'Friday', start: '11:15', end: '12:15', subject: 'Innovation (Idea Lab)', faculty: 'Dr. Neelam Phadanis', batch: 'FE CMPN-A (B1)', dept: 'CMPN' },
  { room: 'LAB-503', floor: 5, day: 'Friday', start: '09:15', end: '11:15', subject: 'Modern Programming', faculty: 'Ms. Pooja Sarage', batch: 'FE IT-A (A1)', dept: 'IT' },
  { room: 'LAB-503', floor: 5, day: 'Friday', start: '13:15', end: '14:45', subject: 'Programming Lab', faculty: 'Ms. Neha Kulkarni', batch: 'FE IT-C (C1)', dept: 'IT' }
];

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFloor, setActiveFloor] = useState('All');
  const [view, setView] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  // Minute-by-minute clock refresh
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const timeToMinutes = (timeStr) => {
    const [hrs, mins] = timeStr.split(':').map(Number);
    return hrs * 60 + mins;
  };

  const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const roomData = useMemo(() => {
    const uniqueRooms = [...new Set(INITIAL_TIMETABLE.map(item => item.room))];
    
    return uniqueRooms.map(roomId => {
      const roomSchedule = INITIAL_TIMETABLE.filter(s => s.room === roomId && s.day === currentDay);
      const activeSlot = roomSchedule.find(slot => {
        const start = timeToMinutes(slot.start);
        const end = timeToMinutes(slot.end);
        return currentMinutes >= start && currentMinutes < end;
      });

      const nextSlot = roomSchedule
        .filter(slot => timeToMinutes(slot.start) > currentMinutes)
        .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))[0];

      return {
        id: roomId,
        floor: INITIAL_TIMETABLE.find(r => r.room === roomId).floor,
        isOccupied: !!activeSlot,
        details: activeSlot || null,
        nextFree: nextSlot ? nextSlot.start : 'Free for day',
        schedule: roomSchedule
      };
    });
  }, [currentDay, currentMinutes]);

  const floors = ['All', 1, 2, 3, 5];
  const filteredRooms = roomData.filter(room => {
    const matchesFloor = activeFloor === 'All' || room.floor === parseInt(activeFloor);
    const matchesSearch = room.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFloor && matchesSearch;
  });

  const occupancyRate = roomData.length > 0 
    ? Math.round((roomData.filter(r => r.isOccupied).length / roomData.length) * 100) 
    : 0;

  // UI Theming
  const isDark = theme === 'dark';
  const themeClasses = {
    bg: isDark ? 'bg-[#020617]' : 'bg-slate-50',
    nav: isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/90 border-slate-200',
    card: isDark ? 'bg-slate-900/50 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-lg shadow-slate-200/50',
    textMain: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600',
    innerCard: isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200',
    input: isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-all duration-300 font-sans`}>
      {/* Dynamic Header */}
      <nav className={`border-b ${themeClasses.nav} backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-500/30 shadow-xl">
              <Zap size={22} className="text-white fill-current" />
            </div>
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${themeClasses.textMain}`}>
                SLRTCE <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">IT-Sync</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={`flex items-center gap-3 ${themeClasses.accent} px-4 py-2 rounded-2xl border hidden md:flex`}>
              <Clock size={16} />
              <span className="text-sm font-mono font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {view === 'dashboard' ? (
          <>
            {/* Real-time Statistics Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className={`${themeClasses.card} p-8 rounded-[2rem] border relative group`}>
                <p className={`${themeClasses.textMuted} text-[10px] font-black uppercase tracking-widest mb-2`}>Total Occupancy</p>
                <div className="flex items-baseline gap-2">
                  <h3 className={`text-5xl font-black ${themeClasses.textMain}`}>{occupancyRate}%</h3>
                  <span className="text-indigo-500 font-bold text-xs uppercase animate-pulse">Live</span>
                </div>
                <div className="mt-6 w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${occupancyRate}%` }} />
                </div>
              </div>

              <div className={`${themeClasses.card} p-8 rounded-[2rem] border flex items-center gap-6`}>
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Calendar size={32} />
                </div>
                <div>
                  <h3 className={`text-2xl font-black ${themeClasses.textMain}`}>{currentDay}</h3>
                  <p className={`${themeClasses.textMuted} text-xs font-semibold`}>SLRTCE Master Feed</p>
                </div>
              </div>

              <div className={`${themeClasses.card} p-8 rounded-[2rem] border`}>
                <p className={`${themeClasses.textMuted} text-[10px] font-black uppercase tracking-widest mb-2`}>Labs Available</p>
                <h3 className="text-4xl font-black text-emerald-500">
                  {roomData.filter(r => !r.isOccupied).length} <span className={`${isDark ? 'text-slate-700' : 'text-slate-300'} text-2xl`}>/ {roomData.length}</span>
                </h3>
                <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                  <CheckCircle size={12} /> Ready for study
                </p>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
              <div className={`${themeClasses.card} p-1.5 rounded-2xl border flex w-full lg:w-auto overflow-x-auto`}>
                {floors.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFloor(f)}
                    className={`whitespace-nowrap px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                      activeFloor === f ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:text-indigo-500'
                    }`}
                  >
                    {f === 'All' ? 'Whole Wing' : `Floor ${f}`}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-96">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${themeClasses.textMuted}`} size={20} />
                <input 
                  type="text" 
                  placeholder="Search Room or Activity..."
                  className={`w-full ${themeClasses.input} rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm font-semibold transition-all`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Room Map Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredRooms.map(room => (
                <div 
                  key={room.id}
                  className={`relative overflow-hidden rounded-[2.8rem] border-2 transition-all duration-500 group ${themeClasses.card} ${
                    room.isOccupied 
                    ? 'border-rose-500/30' 
                    : 'border-emerald-500/30'
                  }`}
                >
                  <div className="p-8">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className={`text-2xl font-black tracking-tighter ${themeClasses.textMain}`}>{room.id}</h4>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                           <MapPin size={10} /> Floor {room.floor}
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border ${
                        room.isOccupied ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${room.isOccupied ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                        {room.isOccupied ? 'Occupied' : 'Free'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-4">
                      {room.isOccupied ? (
                        <div className={`${themeClasses.innerCard} p-5 rounded-[2rem] border border-dashed`}>
                          <div className="flex items-center gap-2 mb-3 text-rose-500">
                             <Info size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Why Occupied?</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <BookOpen size={16} className="text-indigo-500 mt-1 shrink-0" />
                              <div>
                                <p className={`text-xs font-black ${themeClasses.textMain}`}>{room.details.subject}</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Activity</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <User size={16} className="text-rose-500 mt-1 shrink-0" />
                              <div>
                                <p className={`text-xs font-black ${themeClasses.textMain}`}>{room.details.faculty}</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Faculty In-charge</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Users size={16} className="text-blue-500 mt-1 shrink-0" />
                              <div>
                                <p className={`text-xs font-black ${themeClasses.textMain}`}>{room.details.batch}</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Students / Batch</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`${themeClasses.innerCard} p-8 text-center rounded-[2rem] border-dashed flex flex-col items-center justify-center min-h-[160px]`}>
                          <CheckCircle size={40} className="text-emerald-500 mb-4 opacity-50" />
                          <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter">Room Available</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1">Free for self-study/meetings</p>
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/20">
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Time Status</p>
                          <p className={`text-xs font-mono font-bold ${room.isOccupied ? 'text-rose-500' : 'text-indigo-500'}`}>
                            {room.isOccupied ? `Ends at ${room.details.end}` : `Next Class: ${room.nextFree}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Total Block</p>
                          <p className={`text-xs font-mono font-bold ${themeClasses.textMuted}`}>
                            {room.isOccupied ? `${room.details.start}-${room.details.end}` : '--:--'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Ingest View */
          <div className="max-w-4xl mx-auto py-20">
            <div className="text-center mb-12">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/10 rounded-3xl text-indigo-500 mb-6 border border-indigo-500/20">
                 <UploadCloud size={40} />
               </div>
               <h2 className={`text-4xl font-black ${themeClasses.textMain} mb-4`}>Autonomous Ingestion</h2>
               <p className={`${themeClasses.textMuted} max-w-xl mx-auto`}>Our AI parses messy timetable scans into the live monitoring system instantly. Upload your PDF to synchronize the campus.</p>
            </div>
            
            <div className={`${themeClasses.card} border-4 border-dashed rounded-[3rem] p-20 flex flex-col items-center text-center cursor-pointer hover:border-indigo-500/50 transition-all group`}>
               <UploadCloud size={64} className="text-indigo-500/30 group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-500 mb-6" />
               <p className={`text-sm font-black uppercase tracking-widest ${themeClasses.textMuted}`}>Drag & Drop Timetable PDF</p>
               <button className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/40 transition-all active:scale-95">
                 Browse Local Storage
               </button>
            </div>
          </div>
        )}
      </main>

      {/* Corporate Footer */}
      <footer className={`mt-24 border-t ${isDark ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-white'} py-20 px-6`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} rounded-2xl flex items-center justify-center border`}>
              <LayoutDashboard size={20} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Hackathon Edition</p>
              <h4 className={`text-sm font-bold ${themeClasses.textMain}`}>EnFu AI x SLRTCE Mira Road</h4>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {['AI OCR Engine', 'Live Faculty Sync', 'Real-time Occupancy'].map(tag => (
              <div key={tag} className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${themeClasses.accent}`}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;