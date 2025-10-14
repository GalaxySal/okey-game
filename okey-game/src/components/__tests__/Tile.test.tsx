import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TileComponent } from '../Tile';
import type { Tile } from '../Tile';

describe('TileComponent', () => {
  const mockTile: Tile = {
    id: 'test_1',
    value: 5, // TileValue tipi zaten 1-13 arası number'ı kapsar
    color: 'red',
    isJoker: false,
    isOkey: false
  };

  it('renders tile correctly', () => {
    render(<TileComponent tile={mockTile} />);

    const tileElement = screen.getByText('5');
    expect(tileElement).toBeInTheDocument();
  });

  it('shows selected state', () => {
    render(<TileComponent tile={mockTile} isSelected={true} />);

    const tileElement = screen.getByText('5').closest('[class*="ring-2"]');
    expect(tileElement).toBeInTheDocument();
  });

  it('handles click events', () => {
    const mockOnClick = vi.fn();
    render(<TileComponent tile={mockTile} onClick={mockOnClick} />);

    const tileElement = screen.getByText('5');
    tileElement.click();

    expect(mockOnClick).toHaveBeenCalledWith(mockTile);
  });

  it('displays joker correctly', () => {
    const jokerTile: Tile = { ...mockTile, isJoker: true };
    render(<TileComponent tile={jokerTile} />);

    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('displays okey correctly', () => {
    const okeyTile: Tile = { ...mockTile, isOkey: true };
    render(<TileComponent tile={okeyTile} />);

    expect(screen.getByText('OKEY')).toBeInTheDocument();
  });
});
