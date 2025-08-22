import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

function FloatingSphere() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() / 2;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshWobbleMaterial
        factor={0.6}
        speed={2}
        color="#1976d2"
        envMapIntensity={1}
      />
    </mesh>
  );
}

export default function IntroScene() {
  return (
    <motion.div
      className="intro-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </motion.div>
  );
}
