import { useState, useEffect } from 'react';

export default function WeatherMonitor() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch data from Firebase
        const response = await fetch('https://waterdtection-default-rtdb.firebaseio.com/.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from Firebase');
        }
        
        const data = await response.json();
        setWeatherData(data.Single_Axis);
        setLoading(false);
        setCurrentTime(new Date());
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    
    // Set up a timer to refresh data every 60 seconds
    const timer = setInterval(fetchData, 1000);
    
    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    // return <div className="weather-container loading">Loading weather data...</div>;
  }

  if (error) {
    return <div className="weather-container error">Error: {error}</div>;
  }

  if (!weatherData) {
    return <div className="weather-container error">No weather data available</div>;
  }

  // Format time for display
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Format date for display
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="weather-container">
      <h1>Single-Axis Solar Monitor</h1>
      
      <div className="date-display">
        {formattedDate} • {formattedTime}
      </div>
      
      <div className="weather-cards">
        <div className="weather-card">
          <div className="card-icon humidity-icon">💧</div>
          <div className="card-data">{weatherData.Humidity}%</div>
          <div className="card-label">Humidity</div>
        </div>
        
        <div className="weather-card">
          <div className="card-icon temp-icon">🌡️</div>
          <div className="card-data">{weatherData.Temperature}°C</div>
          <div className="card-label">Temperature</div>
        </div>
        
        <div className="weather-card">
          <div className="card-icon rain-icon">{weatherData.RainDetected === 1 ? '🌧️' : '☀️'}</div>
          <div className="card-data">{weatherData.RainDetected === 1 ? 'Yes' : 'No'}</div>
          <div className="card-label">Rain Detected</div>
        </div>
      </div>
      
      {weatherData.RainDetected === 1 && (
        <div className="rain-alert">
          <span className="alert-icon">⚠️</span> 
          <div className="alert-content">
            <div className="alert-title">Rain Detected!</div>
            <div className="alert-info">Current intensity: {weatherData.RainIntensity}</div>
          </div>
        </div>
      )}
      
      <div className="status-bar">
        <div className="sensor-status">
          <span className={weatherData.SensorStatus === "OK" ? "status-ok" : "status-error"}>
            {weatherData.SensorStatus === "OK" ? "System Online" : "System Error"}
          </span>
        </div>
        <div className="last-update">
          Last Updated: {new Date(parseInt(weatherData.LastUpdate)).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true})}
        </div>
      </div>
    </div>
  );
}

// Add CSS to the document
const style = document.createElement('style');
style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.weather-container {
  font-family: 'Poppins', sans-serif;
  max-width: 900px;
  margin: 30px auto;
  padding: 30px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 
              0 1px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.weather-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

h1 {
  text-align: center;
  color: #1a365d;
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 10px;
}

.date-display {
  text-align: center;
  margin: 20px 0 30px;
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.weather-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.weather-card {
  flex: 1;
  min-width: 200px;
  padding: 25px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.weather-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  z-index: -1;
  transition: all 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.weather-card:hover::before {
  opacity: 0;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  display: inline-block;
  padding: 15px;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  background: white;
  transition: all 0.3s ease;
}

.weather-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.humidity-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.temp-icon {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
}

.rain-icon {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  color: white;
}

.card-data {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 10px 0 5px;
  color: #1a365d;
  letter-spacing: -0.5px;
}

.card-label {
  color: #718096;
  font-size: 0.95rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rain-alert {
  background: linear-gradient(135deg, #ff4d4d 0%, #f9cb28 100%);
  color: white;
  padding: 20px;
  margin: 30px 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  animation: pulse 2s infinite;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(231, 76, 60, 0.2);
  backdrop-filter: blur(5px);
  letter-spacing: 0.5px;
}

.alert-icon {
  font-size: 2rem;
  margin-right: 15px;
  animation: shake 1.5s infinite;
  display: inline-block;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.alert-info {
  font-size: 0.9rem;
  opacity: 0.9;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
  20%, 40%, 60%, 80% { transform: rotate(5deg); }
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  color: #718096;
  font-size: 0.9rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.sensor-status {
  display: flex;
  align-items: center;
}

.sensor-status::before {
  content: '•';
  font-size: 30px;
  margin-right: 8px;
}

.status-ok {
  color: #38b2ac;
  font-weight: 600;
}

.status-error {
  color: #f56565;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 80px;
  color: #718096;
  font-size: 1.2rem;
  position: relative;
}

.loading::after {
  content: '';
  width: 30px;
  height: 30px;
  border: 4px solid rgba(79, 172, 254, 0.3);
  border-radius: 50%;
  border-top-color: #4facfe;
  animation: spin 1s ease-in-out infinite;
  position: absolute;
  left: 50%;
  top: 120px;
  transform: translateX(-50%);
}

@keyframes spin {
  to { transform: translateX(-50%) rotate(360deg); }
}

.error {
  text-align: center;
  padding: 50px;
  color: #f56565;
  font-weight: 500;
  background: rgba(245, 101, 101, 0.1);
  border-radius: 12px;
  margin: 30px 0;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 77, 77, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
  }
}

@media (max-width: 768px) {
  .weather-cards {
    flex-direction: column;
  }
  
  .weather-card {
    margin-bottom: 20px;
  }
  
  .status-bar {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
`;
document.head.appendChild(style);