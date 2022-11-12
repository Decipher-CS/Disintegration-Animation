// Tutorial To Follow:
// https://www.youtube.com/watch?v=vAJEHf92tV0
window.addEventListener('load', function () {
    const gameBoard = document.getElementById('game_board') as HTMLCanvasElement
    const ctx = gameBoard!.getContext('2d')
    gameBoard.height = window.innerHeight - 100
    gameBoard.width = window.innerHeight - 100

    interface Particle {
        particleLocationX: number
        particleLocationY: number
        size: number
        effect: Effect
        vx: number
        vy: number
        dx: number
        dy: number
        force: number
        distance: number
        angle: number
        originX: number
        originY: number
        color: string
        ease: number
        friction: number
    }

    class Particle {
        constructor(effect: Effect, x: number, y: number, color: string) {
            this.effect = effect
            this.particleLocationX = Math.random() * this.effect.width
            this.particleLocationY = Math.random() * this.effect.height
            // this.particleLocationX = x
            // this.particleLocationY = y
            this.originX = Math.floor(x)
            this.originY = Math.floor(y)
            this.color = color
            this.size = this.effect.gap
            this.vx = 0
            this.vy = 0
            this.ease = 0.1
            this.dx = 0
            this.dy = 0
            this.distance = 0
            this.force = 0
            this.angle = 0
            this.friction = 0.8
        }
        draw(context: CanvasRenderingContext2D | null) {
            context && (context.fillStyle = this.color)
            context?.fillRect(this.particleLocationX, this.particleLocationY, this.size, this.size)
        }
        update() {
            this.dx = this.effect.mouse.x - this.particleLocationX
            this.dy = this.effect.mouse.y - this.particleLocationY
            this.distance = this.dx * this.dx + this.dy * this.dy
            this.force = -this.effect.mouse.radius / this.distance

            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx)
                this.vx += this.force * Math.cos(this.angle)
                this.vy += this.force * Math.sin(this.angle)
            }

            this.particleLocationX += (this.vx *= this.friction) + (this.originX - this.particleLocationX) * this.ease
            this.particleLocationY += (this.vy *= this.friction) + (this.originY - this.particleLocationY) * this.ease
        }
        distort() {
            this.particleLocationX = Math.random() * this.effect.width
            this.particleLocationY = Math.random() * this.effect.height
            this.ease = 0.1
        }
    }

    interface Effect {
        width: number
        height: number
        image: HTMLImageElement
        centerX: number
        centerY: number
        imageX: number
        imageY: number
        particleArray: Particle[]
        gap: number
        mouse: {
            radius: number
            x: number
            y: number
        }
    }
    class Effect {
        constructor(width: number, height: number) {
            this.width = width
            this.height = height
            this.image = document.getElementById('canvas_image') as HTMLImageElement
            this.centerX = this.width * 0.5
            this.centerY = this.height * 0.5
            this.imageX = this.centerX - this.image.width * 0.5
            this.imageY = this.centerY - this.image.height * 0.5
            this.particleArray = []
            this.gap = 3
            this.mouse = {
                radius: 3000,
                x: 0,
                y: 0,
            }
            window.addEventListener('mousemove', (e) => {
                const offsetX = (window.innerWidth - this.width) / 2
                const offsetY = (window.innerHeight - this.height) / 2
                this.mouse.x = e.x - offsetX
                this.mouse.y = e.y - offsetY
            })
        }
        init(context: CanvasRenderingContext2D | null) {
            context?.drawImage(this.image, this.imageX, this.imageY)
            const pixels = context!.getImageData(0, 0, this.width, this.height).data
            for (let y = 0; y < this.height; y += this.gap) {
                for (let x = 0; x < this.height; x += this.gap) {
                    const index = (y * this.width + x) * 4
                    const red = pixels[index + 0]
                    const green = pixels[index + 1]
                    const blue = pixels[index + 2]
                    const alpha = pixels[index + 3]
                    const color = `rgb(${red}, ${green}, ${blue})`
                    if (alpha > 0) {
                        this.particleArray.push(new Particle(this, x, y, color))
                    }
                }
            }
        }
        draw(context: CanvasRenderingContext2D | null) {
            this.particleArray.forEach((p) => p.draw(context))
        }
        update() {
            this.particleArray.forEach((p) => p.update())
        }
        distort() {
            this.particleArray.forEach((p) => p.distort())
        }
    }

    const effect = new Effect(gameBoard.width, gameBoard.height)
    effect.init(ctx)

    function animate() {
        ctx?.clearRect(0, 0, gameBoard.width, gameBoard.height)
        effect.draw(ctx)
        effect.update()
        requestAnimationFrame(animate)
    }
    animate()
})

export {}
