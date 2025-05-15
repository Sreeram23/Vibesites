// components/OutfitRecommendation.jsx

const OutfitItem = ({ label, value }) => (
  <div className="outfit-item flex" style={{ animationDuration: '0.5s' }}>
    <span className="w-28 font-medium text-label">{label}:</span>
    <span className="text-value">{value}</span>
  </div>
);

const AccessoryTag = ({ accessory }) => (
  <span className="inline-block bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-sm mr-2 mb-2 border border-blue-100 transition-all hover:bg-blue-100 hover:scale-105">
    {accessory}
  </span>
);

const OutfitRecommendation = ({ outfit }) => {
  const { top, bottom, footwear, accessories, suitability } = outfit;

  return (
    <div className="glass outfit-section animate-slide-up shadow-sm" style={{ animationDuration: '0.6s' }}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <i className="wi wi-day-sunny text-blue-600"></i>
        </div>
        <h3 className="text-xl font-bold text-contrast">Today's Outfit</h3>
      </div>

      <div className="space-y-2 mb-6">
        <OutfitItem label="Top" value={top} />
        <OutfitItem label="Bottom" value={bottom} />
        <OutfitItem label="Footwear" value={footwear} />

        {accessories.length > 0 && (
          <div className="outfit-item mt-3">
            <span className="w-28 font-medium text-label align-top">Accessories:</span>
            <div className="flex flex-wrap">
              {accessories.map((accessory, index) => (
                <AccessoryTag key={index} accessory={accessory} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SuitabilityBar value={suitability} />
    </div>
  );
};