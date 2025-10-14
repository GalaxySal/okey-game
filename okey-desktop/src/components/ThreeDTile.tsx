import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDTileProps {
  tile: {
    id: string;
    value: number;
    color: 'red' | 'black' | 'yellow' | 'blue';
    isJoker?: boolean;
    isOkey?: boolean;
  };
  position: [number, number, number];
  onClick?: () => void;
  isSelected?: boolean;
}

const colorMaterials = {
  red: new THREE.MeshStandardMaterial({ color: '#ef4444' }),
  black: new THREE.MeshStandardMaterial({ color: '#374151' }),
  yellow: new THREE.MeshStandardMaterial({ color: '#fbbf24' }),
  blue: new THREE.MeshStandardMaterial({ color: '#3b82f6' }),
};

export const ThreeDTile: React.FC<ThreeDTileProps> = ({
  tile,
  position,
  onClick,
  isSelected = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Hafif sallanma animasyonu
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Seçili taş için büyüme efekti
      const scale = isSelected ? 1.2 : hovered ? 1.1 : 1.0;
      meshRef.current.scale.setScalar(scale);

      // Seçili taş için yukarı kalkma efekti
      meshRef.current.position.y = position[1] + (isSelected ? 0.5 : 0);
    }
  });

  const displayValue = tile.isJoker ? '★' : tile.isOkey ? 'OKEY' : tile.value.toString();
  const material = colorMaterials[tile.color];

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1, 1.5, 0.2]} // width, height, depth
        radius={0.1}
        smoothness={4}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial {...material} />
      </RoundedBox>

      {/* Taş değeri */}
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.3}
        color={tile.color === 'yellow' ? 'black' : 'white'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {displayValue}
      </Text>

      {/* Köşe sembolleri */}
      <Text
        position={[-0.3, 0.4, 0.15]}
        fontSize={0.15}
        color={tile.color === 'yellow' ? 'black' : 'white'}
        anchorX="center"
        anchorY="middle"
      >
        {tile.color === 'red' ? '♦' : tile.color === 'black' ? '♠' : tile.color === 'yellow' ? '◊' : '♣'}
      </Text>

      <Text
        position={[0.3, -0.4, 0.15]}
        fontSize={0.15}
        color={tile.color === 'yellow' ? 'black' : 'white'}
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, Math.PI]}
      >
        {tile.color === 'red' ? '♦' : tile.color === 'black' ? '♠' : tile.color === 'yellow' ? '◊' : '♣'}
      </Text>

      {/* 3D gölge efekti */}
      {isSelected && (
        <mesh position={[position[0], position[1] - 0.6, position[2] - 0.1]}>
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial color="rgba(0,0,0,0.3)" transparent />
        </mesh>
      )}
    </group>
  );
};
