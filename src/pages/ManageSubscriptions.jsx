import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SuspendModal from '../components/SuspendModal'
import Pagination from '../components/Pagination'
import FilterDropdown from '../components/FilterDropdown'
import DateRangePicker from '../components/DateRangePicker'
import apiService from '../services/api'
import arrowLeft from '../assets/arrowLeft.svg'
import timer from '../assets/timer.svg'
import profile from '../assets/profile.svg'
import dollor from '../assets/dollor.svg'
import eye from '../assets/eye.svg'
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
    const [subscriptions, setSubscriptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        cancelled: 0,
        expired: 0,
        pending: 0
    })
    const [monthlyCount, setMonthlyCount] = useState(0)
    const [yearlyCount, setYearlyCount] = useState(0)
    const [revenue, setRevenue] = useState({
        totalRevenue: 0,
        subscriptionRevenue: 0,
        bookRevenue: 0,
        currency: 'AUD'
    })
    const [cancelMessage, setCancelMessage] = useState({ type: '', text: '' })

    // Fetch subscriptions and books from payment history API
    const fetchSubscriptions = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Build query params - fetch both subscription and book payments
            const params = {}
            
            // Add status filter based on active tab
            if (activeTab === 'active') {
                params.status = 'completed'
            }

            const response = await apiService.getAllPaymentHistory(params)

            if (response.success) {
                // Get both subscription and book payments
                const allPayments = response.data.payments.filter(p => 
                    (p.type === 'subscription' && p.plan) || (p.type === 'book' && p.book)
                )

                // Transform API response to match UI format
                const transformedSubscriptions = allPayments.map(payment => {
                    // Format dates - use createdAt as payment date
                    const paymentDate = new Date(payment.createdAt)
                    const startDateFormatted = paymentDate.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })

                    // Handle subscription vs book differently
                    const isBook = payment.type === 'book'
                    let planDisplay = ''
                    let renewalDateFormatted = '-'
                    let duration = null
                    let planDuration = null

                    if (isBook && payment.book) {
                        // Book payment
                        const bookName = payment.book.name || 'Book'
                        const bookPrice = payment.amount || payment.book.price || 0
                        planDisplay = `${bookName} • $${bookPrice}`
                        // Books don't have renewal dates
                        renewalDateFormatted = '-'
                    } else if (payment.plan) {
                        // Subscription payment
                        const planName = payment.plan.name || 'Plan'
                        const planPrice = payment.plan.price || payment.amount || 0
                        duration = payment.plan.duration || 'monthly'
                        planDuration = duration
                        planDisplay = duration === 'yearly' 
                            ? `Yearly • $${planPrice}`
                            : `Monthly • $${planPrice}`
                        
                        // Calculate renewal date based on plan duration
                        const renewalDate = new Date(paymentDate)
                        if (duration === 'yearly') {
                            renewalDate.setFullYear(renewalDate.getFullYear() + 1)
                        } else {
                            renewalDate.setMonth(renewalDate.getMonth() + 1)
                        }
                        renewalDateFormatted = renewalDate.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })
                    }

                    // Format status based on payment status
                    let statusDisplay = 'Active'
                    if (payment.status === 'completed') {
                        if (isBook) {
                            statusDisplay = 'Completed'
                        } else {
                            // For subscriptions, check if still active based on renewal date
                            const now = new Date()
                            if (payment.plan) {
                                const renewalDate = new Date(paymentDate)
                                const duration = payment.plan.duration || 'monthly'
                                if (duration === 'yearly') {
                                    renewalDate.setFullYear(renewalDate.getFullYear() + 1)
                                } else {
                                    renewalDate.setMonth(renewalDate.getMonth() + 1)
                                }
                                const isExpired = renewalDate < now
                                statusDisplay = isExpired ? 'Expired' : 'Active'
                            }
                        }
                    } else if (payment.status === 'pending') {
                        statusDisplay = 'Pending'
                    } else if (payment.status === 'failed') {
                        statusDisplay = 'Failed'
                    } else if (payment.status === 'refunded') {
                        statusDisplay = 'Cancelled'
                    }

                    // Calculate days remaining for subscriptions only
                    let daysRemaining = 0
                    let daysOverdue = 0
                    let isExpired = false
                    if (!isBook && payment.plan) {
                        const now = new Date()
                        const renewalDate = new Date(paymentDate)
                        const duration = payment.plan.duration || 'monthly'
                        if (duration === 'yearly') {
                            renewalDate.setFullYear(renewalDate.getFullYear() + 1)
                        } else {
                            renewalDate.setMonth(renewalDate.getMonth() + 1)
                        }
                        const diffMs = renewalDate - now
                        daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
                        daysRemaining = daysRemaining > 0 ? daysRemaining : 0
                        daysOverdue = daysRemaining < 0 ? Math.abs(daysRemaining) : 0
                        isExpired = renewalDate < now && payment.status === 'completed'
                    }

                    return {
                        id: payment._id,
                        userId: payment.user?._id || payment.user,
                        name: payment.user?.name || 'Unknown',
                        email: payment.user?.email || '',
                        avatar: payment.user?.profilePhoto || null,
                        plan: planDisplay,
                        planDuration: planDuration,
                        startDate: startDateFormatted,
                        renewalDate: renewalDateFormatted,
                        status: statusDisplay,
                        isExpired: isExpired,
                        isCancelled: payment.status === 'refunded',
                        daysRemaining: daysRemaining,
                        daysOverdue: daysOverdue,
                        isBook: isBook,
                        bookCover: payment.book?.coverImage || null,
                        originalData: payment
                    }
                })

                setSubscriptions(transformedSubscriptions)
                
                // Update stats from API response
                if (response.stats) {
                    setStats({
                        total: response.stats.subscriptionPayments + response.stats.bookPayments || 0,
                        active: transformedSubscriptions.filter(s => s.status === 'Active' || s.status === 'Completed').length,
                        cancelled: transformedSubscriptions.filter(s => s.status === 'Cancelled').length,
                        expired: transformedSubscriptions.filter(s => s.status === 'Expired').length,
                        pending: transformedSubscriptions.filter(s => s.status === 'Pending').length
                    })
                }

                // Update revenue from API response
                if (response.revenue) {
                    setRevenue({
                        totalRevenue: response.revenue.totalRevenue || 0,
                        subscriptionRevenue: response.revenue.totalSubscriptionRevenue || 0,
                        bookRevenue: response.revenue.totalBookRevenue || 0,
                        currency: response.revenue.currency || 'AUD'
                    })
                }

                // Calculate monthly and yearly counts (only active subscriptions, not expired or cancelled)
                const monthly = transformedSubscriptions.filter(s => 
                    !s.isBook && s.planDuration === 'monthly' && s.status === 'Active'
                ).length
                const yearly = transformedSubscriptions.filter(s => 
                    !s.isBook && s.planDuration === 'yearly' && s.status === 'Active'
                ).length
                setMonthlyCount(monthly)
                setYearlyCount(yearly)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setCurrentPage(1) 
        fetchSubscriptions()
    }, [activeTab])


    const tabs = [
        { id: 'all', label: 'All Subscriptions And Books' },
        { id: 'books', label: 'Books' },
        { id: 'active', label: 'Active' },
        { id: 'expired', label: 'Expired / Canceled' },
    ]

    const handleViewUser = (subscription) => {
        navigate(`/users/${subscription.userId || subscription.id}`)
    }

    const handleCancelSubscription = (subscription) => {
        setSubscriptionToCancel(subscription)
        setIsCancelModalOpen(true)
    }

    const handleConfirmCancel = async () => {
        if (!subscriptionToCancel) {
            setIsCancelModalOpen(false)
            return
        }

        try {
            if (!subscriptionToCancel.isBook && subscriptionToCancel.userId) {
                const response = await apiService.cancelSubscription(subscriptionToCancel.userId)
                
                if (response.success) {
                    fetchSubscriptions()
                    setCancelMessage({ type: 'success', text: 'Subscription cancelled successfully' })
                    setIsCancelModalOpen(false)
                    setSubscriptionToCancel(null)
                    
                    setTimeout(() => {
                        setCancelMessage({ type: '', text: '' })
                    }, 3000)
                } else {
                    setCancelMessage({ type: 'error', text: response.message || 'Failed to cancel subscription' })
                    setTimeout(() => {
                        setCancelMessage({ type: '', text: '' })
                    }, 3000)
                }
            } else {
                setIsCancelModalOpen(false)
                setSubscriptionToCancel(null)
            }
        } catch (error) {
            setCancelMessage({ type: 'error', text: 'Failed to cancel subscription. Please try again.' })
            setTimeout(() => {
                setCancelMessage({ type: '', text: '' })
            }, 3000)
        }
    }

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan)
    }

    const handleDurationSelect = (duration) => {
        setSelectedDuration(duration)
        // Clear date range if not custom
        if (duration !== 'Custom') {
            setStartDate('')
            setEndDate('')
            setIsDatePickerOpen(false)
        }
    }

    const handleDateRangeApply = () => {
        if (startDate && endDate) {
            fetchSubscriptions()
        }
    }

    const handleClearDateRange = () => {
        setStartDate('')
        setEndDate('')
    }

    // Filter subscriptions based on active tab and client-side filters
    let filteredSubscriptions = subscriptions

    // Filter by active tab
    if (activeTab === 'active') {
        filteredSubscriptions = filteredSubscriptions.filter(sub => 
            !sub.isExpired && !sub.isCancelled && sub.status === 'Active'
        )
    } else if (activeTab === 'expired') {
        filteredSubscriptions = filteredSubscriptions.filter(sub => 
            sub.isExpired || sub.isCancelled
        )
    } else if (activeTab === 'books') {
        // Show only books
        filteredSubscriptions = filteredSubscriptions.filter(sub => 
            sub.isBook
        )
    }

    // Filter by plan type (only for subscriptions, not books)
    if (selectedPlan !== 'Plan') {
        const planType = selectedPlan.toLowerCase()
        filteredSubscriptions = filteredSubscriptions.filter(sub => 
            // Include books OR filter subscriptions by plan type
            sub.isBook || (planType === 'monthly' ? sub.planDuration === 'monthly' : sub.planDuration === 'yearly')
        )
    }

    const totalItems = filteredSubscriptions.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    
    // Calculate the subscriptions to display for current page
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentSubscriptions = filteredSubscriptions.slice(startIndex, endIndex)

    // Summary cards data
    const summaryCards = [
        {
            id: 'monthly',
            icon: timer,
            value: monthlyCount.toString(),
            label: 'Active Monthly',
            hasBadge: false
        },
        {
            id: 'yearly',
            icon: profile,
            value: yearlyCount.toString(),
            label: 'Active Yearly',
            hasBadge: false
        },
        {
            id: 'revenue',
            icon: dollor,
            value: revenue.currency === 'AUD' 
                ? `$${revenue.totalRevenue.toFixed(2)}` 
                : `$${revenue.totalRevenue.toFixed(2)}`,
            label: 'Total Revenue',
            hasBadge: true,
            badgeText: 'All time'
        }
    ]

    return (
        <>
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
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-primary">All Users</h2>
                            {cancelMessage.text && (
                                <div className={`px-4 py-2 rounded-lg text-sm ${
                                    cancelMessage.type === 'success' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {cancelMessage.text}
                                </div>
                            )}
                        </div>

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
                                {selectedDuration === 'Custom' && (
                                    <DateRangePicker
                                        startDate={startDate}
                                        endDate={endDate}
                                        onStartDateChange={setStartDate}
                                        onEndDateChange={setEndDate}
                                        onApply={handleDateRangeApply}
                                        onClear={handleClearDateRange}
                                        isOpen={isDatePickerOpen}
                                        onToggle={setIsDatePickerOpen}
                                    />
                                )}

                                <FilterDropdown
                                    label="Duration"
                                    options={durationOptions}
                                    selectedValue={selectedDuration}
                                    onSelect={handleDurationSelect}
                                    isOpen={isDurationDropdownOpen}
                                    onToggle={setIsDurationDropdownOpen}
                                    minWidth="140px"
                                    placeholder="Select Duration"
                                />

                                <FilterDropdown
                                    label="Plan"
                                    options={planOptions}
                                    selectedValue={selectedPlan}
                                    onSelect={handlePlanSelect}
                                    isOpen={isPlanDropdownOpen}
                                    onToggle={setIsPlanDropdownOpen}
                                    minWidth="120px"
                                    placeholder="Select Plan"
                                />
                            </div>
                        </div>

                        {/* Table */}
                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="text-secondary">Loading subscriptions...</div>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-12">
                                        <div className="text-red-500 mb-4">Error: {error}</div>
                                        <button
                                            onClick={fetchSubscriptions}
                                            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-[#00673A] transition-colors cursor-pointer"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : currentSubscriptions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-secondary">No subscriptions found</div>
                                    </div>
                                ) : (
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
                                                    Plan / Book
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
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        subscription.status === 'Active' || subscription.status === 'Completed'
                                                            ? 'bg-[#18A73C1A] text-[#18A73C]'
                                                            : subscription.status === 'Cancelled' || subscription.status === 'Expired'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-yellow-100 text-yellow-600'
                                                    }`}>
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
                                                    {!subscription.isBook && (
                                                        <button
                                                            onClick={() => handleCancelSubscription(subscription)}
                                                            className="text-sm text-[#00673A] underline transition-colors cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
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

            {/* Cancel Subscription Modal */}
            <SuspendModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Subscription"
                message={`Are you sure you want to cancel ${subscriptionToCancel?.name}'s subscription?`}
                confirmButtonText="Cancel Subscription"
            />
            </>
    )
}

export default ManageSubscriptions
