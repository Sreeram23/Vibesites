// Visualizations.jsx - Component for data visualizations

const Visualizations = ({ excelData }) => {
  if (!excelData || !excelData.sheets || excelData.sheets.length === 0) {
    return null;
  }
  
  const firstSheet = excelData.sheets[0];
  const numericColumns = firstSheet.columns.filter(col => col.dataType === "NUMERIC");
  const categoricalColumns = firstSheet.columns.filter(col => col.dataType === "TEXT");
  
  // References for chart canvases
  const barChartRef = React.useRef(null);
  const pieChartRef = React.useRef(null);
  const lineChartRef = React.useRef(null);
  const scatterChartRef = React.useRef(null);
  
  // Chart instances
  const [barChart, setBarChart] = React.useState(null);
  const [pieChart, setPieChart] = React.useState(null);
  const [lineChart, setLineChart] = React.useState(null);
  const [scatterChart, setScatterChart] = React.useState(null);
  
  // Selected columns for charts
  const [barColumn, setBarColumn] = React.useState(numericColumns[0]?.index);
  const [pieColumn, setPieColumn] = React.useState(categoricalColumns[0]?.index);
  const [lineXColumn, setLineXColumn] = React.useState(numericColumns[0]?.index);
  const [lineYColumn, setLineYColumn] = React.useState(numericColumns[1]?.index);
  const [scatterXColumn, setScatterXColumn] = React.useState(numericColumns[0]?.index);
  const [scatterYColumn, setScatterYColumn] = React.useState(numericColumns[1]?.index);
  
  // Create and update charts when data or selections change
  React.useEffect(() => {
    createBarChart();
    createPieChart();
    createLineChart();
    createScatterChart();
    
    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (barChart) barChart.destroy();
      if (pieChart) pieChart.destroy();
      if (lineChart) lineChart.destroy();
      if (scatterChart) scatterChart.destroy();
    };
  }, [excelData, barColumn, pieColumn, lineXColumn, lineYColumn, scatterXColumn, scatterYColumn]);
  
  // Create bar chart
  const createBarChart = () => {
    if (!barChartRef.current || barColumn === undefined || numericColumns.length === 0) return;
    
    const column = firstSheet.columns.find(col => col.index === barColumn);
    if (!column) return;
    
    // Prepare data for bar chart
    const labels = [];
    const data = [];
    
    // Group data into bins for histogram
    const values = firstSheet.rows.map(row => row[column.index]).filter(val => val !== null && val !== undefined && val !== "");
    const numValues = values.map(val => Number(val));
    
    // Create 10 bins
    const min = Math.min(...numValues);
    const max = Math.max(...numValues);
    const binWidth = (max - min) / 10;
    
    for (let i = 0; i < 10; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
      
      // Count values in this bin
      const count = numValues.filter(val => val >= binStart && val < binEnd).length;
      data.push(count);
    }
    
    // Destroy previous chart if it exists
    if (barChart) barChart.destroy();
    
    // Create new chart
    const newChart = new Chart(barChartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: column.name,
          data,
          backgroundColor: 'rgba(66, 133, 244, 0.7)',
          borderColor: 'rgba(66, 133, 244, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Distribution of ${column.name}`
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency'
            }
          },
          x: {
            title: {
              display: true,
              text: column.name
            }
          }
        }
      }
    });
    
    setBarChart(newChart);
  };
  
  // Create pie chart
  const createPieChart = () => {
    if (!pieChartRef.current || pieColumn === undefined || categoricalColumns.length === 0) return;
    
    const column = firstSheet.columns.find(col => col.index === pieColumn);
    if (!column || !column.statistics.frequencies) return;
    
    // Get top 5 categories by frequency
    const topCategories = Object.entries(column.statistics.frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Prepare data for pie chart
    const labels = topCategories.map(([category]) => category);
    const data = topCategories.map(([, count]) => count);
    
    // Destroy previous chart if it exists
    if (pieChart) pieChart.destroy();
    
    // Create new chart
    const newChart = new Chart(pieChartRef.current, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            'rgba(66, 133, 244, 0.7)',
            'rgba(234, 67, 53, 0.7)',
            'rgba(251, 188, 5, 0.7)',
            'rgba(52, 168, 83, 0.7)',
            'rgba(143, 155, 255, 0.7)'
          ],
          borderColor: [
            'rgba(66, 133, 244, 1)',
            'rgba(234, 67, 53, 1)',
            'rgba(251, 188, 5, 1)',
            'rgba(52, 168, 83, 1)',
            'rgba(143, 155, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Distribution of ${column.name}`
          },
          legend: {
            position: 'right'
          }
        }
      }
    });
    
    setPieChart(newChart);
  };
  
  // Create line chart
  const createLineChart = () => {
    if (!lineChartRef.current || lineXColumn === undefined || lineYColumn === undefined || numericColumns.length < 2) return;
    
    const xColumn = firstSheet.columns.find(col => col.index === lineXColumn);
    const yColumn = firstSheet.columns.find(col => col.index === lineYColumn);
    if (!xColumn || !yColumn) return;
    
    // Prepare data for line chart
    const dataPoints = [];
    
    firstSheet.rows.forEach(row => {
      const x = row[xColumn.index];
      const y = row[yColumn.index];
      
      if (x !== null && x !== undefined && x !== "" && y !== null && y !== undefined && y !== "") {
        dataPoints.push({ x: Number(x), y: Number(y) });
      }
    });
    
    // Sort by x value
    dataPoints.sort((a, b) => a.x - b.x);
    
    // Destroy previous chart if it exists
    if (lineChart) lineChart.destroy();
    
   
    const newChart = new Chart(lineChartRef.current, {
      type: 'line',
      data: {
        datasets: [{
          label: `${yColumn.name} vs ${xColumn.name}`,
          data: dataPoints,
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          borderColor: 'rgba(66, 133, 244, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(66, 133, 244, 1)',
          pointRadius: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${yColumn.name} vs ${xColumn.name}`
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: xColumn.name
            }
          },
          y: {
            title: {
              display: true,
              text: yColumn.name
            }
          }
        }
      }
    });
    
    setLineChart(newChart);
  };
  
  // Create scatter chart
  const createScatterChart = () => {
    if (!scatterChartRef.current || scatterXColumn === undefined || scatterYColumn === undefined || numericColumns.length < 2) return;
    
    const xColumn = firstSheet.columns.find(col => col.index === scatterXColumn);
    const yColumn = firstSheet.columns.find(col => col.index === scatterYColumn);
    if (!xColumn || !yColumn) return;
    
    // Prepare data for scatter chart
    const dataPoints = [];
    
    firstSheet.rows.forEach(row => {
      const x = row[xColumn.index];
      const y = row[yColumn.index];
      
      if (x !== null && x !== undefined && x !== "" && y !== null && y !== undefined && y !== "") {
        dataPoints.push({ x: Number(x), y: Number(y) });
      }
    });
    
    // Destroy previous chart if it exists
    if (scatterChart) scatterChart.destroy();
    
    // Create new chart
    const newChart = new Chart(scatterChartRef.current, {
      type: 'scatter',
      data: {
        datasets: [{
          label: `${yColumn.name} vs ${xColumn.name}`,
          data: dataPoints,
          backgroundColor: 'rgba(234, 67, 53, 0.7)',
          borderColor: 'rgba(234, 67, 53, 1)',
          borderWidth: 1,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${yColumn.name} vs ${xColumn.name}`
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xColumn.name
            }
          },
          y: {
            title: {
              display: true,
              text: yColumn.name
            }
          }
        }
      }
    });
    
    setScatterChart(newChart);
  };
  
  return (
    <div className="glass rounded-xl p-6 shadow-lg transition-all duration-300 mb-8">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Data Visualizations
      </h2>
      
      {/* Bar Chart */}
      {numericColumns.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-lg font-semibold">Distribution (Histogram)</h3>
            <div className="mt-2 md:mt-0">
              <label htmlFor="bar-column" className="mr-2 text-sm">Column:</label>
              <select
                id="bar-column"
                className="p-1 border border-gray-300 rounded"
                value={barColumn}
                onChange={(e) => setBarColumn(parseInt(e.target.value))}
              >
                {numericColumns.map(col => (
                  <option key={col.index} value={col.index}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="chart-container">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>
      )}
      
      {/* Pie Chart */}
      {categoricalColumns.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-lg font-semibold">Category Distribution</h3>
            <div className="mt-2 md:mt-0">
              <label htmlFor="pie-column" className="mr-2 text-sm">Column:</label>
              <select
                id="pie-column"
                className="p-1 border border-gray-300 rounded"
                value={pieColumn}
                onChange={(e) => setPieColumn(parseInt(e.target.value))}
              >
                {categoricalColumns.map(col => (
                  <option key={col.index} value={col.index}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="chart-container">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </div>
      )}
      
      {/* Line Chart */}
      {numericColumns.length >= 2 && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-lg font-semibold">Trend Analysis</h3>
            <div className="mt-2 md:mt-0 space-x-4">
              <label htmlFor="line-x-column" className="mr-2 text-sm">X-Axis:</label>
              <select
                id="line-x-column"
                className="p-1 border border-gray-300 rounded"
                value={lineXColumn}
                onChange={(e) => setLineXColumn(parseInt(e.target.value))}
              >
                {numericColumns.map(col => (
                  <option key={col.index} value={col.index}>{col.name}</option>
                ))}
              </select>
              
              <label htmlFor="line-y-column" className="mr-2 text-sm ml-4">Y-Axis:</label>
              <select
                id="line-y-column"
                className="p-1 border border-gray-300 rounded"
                value={lineYColumn}
                onChange={(e) => setLineYColumn(parseInt(e.target.value))}
              >
                {numericColumns.map(col => (
                  <option key={col.index} value={col.index}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="chart-container">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>
        </div>
      )}
      
      {/* Scatter Chart */}
      {numericColumns.length >= 2 && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-lg font-semibold">Correlation Analysis</h3>
            <div className="mt-2 md:mt-0 space-x-4">
              <label htmlFor="scatter-x-column" className="mr-2 text-sm">X-Axis:</label>
              <select
                id="scatter-x-column"
                className="p-1 border border-gray-300 rounded"
                value={scatterXColumn}
                onChange={(e) => setScatterXColumn(parseInt(e.target.value))}
              >
                {numericColumns.map(col => (
                  <option key={col.index} value={col.index}>{col.name}</option>
                ))}
              </select>
              
              <label htmlFor="scatter-y-column" className="mr-2 text-sm ml-4">Y-Axis:</label>
              <select
                id="scatter-y-column"
                className="p-1 border border-gray-300 rounded"
                value={scatterYColumn}
                onChange={(e) => setScatterYColumn(parseInt(e.target.value))}
              >
                {numericColumns.map(col => (
                  <option key={col.index} value={col.index}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="glass p-4 rounded-xl">
            <div className="chart-container">
              <canvas ref={scatterChartRef}></canvas>
            </div>
          </div>
        </div>
      )}
      
      {numericColumns.length === 0 && categoricalColumns.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-chart-bar text-4xl mb-4"></i>
          <p>No suitable columns found for visualization.</p>
          <p className="text-sm mt-2">Visualizations require numeric or categorical data.</p>
        </div>
      )}
    </div>
  );
};
