// components/WeatherTrends.jsx

const WeatherTrends = ({ weatherData }) => {
    // Calculate avg temperature for the week
    const avgTemperature = weatherData.reduce((sum, day) => sum + day.weather.temperature, 0) / weatherData.length;
    
    // Find the hottest and coldest days
    const hottestDay = [...weatherData].sort((a, b) => b.weather.temperature - a.weather.temperature)[0];
    const coldestDay = [...weatherData].sort((a, b) => a.weather.temperature - b.weather.temperature)[0];
    
    // Find rainy days count
    const rainyDays = weatherData.filter(day => day.weather.rain > 30).length;
    
    // Calculate temperature range for the week
    const tempRange = {
      min: Math.min(...weatherData.map(day => day.weather.temperature)),
      max: Math.max(...weatherData.map(day => day.weather.temperature))
    };
    
    // Generate outfit recommendation overview
    const needUmbrella = weatherData.some(day => day.weather.rain > 50);
    const highUvDays = weatherData.filter(day => day.weather.uvIndex > 7).length;
    
    return (
      <div className="section-spacing">
        <h3 className="text-xl font-bold mb-4 text-contrast flex items-center">
          <i className="wi wi-barometer text-blue-500 mr-2"></i>
          Weekly Weather Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Temperature Overview */}
          <div className="glass p-5 rounded-xl animate-slide-up reveal-animation shadow-sm" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-lg font-semibold mb-3 text-contrast flex items-center">
              <i className="wi wi-thermometer text-red-500 mr-2"></i>
              Temperature
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-label">Weekly Average</span>
                <span className="text-value">{avgTemperature.toFixed(1)}°C</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-label">Temperature Range</span>
                <span className="text-value">{tempRange.min}°C - {tempRange.max}°C</span>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full mt-2 mb-1">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
                  style={{ width: '100%' }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-label">
                <span>Cold</span>
                <span>Mild</span>
                <span>Hot</span>
              </div>
              
              <div className="p-3 glass rounded-lg mt-2">
                <div className="flex items-start">
                  <i className="wi wi-thermometer-exterior text-red-500 mt-1 mr-2"></i>
                  <div>
                    <p className="text-sm text-contrast">
                      <span className="font-semibold">{hottestDay.day}</span> will be the hottest day at {hottestDay.weather.temperature}°C, while 
                      <span className="font-semibold"> {coldestDay.day}</span> will be the coolest at {coldestDay.weather.temperature}°C.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Precipitation Overview */}
          <div className="glass p-5 rounded-xl animate-slide-up reveal-animation shadow-sm" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-semibold mb-3 text-contrast flex items-center">
              <i className="wi wi-raindrops text-blue-500 mr-2"></i>
              Precipitation
            </h4>
            
            <div className="flex justify-center items-center mb-3">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl font-bold text-blue-600">{rainyDays}</div>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray={`${(rainyDays / 7) * 100}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-label">Rainy days this week</p>
            </div>
            
            <div className="p-3 glass rounded-lg">
              <div className="flex items-start">
                <i className="wi wi-umbrella text-blue-500 mt-1 mr-2"></i>
                <div>
                  <p className="text-sm text-contrast">
                    {needUmbrella 
                      ? "Don't forget your umbrella this week! There will be days with significant rainfall."
                      : "You likely won't need an umbrella this week, as no heavy rain is forecasted."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Outfit Planning Overview */}
          <div className="glass p-5 rounded-xl animate-slide-up reveal-animation shadow-sm" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-semibold mb-3 text-contrast flex items-center">
              <i className="wi wi-day-light-wind text-purple-500 mr-2"></i>
              Weekly Outfit Tips
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 glass rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <i className="wi wi-hot text-yellow-500"></i>
                </div>
                <div>
                  <p className="text-sm text-contrast">
                    {highUvDays > 0 
                      ? `${highUvDays} ${highUvDays === 1 ? 'day' : 'days'} with high UV index. Bring sunscreen!` 
                      : "UV levels will be moderate this week."}
                  </p>
                </div>
              </div>
              
              <div className="p-3 glass rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <i className="wi wi-cloudy text-blue-500"></i>
                </div>
                <div>
                  <p className="text-sm text-contrast">
                    {tempRange.max - tempRange.min > 8 
                      ? "Temperatures vary widely. Consider layering this week!" 
                      : "Temperatures are fairly consistent this week."}
                  </p>
                </div>
              </div>
              
              <div className="p-3 glass rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <i className="wi wi-strong-wind text-purple-500"></i>
                </div>
                <div>
                  <p className="text-sm text-contrast">
                    {weatherData.some(day => day.weather.wind > 25) 
                      ? "Some windy days ahead. Secure loose clothing items." 
                      : "Gentle breezes expected throughout the week."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };