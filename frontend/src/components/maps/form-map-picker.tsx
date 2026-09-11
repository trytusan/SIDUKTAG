import React, { useEffect, useRef, useState } from 'react'

interface MapPickerProps {
  latitude?: string | number | null
  longitude?: string | number | null
  onChange: (coords: { latitude: string; longitude: string }) => void
  label?: string
  height?: number
}

const DEFAULT_VILLAGE_LAT = -8.0781358
const DEFAULT_VILLAGE_LNG = 115.1536173

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

  const parsedLat = Number(latitude)
  const parsedLng = Number(longitude)
  const hasValidInitial = !isNaN(parsedLat) && parsedLat !== 0 && !isNaN(parsedLng) && parsedLng !== 0

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: hasValidInitial ? parsedLat : DEFAULT_VILLAGE_LAT,
    lng: hasValidInitial ? parsedLng : DEFAULT_VILLAGE_LNG,
  })
  const [isLocating, setIsLocating] = useState(false)
  const [gpsMessage, setGpsMessage] = useState<{ text: string; isError: boolean } | null>(null)

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

    const initialLat = hasValidInitial ? parsedLat : DEFAULT_VILLAGE_LAT
    const initialLng = hasValidInitial ? parsedLng : DEFAULT_VILLAGE_LNG

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
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        markerRef.current.setLatLng([lat, lng])
        mapInstanceRef.current.setView([lat, lng], 15)
        setCoords({ lat, lng })
      }
    }
  }, [latitude, longitude])

  const handleGetCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsMessage({ text: 'Peramban web tidak mendukung fitur geolokasi GPS.', isError: true })
      return
    }

    setIsLocating(true)
    setGpsMessage(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([lat, lng])
          mapInstanceRef.current.setView([lat, lng], 17, { animate: true })
        }
        setCoords({ lat, lng })
        onChange({
          latitude: lat.toFixed(7),
          longitude: lng.toFixed(7),
        })
        const accuracy = Math.round(pos.coords.accuracy)
        setGpsMessage({
          text: `Titik GPS berhasil disetel ke posisi Anda saat ini (Akurasi: ±${accuracy}m).`,
          isError: false,
        })
        setTimeout(() => setGpsMessage(null), 5000)
      },
      (err) => {
        setIsLocating(false)
        let text = 'Gagal mendeteksi lokasi GPS Anda.'
        if (err.code === 1) text = 'Akses lokasi ditolak. Mohon aktifkan izin GPS di peramban Anda.'
        else if (err.code === 2) text = 'Sinyal lokasi GPS perangkat tidak tersedia.'
        else if (err.code === 3) text = 'Permintaan deteksi GPS melebihi batas waktu (timeout).'
        setGpsMessage({ text, isError: true })
        setTimeout(() => setGpsMessage(null), 6000)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleResetToVillageCenter = () => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([DEFAULT_VILLAGE_LAT, DEFAULT_VILLAGE_LNG])
      mapInstanceRef.current.setView([DEFAULT_VILLAGE_LAT, DEFAULT_VILLAGE_LNG], 15, { animate: true })
    }
    setCoords({ lat: DEFAULT_VILLAGE_LAT, lng: DEFAULT_VILLAGE_LNG })
    onChange({
      latitude: DEFAULT_VILLAGE_LAT.toFixed(7),
      longitude: DEFAULT_VILLAGE_LNG.toFixed(7),
    })
    setGpsMessage({ text: 'Marker dikembalikan ke pusat Banjar Dinas Dauh Munduk, Desa Bungkulan.', isError: false })
    setTimeout(() => setGpsMessage(null), 4000)
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToVillageCenter}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition"
            title="Arahkan kembali ke pusat wilayah desa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Pusat Desa</span>
          </button>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50"
          >
            {isLocating ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Mendeteksi GPS...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Gunakan Lokasi GPS Saya</span>
              </>
            )}
          </button>
        </div>
      </div>

      {gpsMessage && (
        <div
          className={`rounded-xl px-3 py-2 text-xs flex items-center gap-2 transition ${
            gpsMessage.isError
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <span>{gpsMessage.isError ? '⚠️' : '✓'}</span>
          <span>{gpsMessage.text}</span>
        </div>
      )}

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
      <p className="text-xs text-slate-400">
        Klik pada peta atau geser marker untuk menyesuaikan lokasi rumah secara presisi.
      </p>
    </div>
  )
}
