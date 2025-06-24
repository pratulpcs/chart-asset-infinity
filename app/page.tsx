'use client';

import { useState } from 'react';
import { ChartBarIcon, PresentationChartLineIcon, ChartPieIcon } from '@heroicons/react/24/solid';

const chartTabs = [
  { key: 'bar', label: 'Bar Chart', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
  { key: 'line', label: 'Line Chart', icon: <PresentationChartLineIcon className="w-5 h-5 mr-2" /> },
  { key: 'pie', label: 'Pie Chart', icon: <ChartPieIcon className="w-5 h-5 mr-2" /> },
  { key: 'doughnut', label: 'Doughnut Chart', icon: <ChartPieIcon className="w-5 h-5 mr-2 rotate-45" /> },
];

const apiTabs = [
  { key: 'js', label: 'JavaScript', code: `// Using fetch API\nconst response = await fetch('https://your-api/api/chart?...');\nconst chartBlob = await response.blob();\nconst chartUrl = URL.createObjectURL(chartBlob);` },
  { key: 'py', label: 'Python', code: `import requests\nurl = 'https://your-api/api/chart?...'\nimg = requests.get(url).content\nwith open('chart.png', 'wb') as f:\n    f.write(img)` },
  { key: 'curl', label: 'cURL', code: `curl "https://your-api/api/chart?..." --output chart.png` },
  { key: 'html', label: 'HTML', code: `<img src="/api/chart?..." alt="Chart" />` },
  { key: 'md', label: 'Markdown', code: `![Chart](/api/chart?...)` },
];

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
  const [selectedTab, setSelectedTab] = useState('bar');
  const [apiTab, setApiTab] = useState('js');
  const [copied, setCopied] = useState(false);

  const generateChartUrl = () => {
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
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

  const handleTabClick = (key: keyof typeof presetConfigs) => {
    setSelectedTab(key);
    setConfig(presetConfigs[key].config);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Chart</h1>
        
      </header>
      <main className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chart Configuration Card */}
          <section className="bg-white rounded-xl shadow p-6 flex flex-col gap-6">
            <h2 className="text-xl font-semibold mb-2">Chart Configuration</h2>
            {/* Chart Type Tabs */}
            <div className="flex gap-2 mb-2">
              {chartTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key as keyof typeof presetConfigs)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium border transition-all ${selectedTab === tab.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>
            {/* Chart Dimensions */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Width</label>
                <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Height</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
              </div>
            </div>
            {/* Chart Config JSON */}
            <div>
              <label className="block text-sm font-medium mb-2">Chart Configuration (Chart.js JSON)</label>
              <textarea value={config} onChange={e => setConfig(e.target.value)} className="w-full h-48 p-3 border rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            {/* Generated URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Generated API URL</label>
              <div className="flex items-center gap-2">
                <input type="text" value={generateChartUrl()} readOnly className="flex-1 px-3 py-2 border rounded-lg bg-gray-100 text-xs font-mono" />
                <button onClick={() => handleCopy(generateChartUrl())} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs font-semibold">{copied ? 'Copied!' : 'Copy'}</button>
              </div>
            </div>
          </section>
          {/* Chart Preview Card */}
          <section className="bg-white rounded-xl shadow p-6 flex flex-col gap-6">
            <h2 className="text-xl font-semibold mb-2">Chart Preview</h2>
            <div className="rounded-lg bg-gray-50 border flex items-center justify-center min-h-[320px]">
              <img
                src={generateChartUrl()}
                alt="Generated Chart"
                className="max-w-full max-h-80 object-contain"
                onError={e => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIGxvYWRpbmcgY2hhcnQ8L3RleHQ+PC9zdmc+'; }}
              />
            </div>
            {/* API Usage Examples */}
            <div>
              <h3 className="text-lg font-semibold mb-3">API Usage Examples</h3>
              <div className="flex gap-2 mb-2">
                {apiTabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setApiTab(tab.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${apiTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <pre className="bg-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{apiTabs.find(t => t.key === apiTab)?.code}</pre>
                <button onClick={() => handleCopy(apiTabs.find(t => t.key === apiTab)?.code ?? "")} className="absolute top-2 right-2 px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400">{copied ? 'Copied!' : 'Copy'}</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}