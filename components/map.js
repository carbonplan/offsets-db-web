import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Box, get, useThemeUI } from 'theme-ui'
import { Badge } from '@carbonplan/components'
import { Arrow } from '@carbonplan/icons'
import { useRouter } from 'next/router'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Protocol } from 'pmtiles'
import {
  BOUNDARY_PMTILES_URL,
  BASEMAP_PMTILES_URL,
  BOUNDARY_LAYER_ID,
  COLORS,
} from './constants'
import { useMapTheme } from './use-map-theme'
import { getProjectCategory } from './utils'

const createBoundaryLayers = (projectId, color, secondary) => {
  const isProject = ['==', ['get', 'project_id'], projectId]
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
          ['==', ['feature-state', 'hover'], true],
          ['case', isProject, 1, 1],
          ['case', isProject, 1, 0.1],
        ],
      },
    },
  ]
}

const Map = ({ project }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popup = useRef(null)
  const popupContainerRef = useRef(null)
  const boundaryEventsCleanup = useRef(null)
  const mapLayers = useMapTheme()
  const [hoveredProjectId, setHoveredProjectId] = useState(null)
  const { theme } = useThemeUI()
  const router = useRouter()

  const colorName = COLORS[getProjectCategory(project)] ?? COLORS.other
  const color = get(theme, `rawColors.${colorName}`, colorName)
  const secondary = get(theme, 'rawColors.secondary')

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
              secondary
            )}' d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E")`,
          },
        },
      },
      '& .maplibregl-popup': {
        zIndex: 1,
        pointerEvents: 'none',
      },
      '& .maplibregl-popup-content': {
        padding: 0,
        background: 'transparent',
        boxShadow: 'none',
        pointerEvents: 'none',
      },
      '& .maplibregl-popup-tip': {
        display: 'none',
      },
    }),
    [secondary]
  )
  const bounds = useMemo(
    () => [
      [project.bbox.xmin, project.bbox.ymin],
      [project.bbox.xmax, project.bbox.ymax],
    ],
    [project.bbox]
  )

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    let hoveredFeatureId = null

    const setFeatureHover = (featureId, hover) => {
      if (!featureId || !map.current) return
      map.current.setFeatureState(
        {
          source: 'project-boundaries',
          sourceLayer: BOUNDARY_LAYER_ID,
          id: featureId,
        },
        { hover }
      )
    }

    const clearHoveredFeature = () => {
      if (!hoveredFeatureId) return
      setFeatureHover(hoveredFeatureId, false)
      hoveredFeatureId = null
    }

    const clearHoverInteraction = (shouldClearContainer = false) => {
      clearHoveredFeature()
      map.current.getCanvas().style.cursor = ''
      setHoveredProjectId(null)
      if (shouldClearContainer) {
        popupContainerRef.current = null
      }
      if (popup.current) {
        popup.current.remove()
      }
    }

    const ensurePopupContainer = () => {
      if (!popupContainerRef.current) {
        const container = document.createElement('div')
        popupContainerRef.current = container
      }
      return popupContainerRef.current
    }

    const queryHoveredFeature = (event) => {
      const tolerance = 3
      const bbox = [
        [event.point.x - tolerance, event.point.y - tolerance],
        [event.point.x + tolerance, event.point.y + tolerance],
      ]
      const features = map.current.queryRenderedFeatures(bbox, {
        layers: ['project-boundaries-fill'],
      })
      return features[0] || null
    }

    const handleHover = (feature, lngLat) => {
      const projectId = feature.properties.project_id
      const featureId = feature.id || feature.properties.project_id

      if (featureId && featureId !== hoveredFeatureId) {
        clearHoveredFeature()
        hoveredFeatureId = featureId
        setFeatureHover(featureId, true)
      }

      map.current.getCanvas().style.cursor = 'pointer'
      ensurePopupContainer()
      setHoveredProjectId((prev) => (prev === projectId ? prev : projectId))

      popup.current
        .setLngLat(lngLat)
        .setDOMContent(popupContainerRef.current)
        .addTo(map.current)
    }

    const attachBoundaryEvents = () => {
      const handleMouseMove = (event) => {
        const feature = queryHoveredFeature(event)
        if (!feature) {
          clearHoverInteraction()
          return
        }
        handleHover(feature, event.lngLat)
      }

      const handleMouseLeave = () => clearHoverInteraction(true)

      const handleClick = (event) => {
        const feature = event.features?.[0]
        const clickedProjectId = feature?.properties?.project_id
        if (clickedProjectId && clickedProjectId !== project.project_id) {
          router.push(`/projects/${clickedProjectId}`)
        }
      }

      map.current.on('mousemove', 'project-boundaries-fill', handleMouseMove)
      map.current.on('mouseleave', 'project-boundaries-fill', handleMouseLeave)
      map.current.on('click', 'project-boundaries-fill', handleClick)

      return () => {
        map.current.off('mousemove', 'project-boundaries-fill', handleMouseMove)
        map.current.off(
          'mouseleave',
          'project-boundaries-fill',
          handleMouseLeave
        )
        map.current.off('click', 'project-boundaries-fill', handleClick)
      }
    }

    const setupMap = async () => {
      const protocol = new Protocol()
      maplibregl.addProtocol('pmtiles', protocol.tile)

      const boundaryLayers = createBoundaryLayers(
        project.project_id,
        color,
        secondary
      )

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        bounds,
        fitBoundsOptions: { padding: 10 },
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
              attribution:
                '<a href="https://www.nature.com/articles/s41597-025-04868-2">Karnik et al. (2025)</a>',
            },
          },
          layers: mapLayers,
        },
        attributionControl: false,
      })

      const attributionControl = new maplibregl.AttributionControl({
        compact: true,
      })
      map.current.addControl(attributionControl, 'bottom-right')

      popup.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 1,
      })

      map.current.on('load', () => {
        boundaryLayers.forEach((layer) => {
          map.current.addLayer(layer, 'address_label')
        })

        boundaryEventsCleanup.current = attachBoundaryEvents()
      })
    }

    setupMap()

    return () => {
      boundaryEventsCleanup.current?.()
      boundaryEventsCleanup.current = null

      popup.current?.remove()
      popup.current = null

      setHoveredProjectId(null)
      popupContainerRef.current = null

      if (map.current) {
        clearHoveredFeature()
        map.current.remove()
        map.current = null
      }

      maplibregl.removeProtocol?.('pmtiles')
    }
  }, [project.bbox, project.project_id, color, secondary, mapLayers])

  return (
    <>
      <Box
        ref={mapContainer}
        sx={{
          width: '100%',
          height: ['300px', '300px', '500px', '500px'],
          border: '1px solid',
          borderColor: 'muted',
          ...mapControlStyles,
        }}
      />
      {hoveredProjectId && popupContainerRef.current
        ? createPortal(
            <Badge
              sx={{
                color:
                  hoveredProjectId === project.project_id
                    ? colorName
                    : 'secondary',
                background: 'hinted',
                py: ['1px', '1px', '1px', '2px'],
              }}
            >
              {hoveredProjectId}
              {hoveredProjectId !== project.project_id && (
                <Arrow
                  sx={{
                    ml: 1,
                    width: [14, 14, 14, 16],
                    height: [14, 14, 14, 16],
                    mb: '-1px',
                  }}
                />
              )}
            </Badge>,
            popupContainerRef.current
          )
        : null}
    </>
  )
}

export default Map
