import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AIFloatingButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex items-center gap-3">

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="hidden md:block bg-white rounded-xl px-4 py-2 shadow-lg border border-slate-100"
          >
            <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">AI Teacher</p>
            <p className="text-xs text-slate-400 whitespace-nowrap">Ask me anything</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <Link to="/ai-teacher">
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-13 h-13 rounded-2xl flex items-center justify-center relative"
          style={{
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, #115E59, #14B8A6)',
            boxShadow: '0 4px 20px rgba(17, 94, 89, 0.4)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '26px', lineHeight: 1 }}>👩‍🏫</span>

          {/* Online dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white" />
        </motion.button>
      </Link>

    </div>
  );
};

export default AIFloatingButton;