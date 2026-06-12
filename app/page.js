'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const Globe = dynamic(() => import('./components/Globe'), { ssr: false })

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [aiEvents, setAiEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shockwave')
      .then(r => r.json())
      .then(data => {
        if (data.events) setAiEvents(data.events)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const tickers = [
    { name: 'Brent Crude', value: '$98.83', change: '-4.55%', up: false },
    { name: 'WTI Crude', value: '$92.14', change: '-4.62%', up: false },
    { name: 'Gold', value: '$2,340', change: '+0.8%', up: true },
    { name: 'Silver', value: '$27.42', change: '+1.2%', up: true },
    { name: 'Natural Gas', value: '$2.18', change: '+1.4%', up: true },
    { name: 'Wheat', value: '$542', change: '-0.8%', up: false },
    { name: 'Corn', value: '$448', change: '+0.5%', up: true },
    { name: 'Copper', value: '$4.21', change: '-0.3%', up: false },
    { name: 'S&P 500', value: '5,218', change: '+0.24%', up: true },
    { name: 'NASDAQ', value: '16,340', change: '+0.31%', up: true },
    { name: 'USD/INR', value: '83.42', change: '-0.1%', up: false },
    { name: 'Jet Fuel', value: '$3.12/gal', change: '+12%', up: false },
    { name: 'Shipping Index', value: '1,842', change: '+5.2%', up: false },
    { name: 'Brent Crude', value: '$98.83', change: '-4.55%', up: false },
    { name: 'WTI Crude', value: '$92.14', change: '-4.62%', up: false },
    { name: 'Gold', value: '$2,340', change: '+0.8%', up: true },
  ]

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: 'sans-serif', overflow: 'hidden' }}>

      {/* Ticker */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '48px', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {tickers.map((c, i) => (
            <div key={i} style={{ display: 'inline-flex', gap: '8px', fontSize: '14px', alignItems: 'center' }}>
              <span style={{ color: '#444' }}>|</span>
              <span style={{ color: '#888' }}>{c.name}</span>
              <span style={{ fontWeight: '500', color: '#fff' }}>{c.value}</span>
              <span style={{ color: c.up ? '#4ade80' : '#E24B4A', fontSize: '13px' }}>{c.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #222' }}>
        <div style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '-0.5px' }}>
          blast<span style={{ color: '#E24B4A' }}>radius</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#888' }}>
          <span style={{ cursor: 'pointer' }}>Case studies</span>
          <span style={{ cursor: 'pointer' }}>About</span>
          <a href="https://theblastradius.substack.com" target="_blank" style={{ color: '#E24B4A', textDecoration: 'none' }}>Subscribe</a>
        </div>
      </nav>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', height: 'calc(100vh - 96px)' }}>

        {/* Left panel */}
        <div style={{ borderRight: '1px solid #222', overflowY: 'auto', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#E24B4A', letterSpacing: '1px', marginBottom: '12px' }}>● LIVE SHOCKWAVES</div>
          {loading ? (
            <div style={{ fontSize: '13px', color: '#888' }}>Analyzing geopolitical events...</div>
          ) : aiEvents.length > 0 ? (
            aiEvents.map((event, i) => (
              <div key={i} onClick={() => setSelectedEvent(event)} style={{
                background: selectedEvent === event ? '#1a1a1a' : 'transparent',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>{event.name}</div>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>{event.location} · {event.date}</div>
                <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.6' }}>{event.summary?.slice(0, 100)}...</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {event.industries?.slice(0, 2).map((ind, j) => (
                    <span key={j} style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(226,75,74,0.1)', color: '#E24B4A', borderRadius: '999px' }}>{ind}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '13px', color: '#888' }}>No events loaded.</div>
          )}
        </div>

        {/* Center — Globe */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '16px', fontSize: '12px', color: '#888' }}>
            Every geopolitical event sends a shockwave. Click any event to see the blast radius.
          </div>
          <div style={{ width: '100%', height: '100%' }}>
            <Globe
  events={aiEvents.filter(e => e.lat && e.lng)}
  onEventClick={setSelectedEvent}
  selectedEvent={selectedEvent}
/>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ borderLeft: '1px solid #222', overflowY: 'auto', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#E24B4A', letterSpacing: '1px', marginBottom: '12px' }}>● BLAST RADIUS</div>
          {selectedEvent ? (
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>{selectedEvent.name}</div>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px' }}>{selectedEvent.location} · {selectedEvent.date}</div>
              <p style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.7', marginBottom: '16px' }}>{selectedEvent.summary}</p>
              {selectedEvent.metrics?.map((m, i) => (
                <div key={i} style={{ background: '#111', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', border: '1px solid #222' }}>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{m.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{m.value}</div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                {selectedEvent.industries?.map((ind, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(226,75,74,0.1)', color: '#E24B4A', borderRadius: '999px', border: '1px solid rgba(226,75,74,0.2)' }}>{ind}</span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#888' }}>Click any event on the globe or from the feed to see its economic blast radius.</div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', borderTop: '1px solid #222', padding: '8px 24px', fontSize: '12px', color: '#888' }}>
        blast<span style={{ color: '#E24B4A' }}>radius</span> · Mapping the economic shockwave of geopolitical events · Built by Darsh Nandwana, Mumbai ·
        <a href="https://theblastradius.substack.com" target="_blank" style={{ color: '#E24B4A', textDecoration: 'none', marginLeft: '8px' }}>Subscribe →</a>
      </div>
    </main>
  )
}