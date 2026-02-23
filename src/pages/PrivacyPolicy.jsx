import React from 'react';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy for COLOR YOUR JOY</h1>
        <p className="text-gray-500 mb-8 font-medium italic">Last Updated: {currentDate}</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <p className="mb-4">
              At <strong>COLOR YOUR JOY</strong>, we value your privacy. This Privacy Policy explains how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Personal Data:</strong> When you register, we collect your full name and email address.</li>
              <li><strong>Profile Information:</strong> If you upload a profile photo, we store it to display in your profile.</li>
              <li><strong>Device Information:</strong> We may collect basic device info (OS version) to improve app performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>To provide and maintain our coloring services.</li>
              <li>To manage your account and subscriptions.</li>
              <li>To process payments through our secure partner (Stripe).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">3. Payment Information</h2>
            <p>
              We use Stripe for payment processing. We do not store your credit card details on our servers. All payment data is handled securely by Stripe according to their privacy standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">4. Data Security</h2>
            <p>
              We use industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">5. Your Rights</h2>
            <p>
              You can update your profile information or delete your account at any time within the app settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">6. Contact Us</h2>
            <p>
              If you have any questions, contact us at: <a href="mailto:support@coloryourjoy.com" className="text-primary hover:underline font-medium">support@coloryourjoy.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
