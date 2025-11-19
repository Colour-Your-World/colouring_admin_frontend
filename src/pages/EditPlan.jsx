import { useMemo } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import { usePlans } from '../hooks/usePlans'
import arrowLeft from '../assets/arrowLeft.svg'

const validationSchema = Yup.object({
    planName: Yup.string()
        .trim()
        .required('Plan name is required'),
    price: Yup.number()
        .typeError('Valid price is required')
        .min(0, 'Price cannot be negative')
        .required('Price is required'),
    duration: Yup.mixed()
        .oneOf(['monthly', 'yearly'], 'Duration is required')
        .required('Duration is required'),
    features: Yup.string().nullable(),
})

const EditPlan = () => {
    const navigate = useNavigate()
    const { planId } = useParams()
    const location = useLocation()
    const { updatePlan } = usePlans()

    const existingPlan = location.state?.plan

    const initialValues = useMemo(() => ({
        planName: existingPlan?.name || '',
        price: existingPlan?.price !== undefined && existingPlan?.price !== null
            ? existingPlan.price.toString()
            : '',
        duration: existingPlan?.duration || 'monthly',
        features: Array.isArray(existingPlan?.features)
            ? existingPlan.features.join('\n')
            : '',
    }), [existingPlan])

    const handleCancel = () => {
        navigate('/plans')
    }

    return (
        <>
            <div className="mx-auto px-4 py-6 max-w-7xl">
                    <div className="flex items-center gap-3">
                        <img
                            src={arrowLeft}
                            alt="Back"
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => navigate('/plans')}
                        />
                        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Edit Plan</h1>
                    </div>
                </div>

                <div className="mx-auto px-4 max-w-7xl">
                    {/* Edit Plan Form */}
                    <div className="rounded-2xl border-common p-6">
                        <h2 className="text-2xl font-bold text-primary mb-6 sm:mb-8">Edit Plan Details</h2>
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setSubmitting, setStatus }) => {
                                setStatus(null)

                                try {
                                    const featuresArray = values.features
                                        ? values.features
                                            .split(/[\n,]+/)
                                            .map(f => f.trim())
                                            .filter(f => f.length > 0)
                                        : []

                                    const planData = {
                                        name: values.planName.trim(),
                                        price: Number(values.price),
                                        duration: values.duration,
                                        features: featuresArray,
                                    }

                                    const result = await updatePlan(planId, planData)

                                    if (result.success) {
                                        navigate('/plans')
                                    } else {
                                        setStatus(result.error || 'Failed to update plan')
                                    }
                                } catch (error) {
                                    setStatus(error.message || 'An error occurred while updating the plan')
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
                                isSubmitting,
                                status,
                            }) => (
                                <Form className="space-y-6">
                                    {/* Plan Name and Price Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Plan Name */}
                                        <div>
                                            <Input
                                                id="planName"
                                                name="planName"
                                                label="Plan Name"
                                                type="text"
                                                value={values.planName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter plan name"
                                                error={errors.planName}
                                                touched={touched.planName}
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <Input
                                                id="price"
                                                name="price"
                                                label="Price"
                                                type="number"
                                                value={values.price}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="00"
                                                min="0"
                                                step="0.01"
                                                error={errors.price}
                                                touched={touched.price}
                                                disabled={isSubmitting}
                                                inputClassName="!pl-8"
                                            >
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-medium text-gray-500 pointer-events-none" style={{ lineHeight: '1' }}>$</span>
                                            </Input>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-sm text-primary mb-2">
                                            Duration<span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="duration"
                                                    value="monthly"
                                                    checked={values.duration === 'monthly'}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className="cursor-pointer"
                                                />
                                                <span className="text-sm text-primary">Monthly</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="duration"
                                                    value="yearly"
                                                    checked={values.duration === 'yearly'}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className="cursor-pointer"
                                                />
                                                <span className="text-sm text-primary">Yearly</span>
                                            </label>
                                        </div>
                                        {touched.duration && errors.duration && (
                                            <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <label htmlFor="features" className="block text-sm text-primary mb-2">
                                            Features
                                        </label>
                                        <textarea
                                            id="features"
                                            name="features"
                                            value={values.features}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter features (one per line or comma separated)"
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-[10px] focus:outline-none shadow-sm transition-all duration-200 text-primary placeholder:text-secondary bg-[#FBFFF5] border-common resize-none"
                                            disabled={isSubmitting}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Separate multiple features with commas or new lines</p>
                                    </div>

                                    {/* API Error Display */}
                                    {status && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                            <p className="text-sm">{status}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-end">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-3 border border-[#0F100B] text-primary rounded-full text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <Button
                                            type="submit"
                                            className="px-9 py-3 cursor-pointer"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
        </>
    )
}

export default EditPlan

