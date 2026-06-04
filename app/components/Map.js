'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export const events = [
  {
    id: 1,
    name: 'Iran Airspace Closure',
    position: [32.4279, 53.6880],
    date: 'Feb 28, 2026',
    summary: 'The US and Israel struck Iran, closing one of the world\'s most critical aviation corridors overnight. Indian carriers got hit hardest.',
    metrics: [
      { label: 'Jet fuel price', value: '$85 → $200/barrel' },
      { label: 'Air India flights cut', value: '22%' },
      { label: 'Flight duration increase', value: '+40%' },
      { label: 'ATF cost in India', value: '₹1 lakh/kl' },
    ],
    industries: ['Aviation', 'Oil & Gas', 'Shipping'],
    link: 'https://theblastradius.substack.com'
  },
  {
    id: 2,
    name: 'US Tariffs on India',
    position: [20.5937, 78.9629],
    date: 'Feb 2026',
    summary: 'Washington imposed 126% duties on Indian solar exports and 50% on all goods. India cut a deal — but gave up more than it got.',
    metrics: [
      { label: 'Solar export duty', value: '126%' },
      { label: 'Solar exports crashed', value: '$134M → $80M' },
      { label: 'Tariff reduction deal', value: '50% → 18%' },
      { label: 'Russian oil discount lost', value: '$2.5B/year' },
    ],
    industries: ['Solar', 'Pharma', 'Manufacturing'],
    link: 'https://theblastradius.substack.com'
  },
  {
    id: 3,
    name: 'Strait of Hormuz Closure',
    position: [26.5667, 56.2500],
    date: 'March 2026',
    summary: 'Iran war choked the world\'s most critical shipping lane. Daily vessel traffic collapsed from 100 ships to 10. Food supply chains are now at risk.',
    metrics: [
      { label: 'Daily vessel traffic', value: '100 → 10 ships' },
      { label: 'Brent crude peak', value: '$126/barrel' },
      { label: 'War risk surcharge', value: '$1,500/container' },
      { label: 'Global urea supply at risk', value: '30-35%' },
    ],
    industries: ['Shipping', 'Oil & Gas', 'Food & Fertilizer'],
    link: 'https://theblastradius.substack.com'
  }
]

export default function Map({ onEventClick, selectedEvent }) {
  return (
    <MapContainer
      center={[20, 20]}
      zoom={2.3}
      style={{ height: '500px', width: '100%', background: '#111' }}
zoomControl={false}
scrollWheelZoom={false}
dragging={false}
doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {events.map(event => (
        <CircleMarker
          key={event.id}
          center={event.position}
          radius={selectedEvent?.id === event.id ? 16 : 12}
          fillColor="#E24B4A"
          color="#E24B4A"
          weight={2}
          opacity={0.9}
          fillOpacity={0.5}
          eventHandlers={{ click: () => onEventClick(event) }}
        />
      ))}
    </MapContainer>
  )
}