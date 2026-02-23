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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">5. Your Rights & Data Deletion</h2>
            <p className="mb-4">
              You have the right to access, update, or delete your personal information. You can manage your profile details directly within the app settings.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">How to Delete Your Account</h3>
              <p className="text-red-700 mb-4">
                If you wish to permanently delete your account and all associated data, you can do so by following these steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-red-700">
                <li>Go to the <strong>Profile</strong> page in the app.</li>
                <li>Click on <strong>Edit Profile</strong>.</li>
                <li>Scroll down and click the <strong>"Delete Account"</strong> button.</li>
                <li>Confirm the deletion in the popup modal.</li>
              </ol>
              <p className="mt-4 text-sm text-red-600 italic">
                Note: This action is permanent. Once deleted, your account, payments, and subscriptions will be removed from our database and cannot be recovered.
              </p>
            </div>
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
