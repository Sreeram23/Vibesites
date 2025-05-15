// components/SuitabilityBar.jsx

const SuitabilityBar = ({ value }) => {
  const [width, setWidth] = React.useState(0);

  // Enhanced gradient colors based on value
  const getColor = () => {
    if (value >= 80) return 'from-green-400 to-emerald-500';
    if (value >= 60) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  // Enhanced label based on value
  const getLabel = () => {
    if (value >= 80) return 'Perfect';
    if (value >= 60) return 'Good';
    return 'Adjust';
  };

  // Animation effect with slight delay for visual appeal
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-full mt-4">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium text-label">Outfit Suitability</span>
          <div className={`ml-2 text-xs font-bold px-2 py-1 rounded-full text-white bg-gradient-to-r ${getColor()}`}>
            {getLabel()}
          </div>
        </div>
        <span className="text-sm font-bold text-value">{value}%</span>
      </div>

      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r progress-fill ${getColor()}`}
          style={{
            width: `${width}%`,
            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
    </div>
  );
};