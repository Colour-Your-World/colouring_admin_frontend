import { useEffect } from 'react'
import closeCircle from '../assets/closeCircle.svg'
import deleteModal from '../assets/deleteModal.svg'
import Button from './Button'

const DeleteModal = ({ isOpen, onClose, onDelete, userName = "this user", deleteType = "account", isDeleting = false }) => {
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

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="bg-[#FBFFF5] rounded-2xl w-full max-w-md shadow-lg">
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={onClose}
                        className="p-2 transition-colors cursor-pointer"
                    >
                        <img src={closeCircle} alt="Close" className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {/* Illustration */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src={deleteModal} 
                            alt="Delete Account Illustration" 
                            className="w-60 h-auto"
                        />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-primary text-center mb-3">
                        {deleteType === "book" ? "Delete Book" : "Delete Account"}
                    </h2>

                    {/* Confirmation Message */}
                    <p className="text-sm text-secondary text-center mb-8">
                        Are you sure you want to delete {deleteType === "book" ? userName : `${userName}'s account`}?
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="px-6 py-2 cursor-pointer rounded-full bg-[#FBFFF5] text-primary"
                            style={{ border: '1px solid #0F100B' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleDelete}
                            className="px-6 py-2 cursor-pointer"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
