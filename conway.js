/*
* a simple implementation of conway's game of life, in which each state of the game
* is processed as text as well. this has no inherent purpose, but provides an
* interesting toy to examine how we can interpret the advancing state of the game
* in ways that may be used for communication, in a one-time use manner.
*
* How does it work?
* Naive first pass:
* the state will be a 64x64 grid of cells that are either alive or dead(1 or 0)
* these cells will be grouped in 8, and will be converted into bytes. Those will
* then further be converted into the ascii equivalent.
* i suspect though that this will result in almost everything outside the ascii
* range, and some sort of shrinking/modification will need to be made.
* if that's the case, the algorithm to shrink/adjust should be dead simple
* and intuitive. I want to avoid having any amount of the mystery in that mechanism
*/

const CELLSIZE = 16

let conway = (w, h) => {
  // these are the actual size of the canvas
  // w and h are the width in cells, and the height in cells, of the grid
  let canvas_width = w * (CELLSIZE+1)
  let canvas_height = h * (CELLSIZE+1)

  let tick = (state) => {
    /* tick is going to run one tick of the ruleset of conways game of life
    * on the "state", which is a single dimension array
    * a condensed ruleset, and the one I will be using, is as follows:
    * 1. any live cell with 2 or 3 neighbors survives.
    * 2. any dead cell with 3 live neighbors becomes alive.
    * 3. all other cells die, or stay dead
    * 
    * in which a neighbor is one of the 8 cells surrounding a cell.
    */
    let livingNeighbors = (index) => {
      /* find the number of living neighbors
      * taking into account boundaries defined by w & h.
      *     6  7  8    where c is the current cell
      *     4  c  5       
      *     1  2  3  
      */

      // if index is a multiple of w, we're on the right wall
      const RIGHT_WALL_CHECK = (index+1) % w === 0 && index !== 0
      // if index is one right after right wall, we're on the next line in first position
      const LEFT_WALL_CHECK = (index+1) % w === 1 || index === 0
      // if we are on the first row
      const TOP_WALL_CHECK = (index+1) <= w
      // if we are on the last row
      // w * h = number of cells, and length of the state.
      // (w * h) - w gives us the end of the second to last row, so anything
      // greater is the last row.
      const BOTTOM_WALL_CHECK = (index+1) > (w * h) - w

      let positions = [
         (index + w) - 1, // position 1, go to next row and back one
         index + w, // position 2
         (index + w) + 1, // position 3
         index - 1, // position 4
         index + 1, // position 5
         (index - w) - 1, // position 6
         index - w, // position 7
         (index - w) + 1, // position 8
      ]
      let checks = [
        (BOTTOM_WALL_CHECK || LEFT_WALL_CHECK), // 1 am i against the bottom or left
        BOTTOM_WALL_CHECK, // 2 am i against the bottom
        (BOTTOM_WALL_CHECK || RIGHT_WALL_CHECK), // 3 am i against the bottom or right
        LEFT_WALL_CHECK, // 4 am i against the left
        RIGHT_WALL_CHECK, // 5 am i against the right
        (TOP_WALL_CHECK || LEFT_WALL_CHECK), // 6 am i against the top or left
        TOP_WALL_CHECK, // 7 am i against the top
        (TOP_WALL_CHECK || RIGHT_WALL_CHECK), // 8 am i against the top or right
      ]
      return positions
        .map((position, i) => !checks[i] ? state[position] : 0) // if it doesn't pass, make it 0
        .reduce((a, b) => a + b, 0) // sum all the values to determine the number of living neighbors
    }

    // tick begins
    return state.map((cell, index) => {
      let neighborcount = livingNeighbors(index)
      if(isNaN(neighborcount)) console.log(index, neighborcount)
      if ( cell && (neighborcount === 2 || neighborcount === 3) ) { // rule 1
        return 1 // cell lives
      }
      else if ( !cell && neighborcount === 3 ) { // rule 2
        return 1 // cell lives
      }
      else { // rule 3
        return 0 // cell dies
      }
    })
  }
  return {
    width: w,
    height: h, 
    canvasheight: canvas_height,
    canvaswidth: canvas_width,
    cellsize: CELLSIZE,
    tick: tick
  }
}