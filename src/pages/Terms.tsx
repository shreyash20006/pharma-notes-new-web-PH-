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
                and purchasing our digital eBooks, you agree to be bound by these Terms and Conditions. If you do not 
                agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">2. Products & Services</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                NotesDrive is an online platform for purchasing and accessing digital educational eBooks and study 
                materials. Our products include:
              </p>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li>Digital eBooks in PDF format</li>
                <li>Premium study notes and materials</li>
                <li>AI-powered summarization tools</li>
                <li>Quiz and MCQ generation features</li>
                <li>Lifetime access to purchased eBooks</li>
              </ul>
              <p className="text-on-surface-variant leading-relaxed mt-4">
                <strong>Pricing:</strong> Premium eBook access is available for a one-time payment of ₹499 (Indian Rupees).
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">3. Digital Product Delivery</h2>
              <p className="text-on-surface-variant leading-relaxed">
                All eBooks and digital products are delivered instantly upon successful payment. You will receive 
                immediate access to download your purchased eBooks through your NotesDrive dashboard. Digital products 
                are non-tangible and delivered electronically.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">4. User Accounts</h2>
              <p className="text-on-surface-variant leading-relaxed">
                To purchase and access eBooks, you must create an account using Google Sign-In. You are responsible 
                for maintaining the confidentiality of your account and for all activities under your account. 
                Each purchase is linked to your account and cannot be transferred to another user.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">5. Payment Terms</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                Payment for eBooks is processed through secure payment gateways including Razorpay and Cashfree. 
                All prices are displayed in Indian Rupees (₹). By making a payment, you agree to:
              </p>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li>Provide accurate payment information</li>
                <li>Authorize us to charge your payment method for ₹499</li>
                <li>Accept that digital products are delivered instantly after payment</li>
                <li>Comply with the payment gateway's terms of service</li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">6. Intellectual Property & License</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                All eBooks, content, graphics, and materials on NotesDrive are protected by intellectual property 
                laws. Upon purchase, you receive a personal, non-transferable, non-exclusive license to:
              </p>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li>Download and read the eBooks for personal use</li>
                <li>Store the eBooks on your personal devices</li>
                <li>Print copies for personal reference only</li>
              </ul>
              <p className="text-on-surface-variant leading-relaxed mt-4">
                You may NOT reproduce, distribute, share, resell, or create derivative works from our eBooks 
                without our express written permission.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">7. Prohibited Activities</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-on-surface-variant space-y-2">
                <li>Share, distribute, or resell purchased eBooks</li>
                <li>Upload eBooks to file-sharing or torrent sites</li>
                <li>Remove any watermarks or copyright notices</li>
                <li>Use the eBooks for commercial purposes without authorization</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Create multiple accounts to exploit our services</li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">8. Limitation of Liability</h2>
              <p className="text-on-surface-variant leading-relaxed">
                NotesDrive eBooks are provided "as is" for educational purposes. We shall not be liable for any 
                indirect, incidental, special, or consequential damages arising from your use of our eBooks. 
                Our total liability shall not exceed the amount paid by you (₹499).
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
                For any questions regarding these Terms & Conditions, please contact us at:<br /><br />
                <strong>Email:</strong> notesdriveshop@gmail.com<br />
                <strong>Phone:</strong> +91 8668301185<br />
                <strong>Address:</strong> Jaihind Housing Society, Shyam Nagar, Somalwada, Nagpur, Maharashtra, India
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
