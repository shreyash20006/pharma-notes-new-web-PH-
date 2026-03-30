import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

// Animated Logo Component for NotesDrive
export default function NotesDriveLogo({ variant = 'default', size = 'md', animated = true }: {
  variant?: 'default' | 'minimal' | 'full' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm', icon: 'w-4 h-4', tagline: 'text-[8px]' },
    md: { container: 'w-12 h-12', text: 'text-xl', icon: 'w-6 h-6', tagline: 'text-[10px]' },
    lg: { container: 'w-16 h-16', text: 'text-3xl', icon: 'w-8 h-8', tagline: 'text-xs' },
    xl: { container: 'w-24 h-24', text: 'text-5xl', icon: 'w-12 h-12', tagline: 'text-sm' },
  };

  const { container, text, icon, tagline } = sizes[size];

  // Animation variants
  const iconAnimation = animated ? {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring' as const,
        stiffness: 200,
        damping: 15
      }
    },
    whileHover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  } : {};

  const glowAnimation = animated ? {
    animate: {
      boxShadow: [
        '0 0 20px rgba(59, 49, 184, 0.3)',
        '0 0 40px rgba(59, 49, 184, 0.6)',
        '0 0 20px rgba(59, 49, 184, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  } : {};

  const pulseAnimation = animated ? {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } : {};

  if (variant === 'icon-only') {
    return (
      <motion.div
        className={`${container} bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group cursor-pointer`}
        {...iconAnimation}
        {...glowAnimation}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#6366F1] to-[#3B31B8] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={animated ? {
            rotate: [0, 360],
            transition: { duration: 20, repeat: Infinity, ease: 'linear' }
          } : {}}
        />
        
        {/* Shield Icon */}
        <Shield className={`${icon} text-white relative z-10`} />
        
        {/* Sparkle effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
        )}
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.div 
        className="flex items-center gap-2 cursor-pointer group"
        whileHover={animated ? { scale: 1.02 } : undefined}
      >
        <motion.div
          className={`${container} bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
          {...iconAnimation}
          whileHover={animated ? 'hover' : undefined}
        >
          <Shield className={`${icon} text-white`} />
        </motion.div>
        <motion.div
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={animated ? { delay: 0.2 } : {}}
          className={`font-bold ${text} tracking-tight group-hover:text-[#3B31B8] transition-colors`}
        >
          NotesDrive
        </motion.div>
      </motion.div>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div 
        className="flex items-center gap-3 cursor-pointer group"
        initial={animated ? { opacity: 0, y: -20 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={animated ? { type: 'spring', stiffness: 100 } : {}}
      >
        {/* Icon Container */}
        <motion.div
          className={`${container} bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
          {...iconAnimation}
          {...glowAnimation}
          whileHover={animated ? 'hover' : undefined}
        >
          {/* Rotating background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#6366F1] to-[#3B31B8] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={animated ? {
              rotate: [0, 360],
              transition: { duration: 20, repeat: Infinity, ease: 'linear' }
            } : {}}
          />
          
          <Shield className={`${icon} text-white relative z-10`} />
          
          {/* Shimmer effect */}
          {animated && (
            <motion.div
              className="absolute inset-0"
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut'
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }}
            />
          )}
        </motion.div>

        {/* Text Container */}
        <div>
          <motion.div
            initial={animated ? { opacity: 0, x: -10 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={animated ? { delay: 0.2 } : {}}
            className={`font-bold ${text} tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-[#3B31B8] group-hover:to-[#6366F1] transition-all duration-300`}
          >
            NotesDrive
          </motion.div>
          <motion.div
            initial={animated ? { opacity: 0, x: -10 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={animated ? { delay: 0.3 } : {}}
            className={`${tagline} text-gray-400 -mt-1 group-hover:text-[#3B31B8] transition-colors`}
          >
            Your Smartest Study Partner
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div 
      className="flex items-center gap-3 cursor-pointer group"
      whileHover={animated ? { scale: 1.02 } : undefined}
    >
      <motion.div
        className={`${container} bg-gradient-to-br from-[#3B31B8] to-[#6366F1] rounded-xl flex items-center justify-center shadow-lg`}
        {...iconAnimation}
        whileHover={animated ? 'hover' : undefined}
      >
        <Shield className={`${icon} text-white`} />
      </motion.div>
      <div>
        <div className={`font-bold ${text} tracking-tight`}>NotesDrive</div>
        <div className={`${tagline} text-gray-400 -mt-1`}>Your Smartest Study Partner</div>
      </div>
    </motion.div>
  );
}

// Export individual logo variations
export function LogoIcon({ size = 'md', animated = true }: { size?: 'sm' | 'md' | 'lg' | 'xl'; animated?: boolean }) {
  return <NotesDriveLogo variant="icon-only" size={size} animated={animated} />;
}

export function LogoMinimal({ size = 'md', animated = true }: { size?: 'sm' | 'md' | 'lg' | 'xl'; animated?: boolean }) {
  return <NotesDriveLogo variant="minimal" size={size} animated={animated} />;
}

export function LogoFull({ size = 'md', animated = true }: { size?: 'sm' | 'md' | 'lg' | 'xl'; animated?: boolean }) {
  return <NotesDriveLogo variant="full" size={size} animated={animated} />;
}

// SVG Export Component for Logo (can be downloaded as SVG and converted to PNG)
export function LogoSVGExport() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B31B8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background Circle with Gradient */}
      <rect width="512" height="512" rx="128" fill="url(#logoGradient)" filter="url(#glow)"/>
      
      {/* Shield Icon */}
      <path 
        d="M256 96L160 128V256C160 352 256 416 256 416C256 416 352 352 352 256V128L256 96Z" 
        fill="white" 
        opacity="0.9"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Letter N inside Shield */}
      <text 
        x="256" 
        y="290" 
        fontFamily="Arial, sans-serif" 
        fontSize="160" 
        fontWeight="bold" 
        fill="url(#logoGradient)"
        textAnchor="middle"
      >
        N
      </text>
      
      {/* Shine effect */}
      <path 
        d="M200 100L300 400" 
        stroke="white" 
        strokeWidth="40" 
        opacity="0.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
