import { BookOpen, Brain, Zap, Send } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-blue-600" />,
    title: "Subject-wise Notes",
    desc: "Comprehensive PDF notes for all B.Pharma semesters, organized by subject."
  },
  {
    icon: <Brain className="h-8 w-8 text-blue-600" />,
    title: "AI Summarizer",
    desc: "Paste your complex notes and get a simplified summary in seconds using Gemini AI."
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "MCQ Generator",
    desc: "Instantly generate practice questions from any text to test your knowledge."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PharmaNotes?</h2>
          <p className="text-gray-500">Built specifically for the needs of Indian Pharmacy students.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
