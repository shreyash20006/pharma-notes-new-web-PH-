import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Download, 
  Brain, 
  FileText, 
  Target,
  Clock,
  TrendingUp,
  Users,
  Lock,
  Crown,
  Calendar,
  Plus,
  ChevronRight,
  BarChart3,
  Sparkles,
  Settings,
  BookOpen,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Dummy user data
const userData = {
  name: 'Rahul',
  plan: 'Pro', // 'Free', 'Pro', or 'Elite'
  stream: 'B.Pharma',
  stats: {
    notesDownloaded: 24,
    aiSummariesUsed: 8,
    mockTestsTaken: 3,
    avgTestScore: 74
  }
};

export default function StudentDashboard() {
  const [selectedNav, setSelectedNav] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-20">
      <div className="flex">
        {/* QUICK ACTIONS SIDEBAR (Desktop) */}
        <QuickActionsSidebar selectedNav={selectedNav} setSelectedNav={setSelectedNav} />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* TOP NAV */}
          <TopNav user={userData} />

          {/* STATS ROW */}
          <StatsRow stats={userData.stats} />

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* LEFT COLUMN (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* EXAM COUNTDOWN */}
              <ExamCountdown />

              {/* RECENTLY DOWNLOADED */}
              <RecentlyDownloaded />

              {/* MOCK TEST CHART */}
              <MockTestChart />
            </div>

            {/* RIGHT COLUMN (1/3) */}
            <div className="space-y-6">
              {/* AI SUMMARY TRACKER */}
              <AISummaryTracker plan={userData.plan} summariesUsed={userData.stats.aiSummariesUsed} />

              {/* STUDY GROUPS */}
              <StudyGroups plan={userData.plan} />
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
    </div>
  );
}

