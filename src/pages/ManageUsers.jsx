import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowLeft from '../assets/arrowLeft.svg'
import eye from '../assets/eye.svg'
import profileUser from '../assets/profileUser.svg'
import Header from '../components/Header'
import SuspendModal from '../components/SuspendModal'

const ManageUsers = () => {
    const navigate = useNavigate()
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
    const [userToSuspend, setUserToSuspend] = useState(null)

    // Sample user data
    const users = [
        {
            id: 1,
            name: "Anita Rath",
            email: "opalschiller8@example.com",
            plan: "Yearly",
            expiryDate: "Dec 12, 2025",
            purchases: "3 Books",
            lastActive: "Today 2:30PM",
            avatar: null
        },
        {
            id: 2,
            name: "Michele Halvorson",
            email: "liam@email.com",
            plan: "Monthly",
            expiryDate: "Oct 5, 2025",
            purchases: "1 Book",
            lastActive: "Yesterday",
            avatar: null
        },
        {
            id: 3,
            name: "Cassandra Casper",
            email: "cassandra@example.com",
            plan: "Free",
            expiryDate: "-",
            purchases: "0",
            lastActive: "Sept 10, 2025",
            avatar: null
        },
        {
            id: 4,
            name: "Alvin Toy",
            email: "alvin@example.com",
            plan: "Yearly",
            expiryDate: "Jan 15, 2026",
            purchases: "5 Books",
            lastActive: "Today 1:45PM",
            avatar: null
        },
        {
            id: 5,
            name: "Kathy Breitenberg",
            email: "kathy@example.com",
            plan: "Monthly",
            expiryDate: "Nov 20, 2025",
            purchases: "2 Books",
            lastActive: "2 days ago",
            avatar: null
        },
        {
            id: 6,
            name: "John Smith",
            email: "john@example.com",
            plan: "Free",
            expiryDate: "-",
            purchases: "0",
            lastActive: "Sept 5, 2025",
            avatar: null
        },
        {
            id: 7,
            name: "Sarah Johnson",
            email: "sarah@example.com",
            plan: "Yearly",
            expiryDate: "Mar 8, 2026",
            purchases: "4 Books",
            lastActive: "Today 3:15PM",
            avatar: null
        },
        {
            id: 8,
            name: "Mike Wilson",
            email: "mike@example.com",
            plan: "Monthly",
            expiryDate: "Dec 1, 2025",
            purchases: "1 Book",
            lastActive: "Yesterday",
            avatar: null
        },
        {
            id: 9,
            name: "Emily Davis",
            email: "emily@example.com",
            plan: "Free",
            expiryDate: "-",
            purchases: "0",
            lastActive: "Sept 15, 2025",
            avatar: null
        },
        {
            id: 10,
            name: "David Brown",
            email: "david@example.com",
            plan: "Yearly",
            expiryDate: "Feb 28, 2026",
            purchases: "6 Books",
            lastActive: "Today 4:20PM",
            avatar: null
        },
        {
            id: 11,
            name: "Lisa Anderson",
            email: "lisa@example.com",
            plan: "Monthly",
            expiryDate: "Nov 15, 2025",
            purchases: "2 Books",
            lastActive: "3 days ago",
            avatar: null
        },
        {
            id: 12,
            name: "Tom Miller",
            email: "tom@example.com",
            plan: "Free",
            expiryDate: "-",
            purchases: "0",
            lastActive: "Sept 8, 2025",
            avatar: null
        }
    ]

    const handleSuspend = (user) => {
        setUserToSuspend(user)
        setIsSuspendModalOpen(true)
    }

    const handleViewUser = (user) => {
        navigate(`/users/${user.id}`, { state: { user } })
    }

    const confirmSuspend = () => {
        console.log('Suspending user:', userToSuspend)
        setIsSuspendModalOpen(false)
        setUserToSuspend(null)
    }


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
                    <h1 className="text-xl font-semibold text-primary sm:text-2xl">Manage Users</h1>
                </div>
                <div className="rounded-2xl border-common mx-auto">
                    {/* Section Title */}
                    <div className="px-4 py-4 sm:px-6 sm:py-6">
                        <h2 className="text-lg font-medium text-primary sm:text-xl">All Users</h2>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-hidden rounded-2xl">
                        <table className="w-full border-collapse">
                            {/* Table Header */}
                            <thead className="bg-[#F3F8EC]">
                                <tr className="rounded-2xl">
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6 rounded-tl-2xl">
                                        User Name
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6">
                                        Email
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6">
                                        Plan
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6">
                                        Expiry Date
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6">
                                        Purchases
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6">
                                        Last Active
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6">
                                        Suspend
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider lg:px-4 xl:px-6 rounded-tr-2xl">
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="">
                                {users.map((user, index) => (
                                    <tr key={user.id} className={`rounded-table-row ${index % 2 === 1 ? 'bg-[#F3F8EC]' : ''}`}>
                                        {/* User Name */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <div className="flex items-center gap-2 lg:gap-3">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                    {user.avatar ? (
                                                        <img 
                                                            src={user.avatar} 
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <img 
                                                            src={profileUser} 
                                                            alt="Profile" 
                                                            className="w-6 h-6 lg:w-8 lg:h-8"
                                                        />
                                                    )}
                                                </div>
                                                <span className="text-xs lg:text-sm font-medium text-primary">{user.name}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <span className="text-xs lg:text-sm text-secondary">{user.email}</span>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <span className="text-xs lg:text-sm text-secondary">
                                                {user.plan}
                                            </span>
                                        </td>

                                        {/* Expiry Date */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <span className="text-xs lg:text-sm text-secondary">{user.expiryDate}</span>
                                        </td>

                                        {/* Purchases */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <span className="text-xs lg:text-sm text-secondary">{user.purchases}</span>
                                        </td>

                                        {/* Last Active */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <span className="text-xs lg:text-sm text-secondary">{user.lastActive}</span>
                                        </td>

                                        {/* Suspend */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <button
                                                onClick={() => handleSuspend(user)}
                                                className="text-xs lg:text-sm text-[#048B50] underline hover:text-[#048B50] transition-colors cursor-pointer"
                                            >
                                                Suspend
                                            </button>
                                        </td>

                                        {/* View */}
                                        <td className="px-3 py-4 whitespace-nowrap lg:px-4 xl:px-6">
                                            <button
                                                onClick={() => handleViewUser(user)}
                                                className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer"
                                            >
                                                <img src={eye} alt="View" className="w-4 h-4 lg:w-6 lg:h-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden">
                        <div className="">
                            {users.map((user, index) => (
                                <div key={user.id} className={`p-4 ${index % 2 === 0 ? 'bg-[#F3F8EC]' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        {/* User Info */}
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {user.avatar ? (
                                                    <img 
                                                        src={user.avatar} 
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img 
                                                        src={profileUser} 
                                                        alt="Profile" 
                                                        className="w-8 h-8"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-medium text-primary truncate">{user.name}</h3>
                                                <p className="text-xs text-secondary truncate">{user.email}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-secondary">
                                                        {user.plan}
                                                    </span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs text-secondary">{user.purchases}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-3">
                                            <button
                                                onClick={() => handleSuspend(user)}
                                                className="text-xs text-[#048B50] underline hover:text-[#048B50] transition-colors cursor-pointer"
                                            >
                                                Suspend
                                            </button>
                                            <button
                                                onClick={() => handleViewUser(user)}
                                                className="w-8 h-8 cursor-pointer"
                                            >
                                                <img src={eye} alt="View" className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Additional Info */}
                                    <div className="mt-3 flex justify-between text-xs text-secondary">
                                        <span>Expires: {user.expiryDate}</span>
                                        <span>Last: {user.lastActive}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <SuspendModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                onSuspend={confirmSuspend}
                userName={userToSuspend?.name || 'this user'}
            />
        </div>
    )
}

export default ManageUsers
