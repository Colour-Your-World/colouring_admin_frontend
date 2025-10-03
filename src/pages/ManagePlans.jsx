import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import arrowLeft from '../assets/arrowLeft.svg'
import plus from '../assets/addCircle.svg'
import trueIcon from '../assets/true.svg'
import threeDot from '../assets/3Dot.svg'
import deleteUser from '../assets/deleteUser.svg'

const ManagePlans = () => {
    const navigate = useNavigate()
    const [dropdownStates, setDropdownStates] = useState({})
    const [planStates, setPlanStates] = useState({
        monthly: true,
        yearly: true
    })

    // Plans data
    const plans = [
        {
            id: 'monthly',
            name: 'Monthly',
            price: '$4.99',
            features: ['Faster Processing Speed', 'HD Export Quality'],
            isActive: planStates.monthly
        },
        {
            id: 'yearly',
            name: 'Yearly',
            price: '$39.99',
            features: ['Faster Processing Speed', 'HD Export Quality'],
            isActive: planStates.yearly
        }
    ]

    const dropdownOptions = [
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

    const handlePlanToggle = (planId) => {
        setPlanStates(prev => ({
            ...prev,
            [planId]: !prev[planId]
        }))
    }

    const handleDropdownAction = (planId, action) => {
        console.log(`${action} clicked for ${planId}`)
        setDropdownStates(prev => ({
            ...prev,
            [planId]: false
        }))
    }

    return (
        <>
            <div className="min-h-screen bg-[#FBFFF5]">
                {/* Header */}
                <Header />

                {/* Page Navigation */}
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

                    {/* Plan Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {plans.map((plan) => (
                            <div key={plan.id} className="rounded-2xl border-common p-4">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="text-xl font-semibold text-primary">{plan.name} - {plan.price}</h3>
                                    <div className="relative">
                                        <button
                                            onClick={() => handleToggleDropdown(plan.id)}
                                            className="p-2 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <img src={threeDot} alt="Options" className="w-5 h-5" />
                                        </button>
                                        
                                        {dropdownStates[plan.id] && (
                                            <div className="absolute top-full bg-[#F3F8EC] right-0 mt-1 border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
                                                {dropdownOptions.map((option, index) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => handleDropdownAction(plan.id, option.id)}
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
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <img src={trueIcon} alt="Feature" className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm text-secondary">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-secondary">Active</span>
                                    <div className="relative">
                                        <button
                                            onClick={() => handlePlanToggle(plan.id)}
                                            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                                planStates[plan.id] ? 'bg-secondary' : 'bg-gray-300'
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                                                    planStates[plan.id] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManagePlans
