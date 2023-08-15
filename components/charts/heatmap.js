import { useChart } from '@carbonplan/charts'
import { Box } from 'theme-ui'
import { mix } from 'polished'

import { COLORS } from '../constants'

const CATEGORY_ORDER = Object.keys(COLORS)

export const mungeData = (data, theme, max, key, background, mixer) => {
  if (!data) {
    return []
  } else {
    return data
      .map(({ start, end, category, value }) => {
        if (start != null && end != null) {
          const year = new Date(`${start}T00:00:00`).getFullYear()
          const datum = [year, 8 - CATEGORY_ORDER.indexOf(category)]
          const color = mixer
            ? mix(
                0.25,
                theme.rawColors[COLORS[category]],
                theme.rawColors[mixer]
              )
            : theme.rawColors[COLORS[category]]

          return {
            key,
            value: datum,
            color: mix(Math.min((value * 10) / max, 1), color, background),
          }
        } else {
          return null
        }
      }, {})
      .filter(Boolean)
  }
}

const Heatmap = ({ data, size = 10 }) => {
  const { x, y } = useChart()

  return (
    <>
      {data.map(({ key, value, color }) => (
        <Box
          key={`${key}-${value.join(',')}`}
          as='path'
          d={`M${x(value[0])} ${y(value[1])} A0 0 0 0 1 ${
            x(value[0]) + 0.0001
          } ${y(value[1]) + 0.0001}`}
          sx={{
            transition: 'stroke 0.15s',
            stroke: color,
            strokeWidth: size,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none',
            pointerEvents: 'none',
            vectorEffect: 'non-scaling-stroke',
          }}
        />
      ))}
    </>
  )
}

export default Heatmap
