import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building,
  Users,
  Plus,
  Check,
  Sparkles,
  Layers,
  FileText,
  Compass,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { PRESET_ADDITIONAL_VILLAGES, PresetVillageTemplate } from '../../data/initialData';

interface AddVillageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVillageAdded?: (villageId: string) => void;
}

export const AddVillageModal: React.FC<AddVillageModalProps> = ({
  isOpen,
  onClose,
  onVillageAdded,
}) => {
  const { villages, addVillage, addVillagesBatch } = useConstituency();

  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'presets'>('single');

  // Single village form state
  const [name, setName] = useState('');
  const [kannadaName, setKannadaName] = useState('');
  const [mandal, setMandal] = useState('North Block Mandal');
  const [customMandal, setCustomMandal] = useState('');
  const [useCustomMandal, setUseCustomMandal] = useState(false);
  const [wardsCount, setWardsCount] = useState<number>(4);
  const [boothsCount, setBoothsCount] = useState<number>(12);
  const [population, setPopulation] = useState<number>(12500);
  const [registeredMembers, setRegisteredMembers] = useState<number>(950);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');
  const [autoCoordinates, setAutoCoordinates] = useState(true);
  const [customLat, setCustomLat] = useState('13.2000');
  const [customLng, setCustomLng] = useState('77.6500');

  // Bulk add state
  const [bulkText, setBulkText] = useState('');
  const [bulkMandal, setBulkMandal] = useState('North Block Mandal');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

  // Existing mandals
  const existingMandals = Array.from(new Set(villages.map((v) => v.mandal)));

  if (!isOpen) return null;

  // Check which preset villages are already added
  const existingVillageNames = new Set(villages.map((v) => v.name.toLowerCase()));
  const unaddedPresets = PRESET_ADDITIONAL_VILLAGES.filter(
    (p) => !existingVillageNames.has(p.name.toLowerCase())
  );

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenMandal = useCustomMandal && customMandal.trim() ? customMandal.trim() : mandal;

    const newV = addVillage({
      name: name.trim(),
      kannadaName: kannadaName.trim() || undefined,
      mandal: chosenMandal,
      wardsCount,
      boothsCount,
      population,
      registeredMembers,
      coordinatorName: coordinatorName.trim() || undefined,
      coordinatorPhone: coordinatorPhone.trim() || undefined,
      lat: autoCoordinates ? undefined : parseFloat(customLat) || undefined,
      lng: autoCoordinates ? undefined : parseFloat(customLng) || undefined,
    });

    if (onVillageAdded) {
      onVillageAdded(newV.id);
    }
    onClose();
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (items.length === 0) return;

    const created = addVillagesBatch(items, bulkMandal);
    setBulkSuccessMsg(`Successfully added ${created.length} new villages.`);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleAddPreset = (preset: PresetVillageTemplate) => {
    const newV = addVillage({
      name: preset.name,
      kannadaName: preset.kannadaName,
      mandal: preset.mandal,
      population: preset.population,
      boothsCount: preset.boothsCount,
      wardsCount: preset.wardsCount,
      coordinatorName: preset.coordinatorName,
      coordinatorPhone: preset.coordinatorPhone,
      lat: preset.lat,
      lng: preset.lng,
    });
    if (onVillageAdded) {
      onVillageAdded(newV.id);
    }
  };

  const handleAddAllPresets = () => {
    unaddedPresets.forEach((p) => {
      addVillage({
        name: p.name,
        kannadaName: p.kannadaName,
        mandal: p.mandal,
        population: p.population,
        boothsCount: p.boothsCount,
        wardsCount: p.wardsCount,
        coordinatorName: p.coordinatorName,
        coordinatorPhone: p.coordinatorPhone,
        lat: p.lat,
        lng: p.lng,
      });
    });
    onClose();
  };

  return (
    <div
      id="add-village-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="add-village-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-indigo-950 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Building className="w-4 h-4" />
              <span>CONSTITUENCY JURISDICTION SETUP</span>
            </div>
            <h3 className="text-lg font-bold mt-1">Add Village / Gram Panchayat</h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Expand the assembly network for polling booth management and citizen grievance routing.
            </p>
          </div>
          <button
            id="btn-close-add-village-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-3 gap-2">
          <button
            id="tab-single-village"
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Single Village Form
          </button>

          <button
            id="tab-presets-village"
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Presets ({unaddedPresets.length})
          </button>

          <button
            id="tab-bulk-village"
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bulk'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Bulk Import (Paste Text)
          </button>
        </div>

        {/* Tab 1: Single Village Form */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Village Name (English) *
                </label>
                <input
                  id="input-village-name"
                  type="text"
                  required
                  placeholder="e.g. Doddajala, Marasandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kannada Name (ಕನ್ನಡ ಹೆಸರು)
                </label>
                <input
                  id="input-village-kannada-name"
                  type="text"
                  placeholder="e.g. ದೊಡ್ಡಜಾಲ, ಮಾರಸಂದ್ರ"
                  value={kannadaName}
                  onChange={(e) => setKannadaName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Mandal / Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">Mandal / Assembly Block *</label>
                <button
                  type="button"
                  onClick={() => setUseCustomMandal(!useCustomMandal)}
                  className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
                >
                  {useCustomMandal ? 'Select existing mandal' : '+ New custom mandal'}
                </button>
              </div>

              {useCustomMandal ? (
                <input
                  type="text"
                  placeholder="Enter new Mandal name (e.g. Airport Corridor Mandal)"
                  value={customMandal}
                  onChange={(e) => setCustomMandal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <select
                  id="select-village-mandal"
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {existingMandals.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="North Block Mandal">North Block Mandal</option>
                  <option value="East Block Mandal">East Block Mandal</option>
                  <option value="West Block Mandal">West Block Mandal</option>
                  <option value="South Block Mandal">South Block Mandal</option>
                  <option value="Central Town Mandal">Central Town Mandal</option>
                </select>
              )}
            </div>

            {/* Demographics & Booths Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Wards Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={wardsCount}
                  onChange={(e) => setWardsCount(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Polling Booths
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={boothsCount}
                  onChange={(e) => setBoothsCount(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Population (Est.)
                </label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={population}
                  onChange={(e) => setPopulation(parseInt(e.target.value) || 500)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Registered Cadre
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={registeredMembers}
                  onChange={(e) => setRegisteredMembers(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>

            {/* Grassroots Coordinator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Lead Coordinator / Booth In-Charge
                </label>
                <div className="relative">
                  <Users className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Gowda"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Coordinator Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+91 98450 00000"
                    value={coordinatorPhone}
                    onChange={(e) => setCoordinatorPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Map Geolocation */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Constituency Map Coordinates</span>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCoordinates}
                    onChange={(e) => setAutoCoordinates(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Auto-pin inside AC-58 Sindhanur bounding box</span>
                </label>
              </div>

              {!autoCoordinates && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">
                      Latitude (~15.60 to 15.95)
                    </label>
                    <input
                      type="text"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">
                      Longitude (~76.50 to 76.95)
                    </label>
                    <input
                      type="text"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-submit-add-village"
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Village to Constituency
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Quick Presets */}
        {activeTab === 'presets' && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  Well-Known Constituency Villages
                </h4>
                <p className="text-xs text-stone-500">
                  Pre-configured village panchayats in Sindhanur assembly with verified coordinates and booths.
                </p>
              </div>

              {unaddedPresets.length > 0 && (
                <button
                  type="button"
                  onClick={handleAddAllPresets}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Add All ({unaddedPresets.length}) Presets
                </button>
              )}
            </div>

            {unaddedPresets.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="text-sm font-bold text-stone-800">All preset villages are already added!</h5>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Every pre-configured village is now active in your directory. Use the Single Village or Bulk Import tabs to add more custom locations.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unaddedPresets.map((preset) => (
                  <div
                    key={preset.name}
                    className="p-3.5 rounded-xl border border-stone-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/30 transition flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-xs text-stone-900 block">
                            {preset.name}
                          </span>
                          <span className="text-[11px] text-stone-500">{preset.kannadaName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                          {preset.mandal}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-3">
                        <span>{preset.boothsCount} Booths</span>
                        <span>•</span>
                        <span>{preset.population.toLocaleString()} Pop.</span>
                        <span>•</span>
                        <span>Lead: {preset.coordinatorName}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddPreset(preset)}
                      className="w-full py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Constituency
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bulk Import */}
        {activeTab === 'bulk' && (
          <form onSubmit={handleBulkSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Default Mandal / Block for Imported Villages
              </label>
              <select
                value={bulkMandal}
                onChange={(e) => setBulkMandal(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {existingMandals.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="North Block Mandal">North Block Mandal</option>
                <option value="East Block Mandal">East Block Mandal</option>
                <option value="West Block Mandal">West Block Mandal</option>
                <option value="South Block Mandal">South Block Mandal</option>
                <option value="Central Town Mandal">Central Town Mandal</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Paste Village Names (Separated by new lines or commas) *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setBulkText(
                      'Binnamangala\nUganawadi\nChikkajala\nAkkupet\nBudigere Cross\nYeliyur\nKoira South\nGollahalli'
                    )
                  }
                  className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
                >
                  Paste sample list
                </button>
              </div>
              <textarea
                rows={5}
                required
                placeholder="Paste list here, e.g.:&#10;Doddajala&#10;Marasandra&#10;Koira&#10;Binnamangala"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Live Parsing Preview */}
            {bulkText.trim() && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  Detected Villages ({bulkText.split(/[\n,]+/).filter((s) => s.trim()).length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {bulkText
                    .split(/[\n,]+/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((vName, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-800 text-[11px] font-medium"
                      >
                        {vName}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {bulkSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {bulkSuccessMsg}
              </div>
            )}

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!bulkText.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Import Villages
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
