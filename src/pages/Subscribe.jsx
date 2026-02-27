import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

const Subscribe = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/plans`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setPlans(data.data);
          // Auto-select first plan
          if (data.data.length > 0) {
            setSelectedPlan(data.data[0]._id);
          }
        } else {
          setError('Could not load plans. Please try again.');
        }
      } catch (err) {
        setError('Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle subscription purchase
  const handleSubscribe = async () => {
    if (!userId || !selectedPlan) return;

    try {
      setProcessing(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/payments/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          planId: selectedPlan,
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.data.url;
      } else if (data.success) {
        // Payment succeeded directly
        setSuccess(true);
        // Redirect back to app after 3 seconds
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated! 🎉</h1>
          <p className="text-gray-600 mb-6">Your premium content is now unlocked. Redirecting you back to the app...</p>
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

  // Error: No userId
  if (!userId) {
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
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{ background: 'linear-gradient(246.62deg, #074B2D 0%, #048B50 100%)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">COLOR YOUR JOY</h1>
          <p className="text-gray-500 font-medium">Choose your premium plan</p>
        </div>

        {/* Loading State */}
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

        {/* Plans */}
        {!loading && plans.length > 0 && (
          <div className="space-y-3 mb-8">
            {plans.map((plan) => (
              <button
                key={plan._id}
                onClick={() => setSelectedPlan(plan._id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selectedPlan === plan._id
                    ? 'border-green-600 bg-green-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                    )}
                    {plan.features && plan.features.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                    {plan.duration && (
                      <p className="text-xs text-gray-500">
                        / {plan.duration === 30 ? 'month' : plan.duration === 365 ? 'year' : `${plan.duration} days`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Selected indicator */}
                {selectedPlan === plan._id && (
                  <div className="mt-3 flex items-center gap-2 text-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Subscribe Button */}
        {!loading && plans.length > 0 && (
          <button
            onClick={handleSubscribe}
            disabled={processing || !selectedPlan}
            className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'linear-gradient(246.62deg, #074B2D 0%, #048B50 100%)' }}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              'Subscribe Now'
            )}
          </button>
        )}

        {/* No plans */}
        {!loading && plans.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-500">No plans available at the moment.</p>
          </div>
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

export default Subscribe;
