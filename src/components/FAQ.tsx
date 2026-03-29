export default function FAQ() {
  const faqs = [
    { q: "Are the notes free?", a: "Yes, we offer a large collection of free notes. Premium notes require a one-time subscription." },
    { q: "How does the AI Summarizer work?", a: "It uses Google Gemini AI to analyze your text and provide a concise summary of the key points." },
    { q: "Can I download PDFs?", a: "Yes, all notes can be read online or downloaded as PDFs for offline study." },
    { q: "Is it specific to B.Pharma?", a: "Yes, our content is curated specifically for the B.Pharma curriculum in India." }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.q}</h3>
              <p className="text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
