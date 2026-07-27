import { 
  Users, 
  FileText, 
  Activity, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  AlertCircle,
  FileCheck,
  FolderLock
} from 'lucide-react';

/**
 * Metric Card Component
 */
function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex justify-between items-start">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white m-0 leading-none">{value}</h3>
        <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
          <TrendingUp className="h-3 w-3" />
          <span>{change} this month</span>
        </p>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-current/10 text-current`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

/**
 * 1. Dashboard View
 */
export function Dashboard() {
  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">System Dashboard</h1>
        <p className="text-xs text-zinc-400">Welcome to your Assura underwriting portal. Here is a summary of active insurance metrics.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Policies" value="1,842" change="+12%" icon={FileText} color="text-indigo-500" />
        <StatCard title="Total Customers" value="954" change="+8.5%" icon={Users} color="text-violet-500" />
        <StatCard title="Claims Pending" value="48" change="-4.1%" icon={Activity} color="text-amber-500" />
        <StatCard title="Premium Revenue" value="$284.9K" change="+15%" icon={CreditCard} color="text-emerald-500" />
      </div>

      {/* Quick Actions & Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Underwriting Decisions</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium cursor-pointer transition">
              <Plus className="h-3.5 w-3.5" />
              <span>Create Policy</span>
            </button>
          </div>
          <div className="text-center py-12 text-zinc-400 space-y-3">
            <ShieldCheck className="h-10 w-10 text-indigo-500/80 mx-auto" />
            <p className="text-xs">Database sync successful. No items requiring immediate supervisor override.</p>
          </div>
        </div>

        {/* Sidebar Alerts Panel */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">System Logs</h3>
          <div className="space-y-4">
            <div className="flex gap-3 text-left">
              <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-white">Claim Review Required</p>
                <p className="text-[10px] text-zinc-400">Claim #CLM-9231 exceeded standard threshold levels.</p>
              </div>
            </div>
            <div className="flex gap-3 text-left">
              <FileCheck className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-white">Policy #POL-8432 Issued</p>
                <p className="text-[10px] text-zinc-400">Auto-generated contract has been dispatched to user email.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Customers View
 */
export function Customers() {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Customer Database</h1>
          <p className="text-xs text-zinc-400">View and manage policies associated with client accounts.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer transition">
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xs text-center py-16">
        <Users className="h-12 w-12 text-zinc-400/80 mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No Customers loaded</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">Create your first client account profile to begin managing policy details.</p>
      </div>
    </div>
  );
}

/**
 * 3. Policies View
 */
export function Policies() {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Policies</h1>
          <p className="text-xs text-zinc-400">Manage, draft, and finalize client coverage contracts.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer transition">
          <Plus className="h-4 w-4" />
          <span>Issue Policy</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xs text-center py-16">
        <FileText className="h-12 w-12 text-zinc-400/80 mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No Policies Active</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">Create a policy contract and link it with an existing customer account.</p>
      </div>
    </div>
  );
}

/**
 * 4. Claims View
 */
export function Claims() {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Claims Adjustments</h1>
          <p className="text-xs text-zinc-400">Monitor reported claims, upload damage documents, and execute payouts.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer transition">
          <Plus className="h-4 w-4" />
          <span>Submit Claim</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xs text-center py-16">
        <Activity className="h-12 w-12 text-zinc-400/80 mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No Claims in Queue</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">All submitted claims are resolved or archived under ledger history.</p>
      </div>
    </div>
  );
}

/**
 * 5. Policy Types View
 */
export function PolicyTypes() {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Policy Products & Types</h1>
          <p className="text-xs text-zinc-400">Configure parameters for Health, Automotive, Commercial, and Property coverages.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium cursor-pointer transition">
          <Plus className="h-4 w-4" />
          <span>Create Product</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xs text-center py-16">
        <FolderLock className="h-12 w-12 text-zinc-400/80 mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No Custom Products</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">Add specialized coverage types, deductibles, and risk coefficients.</p>
      </div>
    </div>
  );
}

/**
 * 6. Payments View
 */
export function Payments() {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Premium Ledger</h1>
          <p className="text-xs text-zinc-400">Verify monthly drafts, client premium payments, and commission logs.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xs text-center py-16">
        <CreditCard className="h-12 w-12 text-zinc-400/80 mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No Premium Invoices</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">Payment ledgers are generated dynamically when policies transition to active state.</p>
      </div>
    </div>
  );
}
