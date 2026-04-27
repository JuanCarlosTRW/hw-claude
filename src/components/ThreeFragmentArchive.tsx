'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface Fragment {
  id: string
  label: string
  body: string
  imageSrc: string
}

const FRAGMENTS: Fragment[] = [
  {
    id: '001',
    label: 'Petal Islands',
    body: 'A coastal record of pollen drift and tidal margin. Documented before the tide decided.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_53045ad0c6e64d31b5edb93f9afdc8cc~mv2.png',
  },
  {
    id: '002',
    label: 'Grass Contour Lines',
    body: 'Topography measured in blade and wind direction. No surveyor was present.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_963db0641ecb4368a64e912092d05af7~mv2.png',
  },
  {
    id: '003',
    label: 'Unknown River',
    body: 'A waterway documented before it was named. It may no longer exist.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_77df68f122fd43ffa002f1709f2201ee~mv2.png',
  },
  {
    id: '004',
    label: 'Pollen Map',
    body: 'Drift patterns from territories without borders. The cartographer followed the wind.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_d1565bc35a0c4a20bb688cec18a8e2ed~mv2.png',
  },
  {
    id: '005',
    label: 'The Soft Border',
    body: 'Where one terrain ends and memory begins. This line cannot be walked.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_8678f9f9b1fc42c59d08c6d5905b87f9~mv2.png',
  },
  {
    id: '006',
    label: 'Clouded Terrain',
    body: 'Altitude readings taken during atmospheric suspension. The ground was not confirmed.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_20ec03fa4c4342b4ad8e545c6ccdf3e4~mv2.png',
  },
  {
    id: '007',
    label: 'The Living Coastline',
    body: 'A shore that repositions itself seasonally. It refuses to be fixed.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_4b6f96b79a1945b5a123fcc30afcaa56~mv2.png',
  },
  {
    id: '008',
    label: 'Valley Specimen',
    body: 'Ground-level survey of an unnamed depression. Depth: approximately one silence.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_647d111a63184f2ba532fa538b3a774d~mv2.png',
  },
  {
    id: '009',
    label: 'Archive of Wind',
    body: 'Motion records from a region defined only by weather. Nothing else remained.',
    imageSrc: 'https://static.wixstatic.com/media/62f926_aac47c94dd8e4000982b074f69464261~mv2.png',
  },
]

// 3×3 loose grid — z varies to create depth
const BASE_POSITIONS: [number, number, number][] = [
  [-3.6,  2.3, -0.8],
  [ 0.0,  2.5,  0.4],
  [ 3.6,  2.1, -0.4],
  [-3.8,  0.0,  0.6],
  [ 0.0,  0.1, -1.0],
  [ 3.8, -0.1,  0.3],
  [-3.6, -2.3, -0.3],
  [ 0.0, -2.4,  0.7],
  [ 3.6, -2.2, -0.5],
]

// Slight editorial tilt per card (radians)
const BASE_ROT_Z: number[] = [
  -0.055, 0.030, 0.075, 0.040, -0.020, -0.065, 0.050, -0.038, 0.062,
]

const PLANE_W = 1.75
const PLANE_H = 2.33  // ~3:4

// Fallback sepia canvas texture when image CORS fails
function makeFallbackTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128; canvas.height = 170
  const ctx = canvas.getContext('2d')!
  const hue = 30 + (index * 7) % 20
  const grad = ctx.createLinearGradient(0, 0, 0, 170)
  grad.addColorStop(0, `hsl(${hue},18%,72%)`)
  grad.addColorStop(1, `hsl(${hue},14%,55%)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 170)
  return new THREE.CanvasTexture(canvas)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

interface ActiveFragment extends Fragment {
  screenX: number
  screenY: number
}

export default function ThreeFragmentArchive() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<ActiveFragment | null>(null)
  const closeRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1815)
    scene.fog = new THREE.FogExp2(0x1a1815, 0.055)

    // ── Camera ─────────────────────────────────────────────────────────────
    const W = container.clientWidth
    const H = container.clientHeight
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 60)
    camera.position.set(0, 0, 11)

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Group (drag rotates this) ───────────────────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    // ── Planes ─────────────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'

    const meshes: THREE.Mesh[] = []
    const floatPhases = FRAGMENTS.map((_, i) => i * 0.78)

    FRAGMENTS.forEach((frag, i) => {
      const geo = new THREE.PlaneGeometry(PLANE_W, PLANE_H)

      // Placeholder material until texture loads
      const mat = new THREE.MeshBasicMaterial({ color: 0x3a352e })
      const mesh = new THREE.Mesh(geo, mat)

      const [x, y, z] = BASE_POSITIONS[i]
      mesh.position.set(x, y, z)
      mesh.rotation.z = BASE_ROT_Z[i]
      mesh.userData = {
        index: i,
        fragment: frag,
        basePos: [x, y, z],
        baseRotZ: BASE_ROT_Z[i],
        phase: floatPhases[i],
      }

      group.add(mesh)
      meshes.push(mesh)

      loader.load(
        frag.imageSrc,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          ;(mesh.material as THREE.MeshBasicMaterial).map = tex
          ;(mesh.material as THREE.MeshBasicMaterial).color.set(0xffffff)
          ;(mesh.material as THREE.MeshBasicMaterial).needsUpdate = true
        },
        undefined,
        () => {
          // CORS / load failure — apply sepia gradient fallback
          const fallback = makeFallbackTexture(i)
          ;(mesh.material as THREE.MeshBasicMaterial).map = fallback
          ;(mesh.material as THREE.MeshBasicMaterial).color.set(0xffffff)
          ;(mesh.material as THREE.MeshBasicMaterial).needsUpdate = true
        },
      )
    })

    // ── Raycaster ──────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-99, -99)

    // ── State refs ─────────────────────────────────────────────────────────
    let isZoomed = false
    const scaleTargets = new Array(FRAGMENTS.length).fill(1) as number[]

    // Camera smooth targets
    const cam = { tx: 0, ty: 0, tz: 11, cx: 0, cy: 0, cz: 11 }
    const look = { tx: 0, ty: 0, cx: 0, cy: 0 }

    // Drag
    const drag = { active: false, startX: 0, baseGroupY: 0 }
    const groupRotY = { target: 0, current: 0 }

    // ── Close handler (called from React overlay) ───────────────────────────
    closeRef.current = () => {
      isZoomed = false
      cam.tx = 0; cam.ty = 0; cam.tz = 11
      look.tx = 0; look.ty = 0
      scaleTargets.fill(1)
    }

    // ── Mouse handlers ─────────────────────────────────────────────────────
    function updateMouse(e: MouseEvent) {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    function onMouseMove(e: MouseEvent) {
      updateMouse(e)
      if (drag.active && !isZoomed) {
        const deltaX = e.clientX - drag.startX
        groupRotY.target = drag.baseGroupY + deltaX * 0.003
        groupRotY.target = Math.max(-0.45, Math.min(0.45, groupRotY.target))
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (isZoomed) return
      drag.active = true
      drag.startX = e.clientX
      drag.baseGroupY = groupRotY.target
    }

    function onMouseUp(e: MouseEvent) {
      if (!drag.active) return
      const wasDrag = Math.abs(e.clientX - drag.startX) > 6
      drag.active = false
      if (wasDrag || isZoomed) return

      // Treat as click
      updateMouse(e)
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(meshes)
      if (hits.length === 0) return

      const clickedMesh = hits[0].object as THREE.Mesh
      const frag: Fragment = clickedMesh.userData.fragment

      // Project world position to screen coords for overlay positioning
      const worldPos = new THREE.Vector3()
      clickedMesh.getWorldPosition(worldPos)
      const projected = worldPos.clone().project(camera)
      const rect = container.getBoundingClientRect()
      const sx = ((projected.x + 1) / 2) * rect.width
      const sy = ((-projected.y + 1) / 2) * rect.height

      isZoomed = true

      // Camera eases toward the fragment
      cam.tx = worldPos.x * 0.28
      cam.ty = worldPos.y * 0.28
      cam.tz = 6.2
      look.tx = worldPos.x * 0.38
      look.ty = worldPos.y * 0.38

      // Dim all, pop clicked
      scaleTargets.fill(0.85)
      scaleTargets[clickedMesh.userData.index] = 1.12

      setActive({ ...frag, screenX: sx, screenY: sy })
    }

    function onMouseLeave() {
      drag.active = false
      if (!isZoomed) {
        scaleTargets.fill(1)
        container.style.cursor = 'default'
      }
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mousedown', onMouseDown)
    container.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseup', onMouseUp)

    // Resize
    function onResize() {
      const W = container.clientWidth
      const H = container.clientHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize)

    // ── Render loop ────────────────────────────────────────────────────────
    let animId: number
    let time = 0
    let lastTs = 0

    function animate(ts: number) {
      animId = requestAnimationFrame(animate)
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts
      time += dt

      // Float + hover hover detection
      raycaster.setFromCamera(mouse, camera)
      const hits = isZoomed ? [] : raycaster.intersectObjects(meshes)
      const hovered = hits[0]?.object as THREE.Mesh | undefined

      meshes.forEach((mesh, i) => {
        const { basePos, baseRotZ, phase } = mesh.userData
        const [bx, by] = basePos

        // Gentle floating
        mesh.position.y = by + Math.sin(time * 0.32 + phase) * 0.09
        mesh.position.x = bx + Math.sin(time * 0.18 + phase * 1.4) * 0.035
        mesh.rotation.z = baseRotZ + Math.sin(time * 0.22 + phase * 0.9) * 0.015

        // Hover scale target (only when not zoomed)
        if (!isZoomed) {
          scaleTargets[i] = hovered === mesh ? 1.08 : 1
        }

        // Smooth scale
        mesh.scale.x = lerp(mesh.scale.x, scaleTargets[i], 0.07)
        mesh.scale.y = lerp(mesh.scale.y, scaleTargets[i], 0.07)
      })

      // Cursor
      container.style.cursor = (!isZoomed && hovered) ? 'pointer' : 'default'

      // Group drag rotation
      groupRotY.current = lerp(groupRotY.current, groupRotY.target, 0.055)
      group.rotation.y = groupRotY.current

      // Camera lerp
      cam.cx = lerp(cam.cx, cam.tx, 0.038)
      cam.cy = lerp(cam.cy, cam.ty, 0.038)
      cam.cz = lerp(cam.cz, cam.tz, 0.038)
      camera.position.set(cam.cx, cam.cy, cam.cz)

      look.cx = lerp(look.cx, look.tx, 0.038)
      look.cy = lerp(look.cy, look.ty, 0.038)
      camera.lookAt(look.cx, look.cy, 0)

      renderer.render(scene, camera)
    }

    animId = requestAnimationFrame(animate)

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  function handleClose() {
    setActive(null)
    closeRef.current()
  }

  return (
    <div style={{ position: 'relative', background: '#1A1815' }}>
      {/* Canvas mount */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: '88vh' }}
        aria-label="Interactive fragment archive — nine floating cartographic records"
      />

      {/* Fragment detail overlay */}
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            onClick={handleClose}
            style={{
              pointerEvents: 'all',
              cursor: 'pointer',
              maxWidth: '340px',
              padding: '2.5rem 3rem',
              background: 'rgba(26,24,21,0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(139,111,71,0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono-sans)',
                fontWeight: 500,
                fontSize: '0.55rem',
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                color: 'rgba(139,111,71,0.9)',
              }}
            >
              FRAGMENT {active.id}
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-editorial)',
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                color: '#F5F0E8',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              {active.label}
            </h3>

            <p
              style={{
                fontFamily: 'var(--font-editorial)',
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'rgba(237,230,216,0.7)',
                maxWidth: '30ch',
              }}
            >
              {active.body}
            </p>

            <span
              style={{
                fontFamily: 'var(--font-mono-sans)',
                fontSize: '0.55rem',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'rgba(245,240,232,0.25)',
                marginTop: '0.5rem',
              }}
            >
              — CLICK TO CLOSE
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
