import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Demonstration properties only. Replace with your own authorized data source.
const HOMES = [
  { id: 1, name: 'Riverside Loft', area: 'Osborne Village', type: 'Apartment', beds: 1, price: 1490, lat: 49.8741, lng: -97.1402, emoji: '🏙️' },
  { id: 2, name: 'Maple Street Home', area: 'Wolseley', type: 'House', beds: 3, price: 2450, lat: 49.8846, lng: -97.1671, emoji: '🏡' },
  { id: 3, name: 'Exchange Studio', area: 'Exchange District', type: 'Studio', beds: 0, price: 1190, lat: 49.8995, lng: -97.1395, emoji: '🏢' },
  { id: 4, name: 'South Pointe Suite', area: 'Fort Richmond', type: 'Apartment', beds: 2, price: 1795, lat: 49.7929, lng: -97.1569, emoji: '🌿' },
  { id: 5, name: 'Crescent Townhouse', area: 'River Heights', type: 'Townhouse', beds: 2, price: 2100, lat: 49.8637, lng: -97.1889, emoji: '🏘️' },
  { id: 6, name: 'Garden Park Home', area: 'Garden City', type: 'House', beds: 4, price: 2650, lat: 49.9499, lng: -97.1442, emoji: '🌳' },
]
const money = (n) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)
const token = import.meta.env.VITE_MAPBOX_TOKEN

function PropertyMap({ listings, selectedId, onSelect }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])

  useEffect(() => {
    if (!token || !mapContainer.current) return undefined
    mapboxgl.accessToken = token
    const instance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-97.145, 49.885],
      zoom: 10.4,
    })
    map.current = instance
    instance.addControl(new mapboxgl.NavigationControl(), 'top-right')
    return () => {
      markers.current.forEach((marker) => marker.remove())
      markers.current = []
      instance.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current) return
    markers.current.forEach((marker) => marker.remove())
    markers.current = listings.map((home) => {
      const el = document.createElement('button')
      el.className = `map-pin${selectedId === home.id ? ' selected' : ''}`
      el.type = 'button'
      el.textContent = money(home.price)
      el.setAttribute('aria-label', `Select ${home.name}`)
      el.addEventListener('click', () => onSelect(home.id))
      return new mapboxgl.Marker({ element: el })
        .setLngLat([home.lng, home.lat])
        .addTo(map.current)
    })
    return () => { markers.current.forEach((marker) => marker.remove()); markers.current = [] }
  }, [listings, selectedId, onSelect])

  if (!token) {
    return <div className="map-placeholder" role="note"><div className="map-globe">⌖</div><h3>Map preview</h3><p>Add your Mapbox public access token in <code>.env</code> to see interactive property markers.</p><span>Listings remain fully browsable without a token.</span></div>
  }
  return <div ref={mapContainer} className="map-canvas" aria-label="Interactive map of sample homes" />
}

export default function App() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All types')
  const [maxPrice, setMaxPrice] = useState('Any budget')
  const [selectedId, setSelectedId] = useState(null)
  const listings = useMemo(() => HOMES.filter((home) => {
    const matchText = `${home.name} ${home.area}`.toLowerCase().includes(search.toLowerCase())
    return matchText && (type === 'All types' || home.type === type) &&
      (maxPrice === 'Any budget' || home.price <= Number(maxPrice))
  }), [search, type, maxPrice])
  const selected = listings.find((home) => home.id === selectedId)

  return (
    <div className="app-shell">
      <header className="site-header"><div className="brand"><span className="brand-icon">⌂</span><span>nest<span className="brand-accent">finder</span></span></div><div className="header-right"><span className="demo-badge">Demo project</span><a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a></div></header>
      <main>
        <section className="hero"><div className="eyebrow">EXPLORE YOUR NEXT SPACE</div><h1>Find a place that <em>feels like home.</em></h1><p>Explore a small demonstration collection of Winnipeg properties. Filter listings and discover locations on an interactive map.</p></section>
        <section className="controls" aria-label="Filter properties">
          <label className="search-field">Search neighbourhood or property<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try Wolseley or Riverside" /></label>
          <label>Property type<select value={type} onChange={(event) => setType(event.target.value)}>{['All types', 'Apartment', 'Studio', 'House', 'Townhouse'].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Monthly budget<select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option>Any budget</option><option value="1500">Up to $1,500</option><option value="2000">Up to $2,000</option><option value="2500">Up to $2,500</option></select></label>
          <button className="reset-button" onClick={() => {setSearch(''); setType('All types'); setMaxPrice('Any budget');setSelectedId(null)}}>Clear filters</button>
        </section>
        <div className="results-bar"><div><h2>Explore listings</h2><p>{listings.length} demo {listings.length === 1 ? 'property' : 'properties'} found</p></div><span className="caption-tag">Winnipeg, Manitoba</span></div>
        <div className="workspace"><section className="listing-grid" aria-label="Sample property listings">{listings.length ? listings.map((home) => <button type="button" key={home.id} className={`listing-card${home.id === selectedId ? ' active' : ''}`} onClick={() => setSelectedId(home.id)} aria-pressed={home.id === selectedId}>
          <div className={`listing-art art-${home.id}`}><span className="art-emoji">{home.emoji}</span><span className="listing-pill">Sample listing</span></div>
          <div className="listing-body"><div className="listing-heading"><h3>{home.name}</h3><strong>{money(home.price)}<small>/mo</small></strong></div><p>📍 {home.area}</p><div className="listing-meta"><span>{home.type}</span><span>{home.beds === 0 ? 'Studio' : `${home.beds} ${home.beds === 1 ? 'bed' : 'beds'}`}</span></div></div>
        </button>) : <div className="empty-state"><h3>No matching properties</h3><p>Try changing your search or budget.</p><button onClick={() => {setSearch('');setType('All types');setMaxPrice('Any budget')}}>Reset filters</button></div>}</section>
          <aside className="map-panel"><div className="map-topline"><strong>Map view</strong><span>{selected ? selected.area : 'Select a listing'}</span></div><PropertyMap listings={listings} selectedId={selectedId} onSelect={setSelectedId} /></aside>
        </div>
      </main>
      <footer><span>nestfinder — React + Vite + Mapbox GL JS</span><span>Demo data only. Not actual housing offers.</span></footer>
    </div>
  )
}
