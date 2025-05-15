// components/WeatherIcon.jsx

// This component now uses the Weather Icons library for more colorful and consistent icons
const WeatherIcon = ({ condition, size = "normal", className = "" }) => {
  // Get the appropriate Weather Icons class based on condition
  const getWeatherIconClass = () => {
    switch(condition.toLowerCase()) {
      case 'sunny':
        return 'wi-day-sunny';
      case 'partly-cloudy':
        return 'wi-day-cloudy';
      case 'cloudy':
        return 'wi-cloudy';
      case 'rainy':
        return 'wi-rain';
      case 'foggy':
        return 'wi-fog';
      case 'drizzle':
        return 'wi-sprinkle';
      default:
        return 'wi-day-sunny';
    }
  };
  
  const sizeClass = size === "large" ? "weather-icon large" : "weather-icon";
  
  return (
    <i className={`wi ${getWeatherIconClass()} ${sizeClass} ${className}`}></i>
  );
};