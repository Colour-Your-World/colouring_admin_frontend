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

        if (data.success && data.data) {
          setBook(data.data);
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

      if (data.success && data.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.data.url;
      } else if (data.success) {
        // Payment succeeded directly
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
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
               style={{ background: 'linear-gradient(246.62deg, #074B2D 0%, #048B50 100%)' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Purchase Book</h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Book Details */}
        {!loading && book && (
          <>
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              {/* Book Cover */}
              {book.coverImage && (
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                  <img
                    src={book.coverImage}
                    alt={book.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-2">{book.name}</h2>
              {book.description && (
                <p className="text-gray-600 text-sm mb-4">{book.description}</p>
              )}

              {/* Price */}
              <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
                <span className="text-gray-600 font-medium">Price</span>
                <span className="text-2xl font-bold text-gray-900">${book.price}</span>
              </div>

              {/* Pages info */}
              {book.pages && book.pages.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{book.pages.length} pages</span>
                </div>
              )}
            </div>

            {/* Buy Button */}
            <button
              onClick={handlePurchase}
              disabled={processing}
              className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(246.62deg, #074B2D 0%, #048B50 100%)' }}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                `Buy Now — $${book.price}`
              )}
            </button>
          </>
        )}

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-gray-400">
            Secure payment powered by Stripe
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/privacy-policy" className="text-green-700 hover:underline font-medium">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="/terms-and-conditions" className="text-green-700 hover:underline font-medium">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyBook;
