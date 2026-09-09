import React, { useEffect, useRef, useState } from 'react'

export interface WargaMarker {
  id: number
  latitude: number
  longitude: number
  label?: string
  tipe?: string
  is_private?: boolean
}

export interface TempatUmum {
  id: number
  nama: string
  jenis: string
  kode?: string
  kepala?: string
  nomor_telepon?: string | null
  jumlah_kk?: number
  jumlah_penduduk?: number
  luas_wilayah?: number | null
  latitude: number
  longitude: number
  deskripsi?: string | null
  warna_marker?: string
}

interface PetaWargaViewProps {
  wargaMarkers: WargaMarker[]
  tempatUmum: TempatUmum[]
  height?: number | string
  selectedTempatId?: number | null
  onSelectTempat?: (tempat: TempatUmum) => void
}

export default function PetaWargaView({
  wargaMarkers = [],
  tempatUmum = [],
  height = 580,
  selectedTempatId,
  onSelectTempat,
}: PetaWargaViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const wargaMarkersRef = useRef<{ [id: number]: any }>({})
  const tempatMarkersRef = useRef<{ [id: number]: any }>({})

  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm')
  const [showWarga, setShowWarga] = useState(true)
  const [showTempatUmum, setShowTempatUmum] = useState(true)

  // Default coordinate center (Desa Bungkulan, Sawan, Buleleng, Bali)
  const defaultCenter: [number, number] = [-8.0781358, 115.1536173]

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return
    const L = require('leaflet')

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView(defaultCenter, 14)

      L.control.zoom({ position: 'topright' }).addTo(map)

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      })

      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
          maxZoom: 18,
        }
      )

      osmLayer.addTo(map)

      mapInstanceRef.current = {
        map,
        osmLayer,
        satelliteLayer,
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.map.remove()
        mapInstanceRef.current = null
        wargaMarkersRef.current = {}
        tempatMarkersRef.current = {}
      }
    }
  }, [])

  // Switch Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const { map, osmLayer, satelliteLayer } = mapInstanceRef.current
    if (activeLayer === 'satellite') {
      map.removeLayer(osmLayer)
      satelliteLayer.addTo(map)
    } else {
      map.removeLayer(satelliteLayer)
      osmLayer.addTo(map)
    }
  }, [activeLayer])

  // Render & Update Markers
  useEffect(() => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return
    const L = require('leaflet')
    const { map } = mapInstanceRef.current

    // 1. Clear old markers
    Object.values(wargaMarkersRef.current).forEach((m: any) => m.remove())
    wargaMarkersRef.current = {}
    Object.values(tempatMarkersRef.current).forEach((m: any) => m.remove())
    tempatMarkersRef.current = {}

    const bounds = L.latLngBounds([])

    // 2. Render Warga Markers (Anonymized & Non-interactive private markers)
    if (showWarga) {
      wargaMarkers.forEach((w) => {
        const lat = Number(w.latitude)
        const lng = Number(w.longitude)
        if (isNaN(lat) || isNaN(lng)) return

        // Modern amber circle with house icon for residential home
        const citizenIcon = L.divIcon({
          className: 'citizen-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: default;" title="Titik Pemukiman Warga (Privat)">
              <div style="background-color: #f59e0b; color: white; width: 28px; height: 28px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(245, 158, 11, 0.4); border: 2px solid white;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 15px; height: 15px;" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        })

        // Simple non-identifying popup
        const citizenPopup = `
          <div style="font-family: Inter, sans-serif; padding: 4px; text-align: center; min-width: 170px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 9999px;">
              Pemukiman Warga
            </span>
            <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-top: 6px;">
              Titik Rumah Penduduk
            </div>
            <p style="font-size: 10px; color: #64748b; margin: 4px 0 0 0; line-height: 1.3;">
              Lokasi pemukiman warga.<br>Data pribadi dilindungi privasi.
            </p>
          </div>
        `

        const marker = L.marker([lat, lng], { icon: citizenIcon }).addTo(map)
        marker.bindPopup(citizenPopup)
        wargaMarkersRef.current[w.id] = marker
        bounds.extend([lat, lng])
      })
    }

    // Filter out Dusun from Tempat Umum
    const filteredTempatUmum = tempatUmum.filter((item) => {
      if (item.jenis?.toLowerCase() === 'dusun' || item.jenis?.toLowerCase().includes('dusun')) {
        return false
      }
      return true
    })

    // 3. Render Tempat Umum (Public Places - ACCESSIBLE with rich info)
    if (showTempatUmum) {
      filteredTempatUmum.forEach((item) => {
        const lat = Number(item.latitude)
        const lng = Number(item.longitude)
        if (isNaN(lat) || isNaN(lng)) return

        const pinColor = item.warna_marker || '#10b981'

        // Landmark/Building pin
        const publicIcon = L.divIcon({
          className: 'public-place-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background-color: ${pinColor}; color: white; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 2.5px solid white;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 22px; height: 22px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid ${pinColor};"></div>
            </div>
          `,
          iconSize: [38, 46],
          iconAnchor: [19, 46],
          popupAnchor: [0, -44],
        })

        const publicPopup = `
          <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 230px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 9999px;">
                ${item.jenis || 'Tempat Umum'} ${item.kode ? `&bull; ${item.kode}` : ''}
              </span>
              <span style="font-size: 9px; font-weight: 600; color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 9999px;">
                Fasilitas Publik
              </span>
            </div>
            <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
              ${item.nama}
            </h4>
            <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
              ${item.deskripsi || 'Tempat fasilitas umum dan pelayanan masyarakat.'}
            </p>
            ${
              item.kepala || item.nomor_telepon
                ? `
              <div style="background: #f8fafc; border-radius: 8px; padding: 7px 9px; font-size: 11px; color: #334155; margin-bottom: 8px; border: 1px solid #e2e8f0;">
                ${item.kepala ? `<div><strong>Penanggung Jawab:</strong> ${item.kepala}</div>` : ''}
                ${item.nomor_telepon ? `<div><strong>Kontak:</strong> ${item.nomor_telepon}</div>` : ''}
              </div>
            `
                : ''
            }
            <div style="display: flex; gap: 6px;">
              <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #10b981; color: white; font-weight: 700; font-size: 11px; padding: 6px 10px; border-radius: 8px; text-decoration: none;">
                Petunjuk Arah &rarr;
              </a>
            </div>
          </div>
        `

        const marker = L.marker([lat, lng], { icon: publicIcon }).addTo(map)
        marker.bindPopup(publicPopup)

        marker.on('click', () => {
          if (onSelectTempat) onSelectTempat(item)
        })

        tempatMarkersRef.current[item.id] = marker
        bounds.extend([lat, lng])
      })
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
    }
  }, [wargaMarkers, tempatUmum, showWarga, showTempatUmum])

  // Focus on selected tempat umum if triggered
  useEffect(() => {
    if (!selectedTempatId || !mapInstanceRef.current || !tempatMarkersRef.current[selectedTempatId]) return
    const { map } = mapInstanceRef.current
    const target = tempatUmum.find((t) => t.id === selectedTempatId)
    if (target) {
      const lat = Number(target.latitude)
      const lng = Number(target.longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 17, { animate: true })
        tempatMarkersRef.current[selectedTempatId]?.openPopup()
      }
    }
  }, [selectedTempatId, tempatUmum])

  const handleReset = () => {
    if (!mapInstanceRef.current) return
    const { map } = mapInstanceRef.current
    map.setView(defaultCenter, 14, { animate: true })
  }

  return (
    <div className="relative rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      {/* Floating Header Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 max-w-[90%]">
        {/* Layer Switcher */}
        <div className="inline-flex rounded-2xl bg-white/95 p-1 shadow-lg backdrop-blur-md border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveLayer('osm')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeLayer === 'osm'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Peta Jalan
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeLayer === 'satellite'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satelit
          </button>
        </div>

        {/* Filter Toggle: Tempat Umum */}
        <button
          type="button"
          onClick={() => setShowTempatUmum(!showTempatUmum)}
          className={`rounded-2xl px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md border transition flex items-center gap-1.5 ${
            showTempatUmum
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white/90 border-slate-200 text-slate-400'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              showTempatUmum ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          />
          <span>Tempat Umum ({tempatUmum.filter((item) => !(item.jenis?.toLowerCase() === 'dusun' || item.jenis?.toLowerCase().includes('dusun'))).length})</span>
        </button>

        {/* Filter Toggle: Pemukiman Warga */}
        <button
          type="button"
          onClick={() => setShowWarga(!showWarga)}
          className={`rounded-2xl px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md border transition flex items-center gap-1.5 ${
            showWarga
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-white/90 border-slate-200 text-slate-400'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              showWarga ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          />
          <span>Sebaran Warga ({wargaMarkers.length})</span>
        </button>

        {/* Reset View */}
        <button
          type="button"
          onClick={handleReset}
          className="rounded-2xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-md border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1"
          title="Kembalikan posisi tengah"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
          </svg>
          <span className="hidden sm:inline">Pusat</span>
        </button>
      </div>

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-md bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">
            P
          </div>
          <span className="text-slate-700 font-semibold">Tempat Umum</span>
          <span className="text-[10px] text-emerald-600 font-medium">(Bisa Diakses)</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-[9px] font-bold">
            W
          </div>
          <span className="text-slate-700 font-semibold">Pemukiman Warga</span>
          <span className="text-[10px] text-amber-600 font-medium">(Privat / Marker Saja)</span>
        </div>
      </div>

      {/* The Leaflet Canvas */}
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full h-full min-h-[480px] z-0"
      />
    </div>
  )
}

