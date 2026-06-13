'use client'
import { useEffect, useRef, useState } from 'react'

export default function Globe({ events, onEventClick }) {
  const mountRef = useRef(null)
  const earthRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const eventsRef = useRef(events)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    eventsRef.current = events
  }, [events])

  useEffect(() => {
    if (!mounted || !mountRef.current) return

    let animationId
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    let targetRotationY = 0
    let targetRotationX = 0

    const initGlobe = async () => {
      const THREE = (await import('three')).default || await import('three')

      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
      camera.position.z = 2.5
      cameraRef.current = camera

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      mountRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      const textureLoader = new THREE.TextureLoader()
      const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')

      const geometry = new THREE.SphereGeometry(1, 64, 64)
      const material = new THREE.MeshPhongMaterial({ map: earthTexture })
      const earth = new THREE.Mesh(geometry, material)
      scene.add(earth)
      earthRef.current = earth

      const ambientLight = new THREE.AmbientLight(0x444444)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 3, 5)
      scene.add(directionalLight)

      const latLngToVector3 = (lat, lng) => {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)
        return new THREE.Vector3(
          -Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        )
      }

      eventsRef.current.forEach(event => {
        if (!event.lat || !event.lng) return

        const pos = latLngToVector3(event.lat, event.lng)

        // Main dot
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xe24b4a })
        )
        dot.position.copy(pos)
        dot.userData = event
        earth.add(dot)

        // Pulse ring
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.03, 0.048, 16),
          new THREE.MeshBasicMaterial({ 
            color: 0xe24b4a, 
            transparent: true, 
            opacity: 0.35, 
            side: THREE.DoubleSide 
          })
        )
        ring.position.copy(pos)
        ring.lookAt(new THREE.Vector3(0, 0, 0))
        earth.add(ring)
      })

      // Raycaster for clicks
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      const onMouseDown = (e) => {
        isDragging = false
        previousMousePosition = { x: e.clientX, y: e.clientY }
      }

      const onMouseMove = (e) => {
        if (e.buttons === 0) return
        const dx = e.clientX - previousMousePosition.x
        const dy = e.clientY - previousMousePosition.y
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          isDragging = true
          earth.rotation.y += dx * 0.005
          earth.rotation.x += dy * 0.005
          previousMousePosition = { x: e.clientX, y: e.clientY }
        }
      }

      const onMouseUp = (e) => {
        if (!isDragging) {
          const rect = renderer.domElement.getBoundingClientRect()
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
          raycaster.setFromCamera(mouse, camera)
          const intersects = raycaster.intersectObjects(earth.children)
          if (intersects.length > 0 && intersects[0].object.userData.name) {
            onEventClick(intersects[0].object.userData)
          }
        }
        isDragging = false
      }

      renderer.domElement.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)

      // Pulse animation
      let pulseScale = 1
      let pulseDir = 1

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        if (!isDragging) earth.rotation.y += 0.002

        // Animate pulse rings
        pulseScale += 0.01 * pulseDir
        if (pulseScale > 1.3 || pulseScale < 1) pulseDir *= -1
        earth.children.forEach(child => {
          if (child.geometry?.type === 'RingGeometry') {
            child.scale.setScalar(pulseScale)
            child.material.opacity = 0.35 * (1.3 - pulseScale)
          }
        })

        renderer.render(scene, camera)
      }
      animate()
    }

    initGlobe()

    return () => {
      cancelAnimationFrame(animationId)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (mountRef.current && rendererRef.current.domElement) {
          mountRef.current.removeChild(rendererRef.current.domElement)
        }
      }
    }
  }, [mounted])

  if (!mounted) return <div style={{ width: '100%', height: '100%', background: '#0a0a0a' }} />
  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}