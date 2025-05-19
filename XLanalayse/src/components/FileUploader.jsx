

const FileUploader = ({ onFileLoaded, isLoading }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const fileInputRef = React.useRef(null);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleAnalyzeClick = async () => {
    if (!selectedFile) return;
    
    try {
      onFileLoaded(null, true); // Set loading state
      const excelData = await ExcelParser.parseExcelFile(selectedFile);
      onFileLoaded(excelData, false);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      alert("Error parsing Excel file. Please make sure it's a valid Excel file.");
      onFileLoaded(null, false);
    }
  };
  
  return (
    <div className="glass rounded-xl p-6 shadow-lg transition-all duration-300 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-6 md:mb-0">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
            <i className="fas fa-file-excel text-2xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Excel Analyzer
            </h1>
            <p className="text-gray-600">Upload an Excel file to analyze data and get insights</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx, .xls"
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <i className="fas fa-file-excel text-green-500 text-3xl mr-3"></i>
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-3 hover:bg-gray-300 transition-colors"
            >
              Change File
            </button>
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Analyzing...
                </span>
              ) : (
                "Analyze Data"
              )}
            </button>
          </div>
        ) : (
          <div className="py-8">
            <i className="fas fa-cloud-upload-alt text-gray-400 text-5xl mb-4"></i>
            <p className="mb-4 text-gray-500">Drag and drop an Excel file here, or click to select</p>
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Select Excel File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
