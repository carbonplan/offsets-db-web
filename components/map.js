import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Box, get, useThemeUI } from 'theme-ui'
import { useRouter } from 'next/router'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Protocol } from 'pmtiles'
import { Arrow } from '@carbonplan/icons'
import {
  BOUNDARY_PMTILES_URL,
  BASEMAP_PMTILES_URL,
  BOUNDARY_LAYER_ID,
  CENTROIDS_LAYER_ID,
  COLORS,
} from './constants'
import { useMapTheme } from './use-map-theme'
import { getProjectCategory } from './utils'

const Map = ({ project }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const hoveredFeatureId = useRef(null)
  const hoveredFeature = useRef(null)
  const markerRef = useRef(null)
  const [markerEl, setMarkerEl] = useState(null)
  const [markerVisible, setMarkerVisible] = useState(false)
  const mapLayers = useMapTheme()
  const { theme } = useThemeUI()
  const router = useRouter()

  const colorName = COLORS[getProjectCategory(project)] ?? COLORS.other
  const color = get(theme, `rawColors.${colorName}`, colorName)
  const secondary = get(theme, 'rawColors.secondary')
  const background = get(theme, 'rawColors.background')
  const hinted = get(theme, 'rawColors.hinted')
  const primary = get(theme, 'rawColors.primary')

  const bounds = useMemo(
    () => [
      [project.bbox.xmin, project.bbox.ymin],
      [project.bbox.xmax, project.bbox.ymax],
    ],
    [project.bbox]
  )

  const projectLayers = useMemo(() => {
    const isProject = ['==', ['get', 'project_id'], project.project_id]
    return [
      {
        id: 'project-boundaries-fill',
        type: 'fill',
        source: 'project-boundaries',
        'source-layer': BOUNDARY_LAYER_ID,
        paint: {
          'fill-color': ['case', isProject, color, secondary],
          'fill-opacity': 0.2,
        },
      },
      {
        id: 'project-boundaries-outline',
        type: 'line',
        source: 'project-boundaries',
        'source-layer': BOUNDARY_LAYER_ID,
        paint: {
          'line-color': ['case', isProject, color, secondary],
          'line-width': [
            'case',
            isProject,
            1,
            ['case', ['==', ['feature-state', 'hover'], true], 1, 0.5],
          ],
        },
      },
      {
        id: 'project-centroids-label',
        type: 'symbol',
        source: 'project-boundaries',
        'source-layer': CENTROIDS_LAYER_ID,
        layout: {
          'text-field': ['get', 'project_id'],
          'text-size': 16,
          'text-font': ['Relative Mono Pro 11 Pitch'],
          'text-letter-spacing': 0.02,
          'text-anchor': 'center',
          'symbol-sort-key': ['case', isProject, 0, 1],
        },
        paint: {
          'text-color': [
            'case',
            isProject,
            color,
            [
              'case',
              ['==', ['feature-state', 'hover'], true],
              primary,
              secondary,
            ],
          ],
          'text-halo-color': [
            'case',
            isProject,
            background,
            [
              'case',
              ['==', ['feature-state', 'hover'], true],
              hinted,
              background,
            ],
          ],
          'text-halo-width': 2,
        },
      },
    ]
  }, [project.project_id, color, secondary, primary, background, hinted])

  const mapControlStyles = useMemo(
    () => ({
      '& .maplibregl-control-container': {
        fontSize: [0, 0, 0, 0],
        fontFamily: 'faux',
        letterSpacing: 'faux',
        '& [class*="maplibregl-ctrl-"]': { zIndex: 0 },
        '& .maplibregl-ctrl-attrib': {
          bg: 'hinted',
          alignItems: 'center',
          border: `1px solid`,
          borderColor: 'muted',
          color: 'secondary',
          display: 'flex',
          '& a': { color: 'secondary' },
          '& .maplibregl-ctrl-attrib-button': {
            bg: 'hinted',
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill-rule='evenodd' viewBox='0 0 20 20'%3E%3Cpath fill='${encodeURIComponent(
              primary
            )}' d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E")`,
            '&:hover, &:focus-visible': {
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill-rule='evenodd' viewBox='0 0 20 20'%3E%3Cpath fill='${encodeURIComponent(
                secondary
              )}' d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E")`,
            },
          },
        },
        '& .maplibregl-ctrl-group': {
          marginBottom: 0,
          bg: 'hinted',
          border: `1px solid`,
          borderColor: 'muted',
          borderRadius: '20px',
          boxShadow: 'none',
          overflow: 'hidden',
          '& button': {
            bg: 'hinted',
            border: 'none',
            borderBottom: `1px solid`,
            borderColor: 'muted',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:last-child': {
              borderBottom: 'none',
            },
            '& .maplibregl-ctrl-icon': {
              backgroundSize: '20px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            },
          },
          '& .maplibregl-ctrl-zoom-in .maplibregl-ctrl-icon': {
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath stroke='${encodeURIComponent(
              primary
            )}' stroke-width='2' stroke-linecap='round' fill='none' d='M10 6v8M6 10h8'/%3E%3C/svg%3E")`,
          },
          '& .maplibregl-ctrl-zoom-in:hover .maplibregl-ctrl-icon, & .maplibregl-ctrl-zoom-in:focus-visible .maplibregl-ctrl-icon':
            {
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath stroke='${encodeURIComponent(
                secondary
              )}' stroke-width='2' stroke-linecap='round' fill='none' d='M10 6v8M6 10h8'/%3E%3C/svg%3E")`,
            },
          '& .maplibregl-ctrl-zoom-out .maplibregl-ctrl-icon': {
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath stroke='${encodeURIComponent(
              primary
            )}' stroke-width='2' stroke-linecap='round' fill='none' d='M6 10h8'/%3E%3C/svg%3E")`,
          },
          '& .maplibregl-ctrl-zoom-out:hover .maplibregl-ctrl-icon, & .maplibregl-ctrl-zoom-out:focus-visible .maplibregl-ctrl-icon':
            {
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath stroke='${encodeURIComponent(
                secondary
              )}' stroke-width='2' stroke-linecap='round' fill='none' d='M6 10h8'/%3E%3C/svg%3E")`,
            },
        },
      },
    }),
    [primary, secondary]
  )

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const setFeatureHover = (featureId, hover) => {
      if (!featureId || !map.current) return
      const layers = [BOUNDARY_LAYER_ID, CENTROIDS_LAYER_ID]
      layers.forEach((sourceLayer) => {
        map.current.setFeatureState(
          { source: 'project-boundaries', sourceLayer, id: featureId },
          { hover }
        )
      })
    }

    const clearHover = () => {
      if (hoveredFeatureId.current) {
        setFeatureHover(hoveredFeatureId.current, false)
        hoveredFeatureId.current = null
      }
      hoveredFeature.current = null
      if (map.current) {
        map.current.getCanvas().style.cursor = ''
      }
      setMarkerVisible(false)
    }

    const updateHover = (feature) => {
      const featureId = feature.id || feature.properties.project_id
      const featureProjectId = feature.properties?.project_id
      if (featureId !== hoveredFeatureId.current) {
        clearHover()
        hoveredFeatureId.current = featureId
        setFeatureHover(featureId, true)
      }
      if (featureProjectId !== project.project_id) {
        map.current.getCanvas().style.cursor = 'pointer'
      }
    }

    const updateMarkerPosition = (feature) => {
      if (!markerRef.current || !feature) {
        hoveredFeature.current = null
        return
      }

      const projectId = feature.properties?.project_id
      if (projectId === project.project_id) {
        setMarkerVisible(false)
        hoveredFeature.current = null
        return
      }

      hoveredFeature.current = feature
      const coords = feature.geometry.coordinates
      const point = map.current.project(coords)

      const fontSize = 16
      const letterSpacing = 0.02 // em
      const charWidth = fontSize * (0.55 + letterSpacing)
      const textWidth = projectId.length * charWidth
      const offsetX = textWidth / 2 + 8

      const offsetPoint = map.current.unproject([point.x + offsetX, point.y])
      markerRef.current.setLngLat(offsetPoint)
      setMarkerVisible(true)
    }

    const handleZoom = () => {
      if (hoveredFeature.current) {
        updateMarkerPosition(hoveredFeature.current)
      }
    }

    const handleMouseMove = (event) => {
      // Query both layers, prioritize labels over fills
      const labels = map.current.queryRenderedFeatures(event.point, {
        layers: ['project-centroids-label'],
      })
      if (labels[0]) {
        updateHover(labels[0])
        updateMarkerPosition(labels[0])
        return
      }

      const tolerance = 3
      const bbox = [
        [event.point.x - tolerance, event.point.y - tolerance],
        [event.point.x + tolerance, event.point.y + tolerance],
      ]
      const fills = map.current.queryRenderedFeatures(bbox, {
        layers: ['project-boundaries-fill'],
      })
      if (fills[0]) {
        updateHover(fills[0])
        // Find the visible centroid label for this project to position the marker
        const projectId = fills[0].properties?.project_id
        const centroids = map.current.queryRenderedFeatures(undefined, {
          layers: ['project-centroids-label'],
          filter: ['==', ['get', 'project_id'], projectId],
        })
        if (centroids[0]) {
          updateMarkerPosition(centroids[0])
        } else {
          setMarkerVisible(false)
        }
      } else {
        clearHover()
      }
    }

    const handleClick = (event) => {
      const clickedProjectId = event.features?.[0]?.properties?.project_id
      if (clickedProjectId && clickedProjectId !== project.project_id) {
        router.push(`/projects/${clickedProjectId}`)
      }
    }

    const protocol = new Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      bounds,
      fitBoundsOptions: { padding: 10 },
      scrollZoom: false,
      style: {
        version: 8,
        glyphs:
          'https://carbonplan-maps.s3.us-west-2.amazonaws.com/basemaps/fonts/{fontstack}/{range}.pbf',
        sources: {
          basemap: {
            type: 'vector',
            url: `pmtiles://${BASEMAP_PMTILES_URL}`,
            attribution:
              '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
          'project-boundaries': {
            type: 'vector',
            url: `pmtiles://${BOUNDARY_PMTILES_URL}`,
            promoteId: 'project_id',
            attribution:
              '<a href="https://www.nature.com/articles/s41597-025-04868-2">Karnik et al. (2025)</a>',
          },
        },
        layers: mapLayers,
      },
      attributionControl: false,
    })

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    )

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-right'
    )

    map.current.on('load', () => {
      projectLayers
        .filter((layer) => layer.id !== 'project-centroids-label')
        .forEach((layer) => map.current.addLayer(layer, 'address_label'))

      const labelLayer = projectLayers.find(
        (layer) => layer.id === 'project-centroids-label'
      )
      if (labelLayer) map.current.addLayer(labelLayer)

      const el = document.createElement('div')
      markerRef.current = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([0, 0])
        .addTo(map.current)
      setMarkerEl(el)

      map.current.on('mousemove', handleMouseMove)
      map.current.on('zoom', handleZoom)
      map.current.on('click', 'project-boundaries-fill', handleClick)
      map.current.on('click', 'project-centroids-label', handleClick)
    })

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && map.current) {
        map.current.scrollZoom.enable()
      }
    }

    const handleKeyUp = (e) => {
      if (!e.metaKey && !e.ctrlKey && map.current) {
        map.current.scrollZoom.disable()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      setMarkerEl(null)
      if (map.current) {
        clearHover()
        map.current.remove()
        map.current = null
      }
      maplibregl.removeProtocol?.('pmtiles')
    }
  }, [bounds, projectLayers, mapLayers, project.project_id, router])

  return (
    <>
      <Box
        ref={mapContainer}
        sx={{
          mt: 5,
          width: '100%',
          height: ['300px', '300px', '500px', '500px'],
          border: '1px solid',
          borderColor: 'muted',
          ...mapControlStyles,
        }}
      />
      {markerEl &&
        createPortal(
          <Arrow
            sx={{
              width: 14,
              height: 14,
              color: 'primary',
              display: 'block',
              opacity: markerVisible ? 1 : 0,
              pointerEvents: 'none',
              filter: `drop-shadow(0 0 2px ${hinted}) drop-shadow(0 0 2px ${hinted})`,
            }}
          />,
          markerEl
        )}
    </>
  )
}

export default Map
