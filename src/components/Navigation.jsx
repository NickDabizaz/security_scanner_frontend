import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, SearchCode, User, LogOut, Coins } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('grfyn_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('grfyn_token');
    localStorage.removeItem('grfyn_user');
    navigate('/');
  };

  return (
    <nav className="border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group text-white">
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 group-hover:shadow-glass-accent transition-all duration-300">
              <img 
                src="/grfyn_logo.png" 
                className="w-8 h-8 rounded-lg shrink-0" 
                alt="GRFYN Logo" 
              />
            </div>
            <div>
              <span className="font-bold tracking-wider text-lg font-mono">GRFYN</span>
              <span className="text-blue-400 text-xs block font-semibold -mt-1 uppercase tracking-widest">Scanner</span>
            </div>
          </NavLink>
        </div>

        {/* Middle Navigation Routes */}
        <div className="flex flex-wrap items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/scan/new"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <SearchCode className="w-4 h-4" />
            <span>New Scan</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>Account</span>
          </NavLink>
        </div>

        {/* User context & logouts */}
        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
          <div className="flex items-center gap-3">
            {/* Credit Pill */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyber-800 border border-white/5 text-slate-300 text-xs font-semibold">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.credit ?? 0} Cr</span>
            </div>

            {/* Plan Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user.plan === 'PRO'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glass-accent'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}
            >
              {user.plan ?? 'FREE'}
            </span>

            {/* Operator Label */}
            <span className="text-sm font-medium text-slate-300 hidden lg:inline">
              Operator: <b className="text-white">{user.username}</b>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 border border-transparent hover:border-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
