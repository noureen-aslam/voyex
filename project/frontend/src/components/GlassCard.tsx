import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const GlassCard = ({ children, className = '', hover = true, gradient = false }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`
        ${gradient
          ? 'bg-gradient-to-br from-dark-card/50 to-dark-lighter/50'
          : 'bg-dark-card/30'
        }
        backdrop-blur-xl border border-white/10 rounded-2xl
        ${hover ? 'hover:border-brand-indigo/50 hover:shadow-xl hover:shadow-brand-indigo/20' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
