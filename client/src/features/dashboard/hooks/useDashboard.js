import { useState } from 'react'

import { storage } from '../../../lib/storage'
import { policyService } from '../../policy/services/policy.service'
import { claimService } from '../../claims/services/claim.service'
import { customerService } from '../../customers/services/customer.service'
import { paymentService } from '../../payments/services/payment.service'

export function useDashboard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPolicies: 0,
    activePolicies: 0,
    totalPremium: 0,
    pendingClaims: 0,
    activeCover: 0
  })
  const [recentPolicies, setRecentPolicies] = useState([])
  const [recentClaims, setRecentClaims] = useState([])
  const [alerts, setAlerts] = useState([])
  const [lineChartData, setLineChartData] = useState({ labels: [], collections: [], claims: [] })
  const [policyTypeDistribution, setPolicyTypeDistribution] = useState({})
  const [recentActivities, setRecentActivities] = useState([])

  const fetchDashboardData = async () => {
    const user = storage.getUser()
    if (!user || user.role === 'CUSTOMER') {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [policiesData, claimsData, customersData, paymentsData] = await Promise.all([
        policyService.getPolicies().catch(() => ({ data: [] })),
        claimService.getClaims().catch(() => ({ data: [] })),
        customerService.getCustomers().catch(() => ({ data: [] })),
        paymentService.getPayments().catch(() => ({ data: [] }))
      ])

      const policies = policiesData.data || []
      const claims = claimsData.data || []
      const customers = customersData.data || []
      const payments = paymentsData.data || []

      const activePolicies = policies.filter((p) => p.status === 'ACTIVE')
      const paidPayments = payments.filter((p) => p.status === 'PAID')

      const totalPremium = paidPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
      const pendingClaims = claims.filter((c) => c.status === 'PENDING').length
      const activeCover = activePolicies.reduce((sum, p) => sum + parseFloat(p.coverageAmount || 0), 0)

      // Calculate Dynamic Month-over-Month (MoM) Trends
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
      const lastMonth = lastMonthDate.getMonth()
      const lastMonthYear = lastMonthDate.getFullYear()

      const isInMonth = (dateStr, m, y) => {
        if (!dateStr) return false
        const d = new Date(dateStr)
        return d.getMonth() === m && d.getFullYear() === y
      }

      const calculateTrend = (currentVal, lastVal) => {
        if (lastVal === 0) {
          if (currentVal === 0) return { trend: '0.0%', isPositive: true }
          return { trend: '+100.0%', isPositive: true }
        }
        const diffPercent = ((currentVal - lastVal) / lastVal) * 100
        const formatted = (diffPercent >= 0 ? '+' : '') + diffPercent.toFixed(1) + '%'
        return { trend: formatted, isPositive: diffPercent >= 0 }
      }

      const currActivePolicies = activePolicies.filter(p => isInMonth(p.createdAt, currentMonth, currentYear)).length
      const prevActivePolicies = activePolicies.filter(p => isInMonth(p.createdAt, lastMonth, lastMonthYear)).length
      const activePoliciesTrend = calculateTrend(currActivePolicies, prevActivePolicies)

      const currPremium = paidPayments.filter(p => isInMonth(p.paymentDate || p.createdAt, currentMonth, currentYear)).reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
      const prevPremium = paidPayments.filter(p => isInMonth(p.paymentDate || p.createdAt, lastMonth, lastMonthYear)).reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
      const premiumTrend = calculateTrend(currPremium, prevPremium)

      const currCover = activePolicies.filter(p => isInMonth(p.createdAt, currentMonth, currentYear)).reduce((sum, p) => sum + parseFloat(p.coverageAmount || 0), 0)
      const prevCover = activePolicies.filter(p => isInMonth(p.createdAt, lastMonth, lastMonthYear)).reduce((sum, p) => sum + parseFloat(p.coverageAmount || 0), 0)
      const coverTrend = calculateTrend(currCover, prevCover)

      const currClaims = claims.filter(c => isInMonth(c.createdAt, currentMonth, currentYear)).length
      const prevClaims = claims.filter(c => isInMonth(c.createdAt, lastMonth, lastMonthYear)).length
      const claimsTrend = calculateTrend(currClaims, prevClaims)

      setStats({
        totalCustomers: customers.length,
        totalPolicies: policies.length,
        activePolicies: activePolicies.length,
        totalPremium,
        pendingClaims,
        activeCover,
        trends: {
          activePolicies: activePoliciesTrend,
          premium: premiumTrend,
          cover: coverTrend,
          claims: claimsTrend
        }
      })

      // Calculate System Alerts dynamically
      const computedAlerts = []

      // 1. Policy Expiry Alerts
      policies.forEach((p) => {
        if (p.status === 'ACTIVE') {
          const daysLeft = Math.ceil((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24))
          if (daysLeft < 0) {
            computedAlerts.push({
              id: `expired-${p.id}`,
              type: 'EXPIRED',
              text: `Policy ${p.policyNumber} has expired since ${new Date(p.endDate).toLocaleDateString()}`,
              severity: 'error',
              link: `/policies/${p.id}`
            })
          } else if (daysLeft <= 30) {
            computedAlerts.push({
              id: `expiring-${p.id}`,
              type: 'EXPIRY',
              text: `Policy ${p.policyNumber} is expiring in ${daysLeft} days (${new Date(p.endDate).toLocaleDateString()})`,
              severity: 'warning',
              link: `/policies/${p.id}`
            })
          }
        }
      })

      // 2. Overdue & Upcoming Payment Alerts
      payments.forEach((pay) => {
        if (pay.status === 'OVERDUE') {
          computedAlerts.push({
            id: `overdue-${pay.id}`,
            type: 'OVERDUE',
            text: `Premium payment of $${parseFloat(pay.amount).toLocaleString()} for ${pay.policy?.policyNumber || 'Policy'} is OVERDUE since ${new Date(pay.paymentDate).toLocaleDateString()}`,
            severity: 'error',
            link: pay.policyId ? `/policies/${pay.policyId}` : '/payments'
          })
        } else if (pay.status === 'PENDING') {
          const daysLeft = Math.ceil((new Date(pay.paymentDate) - new Date()) / (1000 * 60 * 60 * 24))
          if (daysLeft < 0) {
            computedAlerts.push({
              id: `overdue-pending-${pay.id}`,
              type: 'OVERDUE',
              text: `Premium payment of $${parseFloat(pay.amount).toLocaleString()} for ${pay.policy?.policyNumber || 'Policy'} is overdue since ${new Date(pay.paymentDate).toLocaleDateString()}`,
              severity: 'error',
              link: pay.policyId ? `/policies/${pay.policyId}` : '/payments'
            })
          } else if (daysLeft <= 7) {
            computedAlerts.push({
              id: `due-${pay.id}`,
              type: 'UPCOMING_DUE',
              text: `Upcoming premium payment of $${parseFloat(pay.amount).toLocaleString()} for ${pay.policy?.policyNumber || 'Policy'} is due on ${new Date(pay.paymentDate).toLocaleDateString()}`,
              severity: 'warning',
              link: pay.policyId ? `/policies/${pay.policyId}` : '/payments'
            })
          }
        }
      })

      // 3. Claims awaiting action
      const pendingClaimsList = claims.filter((c) => c.status === 'PENDING')
      if (pendingClaimsList.length > 0) {
        computedAlerts.push({
          id: 'claim-review-alert',
          type: 'CLAIM_REVIEW',
          text: `There are ${pendingClaimsList.length} pending claims requiring agent verification and approval reviews.`,
          severity: 'info',
          link: '/claims'
        })
      }

      // 4. Policy Applications Awaiting Agent Review
      const pendingPolicyApps = policies.filter((p) => p.status === 'PENDING')
      if (pendingPolicyApps.length > 0) {
        computedAlerts.push({
          id: 'policy-application-alert',
          type: 'POLICY_REVIEW',
          text: `There are ${pendingPolicyApps.length} pending policy applications awaiting agent review and approval.`,
          severity: 'warning',
          link: '/policies'
        })
      }

      // 4. Compute Policy Type Distribution
      const typeCounts = {}
      policies.forEach((p) => {
        const typeName = p.policyType?.name || 'Other'
        typeCounts[typeName] = (typeCounts[typeName] || 0) + 1
      })
      setPolicyTypeDistribution(typeCounts)

      // 5. Compute Line Chart Dataset (Last 6 Months)
      const labels = []
      const chartCollectionsData = []
      const chartClaimsData = []
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        labels.push(monthNames[d.getMonth()])
        
        const m = d.getMonth()
        const y = d.getFullYear()
        
        const monthPayments = payments.filter((pay) => {
          const pDate = new Date(pay.paymentDate)
          return pay.status === 'PAID' && pDate.getMonth() === m && pDate.getFullYear() === y
        })
        chartCollectionsData.push(monthPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))

        const monthClaims = claims.filter((c) => {
          const cDate = new Date(c.createdAt)
          return c.status === 'APPROVED' && cDate.getMonth() === m && cDate.getFullYear() === y
        })
        chartClaimsData.push(monthClaims.reduce((sum, c) => sum + parseFloat(c.claimAmount || 0), 0))
      }
      setLineChartData({ labels, collections: chartCollectionsData, claims: chartClaimsData })

      // 6. Compile Real Recent Activities
      const activities = []
      policies.forEach((p) => {
        activities.push({
          id: `policy-${p.id}`,
          text: `New Policy created: ${p.policyType?.name || 'Policy'} (${p.policyNumber})`,
          date: new Date(p.createdAt),
          type: 'policy'
        })
      })
      claims.forEach((c) => {
        let action = 'filed'
        if (c.status === 'APPROVED') action = 'approved'
        else if (c.status === 'REJECTED') action = 'rejected'
        activities.push({
          id: `claim-${c.id}`,
          text: `Claim request ${c.claimNumber} ${action} for $${parseFloat(c.claimAmount).toLocaleString()}`,
          date: new Date(c.updatedAt || c.createdAt),
          type: c.status === 'APPROVED' ? 'claim_approved' : 'claim'
        })
      })
      payments.forEach((pay) => {
        if (pay.status === 'PAID') {
          activities.push({
            id: `payment-${pay.id}`,
            text: `Premium payment of $${parseFloat(pay.amount).toLocaleString()} verified for ${pay.policy?.policyNumber || 'Policy'}`,
            date: new Date(pay.updatedAt || pay.createdAt),
            type: 'payment'
          })
        }
      })
      customers.forEach((cust) => {
        activities.push({
          id: `cust-${cust.id}`,
          text: `New customer profile registered: ${cust.fullName}`,
          date: new Date(cust.createdAt),
          type: 'customer'
        })
      })
      activities.sort((a, b) => b.date - a.date)

      const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)
        if (seconds < 60) return 'Just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
      }

      const recentActivitiesFormatted = activities.slice(0, 5).map((act) => ({
        id: act.id,
        text: act.text,
        time: formatTimeAgo(act.date),
        type: act.type
      }))
      setRecentActivities(recentActivitiesFormatted)

      setAlerts(computedAlerts)
      setRecentPolicies(policies.slice(0, 5))
      setRecentClaims(claims.slice(0, 5))

      return {
        stats: {
          totalCustomers: customers.length,
          totalPolicies: policies.length,
          activePolicies: activePolicies.length,
          totalPremium,
          pendingClaims,
          activeCover
        },
        recentPolicies: policies.slice(0, 5),
        recentClaims: claims.slice(0, 5),
        alerts: computedAlerts
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to compile dashboard metrics.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
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
  }
}
