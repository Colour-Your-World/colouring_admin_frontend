import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import Button from '../components/Button'
import AddPageModal from '../components/AddPageModal'
import DeleteModal from '../components/DeleteModal'
import roundAltArrowLeft from '../assets/roundAltArrowLeft.svg'
import roundAltArrowRight from '../assets/roundAltArrowRight.svg'
import upload2 from '../assets/upload2.svg'
import editImage1 from '../assets/editImage1.svg'
import editImage2 from '../assets/editImage2.svg'
import editImage3 from '../assets/editImage3.svg'
import editImage4 from '../assets/editImage4.svg'
import clip2 from '../assets/clip2.svg'
import backArrow from '../assets/arrowLeft.svg'
import closeCircle from '../assets/closeCircle.svg'
import apiService from '../services/api'
import { DEFAULT_PDF_PAGE_LIMIT, getBookPageUrl, getBookTotalPages, isPdfBook } from '../utils/bookUtils'

const PDF_PAGE_PREVIEW_LIMIT = DEFAULT_PDF_PAGE_LIMIT

const EditBook = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { bookId } = useParams()
    
    const [bookData, setBookData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        bookName: '',
        description: '',
        isFree: true,
        price: ''
    })


    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const [isPageModalOpen, setIsPageModalOpen] = useState(false)
    const [pages, setPages] = useState([])
    const [isPdfFile, setIsPdfFile] = useState(false)
    const thumbnailRefs = useRef([])
    const [deletingPageId, setDeletingPageId] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [pageToDelete, setPageToDelete] = useState(null)

    const buildPagesFromBook = (book) => {
        if (!book) return []
        if (isPdfBook(book)) {
            const totalPages = getBookTotalPages(book, PDF_PAGE_PREVIEW_LIMIT) || PDF_PAGE_PREVIEW_LIMIT
            return Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1
                return {
                    id: pageNumber,
                    pageNumber,
                    type: pageNumber === 1 ? 'cover' : 'coloring',
                    image: getBookPageUrl(book, pageNumber) || clip2,
                    title: pageNumber === 1 ? 'Cover Page' : `Page ${pageNumber}`,
                    isPdfGenerated: true
                }
            })
        }

        if (book?.pages && book.pages.length > 0) {
            return book.pages.map((page, index) => ({
                id: page.pageNumber || index + 1,
                pageNumber: page.pageNumber || index + 1,
                type: index === 0 ? 'cover' : 'coloring',
                image: page.imageUrl || clip2,
                title: index === 0 ? 'Cover Page' : `Coloring Page ${index}`,
                originalData: page
            }))
        }

        return [
            { id: 1, pageNumber: 1, type: 'cover', image: clip2, title: 'Cover Page' },
            { id: 2, pageNumber: 2, type: 'coloring', image: editImage1, title: 'Coloring Page 1' },
            { id: 3, pageNumber: 3, type: 'coloring', image: editImage2, title: 'Coloring Page 2' },
            { id: 4, pageNumber: 4, type: 'coloring', image: editImage3, title: 'Coloring Page 3' },
            { id: 5, pageNumber: 5, type: 'coloring', image: editImage4, title: 'Coloring Page 4' }
        ]
    }

    const handlePageImageError = (page) => {
        if (!isPdfFile || !page?.pageNumber || page.pageNumber <= 1) return
        setPages((prevPages) => {
            const hasPage = prevPages.some((p) => p.pageNumber === page.pageNumber)
            if (!hasPage) return prevPages
            return prevPages.filter((p) => p.pageNumber < page.pageNumber)
        })
        setCurrentPageIndex((prevIndex) => {
            const newIndex = page.pageNumber - 2
            return newIndex >= 0 ? Math.min(prevIndex, newIndex) : 0
        })
    }

    // Fetch book data on component mount 
    useEffect(() => {
        const fetchBookData = async () => {
            try {
                setLoading(true)
                const bookIdToUse = bookId || location.state?.book?.id
                
                if (!bookIdToUse) {
                    setError('No book ID provided')
                    return
                }

                // Try to fetch from API first
                try {
                    const response = await apiService.getBook(bookIdToUse)
                    
                    // The book data is nested in response.data.book
                    const book = response.data.book || response.data
                    setBookData(book)
                    setIsPdfFile(isPdfBook(book))
                    
                    // Update form data
                    setFormData({
                        bookName: book.name || '',
                        description: book.description || '',
                        isFree: book.type === 'free',
                        price: book.price || ''
                    })
                    
                    setPages(buildPagesFromBook(book))
                } catch (apiError) {
                    // Fallback to location state data
                    const fallbackBook = location.state?.book
                    if (fallbackBook) {
                        setBookData(fallbackBook)
                        setIsPdfFile(isPdfBook(fallbackBook))
                        setFormData({
                            bookName: fallbackBook.title || fallbackBook.name || '',
                            description: fallbackBook.description || '',
                            isFree: fallbackBook.type === 'free',
                            price: fallbackBook.price || ''
                        })

                        setPages(buildPagesFromBook(fallbackBook))
                    } else {
                        throw apiError
                    }
                }
            } catch (error) {
                console.error('Error fetching book data:', error)
                setError('Failed to load book data')
            } finally {
                setLoading(false)
            }
        }

        fetchBookData()
    }, [bookId, location.state?.book?.id])

    const handleSave = async () => {
        try {
            setSaving(true)
            
            const bookIdToUse = bookId || location.state?.book?.id
            if (!bookIdToUse) {
                alert('No book ID found')
                return
            }

            const updateData = {
                name: formData.bookName.trim(),
                description: formData.description.trim(),
                type: formData.isFree ? 'free' : 'premium',
                price: formData.isFree ? 0 : parseFloat(formData.price) || 0
            }

            await apiService.updateBook(bookIdToUse, updateData)
            navigate('/books')
        } catch (error) {
            console.error('Error saving book:', error)
            alert('Failed to save book. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    // Scroll to current page when index changes
    useEffect(() => {
        if (thumbnailRefs.current[currentPageIndex]) {
            thumbnailRefs.current[currentPageIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            })
        }
    }, [currentPageIndex])

    const handlePageNavigation = (direction) => {
        if (direction === 'left' && currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1)
        } else if (direction === 'right' && currentPageIndex < pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1)
        }
    }

    const handleAddNewPage = () => {
        if (isPdfFile) return
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
    }

    const handleDeletePageClick = (page, index) => {
        if (isPdfFile) return
        // Prevent deletion if only one page remains
        if (pages.length <= 1) {
            alert('Cannot delete the last page of the book')
            return
        }

        setPageToDelete({ page, index })
        setIsDeleteModalOpen(true)
    }

    const confirmDeletePage = async () => {
        if (!pageToDelete || isPdfFile) return

        const { page, index } = pageToDelete

        try {
            setDeletingPageId(page.id)
            
            const bookIdToUse = bookId || location.state?.book?.id
            const pageNumber = page.originalData?.pageNumber || page.id

            // Call API to delete page
            await apiService.deletePage(bookIdToUse, pageNumber)

            // Update local state
            const updatedPages = pages.filter((_, idx) => idx !== index)
            setPages(updatedPages)

            // Adjust current page index if necessary
            if (currentPageIndex >= updatedPages.length) {
                setCurrentPageIndex(Math.max(0, updatedPages.length - 1))
            } else if (currentPageIndex > index) {
                setCurrentPageIndex(currentPageIndex - 1)
            }

            // Close modal and reset state
            setIsDeleteModalOpen(false)
            setPageToDelete(null)

        } catch (error) {
            console.error('Error deleting page:', error)
            alert('Failed to delete page. Please try again.')
        } finally {
            setDeletingPageId(null)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-8xl">
                <div className="flex justify-center items-center py-20">
                    <div className="text-primary text-lg">Loading book data...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-8xl">
                <div className="flex justify-center items-center py-20">
                    <div className="text-red-500 text-lg">{error}</div>
                </div>
            </div>
        )
    }

    if (!bookData) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-8xl">
                <div className="flex justify-center items-center py-20">
                    <div className="text-gray-500 text-lg">Book not found</div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
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
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>

                {/* Page Management Section */}
                <div className="rounded-2xl border-3 border-[#B5B5B4] px-3 py-6 mb-6">
                    {/* Book Title */}
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold text-primary">{bookData.name || 'Untitled Book'}</h2>
                    
                         {/* Add New Page Button */}
                         {!isPdfFile && (
                             <div 
                                 className="flex justify-end items-center gap-2 text-[#00673A] cursor-pointer mt-1 sm:mt-0 hover:text-[#048B50] transition-colors"
                                 onClick={handleAddNewPage}
                             >
                                 <img src={upload2} alt="Upload" className="w-4 h-4 cursor-pointer" />
                                 <span className="text-sm text-[#00673A] cursor-pointer">Add New Page</span>
                             </div>
                         )}
                    </div>
                    
                    {/* Page Thumbnails */}
                    <div className="relative pt-6">
                        <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            {/* Left Arrow */}
                            <button
                                onClick={() => handlePageNavigation('left')}
                                disabled={currentPageIndex === 0}
                                className={`absolute left-0 transform top-1/2 -translate-y-1/2 z-10  ${
                                    currentPageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                            >
                                <img 
                                    src={roundAltArrowLeft} 
                                    alt="Previous" 
                                    className="w-10 h-10"
                                />
                            </button>

                            {/* Page Thumbnails */}
                            <div className="flex gap-4 flex-1 px-12">
                                {pages.map((page, index) => (
                                    <div 
                                        key={page.id} 
                                        ref={(el) => (thumbnailRefs.current[index] = el)}
                                        className="flex-shrink-0 relative pt-3 pr-3"
                                    >
                                        <div 
                                            className={`w-32 h-auto cursor-pointer rounded-xl border-5 ${
                                                index === currentPageIndex ? 'border-[#00673A]' : 'border-[#4EA1C1]'
                                            } transition-all`}
                                            onClick={() => setCurrentPageIndex(index)}
                                        >
                                            <img 
                                                src={page.image} 
                                                alt={page.title}
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    if (e.currentTarget.dataset.fallback === 'true') return
                                                    e.currentTarget.dataset.fallback = 'true'
                                                    e.currentTarget.src = clip2
                                                    handlePageImageError(page)
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Delete Button - Always visible */}
                                        {!isPdfFile && pages.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeletePageClick(page, index)
                                                }}
                                                disabled={deletingPageId === page.id}
                                                className={`absolute top-0 right-0 bg-white rounded-full shadow-md z-20 ${
                                                    deletingPageId === page.id ? 'cursor-wait opacity-50' : 'cursor-pointer hover:scale-110'
                                                } transition-transform`}
                                                title="Delete page"
                                            >
                                                <img 
                                                    src={closeCircle} 
                                                    alt="Delete" 
                                                    className="w-6 h-6"
                                                />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => handlePageNavigation('right')}
                                disabled={currentPageIndex === pages.length - 1}
                                className={`absolute right-0 transform top-1/2 -translate-y-1/2 z-10   ${
                                    currentPageIndex === pages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                            >
                                <img 
                                    src={roundAltArrowRight} 
                                    alt="Next" 
                                    className="w-10 h-10"
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

             {/* Add Page Modal */}
            {!isPdfFile && (
                <AddPageModal
                    isOpen={isPageModalOpen}
                    onClose={() => setIsPageModalOpen(false)}
                    onAddPage={handleAddPage}
                    bookId={bookId || location.state?.book?.id}
                    existingPages={pages}
                />
            )}

             {/* Delete Page Modal */}
             <DeleteModal
                 isOpen={isDeleteModalOpen}
                 onClose={() => {
                     setIsDeleteModalOpen(false)
                     setPageToDelete(null)
                 }}
                 onDelete={confirmDeletePage}
                 userName={pageToDelete?.page?.title || 'this page'}
                 deleteType="page"
                 isDeleting={deletingPageId === pageToDelete?.page?.id}
             />
         </div>
     )
 }
 
 export default EditBook
