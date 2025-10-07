import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import premium from '../assets/premium.svg'
import deleteIcon from '../assets/delete.svg'
import editIcon from '../assets/edit.svg'
import DeleteModal from './DeleteModal'
import apiService from '../services/api'

const BookList = ({ books, onBookDeleted }) => {
  const navigate = useNavigate()
  const [bookStatuses, setBookStatuses] = useState({})

  // Update book statuses when books data changes
  useEffect(() => {
    const newStatuses = books.reduce((acc, book) => ({ 
      ...acc, 
      [book.id]: book.status === 'active' || book.isActive === true 
    }), {})
    setBookStatuses(newStatuses)
  }, [books])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' })

  const toggleBookStatus = async (bookId) => {
    const currentStatus = bookStatuses[bookId]
    const newStatus = !currentStatus
    
    // Optimistically update UI
    setBookStatuses(prev => ({
      ...prev,
      [bookId]: newStatus
    }))
    
    try {
      // Call API to update book status
      await apiService.updateBook(bookId, {
        isActive: newStatus
      })
      
      // Notify parent component to refresh data
      if (onBookDeleted) {
        onBookDeleted(bookId)
      }
    } catch (error) {
      // Revert on error
      setBookStatuses(prev => ({
        ...prev,
        [bookId]: currentStatus
      }))
      setErrorModal({ 
        isOpen: true, 
        message: 'Failed to update book status. Please try again.' 
      })
    }
  }

  const handleEdit = (bookId) => {
    const book = books.find(b => b.id === bookId)
    navigate(`/books/edit/${bookId}`, { state: { book } })
  }

  const handleDelete = (bookId) => {
    const book = books.find(b => b.id === bookId)
    setBookToDelete(book)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (bookToDelete) {
      setIsDeleting(true)
      try {
        await apiService.deleteBook(bookToDelete.id)
        if (onBookDeleted) {
          onBookDeleted(bookToDelete.id)
        }
        setIsDeleteModalOpen(false)
        setBookToDelete(null)
      } catch (error) {
        console.error('Error deleting book:', error)
        setErrorModal({ 
          isOpen: true, 
          message: 'Failed to delete book. Please try again.' 
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {books.map((book, index) => {
                const isOddRow = (index + 1) % 2 === 1
                const shouldHighlight = isOddRow

                return (
                  <tr key={book.id} className={`rounded-table-row ${shouldHighlight ? 'bg-[#F3F8EC]' : ''}`}>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-15 h-20 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200">
                          {book.cover && book.cover !== "/api/placeholder/60/80" ? (
                            <img 
                              src={book.cover} 
                              alt={book.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <span 
                            className="text-xs text-secondary"
                            style={{ display: book.cover && book.cover !== "/api/placeholder/60/80" ? 'none' : 'block' }}
                          >
                            Cover
                          </span>
                        </div>
                        <h3 className="font-medium text-primary">{book.title}</h3>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary">
                          {bookStatuses[book.id] ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleBookStatus(book.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer  ${bookStatuses[book.id] ? 'bg-secondary' : 'bg-gray-300'
                            }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${bookStatuses[book.id] ? 'translate-x-5' : 'translate-x-1'
                              }`}
                          />
                        </button>

                      </div>
                    </td>
                    <td className="py-4 pr-4 ">
                      {book.type === 'premium' ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#FAC416] w-fit">
                          <img src={premium} alt="Premium" className="w-4 h-4" />
                          <span className="text-sm font-medium text-primary"><span className="text-[#FFAA39] font-medium">Premium</span> ${book.price}</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full bg-[#0F100B0F] w-fit">
                          <span className="text-sm text-primary ">Free</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(book.id)}
                          className="p-2 rounded-lg transition-colors cursor-pointer"
                        >
                          <img src={editIcon} alt="Edit" className="w-10 h-10 " />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 rounded-lg transition-colors cursor-pointer"
                        >
                          <img src={deleteIcon} alt="Delete" className="w-10 h-10 " />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {books.map((book, index) => {
          const isOddRow = (index + 1) % 2 === 1
          const shouldHighlight = isOddRow

          return (
            <div
              key={book.id}
              className={`rounded-2xl p-2 sm:p-4 ${shouldHighlight ? 'bg-[#F3F8EC]' : ''}`}
            >
              <div className="flex gap-2 sm:gap-4">
                {/* Book cover */}
                <div className="w-14 h-auto sm:w-12 sm:h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {book.cover && book.cover !== "/api/placeholder/60/80" ? (
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span 
                    className="text-[10px] sm:text-xs text-primary"
                    style={{ display: book.cover && book.cover !== "/api/placeholder/60/80" ? 'none' : 'block' }}
                  >
                    Cover
                  </span>
                </div>

                {/* Book content */}
                <div className="flex-1 ml-2 min-w-0">
                  <h3 className=" font-medium text-primary truncate text-sm sm:text-base">
                    {book.title}
                  </h3>

                  {/* Status + Price */}
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {/* Status toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookStatus(book.id)}
                        className={`relative inline-flex h-4 w-7 sm:h-5 sm:w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${bookStatuses[book.id] ? 'bg-secondary' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform ${bookStatuses[book.id] ? 'translate-x-4 sm:translate-x-5' : 'translate-x-1'
                            }`}
                        />
                      </button>
                      <span className="text-[11px] sm:text-xs text-gray-500">
                        {bookStatuses[book.id] ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Price / Free */}
                    <div className="flex items-center justify-between gap-2">
                      {book.type === 'premium' ? (
                        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#FAC416] w-fit">
                          <img src={premium} alt="Premium" className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-[11px] sm:text-sm font-medium text-primary">
                            <span className="text-[#FFAA39] font-medium">Premium</span> ${book.price}
                          </span>
                        </div>
                      ) : (
                        <div className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#0F100B0F] w-fit">
                          <span className="text-[11px] sm:text-sm text-primary">Free</span>
                        </div>
                      )}
                      {/* Action buttons */}
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleEdit(book.id)}
                          className="p-1 rounded-lg transition-colors cursor-pointer"
                        > 
                          <img src={editIcon} alt="Edit" className="w-7 h-7 " />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <img src={deleteIcon} alt="Delete" className="w-7 h-7" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDelete}
        userName={bookToDelete?.title || 'this book'}
        deleteType="book"
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default BookList
