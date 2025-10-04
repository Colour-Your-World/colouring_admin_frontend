import { useState, useEffect } from 'react'
import closeCircle from '../assets/closeCircle.svg'
import upload from '../assets/upload.svg'
import Button from './Button'

const AddPageModal = ({ isOpen, onClose, onAddPage }) => {
    const [formData, setFormData] = useState({
        pageTitle: '',
        pageType: 'coloring', // 'cover' or 'coloring'
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
        if (!formData.pageTitle || !formData.file) {
            alert('Page Title and Image file are required.')
            return
        }

        const newPage = {
            pageTitle: formData.pageTitle,
            pageType: formData.pageType,
            file: formData.file.name, // In a real app, you'd upload the file
            image: URL.createObjectURL(formData.file) // Create preview URL
        }
        onAddPage(newPage)
        onClose()
        // Reset form
        setFormData({
            pageTitle: '',
            pageType: 'coloring',
            file: null
        })
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="bg-[#FBFFF5] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between py-3 px-5">
                    <h2 className="text-xl font-semibold text-primary">Add New Page</h2>
                    <button
                        onClick={onClose}
                        className="p-2 transition-colors cursor-pointer"
                    >
                        <img src={closeCircle} alt="Close" className="w-8 h-8" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="py-3 px-5 space-y-4">
                    {/* Upload Section */}
                    <div className="border-3 border-dashed border-[#B5B5B4] rounded-2xl p-6 text-center hover:border-green-500 transition-colors">
                        <div className="flex flex-col items-center gap-3">
                            <img src={upload} alt="Upload" className="w-16 h-16" />
                            <div>
                                <h3 className="text-lg font-semibold text-primary mb-2">Upload page image</h3>
                                <p className="text-sm text-gray-500">Supported formats: PNG, JPG, PDF</p>
                            </div>
                            <Button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => document.getElementById('pageFileInput').click()}
                            >
                                Choose File
                            </Button>
                            <input
                                id="pageFileInput"
                                type="file"
                                accept=".png,.jpg,.jpeg,.pdf"
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
                    {/* <div className="space-y-4">
                        Page Title
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Page Title<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.pageTitle}
                                onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                                placeholder="Enter page title"
                                className="w-full px-4 py-3 border-common rounded-lg focus:outline-none"
                            />
                        </div>

                        Page Type
                        <div>
                            <label className="block text-sm font-medium text-primary mb-3">
                                Page Type
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pageType"
                                        value="cover"
                                        checked={formData.pageType === 'cover'}
                                        onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                                    />
                                    <span className="text-sm text-primary">Cover Page</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="pageType"
                                        value="coloring"
                                        checked={formData.pageType === 'coloring'}
                                        onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                                    />
                                    <span className="text-sm text-primary">Coloring Page</span>
                                </label>
                            </div>
                        </div>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="cursor-pointer"
                        >
                            Add Page
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPageModal
