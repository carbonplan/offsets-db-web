import React, { useEffect, useMemo, useRef } from 'react'
import { Box, get, useThemeUI } from 'theme-ui'
import { useRouter } from 'next/router'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Protocol } from 'pmtiles'
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
          'text-font': ['Relative Pro Book'],
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
              secondary
            )}' d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E")`,
          },
        },
      },
    }),
    [secondary]
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
      if (map.current) {
        map.current.getCanvas().style.cursor = ''
      }
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

    const handleMouseMove = (event) => {
      const tolerance = 3
      const bbox = [
        [event.point.x - tolerance, event.point.y - tolerance],
        [event.point.x + tolerance, event.point.y + tolerance],
      ]
      const features = map.current.queryRenderedFeatures(bbox, {
        layers: ['project-boundaries-fill'],
      })
      features[0] ? updateHover(features[0]) : clearHover()
    }

    const handleMouseEnter = (event) => {
      const feature = event.features?.[0]
      if (feature) updateHover(feature)
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

    map.current.on('load', () => {
      // Add boundary layers before address labels
      projectLayers
        .filter((layer) => layer.id !== 'project-centroids-label')
        .forEach((layer) => map.current.addLayer(layer, 'address_label'))

      // Add centroid labels on top of everything
      const labelLayer = projectLayers.find(
        (layer) => layer.id === 'project-centroids-label'
      )
      if (labelLayer) map.current.addLayer(labelLayer)

      map.current.on('mousemove', 'project-boundaries-fill', handleMouseMove)
      map.current.on('mouseleave', 'project-boundaries-fill', clearHover)
      map.current.on('click', 'project-boundaries-fill', handleClick)
      map.current.on('mouseenter', 'project-centroids-label', handleMouseEnter)
      map.current.on('mouseleave', 'project-centroids-label', clearHover)
      map.current.on('click', 'project-centroids-label', handleClick)
    })

    return () => {
      if (map.current) {
        clearHover()
        map.current.remove()
        map.current = null
      }
      maplibregl.removeProtocol?.('pmtiles')
    }
  }, [bounds, projectLayers, mapLayers, project.project_id, router])

  return (
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
  )
}

export default Map
