// hooks/useWeatherData.js

const generateWeatherData = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return days.map((day, index) => {
    // Create somewhat realistic weather patterns
    const baseTemp = 15 + Math.floor(Math.random() * 20); // Base temperature between 15-35°C
    const rain = Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0; // 30% chance of rain
    const wind = Math.floor(Math.random() * 40); // Wind 0-40 km/h
    const humidity = 40 + Math.floor(Math.random() * 60); // Humidity 40-100%
    const uvIndex = Math.floor(Math.random() * 11); // UV index 0-10
    
    // Generate a more realistic condition
    let condition = 'sunny';
    if (rain > 50) {
      condition = 'rainy';
    } else if (rain > 0) {
      condition = 'cloudy';
    } else if (humidity > 80) {
      condition = 'foggy';
    } else if (Math.random() > 0.6) {
      condition = 'partly-cloudy';
    }
    
    return {
      day,
      weather: {
        temperature: baseTemp,
        rain,
        wind,
        humidity,
        uvIndex,
        condition
      }
    };
  });
};

const useWeatherData = () => {
  const [weatherData, setWeatherData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const newData = generateWeatherData();
      setWeatherData(newData);
      setLoading(false);
    }, 600);
  };
  
  React.useEffect(() => {
    refreshData();
  }, []);
  
  return {
    weatherData,
    loading,
    refreshData
  };
};