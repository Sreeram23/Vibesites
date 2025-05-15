// components/WeatherDetail.jsx

const WeatherDetail = ({ icon, label, value, unit, color, bgColor }) => {
  return (
    <div className="glass detail-box animate-fade-in" style={{ animationDuration: '0.5s' }}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${bgColor}`}>
        <i className={`wi ${icon} text-xl ${color}`}></i>
      </div>
      <div>
        <div className="text-xs text-label">{label}</div>
        <div className="text-value text-lg">
          {value}{unit}
        </div>
      </div>
    </div>
  );
};

const WeatherDetails = ({ weather }) => {
  const { temperature, rain, wind, humidity, uvIndex } = weather;
  
  return (
    <div className="detail-container">
      <WeatherDetail 
        icon="wi-thermometer" 
        label="Temperature" 
        value={temperature} 
        unit="°C" 
        color="text-red-500" 
        bgColor="bg-red-100" 
      />
      
      <WeatherDetail 
        icon="wi-raindrops" 
        label="Chance of Rain" 
        value={rain} 
        unit="%" 
        color="text-blue-500" 
        bgColor="bg-blue-100" 
      />
      
      <WeatherDetail 
        icon="wi-strong-wind" 
        label="Wind Speed" 
        value={wind} 
        unit=" km/h" 
        color="text-gray-500" 
        bgColor="bg-gray-100" 
      />
      
      <WeatherDetail 
        icon="wi-humidity" 
        label="Humidity" 
        value={humidity} 
        unit="%" 
        color="text-blue-400" 
        bgColor="bg-blue-100" 
      />
      
      <WeatherDetail 
        icon="wi-day-sunny" 
        label="UV Index" 
        value={uvIndex} 
        unit="/10" 
        color="text-yellow-500" 
        bgColor="bg-yellow-100" 
      />
    </div>
  );
};