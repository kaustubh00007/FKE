import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaMicrophone, FaCube, FaTasks } from 'react-icons/fa';
import './FeatureCarousel.css';

const features = [
  { icon: <FaRobot />, label: 'Chatbot' },
  { icon: <FaMicrophone />, label: 'Voice Commands' },
  { icon: <FaCube />, label: '3D Graphics' },
  { icon: <FaTasks />, label: 'Task Manager' },
];

export default function FeatureCarousel() {
  return (
    <div className="carousel-container">
      {features.map((feat, i) => (
        <motion.div
          key={i}
          className="carousel-item"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="icon">{feat.icon}</div>
          <div className="label">{feat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
