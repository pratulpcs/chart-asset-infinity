// Utility functions for chart configuration and URL generation

export interface ChartConfig {
    type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'scatter' | 'bubble';
    data: {
      labels?: string[];
      datasets: Array<{
        label?: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
        fill?: boolean;
        tension?: number;
        [key: string]: any;
      }>;
    };
    options?: {
      responsive?: boolean;
      plugins?: {
        title?: {
          display: boolean;
          text: string;
        };
        legend?: {
          display: boolean;
        };
      };
      scales?: {
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
  
  export class ChartUrlBuilder {
    private baseUrl: string;
    private config: ChartConfig;
    private width?: number;
    private height?: number;
    private format: 'png' | 'jpg' | 'jpeg' = 'png';
  
    constructor(baseUrl: string = '') {
      this.baseUrl = baseUrl;
      this.config = {
        type: 'bar',
        data: { datasets: [] }
      };
    }
  
    setType(type: ChartConfig['type']): this {
      this.config.type = type;
      return this;
    }
  
    setData(data: ChartConfig['data']): this {
      this.config.data = data;
      return this;
    }
  
    setOptions(options: ChartConfig['options']): this {
      this.config.options = options;
      return this;
    }
  
    setDimensions(width: number, height: number): this {
      this.width = width;
      this.height = height;
      return this;
    }
  
    setFormat(format: 'png' | 'jpg' | 'jpeg'): this {
      this.format = format;
      return this;
    }
  
    build(): string {
      const params = new URLSearchParams();
      params.set('c', JSON.stringify(this.config));
      
      if (this.width) params.set('w', this.width.toString());
      if (this.height) params.set('h', this.height.toString());
      if (this.format !== 'png') params.set('f', this.format);
  
      return `${this.baseUrl}/api/chart?${params.toString()}`;
    }
  
    // Static method for quick chart generation
    static generateUrl(
      baseUrl: string,
      config: ChartConfig,
      options?: { width?: number; height?: number; format?: 'png' | 'jpg' | 'jpeg' }
    ): string {
      const builder = new ChartUrlBuilder(baseUrl);
      builder.config = config;
      
      if (options?.width && options?.height) {
        builder.setDimensions(options.width, options.height);
      }
      
      if (options?.format) {
        builder.setFormat(options.format);
      }
  
      return builder.build();
    }
  }
  
  // Predefined chart templates
  export const chartTemplates = {
    simpleBar: (labels: string[], data: number[], title: string): ChartConfig => ({
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Data',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title
          }
        }
      }
    }),
  
    simpleLine: (labels: string[], data: number[], title: string): ChartConfig => ({
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Data',
          data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title
          }
        }
      }
    }),
  
    simplePie: (labels: string[], data: number[], title: string): ChartConfig => ({
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ]
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title
          }
        }
      }
    })
  };
  
  // Helper function to validate chart configuration
  export function validateChartConfig(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
  
    if (!config.type) {
      errors.push('Chart type is required');
    }
  
    if (!config.data) {
      errors.push('Chart data is required');
    } else {
      if (!config.data.datasets || !Array.isArray(config.data.datasets)) {
        errors.push('Chart data must contain datasets array');
      } else if (config.data.datasets.length === 0) {
        errors.push('At least one dataset is required');
      }
    }
  
    return {
      valid: errors.length === 0,
      errors
    };
  }