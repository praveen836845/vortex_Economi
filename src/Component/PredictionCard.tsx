import { useNavigate } from 'react-router-dom';
import './PredictionCard.css'; // Create this CSS file for card-specific styles

interface PredictionCardProps {
  asset: string;
  currentPrice: string;
  priceChange: number;
  timeRemaining: string;
  progress: number;
  volume: string;
}

export default function PredictionCard({
  asset,
  currentPrice,
  priceChange,
  timeRemaining,
  progress,
  volume
}: PredictionCardProps) {
  const navigate = useNavigate();
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/prediction/${encodeURIComponent(asset)}`, {
      state: { // Pass data via state
        asset,
        currentPrice,
        priceChange,
        timeRemaining,
        progress,
        volume,
      },
    });
  };

  return (
    <div className="prediction-card clickable" onClick={handleCardClick}>
      <div className="card-content">
        <div className="market-header">
          <h3>{asset}</h3>
          <div className="market-tag live">LIVE</div>
        </div>
        <div className="price-display">
          <span className="current-price">{currentPrice}</span>
          <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange}%
          </span>
        </div>
        <div className="prediction-actions">
          <button className="up-btn pulse">Up ↑</button>
          <button className="down-btn pulse">Down ↓</button>
        </div>
        <div className="time-remaining">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span>Ends in: {timeRemaining}</span>
        </div>
        <div className="volume-display">
          <span>24h Volume: {volume} FLR</span>
        </div>
      </div>
    </div>
  );
}