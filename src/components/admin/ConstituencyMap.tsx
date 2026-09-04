import React, { useState } from 'react';
import { MapPin, Filter, Layers, Navigation, ZoomIn, ZoomOut, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { Issue, Village } from '../../types';

interface ConstituencyMapProps {
  onSelectIssue: (id: string) => void;
  onSelectVillage: (id: string) => void;
}

export const ConstituencyMap: React.FC<ConstituencyMapProps> = ({
  onSelectIssue,
  onSelectVillage,
}) => {
  const { villages, issues } = useConstituency();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('all');
  const [hoveredIssue, setHoveredIssue] = useState<Issue | null>(null);

  const filteredIssues = issues.filter((iss) => {
    if (selectedCategory !== 'all' && iss.category !== selectedCategory) return false;
    if (selectedVillageFilter !== 'all' && iss.villageId !== selectedVillageFilter) return false;
    return true;
  });

  // Category color mapper for map pins
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'water':
        return '#0284c7'; // sky
      case 'roads':
        return '#d97706'; // amber
      case 'electricity':
        return '#eab308'; // yellow
      case 'streetlights':
        return '#6366f1'; // indigo
      case 'drainage':
        return '#059669'; // emerald
      case 'healthcare':
        return '#e11d48'; // rose
      default:
        return '#64748b'; // slate
    }
  };

  // Convert GPS coords for AC-58 Sindhanur (lat: ~15.60 to 15.94, lng: ~76.50 to 76.94) to relative percentages on SVG map canvas
  const minLat = 15.58;
  const maxLat = 15.95;
  const minLng = 76.48;
  const maxLng = 76.95;

  const toMapCoords = (lat: number, lng: number) => {
    // Latitude decreases going south (higher y in SVG)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10;
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    return { x: Math.max(4, Math.min(96, x)), y: Math.max(4, Math.min(96, y)) };
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col">
      {/* Map Control Bar */}
      <div className="p-3 sm:p-4 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold">
              AC-58 Sindhanur Geospatial Grievance Map
            </h3>
            <p className="text-[11px] text-stone-400">
              Live pins across {villages.length} Villages & Polling Booths
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedVillageFilter}
            onChange={(e) => setSelectedVillageFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-xs font-semibold text-stone-200 border border-stone-700 max-w-[200px]"
          >
            <option value="all">All Villages ({villages.length})</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-xs font-semibold text-stone-200 border border-stone-700"
          >
            <option value="all">All Categories</option>
            <option value="water">💧 Water</option>
            <option value="roads">🛣️ Roads</option>
            <option value="electricity">⚡ Electricity</option>
            <option value="drainage">🌊 Drainage</option>
            <option value="healthcare">🏥 Healthcare</option>
          </select>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full h-[420px] bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50/20 overflow-hidden select-none">
        {/* Subtle decorative grid lines */}
        <svg className="absolute inset-0 w-full h-full stroke-stone-200/60" strokeWidth="1">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connective constituency arterial roads */}
          <path
            d="M 15 20 Q 40 45 85 80"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          <path
            d="M 20 85 Q 50 60 75 15"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeDasharray="6,4"
          />
        </svg>

        {/* Village Nodes on Map */}
        {villages.map((v) => {
          const coords = toMapCoords(v.lat, v.lng);
          return (
            <div
              key={v.id}
              onClick={() => onSelectVillage(v.id)}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-transform hover:scale-110"
            >
              <div className="flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-full bg-stone-900/90 text-white text-[10px] font-bold shadow-md border border-stone-700 whitespace-nowrap group-hover:bg-indigo-950 transition">
                  {v.name}
                  {v.activeIssuesCount > 0 && (
                    <span className="ml-1.5 px-1 rounded-full bg-rose-500 text-white text-[9px]">
                      {v.activeIssuesCount}
                    </span>
                  )}
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-stone-900 mt-0.5 ring-2 ring-white" />
              </div>
            </div>
          );
        })}

        {/* Issue Markers Pins */}
        {filteredIssues.map((iss) => {
          const coords = toMapCoords(iss.latitude, iss.longitude);
          const color = getCategoryColor(iss.category);
          const isResolved = iss.status === 'Resolved' || iss.status === 'Citizen Confirmed';

          return (
            <div
              key={iss.id}
              onClick={() => onSelectIssue(iss.id)}
              onMouseEnter={() => setHoveredIssue(iss)}
              onMouseLeave={() => setHoveredIssue(null)}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform hover:scale-125"
            >
              <div
                style={{ backgroundColor: color }}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white shadow-lg ring-2 ring-white ${
                  iss.urgency === 'critical' ? 'animate-bounce' : ''
                }`}
              >
                {isResolved ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <span className="text-[10px] font-bold">!</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Hovered Issue Tooltip Card */}
        {hoveredIssue && (
          <div
            className="absolute bottom-4 left-4 z-30 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-stone-200 max-w-xs text-xs pointer-events-none animate-in fade-in"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-mono font-bold text-stone-700">
                {hoveredIssue.ticketNumber}
              </span>
              <span className="font-bold text-stone-900 truncate">
                {hoveredIssue.title}
              </span>
            </div>
            <p className="text-stone-600 line-clamp-2 text-[11px]">
              {hoveredIssue.description}
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
              <span>{hoveredIssue.villageName} • Ward {hoveredIssue.wardNumber}</span>
              <span className="font-bold text-indigo-700 uppercase">
                {hoveredIssue.status}
              </span>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-stone-200 shadow-xs text-[10px] space-y-1 hidden sm:block">
          <div className="font-bold text-stone-700 uppercase tracking-wider mb-1">
            Pin Categories
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span>Water / RO Plant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span>Roads & Potholes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>Electricity & GESCOM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Healthcare / PHC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Drainage / Sanitation</span>
          </div>
        </div>

        {/* Map Help Text Footer */}
        <div className="absolute bottom-2 right-3 text-[10px] text-stone-500 bg-white/80 px-2 py-0.5 rounded backdrop-blur-xs">
          Click any village node or issue pin to inspect
        </div>
      </div>
    </div>
  );
};
