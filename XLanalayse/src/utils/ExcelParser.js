// ExcelParser.js - Utility for parsing Excel files

const ExcelParser = {
  
  parseExcelFile: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          
          // Process the workbook
          const result = ExcelParser.processWorkbook(workbook, file.name);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  },
  
  // Process workbook and extract data
  processWorkbook: (workbook, fileName) => {
    const sheets = [];
    const insights = [];
    
    // Process each sheet
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const sheetData = ExcelParser.processSheet(sheet, sheetName);
      sheets.push(sheetData);
      
      // Generate insights for this sheet
      insights.push(...ExcelParser.generateInsights(sheetData));
    });
    
    return {
      fileName,
      sheets,
      insights
    };
  },
  
  // Process a single sheet
  processSheet: (sheet, sheetName) => {
    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Extract header row
    const headerRow = jsonData[0] || [];
    const columnNames = headerRow.map((name, index) => name || `Column ${index + 1}`);
    
    // Extract data rows
    const dataRows = jsonData.slice(1);
    
    // Determine column types and calculate statistics
    const columns = ExcelParser.determineColumnTypes(columnNames, dataRows);
    
    return {
      name: sheetName,
      columns,
      rows: dataRows
    };
  },
  
  // Determine column types and calculate statistics
  determineColumnTypes: (columnNames, dataRows) => {
    const columns = [];
    
    for (let i = 0; i < columnNames.length; i++) {
      const columnName = columnNames[i];
      const columnValues = dataRows.map(row => i < row.length ? row[i] : "");
      
      // Determine data type
      const dataType = ExcelParser.determineDataType(columnValues);
      
      // Calculate statistics based on data type
      const statistics = ExcelParser.calculateStatistics(columnValues, dataType);
      
      columns.push({
        name: columnName,
        index: i,
        dataType,
        statistics
      });
    }
    
    return columns;
  },
  
  // Determine data type of a column
  determineDataType: (values) => {
    // Skip empty values
    const nonEmptyValues = values.filter(val => val !== null && val !== undefined && val !== "");
    if (nonEmptyValues.length === 0) return "UNKNOWN";
    
    // Check if all values are numeric
    const allNumeric = nonEmptyValues.every(val => !isNaN(val) && typeof val !== 'boolean');
    if (allNumeric) return "NUMERIC";
    
    // Check if all values are dates
    const allDates = nonEmptyValues.every(val => {
      if (typeof val === 'object' && val instanceof Date) return true;
      
      // Try to parse as date if it's a string
      if (typeof val === 'string') {
        const date = new Date(val);
        return !isNaN(date.getTime());
      }
      
      return false;
    });
    if (allDates) return "DATE";
    
    // Default to text
    return "TEXT";
  },
  
  // Calculate statistics based on data type
  calculateStatistics: (values, dataType) => {
    switch (dataType) {
      case "NUMERIC":
        return ExcelParser.calculateNumericStatistics(values);
      case "TEXT":
        return ExcelParser.calculateCategoricalStatistics(values);
      case "DATE":
        return ExcelParser.calculateDateStatistics(values);
      default:
        return {};
    }
  },
  
  // Calculate statistics for numeric data
  calculateNumericStatistics: (values) => {
    const numericValues = values
      .filter(val => val !== null && val !== undefined && val !== "")
      .map(val => Number(val))
      .sort((a, b) => a - b);
    
    if (numericValues.length === 0) return {};
    
    const sum = numericValues.reduce((acc, val) => acc + val, 0);
    const mean = sum / numericValues.length;
    const median = numericValues.length % 2 === 0
      ? (numericValues[numericValues.length / 2 - 1] + numericValues[numericValues.length / 2]) / 2
      : numericValues[Math.floor(numericValues.length / 2)];
    const min = numericValues[0];
    const max = numericValues[numericValues.length - 1];
    
    // Calculate standard deviation
    const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericValues.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      mean,
      median,
      min,
      max,
      stdDev
    };
  },
  
  // Calculate statistics for categorical data
  calculateCategoricalStatistics: (values) => {
    const nonEmptyValues = values.filter(val => val !== null && val !== undefined && val !== "");
    if (nonEmptyValues.length === 0) return {};
    
    // Calculate frequencies
    const frequencies = {};
    nonEmptyValues.forEach(val => {
      const strVal = String(val);
      frequencies[strVal] = (frequencies[strVal] || 0) + 1;
    });
    
    // Find most frequent value
    let mostFrequent = null;
    let maxFrequency = 0;
    
    Object.entries(frequencies).forEach(([value, count]) => {
      if (count > maxFrequency) {
        mostFrequent = value;
        maxFrequency = count;
      }
    });
    
    return {
      uniqueValues: Object.keys(frequencies).length,
      mostFrequent,
      frequencies
    };
  },
  
  // Calculate statistics for date data
  calculateDateStatistics: (values) => {
    // Convert all values to Date objects
    const dates = values
      .filter(val => val !== null && val !== undefined && val !== "")
      .map(val => {
        if (val instanceof Date) return val;
        return new Date(val);
      })
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a - b);
    
    if (dates.length === 0) return {};
    
    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    const dateSpan = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24)); // in days
    
    return {
      minDate: minDate.toISOString().split('T')[0],
      maxDate: maxDate.toISOString().split('T')[0],
      dateSpan
    };
  },
  
  // Generate insights from sheet data
  generateInsights: (sheetData) => {
    const insights = [];
    
    // Add basic sheet info
    insights.push(`Sheet '${sheetData.name}' contains ${sheetData.rows.length} rows and ${sheetData.columns.length} columns`);
    
    // Add insights for numeric columns
    sheetData.columns
      .filter(column => column.dataType === "NUMERIC")
      .forEach(column => {
        if (column.statistics.mean !== undefined) {
          insights.push(`Average ${column.name}: ${column.statistics.mean.toFixed(2)}`);
        }
        
        if (column.statistics.min !== undefined && column.statistics.max !== undefined) {
          insights.push(`${column.name} ranges from ${column.statistics.min.toFixed(2)} to ${column.statistics.max.toFixed(2)}`);
        }
      });
    
    // Add insights for categorical columns
    sheetData.columns
      .filter(column => column.dataType === "TEXT")
      .forEach(column => {
        if (column.statistics.mostFrequent) {
          const frequency = column.statistics.frequencies[column.statistics.mostFrequent] || 0;
          const percentage = Math.round((frequency / sheetData.rows.length) * 100);
          insights.push(`Most common ${column.name}: '${column.statistics.mostFrequent}' (${percentage}%)`);
        }
      });
    
    // Add insights for date columns
    sheetData.columns
      .filter(column => column.dataType === "DATE")
      .forEach(column => {
        if (column.statistics.minDate && column.statistics.maxDate) {
          insights.push(`${column.name} spans from ${column.statistics.minDate} to ${column.statistics.maxDate}`);
        }
      });
    
    return insights;
  }
};
