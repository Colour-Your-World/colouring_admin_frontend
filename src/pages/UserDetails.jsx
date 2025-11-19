import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import apiService from '../services/api'
import arrowLeft from '../assets/arrowLeft.svg'
import calendar from '../assets/calendar.svg'
import threeDot from '../assets/3Dot.svg'
import exportIcon from '../assets/export.svg'
import deleteUser from '../assets/deleteUser.svg'
import profileIcon from '../assets/profile2.svg'
import SuspendModal from '../components/SuspendModal'
import DeleteModal from '../components/DeleteModal'

const UserDetails = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id: userId } = useParams()
    const { getUser, updateUser, deleteUser: deleteUserAPI } = useUsers()
    
    const [user, setUser] = useState(location.state?.user || null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [accountStatus, setAccountStatus] = useState(true)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] = useState(false)
    const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false)
    const [isSuspending, setIsSuspending] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const dropdownRef = useRef(null)
    const planDropdownRef = useRef(null)

    // Always fetch user data from API to get complete details (subscription, purchasedPlan, etc.)
    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                setIsLoading(true)
                setError(null)
                try {
                    const result = await getUser(userId)
                    if (result && result.success && result.data) {
                        const userData = result.data.user
                        const subscriptionData = result.data.subscription || null
                        const purchasedPlan = result.data.purchasedPlan || null
                        const booksPurchasedCount = result.data.booksPurchasedCount || 0
                        
                        // Check if userData exists
                        if (!userData) {
                            setError('User not found')
                            setIsLoading(false)
                            return
                        }
                    
                    // Determine plan display and subscription details
                    // Use purchasedPlan from API if available, otherwise use subscription.plan
                    const plan = purchasedPlan || subscriptionData?.plan || null
                    
                    let planDisplay = '-'
                    let planPrice = '-'
                    let nextBillingDate = null
                    let planDuration = null
                    
                    if (userData.role === 'admin') {
                        planDisplay = 'Admin'
                        planPrice = 'N/A'
                    } else if (plan) {
                        planDisplay = plan.name || 'Plan'
                        planPrice = `$${plan.price || 0}`
                        planDuration = plan.duration || 'monthly'
                        
                        // Calculate next billing date - use endDate as next billing
                        if (subscriptionData && subscriptionData.endDate) {
                            const endDate = new Date(subscriptionData.endDate)
                            nextBillingDate = endDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })
                        }
                    }
                    
                    // Last Active - use lastLogin if available, otherwise lastLogout
                    let lastActiveDisplay = 'Never'
                    if (userData.lastLogin) {
                        lastActiveDisplay = new Date(userData.lastLogin).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                    } else if (userData.lastLogout) {
                        lastActiveDisplay = new Date(userData.lastLogout).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                    }
                    
                    // Start Date
                    let startDateDisplay = '-'
                    // Check subscriptionData first, then fallback to null check
                    if (subscriptionData) {
                        if (subscriptionData.startDate) {
                            try {
                                startDateDisplay = new Date(subscriptionData.startDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })
                            } catch (e) {
                                startDateDisplay = '-'
                            }
                        }
                    }
                    
                    // Expiry Date / End Date
                    let expiryDateDisplay = '-'
                    if (subscriptionData && subscriptionData.endDate) {
                        expiryDateDisplay = new Date(subscriptionData.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                    }
                    
                    // Get billing cycle from plan duration
                    const billingCycle = plan?.duration || planDuration || 'monthly'
                    
                    setUser({
                        id: userData._id,
                        name: userData.name,
                        email: userData.email,
                        plan: planDisplay,
                        planPrice: planPrice,
                        billingCycle: billingCycle,
                        startDate: startDateDisplay,
                        expiryDate: expiryDateDisplay,
                        nextBillingDate: nextBillingDate || expiryDateDisplay, // Fallback to expiryDate for Next Billing Date display
                        purchases: `${booksPurchasedCount} Books`,
                        lastActive: lastActiveDisplay,
                        avatar: userData.profilePhoto || null
                    })
                    setAccountStatus(userData.isActive || false)
                    } else {
                        setError('Failed to fetch user data')
                    }
                } catch (err) {
                    setError(err.message || 'Failed to fetch user data')
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchUserData()
    }, [userId])


    // Purchases and payment history state
    const [purchases, setPurchases] = useState([])
    const [paymentHistory, setPaymentHistory] = useState([])
    const [isLoadingPaymentHistory, setIsLoadingPaymentHistory] = useState(false)

    // Fetch payment history for the user
    useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (userId) {
                try {
                    setIsLoadingPaymentHistory(true)
                    const response = await apiService.getPaymentHistory(userId)
                    
                    if (response.success && response.data && response.data.payments) {
                        // Transform API response to match UI format
                        const transformedPayments = response.data.payments.map(payment => {
                            // Format date
                            const paymentDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })

                            // Format amount with currency
                            const amount = payment.amount ? `$${payment.amount.toFixed(2)}` : '$0.00'

                            // Determine method display
                            let method = 'N/A'
                            if (payment.type === 'subscription' && payment.plan) {
                                method = payment.paymentMethod ? 'Credit Card (Subscription)' : 'Subscription'
                            } else if (payment.type === 'book' && payment.book) {
                                method = payment.paymentMethod ? 'Credit Card (Book)' : 'Book Purchase'
                            } else if (payment.paymentMethod) {
                                method = 'Credit Card'
                            }

                            // Transaction ID - use Stripe Payment Intent ID if available, otherwise use payment _id
                            const transactionId = payment.stripePaymentIntentId 
                                ? payment.stripePaymentIntentId.substring(0, 20) + '...' 
                                : payment._id?.toString().substring(0, 12) || 'N/A'

                            // Status
                            const status = payment.status === 'completed' ? 'Success' : 
                                         payment.status === 'pending' ? 'Pending' : 
                                         payment.status === 'failed' ? 'Failed' : 'Success'

                            return {
                                id: payment._id,
                                date: paymentDate,
                                transactionId: transactionId,
                                method: method,
                                amount: amount,
                                status: status,
                                type: payment.type || 'unknown',
                                plan: payment.plan || null,
                                book: payment.book || null
                            }
                        })

                        setPaymentHistory(transformedPayments)

                        // Transform book purchases for purchases section
                        const bookPurchases = response.data.payments
                            .filter(p => p.type === 'book' && p.book && p.status === 'completed')
                            .map(payment => {
                                const purchaseDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })

                                const coverImage = payment.book?.coverImage || null
                                
                                return {
                                    id: payment._id,
                                    title: payment.book.name || 'Book',
                                    price: payment.amount ? `$${payment.amount.toFixed(2)}` : '$0.00',
                                    purchaseDate: purchaseDate,
                                    date: purchaseDate,
                                    thumbnail: coverImage
                                }
                            })

                        setPurchases(bookPurchases)
                    } else {
                        setPaymentHistory([])
                        setPurchases([])
                    }
                } catch (err) {
                    setError('Failed to fetch payment history')
                    setPaymentHistory([])
                    setPurchases([])
                } finally {
                    setIsLoadingPaymentHistory(false)
                }
            }
        }

        fetchPaymentHistory()
    }, [userId])

    // Calculate total spend from book purchases only
    const totalSpend = purchases.reduce((total, purchase) => {
        const amountString = purchase.price.replace(/[^\d.]/g, '')
        const amount = parseFloat(amountString) || 0
        return total + amount
    }, 0)

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleDeleteAccount = () => {
        setIsDropdownOpen(false)
        setIsDeleteModalOpen(true)
    }

    const handleExportReport = () => {
        setIsDropdownOpen(false)
    }

    const handleConfirmSuspend = async () => {
        if (!user) return

        try {
            setIsSuspending(true)
            const result = await updateUser(user.id, { isActive: false })
            
            if (result.success) {
                setAccountStatus(false)
                setIsSuspendModalOpen(false)
            } else {
                alert('Failed to suspend user. Please try again.')
            }
        } catch (error) {
            alert('Failed to suspend user. Please try again.')
        } finally {
            setIsSuspending(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!user) return

        try {
            setIsDeleting(true)
            const result = await deleteUserAPI(user.id)
            
            if (result.success) {
                setIsDeleteModalOpen(false)
                navigate('/users')
            } else {
                alert(result.error || 'Failed to delete user. Please try again.')
            }
        } catch (error) {
            alert('Failed to delete user. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    const handlePlanDropdownToggle = () => {
        setIsPlanDropdownOpen(!isPlanDropdownOpen)
    }

    const handleCancelSubscription = () => {
        setIsPlanDropdownOpen(false)
        setIsCancelSubscriptionModalOpen(true)
    }

    const handleConfirmCancelSubscription = async () => {
        if (!user) return

        try {
            setIsCancelling(true)
            const response = await apiService.cancelSubscription(user.id)
            
            if (response.success) {
                setIsCancelSubscriptionModalOpen(false)
                // Refresh user data to reflect cancelled subscription
                const result = await getUser(userId)
                if (result && result.success && result.data) {
                    const userData = result.data.user
                    const subscriptionData = result.data.subscription || null
                    const purchasedPlan = result.data.purchasedPlan || null
                    
                    if (userData) {
                        const plan = purchasedPlan || subscriptionData?.plan || null
                        
                        let planDisplay = '-'
                        let planPrice = '-'
                        let nextBillingDate = null
                        let planDuration = null
                        
                        if (userData.role === 'admin') {
                            planDisplay = 'Admin'
                            planPrice = 'N/A'
                        } else if (plan) {
                            planDisplay = plan.name || 'Plan'
                            planPrice = `$${plan.price || 0}`
                            planDuration = plan.duration || 'monthly'
                            
                            if (subscriptionData && subscriptionData.endDate) {
                                const endDate = new Date(subscriptionData.endDate)
                                nextBillingDate = endDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })
                            }
                        }
                        
                        let lastActiveDisplay = 'Never'
                        if (userData.lastLogin) {
                            lastActiveDisplay = new Date(userData.lastLogin).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })
                        } else if (userData.lastLogout) {
                            lastActiveDisplay = new Date(userData.lastLogout).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })
                        }
                        
                        let startDateDisplay = '-'
                        if (subscriptionData) {
                            if (subscriptionData.startDate) {
                                try {
                                    startDateDisplay = new Date(subscriptionData.startDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })
                                } catch (e) {
                                    startDateDisplay = '-'
                                }
                            }
                        }
                        
                        let expiryDateDisplay = '-'
                        if (subscriptionData && subscriptionData.endDate) {
                            expiryDateDisplay = new Date(subscriptionData.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })
                        }
                        
                        const billingCycle = plan?.duration || planDuration || 'monthly'
                        
                        setUser({
                            id: userData._id,
                            name: userData.name,
                            email: userData.email,
                            plan: planDisplay,
                            planPrice: planPrice,
                            billingCycle: billingCycle,
                            startDate: startDateDisplay,
                            expiryDate: expiryDateDisplay,
                            nextBillingDate: nextBillingDate || expiryDateDisplay,
                            purchases: `${result.data.booksPurchasedCount || 0} Books`,
                            lastActive: lastActiveDisplay,
                            avatar: userData.profilePhoto || null
                        })
                    }
                }
            } else {
                setError(response.message || 'Failed to cancel subscription')
            }
        } catch (error) {
            setError('Failed to cancel subscription. Please try again.')
        } finally {
            setIsCancelling(false)
        }
    }

    // Dropdown menu items
    const dropdownItems = [  
        {
            id: 'delete',
            label: 'Delete Account',
            icon: deleteUser,
            action: handleDeleteAccount
        },
        {
            id: 'export',
            label: 'Export User Report',
            icon: exportIcon,
            action: handleExportReport
        }
    ]

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
            if (planDropdownRef.current && !planDropdownRef.current.contains(event.target)) {
                setIsPlanDropdownOpen(false)
            }
        }

        if (isDropdownOpen || isPlanDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen, isPlanDropdownOpen])

    // Show loading state
    if (isLoading || !user) {
        return (
            <div className="mx-auto px-4 py-6 max-w-7xl">
                <div className="flex items-center justify-center py-12">
                    <div className="text-secondary">Loading user details...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto px-4 py-6 max-w-7xl">
                {/* Page Navigation */}
                <div className="flex items-center gap-3 pb-4 sm:pb-6">
                    <img
                        src={arrowLeft}
                        alt="Back"
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-xl font-semibold text-primary sm:text-2xl">{user?.name || 'User Details'}</h1>
                </div>
                {/* User Information Card */}
                <div className="px-2 py-4 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-3 border-gray-300">
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user?.name || 'User'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                                        <img 
                                            src={profileIcon} 
                                            alt="Default Profile"
                                            className="w-6 h-6 sm:w-8 sm:h-8 opacity-60"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-primary">{user?.name || 'User'}</h2>
                                <p className="text-xs sm:text-sm text-secondary">{user?.email || ''}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm text-primary">Account Status:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={async () => {
                                        const newStatus = !accountStatus
                                        const result = await updateUser(user.id, { isActive: newStatus })
                                        if (result.success) {
                                            setAccountStatus(newStatus)
                                        } else {
                                            alert('Failed to update account status')
                                        }
                                    }}
                                    className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors cursor-pointer ${accountStatus ? 'bg-secondary' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${accountStatus ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            <div className="relative" ref={dropdownRef}>
                                <img 
                                    src={threeDot} 
                                    alt="Options" 
                                    className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" 
                                    onClick={handleDropdownToggle}
                                />
                                
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute -right-5 top-8 z-50 w-48 bg-[#FBFFF5] rounded-lg shadow-lg border border-gray-200 py-2 px-1 ">
                                        {dropdownItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={item.action}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-primary hover:bg-[#F2F5ED] transition-colors cursor-pointer rounded-lg"
                                            >
                                                <img src={item.icon} alt={item.label} className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Plan Card */}
                <div className="rounded-2xl border-common p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-secondary">CURRENT PLAN</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="text-xs sm:text-sm text-secondary">
                                Next Billing Date: <span className="font-medium text-primary">{user?.nextBillingDate || user?.expiryDate || '-'}</span>
                            </div>
                            <div className="relative" ref={planDropdownRef}>
                                <img 
                                    src={threeDot} 
                                    alt="Options" 
                                    className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" 
                                    onClick={handlePlanDropdownToggle}
                                />
                                
                                {/* Plan Dropdown Menu */}
                                {isPlanDropdownOpen && (
                                    <div className="absolute right-0 top-8 z-50 w-48 bg-[#FBFFF5] rounded-lg shadow-lg border border-gray-200 py-2 px-1">
                                        <button
                                            onClick={handleCancelSubscription}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm text-primary hover:bg-[#F2F5ED] transition-colors cursor-pointer rounded-lg font-medium"
                                        >
                                            <span>Cancel Subscription</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 sm:mb-4">
                        <h4 className="text-lg sm:text-xl font-semibold text-primary">
                            {user.plan} Plan
                            {user.planPrice && user.planPrice !== 'N/A' && user.planPrice !== '-' && ` - ${user.planPrice}`}
                            {user.billingCycle && user.planPrice !== '-' && user.planPrice !== 'N/A' && ` (${user.billingCycle})`}
                        </h4>
                    </div>
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="flex flex-col items-start gap-2">
                                <span className="text-xs sm:text-sm text-secondary">Start Date</span>
                                <div className="flex flex-row items-center gap-2">
                                    <img src={calendar} alt="Calendar" className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium text-primary">{user?.startDate || '-'}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-2 border-l-0 border-gray-400 sm:border-l pl-0 sm:pl-4">
                                <span className="text-xs sm:text-sm text-secondary">Expiry Date</span>
                                <div className="flex flex-row items-center gap-2">
                                    <img src={calendar} alt="Calendar" className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium text-primary">{user?.expiryDate || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchases Section */}
                <div className="rounded-2xl border-common p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4 rounded-xl bg-[#F3F8EC] p-2 sm:p-3">
                        <h3 className="text-base sm:text-lg font-semibold text-primary">Purchases</h3>
                        <span className="text-xs sm:text-sm text-secondary">Total Spend: <span className="font-medium text-primary">${totalSpend.toFixed(2)}</span></span>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {purchases.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-sm text-secondary">No purchases found</div>
                            </div>
                        ) : (
                            purchases.map((purchase, index) => (
                                <div key={purchase.id} className={`flex items-center gap-3 sm:gap-4 p-2 sm:p-3 ${index !== purchases.length - 1 ? 'border-b border-[#0F100B]/10' : ''}`}>
                                    <div className="w-10 h-12 sm:w-12 sm:h-16 bg-gray-300 rounded overflow-hidden flex-shrink-0">
                                        {purchase.thumbnail ? (
                                            <img 
                                                src={purchase.thumbnail} 
                                                alt={purchase.title} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<span class="text-xs text-gray-600 flex items-center justify-center h-full">Book</span>';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-xs text-gray-600">Book</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-medium text-primary truncate">{purchase.title}</h4>
                                        <p className="text-xs text-secondary">Purchased: {purchase.purchaseDate}</p>
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium text-primary whitespace-nowrap">{purchase.price}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Payment History */}
                <div className="rounded-2xl border-common p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">Payment History</h3>
                    <div className="overflow-x-auto">
                        {isLoadingPaymentHistory ? (
                            <div className="text-center py-8">
                                <div className="text-sm text-secondary">Loading payment history...</div>
                            </div>
                        ) : paymentHistory.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-sm text-secondary">No payment history found</div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F3F8EC]">
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs text-primary uppercase tracking-wider rounded-l-xl">
                                            Date
                                        </th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs text-primary uppercase tracking-wider">
                                            Transaction ID
                                        </th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs text-primary uppercase tracking-wider">
                                            Method
                                        </th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs text-primary uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs text-primary uppercase tracking-wider rounded-r-xl">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paymentHistory.map((payment, index) => (
                                        <tr key={payment.id}>
                                            <td
                                                className={`px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-secondary ${index % 2 === 1 ? 'bg-[#F3F8EC] rounded-l-xl' : ''
                                                    }`}
                                            >
                                                {payment.date}
                                            </td>
                                            <td
                                                className={`px-4 py-4 whitespace-nowrap text-sm text-secondary ${index % 2 === 1 ? 'bg-[#F3F8EC]' : ''
                                                    }`}
                                            >
                                                {payment.transactionId}
                                            </td>
                                            <td
                                                className={`px-4 py-4 whitespace-nowrap text-sm text-secondary ${index % 2 === 1 ? 'bg-[#F3F8EC]' : ''
                                                    }`}
                                            >
                                                {payment.method}
                                            </td>
                                            <td
                                                className={`px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-secondary ${index % 2 === 1 ? 'bg-[#F3F8EC]' : ''
                                                    }`}
                                            >
                                                {payment.amount}
                                            </td>
                                            <td
                                                className={`px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-secondary ${index % 2 === 1 ? 'bg-[#F3F8EC] rounded-r-xl' : ''
                                                    }`}
                                            >
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    payment.status === 'Success' 
                                                        ? 'text-[#18A73C] bg-[#18A73C1A]'
                                                        : payment.status === 'Pending'
                                                        ? 'text-yellow-600 bg-yellow-100'
                                                        : 'text-red-600 bg-red-100'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Suspend Modal */}
                <SuspendModal
                    isOpen={isSuspendModalOpen}
                    onClose={() => setIsSuspendModalOpen(false)}
                    onSuspend={handleConfirmSuspend}
                    userName={user?.name || 'this user'}
                />

                {/* Delete Modal */}
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleConfirmDelete}
                    userName={user?.name || 'this user'}
                    deleteType="account"
                    isDeleting={isDeleting}
                />

                {/* Cancel Subscription Modal */}
                <SuspendModal
                    isOpen={isCancelSubscriptionModalOpen}
                    onClose={() => setIsCancelSubscriptionModalOpen(false)}
                    onSuspend={handleConfirmCancelSubscription}
                    userName={user?.name || 'this user'}
                />
        </div>
    )
}

export default UserDetails
