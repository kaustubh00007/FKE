import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import './VoiceWidget.css';

export default function VoiceWidget({ onCommand }) {
  const [listening, setListening] = useState(false);

  const toggleListen = () => {
    setListening(!listening);
    // Hook into Web Speech API here if needed
  };

  return (
    <motion.button
      className={`voice-widget ${listening ? 'listening' : ''}`}
      onClick={toggleListen}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
    </motion.button>
  );
}
