// src/components/MapContainer.jsx
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useStore } from '../store/store';
import { useMemo, useState } from 'react';
import argoBuoyData from './ARGO_BUOY.json';

// --- ACTION REQUIRED: ADD YOUR DATA HERE --- //
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJoaW5hdi1uYXRoLTAyIiwiYSI6ImNtZmpiMHo0NjB3dGsyanM0cmRncHJmM3IifQ.P9X0qwBY28lq-_8hgUUb5A';

// Transform GeoJSON data to our buoy format
const transformedBuoys = argoBuoyData.features.map((feature, index) => {
  const [longitude, latitude] = feature.geometry.coordinates;
  // Generate some sample oceanographic data since it's not in the JSON
  const temperature = (Math.random() * 4 + 28).toFixed(1); // 28-32°C
  const salinity = (Math.random() * 2 + 34).toFixed(1); // 34-36 PSU
  const depth = Math.floor(Math.random() * 200 + 100); // 100-300m
  
  return {
    buoyId: `ARGO_${index + 1}`,
    latitude,
    longitude,
    temperature: parseFloat(temperature),
    salinity: parseFloat(salinity),
    depth,
    timestamp: feature.properties.buoyId // Original timestamp from JSON
  };
});

// Use first 50 buoys to avoid too many markers
const initialBuoys = transformedBuoys.slice(0, 50);
// ----------------------------------------- //

export function MapContainer() {
  const mapData = useStore((state) => state.mapData);
  const [selectedBuoy, setSelectedBuoy] = useState(null);

  const buoysToDisplay = useMemo(() => {
    return mapData?.points.length ? mapData.points : initialBuoys;
  }, [mapData]);

  const selectedBuoyData = useMemo(() => {
    return selectedBuoy ? buoysToDisplay.find(buoy => buoy.buoyId === selectedBuoy) : null;
  }, [selectedBuoy, buoysToDisplay]);

  return (
    <Map
      initialViewState={{ longitude: 78.9629, latitude: 20.5937, zoom: 4 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/abhinav-nath-02/cmfkpg7fi006n01s4ffwj8pce"
      mapboxAccessToken={MAPBOX_TOKEN}
      onClick={() => setSelectedBuoy(null)}
    >
      {buoysToDisplay.map((buoy) => (
        <Marker
          key={buoy.buoyId}
          longitude={buoy.longitude}
          latitude={buoy.latitude}
          anchor="bottom"
        >
          <div 
            className="text-2xl cursor-pointer hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBuoy(buoy.buoyId);
            }}
          >
            📍
          </div>
        </Marker>
      ))}
      
      {selectedBuoyData && (
        <Popup
          longitude={selectedBuoyData.longitude}
          latitude={selectedBuoyData.latitude}
          anchor="top"
          onClose={() => setSelectedBuoy(null)}
          closeButton={true}
          closeOnClick={false}
          className="buoy-popup"
        >
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg min-w-64">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">
              {selectedBuoyData.buoyId}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Temperature:</span>
                <span className="text-yellow-400 font-semibold">
                  {selectedBuoyData.temperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Salinity:</span>
                <span className="text-blue-400 font-semibold">
                  {selectedBuoyData.salinity} PSU
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Depth:</span>
                <span className="text-green-400 font-semibold">
                  {selectedBuoyData.depth}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Location:</span>
                <span className="text-purple-400 font-semibold">
                  {selectedBuoyData.latitude.toFixed(4)}°, {selectedBuoyData.longitude.toFixed(4)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Last Update:</span>
                <span className="text-orange-400 font-semibold text-xs">
                  {selectedBuoyData.timestamp}
                </span>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}