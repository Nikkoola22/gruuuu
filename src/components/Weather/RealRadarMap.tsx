import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Play, Pause, RotateCcw, CloudRain, RefreshCw, Radio, Plus, Minus, Crosshair, CloudLightning } from 'lucide-react';
import { WeatherLocation } from '../../utils/Weather/types';

interface RadarFrame {
  time: number;
  path: string;
}

interface RainViewerApiResponse {
  host: string;
  radar?: {
    past?: RadarFrame[];
    nowcast?: RadarFrame[];
  };
}

interface RealRadarMapProps {
  location: WeatherLocation;
  isLight: boolean;
  precipitationRate?: number;
}

// Contrôleur interne de la carte Leaflet
function MapController({ 
  center, 
  zoom 
}: { 
  center: [number, number]; 
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), { duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

// Contrôles de zoom personnalisés pour éviter tout chevauchement d'UI
function CustomZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1.5 shadow-lg">
      <button
        onClick={() => map.zoomIn()}
        className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-95"
        title="Zoom avant"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-95"
        title="Zoom arrière"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

// Marqueur personnalisé Leaflet sans dépendance aux assets png externes
const createPinIcon = (cityName: string) => {
  return L.divIcon({
    className: 'custom-weather-radar-pin',
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
        <div style="background:rgba(15,23,42,0.9);backdrop-filter:blur(4px);color:#ffffff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:9999px;white-space:nowrap;border:1px solid rgba(255,255,255,0.3);box-shadow:0 2px 6px rgba(0,0,0,0.35);margin-bottom:4px;">
          ${cityName}
        </div>
        <div style="width:14px;height:14px;background:#0284c7;border:2.5px solid #ffffff;border-radius:50%;box-shadow:0 0 12px #38bdf8;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

export const RealRadarMap: React.FC<RealRadarMapProps> = ({ location, isLight, precipitationRate = 0 }) => {
  const [frames, setFrames] = useState<RadarFrame[]>([]);
  const [host, setHost] = useState<string>('https://tilecache.rainviewer.com');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [radarColor] = useState<number>(2); // 2: Universal Blue (standard météo)
  const [mapTarget, setMapTarget] = useState<{ center: [number, number]; zoom: number }>({
    center: [location.latitude, location.longitude],
    zoom: 7
  });
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchroniser le centre de la carte quand la ville sélectionnée change
  useEffect(() => {
    setMapTarget({
      center: [location.latitude, location.longitude],
      zoom: 7
    });
  }, [location.latitude, location.longitude]);

  const fetchRadarData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      if (!res.ok) throw new Error('Échec du chargement du radar RainViewer');
      const data: RainViewerApiResponse = await res.json();
      
      const pastFrames = data.radar?.past || [];
      const nowcastFrames = data.radar?.nowcast || [];
      const allFrames = [...pastFrames, ...nowcastFrames];

      if (allFrames.length > 0) {
        setHost(data.host || 'https://tilecache.rainviewer.com');
        setFrames(allFrames);
        const defaultIndex = pastFrames.length > 0 ? pastFrames.length - 1 : allFrames.length - 1;
        setCurrentIndex(defaultIndex);
      } else {
        throw new Error('Aucune image radar reçue');
      }
    } catch (err) {
      console.warn('Erreur chargement RainViewer API:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRadarData();
  }, []);

  // Animation de boucle temporelle
  useEffect(() => {
    if (isPlaying && frames.length > 1) {
      animIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % frames.length);
      }, 700);
    } else {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    }
    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [isPlaying, frames.length]);

  const currentFrame = frames[currentIndex];
  const radarTileUrl = currentFrame
    ? `${host}${currentFrame.path}/256/{z}/{x}/{y}/${radarColor}/1_1.png`
    : null;

  const formatFrameTime = (timestamp?: number) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatRelativeTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const diffSec = Math.floor((Date.now() - timestamp * 1000) / 1000);
    const diffMin = Math.round(diffSec / 60);

    if (diffMin > 0) {
      return diffMin <= 5 ? 'En direct' : `Il y a ${diffMin} min`;
    } else if (diffMin < 0) {
      return `Prévision +${Math.abs(diffMin)} min`;
    }
    return 'En direct';
  };

  return (
    <div className="space-y-3">
      {/* Cadre de la carte radar */}
      <div className={`relative h-80 sm:h-96 rounded-2xl overflow-hidden border isolate z-0 shadow-inner ${
        isLight ? 'border-slate-300 bg-slate-100' : 'border-white/10 bg-slate-950'
      }`}>
        <MapContainer
          key={`radar-map-${location.name}-${isLight ? 'light' : 'dark'}`}
          center={mapTarget.center}
          zoom={mapTarget.zoom}
          minZoom={4}
          maxZoom={12}
          zoomControl={false}
          scrollWheelZoom={true}
          className={`w-full h-full ${!isLight ? 'radar-dark-theme' : ''}`}
          attributionControl={false}
        >
          <MapController center={mapTarget.center} zoom={mapTarget.zoom} />
          
          {/* Couche de base OpenStreetMap pure (sans clé API) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains="abc"
            maxZoom={19}
            maxNativeZoom={19}
          />

          {/* Couche météo radar temps réel RainViewer (maxNativeZoom 12) */}
          {radarTileUrl && (
            <TileLayer
              key={`radar-layer-${currentFrame.path}`}
              url={radarTileUrl}
              opacity={0.8}
              zIndex={500}
              maxZoom={18}
              maxNativeZoom={12}
            />
          )}

          {/* Marqueur de la ville actuelle */}
          <Marker
            position={[location.latitude, location.longitude]}
            icon={createPinIcon(location.name)}
          >
            <Popup>
              <div className="text-xs font-sans">
                <strong>{location.name}</strong>
                <br />
                {precipitationRate > 0
                  ? `Précipitations locales : ${precipitationRate} mm/h`
                  : 'Ciel sec (aucun écho pluvieux détecté sur la ville)'}
              </div>
            </Popup>
          </Marker>

          {/* Contrôles de zoom Leaflet */}
          <CustomZoomControls />
        </MapContainer>

        {/* Badge d'état en direct dans le coin supérieur gauche */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs shadow-lg max-w-[85%]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            Radar Pluie Réel
          </span>
          <span className="text-slate-400 text-[11px]">•</span>
          <span className="text-sky-300 font-bold text-[11px]">
            {formatRelativeTime(currentFrame?.time)} ({formatFrameTime(currentFrame?.time)})
          </span>
        </div>

        {/* Boutons d'action rapide dans le coin supérieur droit */}
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5">
          {/* Bouton pour observer la perturbation pluvieuse active */}
          <button
            onClick={() => setMapTarget({ center: [50.2, 1.5], zoom: 6 })}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-sky-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-semibold flex items-center gap-1 shadow-lg"
            title="Observer les perturbations pluvieuses actives sur le nord de la France / Manche"
          >
            <CloudLightning className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Perturbation active</span>
          </button>

          {/* Bouton Recentrer sur la ville */}
          <button
            onClick={() => setMapTarget({ center: [location.latitude, location.longitude], zoom: 7 })}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-white hover:bg-slate-800 transition-all text-xs flex items-center justify-center shadow-lg"
            title={`Recentrer sur ${location.name}`}
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          {/* Bouton rafraîchir */}
          <button
            onClick={fetchRadarData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-white hover:bg-slate-800 transition-all text-xs flex items-center justify-center shadow-lg disabled:opacity-50"
            title="Rafraîchir les scans radar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* En cas d'erreur réseau */}
        {hasError && (
          <div className="absolute inset-0 z-[1001] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white">
            <CloudRain className="w-8 h-8 text-sky-400 mb-2" />
            <p className="text-xs font-semibold">Flux radar temporairement indisponible</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              La carte géographique reste opérationnelle.
            </p>
            <button
              onClick={fetchRadarData}
              className="mt-3 px-3 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold transition-all"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>

      {/* Barre d'explication dynamique */}
      <div className={`p-2.5 px-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
        isLight ? 'bg-sky-50/70 border-sky-200 text-sky-950' : 'bg-sky-950/30 border-sky-800/40 text-sky-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <CloudRain className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
          <span>
            {precipitationRate > 0
              ? `Pluie détectée sur ${location.name} (${precipitationRate} mm/h).`
              : `Ciel sec actuellement sur ${location.name} (échos radar transparents). Cliquez sur « Perturbation active » ou dézoomez pour voir les fronts pluvieux.`}
          </span>
        </span>
      </div>

      {/* Barre de contrôle d'animation temporelle */}
      {frames.length > 0 && !hasError && (
        <div className={`p-2.5 rounded-2xl border flex flex-wrap items-center gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
        }`}>
          {/* Bouton Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all flex items-center justify-center shadow-sm active:scale-95"
            title={isPlaying ? 'Mettre en pause' : 'Lancer l’animation radar'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          {/* Bouton Reset au direct */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentIndex(frames.length - 1);
            }}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              isLight ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-200'
            }`}
            title="Revenir au scan le plus récent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Slider temporel */}
          <div className="flex-1 min-w-[140px] flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={frames.length - 1}
              value={currentIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentIndex(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Étiquette heure du scan */}
          <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-24 text-right">
            {formatFrameTime(currentFrame?.time)}
          </div>
        </div>
      )}

      {/* Échelle d'intensité radar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 font-medium">
        <span>Faible (bruine)</span>
        <div className="h-2 flex-1 mx-3 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 via-red-500 to-purple-700 shadow-sm" />
        <span>Intense (orage / grêle)</span>
      </div>
    </div>
  );
};
