import { useEffect, useRef } from 'react'
import calendar from '../assets/calendar.svg'

const DateRangePicker = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onApply,
    onClear,
    isOpen,
    onToggle
}) => {
    const datePickerRef = useRef(null)

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                onToggle(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onToggle])

    const handleApply = () => {
        if (startDate && endDate) {
            onApply()
            onToggle(false)
        }
    }

    return (
        <div className="relative" ref={datePickerRef}>
            <button 
                onClick={() => onToggle(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-primary transition-colors cursor-pointer hover:bg-gray-50"
            >
                <img src={calendar} alt="Calendar" className="w-4 h-4" />
                <span>Select Date Range</span>
                <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-[#FBFFF5] border border-gray-300 rounded-lg shadow-lg z-20 p-4 min-w-[300px]">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => onEndDateChange(e.target.value)}
                                min={startDate}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleApply}
                                disabled={!startDate || !endDate}
                                className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-[#00673A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Apply
                            </button>
                            <button
                                onClick={() => {
                                    onClear()
                                    onToggle(false)
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-primary rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DateRangePicker

