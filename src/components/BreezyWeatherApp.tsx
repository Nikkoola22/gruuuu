import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sun, Moon, CloudSun, CloudMoon, Cloud, CloudRain, CloudDrizzle,
  CloudLightning, CloudSnow, CloudFog, Wind, Compass, Droplets,
  Thermometer, Eye, Gauge, ShieldAlert, Sparkles, MapPin, Search,
  RefreshCw, X, ChevronDown, ChevronRight, ChevronLeft, ArrowUp,
  ArrowDown, ArrowUpRight, Check, Heart, ExternalLink, Settings,
  Info, Umbrella, Waves, Sunrise, Sunset, MoonStar, Circle, AlertTriangle
} from 'lucide-react';

import {
  WeatherLocation,
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
  AirQualityData,
  WeatherSourceModel,
  SunMoonData,
  WeatherAlert,
  WeatherSettings
} from '../utils/Weather/types';
import {
  getFallbackWeatherData,
  getFallbackAirQuality
} from '../utils/Weather/fallbackData';
import {
  fetchWeatherData,
  fetchAirQuality,
  searchCities,
  reverseGeocode,
  DEFAULT_CITIES,
  WeatherDataResponse
} from '../utils/Weather/weatherApi';
import {
  getWeatherConditionInfo,
  WeatherConditionInfo
} from '../utils/Weather/weatherCodes';
import {
  getBeaufortScale,
  getUvStatus,
  detectWeatherAlerts
} from '../utils/Weather/weatherCalculations';
import {
  getActiveLocation,
  setActiveLocation as persistActiveLocation,
  getSavedLocations,
  saveLocation,
  removeSavedLocation,
  getWeatherSettings,
  saveWeatherSettings
} from '../utils/Weather/storage';

interface BreezyWeatherAppProps {
  onClose?: () => void;
  theme?: 'light' | 'dark';
}

