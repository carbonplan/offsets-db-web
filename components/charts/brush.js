import { useChart } from '@carbonplan/charts'
import { Box } from 'theme-ui'
import { select } from 'd3-selection'
import { brushSelection, brushX } from 'd3-brush'
import { useEffect, useRef } from 'react'

const Brush = ({ clear, setBounds }) => {
  const g = useRef(null)
  const brush = useRef(null)
  const { x } = useChart()

  useEffect(() => {
    if (g.current) {
      brush.current = brushX()
        .extent([
          [0, 0],
          [100, 100],
        ])
        .on('start brush', (e) => {
          if (!e.selection) {
            return
          }
          if (e.selection[0] == e.selection[1]) {
            setBounds(null)
          } else {
            setBounds(
              [x.invert(e.selection[0]), x.invert(e.selection[1])].map(
                Math.round
              )
            )
          }
        })

      select(g.current).call(brush.current)
    }
  }, [x])

  useEffect(() => {
    if (clear && g.current && brush.current) {
      const selection = brushSelection(g.current)
      if (selection) {
        select(g.current).call(brush.current.clear)
      }
    }
  }, [clear])

  return (
    <Box
      as='g'
      ref={g}
      sx={{ '.selection': { stroke: 'none', fill: 'secondary', opacity: 0.8 } }}
    />
  )
}

export default Brush
