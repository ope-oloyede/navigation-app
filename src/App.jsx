import React, { useState } from 'react';
import { Home, Navigation } from 'lucide-react';
import './App.css'

const IndoorNavigationMVP = () => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');

  // Define your house layout
  const locations = {
    'entrance': { x: 300, y: 50, label: 'Entrance/Verandah' },
    'living': { x: 150, y: 200, label: 'Living Room' },
    'dining': { x: 350, y: 200, label: 'Dining Room' },
    'kitchen_door': { x: 470, y: 170, label: 'Kitchen Door' },
    'kitchen': { x: 520, y: 200, label: 'Kitchen' },
    'pantry_door': { x: 520, y: 330, label: 'Pantry Door' },
    'pantry': { x: 570, y: 370, label: 'Pantry' },
  };

  // Pre-calculated routes
  const routes = {
    'entrance-living': { path: ['entrance', 'living'], distance: 150 },
    'entrance-dining': { path: ['entrance', 'dining'], distance: 150 },
    'entrance-kitchen': { path: ['entrance', 'dining', 'kitchen_door', 'kitchen'], distance: 280 },
    'entrance-pantry': { path: ['entrance', 'dining', 'kitchen_door', 'kitchen', 'pantry_door', 'pantry'], distance: 450 },
    'living-dining': { path: ['living', 'dining'], distance: 80 },
    'living-kitchen': { path: ['living', 'dining', 'kitchen_door', 'kitchen'], distance: 210 },
    'living-pantry': { path: ['living', 'dining', 'kitchen_door', 'kitchen', 'pantry_door', 'pantry'], distance: 380 },
    'dining-kitchen': { path: ['dining', 'kitchen_door', 'kitchen'], distance: 130 },
    'dining-pantry': { path: ['dining', 'kitchen_door', 'kitchen', 'pantry_door', 'pantry'], distance: 300 },
    'kitchen-pantry': { path: ['kitchen', 'pantry_door', 'pantry'], distance: 170 },
  };

  const getRoute = () => {
    if (!start || !destination || start === destination) {
      return { path: [], distance: 0 };
    }

    const key1 = `${start}-${destination}`;
    const key2 = `${destination}-${start}`;
    
    if (routes[key1]) return routes[key1];
    if (routes[key2]) return { path: [...routes[key2].path].reverse(), distance: routes[key2].distance };
    
    return { path: [], distance: 0 };
  };

  const route = getRoute();

  return (
    <div className="body">
      <div className="box">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Home className="text-indigo-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Your House Navigation System</h1>
              <p className="text-sm text-gray-600">Ground Floor - Main Areas</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Point
              </label>
              <select
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select start location</option>
                {Object.keys(locations).map(loc => (
                  <option key={loc} value={loc}>{locations[loc].label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select destination</option>
                {Object.keys(locations).map(loc => (
                  <option key={loc} value={loc}>{locations[loc].label}</option>
                ))}
              </select>
            </div>
          </div>

          {route.path.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="text-indigo-600" size={20} />
                <h3 className="font-semibold text-indigo-900">Route Found</h3>
              </div>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Distance:</span> {route.distance} units (~{Math.round(route.distance/10)} feet)
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Path:</span> {route.path.map(p => locations[p].label).join(' → ')}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Floor Plan</h2>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <svg width="650" height="450" className="w-full h-auto">
              {/* Room outlines */}
              <rect x="80" y="120" width="140" height="160" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" opacity="0.3"/>
              <text x="150" y="190" textAnchor="middle" fontSize="12" fill="#15803d" fontWeight="bold">Living Room</text>
              
              <rect x="280" y="120" width="140" height="160" fill="#fef3c7" stroke="#d97706" strokeWidth="2" opacity="0.3"/>
              <text x="350" y="195" textAnchor="middle" fontSize="12" fill="#92400e" fontWeight="bold">Dining Room</text>
              
              <rect x="460" y="140" width="90" height="100" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" opacity="0.3"/>
              <text x="505" y="190" textAnchor="middle" fontSize="11" fill="#991b1b" fontWeight="bold">Kitchen</text>
              
              <rect x="510" y="310" width="80" height="100" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" opacity="0.3"/>
              <text x="550" y="360" textAnchor="middle" fontSize="11" fill="#3730a3" fontWeight="bold">Pantry</text>
              
              <rect x="270" y="20" width="60" height="40" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" opacity="0.3"/>
              <text x="300" y="45" textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="bold">Entrance</text>
              
              {/* Connection lines */}
              <line x1="300" y1="50" x2="150" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <line x1="300" y1="50" x2="350" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <line x1="150" y1="200" x2="350" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <line x1="350" y1="200" x2="470" y2="170" stroke="#e5e7eb" strokeWidth="3"/>
              <line x1="470" y1="170" x2="520" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <line x1="520" y1="200" x2="520" y2="330" stroke="#e5e7eb" strokeWidth="3"/>
              <line x1="520" y1="330" x2="570" y2="370" stroke="#e5e7eb" strokeWidth="3"/>
              
              {/* Route path */}
              {route.path.length > 1 && route.path.map((loc, i) => {
                if (i === route.path.length - 1) return null;
                const from = locations[loc];
                const to = locations[route.path[i + 1]];
                return (
                  <line
                    key={`path-${i}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#3b82f6"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                );
              })}
              
              {/* Location nodes */}
              {Object.keys(locations).map(key => {
                const loc = locations[key];
                const isStart = key === start;
                const isEnd = key === destination;
                const isOnPath = route.path.includes(key);
                
                return (
                  <g key={key}>
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r="12"
                      fill={isStart ? '#10b981' : isEnd ? '#ef4444' : isOnPath ? '#3b82f6' : '#6366f1'}
                      stroke="white"
                      strokeWidth="3"
                    />
                    <text
                      x={loc.x}
                      y={loc.y + 25}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#1f2937"
                      fontWeight="500"
                    >
                      {loc.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>On Route</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">✅ Phase 1 Complete!</h3>
          <p className="text-sm text-green-800">
            Navigation working for: Entrance, Living Room, Dining Room, Kitchen, and Pantry. Add hallway and bedrooms when ready!
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndoorNavigationMVP;