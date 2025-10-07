import { useState, useEffect } from 'react'
import closeCircle from '../assets/closeCircle.svg'
import upload from '../assets/upload.svg'
import Button from './Button'
import apiService from '../services/api'



const AddBookModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        bookName: '',
        description: '',
        isFree: true,
        price: '',
        file: null
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState('')

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.bookName.trim()) {
            newErrors.bookName = 'Book name is required'
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }
        
        if (!formData.file) {
            newErrors.file = 'PDF file is required'
        }
        
        // Validate premium books must have price
        if (!formData.isFree && (!formData.price || parseFloat(formData.price) <= 0)) {
            newErrors.price = 'Premium books must have a price greater than 0'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Clear previous API error
        setApiError('')
        
        // Validate form
        if (!validateForm()) {
            return
        }
        
        setIsSubmitting(true)
        
        try {
            // Step 1: Create book (without file)
            const bookData = {
                name: formData.bookName.trim(),
                description: formData.description.trim(),
                type: formData.isFree ? 'free' : 'premium',
                price: formData.isFree ? 0 : parseFloat(formData.price) || 0
            };
            
            const bookResult = await onSubmit(bookData);
            
            if (bookResult.success) {
                // Step 2: Upload file to the created book
                if (formData.file) {
                    // Try different possible property paths for book ID
                    const bookId = bookResult.data.book?._id || bookResult.data._id || bookResult.data.id;
                    
                    if (!bookId) {
                        throw new Error('Book ID not found in response');
                    }
                    
                    const uploadResult = await uploadFileToBook(bookId, formData.file);
                    
                    if (uploadResult.success) {
                        // Reset form and close modal
                        setFormData({
                            bookName: '',
                            description: '',
                            isFree: true,
                            price: '',
                            file: null
                        });
                        setErrors({})
                        setApiError('')
                        onClose();
                    } else {
                        setApiError(uploadResult.error || 'Failed to upload file');
                    }
                } else {
                    // No file to upload, just close
                    setFormData({
                        bookName: '',
                        description: '',
                        isFree: true,
                        price: '',
                        file: null
                    });
                    setErrors({})
                    setApiError('')
                    onClose();
                }
            } else {
                setApiError(bookResult.error || 'Failed to create book');
            }
        } catch (error) {
            setApiError(error.message || 'An error occurred while creating the book');
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] })
    }

    const uploadFileToBook = async (bookId, file) => {
        try {
            const result = await apiService.uploadBookFile(bookId, file);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="bg-[#FBFFF5] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between py-3 px-5">
                    <h2 className="text-xl font-semibold text-primary">Add New Book</h2>
                    <button
                        onClick={onClose}
                        className="p-2 transition-colors cursor-pointer"
                    >
                        <img src={closeCircle} alt="Close" className="w-8 h-8" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="py-3 px-5 space-y-4 pb-6">
                    {/* Upload Section */}
                    <div className="border-3 border-dashed border-[#B5B5B4] rounded-2xl p-6 text-center hover:border-green-500 transition-colors">
                        <div className="flex flex-col items-center gap-3">
                            <img src={upload} alt="Upload" className="w-16 h-16" />
                            <div>
                                <h3 className="text-lg font-semibold text-primary mb-2">Upload new book</h3>
                                <p className="text-sm text-gray-500">Supported format: PDF</p>
                            </div>
                            <Button
                                type="button "
                                className="cursor-pointer"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                Choose File
                            </Button>
                            <input
                                id="fileInput"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {formData.file && (
                                <p className="text-sm text-[#048B50] font-medium">
                                    Selected: {formData.file.name}
                                </p>
                            )}
                            {errors.file && (
                                <p className="text-sm text-red-500">{errors.file}</p>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Book Name */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Book Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.bookName}
                                onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
                                placeholder="Enter book name"
                                className={`w-full px-4 py-3 border-common rounded-lg focus:outline-none ${errors.bookName ? 'border-red-500' : ''}`}
                            />
                            {errors.bookName && (
                                <p className="text-sm text-red-500 mt-1">{errors.bookName}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter description"
                                rows={4}
                                className={`w-full px-4 py-3 border-common rounded-lg ${errors.description ? 'border-red-500' : ''}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Book Type */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-3">
                                Is Book Free For User?
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bookType"
                                        checked={formData.isFree}
                                        onChange={() => setFormData({ ...formData, isFree: true, price: '' })}
                                    />
                                    <span className="text-sm text-primary">Free</span>
                                </label>
                                <label className="flex items-center gap-2 text-secondary cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bookType"
                                        checked={!formData.isFree}
                                        onChange={() => setFormData({ ...formData, isFree: false })}
                                    />
                                    <span className="text-sm text-primary">Premium</span>
                                </label>
                            </div>
                        </div>

                        {/* Price (if Premium) */}
                        {!formData.isFree && (
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    required={!formData.isFree}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    className={`w-full px-4 py-3 border-common rounded-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.price ? 'border-red-500' : ''}`}
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* API Error Display */}
                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            <p className="text-sm">{apiError}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding Book...' : 'Add Book'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBookModal
