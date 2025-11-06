import { useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import closeCircle from '../assets/closeCircle.svg'
import upload from '../assets/upload.svg'
import Button from './Button'
import Input from './Input'
import apiService from '../services/api'

const validationSchema = Yup.object({
    pageTitle: Yup.string()
        .trim()
        .max(120, 'Title must be 120 characters or less')
        .nullable(),
    pageType: Yup.mixed().oneOf(['cover', 'coloring']).required('Page type is required'),
    file: Yup.mixed().required('Image file is required.'),
})

const initialValues = {
    pageTitle: '',
    pageType: 'coloring',
    file: null,
}

const AddPageModal = ({ isOpen, onClose, onAddPage, bookId, existingPages = [] }) => {
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
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
                        setStatus(null)

                        if (!bookId) {
                            setStatus('Book ID is required.')
                            setSubmitting(false)
                            return
                        }

                        try {
                            const nextPageNumber = existingPages.length > 0
                                ? Math.max(...existingPages.map(page => page.pageNumber || page.id)) + 1
                                : 1

                            if (!nextPageNumber || nextPageNumber < 1) {
                                throw new Error('Valid page number is required.')
                            }

                            const response = await apiService.addPage(bookId, nextPageNumber, values.file)

                            const newPage = {
                                id: nextPageNumber,
                                pageNumber: nextPageNumber,
                                type: values.pageType,
                                image: URL.createObjectURL(values.file),
                                title: values.pageTitle?.trim() || `Page ${nextPageNumber}`,
                                originalData: response.data || response,
                            }

                            onAddPage(newPage)
                            resetForm()
                            if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                            }
                            onClose()
                        } catch (error) {
                            console.error('Add page error:', error)
                            setStatus(error.message || 'Failed to add page. Please try again.')
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
                        <Form className="py-3 px-5 space-y-4">
                            {/* Error Message */}
                            {status && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-600 text-sm">{status}</p>
                                </div>
                            )}

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
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSubmitting}
                                    >
                                        Choose File
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.pdf"
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
                                    id="pageTitle"
                                    name="pageTitle"
                                    label="Page Title"
                                    type="text"
                                    value={values.pageTitle}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter page title (optional)"
                                    helperText="Leave blank to auto-generate"
                                    error={errors.pageTitle}
                                    touched={touched.pageTitle}
                                    disabled={isSubmitting}
                                />

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
                                                checked={values.pageType === 'cover'}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting}
                                            />
                                            <span className="text-sm text-primary">Cover Page</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="pageType"
                                                value="coloring"
                                                checked={values.pageType === 'coloring'}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting}
                                            />
                                            <span className="text-sm text-primary">Coloring Page</span>
                                        </label>
                                    </div>
                                    {touched.pageType && errors.pageType && (
                                        <p className="text-sm text-red-500 mt-1">{errors.pageType}</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                    disabled={isSubmitting || !values.file}
                                >
                                    {isSubmitting ? 'Adding Page...' : 'Add Page'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AddPageModal

