const IMAGE_FILE_REGEX = /\.(png|jpe?g|gif|webp|svg)$/i;
export const DEFAULT_PDF_PAGE_LIMIT = 30;

export const isPdfBook = (bookOrUrl) => {
    if (!bookOrUrl) return false;
    const source = typeof bookOrUrl === 'string' ? bookOrUrl : bookOrUrl.originalFile;
    if (!source || typeof source !== 'string') return false;
    return source.toLowerCase().endsWith('.pdf');
};

/**
 * Convert Cloudinary RAW PDF URL → Image Page URL
 * Correct format:
 * /raw/upload/...pdf  →  /image/upload/pg_<page>/...pdf
 */
export const getPdfPageUrl = (pdfUrl, pageNumber = 1) => {
    if (!pdfUrl) return null;
    const page = Math.max(1, pageNumber);

    return pdfUrl
        .replace('/raw/upload/', `/image/upload/pg_${page}/`)
        .replace('/image/upload/', `/image/upload/pg_${page}/`);
};

export const getBookCoverImage = (book) => {
    if (!book) return null;

    if (book.coverImage) return book.coverImage;

    if (isPdfBook(book)) {
        return getPdfPageUrl(book.originalFile, 1);
    }

    if (book.pages && book.pages.length > 0) {
        const coverPage = book.pages.find((p) => p.pageNumber === 1) || book.pages[0];
        return coverPage?.imageUrl || null;
    }

    if (book.originalFile && IMAGE_FILE_REGEX.test(book.originalFile)) {
        return book.originalFile;
    }

    return null;
};

export const getBookPageUrl = (book, pageNumber = 1) => {
    if (!book) return null;

    if (isPdfBook(book)) {
        return getPdfPageUrl(book.originalFile, pageNumber);
    }

    if (book.pages && book.pages.length > 0) {
        const target = book.pages.find((p) => p.pageNumber === pageNumber)
            || book.pages[pageNumber - 1];
        return target?.imageUrl || null;
    }

    return null;
};

export const getBookTotalPages = (book, fallback = DEFAULT_PDF_PAGE_LIMIT) => {
    if (!book) return fallback;

    if (book.totalPages && book.totalPages > 0) {
        return book.totalPages;
    }

    if (book.pages && book.pages.length > 0) {
        return book.pages.length;
    }

    if (isPdfBook(book)) {
        return fallback;
    }

    return fallback;
};
