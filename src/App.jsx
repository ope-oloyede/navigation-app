import React, { useState } from 'react';
import { Home, MapPin, Navigation, Locate } from 'lucide-react';
import './app.css';

const locations = {
  entrance: { label: 'Entrance', x: 300, y: 50 },
  living: { label: 'Living Room', x: 150, y: 200 },
  dining: { label: 'Dining Room', x: 350, y: 200 },
  kitchen: { label: 'Kitchen', x: 470, y: 170 },
  serviceArea: { label: 'Service Area', x: 520, y: 200 },
  storage: { label: 'Storage', x: 520, y: 330 },
  pantry: { label: 'Pantry', x: 570, y: 370 }
};

const graph = {
  entrance: [{ to: 'living', dist: 15 }, { to: 'dining', dist: 15 }],
  living: [{ to: 'entrance', dist: 15 }, { to: 'dining', dist: 8 }],
  dining: [{ to: 'entrance', dist: 15 }, { to: 'living', dist: 8 }, { to: 'kitchen', dist: 8 }],
  kitchen: [{ to: 'dining', dist: 8 }, { to: 'serviceArea', dist: 5 }],
  serviceArea: [{ to: 'kitchen', dist: 5 }, { to: 'storage', dist: 12 }],
  storage: [{ to: 'serviceArea', dist: 12 }, { to: 'pantry', dist: 5 }],
  pantry: [{ to: 'storage', dist: 5 }]
};

