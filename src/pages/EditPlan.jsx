import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import Input from '../components/Input'
import { usePlans } from '../hooks/usePlans'
import arrowLeft from '../assets/arrowLeft.svg'

const EditPlan = () => {
    const navigate = useNavigate()
    const { planId } = useParams()
    const location = useLocation()
    const { updatePlan } = usePlans()
    
    const [formData, setFormData] = useState({
        planName: '',
        price: '',
        duration: 'monthly',
        features: ''
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState('')

    // Load plan data from location state or fetch from API
    useEffect(() => {
        if (location.state?.plan) {
            const plan = location.state.plan
            setFormData({
                planName: plan.name || '',
                price: plan.price?.toString() || '',
                duration: plan.duration || 'monthly',
                features: plan.features?.join('\n') || ''
            })
        }
    }, [location.state])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleCancel = () => {
        navigate('/plans')
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.planName.trim()) {
            newErrors.planName = 'Plan name is required'
        }
        
        if (!formData.price || parseFloat(formData.price) < 0) {
            newErrors.price = 'Valid price is required'
        }
        
        if (!formData.duration) {
            newErrors.duration = 'Duration is required'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSaveChanges = async (e) => {
        e.preventDefault()
        
        // Clear previous API error
        setApiError('')
        
        // Validate form
        if (!validateForm()) {
            return
        }
        
        setIsSubmitting(true)
        
        try {
            // Parse features from textarea (comma or newline separated)
            const featuresArray = formData.features
                .split(/[\n,]+/)
                .map(f => f.trim())
                .filter(f => f.length > 0)
            
            const planData = {
                name: formData.planName.trim(),
                price: parseFloat(formData.price),
                duration: formData.duration,
                features: featuresArray
            }
            
            const result = await updatePlan(planId, planData)
            
            if (result.success) {
                // Navigate back to manage plans
                navigate('/plans')
            } else {
                setApiError(result.error || 'Failed to update plan')
            }
        } catch (error) {
            setApiError(error.message || 'An error occurred while updating the plan')
        } finally {
            setIsSubmitting(false)
        }
    }

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
                            onClick={() => navigate('/plans')}
                        />
                        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Edit Plan</h1>
                    </div>
                </div>

                <div className="mx-auto px-4 max-w-7xl">
                    {/* Edit Plan Form */}
                    <div className="rounded-2xl border-common p-6">
                        <h2 className="text-2xl font-bold text-primary mb-6 sm:mb-8">Edit Plan Details</h2>
                        
                        <form onSubmit={handleSaveChanges} className="space-y-6">
                            {/* Plan Name and Price Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {/* Plan Name */}
                                <div>
                                    <Input
                                        id="planName"
                                        name="planName"
                                        label="Plan Name"
                                        type="text"
                                        value={formData.planName}
                                        onChange={handleInputChange}
                                        placeholder="Enter plan name"
                                        required
                                    />
                                    {errors.planName && (
                                        <p className="text-sm text-red-500 mt-1">{errors.planName}</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <Input
                                        id="price"
                                        name="price"
                                        label="Price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="00"
                                        min="0"
                                        step="0.01"
                                        required
                                    >
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">$</span>
                                    </Input>
                                    {errors.price && (
                                        <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                                    )}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm text-primary mb-2">
                                    Duration<span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duration"
                                            value="monthly"
                                            checked={formData.duration === 'monthly'}
                                            onChange={handleInputChange}
                                            className="cursor-pointer"
                                        />
                                        <span className="text-sm text-primary">Monthly</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="duration"
                                            value="yearly"
                                            checked={formData.duration === 'yearly'}
                                            onChange={handleInputChange}
                                            className="cursor-pointer"
                                        />
                                        <span className="text-sm text-primary">Yearly</span>
                                    </label>
                                </div>
                                {errors.duration && (
                                    <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                                )}
                            </div>

                            {/* Features */}
                            <div>
                                <label htmlFor="features" className="block text-sm text-primary mb-2">
                                    Features
                                </label>
                                <textarea
                                    id="features"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    placeholder="Enter features (one per line or comma separated)"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-[10px] focus:outline-none shadow-sm transition-all duration-200 text-primary placeholder:text-secondary bg-[#FBFFF5] border-common resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate multiple features with commas or new lines</p>
                            </div>

                            {/* API Error Display */}
                            {apiError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="text-sm">{apiError}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-[#0F100B] text-primary rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    className="px-9 py-3 cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditPlan

