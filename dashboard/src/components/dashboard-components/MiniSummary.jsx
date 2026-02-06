import React from 'react'
import { Wallet, PackageCheck, TrendingUp, AlertTriangle, BarChart4, UserPlus } from 'lucide-react'
import { useSelector } from 'react-redux'

const MiniSummary = () => {
  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalCustomers = 0,
  } = useSelector((state) => state.admin || {})

  const cards = [
    {
      icon: <Wallet className="w-6 h-6" />,
      label: 'Total Revenue',
      value: `৳${(totalRevenue || 0).toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: <PackageCheck className="w-6 h-6" />,
      label: 'Total Orders',
      value: (totalOrders || 0).toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: <UserPlus className="w-6 h-6" />,
      label: 'Total Customers',
      value: (totalCustomers || 0).toLocaleString(),
      change: '+5.1%',
      changeType: 'positive',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Growth',
      value: '24.5%',
      change: '+2.3%',
      changeType: 'positive',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div key={index} className="mini-summary-card">
          <div className={`mini-summary-icon ${card.bgColor} dark:bg-opacity-20`}>
            <span className={card.iconColor}>{card.icon}</span>
          </div>
          <div>
            <p className="mini-summary-label">{card.label}</p>
            <p className="mini-summary-value">{card.value}</p>
            <span className={`mini-summary-change ${card.changeType}`}>{card.change}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MiniSummary
