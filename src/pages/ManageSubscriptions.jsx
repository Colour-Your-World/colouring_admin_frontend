import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SuspendModal from '../components/SuspendModal'
import Pagination from '../components/Pagination'
import arrowLeft from '../assets/arrowLeft.svg'
import timer from '../assets/timer.svg'
import profile from '../assets/profile.svg'
import dollor from '../assets/dollor.svg'
import eye from '../assets/eye.svg'
import calendar from '../assets/calendar.svg'
import profileUser from '../assets/profileUser.svg'

const ManageSubscriptions = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState('Plan')
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false)
    const [selectedDuration, setSelectedDuration] = useState('This month')

    // Dropdown options
    const planOptions = [
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' }
    ]

    const durationOptions = [
        { id: 'this-month', label: 'This month' },
        { id: 'last-3-months', label: 'Last 3 months' },
        { id: 'custom', label: 'Custom' }
    ]
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [subscriptionToCancel, setSubscriptionToCancel] = useState(null)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Sample subscription data
    const subscriptions = [
        {
            id: 1,
            name: "Anita Rath",
            email: "opalschiller8@example.com",
            avatar: "/api/placeholder/34/34",
            plan: "Yearly • $999",
            startDate: "10-Sep-2025",
            renewalDate: "10-Sep-2026",
            status: "Active"
        },
        {
            id: 2,
            name: "Maria Lee",
            email: "maria@mail.com",
            plan: "Monthly • $99",
            startDate: "5-Sep-2025",
            renewalDate: "5-Oct-2025",
            status: "Active"
        },
        {
            id: 3,
            name: "Ruby Hilpert",
            email: "ruby.hilpert@example.com",
            avatar: "/api/placeholder/34/34",
            plan: "Yearly • $999",
            startDate: "15-Aug-2025",
            renewalDate: "15-Aug-2026",
            status: "Active"
        },
        {
            id: 4,
            name: "Joel Harris",
            email: "joel.harris@example.com",
            avatar: "/api/placeholder/34/34",
            plan: "Monthly • $99",
            startDate: "1-Sep-2025",
            renewalDate: "1-Oct-2025",
            status: "Active"
        },
        {
            id: 5,
            name: "Susan Durgan",
            email: "susan.durgan@example.com",
            avatar: "/api/placeholder/34/34",
            plan: "Yearly • $999",
            startDate: "20-Aug-2025",
            renewalDate: "20-Aug-2026",
            status: "Active"
        },
        {
            id: 6,
            name: "Antonio Cartwright",
            email: "antonio.cartwright@example.com",
            avatar: "/api/placeholder/34/34",
            plan: "Monthly • $99",
            startDate: "12-Sep-2025",
            renewalDate: "12-Oct-2025",
            status: "Active"
        },
        {
            id: 7,
            name: "Jill McCullough",
            email: "jill.mccullough@example.com",
            plan: "Yearly • $999",
            startDate: "8-Aug-2025",
            renewalDate: "8-Aug-2026",
            status: "Active"
        },
        {
            id: 8,
            name: "Sheila Pollich",
            email: "sheila.pollich@example.com",
            avatar: "/api/placeholder/34/34",
            plan: "Monthly • $99",
            startDate: "25-Aug-2025",
            renewalDate: "25-Sep-2025",
            status: "Active"
        },
        {
            id: 9,
            name: "Marco Veum",
            email: "marco.veum@example.com",
            plan: "Yearly • $999",
            startDate: "3-Sep-2025",
            renewalDate: "3-Sep-2026",
            status: "Active"
        },
        {
            id: 10,
            name: "Toni Parisian",
            email: "toni.parisian@example.com",
            avatar: "/api/placeholder/34/34",
            plan: "Monthly • $99",
            startDate: "18-Aug-2025",
            renewalDate: "18-Sep-2025",
            status: "Active"
        }
    ]

    const tabs = [
        { id: 'all', label: 'All Subscriptions' },
        { id: 'active', label: 'Active' },
        { id: 'expired', label: 'Expired / Canceled' }
    ]

    const handleViewUser = (subscription) => {
        navigate(`/users/${subscription.id}`)
    }

    const handleCancelSubscription = (subscription) => {
        setSubscriptionToCancel(subscription)
        setIsCancelModalOpen(true)
    }

    const handleConfirmCancel = () => {
        setIsCancelModalOpen(false)
        setSubscriptionToCancel(null)
        console.log('Subscription cancelled for:', subscriptionToCancel?.name)
    }

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan)
        setIsPlanDropdownOpen(false)
    }

    const handleDurationSelect = (duration) => {
        setSelectedDuration(duration)
        setIsDurationDropdownOpen(false)
    }

    const handleDateRangeSelect = () => {
        if (startDate && endDate) {
            console.log('Date range selected:', { startDate, endDate })
            setIsDatePickerOpen(false)
        }
    }

    const handleClearDateRange = () => {
        setStartDate('')
        setEndDate('')
        setIsDatePickerOpen(false)
    }

    const totalItems = subscriptions.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    
    // Calculate the subscriptions to display for current page
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentSubscriptions = subscriptions.slice(startIndex, endIndex)

    // Summary cards data
    const summaryCards = [
        {
            id: 'monthly',
            icon: timer,
            value: '240',
            label: 'Active Monthly',
            hasBadge: false
        },
        {
            id: 'yearly',
            icon: profile,
            value: '100',
            label: 'Active Yearly',
            hasBadge: false
        },
        {
            id: 'revenue',
            icon: dollor,
            value: '$4,560',
            label: 'Total Revenue',
            hasBadge: true,
            badgeText: 'This month'
        }
    ]

    return (
        <>
            <div className="min-h-screen bg-[#FBFFF5]">
                {/* Header */}
                <Header />

                {/* Page Navigation */}
                <div className="mx-auto px-4 py-6 max-w-7xl">
                    <div className="flex items-center gap-3">
                        <img
                            src={arrowLeft}
                            alt="Back"
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => navigate(-1)}
                        />
                        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Active Subscriptions</h1>
                    </div>
                </div>

                <div className="mx-auto px-4 max-w-7xl">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {summaryCards.map((card) => (
                        <div key={card.id} className={`rounded-2xl border-common p-4 sm:p-6${card.hasBadge ? ' relative' : ''}`}>
                            {card.hasBadge && (
                                <div className="absolute top-3 right-3">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#00673A1A] text-[#00673A] border border-[#00673A]">
                                        {card.badgeText}
                                    </span>
                                </div>
                            )}
                            <div className={`flex items-center gap-4 ${card.hasBadge ? '' : ''}`}>
                                <div className="w-16 h-16 rounded-xl overflow-hidden">
                                    <img src={card.icon} alt={card.label} className="w-full h-full" />
                                </div>
                                <div>
                                    <div className="text-2xl sm:text-3xl font-bold text-primary">{card.value}</div>
                                    <div className="text-sm text-secondary">{card.label}</div>
                                </div>
                            </div>  
                        </div>
                    ))}
                </div>

                {/* Subscription Table Card */}
                <div className="rounded-2xl border-common p-4 sm:p-6">
                        {/* Header */}
                        <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4 sm:mb-6">All Users</h2>

                        {/* Tabs and Filters */}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4 sm:mb-6">
                            {/* Tabs */}
                            <div className="flex flex-wrap gap-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${activeTab === tab.id
                                                ? 'text-[#00673A] font-semibold border-b-2 border-[#00673A]'
                                                : 'text-secondary hover:text-primary'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-primary transition-colors cursor-pointer"
                                >
                                    <img src={calendar} alt="Calendar" className="w-4 h-4" />
                                    <span>Select Date Range</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDatePickerOpen && (
                                    <div className="absolute top-full left-0 mt-1 bg-[#FBFFF5] border border-gray-300 rounded-lg shadow-lg z-20 p-4 min-w-[300px]">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-primary mb-2">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-primary mb-2">End Date</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={handleDateRangeSelect}
                                                    disabled={!startDate || !endDate}
                                                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-[#00673A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    Apply
                                                </button>
                                                <button
                                                    onClick={handleClearDateRange}
                                                    className="flex-1 px-4 py-2 border border-gray-300 text-primary rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Custom Duration Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-primary transition-colors flex items-center justify-between min-w-[140px] cursor-pointer    "
                                >
                                    <span>{selectedDuration}</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDurationDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#FBFFF5] border border-gray-300 rounded-lg shadow-lg z-10">
                                            {durationOptions.map((option, index) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleDurationSelect(option.label)}
                                                    className={`w-full px-4 py-2 text-sm text-primary transition-colors text-left  cursor-pointer${
                                                        index === 0 ? 'rounded-t-lg' : ''
                                                    } ${
                                                        index === durationOptions.length - 1 ? 'rounded-b-lg' : ''
                                                    } ${
                                                        selectedDuration === option.label ? 'bg-[#F3F8EC]' : ''
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Custom Plan Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-primary transition-colors flex items-center justify-between min-w-[120px] cursor-pointer"
                                    >
                                        <span>{selectedPlan}</span>
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isPlanDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#FBFFF5] border border-gray-300 rounded-lg shadow-lg z-10">
                                            {planOptions.map((option, index) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handlePlanSelect(option.label)}
                                                    className={`w-full px-4 py-2 text-sm text-primary transition-colors cursor-pointer text-left ${
                                                        index === 0 ? 'rounded-t-lg' : ''
                                                    } ${
                                                        index === planOptions.length - 1 ? 'rounded-b-lg' : ''
                                                    } ${
                                                        selectedPlan === option.label ? 'bg-[#F3F8EC]' : ''
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#F3F8EC]">
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider rounded-l-xl">
                                                User Name
                                            </th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                                Plan
                                            </th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                                Start Date
                                            </th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                                Renewal Date
                                            </th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                                                View
                                            </th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider rounded-r-xl">
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSubscriptions.map((subscription, index) => (
                                            <tr
                                                key={subscription.id}
                                                className={index % 2 === 1 ? 'bg-[#F3F8EC]' : ''}
                                            >
                                                <td
                                                    className={`px-3 sm:px-4 py-4 whitespace-nowrap ${index % 2 === 1 ? 'rounded-l-xl' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {subscription.avatar ? (
                                                            <img
                                                                src={subscription.avatar}
                                                                alt={subscription.name}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                                                <img
                                                                    src={profileUser}
                                                                    alt="User"
                                                                    className="w-6 h-6"
                                                                />
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-medium text-primary">
                                                            {subscription.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-secondary">
                                                    {subscription.email}
                                                </td>
                                                <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-secondary">
                                                    {subscription.plan}
                                                </td>
                                                <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-secondary">
                                                    {subscription.startDate}
                                                </td>
                                                <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-secondary">
                                                    {subscription.renewalDate}
                                                </td>
                                                <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#18A73C1A] text-[#18A73C]">
                                                        {subscription.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 py-4 whitespace-nowrap">
                                                    <img
                                                        src={eye}
                                                        alt="View"
                                                        className="w-5 h-5 cursor-pointer text-gray-600 hover:text-primary transition-colors"
                                                        onClick={() => handleViewUser(subscription)}
                                                    />
                                                </td>
                                                <td
                                                    className={`px-3 sm:px-4 py-4 whitespace-nowrap ${index % 2 === 1 ? 'rounded-r-xl' : ''
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => handleCancelSubscription(subscription)}
                                                        className="text-sm text-[#00673A] underline transition-colors cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </div>
                    </div>

            </div>

            {/* Cancel Subscription Modal */}
            <SuspendModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Subscription"
                message={`Are you sure you want to cancel ${subscriptionToCancel?.name}'s subscription?`}
            />
            </>
    )
}

export default ManageSubscriptions
