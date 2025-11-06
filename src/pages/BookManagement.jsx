import { useState, useEffect } from 'react'
import Header from '../components/Header'
import BookList from '../components/BookList'
import Pagination from '../components/Pagination'
import Button from '../components/Button'
import AddBookModal from '../components/AddBookModal'
import arrowLeft from '../assets/arrowLeft.svg'
import magnifier from '../assets/magnifier.svg'
import plusIcon from '../assets/addCircle.svg'
import { useNavigate } from 'react-router-dom'
import { useBooks } from '../hooks/useBooks'

const BookManagement = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Use the useBooks hook for dynamic data
    const { books, loading, error, createBook, fetchBooks } = useBooks()

    // Transform API data to match component expectations
    const transformedBooks = books.map(book => ({
        id: book._id,
        title: book.name,
        cover: book.coverImage || "/api/placeholder/60/80",
        status: book.isActive ? "active" : "inactive",
        isActive: book.isActive, // Keep original field for filtering
        type: book.type,
        price: book.price || null
    }))

    const filteredBooks = transformedBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = activeFilter ? book.isActive === true : true
        return matchesSearch && matchesFilter
    })

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentBooks = filteredBooks.slice(startIndex, endIndex)

    const handleAddBook = async (bookData) => {
        try {
            const result = await createBook(bookData)
            
            if (result.success) {
                setIsModalOpen(false)
            }
            return result
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to create book'
            }
        }
    }

    const handleBookDeleted = async (bookId) => {
        await fetchBooks()
    }

    const navigate = useNavigate()

    return (
        <div className="min-h-screen">
            <Header />
            <div className="bg-[#FBFFF5]">
            <div className="container mx-auto px-4 py-6 max-w-7xl ">
                {/* Title Bar */}
                <div className="flex items-center gap-3 pb-4 ">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-primary hover:text-secondary transition-colors cursor-pointer"
                    >
                        <img src={arrowLeft} alt="Back" className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-primary">Manage your books</h1>
                </div>
                <div className="rounded-2xl border-common">
                    {/* Controls */}
                    <div className="px-6 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Left side - All Books text */}
                            <div className="flex-shrink-0">
                                <span className="text-lg font-medium text-primary">All Books</span>
                            </div>

                            {/* Right side - Search bar, Toggle and Add button */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                {/* Search bar */}
                                <div className="relative w-full sm:w-auto">
                                    <img
                                        src={magnifier}
                                        alt="Search"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search Books"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-[#0F100B1A] rounded-2xl focus:outline-none text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                {/* Active Books Toggle */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-primary">Show Active Only</span>
                                    <button
                                        onClick={() => setActiveFilter(!activeFilter)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${activeFilter ? 'bg-secondary' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${activeFilter ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Add New Book Button */}
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 cursor-pointer w-fit"
                                >
                                    <img src={plusIcon} alt="Add" className="w-6 h-6" />
                                    Add New Book
                                </Button>
                            </div>
                        </div>

                        {/* Book List */}
                        <div className="mt-4 bg-[#FBFFF5]">
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-primary">Loading books...</div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-red-500">Error loading books: {error}</div>
                                </div>
                            ) : currentBooks.length === 0 ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-gray-500">No books found</div>
                                </div>
                            ) : (
                                <BookList books={currentBooks} onBookDeleted={handleBookDeleted} />
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredBooks.length}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Add Book Modal */}
        <AddBookModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddBook}
        />
    </div>
    )   
}

export default BookManagement
