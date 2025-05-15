// components/WeatherCard.jsx

const WeatherCard = ({ dayData, index }) => {
  const { day, weather } = dayData;
  const outfit = getOutfitRecommendation(weather);

  // Determine which day is today for highlighting
  const isToday = index === 0;

  // Get the appropriate Weather Icons class based on condition
  const getWeatherIconClass = (condition) => {
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
      default:
        return 'wi-day-sunny';
    }
  };

  return (
    <div className="weather-card glass animate-fade-in shadow-lg">
      {/* Card Header with gradient */}
      <div className="weather-card-header">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            {day}
            {isToday && (
              <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
                Today
              </span>
            )}
          </h2>

          <div className="flex items-center">
            <i className={`wi ${getWeatherIconClass(weather.condition)} weather-icon text-white mr-2`}></i>
            <span className="text-lg font-semibold capitalize text-white">
              {weather.condition.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="weather-card-body bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Weather Information */}
          <div className="w-full lg:w-1/3">
            {/* Large temperature display */}
            <div className="mb-6 p-5 glass rounded-xl text-center">
              <i className={`wi ${getWeatherIconClass(weather.condition)} weather-icon large animate-pulse-slow`}></i>
              <div className="text-5xl font-bold text-value mt-2">{weather.temperature}°C</div>
              <div className="text-label capitalize mt-1">{weather.condition.replace('-', ' ')}</div>
            </div>

            {/* Weather details */}
            <WeatherDetails weather={weather} />
          </div>

          {/* Outfit Recommendation */}
          <div className="w-full lg:w-2/3">
            <OutfitRecommendation outfit={outfit} />
          </div>
        </div>
      </div>
    </div>
  );
};