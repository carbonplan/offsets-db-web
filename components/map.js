import { useEffect, useRef } from 'react'
import { Box, get, useThemeUI } from 'theme-ui'
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

const Map = ({ project }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const mapLayers = useMapTheme()
  const { theme } = useThemeUI()

  const colorName = COLORS[getProjectCategory(project)] ?? COLORS.other
  const color = get(theme, `rawColors.${colorName}`, colorName)
  const secondary = get(theme, 'rawColors.secondary')
  const attributionControl = useRef(null)
  const mapControlStyles = {
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
  }
  const bounds = [
    [project.bbox.xmin, project.bbox.ymin],
    [project.bbox.xmax, project.bbox.ymax],
  ]

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const setupMap = async () => {
      const protocol = new Protocol()
      maplibregl.addProtocol('pmtiles', protocol.tile)

      const isProject = ['==', ['get', 'project_id'], project.project_id]
      const boundaryLayers = [
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
            'line-width': ['case', isProject, 1, 0.1],
          },
        },
      ]

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
              attribution: 'CarbonPlan, TK ref/link',
            },
          },
          layers: [...mapLayers, ...boundaryLayers],
        },
        attributionControl: false,
      })

      attributionControl.current = new maplibregl.AttributionControl({
        compact: true,
      })
      map.current.addControl(attributionControl.current, 'bottom-right')
    }

    setupMap()

    return () => {
      if (map.current) {
        if (attributionControl.current) {
          try {
            map.current.removeControl(attributionControl.current)
          } catch (err) {
            console.error('Error removing attribution control', err)
          }
        }
        map.current.remove()
        map.current = null
      }
      if (maplibregl.removeProtocol) {
        maplibregl.removeProtocol('pmtiles')
      }
    }
  }, [project.bbox, project.project_id, color, bounds, mapLayers])

  return (
    <Box
      ref={mapContainer}
      sx={{
        width: '100%',
        height: '400px',
        ...mapControlStyles,
      }}
    />
  )
}

export default Map
