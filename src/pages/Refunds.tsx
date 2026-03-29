import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

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
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-headline font-bold text-on-surface">Digital eBook Refund Policy</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                At NotesDrive, we sell digital eBooks and study materials. Due to the nature of digital products, 
                which are delivered instantly and cannot be "returned," our refund policy is designed to be fair 
                while protecting against misuse.
              </p>
              
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <h3 className="font-bold text-on-surface">7-Day Satisfaction Guarantee</h3>
                </div>
                <p className="text-on-surface-variant">
                  We offer a refund within 7 days of your eBook purchase if you experience genuine technical issues 
                  accessing or downloading your eBooks. Our goal is your complete satisfaction.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <h3 className="font-bold text-on-surface">Important Note</h3>
                </div>
                <p className="text-on-surface-variant">
                  Since eBooks are digital products delivered instantly upon purchase, refunds are evaluated on a 
                  case-by-case basis. We cannot offer refunds simply because you changed your mind after downloading 
                  the content.
                </p>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Eligibility for Refund</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                You may be eligible for a refund if:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">You are unable to access or download the eBooks due to technical issues on our end</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">The eBook content is significantly different from the description</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">You were charged multiple times for the same purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Request is made within 7 days of purchase</span>
                </li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Non-Refundable Cases</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                Refunds will NOT be provided in the following cases:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">You have already downloaded or accessed the eBook content</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Request made after 7 days of purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Change of mind after seeing the content</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Violation of our Terms & Conditions (sharing, piracy, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">Multiple refund requests from the same account</span>
                </li>
              </ul>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Cancellation Policy</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                <strong>Before Payment:</strong> You can cancel your purchase anytime before completing the payment. 
                Simply close the payment window.
              </p>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                <strong>After Payment:</strong> Since NotesDrive Premium eBooks (₹499) is a one-time purchase with 
                instant digital delivery, there is no subscription to cancel. Your premium access is granted for 
                lifetime once purchased.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                <strong>Account Deletion:</strong> If you wish to delete your account, you can contact us at 
                notesdriveshop@gmail.com. Please note that account deletion does not automatically qualify for a refund 
                if eBooks have already been accessed.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">How to Request a Refund</h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-on-surface-variant">
                <li>Email us at <strong>notesdriveshop@gmail.com</strong></li>
                <li>Subject line: "Refund Request - [Your Email]"</li>
                <li>Include your registered email address</li>
                <li>Provide your payment transaction ID or order number</li>
                <li>Explain the reason for your refund request</li>
                <li>Attach screenshots if there are technical issues</li>
              </ol>
              <p className="text-on-surface-variant mt-4">
                We will review your refund request within 3-5 business days. If approved, the refund will be 
                credited to your original payment method within 5-7 business days.
              </p>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant">
              <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Contact for Refunds</h2>
              <p className="text-on-surface-variant leading-relaxed">
                For any refund-related queries, please contact us:<br /><br />
                <strong>Email:</strong> notesdriveshop@gmail.com<br />
                <strong>Phone:</strong> +91 8668301185<br />
                <strong>Address:</strong> Jaihind Housing Society, Shyam Nagar, Somalwada, Nagpur, Maharashtra, India<br />
                <strong>Response Time:</strong> Within 24-48 hours
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
