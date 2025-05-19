

const ColumnAnalysis = ({ excelData }) => {
  if (!excelData || !excelData.sheets || excelData.sheets.length === 0) {
    return null;
  }
  
  const [selectedColumn, setSelectedColumn] = React.useState(null);
  const firstSheet = excelData.sheets[0];
  
  React.useEffect(() => {
    // Select first column by default
    if (firstSheet.columns.length > 0 && !selectedColumn) {
      setSelectedColumn(firstSheet.columns[0]);
    }
  }, [firstSheet.columns, selectedColumn]);
  
  const handleColumnChange = (event) => {
    const columnIndex = parseInt(event.target.value);
    const column = firstSheet.columns[columnIndex];
    setSelectedColumn(column);
  };
  
  if (!selectedColumn) {
    return null;
  }
  
  // Render different statistics based on data type
  const renderStatistics = () => {
    switch (selectedColumn.dataType) {
      case "NUMERIC":
        return renderNumericStatistics();
      case "TEXT":
        return renderCategoricalStatistics();
      case "DATE":
        return renderDateStatistics();
      default:
        return <p>No statistics available for this column.</p>;
    }
  };
  
  const renderNumericStatistics = () => {
    const stats = selectedColumn.statistics;
    
    return (
      <div className="glass rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <i className="fas fa-calculator text-blue-500 mr-2"></i>
          Numeric Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Mean:</span> {stats.mean?.toFixed(2) || "N/A"}</p>
            <p><span className="font-medium">Median:</span> {stats.median?.toFixed(2) || "N/A"}</p>
            <p><span className="font-medium">Standard Deviation:</span> {stats.stdDev?.toFixed(2) || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-medium">Minimum:</span> {stats.min?.toFixed(2) || "N/A"}</p>
            <p><span className="font-medium">Maximum:</span> {stats.max?.toFixed(2) || "N/A"}</p>
            <p><span className="font-medium">Range:</span> {(stats.max - stats.min)?.toFixed(2) || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderCategoricalStatistics = () => {
    const stats = selectedColumn.statistics;
    
    // Get top 5 categories by frequency
    const topCategories = stats.frequencies
      ? Object.entries(stats.frequencies)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
      : [];
    
    return (
      <div className="glass rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <i className="fas fa-list text-purple-500 mr-2"></i>
          Categorical Statistics
        </h3>
        <p><span className="font-medium">Unique Values:</span> {stats.uniqueValues || 0}</p>
        <p><span className="font-medium">Most Frequent:</span> {stats.mostFrequent || "N/A"}</p>
        
        {topCategories.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Top Categories:</h4>
            <ul className="space-y-1">
              {topCategories.map(([category, count], index) => (
                <li key={index} className="flex justify-between">
                  <span>{category}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  const renderDateStatistics = () => {
    const stats = selectedColumn.statistics;
    
    return (
      <div className="glass rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <i className="fas fa-calendar-alt text-green-500 mr-2"></i>
          Date Statistics
        </h3>
        <p><span className="font-medium">Earliest Date:</span> {stats.minDate || "N/A"}</p>
        <p><span className="font-medium">Latest Date:</span> {stats.maxDate || "N/A"}</p>
        <p><span className="font-medium">Date Span:</span> {stats.dateSpan || 0} days</p>
      </div>
    );
  };
  
  return (
    <div className="glass rounded-xl p-6 shadow-lg transition-all duration-300 mb-8">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Column Analysis
      </h2>
      
      <div className="mb-6">
        <label htmlFor="column-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Column
        </label>
        <select
          id="column-select"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={handleColumnChange}
          value={firstSheet.columns.findIndex(col => col.name === selectedColumn.name)}
        >
          {firstSheet.columns.map((column, index) => (
            <option key={index} value={index}>
              {column.name} ({column.dataType.toLowerCase()})
            </option>
          ))}
        </select>
      </div>
      
      {renderStatistics()}
    </div>
  );
};
