import { useState } from 'react';
import { motion } from 'motion/react';
import NotesDriveLogo, { LogoIcon, LogoMinimal, LogoFull, LogoSVGExport } from '../components/NotesDriveLogo';
import { Download, Copy, Check } from 'lucide-react';

export default function LogoShowcase() {
  const [copied, setCopied] = useState(false);

  const downloadSVG = () => {
    const svgElement = document.getElementById('logo-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notesdrive-logo.svg';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#3B31B8');
    gradient.addColorStop(1, '#6366F1');

    // Draw rounded rectangle background
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, 512, 512, 128);
    ctx.fill();

    // Draw shield (simplified)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.moveTo(256, 96);
    ctx.lineTo(160, 128);
    ctx.lineTo(160, 256);
    ctx.quadraticCurveTo(160, 352, 256, 416);
    ctx.quadraticCurveTo(352, 352, 352, 256);
    ctx.lineTo(352, 128);
    ctx.closePath();
    ctx.fill();

    // Draw letter N
    ctx.fillStyle = '#3B31B8';
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 256, 280);

    // Convert to PNG and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'notesdrive-logo.png';
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#3B31B8] to-[#6366F1] bg-clip-text text-transparent">
            NotesDrive Logo Showcase
          </h1>
          <p className="text-gray-400 text-lg">Animated logo variations & download options</p>
        </motion.div>

        {/* Download Section */}
        <div className="mb-16 bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Download Logo Files</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={downloadSVG}
              className="flex items-center gap-2 px-6 py-3 bg-[#3B31B8] hover:bg-[#4d42d4] rounded-xl font-semibold transition-all"
            >
              <Download className="w-5 h-5" />
              Download SVG
            </button>
            <button
              onClick={downloadPNG}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all"
            >
              <Download className="w-5 h-5" />
              Download PNG (512x512)
            </button>
          </div>
          
          {/* Hidden SVG for export */}
          <div style={{ display: 'none' }}>
            <div id="logo-svg">
              <LogoSVGExport />
            </div>
          </div>
        </div>

        {/* Logo Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Icon Only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-6">Icon Only</h3>
            <div className="flex items-center justify-center py-12 bg-white/5 rounded-xl mb-4">
              <LogoIcon size="xl" animated={true} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                <LogoIcon size="sm" animated={false} />
              </div>
              <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                <LogoIcon size="md" animated={false} />
              </div>
              <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                <LogoIcon size="lg" animated={false} />
              </div>
              <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                <LogoIcon size="xl" animated={false} />
              </div>
            </div>
          </motion.div>

          {/* Minimal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-6">Minimal (Icon + Text)</h3>
            <div className="flex items-center justify-center py-12 bg-white/5 rounded-xl mb-4">
              <LogoMinimal size="lg" animated={true} />
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <LogoMinimal size="sm" animated={false} />
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <LogoMinimal size="md" animated={false} />
              </div>
            </div>
          </motion.div>

          {/* Full Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-6">Full Logo (Icon + Text + Tagline)</h3>
            <div className="flex items-center justify-center py-12 bg-white/5 rounded-xl mb-4">
              <LogoFull size="xl" animated={true} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <LogoFull size="md" animated={false} />
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <LogoFull size="lg" animated={false} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animation Features */}
        <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold mb-6">Animation Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🔄</div>
              <h4 className="font-bold mb-2">Rotate & Scale</h4>
              <p className="text-sm text-gray-400">Spring animation on load, hover rotation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <h4 className="font-bold mb-2">Shimmer Effect</h4>
              <p className="text-sm text-gray-400">Periodic shine animation across icon</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💫</div>
              <h4 className="font-bold mb-2">Glow Pulse</h4>
              <p className="text-sm text-gray-400">Breathing shadow effect animation</p>
            </div>
          </div>
        </div>

        {/* Usage Code */}
        <div className="bg-[#0A0F1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Usage Code</h3>
            <button
              onClick={() => copyCode(`import NotesDriveLogo from './components/NotesDriveLogo';\n\n<NotesDriveLogo variant="full" size="lg" animated={true} />`)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-sm">
            <code className="text-green-400">{`import NotesDriveLogo from './components/NotesDriveLogo';

// Full logo with animation
<NotesDriveLogo variant="full" size="lg" animated={true} />

// Icon only
<NotesDriveLogo variant="icon-only" size="md" animated={true} />

// Minimal (icon + text)
<NotesDriveLogo variant="minimal" size="md" animated={true} />

// Sizes: 'sm' | 'md' | 'lg' | 'xl'
// Variants: 'default' | 'minimal' | 'full' | 'icon-only'`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
