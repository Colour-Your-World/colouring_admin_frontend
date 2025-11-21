const IMAGE_FILE_REGEX = /\.(png|jpe?g|gif|webp|svg)$/i
export const DEFAULT_PDF_PAGE_LIMIT = 30

export const isPdfBook = (bookOrUrl) => {
    if (!bookOrUrl) return false
    const source = typeof bookOrUrl === 'string' ? bookOrUrl : bookOrUrl.originalFile
    if (!source || typeof source !== 'string') return false
    return source.toLowerCase().endsWith('.pdf')
}

export const getPdfPageUrl = (originalFile, pageNumber = 1) => {
    if (!originalFile) return null
    const safePageNumber = Math.max(1, pageNumber)
    return `${originalFile}.png?pg=${safePageNumber}`
}

export const getBookCoverImage = (book) => {
    if (!book) return null
    if (book.coverImage) return book.coverImage
    if (isPdfBook(book)) {
        return getPdfPageUrl(book.originalFile, 1)
    }
    if (book.pages && book.pages.length > 0) {
        const coverPage = book.pages.find((page) => page.pageNumber === 1) || book.pages[0]
        return coverPage?.imageUrl || null
    }
    if (book.originalFile && IMAGE_FILE_REGEX.test(book.originalFile)) {
        return book.originalFile
    }
    return null
}

export const getBookPageUrl = (book, pageNumber = 1) => {
    if (!book) return null
    if (isPdfBook(book)) {
        return getPdfPageUrl(book.originalFile, pageNumber)
    }
    if (book.pages && book.pages.length > 0) {
        const targetPage = book.pages.find((page) => page.pageNumber === pageNumber)
            || book.pages[pageNumber - 1]
        return targetPage?.imageUrl || null
    }
    return null
}

export const getBookTotalPages = (book, fallback = DEFAULT_PDF_PAGE_LIMIT) => {
    if (!book) return fallback
    if (book.totalPages && book.totalPages > 0) {
        return book.totalPages
    }
    if (book.pages && book.pages.length > 0) {
        return book.pages.length
    }
    if (isPdfBook(book)) {
        return fallback
    }
    return fallback
}

