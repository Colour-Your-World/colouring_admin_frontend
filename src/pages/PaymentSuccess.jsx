import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const [countdown, setCountdown] = useState(5);

  const isSuccess = status === 'success';

  // Auto-redirect to app after countdown
  useEffect(() => {
    if (!isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Try deep link to app
          window.location.href = 'coloryourjoy://payment-success';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ">
              <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-600 mb-8">
              Your premium content is now unlocked. You can start enjoying your coloring books!
            </p>

            {/* Open App Button */}
            <a
              href="coloryourjoy://payment-success"
              className="inline-block w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(246.62deg, #074B2D 0%, #048B50 100%)' }}
            >
              Open App
            </a>

            <p className="text-sm text-gray-400 mt-4">
              Redirecting to app in {countdown} seconds...
            </p>

            {/* Info Box */}
            <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> If the app doesn't open automatically, please open the COLOR YOUR JOY app manually. Your premium content will be ready!
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Failed Icon */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Payment Failed 😔
            </h1>
            <p className="text-gray-600 mb-8">
              Something went wrong with your payment. Please try again from the app.
            </p>

            {/* Open App Button */}
            <a
              href="coloryourjoy://payment-failed"
              className="inline-block w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] bg-red-600 hover:bg-red-700"
            >
              Back to App
            </a>

            <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> No amount has been charged. You can retry the payment from the app.
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Payments are securely processed by Stripe
          </p>
          <div className="flex items-center justify-center gap-4 text-xs mt-2">
            <a href="/privacy-policy" className="text-green-700 hover:underline font-medium">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="/terms-and-conditions" className="text-green-700 hover:underline font-medium">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
