import { useState, useEffect } from 'react'
import closeCircle from '../assets/closeCircle.svg'
import upload from '../assets/upload.svg'
import Button from './Button'



const AddBookModal = ({ isOpen, onClose, onAddBook }) => {
    const [formData, setFormData] = useState({
        bookName: '',
        description: '',
        isFree: true,
        price: '',
        file: null
    })

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

    const handleSubmit = (e) => {
        e.preventDefault()
        onAddBook(formData)
        setFormData({
            bookName: '',
            description: '',
            isFree: true,
            price: '',
            file: null
        })
        onClose()
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] })
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
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Book Name */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Book Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.bookName}
                                onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
                                placeholder="Enter book name"
                                className="w-full px-4 py-3 border-common rounded-lg focus:outline-none"
                            />
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
                                className="w-full px-4 py-3 border-common rounded-lg"
                            />
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
                                </label>
                                <input
                                    type="number"
                                    required={!formData.isFree}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-common rounded-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="cursor-pointer"
                        >
                            Add Book
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBookModal
