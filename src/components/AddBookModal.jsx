import { useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import closeCircle from '../assets/closeCircle.svg'
import upload from '../assets/upload.svg'
import Button from './Button'
import Input from './Input'
import apiService from '../services/api'

const validationSchema = Yup.object({
    bookName: Yup.string()
        .trim()
        .required('Book name is required'),
    description: Yup.string()
        .trim()
        .required('Description is required'),
    isFree: Yup.boolean().default(true),
    price: Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('isFree', {
            is: false,
            then: schema => schema
                .typeError('Price must be a number')
                .min(0.01, 'Price must be greater than 0')
                .required('Price is required for premium books'),
            otherwise: schema => schema.notRequired(),
        }),
    file: Yup.mixed().required('PDF file is required'),
})

const initialValues = {
    bookName: '',
    description: '',
    isFree: true,
    price: '',
    file: null,
}

const AddBookModal = ({ isOpen, onClose, onSubmit }) => {
    const fileInputRef = useRef(null)

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

    const uploadFileToBook = async (bookId, file) => {
        try {
            const result = await apiService.uploadBookFile(bookId, file)
            return { success: true, data: result }
        } catch (error) {
            return { success: false, error: error.message }
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
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
                        setStatus(null)

                        try {
                            const bookData = {
                                name: values.bookName.trim(),
                                description: values.description.trim(),
                                type: values.isFree ? 'free' : 'premium',
                                price: values.isFree ? 0 : Number(values.price) || 0,
                            }

                            const bookResult = await onSubmit(bookData)

                            if (bookResult.success) {
                                if (values.file) {
                                    const bookId = bookResult.data?.book?._id
                                        || bookResult.data?._id
                                        || bookResult.data?.id

                                    if (!bookId) {
                                        throw new Error('Book ID not found in response')
                                    }

                                    const uploadResult = await uploadFileToBook(bookId, values.file)

                                    if (!uploadResult.success) {
                                        setStatus(uploadResult.error || 'Failed to upload file')
                                        return
                                    }
                                }

                                resetForm()
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = ''
                                }
                                onClose()
                            } else {
                                setStatus(bookResult.error || 'Failed to create book')
                            }
                        } catch (error) {
                            setStatus(error.message || 'An error occurred while creating the book')
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        setFieldTouched,
                        isSubmitting,
                        status,
                    }) => (
                        <Form className="py-3 px-5 space-y-4 pb-6">
                            {/* Upload Section */}
                            <div className="border-3 border-dashed border-[#B5B5B4] rounded-2xl p-6 text-center hover:border-green-500 transition-colors">
                                <div className="flex flex-col items-center gap-3">
                                    <img src={upload} alt="Upload" className="w-16 h-16" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary mb-2">Upload new book</h3>
                                        <p className="text-sm text-gray-500">Supported format: PDF</p>
                                    </div>
                                    <Button
                                        type="button"
                                        className="cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSubmitting}
                                    >
                                        Choose File
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null
                                            setFieldValue('file', file)
                                            setFieldTouched('file', true, false)
                                        }}
                                        className="hidden"
                                        disabled={isSubmitting}
                                    />
                                    {values.file && (
                                        <p className="text-sm text-[#048B50] font-medium">
                                            Selected: {values.file.name}
                                        </p>
                                    )}
                                    {touched.file && errors.file && (
                                        <p className="text-sm text-red-500">{errors.file}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <Input
                                    id="bookName"
                                    name="bookName"
                                    label="Book Name"
                                    type="text"
                                    value={values.bookName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter book name"
                                    error={errors.bookName}
                                    touched={touched.bookName}
                                    disabled={isSubmitting}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter description"
                                        rows={4}
                                        className={`w-full px-4 py-3 border-common rounded-lg ${touched.description && errors.description ? 'border-red-500' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {touched.description && errors.description && (
                                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary mb-3">
                                        Is Book Free For User?
                                    </label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="isFree"
                                                checked={values.isFree}
                                                onChange={() => {
                                                    setFieldValue('isFree', true)
                                                    setFieldValue('price', '')
                                                    setFieldTouched('price', false, false)
                                                }}
                                                disabled={isSubmitting}
                                            />
                                            <span className="text-sm text-primary">Free</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-secondary cursor-pointer">
                                            <input
                                                type="radio"
                                                name="isFree"
                                                checked={!values.isFree}
                                                onChange={() => setFieldValue('isFree', false)}
                                                disabled={isSubmitting}
                                            />
                                            <span className="text-sm text-primary">Premium</span>
                                        </label>
                                    </div>
                                </div>

                                {!values.isFree && (
                                    <Input
                                        id="price"
                                        name="price"
                                        label="Price"
                                        type="number"
                                        value={values.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter price"
                                        min="0"
                                        step="0.01"
                                        error={errors.price}
                                        touched={touched.price}
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>

                            {status && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="text-sm">{status}</p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding Book...' : 'Add Book'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AddBookModal

