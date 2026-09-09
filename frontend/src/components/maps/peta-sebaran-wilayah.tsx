import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { KkMarker, Wilayah } from '../../types'

interface PetaSebaranWilayahProps {
  kkMarkers?: KkMarker[]
  wilayahList?: Wilayah[]
  height?: number | string
  selectedId?: string | number | null
  onSelectMarker?: (marker: any) => void
}

export default function PetaSebaranWilayah({
  kkMarkers = [],
  wilayahList = [],
  height = 580,
  selectedId,
  onSelectMarker,
}: PetaSebaranWilayahProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<{ [id: string]: any }>({})
  const polylineRef = useRef<any>(null)

  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm')
  const [filterKategori, setFilterKategori] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFamilyLines, setShowFamilyLines] = useState<boolean>(true)
  const [activeKkId, setActiveKkId] = useState<string | null>(null)

  // Center around Desa Bungkulan, Sawan, Buleleng, Bali
  const defaultCenter: [number, number] = [-8.0781358, 115.1536173]

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    const L = require('leaflet')

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView(defaultCenter, 14)

      L.control.zoom({ position: 'topright' }).addTo(map)

      // Base tile layer
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

      // Delegate event listener for popup fly-to buttons
      map.on('popupopen', (e: any) => {
        const popupNode = e.popup?.getElement()
        if (!popupNode) return

        const focusButtons = popupNode.querySelectorAll('.btn-fly-to-member')
        focusButtons.forEach((btn: any) => {
          btn.onclick = (event: MouseEvent) => {
            event.preventDefault()
            const targetLat = parseFloat(btn.getAttribute('data-lat'))
            const targetLng = parseFloat(btn.getAttribute('data-lng'))
            const targetId = btn.getAttribute('data-target-id')

            if (!isNaN(targetLat) && !isNaN(targetLng)) {
              map.flyTo([targetLat, targetLng], 17, { duration: 1.2 })
              setTimeout(() => {
                if (targetId && markersRef.current[targetId]) {
                  markersRef.current[targetId].openPopup()
                }
              }, 600)
            }
          }
        })
      })

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
        markersRef.current = {}
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

  // Filter markers based on category and search query
  const filteredKkMarkers = kkMarkers.filter((kk) => {
    // Filter kategori
    if (filterKategori === 'satu_atap' && kk.is_split) return false
    if (filterKategori === 'terpencar' && !kk.is_split) return false
    if (filterKategori === 'tempat_umum') return false

    // Filter pencarian
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const matchKK = kk.nomor_kk.toLowerCase().includes(q)
    const matchKepala = kk.nama_kepala_keluarga.toLowerCase().includes(q)
    const matchAlamat = (kk.alamat_lokasi || '').toLowerCase().includes(q)
    const matchAnggota = kk.anggota_di_lokasi.some(
      (a) => a.nama_lengkap.toLowerCase().includes(q) || a.nik.includes(q)
    )
    return matchKK || matchKepala || matchAlamat || matchAnggota
  })

  const filteredWilayah = wilayahList.filter((w) => {
    if (w.jenis_wilayah?.toLowerCase() === 'dusun' || w.jenis_wilayah?.toLowerCase().includes('dusun')) {
      return false
    }
    if (filterKategori === 'satu_atap' || filterKategori === 'terpencar') return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      w.nama_wilayah.toLowerCase().includes(q) ||
      w.kode_wilayah.toLowerCase().includes(q) ||
      (w.kepala_wilayah && w.kepala_wilayah.toLowerCase().includes(q))
    )
  })

  // Function to draw connecting lines between separated members of the same KK
  const updateFamilyPolyline = (kkMarker: KkMarker | null) => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return
    const L = require('leaflet')
    const { map } = mapInstanceRef.current

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
      polylineRef.current = null
    }

    if (!kkMarker || !kkMarker.is_split || !showFamilyLines) return

    // Find all markers belonging to this same nomor_kk
    const siblingMarkers = kkMarkers.filter((m) => m.nomor_kk === kkMarker.nomor_kk)
    if (siblingMarkers.length <= 1) return

    const latLngs = siblingMarkers.map((m) => [m.latitude, m.longitude])

    // Create polyline connecting all family residences
    const polyline = L.polyline(latLngs, {
      color: '#6366f1', // Indigo
      weight: 3,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round',
    }).addTo(map)

    polylineRef.current = polyline
  }

  // Render Markers on Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapInstanceRef.current) return
    const L = require('leaflet')
    const { map } = mapInstanceRef.current

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker: any) => marker.remove())
    markersRef.current = {}

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
      polylineRef.current = null
    }

    const bounds = L.latLngBounds([])

    // 1. Render Kartu Keluarga Markers
    filteredKkMarkers.forEach((item) => {
      const lat = Number(item.latitude)
      const lng = Number(item.longitude)
      if (isNaN(lat) || isNaN(lng)) return

      // Determine Pin Icon & Color
      let pinColor = '#10b981' // Green for Satu Atap
      let pinIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
        </svg>
      `
      let badgeLabel = 'Satu Atap'

      if (item.is_split) {
        if (item.is_kepala_keluarga_here) {
          pinColor = '#2563eb' // Blue for Head of Family location in split KK
          badgeLabel = 'KK Utama'
          pinIconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          `
        } else {
          pinColor = '#f59e0b' // Amber/Orange for Separated Member location
          badgeLabel = 'Beda Lokasi'
          pinIconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          `
        }
      }

      const customIcon = L.divIcon({
        className: 'custom-kk-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background-color: ${pinColor}; color: white; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px rgba(0,0,0,0.3); border: 2.5px solid white;">
              ${pinIconSvg}
            </div>
            <div style="position: absolute; top: -6px; right: -6px; background: #0f172a; color: white; font-size: 10px; font-weight: 800; width: 18px; height: 18px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
              ${item.jumlah_anggota_di_lokasi}
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${pinColor};"></div>
          </div>
        `,
        iconSize: [38, 46],
        iconAnchor: [19, 46],
        popupAnchor: [0, -44],
      })

      // Generate HTML for Residents at this location
      const anggotaHereHtml = item.anggota_di_lokasi
        .map(
          (a) => `
          <li style="display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 5px 0; border-bottom: 1px dashed #e2e8f0;">
            <div>
              <div style="font-weight: 700; color: #0f172a; font-size: 11px;">${a.nama_lengkap}</div>
              <div style="font-size: 10px; color: #64748b;">NIK: ${a.nik}</div>
            </div>
            <span style="font-size: 9px; font-weight: 700; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 6px; white-space: nowrap;">
              ${a.status_dalam_keluarga}
            </span>
          </li>
        `
        )
        .join('')

      // Generate HTML for Other Residents of this KK living elsewhere
      let anggotaLainHtml = ''
      if (item.is_split && item.anggota_lokasi_lain.length > 0) {
        const otherItems = item.anggota_lokasi_lain
          .map((oa) => {
            const targetMarker = kkMarkers.find((m) =>
              m.anggota_di_lokasi.some((mem) => mem.id === oa.id)
            )
            const targetMarkerId = targetMarker ? targetMarker.id : ''

            return `
            <div style="background: #fff; border: 1px solid #fed7aa; border-radius: 8px; padding: 6px; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 700; color: #9a3412; font-size: 11px;">${oa.nama_lengkap}</span>
                <span style="font-size: 9px; background: #ffedd5; color: #c2410c; padding: 1px 5px; border-radius: 4px; font-weight: 600;">
                  ${oa.status_dalam_keluarga}
                </span>
              </div>
              <div style="font-size: 10px; color: #78350f; margin-bottom: 5px; line-height: 1.3;">
                📍 ${oa.alamat_lokasi_ini || oa.alamat || 'Lokasi terpisah'}
              </div>
              <button 
                type="button" 
                class="btn-fly-to-member" 
                data-lat="${oa.latitude}" 
                data-lng="${oa.longitude}" 
                data-target-id="${targetMarkerId}"
                style="width: 100%; background: #ea580c; color: white; font-size: 10px; font-weight: 700; padding: 4px 6px; border-radius: 6px; border: none; cursor: pointer; text-align: center;"
              >
                Fokus ke Lokasi Ini &rarr;
              </button>
            </div>
          `
          })
          .join('')

        anggotaLainHtml = `
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #fed7aa; background: #fffaf5; margin-left: -8px; margin-right: -8px; margin-bottom: -4px; padding-left: 8px; padding-right: 8px; border-radius: 0 0 8px 8px;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 6px;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #ea580c;"></span>
              <strong style="font-size: 10px; color: #9a3412; text-transform: uppercase;">
                Anggota 1 KK Tinggal Terpisah (${item.anggota_lokasi_lain.length} Orang):
              </strong>
            </div>
            ${otherItems}
          </div>
        `
      }

      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 250px; max-width: 320px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: ${
              item.is_split ? (item.is_kepala_keluarga_here ? '#dbeafe' : '#fef3c7') : '#dcfce7'
            }; color: ${
              item.is_split ? (item.is_kepala_keluarga_here ? '#1e40af' : '#b45309') : '#15803d'
            }; padding: 2px 8px; border-radius: 9999px;">
              ${item.is_split ? (item.is_kepala_keluarga_here ? '🔵 KK Utama (Terpencar)' : '🟠 Cabang KK Terpisah') : '🟢 1 KK Satu Atap'}
            </span>
            <span style="font-size: 10px; color: #64748b; font-weight: 600;">
              ${item.jumlah_anggota_di_lokasi}/${item.total_anggota_kk} Jiwa
            </span>
          </div>

          <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">
            Keluarga: ${item.nama_kepala_keluarga}
          </h4>
          <div style="font-size: 10px; color: #475569; margin-bottom: 6px; font-weight: 600;">
            No. KK: <span style="font-family: monospace; color: #0f172a;">${item.nomor_kk}</span>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 6px 8px; font-size: 10px; color: #334155; margin-bottom: 8px; border: 1px solid #e2e8f0; line-height: 1.4;">
            <strong>Alamat Titik Ini:</strong> ${item.alamat_lokasi || item.alamat_keluarga || '-'}
          </div>

          <div style="margin-bottom: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 4px;">
              Tinggal di Lokasi Ini (${item.jumlah_anggota_di_lokasi} Jiwa):
            </div>
            <ul style="list-style: none; margin: 0; padding: 0; max-height: 120px; overflow-y: auto;">
              ${anggotaHereHtml}
            </ul>
          </div>

          ${anggotaLainHtml}

          <div style="margin-top: 8px; display: flex; gap: 4px;">
            <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0f172a; color: white; font-weight: 700; font-size: 10px; padding: 5px 8px; border-radius: 6px; text-decoration: none;">
              Google Maps
            </a>
            ${
              item.kk_id
                ? `<a href="/admin/kartu-keluarga/${item.kk_id}" style="flex: 1; text-align: center; background: #10b981; color: white; font-weight: 700; font-size: 10px; padding: 5px 8px; border-radius: 6px; text-decoration: none;">
                    Detail KK
                  </a>`
                : ''
            }
          </div>
        </div>
      `

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
      marker.bindPopup(popupContent, { maxWidth: 340 })

      marker.on('click', () => {
        setActiveKkId(item.nomor_kk)
        updateFamilyPolyline(item)
        if (onSelectMarker) onSelectMarker(item)
      })

      markersRef.current[item.id] = marker
      bounds.extend([lat, lng])
    })

    // 2. Render Wilayah & Fasilitas Umum Markers
    filteredWilayah.forEach((item) => {
      const lat = Number(item.latitude)
      const lng = Number(item.longitude)
      if (isNaN(lat) || isNaN(lng)) return

      const pinColor = item.warna_marker || '#0ea5e9'

      const customIcon = L.divIcon({
        className: 'custom-wilayah-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background-color: ${pinColor}; color: white; width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2px solid white;">
              <svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid ${pinColor};"></div>
          </div>
        `,
        iconSize: [34, 41],
        iconAnchor: [17, 41],
        popupAnchor: [0, -39],
      })

      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 9999px;">
              ${item.jenis_wilayah} &bull; ${item.kode_wilayah}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">
            ${item.nama_wilayah}
          </h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
            ${item.deskripsi || 'Fasilitas / Wilayah Administrasi Desa.'}
          </p>
          <div style="background: #f8fafc; border-radius: 8px; padding: 6px 8px; font-size: 10px; color: #334155; margin-bottom: 8px; border: 1px solid #e2e8f0;">
            <div><strong>Kepala / Penanggung Jawab:</strong> ${item.kepala_wilayah}</div>
            <div><strong>Jumlah KK:</strong> ${item.jumlah_kk} KK</div>
            <div><strong>Penduduk:</strong> ${item.jumlah_penduduk} Jiwa</div>
          </div>
          <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display: inline-block; width: 100%; text-align: center; background: #0ea5e9; color: white; font-weight: 700; font-size: 11px; padding: 5px 8px; border-radius: 6px; text-decoration: none;">
            Buka di Google Maps &rarr;
          </a>
        </div>
      `

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
      marker.bindPopup(popupContent)

      marker.on('click', () => {
        if (polylineRef.current) {
          map.removeLayer(polylineRef.current)
          polylineRef.current = null
        }
        if (onSelectMarker) onSelectMarker(item)
      })

      markersRef.current[`wilayah-${item.id}`] = marker
      bounds.extend([lat, lng])
    })

    // Auto-fit bounds
    if (bounds.isValid()) {
      if (filteredKkMarkers.length + filteredWilayah.length === 1) {
        const single = filteredKkMarkers[0] || filteredWilayah[0]
        map.setView([Number(single.latitude), Number(single.longitude)], 16)
      } else if (filteredKkMarkers.length + filteredWilayah.length > 1) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [
    filteredKkMarkers.length,
    filteredWilayah.length,
    filterKategori,
    searchQuery,
    showFamilyLines,
  ])

  // Focus on selected marker if changed externally
  useEffect(() => {
    if (!selectedId || !mapInstanceRef.current) return
    const marker = markersRef.current[selectedId]
    if (marker) {
      const latLng = marker.getLatLng()
      mapInstanceRef.current.map.setView(latLng, 17, { animate: true })
      marker.openPopup()

      // If it's a KK marker, update polyline
      const kk = kkMarkers.find((k) => k.id === selectedId)
      if (kk) {
        updateFamilyPolyline(kk)
      }
    }
  }, [selectedId])

  const handleResetView = () => {
    if (!mapInstanceRef.current) return
    const { map } = mapInstanceRef.current
    map.setView(defaultCenter, 14, { animate: true })
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current)
      polylineRef.current = null
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Map Main Canvas */}
      <div className="flex-1 relative rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        {/* Map Header Floating Overlay Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          {/* Tile Layer Selector */}
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

          {/* Toggle Family Lines */}
          <button
            type="button"
            onClick={() => {
              setShowFamilyLines(!showFamilyLines)
              if (showFamilyLines && polylineRef.current && mapInstanceRef.current) {
                mapInstanceRef.current.map.removeLayer(polylineRef.current)
                polylineRef.current = null
              }
            }}
            className={`rounded-2xl px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md border transition flex items-center gap-1.5 ${
              showFamilyLines
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white/95 border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Tampilkan garis relasi spasial anggota dalam 1 KK yang terpisah lokasi"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                showFamilyLines ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            />
            <span>Garis Relasi KK</span>
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            className="rounded-2xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-md border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
            title="Pusatkan Peta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
              />
            </svg>
            <span>Reset Posisi</span>
          </button>
        </div>

        {/* Floating Legend / Quick Summary */}
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex flex-wrap items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
            <span className="text-slate-700 font-medium">1 KK Satu Atap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-600 ring-2 ring-blue-200"></span>
            <span className="text-slate-700 font-medium">Lokasi Kepala KK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
            <span className="text-slate-700 font-medium">Anggota Beda Lokasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-500 ring-2 ring-sky-200"></span>
            <span className="text-slate-700 font-medium">Tempat Umum</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-semibold">
            {filteredKkMarkers.length} Titik Hunian KK &bull; {filteredWilayah.length} Fasilitas
          </span>
        </div>

        {/* The Leaflet container */}
        <div
          ref={mapContainerRef}
          style={{ height }}
          className="w-full h-full min-h-[500px] z-0"
        />
      </div>

      {/* Side List & Quick Jump Panel */}
      <div className="w-full lg:w-96 flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Direktori Sebaran Hunian</h3>
          <p className="text-xs text-slate-400">
            Pilih titik untuk fokus dan melihat detail anggota keluarga
          </p>
        </div>

        {/* Filter Input */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Cari No KK, Kepala, atau Anggota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'Semua', label: 'Semua' },
              { id: 'satu_atap', label: 'Satu Atap' },
              { id: 'terpencar', label: 'Beda Lokasi' },
              { id: 'tempat_umum', label: 'Fasilitas' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterKategori(tab.id)}
                className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                  filterKategori === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[420px] pr-1">
          {filteredKkMarkers.length === 0 && filteredWilayah.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Tidak ada data yang sesuai dengan filter pencarian.
            </div>
          ) : (
            <>
              {/* KK List Section */}
              {filteredKkMarkers.map((item) => {
                const isSelected = selectedId === item.id

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectMarker) onSelectMarker(item)
                      const marker = markersRef.current[item.id]
                      if (marker && mapInstanceRef.current) {
                        mapInstanceRef.current.map.setView([item.latitude, item.longitude], 17, {
                          animate: true,
                        })
                        marker.openPopup()
                        updateFamilyPolyline(item)
                      }
                    }}
                    className={`group cursor-pointer rounded-2xl border p-3.5 transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-100 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              !item.is_split
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.is_kepala_keluarga_here
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {!item.is_split
                              ? '1 KK Satu Atap'
                              : item.is_kepala_keluarga_here
                              ? 'KK Utama'
                              : 'Anggota Beda Lokasi'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition mt-1">
                          {item.nama_kepala_keluarga}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          No. KK: {item.nomor_kk}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {item.jumlah_anggota_di_lokasi} Jiwa
                        </span>
                        {item.is_split && (
                          <span className="text-[9px] text-amber-600 font-medium mt-1">
                            +{item.anggota_lokasi_lain.length} di lokasi lain
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                      📍 {item.alamat_lokasi || item.alamat_keluarga}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>
                        Di titik ini:{' '}
                        <strong className="text-slate-700">
                          {item.anggota_di_lokasi.map((a) => a.nama_lengkap).join(', ')}
                        </strong>
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Public Facilities Section */}
              {filteredWilayah.map((w) => (
                <div
                  key={`w-${w.id}`}
                  onClick={() => {
                    if (onSelectMarker) onSelectMarker(w)
                    const marker = markersRef.current[`wilayah-${w.id}`]
                    if (marker && mapInstanceRef.current) {
                      mapInstanceRef.current.map.setView(
                        [Number(w.latitude), Number(w.longitude)],
                        16,
                        { animate: true }
                      )
                      marker.openPopup()
                    }
                  }}
                  className="group cursor-pointer rounded-2xl border border-slate-100 bg-sky-50/40 p-3.5 hover:border-sky-300 hover:bg-sky-50/80 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                        {w.jenis_wilayah} &bull; {w.kode_wilayah}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-800 transition mt-1">
                        {w.nama_wilayah}
                      </h4>
                    </div>
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: w.warna_marker || '#0ea5e9' }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Kepala: {w.kepala_wilayah} &bull; {w.jumlah_kk} KK
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex gap-2">
          <Link
            href="/admin/kartu-keluarga"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <span>Daftar KK</span>
          </Link>
          <Link
            href="/admin/wilayah"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <span>Data Wilayah</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
