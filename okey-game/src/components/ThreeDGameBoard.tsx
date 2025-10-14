import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ThreeDTile } from './ThreeDTile';
import type { Tile } from './Tile';

interface ThreeDGameBoardProps {
  playerTiles: Tile[];
  centerTiles: Tile[];
  otherPlayers: {
    player2: Tile[];
    player3: Tile[];
    player4: Tile[];
  };
  onTileClick?: (tile: Tile) => void;
  selectedTile?: Tile | null;
}

export const ThreeDGameBoard: React.FC<ThreeDGameBoardProps> = ({
  playerTiles,
  centerTiles,
  otherPlayers,
  onTileClick,
  selectedTile
}) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-green-800 to-green-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 5, 8], fov: 60 }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Aydınlatma */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Ortam */}
          <Environment preset="park" />

          {/* Gölgeler */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
          />

          {/* Yer Taşları - Merkez */}
          <group position={[0, 0, 0]}>
            {centerTiles.slice(0, 8).map((tile, index) => {
              const angle = (index / 8) * Math.PI * 2;
              const radius = 2;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;

              return (
                <ThreeDTile
                  key={tile.id || index}
                  tile={tile}
                  position={[x, 0, z]}
                  onClick={() => onTileClick?.(tile)}
                  isSelected={selectedTile?.id === tile.id}
                />
              );
            })}
          </group>

          {/* Oyuncu Taşları - Alt */}
          <group position={[0, -3, 4]}>
            {playerTiles.map((tile, index) => (
              <ThreeDTile
                key={tile.id}
                tile={tile}
                position={[
                  (index - (playerTiles.length - 1) / 2) * 1.2,
                  0,
                  0
                ]}
                onClick={() => onTileClick?.(tile)}
                isSelected={selectedTile?.id === tile.id}
              />
            ))}
          </group>

          {/* Diğer Oyuncular - Üst, Sol, Sağ */}
          <group position={[0, 3, -4]}>
            {otherPlayers.player2.slice(0, 7).map((tile, index) => (
              <ThreeDTile
                key={tile.id}
                tile={tile}
                position={[
                  (index - 3) * 0.8,
                  0,
                  0
                ]}
              />
            ))}
          </group>

          <group position={[-4, 0, 0]}>
            {otherPlayers.player3.slice(0, 7).map((tile, index) => (
              <ThreeDTile
                key={tile.id}
                tile={tile}
                position={[
                  0,
                  (index - 3) * 0.8,
                  0
                ]}
              />
            ))}
          </group>

          <group position={[4, 0, 0]}>
            {otherPlayers.player4.slice(0, 7).map((tile, index) => (
              <ThreeDTile
                key={tile.id}
                tile={tile}
                position={[
                  0,
                  (index - 3) * 0.8,
                  0
                ]}
              />
            ))}
          </group>

          {/* Kamera Kontrolleri */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeDGameBoard;
