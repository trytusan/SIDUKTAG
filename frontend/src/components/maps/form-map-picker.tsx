import React, { useEffect, useRef, useState } from 'react'

interface MapPickerProps {
  latitude?: string | number | null
  longitude?: string | number | null
  onChange: (coords: { latitude: string; longitude: string }) => void
  label?: string
  height?: number
}

export default function FormMapPicker({
  latitude,
  longitude,
  onChange,
  label = 'Pilih Titik Lokasi Rumah (Geotagging)',
  height = 360,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: Number(latitude) || -6.2088,
    lng: Number(longitude) || 106.8456,
  })

  // Initialize Leaflet Map on Client Side
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    // Dynamically require leaflet on client side
    const L = require('leaflet')

    // Fix default icon issue in Leaflet with webpack/next
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

    const initialLat = Number(latitude) || -6.2088
    const initialLng = Number(longitude) || 106.8456

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
      }).addTo(map)

      marker.on('dragend', function () {
        const position = marker.getLatLng()
        setCoords({ lat: position.lat, lng: position.lng })
        onChange({
          latitude: position.lat.toFixed(7),
          longitude: position.lng.toFixed(7),
        })
      })

      map.on('click', function (e: any) {
        marker.setLatLng(e.latlng)
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng })
        onChange({
          latitude: e.latlng.lat.toFixed(7),
          longitude: e.latlng.lng.toFixed(7),
        })
      })

      mapInstanceRef.current = map
      markerRef.current = marker
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Sync external coordinates if changed
  useEffect(() => {
    if (latitude && longitude && markerRef.current && mapInstanceRef.current) {
      const lat = Number(latitude)
      const lng = Number(longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        markerRef.current.setLatLng([lat, lng])
        mapInstanceRef.current.setView([lat, lng], 15)
        setCoords({ lat, lng })
      }
    }
  }, [latitude, longitude])

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          if (markerRef.current && mapInstanceRef.current) {
            markerRef.current.setLatLng([lat, lng])
            mapInstanceRef.current.setView([lat, lng], 16)
          }
          setCoords({ lat, lng })
          onChange({
            latitude: lat.toFixed(7),
            longitude: lng.toFixed(7),
          })
        },
        () => {
          alert('Gagal mendeteksi lokasi GPS Anda.')
        }
      )
    }
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Gunakan Lokasi Saat Ini (GPS)</span>
        </button>
      </div>

      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full rounded-2xl border border-slate-200 overflow-hidden shadow-sm z-0"
      />

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Latitude:</span>{' '}
          {coords.lat.toFixed(7)}
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Longitude:</span>{' '}
          {coords.lng.toFixed(7)}
        </div>
      </div>
      <p className="text-xs text-slate-400">Klik pada peta atau geser marker untuk menyesuaikan lokasi rumah.</p>
    </div>
  )
}
