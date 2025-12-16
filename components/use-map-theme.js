import { useMemo } from 'react'
import { useColorMode, useThemeUI, get } from 'theme-ui'
import { layers, namedFlavor } from '@protomaps/basemaps'

const language = 'en'

export const useMapTheme = () => {
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const isDark = colorMode === 'dark'
  const flavorName = isDark ? 'black' : 'white'
  const transparent = 'transparent'
  const hinted = get(theme, 'rawColors.hinted')
  const primary = get(theme, 'rawColors.primary')
  const muted = get(theme, 'rawColors.muted')
  const background = get(theme, 'rawColors.background')
  const secondary = get(theme, 'rawColors.secondary')

  const mapTheme = useMemo(
    () => ({
      ...namedFlavor(flavorName),
      buildings: muted,
      background: transparent,
      park_a: transparent,
      park_b: transparent,
      hospital: transparent,
      industrial: transparent,
      school: transparent,
      wood_a: transparent,
      wood_b: transparent,
      pedestrian: transparent,
      scrub_a: transparent,
      scrub_b: transparent,
      glacier: transparent,
      sand: transparent,
      beach: transparent,
      aerodrome: transparent,
      runway: transparent,
      earth: transparent,
      zoo: transparent,
      military: transparent,

      landcover: {
        barren: transparent,
        farmland: transparent,
        forest: transparent,
        glacier: transparent,
        grassland: transparent,
        scrub: transparent,
        urban_area: transparent,
      },

      water: hinted,

      bridges_other_casing: background,
      bridges_minor_casing: background,
      bridges_link_casing: background,
      bridges_major_casing: background,
      bridges_highway_casing: background,
      bridges_other: muted,
      bridges_minor: muted,
      bridges_link: muted,
      bridges_major: muted,
      bridges_highway: muted,

      minor_service_casing: background,
      minor_casing: background,
      link_casing: background,
      major_casing_late: background,
      highway_casing_late: background,
      other: muted,
      minor_service: muted,
      minor_a: muted,
      minor_b: muted,
      link: muted,
      major_casing_early: background,
      major: muted,
      highway_casing_early: background,
      highway: muted,
      pier: muted,

      railway: muted,
      boundaries: muted,

      roads_label_minor: muted,
      roads_label_minor_halo: background,
      roads_label_major: muted,
      roads_label_major_halo: background,
      ocean_label: muted,
      subplace_label: [
        'interpolate',
        ['linear'],
        ['zoom'],
        12,
        muted,
        22,
        primary,
      ],
      subplace_label_halo: background,
      city_label: [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        muted,
        12,
        secondary,
      ],
      city_label_halo: background,
      state_label: [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        muted,
        12,
        secondary,
      ],
      state_label_halo: background,
      country_label: [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        muted,
        12,
        secondary,
      ],

      address_label: muted,
      address_label_halo: background,

      regular: 'Relative Pro Book',
      bold: 'Relative Pro Book',
      italic: 'Relative Pro Book',
    }),
    [flavorName, hinted, muted, background, primary]
  )

  const mapLayers = useMemo(() => {
    const baseLayers = layers('basemap', mapTheme, {
      lang: language,
    })

    return baseLayers.map((layer) => {
      if (layer.id === 'places_locality' && layer.type === 'symbol') {
        return {
          ...layer,
          layout: {
            ...layer.layout,
            'text-anchor': 'center',
            'text-justify': 'center',
          },
        }
      }
      return layer
    })
  }, [mapTheme])

  return mapLayers
}

export default useMapTheme
