'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { events } from './components/Map'

const Map = dynamic(() => import('./components/Map'), { ssr: false })

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #222'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '-0.5px' }}>
          blast<span style={{ color: '#E24B4A' }}>radius</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: '#888' }}>
          <span style={{ cursor: 'pointer' }}>Case studies</span>
          <span style={{ cursor: 'pointer' }}>About</span>
          <a href="https://theblastradius.substack.com" target="_blank" style={{ color: '#E24B4A', textDecoration: 'none' }}>Subscribe</a>
        </div>
      </nav>

      <div style={{ padding: '60px 40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '500', lineHeight: '1.2' }}>
          Every geopolitical event sends a shockwave.
        </h1>
        <p style={{ fontSize: '16px', color: '#888', marginTop: '16px', lineHeight: '1.7' }}>
          Click any event on the map to see the economic blast radius in real numbers, across real industries, across the world.
        </p>
      </div>

      <div style={{ margin: '0 40px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
        <Map onEventClick={setSelectedEvent} selectedEvent={selectedEvent} />
      </div>

      {selectedEvent && (
        <div style={{
          margin: '24px 40px',
          background: '#111',
          border: '1px solid #222',
          borderRadius: '12px',
          padding: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#E24B4A', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Active shockwave</div>
              <h2 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '4px' }}>{selectedEvent.name}</h2>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>{selectedEvent.date}</div>
              <p style={{ fontSize: '15px', color: '#aaa', lineHeight: '1.7', maxWidth: '600px' }}>{selectedEvent.summary}</p>
            </div>
            <button onClick={() => setSelectedEvent(null)} style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}>✕ Close</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '24px 0' }}>
            {selectedEvent.metrics.map((m, i) => (
              <div key={i} style={{ background: '#1a1a1a', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{m.label}</div>
                <div style={{ fontSize: '18px', fontWeight: '500' }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {selectedEvent.industries.map((ind, i) => (
              <span key={i} style={{
                fontSize: '12px',
                padding: '4px 12px',
                background: 'rgba(226,75,74,0.1)',
                color: '#E24B4A',
                borderRadius: '999px',
                border: '1px solid rgba(226,75,74,0.2)'
              }}>{ind}</span>
            ))}
          </div>

          <a href={selectedEvent.link} target="_blank" style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#E24B4A',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Read full case study →</a>
        </div>
      )}

      <div style={{ margin: '40px 40px 0', borderTop: '1px solid #222', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>About Blastradius</h2>
        <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.7', maxWidth: '600px', marginBottom: '40px' }}>
          Blastradius maps the economic shockwave of geopolitical events — in real numbers, for a general audience. Every case study starts with one question: what did this actually cost, and who paid for it? Built by Darsh Nandwana, Mumbai.
        </p>
      </div>

      <footer style={{ padding: '24px 40px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: '#444' }}>blast<span style={{ color: '#E24B4A' }}>radius</span></div>
        <a href="https://theblastradius.substack.com" target="_blank" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>Subscribe on Substack →</a>
      </footer>
    </main>
  )
}