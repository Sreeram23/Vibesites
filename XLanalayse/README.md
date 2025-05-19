# Excel Analyzer Web Application

A simple web application for analyzing Excel files and providing data insights with visualizations.

## Features

- Upload and parse Excel files (.xlsx and .xls)
- Analyze data and generate insights
- View summary statistics for your data
- Analyze individual columns
- Visualize data with charts:
  - Histograms for numeric data
  - Pie charts for categorical data
  - Line charts for trends
  - Scatter plots for correlations

## How to Run

This application is designed to run without npm or any build tools. Simply:

1. Clone or download this repository
2. Open the `public/index.html` file in a web browser

### Running with a Local Server

For the best experience, it's recommended to run the application using a simple HTTP server:

#### Using Python (if installed):

```bash
# Navigate to the ExcelAnalyzerWeb directory
cd ExcelAnalyzerWeb

# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then open your browser and go to `http://localhost:8000/public/`

#### Using Node.js (if installed):

```bash
# Install http-server globally if you haven't already
npm install -g http-server

# Navigate to the ExcelAnalyzerWeb directory
cd ExcelAnalyzerWeb

# Start the server
http-server
```

Then open your browser and go to the URL shown in the terminal (typically `http://localhost:8080/public/`)

## Technologies Used

- React (loaded via CDN)
- SheetJS (xlsx) for Excel parsing
- Chart.js for data visualizations
- Tailwind CSS for styling

## Browser Compatibility

This application works best in modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Troubleshooting

If you encounter issues:

1. Make sure you're using a modern browser
2. Try running the application with a local server instead of opening the HTML file directly
3. Check that your Excel file is properly formatted
4. For large Excel files, be patient as parsing may take some time
