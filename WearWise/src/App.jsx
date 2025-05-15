// App.jsx

// New component for the improved day selector
const DaySelector = ({ weatherData, selectedDay, setSelectedDay }) => {
  return (
    <div className="day-selector glass">
      {weatherData.map((dayData, index) => {
        const isActive = selectedDay === index;
        // Get the right weather icon for each day
        const getIconClass = () => {
          switch(dayData.weather.condition.toLowerCase()) {
            case 'sunny': return 'wi-day-sunny';
            case 'partly-cloudy': return 'wi-day-cloudy';
            case 'cloudy': return 'wi-cloudy';
            case 'rainy': return 'wi-rain';
            case 'foggy': return 'wi-fog';
            default: return 'wi-day-sunny';
          }
        };
        
        return (
          <div 
            key={index}
            className={`day-pill ${isActive ? 'active' : ''}`}
            onClick={() => setSelectedDay(index)}
          >
            <div className="flex flex-col items-center justify-center">
              <i className={`wi ${getIconClass()} ${isActive ? 'text-white' : ''}`}></i>
              <span className="font-medium mt-1">{dayData.day}</span>
              {index === 0 && (
                <span className="text-xs bg-white text-blue-600 px-2 py-0.5 rounded-full mt-1">
                  Today
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Weather alerts component that matches the day's weather condition
const WeatherAlert = ({ weather }) => {
  // Generate alert based on weather condition
  const getAlert = () => {
    if (weather.rain > 30) {
      return {
        icon: 'wi-rain',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-400',
        textColor: 'text-blue-800',
        message: 'Rain expected - don\'t forget your umbrella!'
      };
    } else if (weather.uvIndex > 7) {
      return {
        icon: 'wi-day-sunny',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-400',
        textColor: 'text-orange-800',
        message: 'High UV index - apply sunscreen regularly!'
      };
    } else if (weather.wind > 25) {
      return {
        icon: 'wi-strong-wind',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-400',
        textColor: 'text-cyan-800',
        message: 'Strong winds expected - secure loose items!'
      };
    } else {
      return {
        icon: 'wi-day-sunny',
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-400',
        textColor: 'text-green-800',
        message: 'Weather conditions are favorable today!'
      };
    }
  };
  
  const alert = getAlert();
  
  return (
    <div className="glass rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="wi wi-cloud-down text-yellow-500 mr-2"></i>
        Weather Alert
      </h3>
      <div className={`p-4 ${alert.bgColor} border-l-4 ${alert.borderColor} ${alert.textColor} rounded-lg transition-all hover:scale-[1.02]`}>
        <div className="flex">
          <div className="flex-shrink-0 animate-pulse-slow">
            <i className={`wi ${alert.icon} ${alert.color}`}></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading state component with proper glassmorphism
const LoadingSpinner = () => (
  <div className="glass p-10 rounded-xl flex flex-col items-center justify-center shadow-lg animate-fade-in">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-200 border-opacity-50 rounded-full"></div>
      <div className="w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full absolute top-0 left-0 animate-spin"></div>
    </div>
    <p className="mt-6 text-gray-600 font-medium animate-pulse text-lg">Loading your outfit recommendations...</p>
  </div>
);

const App = () => {
  const { weatherData, loading, refreshData } = useWeatherData();
  const [selectedDay, setSelectedDay] = React.useState(0);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with glassmorphism */}
        <header className="mb-8 glass rounded-xl p-6 animate-fade-in shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg animate-pulse-slow">
                <i className="wi wi-day-sunny text-2xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  WearWise
                </h1>
                <p className="text-label">Smart outfit recommendations based on weather</p>
              </div>
            </div>
            
            <button 
              onClick={refreshData} 
              disabled={loading}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <i className={`wi wi-refresh ${loading ? 'animate-spin' : ''}`}></i>
              <span>Refresh Weather</span>
            </button>
          </div>
        </header>
        
        {/* Loading State */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Day Selector - Improved with proper spacing and alignment */}
            <DaySelector 
              weatherData={weatherData} 
              selectedDay={selectedDay} 
              setSelectedDay={setSelectedDay}
            />
            
            {/* Weather Detail for Selected Day */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <WeatherCard 
                dayData={weatherData[selectedDay]} 
                index={selectedDay} 
              />
            </div>
            
            {/* Weather Alert (always shown) */}
            <div className="mt-6 section-spacing animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <WeatherAlert weather={weatherData[selectedDay].weather} />
            </div>
            
            {/* Weekly Weather Trends */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <WeatherTrends weatherData={weatherData} />
            </div>
          </>
        )}
        
        {/* Footer with glassmorphism */}
        <footer className="mt-8 glass rounded-xl p-4 text-center text-gray-600 text-sm animate-fade-in">
          <p className="flex items-center justify-center">
            <i className="wi wi-cloudy text-blue-500 mr-2"></i>
            WearWise &copy; {new Date().getFullYear()} - Smart outfit recommendations
          </p>
        </footer>
      </div>
    </div>
  );
};