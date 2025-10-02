import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import AddPageModal from '../components/AddPageModal'
import roundAltArrowLeft from '../assets/roundAltArrowLeft.svg'
import roundAltArrowRight from '../assets/roundAltArrowRight.svg'
import upload2 from '../assets/upload2.svg'
import editImage1 from '../assets/editImage1.svg'
import editImage2 from '../assets/editImage2.svg'
import editImage3 from '../assets/editImage3.svg'
import editImage4 from '../assets/editImage4.svg'
import clip2 from '../assets/clip2.svg'
import backArrow from '../assets/arrowLeft.svg'

const EditBook = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const bookData = location.state?.book || {
        id: 1,
        title: 'African Jungle Safari',
        description: '',
        type: 'premium',
        price: 99,
        status: 'active'
    }

    const [formData, setFormData] = useState({
        bookName: bookData.title,
        description: bookData.description || '',
        isFree: bookData.type === 'free',
        price: bookData.price || ''
    })

    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [isPageModalOpen, setIsPageModalOpen] = useState(false)
    const [pages, setPages] = useState([
        { id: 1, type: 'cover', image: clip2, title: 'Cover Page'},
        { id: 2, type: 'coloring', image: editImage1, title: 'Coloring Page 1'},
        { id: 3, type: 'coloring', image: editImage2, title: 'Coloring Page 2'},
        { id: 4, type: 'coloring', image: editImage3, title: 'Coloring Page 3'},
        { id: 5, type: 'coloring', image: editImage4, title: 'Coloring Page 4'}
    ])

    const handleSave = () => {
        console.log('Saving book:', formData)
        // Here you would typically save the book data
        navigate('/books')
    }

    const handlePageNavigation = (direction) => {
        if (direction === 'left' && currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1)
        } else if (direction === 'right' && currentPageIndex < pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1)
        }
    }

    const handleAddNewPage = () => {
        setIsPageModalOpen(true)
    }

    const handleAddPage = (newPageData) => {
        const newPage = {
            id: pages.length + 1,
            type: newPageData.pageType,
            image: newPageData.image,
            title: newPageData.pageTitle
        }
        setPages([...pages, newPage])
        console.log('Added new page:', newPage)
    }

    return (
        <div className="min-h-screen bg-[#FBFFF5]">
            <Header />
            <div className="container mx-auto px-4 py-6 max-w-8xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <img 
                            src={backArrow} 
                            alt="Back" 
                            className="w-6 h-6 cursor-pointer" 
                            onClick={() => navigate('/books')}
                        />
                        <h1 className="text-xl font-semibold text-primary">Edit Book</h1>
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleSave}
                        className="px-10 py-1 cursor-pointer"
                    >
                        Save
                    </Button>
                </div>

                {/* Page Management Section */}
                <div className="rounded-2xl border-3 border-[#B5B5B4] px-3 py-6 mb-6">
                    {/* Book Title */}
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold text-primary">{bookData.title}</h2>
                    
                         {/* Add New Page Button */}
                         <div 
                             className="flex justify-end items-center gap-2 text-[#00673A] cursor-pointer mt-1 sm:mt-0 hover:text-[#048B50] transition-colors"
                             onClick={handleAddNewPage}
                         >
                             <img src={upload2} alt="Upload" className="w-4 h-4 cursor-pointer" />
                             <span className="text-sm text-[#00673A] cursor-pointer">Add New Page</span>
                         </div>
                    </div>
                    
                    {/* Page Thumbnails */}
                    <div className="relative pt-6">
                        <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar">
                            {/* Left Arrow */}
                            <button
                                onClick={() => handlePageNavigation('left')}
                                disabled={currentPageIndex === 0}
                                className={`flex rounded-full flex items-center justify-center transition-colors cursor-pointer`}
                            >
                                <img 
                                    src={roundAltArrowLeft} 
                                    alt="Previous" 
                                    className="w-10 h-10 cursor-pointer"
                                />
                            </button>

                            {/* Page Thumbnails */}
                            <div className="flex gap-4 flex-1">
                                {pages.map((page, index) => (
                                    <div key={page.id} className="flex-shrink-0">
                                        <div className={`w-32 h-auto cursor-pointer ${
                                            index === currentPageIndex ? '' : ''
                                        }`}>
                                            <img 
                                                src={page.image} 
                                                alt={page.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => handlePageNavigation('right')}
                                disabled={currentPageIndex === pages.length - 1}
                                className={`flex rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                                    currentPageIndex === pages.length - 1 ? '' : ''
                                } transition-colors`}
                            >
                                <img 
                                    src={roundAltArrowRight} 
                                    alt="Next" 
                                    className="w-10 h-10 cursor-pointer"
                                />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Book Details Form */}
                <div className="rounded-2xl border-common p-6">
                    <div className="space-y-6">
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
                                className="w-full px-4 py-3 border-common rounded-lg focus:outline-none resize-none"
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
                                <label className="flex items-center gap-2 cursor-pointer">
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
                                    Price<span className="text-red-500">*</span>
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
                 </div>
             </div>

             {/* Add Page Modal */}
             <AddPageModal
                 isOpen={isPageModalOpen}
                 onClose={() => setIsPageModalOpen(false)}
                 onAddPage={handleAddPage}
             />
         </div>
     )
 }
 
 export default EditBook
