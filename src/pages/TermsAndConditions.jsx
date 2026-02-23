import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms & Conditions for COLOR YOUR JOY</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-secondary pl-4">1. Acceptance of Terms</h2>
            <p>
              By downloading and using <strong>COLOR YOUR JOY</strong>, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-secondary pl-4">2. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must provide accurate and complete information during registration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-secondary pl-4">3. Subscriptions and Payments</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>Access to premium coloring books may require a paid subscription.</li>
              <li>All payments are processed via Stripe.</li>
              <li>Subscriptions may be cancelled at any time, but refunds are subject to our refund policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-secondary pl-4">4. App Content</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>All coloring designs and images provided in the app are the property of COLOR YOUR JOY.</li>
              <li>Users are granted a limited license to use and color these images for personal, non-commercial use.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-secondary pl-4">5. Prohibited Activities</h2>
            <p>
              You agree not to reverse-engineer the app, use it for any illegal purpose, or attempt to bypass any payment restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-secondary pl-4">6. Limitation of Liability</h2>
            <p>
              COLOR YOUR JOY is provided "as is". We are not liable for any damages resulting from the use or inability to use the app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-l-4 border-secondary pl-4">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
