// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'

// Mock chart data generator based on buoy ID
const generateChartResponse = (buoyId) => ({
  chatMessage: `Here's the temperature profile for ${buoyId}. The chart shows temperature variation with depth.`,
  response: {
    type: 'CHART_DATA',
    data: {
      title: `Temperature Profile - ${buoyId}`,
      xAxis: {
        label: 'Depth (m)',
        data: [0, 50, 100, 150, 200, 250, 300]
      },
      yAxis: {
        label: 'Temperature (°C)',
        data: [
          30.2 + Math.random() * 2,
          29.8 + Math.random() * 2,
          28.5 + Math.random() * 2,
          27.2 + Math.random() * 2,
          25.8 + Math.random() * 2,
          24.1 + Math.random() * 2,
          22.5 + Math.random() * 2
        ].map(val => Math.round(val * 10) / 10)
      }
    }
  }
});

// Mock map data response
const mapDataResponse = {
  chatMessage: 'I\'ve highlighted the buoy locations on the map for you.',
  response: {
    type: 'MAP_DATA',
    data: {
      points: [
        { buoyId: 'ARGO_1', latitude: 12.9716, longitude: 77.5946, temperature: 30.1 },
        { buoyId: 'ARGO_2', latitude: 15.2993, longitude: 74.1240, temperature: 29.5 },
        { buoyId: 'ARGO_3', latitude: 8.5241, longitude: 76.9366, temperature: 30.8 }
      ]
    }
  }
};

// Default text response
const textResponse = {
  chatMessage: 'I can help you explore ocean data! Try asking me to:\n• "plot temperature profile for ARGO_1"\n• "show temperature chart for ARGO_5"\n• "create a profile plot for ARGO_10"\n• "highlight buoys on map"',
  response: {
    type: 'TEXT',
    data: null
  }
};

export const handlers = [
  http.post('/api/v1/chat', async ({ request }) => {
    const { query } = await request.json();
    const lowerQuery = query.toLowerCase();

    // Extract buoy ID from query
    const buoyIdMatch = query.match(/ARGO_\d+/i);
    const buoyId = buoyIdMatch ? buoyIdMatch[0].toUpperCase() : 'ARGO_1';

    // Chart-related commands
    if (lowerQuery.includes('plot') && (lowerQuery.includes('temperature') || lowerQuery.includes('profile'))) {
      return HttpResponse.json(generateChartResponse(buoyId));
    }
    
    if (lowerQuery.includes('show') && (lowerQuery.includes('temperature') || lowerQuery.includes('chart'))) {
      return HttpResponse.json(generateChartResponse(buoyId));
    }
    
    if (lowerQuery.includes('create') && (lowerQuery.includes('profile') || lowerQuery.includes('plot'))) {
      return HttpResponse.json(generateChartResponse(buoyId));
    }

    // Map-related commands
    if (lowerQuery.includes('highlight') || (lowerQuery.includes('show') && lowerQuery.includes('map'))) {
      return HttpResponse.json(mapDataResponse);
    }

    // Default response
    return HttpResponse.json(textResponse);
  }),
]