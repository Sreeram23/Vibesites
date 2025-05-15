// utils/outfitRecommender.js

// Export this function so other components can use it
const getOutfitRecommendation = (weather) => {
  const { temperature, rain, wind, humidity, uvIndex, condition } = weather;
  
  let outfit = {
    top: '',
    bottom: '',
    footwear: '',
    accessories: [],
    suitability: 0
  };
  
  // Determine top based on temperature
  if (temperature < 10) {
    outfit.top = 'Heavy winter coat over sweater';
  } else if (temperature < 15) {
    outfit.top = 'Light jacket over long-sleeve shirt';
  } else if (temperature < 20) {
    outfit.top = 'Lightweight sweater or long-sleeve shirt';
  } else if (temperature < 25) {
    outfit.top = 'T-shirt or short-sleeve shirt';
  } else {
    outfit.top = 'Lightweight t-shirt or tank top';
  }
  
  // Determine bottom based on temperature
  if (temperature < 10) {
    outfit.bottom = 'Warm pants or jeans';
  } else if (temperature < 18) {
    outfit.bottom = 'Jeans or casual pants';
  } else if (temperature < 25) {
    outfit.bottom = 'Lightweight pants or capris';
  } else {
    outfit.bottom = 'Shorts or skirt';
  }
  
  // Determine footwear based on temperature and rain
  if (rain > 50) {
    outfit.footwear = 'Waterproof boots';
  } else if (rain > 0) {
    outfit.footwear = 'Water-resistant shoes';
  } else if (temperature < 10) {
    outfit.footwear = 'Winter boots';
  } else if (temperature < 20) {
    outfit.footwear = 'Closed shoes or sneakers';
  } else {
    outfit.footwear = 'Sandals or lightweight shoes';
  }
  
  // Add accessories based on weather conditions
  if (rain > 0) {
    outfit.accessories.push('Umbrella');
  }
  
  if (wind > 20) {
    outfit.accessories.push('Windbreaker');
  }
  
  if (uvIndex > 5 && (condition === 'sunny' || condition === 'partly-cloudy')) {
    outfit.accessories.push('Sunglasses');
    outfit.accessories.push('Sunscreen');
    outfit.accessories.push('Hat');
  }
  
  if (temperature < 5) {
    outfit.accessories.push('Scarf');
    outfit.accessories.push('Gloves');
    outfit.accessories.push('Beanie');
  }
  
  // Calculate outfit suitability
  let suitabilityScore = 100;
  
  // Deduct points for potential mismatches
  if (rain > 50 && !outfit.accessories.includes('Umbrella')) {
    suitabilityScore -= 30;
  }
  
  if (temperature > 25 && outfit.top.includes('jacket')) {
    suitabilityScore -= 20;
  }
  
  if (temperature < 10 && outfit.bottom.includes('shorts')) {
    suitabilityScore -= 40;
  }
  
  if (uvIndex > 7 && !outfit.accessories.includes('Sunscreen')) {
    suitabilityScore -= 15;
  }
  
  // Ensure suitability stays within 0-100
  outfit.suitability = Math.max(0, Math.min(100, suitabilityScore));
  
  return outfit;
};