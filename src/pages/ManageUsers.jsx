import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowLeft from '../assets/arrowLeft.svg'
import eye from '../assets/eye.svg'
import profileUser from '../assets/profileUser.svg'
import Header from '../components/Header'
import SuspendModal from '../components/SuspendModal'
import { useUsers } from '../hooks/useUsers'

const ManageUsers = () => {
    const navigate = useNavigate()
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
    const [userToSuspend, setUserToSuspend] = useState(null)
    const [isSuspending, setIsSuspending] = useState(false)
    const { users: apiUsers, isLoading, error, updateUser } = useUsers()
    
    // Transform API users to match UI format
    const users = apiUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.role === 'admin' ? 'Admin' : 'Free', // Default to Free, can be updated later
        expiryDate: user.isActive ? 'Dec 31, 2025' : 'Expired', // Default dates
        purchases: '0 Books', // Default, can be updated later
        lastActive: new Date(user.createdAt).toLocaleDateString(),
        avatar: user.profilePhoto || null
    }))

    const handleSuspend = (user) => {
        setUserToSuspend(user)
        setIsSuspendModalOpen(true)
    }

    const handleViewUser = (user) => {
        navigate(`/users/${user.id}`, { state: { user } })
    }

    const confirmSuspend = async () => {
        if (!userToSuspend) return

        try {
            setIsSuspending(true)
            // Toggle user's active status
            const result = await updateUser(userToSuspend.id, { 
                isActive: false 
            })
            
            if (result.success) {
                setIsSuspendModalOpen(false)
                setUserToSuspend(null)
            } else {
                alert('Failed to suspend user. Please try again.')
            }
        } catch (error) {
            alert('Failed to suspend user. Please try again.')
        } finally {
            setIsSuspending(false)
        }
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

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2 text-primary">Loading users...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4">
                            Error loading users: {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && users.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}

                    {/* Desktop Table View */}
                    {!isLoading && !error && users.length > 0 && (
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
                    )}

                    {/* Mobile Card View */}
                    {!isLoading && !error && users.length > 0 && (
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
                    )}
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
