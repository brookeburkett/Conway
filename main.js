const WIDTH = 32
const HEIGHT = 32

let INTERVALID

let instance = conway(WIDTH, HEIGHT)

let state = Array(WIDTH * HEIGHT).fill(0)

let canvas = document.getElementById('canvas')
canvas.width = instance.canvaswidth
canvas.height = instance.canvasheight

let ctx = canvas.getContext('2d')

let getXYFromIndex = (index) => {
	let y = parseInt(index / WIDTH)
	let x = index - ( y * WIDTH )	
	return [x, y]
}

let getIndexFromXY = (x, y) => {
	return (y * WIDTH) + x
}

let getCursorPosition = (canvas, event) => {
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	return [x, y]
}

let render = () => {
	ctx.fillStyle = '#FFF'
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	state.forEach((cell, index) => {
		let [x, y] = getXYFromIndex(index)
		if(cell) ctx.fillRect(x * (instance.cellsize + 1), y * (instance.cellsize + 1), instance.cellsize, instance.cellsize)
	})
}



let step = () => {
	state = instance.tick(state)
	render()
}

let play = () => {
	INTERVALID = setInterval(step, 500)
}

let stop = () => {
	clearInterval(INTERVALID)
}

document.getElementById('step').onclick = step
document.getElementById('play').onclick = play
document.getElementById('stop').onclick = stop

canvas.addEventListener('mousedown', (e) => {
	let [x, y] = getCursorPosition(canvas, e)
	let cellx = parseInt(x / (instance.cellsize + 1))
	let celly = parseInt(y / (instance.cellsize + 1))
	let index = getIndexFromXY(cellx, celly)
	state[index] = !state[index]
	render()
})
render()