// App.jsx - Main application component

const App = () => {
  const [excelData, setExcelData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleFileLoaded = (data, loading) => {
    setExcelData(data);
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* File Uploader */}
        <FileUploader onFileLoaded={handleFileLoaded} isLoading={isLoading} />
        
        {/* Loading State */}
        {isLoading && (
          <div className="glass p-10 rounded-xl flex flex-col items-center justify-center shadow-lg animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-opacity-50 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full absolute top-0 left-0 animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Analyzing your Excel data...</p>
          </div>
        )}
        
        {/* Data Analysis Results */}
        {!isLoading && excelData && (
          <div className="animate-fade-in">
            {/* Data Summary */}
            <DataSummary excelData={excelData} />
            
            {/* Column Analysis */}
            <ColumnAnalysis excelData={excelData} />
            
            {/* Visualizations */}
            <Visualizations excelData={excelData} />
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-8 glass rounded-xl p-4 text-center text-gray-600 text-sm">
          <p className="flex items-center justify-center">
            <i className="fas fa-table text-blue-500 mr-2"></i>
            Excel Analyzer &copy; {new Date().getFullYear()} - Data insights and visualizations
          </p>
        </footer>
      </div>
    </div>
  );
};
