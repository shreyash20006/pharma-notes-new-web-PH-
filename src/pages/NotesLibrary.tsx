import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  Lock, 
  Star, 
  FileText,
  ChevronDown,
  Crown,
  X,
  CheckSquare,
  Square
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
interface Note {
  id: string;
  title: string;
  semester: string;
  topics: string[];
  fileSize: string;
  downloads: string;
  rating: number;
  isPremium: boolean;
  fileType: 'PDF' | 'PPT' | 'Handwritten';
  stream: 'bpharma' | 'btech';
  branch?: string;
  year?: string;
}

export default function NotesLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<'bpharma' | 'btech'>('bpharma');
  const [selectedSubTab, setSelectedSubTab] = useState('Year 1');
  const [filterDropdown, setFilterDropdown] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Sidebar filters
  const [semesterFilters, setSemesterFilters] = useState<string[]>([]);
  const [fileTypeFilters, setFileTypeFilters] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [showOnlyPro, setShowOnlyPro] = useState(false);

  // Dummy user status (change to true to test Pro features)
  const userIsPro = false;

  // Dummy notes data
  const allNotes: Note[] = [
    // B.Pharma Notes
    { id: '1', title: 'Pharmacology I', semester: 'Sem 3', topics: ['Drug Mechanisms', 'Receptor Theory', 'Pharmacokinetics'], fileSize: '4.2 MB', downloads: '1.2k', rating: 4.8, isPremium: true, fileType: 'PDF', stream: 'bpharma', year: 'Year 2' },
    { id: '2', title: 'Pharmaceutics II', semester: 'Sem 2', topics: ['Tablet Formulation', 'Quality Control', 'Manufacturing'], fileSize: '3.8 MB', downloads: '980', rating: 4.5, isPremium: false, fileType: 'PDF', stream: 'bpharma', year: 'Year 1' },
    { id: '3', title: 'Medicinal Chemistry', semester: 'Sem 5', topics: ['Drug Design', 'SAR Analysis', 'Synthesis Routes'], fileSize: '5.1 MB', downloads: '1.5k', rating: 4.7, isPremium: true, fileType: 'PDF', stream: 'bpharma', year: 'Year 3' },
    { id: '4', title: 'Pharmacognosy', semester: 'Sem 4', topics: ['Plant Drugs', 'Alkaloids', 'Glycosides'], fileSize: '4.5 MB', downloads: '1.1k', rating: 4.6, isPremium: true, fileType: 'Handwritten', stream: 'bpharma', year: 'Year 2' },
    { id: '5', title: 'Clinical Pharmacy', semester: 'Sem 7', topics: ['Patient Care', 'Drug Therapy', 'Clinical Trials'], fileSize: '3.9 MB', downloads: '890', rating: 4.9, isPremium: true, fileType: 'PPT', stream: 'bpharma', year: 'Year 4' },
    { id: '6', title: 'Pharmaceutical Analysis', semester: 'Sem 6', topics: ['Spectroscopy', 'Chromatography', 'Titrations'], fileSize: '4.7 MB', downloads: '1.3k', rating: 4.4, isPremium: false, fileType: 'PDF', stream: 'bpharma', year: 'Year 3' },
    
    // BTech Notes
    { id: '7', title: 'Data Structures & Algorithms', semester: 'Sem 3', topics: ['Trees', 'Graphs', 'Sorting Algorithms'], fileSize: '5.2 MB', downloads: '2.1k', rating: 4.9, isPremium: true, fileType: 'PDF', stream: 'btech', branch: 'CSE' },
    { id: '8', title: 'Database Management Systems', semester: 'Sem 5', topics: ['SQL', 'Normalization', 'Transactions'], fileSize: '4.8 MB', downloads: '1.8k', rating: 4.7, isPremium: true, fileType: 'PDF', stream: 'btech', branch: 'CSE' },
    { id: '9', title: 'Digital Electronics', semester: 'Sem 3', topics: ['Logic Gates', 'Flip-Flops', 'Counters'], fileSize: '3.9 MB', downloads: '1.4k', rating: 4.5, isPremium: false, fileType: 'PDF', stream: 'btech', branch: 'ECE' },
    { id: '10', title: 'Thermodynamics', semester: 'Sem 4', topics: ['Heat Transfer', 'Laws of Thermodynamics', 'Entropy'], fileSize: '4.3 MB', downloads: '1.6k', rating: 4.6, isPremium: true, fileType: 'Handwritten', stream: 'btech', branch: 'Mechanical' },
    { id: '11', title: 'Fluid Mechanics', semester: 'Sem 5', topics: ['Fluid Properties', 'Flow Analysis', 'Bernoulli Equation'], fileSize: '4.1 MB', downloads: '1.2k', rating: 4.8, isPremium: true, fileType: 'PDF', stream: 'btech', branch: 'Mechanical' },
    { id: '12', title: 'Computer Networks', semester: 'Sem 6', topics: ['OSI Model', 'TCP/IP', 'Routing Protocols'], fileSize: '5.5 MB', downloads: '2.3k', rating: 4.9, isPremium: false, fileType: 'PDF', stream: 'btech', branch: 'CSE' },
  ];

  // Filter logic
  const filteredNotes = allNotes.filter(note => {
    // Stream filter
    if (note.stream !== selectedStream) return false;
    
    // Sub-tab filter
    if (selectedStream === 'bpharma' && note.year !== selectedSubTab) return false;
    if (selectedStream === 'btech' && note.branch !== selectedSubTab) return false;
    
    // Search filter
    if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !note.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    
    // Semester filter
    if (semesterFilters.length > 0 && !semesterFilters.includes(note.semester)) return false;
    
    // File type filter
    if (fileTypeFilters.length > 0 && !fileTypeFilters.includes(note.fileType)) return false;
    
    // Rating filter
    if (note.rating < minRating) return false;
    
    // Free/Pro filter
    if (showOnlyFree && note.isPremium) return false;
    if (showOnlyPro && !note.isPremium) return false;
    
    return true;
  });

  const toggleSemesterFilter = (sem: string) => {
    setSemesterFilters(prev => 
      prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
    );
  };

  const toggleFileTypeFilter = (type: string) => {
    setFileTypeFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP BAR */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold" data-testid="library-heading">
              Notes Library
            </h1>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#3B31B8] rounded-xl font-semibold"
              data-testid="mobile-filter-toggle"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Search and Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject, semester, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B31B8] focus:border-transparent"
                data-testid="search-input"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterDropdown}
                onChange={(e) => setFilterDropdown(e.target.value)}
                className="appearance-none bg-[#0A0F1E] border border-white/10 rounded-xl px-6 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#3B31B8] cursor-pointer"
                data-testid="filter-dropdown"
              >
                <option value="All">All Streams</option>
                <option value="B.Pharma">B.Pharma Only</option>
                <option value="BTech">BTech Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* STREAM TABS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setSelectedStream('bpharma');
                setSelectedSubTab('Year 1');
              }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedStream === 'bpharma'
                  ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              data-testid="tab-bpharma"
            >
              B.Pharma
            </button>
            <button
              onClick={() => {
                setSelectedStream('btech');
                setSelectedSubTab('CSE');
              }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                selectedStream === 'btech'
                  ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/40'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              data-testid="tab-btech"
            >
              BTech
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-2 flex-wrap">
            {selectedStream === 'bpharma' ? (
              ['Year 1', 'Year 2', 'Year 3', 'Year 4'].map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedSubTab(year)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSubTab === year
                      ? 'bg-[#3B31B8]/20 text-[#3B31B8] border border-[#3B31B8]'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                  data-testid={`subtab-${year.toLowerCase().replace(' ', '-')}`}
                >
                  {year}
                </button>
              ))
            ) : (
              ['CSE', 'ECE', 'Mechanical', 'Civil'].map(branch => (
                <button
                  key={branch}
                  onClick={() => setSelectedSubTab(branch)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSubTab === branch
                      ? 'bg-[#3B31B8]/20 text-[#3B31B8] border border-[#3B31B8]'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                  data-testid={`subtab-${branch.toLowerCase()}`}
                >
                  {branch}
                </button>
              ))
            )}
          </div>
        </motion.div>

        {/* MAIN CONTENT GRID */}
        <div className="flex gap-8">
          {/* SIDEBAR FILTERS (Desktop) */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`${
                  sidebarOpen ? 'fixed inset-0 z-50 bg-[#0D1117] p-6 lg:relative lg:inset-auto lg:z-auto lg:p-0' : 'hidden lg:block'
                } w-full lg:w-64 flex-shrink-0`}
                data-testid="sidebar-filters"
              >
                <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  {/* Mobile Close Button */}
                  <div className="lg:hidden flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 hover:bg-white/5 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold mb-4 hidden lg:block">Filters</h3>

                  {/* Semester Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Semester</h4>
                    <div className="space-y-2">
                      {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(sem => (
                        <button
                          key={sem}
                          onClick={() => toggleSemesterFilter(sem)}
                          className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-white/5 transition-colors"
                          data-testid={`filter-${sem.toLowerCase().replace(' ', '-')}`}
                        >
                          {semesterFilters.includes(sem) ? (
                            <CheckSquare className="w-4 h-4 text-[#3B31B8]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm">{sem}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Type Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">File Type</h4>
                    <div className="space-y-2">
                      {['PDF', 'PPT', 'Handwritten'].map(type => (
                        <button
                          key={type}
                          onClick={() => toggleFileTypeFilter(type)}
                          className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-white/5 transition-colors"
                          data-testid={`filter-${type.toLowerCase()}`}
                        >
                          {fileTypeFilters.includes(type) ? (
                            <CheckSquare className="w-4 h-4 text-[#3B31B8]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Minimum Rating</h4>
                    <button
                      onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
                      className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-white/5 transition-colors"
                      data-testid="filter-rating"
                    >
                      {minRating === 4 ? (
                        <CheckSquare className="w-4 h-4 text-[#3B31B8]" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm flex items-center gap-1">
                        4<Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> and above
                      </span>
                    </button>
                  </div>

                  {/* Free/Pro Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Access Type</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowOnlyFree(!showOnlyFree);
                          if (!showOnlyFree) setShowOnlyPro(false);
                        }}
                        className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-white/5 transition-colors"
                        data-testid="filter-free"
                      >
                        {showOnlyFree ? (
                          <CheckSquare className="w-4 h-4 text-[#3B31B8]" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm">Free Only</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowOnlyPro(!showOnlyPro);
                          if (!showOnlyPro) setShowOnlyFree(false);
                        }}
                        className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-white/5 transition-colors"
                        data-testid="filter-pro"
                      >
                        {showOnlyPro ? (
                          <CheckSquare className="w-4 h-4 text-[#3B31B8]" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm">Pro Only</span>
                      </button>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(semesterFilters.length > 0 || fileTypeFilters.length > 0 || minRating > 0 || showOnlyFree || showOnlyPro) && (
                    <button
                      onClick={() => {
                        setSemesterFilters([]);
                        setFileTypeFilters([]);
                        setMinRating(0);
                        setShowOnlyFree(false);
                        setShowOnlyPro(false);
                      }}
                      className="w-full mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                      data-testid="clear-filters"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* NOTES GRID */}
          <div className="flex-1">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note, index) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      userIsPro={userIsPro}
                      index={index}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-20"
                  >
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No notes found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search query</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* UPGRADE BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
          data-testid="upgrade-banner"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-2xl p-8 text-center">
            <div className="relative z-10">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-3xl font-bold mb-2">Unlock all 500+ notes with Pro</h2>
              <p className="text-white/80 mb-6 text-lg">Get unlimited access for just ₹99/month</p>
              <Link
                to="/premium"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#3B31B8] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
                data-testid="upgrade-cta"
              >
                <Crown className="w-5 h-5" />
                Upgrade Now
              </Link>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Note Card Component
