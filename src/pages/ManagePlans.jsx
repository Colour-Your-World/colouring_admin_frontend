import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import DeleteModal from '../components/DeleteModal'
import { usePlans } from '../hooks/usePlans'
import arrowLeft from '../assets/arrowLeft.svg'
import plus from '../assets/addCircle.svg'
import trueIcon from '../assets/true.svg'
import threeDot from '../assets/3Dot.svg'
import deleteUser from '../assets/deleteUser.svg'
import editUser from '../assets/editUser.svg'

const ManagePlans = () => {
    const navigate = useNavigate()
    const { plans: apiPlans, isLoading, error, updatePlan, deletePlan, fetchPlans } = usePlans()
    const [dropdownStates, setDropdownStates] = useState({})
    const [planStates, setPlanStates] = useState({})
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [planToDelete, setPlanToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Initialize plan states when API data loads
    useEffect(() => {
        if (apiPlans.length > 0) {
            const states = apiPlans.reduce((acc, plan) => ({
                ...acc,
                [plan._id]: plan.isActive
            }), {})
            setPlanStates(states)
        }
    }, [apiPlans])

    const dropdownOptions = [
        { id: 'edit', label: 'Edit Plan', icon: editUser, isDestructive: false },
        { id: 'delete', label: 'Delete Plan', icon: deleteUser, isDestructive: true }
    ]

    const handleAddNewPlan = () => {
        navigate('/plans/add')
    }

    const handleToggleDropdown = (planId) => {
        setDropdownStates(prev => ({
            ...prev,
            [planId]: !prev[planId]
        }))
    }

    const handlePlanToggle = async (planId) => {
        const currentStatus = planStates[planId]
        const newStatus = !currentStatus
        
        // Optimistically update UI
        setPlanStates(prev => ({
            ...prev,
            [planId]: newStatus
        }))
        
        try {
            // Call API to update plan status
            await updatePlan(planId, { isActive: newStatus })
        } catch (error) {
            // Revert on error
            setPlanStates(prev => ({
                ...prev,
                [planId]: currentStatus
            }))
            alert('Failed to update plan status. Please try again.')
        }
    }

    const handleDropdownAction = (planId, action) => {
        if (action === 'edit') {
            const plan = apiPlans.find(p => p._id === planId)
            // Navigate to edit page with plan data
            navigate(`/plans/edit/${planId}`, { state: { plan } })
        } else if (action === 'delete') {
            const plan = apiPlans.find(p => p._id === planId)
            setPlanToDelete(plan)
            setIsDeleteModalOpen(true)
        }
        
        setDropdownStates(prev => ({
            ...prev,
            [planId]: false
        }))
    }

    const confirmDeletePlan = async () => {
        if (!planToDelete) return

        try {
            setIsDeleting(true)
            await deletePlan(planToDelete._id)
            setIsDeleteModalOpen(false)
            setPlanToDelete(null)
        } catch (error) {
            alert('Failed to delete plan. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="mx-auto px-4 py-6 max-w-7xl">
                    <div className="flex items-center gap-3 pb-4 sm:pb-6">
                        <img
                            src={arrowLeft}
                            alt="Back"
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => navigate(-1)}
                        />
                        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Manage Plans</h1>
                    </div>
                </div>

                <div className="mx-auto px-4 max-w-7xl">
                    {/* Available Plans Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-primary">Available Plans</h2>
                        <Button
                            onClick={handleAddNewPlan}
                            className='cursor-pointer!'
                        >
                            <div className="flex items-center gap-2 cursor-pointer ">
                                <img src={plus} alt="Add" className="w-6 h-6" />
                                <span>Add New Plan</span>
                            </div>
                        </Button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <span className="ml-3 text-primary text-lg">Loading plans...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            Error loading plans: {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && apiPlans.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg mb-4">No plans found</p>
                            <Button onClick={handleAddNewPlan} className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <img src={plus} alt="Add" className="w-5 h-5" />
                                    <span>Create Your First Plan</span>
                                </div>
                            </Button>
                        </div>
                    )}

                    {/* Plan Cards */}
                    {!isLoading && !error && apiPlans.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {apiPlans.map((plan) => (
                                <div key={plan._id} className="rounded-2xl border-common p-4">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="text-xl font-semibold text-primary">
                                        {plan.name} - ${plan.price}/{plan.duration}
                                    </h3>
                                    <div className="relative">
                                        <button
                                            onClick={() => handleToggleDropdown(plan._id)}
                                            className="p-2 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <img src={threeDot} alt="Options" className="w-5 h-5" />
                                        </button>
                                        
                                        {dropdownStates[plan._id] && (
                                            <div className="absolute top-full bg-[#F3F8EC] right-0 mt-1 border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                                                {dropdownOptions.map((option, index) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleDropdownAction(plan._id, option.id)}
                                                        className={`w-full px-4 py-2 text-sm transition-colors text-left flex items-center gap-2 text-primary cursor-pointer ${
                                                            index === 0 ? 'rounded-t-lg' : ''
                                                        } ${
                                                            index === dropdownOptions.length - 1 ? 'rounded-b-lg' : ''
                                                        } ${
                                                            option.isDestructive 
                                                                ? '' 
                                                                : ''
                                                        }`}
                                                    >
                                                        {option.icon && (
                                                            <img src={option.icon} alt={option.label} className="w-4 h-4" />
                                                        )}
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-3 mb-1">
                                    {plan.features && plan.features.length > 0 ? (
                                        plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <img src={trueIcon} alt="Feature" className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-sm text-secondary">{feature}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No features added</p>
                                    )}
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-secondary">Active</span>
                                    <div className="relative">
                                        <button
                                            onClick={() => handlePlanToggle(plan._id)}
                                            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                                planStates[plan._id] ? 'bg-secondary' : 'bg-gray-300'
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                                                    planStates[plan._id] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setPlanToDelete(null)
                }}
                onDelete={confirmDeletePlan}
                userName={planToDelete?.name || 'this plan'}
                deleteType="plan"
                isDeleting={isDeleting}
            />
        </>
    )
}

export default ManagePlans
