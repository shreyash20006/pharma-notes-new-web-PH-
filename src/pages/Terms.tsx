import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-surface pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-6">
            Terms & Conditions
          </h1>
          <p className="text-on-surface-variant mb-8">Last updated: March 30, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">1. Introduction</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Welcome to NotesDrive ("we," "our," or "us"). By accessing or using our website at www.notesdrive.shop 
                and our services, you agree to be bound by these Terms and Conditions. If you do not agree with any 
                part of these terms, please do not use our services.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">2. Services</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                NotesDrive provides a platform for accessing and sharing educational study materials, notes, and 
                resources. Our services include:
              </p>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li>Free access to open repository of study materials</li>
                <li>Premium subscription for exclusive content (₹499 one-time payment)</li>
                <li>AI-powered summarization tools</li>
                <li>Quiz generation features</li>
                <li>PDF viewing and download capabilities</li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">3. User Accounts</h2>
              <p className="text-on-surface-variant leading-relaxed">
                To access certain features, you must create an account using Google Sign-In. You are responsible 
                for maintaining the confidentiality of your account and for all activities under your account. 
                You must notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">4. Payment Terms</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                Premium subscription is available for a one-time payment of ₹499 (Indian Rupees). Payment is 
                processed through secure payment gateways including Razorpay and Cashfree. By making a payment, 
                you agree to:
              </p>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li>Provide accurate payment information</li>
                <li>Authorize us to charge your payment method</li>
                <li>Comply with the payment gateway's terms of service</li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">5. Intellectual Property</h2>
              <p className="text-on-surface-variant leading-relaxed">
                All content on NotesDrive, including but not limited to text, graphics, logos, and software, 
                is the property of NotesDrive or its content suppliers and is protected by intellectual property 
                laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">6. User Content</h2>
              <p className="text-on-surface-variant leading-relaxed">
                When you upload content to NotesDrive, you grant us a non-exclusive, worldwide, royalty-free 
                license to use, reproduce, and distribute that content on our platform. You represent that you 
                have the right to upload such content and that it does not violate any third-party rights.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">7. Prohibited Activities</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li>Use the service for any illegal purpose</li>
                <li>Upload malicious content or malware</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Resell or redistribute premium content without authorization</li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">8. Limitation of Liability</h2>
              <p className="text-on-surface-variant leading-relaxed">
                NotesDrive is provided "as is" without warranties of any kind. We shall not be liable for any 
                indirect, incidental, special, or consequential damages arising from your use of our services. 
                Our total liability shall not exceed the amount paid by you for premium services.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">9. Changes to Terms</h2>
              <p className="text-on-surface-variant leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material 
                changes via email or through our website. Your continued use of the service after such changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">10. Contact Information</h2>
              <p className="text-on-surface-variant leading-relaxed">
                For any questions regarding these Terms & Conditions, please contact us at:<br />
                Email: support@notesdrive.shop<br />
                Address: Mumbai, Maharashtra, India - 400001
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