export default function NavigationSystem() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState({ path: [], distance: 0 });
  const [isDetecting, setIsDetecting] = useState(false);

  const dijkstra = (start, end) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(locations));
    
    Object.keys(locations).forEach(node => {
      distances[node] = Infinity;
      previous[node] = null;
    });
    distances[start] = 0;

    while (unvisited.size > 0) {
      let current = null;
      let minDist = Infinity;
      
      unvisited.forEach(node => {
        if (distances[node] < minDist) {
          minDist = distances[node];
          current = node;
        }
      });

      if (current === null || current === end) break;
      unvisited.delete(current);

      graph[current]?.forEach(({ to, dist }) => {
        if (unvisited.has(to)) {
          const newDist = distances[current] + dist;
          if (newDist < distances[to]) {
            distances[to] = newDist;
            previous[to] = current;
          }
        }
      });
    }

    const path = [];
    let curr = end;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }

    return { path: path[0] === start ? path : [], distance: distances[end] };
  };

  const detectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      const randomLoc = Object.keys(locations)[Math.floor(Math.random() * Object.keys(locations).length)];
      setCurrentLocation(randomLoc);
      setIsDetecting(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (currentLocation && destination && destination !== currentLocation) {
      setRoute(dijkstra(currentLocation, destination));
    } else {
      setRoute({ path: [], distance: 0 });
    }
  }, [currentLocation, destination]);

  return (
    <div className="container">
      <div className="max-width-container">
        <div className="card">
          <div className="header">
            <Home className="header-icon" size={32} />
            <div className="header-content">
              <h1 className="title">Your House Navigation System</h1>
              <p className="subtitle">Ground Floor - Main Areas</p>
            </div>
            <button onClick={detectLocation} disabled={isDetecting} className="detect-button">
              <Locate size={20} className={isDetecting ? 'spin' : ''} />
              {isDetecting ? 'Detecting...' : 'Update Location'}
            </button>
          </div>
          
          {currentLocation && (
            <div className="location-box">
              <div className="location-header">
                <MapPin className="location-header-icon" size={20} />
                <h3 className="location-header-text">Your Current Location</h3>
              </div>
              <p className="location-current">{locations[currentLocation].label}</p>
              <p className="location-instruction">Select a destination below to get directions.</p>
            </div>
          )}

          <div className="select-container">
            <label className="label">🎯 Where Do You Want To Go?</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="select" disabled={!currentLocation}>
              <option value="">Select destination</option>
              {Object.keys(locations).map(loc => (
                <option key={loc} value={loc} disabled={loc === currentLocation}>
                  {locations[loc].label} {loc === currentLocation ? '(You are here)' : ''}
                </option>
              ))}
            </select>
          </div>

          {route.path.length > 0 && (
            <div className="route-box">
              <div className="route-header">
                <Navigation className="route-header-icon" size={20} />
                <h3 className="route-header-text">Route Found</h3>
              </div>
              <p className="route-info">
                <span className="route-label">Distance:</span> {route.distance} units (~{Math.round(route.distance/10)} feet)
              </p>
              <p className="route-info">
                <span className="route-label">Path:</span> {route.path.map(p => locations[p].label).join(' → ')}
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="section-title">Floor Plan</h2>
          <div className="floor-plan-container">
            <svg width="650" height="450" className="floor-plan-svg">
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
              
              <line x1="300" y1="50" x2="150" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <rect x="210" y="115" width="50" height="20" fill="white" stroke="#94a3b8" strokeWidth="1" rx="4"/>
              <text x="235" y="129" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">15 ft</text>
              
              <line x1="300" y1="50" x2="350" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <rect x="315" y="115" width="50" height="20" fill="white" stroke="#94a3b8" strokeWidth="1" rx="4"/>
              <text x="340" y="129" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">15 ft</text>
              
              <line x1="150" y1="200" x2="350" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <rect x="225" y="190" width="50" height="20" fill="white" stroke="#94a3b8" strokeWidth="1" rx="4"/>
              <text x="250" y="204" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">8 ft</text>
              
              <line x1="350" y1="200" x2="470" y2="170" stroke="#e5e7eb" strokeWidth="3"/>
              <rect x="390" y="175" width="50" height="20" fill="white" stroke="#94a3b8" strokeWidth="1" rx="4"/>
              <text x="415" y="189" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">8 ft</text>
              
              <line x1="470" y1="170" x2="520" y2="200" stroke="#e5e7eb" strokeWidth="3"/>
              <rect x="480" y="175" width="50" height="20" fill="white" stroke="#94a3b8" strokeWidth="1" rx="4"/>
              <text x="505" y="189" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">5 ft</text>
              
              <line x1="520" y1="200" x2="520" y2="330" stroke="#e5e7eb" strokeWidth="3"/>
              <rect x="530" y="255" width="50" height="20" fill="white" stroke="#94a3b8" strokeWidth="1" rx="4"/>
              <text x="555" y="269" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">12 ft</text>
              
              <line x1="520" y1="330" x2="570" y2="370" stroke="#e5e7eb" strokeWidth="3"/>
              <rect x="535" y="340" width="50" height="20" fill="white" stroke="#94a3b8" strokeWidth="1" rx="4"/>
              <text x="560" y="354" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">5 ft</text>
              
              {route.path.length > 1 && route.path.map((loc, i) => {
                if (i === route.path.length - 1) return null;
                const from = locations[loc];
                const to = locations[route.path[i + 1]];
                return (
                  <line key={`path-${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
                );
              })}
              
              {Object.keys(locations).map(key => {
                const loc = locations[key];
                const isCurrent = key === currentLocation;
                const isDestination = key === destination;
                const isOnPath = route.path.includes(key);
                
                return (
                  <g key={key}>
                    <circle cx={loc.x} cy={loc.y} r="12" fill={isCurrent ? '#10b981' : isDestination ? '#ef4444' : isOnPath ? '#3b82f6' : '#6366f1'} stroke="white" strokeWidth="3" />
                    {isCurrent && (
                      <circle cx={loc.x} cy={loc.y} r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5">
                        <animate attributeName="r" from="12" to="24" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <text x={loc.x} y={loc.y + 25} textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="500">
                      {loc.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="legend">
            <div className="legend-item">
              <div className="legend-dot legend-dot-green"></div>
              <span>Your Location</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot legend-dot-red"></div>
              <span>Destination</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot legend-dot-blue"></div>
              <span>On Route</span>
            </div>
          </div>
        </div>

        <div className="info-box">
          <h3 className="info-title">✅ Phase 1 Complete!</h3>
          <p className="info-text">
            Navigation working for: Entrance, Living Room, Dining Room, Kitchen, and Pantry.
          </p>
          <div className="info-subbox">
            <h4 className="info-subtitle">🔧 How Location Detection Works:</h4>
            <p className="info-detail">
              <strong>For MVP/House:</strong> Simulated location (click "Update Location" to change)<br/>
              <strong>For Real Mall:</strong> Would use WiFi triangulation, Bluetooth beacons, or phone sensors for precise indoor positioning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}