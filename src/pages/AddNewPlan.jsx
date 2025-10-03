import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import Input from '../components/Input'
import arrowLeft from '../assets/arrowLeft.svg'

const AddNewPlan = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        planName: '',
        price: '',
        features: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCancel = () => {
        navigate(-1)
    }

    const handleSaveAndPublish = () => {
        // Handle save and publish logic
        console.log('Save and publish:', formData)
        // Navigate back to manage plans
        navigate('/plans')
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
                            onClick={() => navigate(-1)}
                        />
                        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Manage Plans</h1>
                    </div>
                </div>

                <div className="mx-auto px-4 max-w-7xl">
                    {/* Add New Plan Form */}
                    <div className="rounded-2xl border-common p-6">
                        <h2 className="text-2xl font-bold text-primary mb-6 sm:mb-8">Add New Plan</h2>
                        
                        <form className="space-y-6">
                            {/* Plan Name and Price Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {/* Plan Name */}
                                <Input
                                    id="planName"
                                    name="planName"
                                    label="Plan Name"
                                    type="text"
                                    value={formData.planName}
                                    onChange={handleInputChange}
                                    placeholder="Enter plan name"
                                />

                                {/* Price */}
                                <Input
                                    id="price"
                                    name="price"
                                    label="Price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="00"
                                >
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">$</span>
                                </Input>
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
                                    placeholder="Enter features"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-[10px] focus:outline-none shadow-sm transition-all duration-200 text-primary placeholder:text-secondary bg-[#FBFFF5] border-common resize-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-[#0F100B] text-primary rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <Button
                                    onClick={handleSaveAndPublish}
                                    className="px-9 py-3"
                                >
                                    Save & Publish
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddNewPlan
