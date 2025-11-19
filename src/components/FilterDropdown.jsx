import { useEffect, useRef } from 'react'

const FilterDropdown = ({
    label,
    options,
    selectedValue,
    onSelect,
    isOpen,
    onToggle,
    minWidth = '120px',
    placeholder = 'Select...'
}) => {
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => onToggle(!isOpen)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-primary transition-colors flex items-center justify-between cursor-pointer hover:bg-gray-50"
                style={{ minWidth }}
            >
                <span>{selectedValue || placeholder}</span>
                <svg 
                    className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#FBFFF5] border border-gray-300 rounded-lg shadow-lg z-10">
                    {options.map((option, index) => (
                        <button
                            key={option.id || option.value || index}
                            onClick={() => {
                                onSelect(option.label || option.value || option)
                                onToggle(false)
                            }}
                            className={`w-full px-4 py-2 text-sm text-primary transition-colors text-left cursor-pointer hover:bg-[#F3F8EC] ${
                                index === 0 ? 'rounded-t-lg' : ''
                            } ${
                                index === options.length - 1 ? 'rounded-b-lg' : ''
                            } ${
                                (selectedValue === (option.label || option.value || option)) ? 'bg-[#F3F8EC]' : ''
                            }`}
                        >
                            {option.label || option.value || option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FilterDropdown

