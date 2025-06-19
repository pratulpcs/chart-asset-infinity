import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to avoid bundling issues
async function createChart(config: any, width: number, height: number) {
  const { createCanvas } = await import('canvas');
  const { Chart, registerables } = await import('chart.js');
  
  // Register all Chart.js components
  Chart.register(...registerables);

  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Set background to white
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // Create chart
  const chart = new Chart(ctx as any, config);

  // Get image buffer
  const buffer = canvas.toBuffer('image/png');
  
  // Clean up
  chart.destroy();
  
  return buffer;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const configParam = searchParams.get('c');
    const widthParam = searchParams.get('w');
    const heightParam = searchParams.get('h');
    const formatParam = searchParams.get('f') || 'png';

    if (!configParam) {
      return NextResponse.json({ error: 'Missing chart configuration parameter "c"' }, { status: 400 });
    }

    // Parse the chart configuration
    let chartConfig;
    try {
      // First try direct JSON parsing
      chartConfig = JSON.parse(configParam);
    } catch (parseError) {
      try {
        // Try decoding URL-encoded JSON
        const decodedConfig = decodeURIComponent(configParam);
        chartConfig = JSON.parse(decodedConfig);
      } catch (decodeError) {
        try {
          // Handle JavaScript object notation (like QuickChart)
          const cleanConfig = configParam
            .replace(/(\w+):/g, '"$1":') // Add quotes to keys
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
          
          chartConfig = JSON.parse(cleanConfig);
        } catch (cleanError) {
          return NextResponse.json({ 
            error: 'Invalid chart configuration. Must be valid JSON or JavaScript object notation.',
            received: configParam.substring(0, 100) + '...',
            suggestion: 'Try URL-encoding your JSON or use proper JSON format'
          }, { status: 400 });
        }
      }
    }

    // Set dimensions
    const chartWidth = widthParam ? parseInt(widthParam) : 800;
    const chartHeight = heightParam ? parseInt(heightParam) : 600;

    // Validate dimensions
    if (chartWidth > 4000 || chartHeight > 4000 || chartWidth < 50 || chartHeight < 50) {
      return NextResponse.json({ 
        error: 'Invalid dimensions. Width and height must be between 50 and 4000 pixels.' 
      }, { status: 400 });
    }

    // Set default options for better server-side rendering
    chartConfig.options = {
      ...chartConfig.options,
      responsive: false,
      maintainAspectRatio: false,
      animation: false, // Disable animations for server-side rendering
      plugins: {
        ...chartConfig.options?.plugins,
        legend: {
          display: true,
          ...chartConfig.options?.plugins?.legend
        }
      }
    };

    // Generate chart image
    const imageBuffer = await createChart(chartConfig, chartWidth, chartHeight);

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', `image/${formatParam}`);
    headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    headers.set('Access-Control-Allow-Origin', '*'); // Allow CORS

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Chart generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate chart',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}