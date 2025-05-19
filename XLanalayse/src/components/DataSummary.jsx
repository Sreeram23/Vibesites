

const DataSummary = ({ excelData }) => {
  if (!excelData || !excelData.sheets || excelData.sheets.length === 0) {
    return null;
  }
  
  const firstSheet = excelData.sheets[0];
  
  // Count data types
  const numericCount = firstSheet.columns.filter(col => col.dataType === "NUMERIC").length;
  const textCount = firstSheet.columns.filter(col => col.dataType === "TEXT").length;
  const dateCount = firstSheet.columns.filter(col => col.dataType === "DATE").length;
  
  // Calculate missing values
  let totalCells = 0;
  let missingCells = 0;
  
  firstSheet.rows.forEach(row => {
    row.forEach(cell => {
      totalCells++;
      if (cell === null || cell === undefined || cell === "") {
        missingCells++;
      }
    });
  });
  
  const missingPercentage = totalCells > 0 ? ((missingCells / totalCells) * 100).toFixed(1) : "0.0";
  
  return (
    <div className="glass rounded-xl p-6 shadow-lg transition-all duration-300 mb-8">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Data Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-file-alt text-blue-500 mr-2"></i>
            File Information
          </h3>
          <div className="space-y-2">
            <p><span className="font-medium">File Name:</span> {excelData.fileName}</p>
            <p><span className="font-medium">Number of Sheets:</span> {excelData.sheets.length}</p>
            <p><span className="font-medium">Total Rows:</span> {firstSheet.rows.length}</p>
            <p><span className="font-medium">Total Columns:</span> {firstSheet.columns.length}</p>
          </div>
        </div>
        
        <div className="glass rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-table text-purple-500 mr-2"></i>
            Data Overview
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Data Types:</span> Numeric ({numericCount}), 
              Text ({textCount}), Date ({dateCount})
            </p>
            <p>
              <span className="font-medium">Missing Values:</span> {missingCells} ({missingPercentage}%)
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 glass rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
          Key Insights
        </h3>
        <ul className="space-y-2 list-disc list-inside">
          {excelData.insights.map((insight, index) => (
            <li key={index} className="text-gray-700">{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
