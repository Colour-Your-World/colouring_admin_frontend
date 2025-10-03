import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import arrowLeft from '../assets/arrowLeft.svg'
import calendar from '../assets/calendar.svg'
import threeDot from '../assets/3Dot.svg'
import exportIcon from '../assets/export.svg'
import deleteUser from '../assets/deleteUser.svg'
import suspend from '../assets/suspend.svg'
import Header from '../components/Header'
import SuspendModal from '../components/SuspendModal'
import DeleteModal from '../components/DeleteModal'

const UserDetails = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const user = location.state?.user || {
        id: 1,
        name: "John Doe",
        email: "john@email.com",
        plan: "Yearly",
        expiryDate: "12 Jan 2026",
        purchases: "3 Books",
        lastActive: "Today 2:30PM",
        avatar: null
    }

    const [accountStatus, setAccountStatus] = useState(true)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const planDropdownRef = useRef(null)

    // Sample data for purchases
    const purchases = [
        {
            id: 1,
            title: "African Safari Adventures",
            price: "$4.99",
            purchaseDate: "15 Feb 2025",
            thumbnail: "/api/placeholder/60/80",
            date: "15 Feb 2025"
        },
        {
            id: 2,
            title: "Ocean Life",
            price: "$3.99",
            purchaseDate: "22 Mar 2025",
            thumbnail: "/api/placeholder/60/80",
            date: "22 Mar 2025"
        },
        {
            id: 3,
            title: "African Safari Adventures",
            price: "$4.99",
            purchaseDate: "15 Feb 2025",
            thumbnail: "/api/placeholder/60/80",
            date: "15 Feb 2025"
        }
    ]

    // Sample data for payment history
    const paymentHistory = [
        {
            id: 1,
            date: "15 Feb 2025",
            transactionId: "TXN-12345",
            method: "Apple Pay",
            amount: "$4.99",
            status: "Success"
        },
        {
            id: 2,
            date: "22 Mar 2025",
            transactionId: "TXN-67890",
            method: "NetBanking",
            amount: "$3.99",
            status: "Success"
        },
        {
            id: 3,
            date: "15 Feb 2025",
            transactionId: "TXN-54321",
            method: "Card (Visa)",
            amount: "$39.99",
            status: "Success"
        }
    ]

    const totalSpend = purchases.reduce((total, purchase) => {
        return total + parseFloat(purchase.price.replace('$', ''))
    }, 0)

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleSuspendUser = () => {
        setIsDropdownOpen(false)
        setIsSuspendModalOpen(true)
    }

    const handleDeleteAccount = () => {
        setIsDropdownOpen(false)
        setIsDeleteModalOpen(true)
    }

    const handleExportReport = () => {
        setIsDropdownOpen(false)
        // Add export report logic here
        console.log('Export user report clicked')
    }

    const handleConfirmSuspend = () => {
        setIsSuspendModalOpen(false)
        // Add suspend confirmation logic here
        console.log('User suspended')
    }

    const handleConfirmDelete = () => {
        setIsDeleteModalOpen(false)
        // Add delete confirmation logic here
        console.log('Account deleted')
    }

    const handlePlanDropdownToggle = () => {
        setIsPlanDropdownOpen(!isPlanDropdownOpen)
    }

    const handleCancelSubscription = () => {
        setIsPlanDropdownOpen(false)
        // Add cancel subscription logic here
        console.log('Cancel subscription clicked')
    }

    // Dropdown menu items
    const dropdownItems = [
        {
            id: 'suspend',
            label: 'Suspend User',
            icon: suspend,
            action: handleSuspendUser
        },
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

    return (
        <div className="min-h-screen bg-[#FBFFF5]">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="mx-auto px-4 py-6 max-w-7xl">
                {/* Page Navigation */}
                <div className="flex items-center gap-3 pb-4 sm:pb-6">
                    <img
                        src={arrowLeft}
                        alt="Back"
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-xl font-semibold text-primary sm:text-2xl">{user.name}</h1>
                </div>
                {/* User Information Card */}
                <div className="px-2 py-4 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm sm:text-lg font-medium text-gray-600">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-primary">{user.name}</h2>
                                <p className="text-xs sm:text-sm text-secondary">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm text-primary">Account Status:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setAccountStatus(!accountStatus)}
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
                                Next Billing Date: <span className="font-medium text-primary">{user.expiryDate}</span>
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
                        <h4 className="text-lg sm:text-xl font-semibold text-primary">{user.plan} Plan - $39.99</h4>
                    </div>
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="flex flex-col items-start gap-2">
                                <span className="text-xs sm:text-sm text-secondary">Start Date</span>
                                <div className="flex flex-row items-center gap-2">
                                    <img src={calendar} alt="Calendar" className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium text-primary">12 Jan 2025</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-2 border-l-0 border-gray-400 sm:border-l pl-0 sm:pl-4">
                                <span className="text-xs sm:text-sm text-secondary">Expiry Date</span>
                                <div className="flex flex-row items-center gap-2">
                                    <img src={calendar} alt="Calendar" className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium text-primary">{user.expiryDate}</span>
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
                        {purchases.map((purchase, index) => (
                            <div key={purchase.id} className={`flex items-center gap-3 sm:gap-4 p-2 sm:p-3 ${index !== purchases.length - 1 ? 'border-b border-[#0F100B]/10' : ''}`}>
                                <div className="w-10 h-12 sm:w-12 sm:h-16 bg-gray-300 rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-600">Book</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs sm:text-sm font-medium text-primary">{purchase.title}</h4>
                                    <p className="text-xs text-secondary">Purchased: {purchase.purchaseDate}</p>
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-primary">{purchase.price}</div>
                                <div className="text-xs sm:text-sm text-secondary">Purchased: {purchase.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment History */}
                <div className="rounded-2xl border-common p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">Payment History</h3>
                    <div className="overflow-x-auto">
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
                                            <span className="text-[#18A73C] bg-[#18A73C1A] px-2 py-1 rounded-full">{payment.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </div>
                </div>

                {/* Suspend Modal */}
                <SuspendModal
                    isOpen={isSuspendModalOpen}
                    onClose={() => setIsSuspendModalOpen(false)}
                    onConfirm={handleConfirmSuspend}
                />

                {/* Delete Modal */}
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    deleteType="account"
                />
            </div>
        </div>
    )
}

export default UserDetails
