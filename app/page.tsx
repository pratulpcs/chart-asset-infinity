'use client';

import { useState } from 'react';

export default function Home() {
  const [config, setConfig] = useState(`{
  "type": "bar",
  "data": {
    "labels": ["January", "February", "March", "April", "May", "June", "July"],
    "datasets": [
      {
        "label": "Dataset 1",
        "backgroundColor": "rgba(255, 99, 132, 0.5)",
        "borderColor": "rgb(255, 99, 132)",
        "borderWidth": 1,
        "data": [-31, -70, -30, -33, -9, 14, -41]
      },
      {
        "label": "Dataset 2",
        "backgroundColor": "rgba(54, 162, 235, 0.5)",
        "borderColor": "rgb(54, 162, 235)",
        "borderWidth": 1,
        "data": [73, 41, 29, 61, -65, 59, 38]
      }
    ]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Bar Chart"
      }
    }
  }
}`);

  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');

  const generateChartUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      c: config,
      w: width,
      h: height,
    });
    return `${baseUrl}/api/chart?${params.toString()}`;
  };

  const presetConfigs = {
    bar: {
      name: "Bar Chart",
      config: `{
  "type": "bar",
  "data": {
    "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    "datasets": [{
      "label": "Votes",
      "data": [12, 19, 3, 5, 2, 3],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      "borderColor": [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      "borderWidth": 1
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Sample Bar Chart"
      }
    }
  }
}`
    },
    line: {
      name: "Line Chart",
      config: `{
  "type": "line",
  "data": {
    "labels": ["January", "February", "March", "April", "May", "June"],
    "datasets": [{
      "label": "Sales",
      "data": [65, 59, 80, 81, 56, 55],
      "fill": false,
      "borderColor": "rgb(75, 192, 192)",
      "tension": 0.1
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Monthly Sales"
      }
    }
  }
}`
    },
    pie: {
      name: "Pie Chart",
      config: `{
  "type": "pie",
  "data": {
    "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    "datasets": [{
      "label": "Dataset",
      "data": [12, 19, 3, 5, 2, 3],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(255, 159, 64, 0.8)"
      ]
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Sample Pie Chart"
      }
    }
  }
}`
    },
    doughnut: {
      name: "Doughnut Chart",
      config: `{
  "type": "doughnut",
  "data": {
    "labels": ["Desktop", "Mobile", "Tablet"],
    "datasets": [{
      "data": [300, 50, 100],
      "backgroundColor": [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
      ],
      "hoverBackgroundColor": [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
      ]
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Traffic Sources"
      }
    }
  }
}`
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Aseet Infinity Chart Service
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Chart Configuration</h2>
          
          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(presetConfigs).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setConfig(preset.config)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Dimensions */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
          </div>

          {/* Configuration textarea */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Chart Configuration (JSON)
            </label>
            <textarea
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="w-full h-64 p-3 border rounded font-mono text-sm"
              placeholder="Enter Chart.js configuration..."
            />
          </div>

          {/* Generated URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Generated API URL</label>
            <div className="p-3 bg-gray-100 rounded text-sm break-all">
              {generateChartUrl()}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generateChartUrl())}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Copy URL
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div className="border rounded p-4 bg-white">
            <img
              src={generateChartUrl()}
              alt="Generated Chart"
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIGxvYWRpbmcgY2hhcnQ8L3RleHQ+PC9zdmc+';
              }}
            />
          </div>

          {/* Usage Examples */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">API Usage Examples</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Basic Usage:</strong>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  GET /api/chart?c={"{"}"type":"bar","data":...{"}"}
                </code>
              </div>
              <div>
                <strong>With Dimensions:</strong>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  GET /api/chart?c={"{"}"type":"line",...{"}"}&w=600&h=400
                </code>
              </div>
              <div>
                <strong>HTML Image Tag:</strong>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  &lt;img src="/api/chart?c=..." alt="Chart" /&gt;
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}