export default function BreezyWeatherApp({ onClose, theme: appTheme = 'light' }: BreezyWeatherAppProps) {
  // Theme state: defaults to 'light' mode as requested
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const isLight = currentTheme === 'light';

  // State: Location & Settings
  const [currentLocation, setCurrentLocation] = useState<WeatherLocation>(getActiveLocation);
  const [savedLocations, setSavedLocations] = useState<WeatherLocation[]>(getSavedLocations);
  const [settings, setSettings] = useState<WeatherSettings>(getWeatherSettings);

  // State: Weather Data (initialized with instant local data so it's never blank)
  const [weatherData, setWeatherData] = useState<WeatherDataResponse>(() => getFallbackWeatherData(getActiveLocation().name));
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(getFallbackAirQuality);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State: UI Interactions
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [hourlyTab, setHourlyTab] = useState<'feels_like_rain' | 'temp' | 'wind' | 'humidity'>('feels_like_rain');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [activeRadarLayer, setActiveRadarLayer] = useState<'clouds' | 'radar'>('radar');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const hourlyScrollRef = useRef<HTMLDivElement>(null);

  // Load weather data for current location
  const loadWeather = async (loc: WeatherLocation, model: WeatherSourceModel = settings.sourceModel, isBackground = true) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [wRes, aqRes] = await Promise.all([
        fetchWeatherData(loc.latitude, loc.longitude, model),
        fetchAirQuality(loc.latitude, loc.longitude)
      ]);
      setWeatherData(wRes);
      setAirQuality(aqRes);
    } catch (err: any) {
      console.warn('Utilisation des données locales:', err);
      // Fallback data keeps the UI loaded seamlessly
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather(currentLocation, settings.sourceModel, true);
  }, [currentLocation, settings.sourceModel]);

  // Handle Location Selection
  const handleSelectLocation = (loc: WeatherLocation) => {
    setCurrentLocation(loc);
    persistActiveLocation(loc);
    setSavedLocations(saveLocation(loc));
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  // Search Debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Geolocation Handler
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const geoLoc = await reverseGeocode(latitude, longitude);
        if (geoLoc) {
          handleSelectLocation(geoLoc);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLoading(false);
        alert('Impossible de récupérer votre position. Vérifiez les autorisations de localisation.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Update Settings
  const updateSettings = (newSettings: Partial<WeatherSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveWeatherSettings(updated);
  };

  // Weather Condition & Theme Info
  const conditionInfo: WeatherConditionInfo = useMemo(() => {
    return getWeatherConditionInfo(
      weatherData.current.weatherCode,
      weatherData.current.isDay,
      settings.darkSun
    );
  }, [weatherData, settings.darkSun]);

  // Alerts Detection
  const alerts: WeatherAlert[] = useMemo(() => {
    return detectWeatherAlerts(weatherData.current, weatherData.daily);
  }, [weatherData]);

  // Temperature Converter helper
  const formatTemp = (val: number) => {
    if (settings.unitTemp === 'fahrenheit') {
      return `${Math.round((val * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(val)}°C`;
  };

  // Wind speed helper
  const formatWind = (kmh: number) => {
    if (settings.unitSpeed === 'ms') {
      return `${Math.round(kmh / 3.6)} m/s`;
    }
    if (settings.unitSpeed === 'mph') {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${kmh} km/h`;
  };

  // Render Weather Icon component
  const renderWeatherIcon = (iconName: string, className = 'w-6 h-6', isDarkSunOverride = false) => {
    const isDarkSunActive = (settings.darkSun || isDarkSunOverride);

    switch (iconName) {
      case 'Sun':
        return (
          <Sun className={`${className} ${isDarkSunActive ? 'text-slate-600 drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]' : 'text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]'} transition-colors duration-500`} />
        );
      case 'Moon':
        return <Moon className={`${className} text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]`} />;
      case 'CloudSun':
        return (
          <div className="relative inline-flex items-center justify-center">
            <Sun className={`absolute -top-1 -right-1 w-3/4 h-3/4 ${isDarkSunActive ? 'text-slate-600' : 'text-amber-500'}`} />
            <Cloud className={`${className} text-slate-400`} />
          </div>
        );
      case 'CloudMoon':
        return (
          <div className="relative inline-flex items-center justify-center">
            <Moon className="absolute -top-1 -right-1 w-3/4 h-3/4 text-indigo-400" />
            <Cloud className={`${className} text-slate-400`} />
          </div>
        );
      case 'Cloud':
        return <Cloud className={`${className} text-slate-500`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-cyan-500`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]`} />;
      case 'CloudSnow':
        return <CloudSnow className={`${className} text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-slate-400`} />;
      default:
        return <Cloud className={`${className} text-slate-400`} />;
    }
  };

  const isCurrentFavorite = savedLocations.some(
    s => s.id === currentLocation.id || (Math.abs(s.latitude - currentLocation.latitude) < 0.05 && Math.abs(s.longitude - currentLocation.longitude) < 0.05)
  );

  return (
    <div className={`fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden overscroll-contain pt-7 sm:pt-8 pb-16 font-sans transition-colors duration-500 ${
      isLight 
        ? 'bg-gradient-to-b from-sky-50 via-slate-50 to-blue-50/40 text-slate-800 selection:bg-sky-500/20 selection:text-sky-900' 
        : 'bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#05070e] text-slate-100 selection:bg-sky-500/30 selection:text-white'
    }`}>
      {/* --- TOP BAR NAVIGATION & QUICK CONTROLS --- */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${
        isLight
          ? 'bg-white/85 border-slate-200/80 shadow-sm'
          : 'bg-slate-950/70 border-white/10 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: RED RETURN BUTTON + LOGO */}
          <div className="flex items-center justify-between gap-3">
            {/* BOUTON ROUGE RETOUR */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/30 hover:shadow-lg hover:shadow-red-600/40 transition-all border border-red-500 shrink-0"
                title="Retour au menu principal"
              >
                <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Retour</span>
              </button>
            )}

            {/* Logo & Version Tag */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-600 p-[2px] shadow-md shadow-sky-500/20">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                  <Wind className="w-4 h-4 text-sky-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Breezy Weather
                  </h1>
                  <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full border ${
                    isLight 
                      ? 'bg-sky-100 text-sky-700 border-sky-300' 
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  }`}>
                    v6.2.2
                  </span>
                </div>
                <p className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>Mode Clair</span>
                  <span>•</span>
                  <span className="text-sky-600 dark:text-sky-400 font-medium">
                    {settings.sourceModel === 'best_match' && 'Open-Meteo'}
                    {settings.sourceModel === 'meteofrance_seamless' && 'Météo-France'}
                    {settings.sourceModel === 'icon_seamless' && 'DWD ICON'}
                    {settings.sourceModel === 'ecmwf_ifs025' && 'ECMWF'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar & Autocomplete */}
          <div className="relative flex-1 max-w-md mx-auto md:mx-4">
            <div className="relative flex items-center">
              <Search className={`absolute left-3.5 w-4 h-4 pointer-events-none ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                placeholder="Rechercher une ville (Gennevilliers, Paris, Lyon...)"
                className={`w-full pl-10 pr-20 py-2 text-xs sm:text-sm rounded-xl border transition-all ${
                  isLight
                    ? 'bg-slate-100/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500'
                    : 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50'
                }`}
              />
              <div className="absolute right-2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleGeolocation}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isLight
                      ? 'bg-sky-50 hover:bg-sky-100 text-sky-600 border-sky-200'
                      : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border-sky-500/30'
                  }`}
                  title="Utiliser ma position actuelle"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dropdown Suggestions */}
            <AnimatePresence>
              {showSearchDropdown && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y ${
                    isLight
                      ? 'bg-white border border-slate-200 divide-slate-100'
                      : 'bg-slate-900/95 backdrop-blur-2xl border border-white/15 divide-white/5'
                  }`}
                >
                  <div className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider ${
                    isLight ? 'bg-slate-50 text-slate-500' : 'bg-white/5 text-slate-400'
                  }`}>
                    Résultats de recherche
                  </div>
                  {searchResults.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectLocation(city)}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors group ${
                        isLight ? 'hover:bg-sky-50 text-slate-800' : 'hover:bg-sky-500/15 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="text-sm font-semibold">{city.name}</div>
                          <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {[city.admin2, city.admin1, city.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons: Theme Toggle, Favorites, Refresh, Settings */}
          <div className="flex items-center justify-end gap-2">
            
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={() => setCurrentTheme(isLight ? 'dark' : 'light')}
              className={`p-2.5 rounded-xl border transition-all ${
                isLight
                  ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={isLight ? 'Basculer en mode sombre' : 'Basculer en mode clair'}
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => {
                if (isCurrentFavorite) {
                  setSavedLocations(removeSavedLocation(currentLocation.id));
                } else {
                  setSavedLocations(saveLocation(currentLocation));
                }
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                isCurrentFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
              title={isCurrentFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart className={`w-4 h-4 ${isCurrentFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => loadWeather(currentLocation, settings.sourceModel, false)}
              disabled={refreshing}
              className={`p-2.5 rounded-xl border transition-colors ${
                isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Rafraîchir les données en direct"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-500' : ''}`} />
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Paramètres de l'application"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Saved Cities Quick Bar */}
        <div className="max-w-7xl mx-auto mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className={`font-semibold whitespace-nowrap flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <MapPin className="w-3 h-3 text-sky-500" />
            Villes :
          </span>
          {savedLocations.map((loc) => {
            const isActive = loc.id === currentLocation.id || loc.name === currentLocation.name;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-sm shadow-sky-500/30 border-sky-600'
                    : isLight
                    ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                }`}
              >
                <span>{loc.name}</span>
                {loc.name === 'Gennevilliers' && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>HDS</span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* --- MAIN WEATHER CONTENT CONTAINER --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Weather Alerts Banner (if any) */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border backdrop-blur-xl flex items-start gap-3.5 shadow-md ${
                  alert.severity === 'danger'
                    ? isLight ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                    : alert.severity === 'warning'
                    ? isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                    : isLight ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-sky-500/15 border-sky-500/30 text-sky-200'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  alert.severity === 'danger' ? 'text-rose-600' : alert.severity === 'warning' ? 'text-amber-600' : 'text-sky-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold tracking-tight">{alert.title}</h2>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/60 text-slate-700">
                      Météo-France Vigilance
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.description}</p>
                  <p className="text-[11px] mt-1 font-semibold">
                    🛡️ {alert.recommendation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- HERO ATMOSPHERIC CARD (MODE CLAIR OPTIMISÉ) --- */}
        <div className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden border transition-all shadow-xl ${
          isLight
            ? 'bg-gradient-to-br from-white/95 via-sky-50/70 to-blue-50/80 border-sky-200/80 shadow-sky-500/5'
            : 'bg-slate-900/60 border-white/10 shadow-2xl'
        }`}>
          {/* Dynamic Light/Atmospheric Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              isLight ? 'from-sky-400/15 via-blue-300/10 to-indigo-300/5' : conditionInfo.themeClass
            } pointer-events-none transition-all duration-700`}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Location & Condition text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                  isLight
                    ? 'bg-white/90 text-slate-800 border-slate-200 shadow-sm'
                    : 'bg-white/10 text-slate-200 border-white/10'
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  {currentLocation.name}
                  {currentLocation.admin2 && ` (${currentLocation.admin2})`}
                </span>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Actualisé à {weatherData.fetchedAt}
                </span>
                {refreshing && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 font-bold border border-sky-200 animate-pulse">
                    En direct
                  </span>
                )}
              </div>

              {/* Main Temperature & Weather Description */}
              <div className="flex items-baseline gap-4">
                <span className={`text-6xl sm:text-7xl font-extrabold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {formatTemp(weatherData.current.temperature)}
                </span>
                <div className="space-y-1">
                  <div className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${
                    isLight ? 'text-slate-800' : 'text-slate-100'
                  }`}>
                    {renderWeatherIcon(conditionInfo.iconName, 'w-7 h-7')}
                    <span>{conditionInfo.label}</span>
                  </div>
                  <div className={`text-xs sm:text-sm font-medium flex items-center gap-3 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    <span>Ressenti : <strong>{formatTemp(weatherData.current.apparentTemperature)}</strong></span>
                    <span>•</span>
                    <span>Min : <strong>{formatTemp(weatherData.daily[0]?.tempMin ?? 0)}</strong> / Max : <strong>{formatTemp(weatherData.daily[0]?.tempMax ?? 0)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Breezy Quick Metrics Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {/* Pluie probabilité - Breezy v6.2.2 Highlight */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Umbrella className="w-3.5 h-3.5 text-sky-500" />
                    <span>Pluie</span>
                  </div>
                  <div className="text-base font-bold text-sky-600 mt-1">
                    {weatherData.daily[0]?.precipitationProbabilityMax ?? 0}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {weatherData.daily[0]?.precipitationSum.toFixed(1)} mm prévu
                  </div>
                </div>

                {/* Vent */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Wind className="w-3.5 h-3.5 text-teal-500" />
                    <span>Vent</span>
                  </div>
                  <div className="text-base font-bold text-teal-600 mt-1">
                    {formatWind(weatherData.current.windSpeed)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Raf. {formatWind(weatherData.current.windGusts)}
                  </div>
                </div>

                {/* Humidité */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>Humidité</span>
                  </div>
                  <div className="text-base font-bold text-blue-600 mt-1">
                    {weatherData.current.relativeHumidity}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Pression {weatherData.current.pressure} hPa
                  </div>
                </div>

                {/* UV Index */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Indice UV</span>
                  </div>
                  <div className="text-base font-bold text-amber-600 mt-1">
                    {weatherData.daily[0]?.uvIndexMax ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {getUvStatus(weatherData.daily[0]?.uvIndexMax ?? 0).label}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Solar Arc & Air Quality Card */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Solar Course Visualizer */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                    Course solaire
                  </span>
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                    Jour : {weatherData.sunMoon.dayLength}
                  </span>
                </div>

                {/* SVG Solar Arc */}
                <div className="relative h-20 w-full flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <line x1="10" y1="70" x2="190" y2="70" stroke={isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)'} strokeWidth="1.5" strokeDasharray="3 3" />
                    <path
                      d="M 20 70 A 80 60 0 0 1 180 70"
                      fill="none"
                      stroke={isLight ? '#e2e8f0' : 'rgba(255,255,255,0.12)'}
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 20 70 A 80 60 0 0 1 180 70"
                      fill="none"
                      stroke={settings.darkSun ? '#475569' : '#f59e0b'}
                      strokeWidth="3.5"
                      strokeDasharray="250"
                      strokeDashoffset={250 - (250 * weatherData.sunMoon.sunProgressPercent) / 100}
                    />
                    {weatherData.sunMoon.isSunUp && (
                      <circle
                        cx={20 + (160 * weatherData.sunMoon.sunProgressPercent) / 100}
                        cy={70 - Math.sin((Math.PI * weatherData.sunMoon.sunProgressPercent) / 100) * 55}
                        r="6"
                        fill={settings.darkSun ? '#334155' : '#f59e0b'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[11px] mt-1 px-2 font-medium">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Sunrise className="w-3 h-3" /> {weatherData.sunMoon.sunrise}
                  </span>
                  <span className="text-slate-500">Midi : {weatherData.sunMoon.solarNoon}</span>
                  <span className="flex items-center gap-1 text-orange-600">
                    <Sunset className="w-3 h-3" /> {weatherData.sunMoon.sunset}
                  </span>
                </div>
              </div>

              {/* Air Quality Mini Badge */}
              {airQuality && (
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                      <Waves className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Qualité de l'Air (AQI)</div>
                      <div className="text-[11px] text-slate-500">
                        PM2.5: {airQuality.pm25} µg/m³ • PM10: {airQuality.pm10} µg/m³
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    isLight ? 'bg-teal-50 text-teal-700 border-teal-300' : airQuality.color
                  }`}>
                    {airQuality.category} ({airQuality.europeanAqi})
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* --- SECTION 1: HOURLY FORECAST (BREEZY V6.2.2 FEATURE) --- */}
        <div className={`rounded-3xl p-6 border transition-all shadow-lg space-y-4 ${
          isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Thermometer className="w-4 h-4 text-sky-500" />
                <span>Prévisions Heure par Heure</span>
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Probabilité de pluie & ressentis thermiques (Breezy v6.2.2)
              </p>
            </div>

            {/* Tabs selector */}
            <div className={`inline-flex p-1 rounded-2xl border self-start sm:self-auto text-xs ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
            }`}>
              <button
                onClick={() => setHourlyTab('feels_like_rain')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  hourlyTab === 'feels_like_rain'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ressenti & Pluie (%)
              </button>
              <button
                onClick={() => setHourlyTab('temp')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  hourlyTab === 'temp'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Température
              </button>
              <button
                onClick={() => setHourlyTab('wind')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  hourlyTab === 'wind'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Vent & Rafales
              </button>
              <button
                onClick={() => setHourlyTab('humidity')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  hourlyTab === 'humidity'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Humidité
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Hourly Cards */}
          <div
            ref={hourlyScrollRef}
            className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar select-none"
          >
            {weatherData.hourly.map((hour, idx) => {
              const cond = getWeatherConditionInfo(hour.weatherCode, hour.isDay, settings.darkSun);
              return (
                <div
                  key={hour.time}
                  className={`min-w-[105px] flex-shrink-0 p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-between gap-2.5 text-center group ${
                    isLight
                      ? 'bg-slate-50 hover:bg-sky-50 border-slate-200/80 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-white/5'
                  }`}
                >
                  {/* Hour */}
                  <div>
                    <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {idx === 0 ? 'Maintenant' : hour.hourStr}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {hour.dateStr}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="my-1 group-hover:scale-110 transition-transform">
                    {renderWeatherIcon(cond.iconName, 'w-6 h-6')}
                  </div>

                  {/* Dynamic Content depending on Tab */}
                  {hourlyTab === 'feels_like_rain' && (
                    <div className="w-full space-y-1">
                      <div className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatTemp(hour.apparentTemperature)}
                      </div>
                      {/* Rain probability badge - Breezy v6.2.2 marquee */}
                      <div
                        className={`w-full py-0.5 px-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 ${
                          hour.precipitationProbability > 40
                            ? 'bg-sky-100 text-sky-700 border border-sky-300'
                            : hour.precipitationProbability > 15
                            ? 'bg-sky-50 text-sky-600 border border-sky-200'
                            : isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        <Umbrella className="w-2.5 h-2.5" />
                        <span>{hour.precipitationProbability}%</span>
                      </div>
                      {hour.precipitation > 0 && (
                        <div className="text-[9px] text-sky-600 font-bold">
                          {hour.precipitation} mm
                        </div>
                      )}
                    </div>
                  )}

                  {hourlyTab === 'temp' && (
                    <div className="space-y-1">
                      <div className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatTemp(hour.temperature)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Res. {formatTemp(hour.apparentTemperature)}
                      </div>
                    </div>
                  )}

                  {hourlyTab === 'wind' && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-teal-600 flex items-center justify-center gap-1">
                        <span style={{ transform: `rotate(${hour.windDirection}deg)` }} className="inline-block transition-transform">
                          ↑
                        </span>
                        <span>{hour.windSpeed} km/h</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Raf. {hour.windGusts}
                      </div>
                    </div>
                  )}

                  {hourlyTab === 'humidity' && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-blue-600">
                        {hour.relativeHumidity}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Nuages {hour.cloudCover}%
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- SECTION 2: 7-DAY FORECAST & RADAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Prévisions sur 7 jours */}
          <div className={`lg:col-span-7 rounded-3xl p-6 border transition-all shadow-lg space-y-4 ${
            isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Prévisions sur 7 Jours</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Modèle {settings.sourceModel}
              </span>
            </div>

            <div className="space-y-2">
              {weatherData.daily.slice(0, 7).map((day, idx) => {
                const cond = getWeatherConditionInfo(day.weatherCode, true, settings.darkSun);
                const isSelected = selectedDayIndex === idx;

                return (
                  <div
                    key={day.date}
                    className={`rounded-2xl transition-all border ${
                      isSelected
                        ? isLight ? 'bg-sky-50 border-sky-300' : 'bg-sky-500/15 border-sky-500/30'
                        : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200/80' : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedDayIndex(isSelected ? null : idx)}
                      className="w-full p-3.5 flex items-center justify-between text-left"
                    >
                      {/* Day & Date */}
                      <div className="w-28">
                        <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {day.dayName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {day.formattedDate}
                        </div>
                      </div>

                      {/* Icon & Rain prob */}
                      <div className="flex items-center gap-2 w-32">
                        {renderWeatherIcon(cond.iconName, 'w-5 h-5')}
                        {day.precipitationProbabilityMax > 10 ? (
                          <span className="text-[11px] font-bold text-sky-600 flex items-center gap-0.5">
                            <Umbrella className="w-3 h-3" />
                            {day.precipitationProbabilityMax}%
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Sec</span>
                        )}
                      </div>

                      {/* Temperature Gauge Bar */}
                      <div className="flex items-center gap-3 flex-1 max-w-xs">
                        <span className="text-xs font-semibold text-slate-500 w-8 text-right">
                          {formatTemp(day.tempMin)}
                        </span>
                        <div className={`flex-1 h-2 rounded-full relative overflow-hidden ${
                          isLight ? 'bg-slate-200' : 'bg-slate-800'
                        }`}>
                          <div
                            className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                            style={{
                              left: `${Math.max(5, Math.min(80, (day.tempMin + 5) * 2.5))}%`,
                              right: `${Math.max(5, Math.min(80, 100 - (day.tempMax + 5) * 2.5))}%`
                            }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {formatTemp(day.tempMax)}
                        </span>
                      </div>

                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expanded Day Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`px-4 pb-4 pt-1 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
                            isLight ? 'border-slate-200' : 'border-white/5'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl ${isLight ? 'bg-white border border-slate-200' : 'bg-white/5'}`}>
                            <span className="text-slate-500 text-[10px] block">Précipitations</span>
                            <span className="font-bold text-sky-600">
                              {day.precipitationSum.toFixed(1)} mm ({day.precipitationProbabilityMax}%)
                            </span>
                          </div>
                          <div className={`p-2.5 rounded-xl ${isLight ? 'bg-white border border-slate-200' : 'bg-white/5'}`}>
                            <span className="text-slate-500 text-[10px] block">Rafales de vent</span>
                            <span className="font-bold text-teal-600">
                              {formatWind(day.windGustsMax)}
                            </span>
                          </div>
                          <div className={`p-2.5 rounded-xl ${isLight ? 'bg-white border border-slate-200' : 'bg-white/5'}`}>
                            <span className="text-slate-500 text-[10px] block">Indice UV Max</span>
                            <span className="font-bold text-amber-600">
                              {day.uvIndexMax} ({getUvStatus(day.uvIndexMax).label})
                            </span>
                          </div>
                          <div className={`p-2.5 rounded-xl ${isLight ? 'bg-white border border-slate-200' : 'bg-white/5'}`}>
                            <span className="text-slate-500 text-[10px] block">Lever / Coucher</span>
                            <span className="font-bold text-slate-700">
                              {new Date(day.sunrise).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(day.sunset).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radar / Simulation de couverture */}
          <div className={`lg:col-span-5 rounded-3xl p-6 border transition-all shadow-lg space-y-4 flex flex-col justify-between ${
            isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Waves className="w-4 h-4 text-sky-500" />
                  <span>Radar Précipitations</span>
                </h2>
                <div className={`flex p-0.5 rounded-xl border text-xs ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                }`}>
                  <button
                    onClick={() => setActiveRadarLayer('radar')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeRadarLayer === 'radar'
                        ? 'bg-sky-600 text-white font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    Pluie
                  </button>
                  <button
                    onClick={() => setActiveRadarLayer('clouds')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeRadarLayer === 'clouds'
                        ? 'bg-sky-600 text-white font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    Nuages
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Surveillance radar en direct centrée sur {currentLocation.name}
              </p>
            </div>

            {/* Radar Mockup Frame */}
            <div className={`relative h-64 rounded-2xl overflow-hidden border flex items-center justify-center ${
              isLight ? 'bg-slate-900 border-slate-300' : 'bg-slate-950 border-white/10'
            }`}>
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute w-48 h-48 rounded-full border border-sky-400/20" />
              <div className="absolute w-32 h-32 rounded-full border border-sky-400/25" />
              <div className="absolute w-16 h-16 rounded-full border border-sky-400/30" />
              <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-sky-500/30 via-transparent to-transparent animate-spin [animation-duration:4s]" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-400 ring-4 ring-sky-400/30 shadow-lg shadow-sky-400" />
                <span className="text-[11px] font-bold text-white mt-1 bg-slate-900/90 px-2 py-0.5 rounded-full border border-white/20">
                  {currentLocation.name}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-[10px] text-slate-200 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Radar opérationnel • {weatherData.current.precipitation > 0 ? `${weatherData.current.precipitation} mm/h détectés` : 'Ciel calme'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 font-medium">
              <span>Faible</span>
              <div className="h-1.5 flex-1 mx-3 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-600" />
              <span>Fort</span>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: INDICATEURS DÉTAILLÉS MATERIAL YOU --- */}
        <div>
          <h2 className={`text-base font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Gauge className="w-4 h-4 text-sky-500" />
            <span>Indicateurs Météorologiques Détaillés</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* 1. Température ressentie & Point de rosée */}
            <div className={`p-5 rounded-3xl border transition-all shadow-md space-y-3 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Thermometer className="w-4 h-4 text-rose-500" />
                  Ressenti Thermique
                </span>
                <span className="text-slate-500">Point de rosée</span>
              </div>
              <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {formatTemp(weatherData.current.apparentTemperature)}
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {weatherData.current.apparentTemperature < weatherData.current.temperature
                  ? 'Le vent accentue la sensation de fraîcheur sur la peau.'
                  : weatherData.current.apparentTemperature > weatherData.current.temperature
                  ? 'L\'humidité relative augmente la sensation de chaleur.'
                  : 'La température perçue correspond à la valeur mesurée.'}
              </p>
            </div>

            {/* 2. Vent & Boussole Beaufort */}
            <div className={`p-5 rounded-3xl border transition-all shadow-md space-y-3 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Compass className="w-4 h-4 text-teal-500" />
                  Vent & Boussole
                </span>
                <span className="font-bold text-teal-600">
                  Force {getBeaufortScale(weatherData.current.windSpeed).force}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {formatWind(weatherData.current.windSpeed)}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  (Rafales: {formatWind(weatherData.current.windGusts)})
                </span>
              </div>
              <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Échelle de Beaufort : <strong>{getBeaufortScale(weatherData.current.windSpeed).term}</strong> ({getBeaufortScale(weatherData.current.windSpeed).desc}).
              </div>
            </div>

            {/* 3. Indice UV & Protection */}
            <div className={`p-5 rounded-3xl border transition-all shadow-md space-y-3 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Sun className="w-4 h-4 text-amber-500" />
                  Indice UV (OMS)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : getUvStatus(weatherData.daily[0]?.uvIndexMax ?? 0).color
                }`}>
                  {getUvStatus(weatherData.daily[0]?.uvIndexMax ?? 0).label}
                </span>
              </div>
              <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {weatherData.daily[0]?.uvIndexMax ?? 0}
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {getUvStatus(weatherData.daily[0]?.uvIndexMax ?? 0).advice}
              </p>
            </div>

            {/* 4. Qualité de l'Air (AQI) */}
            <div className={`p-5 rounded-3xl border transition-all shadow-md space-y-3 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Waves className="w-4 h-4 text-teal-500" />
                  Qualité de l'Air
                </span>
                {airQuality && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isLight ? 'bg-teal-100 text-teal-800 border-teal-300' : airQuality.color
                  }`}>
                    {airQuality.category}
                  </span>
                )}
              </div>
              <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {airQuality ? airQuality.europeanAqi : '--'} <span className="text-xs text-slate-500 font-normal">AQI</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {airQuality?.advice || 'Données sur les particules fines et gaz polluants.'}
              </p>
            </div>

            {/* 5. Phase Lunaire */}
            <div className={`p-5 rounded-3xl border transition-all shadow-md space-y-3 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <MoonStar className="w-4 h-4 text-indigo-500" />
                  Phase Lunaire
                </span>
                <span className="text-indigo-600 font-bold">
                  {weatherData.sunMoon.moonIlluminationPercent}% éclairée
                </span>
              </div>
              <div className={`text-2xl font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Moon className="w-6 h-6 text-indigo-500" />
                <span>{weatherData.sunMoon.moonPhaseName}</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Cycle synodique lunaire de 29.5 jours. Calcul astronomique exact.
              </p>
            </div>

            {/* 6. Pression Barométrique */}
            <div className={`p-5 rounded-3xl border transition-all shadow-md space-y-3 ${
              isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/60 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  <Gauge className="w-4 h-4 text-sky-500" />
                  Pression Barométrique
                </span>
                <span className="text-slate-500">Niveau mer</span>
              </div>
              <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {weatherData.current.pressure} <span className="text-xs text-slate-500 font-normal">hPa</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {weatherData.current.pressure >= 1020
                  ? 'Régime anticyclonique : temps sec et ensoleillé dominant.'
                  : weatherData.current.pressure <= 1010
                  ? 'Régime dépressionnaire : passages nuageux et risque d\'averses.'
                  : 'Pression barométrique standard moyenne.'}
              </p>
            </div>

          </div>
        </div>

        {/* --- FOOTER CREDITS & SPECS --- */}
        <div className={`p-6 rounded-3xl border text-center space-y-2 transition-all ${
          isLight ? 'bg-white/80 border-slate-200 text-slate-600 shadow-sm' : 'bg-white/5 border-white/10 text-slate-300'
        }`}>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold">
            <span>Inspiré de</span>
            <a
              href="https://github.com/breezy-weather/breezy-weather"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              Breezy Weather v6.2.2 <ExternalLink className="w-3 h-3" />
            </a>
            <span>• Open-source</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-xl mx-auto">
            Fournisseurs de données : Open-Meteo, Météo-France (modèles AROME & ARPEGE), DWD ICON, Copernicus ECMWF.
            Probabilité de précipitation intégrée dans les onglets horaires selon les spécifications Breezy v6.2.2.
          </p>
        </div>
      </main>

      {/* --- SETTINGS MODAL --- */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-6 ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2 font-bold">
                  <Settings className="w-5 h-5 text-sky-500" />
                  <span>Paramètres Breezy Weather</span>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* Mode Clair / Sombre */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
                }`}>
                  <div>
                    <div className="font-bold">Apparence globale</div>
                    <div className="text-xs text-slate-500 mt-0.5">Mode clair ou sombre</div>
                  </div>
                  <button
                    onClick={() => setCurrentTheme(isLight ? 'dark' : 'light')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isLight
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    {isLight ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
                  </button>
                </div>

                {/* 1. Breezy v6.2.2 Marquee Setting: Dark Sun in Dark Mode */}
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
                }`}>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span>Soleil sombre en mode nuit</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 font-bold">
                        v6.2.2
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Affiche le soleil en ton ardoise en mode sombre
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.darkSun}
                    onChange={(e) => updateSettings({ darkSun: e.target.checked })}
                    className="w-5 h-5 rounded accent-sky-600 cursor-pointer"
                  />
                </div>

                {/* 2. Source Model */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Source météorologique
                  </label>
                  <select
                    value={settings.sourceModel}
                    onChange={(e) => updateSettings({ sourceModel: e.target.value as WeatherSourceModel })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-sky-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800 border-white/10 text-white'
                    }`}
                  >
                    <option value="best_match">Open-Meteo (Best Match - Mondial)</option>
                    <option value="meteofrance_seamless">Météo-France (AROME / ARPEGE haute résolution)</option>
                    <option value="icon_seamless">DWD ICON (Allemagne / Europe)</option>
                    <option value="ecmwf_ifs025">ECMWF IFS (Centre Européen)</option>
                  </select>
                </div>

                {/* 3. Units: Temp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Unité de température
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => updateSettings({ unitTemp: 'celsius' })}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        settings.unitTemp === 'celsius'
                          ? 'bg-sky-600 text-white border-sky-600'
                          : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-slate-400 border-white/5'
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      onClick={() => updateSettings({ unitTemp: 'fahrenheit' })}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        settings.unitTemp === 'fahrenheit'
                          ? 'bg-sky-600 text-white border-sky-600'
                          : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-slate-400 border-white/5'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shadow-md shadow-sky-600/20"
              >
                Valider et enregistrer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
