import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import type { Tile } from '../types';

interface TileProps {
  tile: Tile;
  isSelected?: boolean;
  onPress?: (tile: Tile) => void;
  style?: any;
  disabled?: boolean;
  animated?: boolean;
}

const colorStyles = {
  red: { backgroundColor: '#ef4444', borderColor: '#dc2626' },
  black: { backgroundColor: '#374151', borderColor: '#111827' },
  yellow: { backgroundColor: '#fbbf24', borderColor: '#f59e0b', textColor: '#000' },
  blue: { backgroundColor: '#3b82f6', borderColor: '#2563eb' }
};

const colorSymbols = {
  red: '♦',
  black: '♠',
  yellow: '◊',
  blue: '♣'
};

export const TileComponent: React.FC<TileProps> = ({
  tile,
  isSelected = false,
  onPress,
  style,
  disabled = false,
  animated = true
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated && isSelected) {
      // Seçili taş için 3D efekt animasyonu
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0.05, // Hafif eğim efekti
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Normal duruma dön
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isSelected, animated, scaleAnim, rotateAnim, shadowAnim]);

  const handlePress = () => {
    if (onPress && !disabled) {
      // Basılma efekti
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onPress(tile);
      });
    }
  };

  const displayValue = tile.isJoker ? '★' : tile.isOkey ? 'OKEY' : tile.value.toString();
  const tileStyle = colorStyles[tile.color];
  const textColor = tile.color === 'yellow' ? '#000' : '#fff';

  const animatedStyle = animated ? {
    transform: [
      { scale: scaleAnim },
      { rotateY: rotateAnim.interpolate({
        inputRange: [0, 0.05],
        outputRange: ['0deg', '15deg']
      }) }
    ],
    elevation: shadowAnim,
    shadowOpacity: shadowAnim.interpolate({
      inputRange: [1, 1.5],
      outputRange: [0.2, 0.4]
    }),
  } : {};

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.tile,
          tileStyle,
          isSelected && styles.selected,
          disabled && styles.disabled,
          style
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.9}
      >
        {/* Sol üst köşe - renk sembolü */}
        <View style={styles.cornerSymbol}>
          <Text style={[styles.symbolText, styles.symbolTextOpacity, { color: textColor }]}>
            {colorSymbols[tile.color]}
          </Text>
        </View>

        {/* Merkez - sayı/değer */}
        <View style={styles.centerValue}>
          <Text style={[styles.valueText, { color: textColor }]}>
            {displayValue}
          </Text>
        </View>

        {/* Sağ alt köşe - ters renk sembolü */}
        <View style={styles.cornerSymbolBottom}>
          <Text style={[styles.symbolText, styles.symbolTextOpacity, styles.rotatedSymbol, { color: textColor }]}>
            {colorSymbols[tile.color]}
          </Text>
        </View>

        {/* 3D gölge efekti */}
        {animated && (
          <View style={styles.shadowOverlay} pointerEvents="none" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#fbbf24',
    zIndex: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  cornerSymbol: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
  cornerSymbolBottom: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  symbolText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  symbolTextOpacity: {
    opacity: 0.8,
  },
  rotatedSymbol: {
    transform: [{ rotate: '180deg' }],
  },
  centerValue: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shadowOverlay: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    zIndex: -1,
  },
});
