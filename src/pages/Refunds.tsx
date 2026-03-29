import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Refunds() {
  return (
    <div className="min-h-screen bg-surface pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-6">
            Refunds & Cancellations
          </h1>
          <p className="text-on-surface-variant mb-8">Last updated: March 30, 2026</p>

          <div className="space-y-8">
            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Refund Policy</h2>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                At NotesDrive, we strive to provide the best educational resources. We understand that sometimes 
                things don't work out as expected, and we're committed to fair refund practices.
              </p>
              
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <h3 className="font-bold text-on-surface">7-Day Money-Back Guarantee</h3>
                </div>
                <p className="text-on-surface-variant">
                  We offer a full refund within 7 days of your Premium subscription purchase if you're not 
                  satisfied with our services. No questions asked.
                </p>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Eligibility for Refund</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                You are eligible for a full refund if:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Request is made within 7 days of purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">This is your first refund request</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">You haven't downloaded more than 10 premium resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Payment was made through our official payment channels</span>
                </li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Non-Refundable Cases</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                Refunds will not be provided in the following cases:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Request made after 7 days of purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Multiple refund requests from the same account</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Violation of our Terms & Conditions</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Account suspension due to misuse</span>
                </li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Cancellation Policy</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                Since NotesDrive Premium is a one-time purchase (₹499), there is no recurring subscription to cancel. 
                Your premium access is granted for lifetime once purchased.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                If you wish to delete your account, you can contact us at support@notesdrive.shop. Please note that 
                account deletion does not automatically qualify for a refund.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">How to Request a Refund</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-on-surface-variant">
                <li>Email us at <strong>support@notesdrive.shop</strong></li>
                <li>Include your registered email address</li>
                <li>Provide your payment transaction ID</li>
                <li>Briefly explain your reason for the refund (optional)</li>
              </ol>
              <p className="text-on-surface-variant mt-4">
                We will process your refund request within 3-5 business days. The refund will be credited to your 
                original payment method within 5-7 business days after approval.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Contact for Refunds</h2>
              <p className="text-on-surface-variant leading-relaxed">
                For any refund-related queries, please contact us:<br /><br />
                <strong>Email:</strong> support@notesdrive.shop<br />
                <strong>Phone:</strong> +91 9876543210<br />
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
