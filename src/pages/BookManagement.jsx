import { useState } from 'react'
import Header from '../components/Header'
import BookList from '../components/BookList'
import Pagination from '../components/Pagination'
import Button from '../components/Button'
import AddBookModal from '../components/AddBookModal'
import arrowLeft from '../assets/arrowLeft.svg'
import magnifier from '../assets/magnifier.svg'
import plusIcon from '../assets/addCircle.svg'

const BookManagement = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Sample book data
    const books = [
        {
            id: 1,
            title: "Daily Activities",
            cover: "/api/placeholder/60/80",
            status: "active",
            type: "free",
            price: null
        },
        {
            id: 2,
            title: "Farm Animals Coloring Booklet",
            cover: "/api/placeholder/60/80",
            status: "inactive",
            type: "premium",
            price: 99
        },
        {
            id: 3,
            title: "Original Dinosaur",
            cover: "/api/placeholder/60/80",
            status: "active",
            type: "free",
            price: null
        },
        {
            id: 4,
            title: "Dot The Numbers Coloring Book",
            cover: "/api/placeholder/60/80",
            status: "active",
            type: "free",
            price: null
        },
        {
            id: 5,
            title: "Farm Animals Coloring Booklet",
            cover: "/api/placeholder/60/80",
            status: "active",
            type: "premium",
            price: 89
        },
        {
            id: 6,
            title: "Daily Activities",
            cover: "/api/placeholder/60/80",
            status: "inactive",
            type: "free",
            price: null
        },
        {
            id: 7,
            title: "Farm Animals Coloring Booklet",
            cover: "/api/placeholder/60/80",
            status: "active",
            type: "premium",
            price: 89
        },
        {
            id: 8,
            title: "Original Dinosaur",
            cover: "/api/placeholder/60/80",
            status: "active",
            type: "free",
            price: null
        },
        {
            id: 9,
            title: "Dot The Numbers Coloring Book",
            cover: "/api/placeholder/60/80",
            status: "active",
            type: "premium",
            price: 89
        }
    ]

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = activeFilter ? book.status === 'active' : true
        return matchesSearch && matchesFilter
    })

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentBooks = filteredBooks.slice(startIndex, endIndex)

    const handleAddBook = (bookData) => {
        console.log('Adding new book:', bookData)
        // Here you would typically add the book to your data source
        // For now, we'll just log the data
    }

    return (
        <div className="min-h-screen">
            <Header />
            <div className="bg-[#FBFFF5]">
            <div className="container mx-auto px-4 py-6 max-w-8xl ">
                {/* Title Bar */}
                <div className="flex items-center gap-3 pb-4 ">
                    <img src={arrowLeft} alt="Back" className="w-6 h-6 cursor-pointer" />
                    <h1 className="text-xl font-semibold text-primary">Manage your books</h1>
                </div>
                <div className="rounded-2xl border-common">
                    {/* Controls */}
                    <div className="px-6 py-4">
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
                                    <span className="text-sm font-medium text-primary">Active Books</span>
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
                        <div className="mt-4 pb-4 bg-[#FBFFF5]">
                            <BookList books={currentBooks} />
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100">
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
            onAddBook={handleAddBook}
        />
    </div>
    )   
}

export default BookManagement