function NoteCard({ note, userIsPro, index }: { note: Note, userIsPro: boolean, index: number }) {
  const canDownload = !note.isPremium || userIsPro;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="relative bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#3B31B8]/50 transition-all group"
      data-testid={`note-card-${note.id}`}
    >
      {/* Pro Badge */}
      {note.isPremium && (
        <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Crown className="w-3 h-3" />
          PRO
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{note.title}</h3>
          <div className="px-3 py-1 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-xs font-bold inline-block">
            {note.semester}
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 line-clamp-2">
          Topics: {note.topics.join(', ')}
        </p>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          {note.fileSize}
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          {note.downloads}
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          {note.rating}
        </div>
      </div>

      {/* File Type Badge */}
      <div className="mb-4">
        <span className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs">
          {note.fileType}
        </span>
      </div>

      {/* Download Button */}
      {canDownload ? (
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#3B31B8]/30 group-hover:shadow-[#3B31B8]/50"
          data-testid={`download-${note.id}`}
        >
          <Download className="w-5 h-5" />
          Download
        </button>
      ) : (
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl font-semibold cursor-not-allowed"
          disabled
          data-testid={`locked-${note.id}`}
        >
          <Lock className="w-5 h-5" />
          Pro Only
        </button>
      )}
    </motion.div>
  );
}