// ============ TOP NAV ============
function TopNav({ user }: { user: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
      data-testid="dashboard-top-nav"
    >
      {/* Welcome */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-gray-400">Here's what's happening with your studies</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Plan Badge */}
        <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
          user.plan === 'Elite' ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' :
          user.plan === 'Pro' ? 'bg-[#3B31B8]/20 text-[#3B31B8] border border-[#3B31B8]/30' :
          'bg-gray-600/20 text-gray-400 border border-gray-600/30'
        }`} data-testid="plan-badge">
          <Crown className="w-4 h-4" />
          {user.plan} Member
        </div>

        {/* Notifications */}
        <button className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors" data-testid="notifications-bell">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-full flex items-center justify-center font-bold text-lg" data-testid="user-avatar">
          {user.name[0]}
        </div>
      </div>
    </motion.div>
  );
}

// ============ STATS ROW ============
function StatsRow({ stats }: { stats: any }) {
  const statCards = [
    { label: 'Notes Downloaded', value: stats.notesDownloaded, icon: <Download className="w-6 h-6" />, color: 'blue' },
    { label: 'AI Summaries Used', value: `${stats.aiSummariesUsed}/month`, icon: <Brain className="w-6 h-6" />, color: 'purple' },
    { label: 'Mock Tests Taken', value: stats.mockTestsTaken, icon: <FileText className="w-6 h-6" />, color: 'green' },
    { label: 'Avg. Test Score', value: `${stats.avgTestScore}%`, icon: <Target className="w-6 h-6" />, color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}

function StatCard({ stat, index }: { stat: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#3B31B8]/50 transition-all"
      data-testid={`stat-card-${index}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${
          stat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
          stat.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
          stat.color === 'green' ? 'bg-green-500/20 text-green-400' :
          'bg-orange-500/20 text-orange-400'
        }`}>
          {stat.icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{stat.value}</div>
      <div className="text-sm text-gray-400">{stat.label}</div>
    </motion.div>
  );
}

// ============ EXAM COUNTDOWN ============
function ExamCountdown() {
  const exams = [
    { subject: 'Pharmacology II', daysLeft: 12, urgency: 'high' },
    { subject: 'Pharmaceutics', daysLeft: 24, urgency: 'medium' },
    { subject: 'Medicinal Chemistry', daysLeft: 38, urgency: 'low' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      data-testid="exam-countdown"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#3B31B8]" />
          Your Upcoming Exams
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-lg font-semibold text-sm transition-all" data-testid="add-exam-btn">
          <Plus className="w-4 h-4" />
          Add Exam
        </button>
      </div>

      <div className="space-y-4">
        {exams.map((exam, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              exam.urgency === 'high' ? 'bg-red-500/10 border-red-500/30' :
              exam.urgency === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-green-500/10 border-green-500/30'
            }`}
            data-testid={`exam-${index}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                exam.urgency === 'high' ? 'bg-red-500/20' :
                exam.urgency === 'medium' ? 'bg-amber-500/20' :
                'bg-green-500/20'
              }`}>
                <Clock className={`w-5 h-5 ${
                  exam.urgency === 'high' ? 'text-red-400' :
                  exam.urgency === 'medium' ? 'text-amber-400' :
                  'text-green-400'
                }`} />
              </div>
              <div>
                <div className="font-bold">{exam.subject}</div>
                <div className="text-sm text-gray-400">Semester 3</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                exam.urgency === 'high' ? 'text-red-400' :
                exam.urgency === 'medium' ? 'text-amber-400' :
                'text-green-400'
              }`}>
                {exam.daysLeft}
              </div>
              <div className="text-sm text-gray-400">days left</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============ RECENTLY DOWNLOADED ============
function RecentlyDownloaded() {
  const downloads = [
    { subject: 'Pharmacology I Notes', date: '2 hours ago', size: '4.2 MB' },
    { subject: 'Pharmaceutics II Complete', date: 'Yesterday', size: '5.8 MB' },
    { subject: 'Medicinal Chemistry', date: '3 days ago', size: '3.1 MB' },
    { subject: 'Clinical Pharmacy', date: '5 days ago', size: '6.4 MB' },
    { subject: 'Pharmaceutical Analysis', date: '1 week ago', size: '4.7 MB' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      data-testid="recent-downloads"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Download className="w-6 h-6 text-[#3B31B8]" />
          Recently Downloaded
        </h2>
        <Link to="/notes" className="text-[#3B31B8] hover:text-[#4d42d4] font-semibold text-sm flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {downloads.map((download, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            data-testid={`download-${index}`}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#3B31B8]/20 rounded-lg">
                <FileText className="w-5 h-5 text-[#3B31B8]" />
              </div>
              <div>
                <div className="font-semibold">{download.subject}</div>
                <div className="text-sm text-gray-400">{download.date} • {download.size}</div>
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" data-testid={`redownload-${index}`}>
              <Download className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============ AI SUMMARY TRACKER ============
function AISummaryTracker({ plan, summariesUsed }: { plan: string, summariesUsed: number }) {
  const isUnlimited = plan === 'Pro' || plan === 'Elite';
  const limit = isUnlimited ? 'unlimited' : 3;
  const percentage = isUnlimited ? 0 : (summariesUsed / 3) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      data-testid="ai-summary-tracker"
    >
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-[#3B31B8]" />
        AI Summary Usage
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">
            {summariesUsed} of {limit} summaries used this month
          </span>
          {!isUnlimited && (
            <span className="text-[#3B31B8] font-bold">{percentage.toFixed(0)}%</span>
          )}
        </div>
        {!isUnlimited && (
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B31B8] to-[#6366F1]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
        {isUnlimited && (
          <div className="px-3 py-2 bg-[#3B31B8]/20 text-[#3B31B8] rounded-lg text-sm font-semibold text-center">
            ✨ Unlimited Summaries
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 rounded-xl mb-4">
        <div className="text-xs text-gray-400 mb-1">Last Summary</div>
        <div className="font-semibold">Pharmacology I — Chapter 3 Summary</div>
        <div className="text-sm text-gray-400 mt-1">Generated 2 hours ago</div>
      </div>

      <Link
        to="/summarizer"
        className="block w-full text-center px-4 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-xl font-bold transition-all"
        data-testid="generate-summary-btn"
      >
        Generate New Summary
      </Link>
    </motion.div>
  );
}

// ============ MOCK TEST CHART ============
function MockTestChart() {
  const testScores = [
    { subject: 'Pharmacology', score: 78 },
    { subject: 'Pharmaceutics', score: 85 },
    { subject: 'DSA', score: 62 },
    { subject: 'DBMS', score: 91 },
    { subject: 'Thermodynamics', score: 74 },
  ];

  const maxScore = 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      data-testid="mock-test-chart"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#3B31B8]" />
          Mock Test Performance
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        {testScores.map((test, index) => (
          <div key={index} data-testid={`test-score-${index}`}>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">{test.subject}</span>
              <span className="font-bold text-[#3B31B8]">{test.score}%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(test.score / maxScore) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full bg-gradient-to-r from-[#3B31B8] to-[#6366F1] rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/quiz"
        className="block w-full text-center px-4 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-xl font-bold transition-all"
        data-testid="take-test-btn"
      >
        Take New Test
      </Link>
    </motion.div>
  );
}

// ============ STUDY GROUPS ============
function StudyGroups({ plan }: { plan: string }) {
  const isElite = plan === 'Elite';

  if (!isElite) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        data-testid="study-groups-locked"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Study Groups</h3>
          <p className="text-gray-400 mb-4">Upgrade to Elite to join study groups 🔒</p>
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-all"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Elite
          </Link>
        </div>
      </motion.div>
    );
  }

  const groups = [
    { name: 'B.Pharma Sem 3', members: 24, lastActivity: '2 hours ago' },
    { name: 'Pharmacology Study Circle', members: 18, lastActivity: '5 hours ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      data-testid="study-groups"
    >
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-[#3B31B8]" />
        Study Groups
      </h2>

      <div className="space-y-3">
        {groups.map((group, index) => (
          <div
            key={index}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            data-testid={`study-group-${index}`}
          >
            <div className="font-semibold mb-2">{group.name}</div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {group.members} members
              </span>
              <span>•</span>
              <span>{group.lastActivity}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============ QUICK ACTIONS SIDEBAR ============
function QuickActionsSidebar({ selectedNav, setSelectedNav }: { selectedNav: string, setSelectedNav: (nav: string) => void }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, link: '/dashboard' },
    { id: 'notes', label: 'Browse Notes', icon: <BookOpen className="w-5 h-5" />, link: '/notes' },
    { id: 'summarizer', label: 'AI Summary', icon: <Brain className="w-5 h-5" />, link: '/summarizer' },
    { id: 'quiz', label: 'Mock Tests', icon: <FileText className="w-5 h-5" />, link: '/quiz' },
    { id: 'exams', label: 'Exam Schedule', icon: <Calendar className="w-5 h-5" />, link: '#' },
    { id: 'subscription', label: 'Subscription', icon: <Crown className="w-5 h-5" />, link: '/premium' },
  ];

  return (
    <aside className="hidden lg:block w-64 border-r border-white/10 p-6 sticky top-20 h-[calc(100vh-5rem)]" data-testid="sidebar">
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Quick Actions</h3>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => setSelectedNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                selectedNav === item.id
                  ? 'bg-[#3B31B8] text-white shadow-lg shadow-[#3B31B8]/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              data-testid={`sidebar-${item.id}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">Pro Tip</span>
        </div>
        <p className="text-sm text-white/80">
          Use AI summaries to quickly review before exams!
        </p>
      </div>
    </aside>
  );
}

// ============ MOBILE BOTTOM NAV ============
function MobileBottomNav({ selectedNav, setSelectedNav }: { selectedNav: string, setSelectedNav: (nav: string) => void }) {
  const navItems = [
    { id: 'dashboard', icon: <BarChart3 className="w-5 h-5" />, link: '/dashboard' },
    { id: 'notes', icon: <BookOpen className="w-5 h-5" />, link: '/notes' },
    { id: 'summarizer', icon: <Brain className="w-5 h-5" />, link: '/summarizer' },
    { id: 'quiz', icon: <FileText className="w-5 h-5" />, link: '/quiz' },
    { id: 'subscription', icon: <Settings className="w-5 h-5" />, link: '/premium' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0F1E] border-t border-white/10 px-4 py-3 z-50" data-testid="mobile-nav">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            onClick={() => setSelectedNav(item.id)}
            className={`p-3 rounded-xl transition-all ${
              selectedNav === item.id
                ? 'bg-[#3B31B8] text-white'
                : 'text-gray-400'
            }`}
            data-testid={`mobile-nav-${item.id}`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
}
