import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Paper, Typography, Slider, Box } from '@mui/material';

const AnimatedBox = ({ color, rotation }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotation.x;
      meshRef.current.rotation.y += delta * rotation.y;
      meshRef.current.rotation.z += delta * rotation.z;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const ThreeDBox = () => {
  const [color, setColor] = useState('#ff6b35');
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  const colors = ['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#4ecdc4', '#45b7d1'];

  return (
    <Paper elevation={3} className="p-4 max-w-sm mx-auto animate-slide-in">
      <Typography variant="h6" className="mb-4 text-center font-semibold">
        Interactive 3D Object
      </Typography>

      <div className="h-64 w-full mb-4 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <AnimatedBox 
            color={color} 
            rotation={{ x: rotationSpeed, y: rotationSpeed * 0.7, z: 0 }}
          />
        </Canvas>
      </div>

      <Box className="space-y-4">
        <div>
          <Typography variant="body2" className="mb-2">Color:</Typography>
          <div className="flex gap-2 justify-center">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform \${
                  color === c ? 'border-gray-800 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <Typography variant="body2" className="mb-2">
            Rotation Speed: {rotationSpeed.toFixed(1)}
          </Typography>
          <Slider
            value={rotationSpeed}
            onChange={(_, value) => setRotationSpeed(value)}
            min={0}
            max={2}
            step={0.1}
            size="small"
          />
        </div>
      </Box>
    </Paper>
  );
};

export default ThreeDBox;