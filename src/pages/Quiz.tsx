import { useState } from 'react';
import { ai } from '../lib/gemini';
import { useAuth } from '../hooks/useAuth';
import { Brain, Send, Copy, CheckCircle2, Loader2, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';

export default function Quiz() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [quiz, setQuiz] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateQuiz = async () => {
    if (!inputText.trim()) return;
    if (!user) {
      setError('Please login to use MCQ Generator.');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz('');

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a professional medical and pharmacy educator. Generate 5 multiple-choice questions (MCQs) from the following study notes for a B.Pharma student. For each question, provide 4 options (A, B, C, D) and the correct answer with a brief explanation. \n\nNotes: ${inputText}`,
      });
      setQuiz(result.text || "");
    } catch (err) {
      console.error(err);
      setError('Failed to generate quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quiz);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI MCQ Generator</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Instantly generate practice multiple-choice questions from your notes to test your knowledge and prepare for exams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Input Notes</h3>
              <span className="text-xs text-gray-400">{inputText.length} characters</span>
            </div>
            <textarea 
              className="w-full h-80 p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all text-gray-700 leading-relaxed"
              placeholder="Paste your notes here to generate MCQs..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              onClick={handleGenerateQuiz}
              disabled={loading || !inputText.trim()}
              className="w-full mt-6 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating MCQs...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate MCQs
                </>
              )}
            </button>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Practice Quiz</h3>
              {quiz && (
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Quiz'}
                </button>
              )}
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2">
              {quiz ? (
                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown>{quiz}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-20">
                  <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <HelpCircle className="h-10 w-10 opacity-20" />
                  </div>
                  <p className="font-medium">Your MCQs will appear here.</p>
                  <p className="text-xs mt-2">Paste notes on the left and click "Generate MCQs".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
