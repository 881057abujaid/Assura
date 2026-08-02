import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, LifeBuoy, Users, CreditCard, Shield, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Info, Bell, FolderOpen } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

import { useAuth } from '../../../context/AuthContext'
import { Card, Alert, Spinner, Badge } from '../../../components/ui'
import { useDashboard } from '../hooks/useDashboard'
import { useCustomerProfile } from '../../customers/hooks/useCustomerProfile'
import { ROUTES } from '../../../config/routes'

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

// ─── Customer Dashboard ───────────────────────────────────────────────────────

function CustomerDashboard({ user }) {
  const { fetchMyProfile, profile, loading, error } = useCustomerProfile()

  useEffect(() => {
    fetchMyProfile()
  }, [])

  const policies = profile?.policies || []
  const documents = profile?.documents || []
  const activePolicies = policies.filter(p => p.status === 'ACTIVE')
  const allClaims = policies.flatMap(p => p.claims || [])
  const pendingClaims = allClaims.filter(c => c.status === 'PENDING')

  const statCards = [
    {
      title: 'Total Policies',
      value: policies.length,
      sub: 'insurance policies',
      icon: FileText,
      color: 'text-primary bg-primary/10',
      link: ROUTES.MY_POLICIES
    },
    {
      title: 'Active Policies',
      value: activePolicies.length,
      sub: 'currently active',
      icon: Shield,
      color: 'text-success bg-success/10',
      link: ROUTES.MY_POLICIES
    },
    {
      title: 'Pending Claims',
      value: pendingClaims.length,
      sub: 'awaiting review',
      icon: LifeBuoy,
      color: 'text-warning bg-warning/10',
      link: ROUTES.MY_CLAIMS
    },
    {
      title: 'My Documents',
      value: documents.length,
      sub: 'uploaded files',
      icon: FolderOpen,
      color: 'text-secondary bg-secondary/10',
      link: ROUTES.MY_DOCUMENTS
    },
  ]

  const getStatusVariant = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'EXPIRED': return 'error'
      case 'CANCELLED': return 'error'
      default: return 'warning'
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">
            Welcome back, {profile?.fullName || user?.email} 👋
          </h1>
          <p className="text-text-secondary mt-1">
            Your insurance overview — all in one place.
          </p>
        </div>
        <Link
          to={ROUTES.PROFILE}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-xl text-sm hover:bg-primary/20 transition-all"
        >
          <Shield className="h-4 w-4" />
          My Profile
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} to={card.link}>
              <Card className="hover:border-primary/30 flex items-center justify-between p-6 cursor-pointer group transition-all">
                <div className="space-y-1.5">
                  <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold block">
                    {card.title}
                  </span>
                  <span className="text-3xl font-bold text-text-primary block">
                    {card.value}
                  </span>
                  <span className="text-xs text-text-secondary">{card.sub}</span>
                </div>
                <div className={`p-4 rounded-2xl shrink-0 ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Policies + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Policies Table */}
        <Card className="lg:col-span-2 p-0 overflow-hidden hover:border-border-custom">
          <div className="p-5 border-b border-border-custom flex items-center justify-between bg-bg-base">
            <h2 className="text-lg font-bold text-text-primary">My Policies</h2>
            <Link to={ROUTES.MY_POLICIES} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {policies.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-secondary">
                No policies assigned yet. Contact your agent.
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-text-secondary uppercase border-b border-border-custom bg-slate-50/50">
                    <th className="py-3 px-5">Policy No.</th>
                    <th className="py-3 px-5">Type</th>
                    <th className="py-3 px-5">Premium</th>
                    <th className="py-3 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom text-text-primary">
                  {policies.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-5 font-mono font-semibold text-primary text-xs">
                        {p.policyNumber}
                      </td>
                      <td className="py-3 px-5">{p.policyType?.name || 'N/A'}</td>
                      <td className="py-3 px-5 font-mono">
                        ${parseFloat(p.premiumAmount).toLocaleString()}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:border-border-custom p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'View My Policies', sub: 'Check coverage & details', path: ROUTES.MY_POLICIES, icon: FileText, color: 'text-primary bg-primary/10' },
              { label: 'My Claims', sub: 'Track claim status', path: ROUTES.MY_CLAIMS, icon: LifeBuoy, color: 'text-warning bg-warning/10' },
              { label: 'My Documents', sub: 'View uploaded files', path: ROUTES.MY_DOCUMENTS, icon: FolderOpen, color: 'text-secondary bg-secondary/10' },
              { label: 'Edit Profile', sub: 'Update personal info', path: ROUTES.PROFILE, icon: Shield, color: 'text-success bg-success/10' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-border-custom"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${action.color}`}>
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-text-secondary">{action.sub}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recent Claims (if any) */}
      {allClaims.length > 0 && (
        <Card className="p-0 overflow-hidden hover:border-border-custom">
          <div className="p-5 border-b border-border-custom flex items-center justify-between bg-bg-base">
            <h2 className="text-lg font-bold text-text-primary">Recent Claims</h2>
            <Link to={ROUTES.MY_CLAIMS} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-text-secondary uppercase border-b border-border-custom bg-slate-50/50">
                  <th className="py-3 px-5">Claim No.</th>
                  <th className="py-3 px-5">Policy</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Reason</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom">
                {allClaims.slice(0, 4).map((c) => {
                  const relatedPolicy = policies.find(p => p.id === c.policyId)
                  const claimVariant = c.status === 'APPROVED' ? 'success' : c.status === 'REJECTED' ? 'error' : 'warning'
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-5 font-mono font-semibold text-primary text-xs">{c.claimNumber}</td>
                      <td className="py-3 px-5 font-mono text-xs">{relatedPolicy?.policyNumber || 'N/A'}</td>
                      <td className="py-3 px-5 font-mono">${parseFloat(c.claimAmount).toLocaleString()}</td>
                      <td className="py-3 px-5 truncate max-w-xs text-xs">{c.reason}</td>
                      <td className="py-3 px-5 text-right">
                        <Badge variant={claimVariant}>{c.status}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Main Dashboard (Admin/Agent) ─────────────────────────────────────────────

export function DashboardPage() {
  const {
    fetchDashboardData,
    stats,
    recentPolicies,
    recentClaims,
    alerts,
    lineChartData,
    policyTypeDistribution,
    recentActivities,
    loading,
    error
  } = useDashboard()
  const { user } = useAuth()

  const isCustomer = user?.role === 'CUSTOMER'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Delegate to customer dashboard
  if (isCustomer) {
    return <CustomerDashboard user={user} />
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>
  }

  const statCards = [
    {
      title: 'Active Policies',
      value: stats.activePolicies,
      sub: `of ${stats.totalPolicies} total policies`,
      trend: stats.trends?.activePolicies?.trend || '+0.0%',
      isPositive: stats.trends?.activePolicies?.isPositive ?? true,
      icon: FileText,
      color: 'text-primary bg-primary/10'
    },
    {
      title: 'Premium Collections',
      value: `$${stats.totalPremium.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      sub: 'total paid premiums',
      trend: stats.trends?.premium?.trend || '+0.0%',
      isPositive: stats.trends?.premium?.isPositive ?? true,
      icon: CreditCard,
      color: 'text-success bg-success/10'
    },
    {
      title: 'Active Cover',
      value: `$${(stats.activeCover / 1000).toFixed(0)}k`,
      sub: 'total guaranteed limit',
      trend: stats.trends?.cover?.trend || '+0.0%',
      isPositive: stats.trends?.cover?.isPositive ?? true,
      icon: Shield,
      color: 'text-secondary bg-secondary/10'
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims,
      sub: 'claims requiring review',
      trend: stats.trends?.claims?.trend || '+0.0%',
      isPositive: !(stats.trends?.claims?.isPositive),
      icon: LifeBuoy,
      color: 'text-warning bg-warning/10'
    }
  ]

  // Line Chart Dataset
  const lineData = {
    labels: lineChartData.labels.length > 0 ? lineChartData.labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Premium Collections',
        data: lineChartData.collections.length > 0 ? lineChartData.collections : [0, 0, 0, 0, 0, 0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#3B82F6',
        pointHoverRadius: 6
      },
      {
        label: 'Claims Settled',
        data: lineChartData.claims.length > 0 ? lineChartData.claims : [0, 0, 0, 0, 0, 0],
        borderColor: '#EF4444',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#EF4444',
        pointHoverRadius: 5
      }
    ]
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          font: {
            family: 'Plus Jakarta Sans',
            size: 12,
            weight: '500'
          },
          color: '#475569'
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#0F172A',
        titleFont: { family: 'Plus Jakarta Sans', size: 13 },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 }
      }
    },
    scales: {
      y: {
        grid: {
          color: '#F1F5F9'
        },
        ticks: {
          font: { family: 'JetBrains Mono', size: 11 },
          color: '#64748B',
          callback: (value) => `$${value}`
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 11 },
          color: '#64748B'
        }
      }
    }
  }

  // Doughnut Chart Dataset (Distribution)
  const doughnutLabels = Object.keys(policyTypeDistribution)
  const doughnutValues = Object.values(policyTypeDistribution)

  const doughnutData = {
    labels: doughnutLabels.length > 0 ? doughnutLabels : ['No active policies'],
    datasets: [
      {
        data: doughnutValues.length > 0 ? doughnutValues : [1],
        backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#64748B', '#EC4899'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: '500'
          },
          color: '#475569'
        }
      }
    }
  }

  // Activities mapped directly from live backend records
  // recentActivities is now retrieved directly from useDashboard hook

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Overview</h1>
        <p className="text-text-secondary">Real-time indicators and operational summary metrics.</p>
      </div>

      {/* System Alerts & Notifications Center */}
      {!isCustomer && alerts && alerts.length > 0 && (
        <Card className="border-border-custom bg-bg-base p-5 hover:border-border-custom transition-all">
          <div className="flex items-center gap-2 border-b border-border-custom pb-3 mb-4">
            <Bell className="h-5 w-5 text-primary" strokeWidth={2} />
            <h2 className="text-lg font-bold text-text-primary">System Alerts & Notifications Center</h2>
            <span className="ml-auto bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold">
              {alerts.length} Action Required
            </span>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {alerts.map((alert) => {
              const SeverityIcon = alert.severity === 'error' ? AlertCircle : alert.severity === 'warning' ? AlertTriangle : Info
              const severityColor = alert.severity === 'error' ? 'text-error bg-error/5 border-error/20' : alert.severity === 'warning' ? 'text-warning bg-warning/5 border-warning/20' : 'text-primary bg-primary/5 border-primary/20'
              return (
                <div
                  key={alert.id}
                  className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-sm transition-all ${severityColor}`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <SeverityIcon className="h-5 w-5 shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="font-medium text-text-primary leading-relaxed break-words">{alert.text}</span>
                  </div>
                  {alert.link && (
                    <Link
                      to={alert.link}
                      className="text-xs font-semibold text-primary shrink-0 hover:underline hover:text-primary/80 transition-colors mt-0.5"
                    >
                      Resolve Action
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="hover:border-border-custom flex items-center justify-between p-6">
              <div className="space-y-2">
                <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold block">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-text-primary block truncate">
                  {card.value}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    card.isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    {card.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {card.trend}
                  </span>
                  <span className="text-xs text-text-secondary truncate">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl shrink-0 ${card.color}`}>
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2 hover:border-border-custom p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Premium vs Claims Trend</h2>
              <p className="text-xs text-text-secondary mt-0.5">Comparison of revenue premium collections and payouts.</p>
            </div>
          </div>
          <div className="h-80 relative">
            <Line data={lineData} options={lineOptions} />
          </div>
        </Card>

        {/* Doughnut Chart */}
        <Card className="lg:col-span-1 hover:border-border-custom p-6">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Policy Types Distribution</h2>
            <p className="text-xs text-text-secondary mt-0.5">Breakdown of policy categories portfolio.</p>
          </div>
          <div className="h-80 relative mt-4">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </Card>
      </div>

      {/* Tables & Recent Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Policies (Table) */}
        <Card className="lg:col-span-2 p-0 overflow-hidden hover:border-border-custom">
          <div className="p-5 border-b border-border-custom flex items-center justify-between bg-bg-base">
            <h2 className="text-lg font-bold text-text-primary">Recent Policies</h2>
            <Link to={ROUTES.POLICIES} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentPolicies.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-secondary">
                No policies recorded.
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-text-secondary uppercase border-b border-border-custom bg-slate-50/50">
                    <th className="py-2 px-4">Policy No.</th>
                    <th className="py-2 px-4">Customer</th>
                    <th className="py-2 px-4">Premium</th>
                    <th className="py-2 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom text-text-primary">
                  {recentPolicies.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-semibold text-primary">
                        <Link to={`/policies/${p.id}`} className="hover:underline">
                          {p.policyNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4 truncate max-w-[150px]">
                        {p.customer?.fullName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        ${parseFloat(p.premiumAmount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={p.status === 'ACTIVE' ? 'success' : 'error'}>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Recent Activities (Timeline) */}
        <Card className="lg:col-span-1 hover:border-border-custom p-6">
          <div className="pb-3 border-b border-border-custom mb-4">
            <h2 className="text-lg font-bold text-text-primary">Recent Activities</h2>
            <p className="text-xs text-text-secondary mt-0.5">Real-time log of system modifications.</p>
          </div>

          <div className="relative border-l border-border-custom ml-3.5 space-y-6 py-2">
            {recentActivities.map((act, i) => (
              <div key={i} className="relative pl-6">
                <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary ring-4 ring-primary/10" />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-text-primary leading-tight">{act.text}</p>
                  <span className="text-[10px] text-text-secondary font-mono">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
