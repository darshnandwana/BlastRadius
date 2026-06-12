'use client'
import { useEffect, useRef, useState } from 'react'

export default function Globe({ events, onEventClick, selectedEvent }) {
  const mountRef = useRef(null)
  const globeRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !mountRef.current) return

    let animationId
    const initGlobe = async () => {
      const THREE = (await import('three')).default || await import('three')

      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
      camera.position.z = 2.5

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      mountRef.current.appendChild(renderer.domElement)
      globeRef.current = renderer

      const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      
      const geometry = new THREE.SphereGeometry(1, 64, 64)
      const material = new THREE.MeshPhongMaterial({ map: earthTexture })
      const earth = new THREE.Mesh(geometry, material)
      scene.add(earth)

      const ambientLight = new THREE.AmbientLight(0x333333)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 3, 5)
      scene.add(directionalLight)

      const dotGeometry = new THREE.SphereGeometry(0.02, 8, 8)
      const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xe24b4a })

      const latLngToVector3 = (lat, lng) => {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)
        return new THREE.Vector3(
          -Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        )
      }

      events.forEach(event => {
        const pos = latLngToVector3(event.lat, event.lng)
        const dot = new THREE.Mesh(dotGeometry, dotMaterial.clone())
        dot.position.copy(pos)
        dot.userData = event
        earth.add(dot)
      })

      let isDragging = false
      let previousMousePosition = { x: 0, y: 0 }

      const onMouseDown = (e) => { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY } }
      const onMouseUp = () => { isDragging = false }
      const onMouseMove = (e) => {
        if (!isDragging) return
        const delta = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y }
        earth.rotation.y += delta.x * 0.005
        earth.rotation.x += delta.y * 0.005
        previousMousePosition = { x: e.clientX, y: e.clientY }
      }

      renderer.domElement.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('mousemove', onMouseMove)

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        if (!isDragging) earth.rotation.y += 0.002
        renderer.render(scene, camera)
      }
      animate()
    }

    initGlobe()

    return () => {
      cancelAnimationFrame(animationId)
      if (globeRef.current) {
        globeRef.current.dispose()
        if (mountRef.current && globeRef.current.domElement) {
          mountRef.current.removeChild(globeRef.current.domElement)
        }
      }
    }
  }, [mounted, events])

  if (!mounted) return <div style={{ width: '100%', height: '100%', background: '#0a0a0a' }} />

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}