import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

const BuyBook = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const bookId = searchParams.get('bookId');
  const token = searchParams.get('token');

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const data = await response.json();

        // Extract book data even if nested under 'book' key
        const bookData = data.data?.book || data.data;
        
        if (bookData) {
          setBook(bookData);
          setError(null);
        } else {
          setError('Could not load book details.');
        }
      } catch (err) {
        setError('Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // Handle book purchase
  const handlePurchase = async () => {
    if (!userId || !bookId) return;

    try {
      setProcessing(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/payments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bookId: bookId,
        }),
      });

      const data = await response.json();
      console.log('Payment response:', data); // Debugging for developers

      const checkoutUrl = data.data?.url || data.url || data.session?.url;

      if (data.success && checkoutUrl) {
        window.location.href = checkoutUrl;
      } else if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = 'coloryourjoy://payment-success';
        }, 3000);
      } else {
        setError(data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Complete! 🎉</h1>
          <p className="text-gray-600 mb-6">Your book is now unlocked. Redirecting you back to the app...</p>
          <a
            href="coloryourjoy://payment-success"
            className="inline-block w-full py-3 px-6 rounded-xl text-white font-semibold text-lg"
            style={{ background: 'linear-gradient(246.62deg, #074B2D 0%, #048B50 100%)' }}
          >
            Open App
          </a>
        </div>
      </div>
    );
  }

  // Error: Missing params
  if (!userId || !bookId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600">This link is invalid. Please open this page from the COLOR YOUR JOY app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-primary shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">COLOR YOUR JOY</h1>
          <p className="text-gray-500 font-medium">Complete your purchase</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading book details...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Book Details */}
        {!loading && book && (
          <>
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
              {/* Book Cover */}
              {book.coverImage && (
                <div className="w-full h-52 rounded-xl overflow-hidden mb-5 shadow-sm border border-gray-200 bg-white">
                  <img
                    src={book.coverImage}
                    alt={book.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{book.name}</h2>
              {book.description && (
                <p className="text-gray-600 text-sm mb-5 line-clamp-3">{book.description}</p>
              )}

              {/* Price */}
              <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <span className="text-gray-600 font-semibold uppercase tracking-wider text-xs">Total Amount</span>
                <div className="flex items-baseline gap-1">
                  {book.price > 0 ? (
                    <>
                      <span className="text-sm font-bold text-gray-400">$</span>
                      <span className="text-3xl font-black text-gray-900">{book.price}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-green-700">FREE</span>
                  )}
                </div>
              </div>

              {/* Pages info */}
              {book.pages && book.pages.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{book.pages.length} PAGES INCLUDED</span>
                </div>
              )}
            </div>

            {/* Buy Button */}
            <button
              onClick={handlePurchase}
              disabled={processing}
              className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 bg-primary group"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {book.price > 0 ? `Buy Now — $${book.price}` : 'Get It For Free'}
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure 256-bit SSL encrypted payment
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/privacy-policy" target="_blank" className="text-green-700 hover:text-green-800 transition-colors font-semibold">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="/terms-and-conditions" target="_blank" className="text-green-700 hover:text-green-800 transition-colors font-semibold">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyBook;
