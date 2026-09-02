import React, { useEffect, useRef } from 'react'

interface MapPreviewProps {
  latitude: string | number
  longitude: string | number
  title?: string
  height?: number
}

export default function MapPreview({
  latitude,
  longitude,
  title,
  height = 240,
}: MapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  const lat = Number(latitude)
  const lng = Number(longitude)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || isNaN(lat) || isNaN(lng)) return

    const L = require('leaflet')

    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
    L.Marker.prototype.options.icon = defaultIcon

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      }).setView([lat, lng], 16)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([lat, lng]).addTo(map)
      if (title) {
        marker.bindPopup(`<b>${title}</b>`).openPopup()
      }

      mapInstanceRef.current = map
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, title])

  if (isNaN(lat) || isNaN(lng) || !latitude || !longitude) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 p-6 text-xs text-slate-400">
        Titik koordinat belum ditentukan.
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full rounded-2xl border border-slate-200 overflow-hidden shadow-sm z-0"
      />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Koordinat: {lat.toFixed(6)}, {lng.toFixed(6)}
        </span>
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Buka di Google Maps &rarr;
        </a>
      </div>
    </div>
  )
}
