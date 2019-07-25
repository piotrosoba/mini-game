class Ball {
  constructor(container, diameter) {
    this.container = container || document.body
    this.diameter = diameter || 30
    this.position = {
      y: 0,
      maxY: this.container.offsetHeight - this.diameter,
      x: 0,
      maxX: this.container.offsetWidth - this.diameter
    }
    this.allowShot = 0

    this.velocity = {
      y: 0,
      x: 0,
      max: 600
    }
    this.acceleration = -120 // px/s^2
    this.timeTick = 40 //ms
    this.time = this.timeTick / 1000 // s

    this.htmlElement = null
  }

  init() {
    this.htmlElement = document.createElement('div')
    this.htmlElement.classList.add('ball')
    this.htmlElement.style.width = this.diameter + 'px'
    this.htmlElement.style.height = this.diameter + 'px'
    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'

    this.getPower()

    return this
  }

  append() {
    this.container.appendChild(this.htmlElement)
  }

  move() {
    this.velocity.y += this.acceleration * this.time
    this.position.y += this.velocity.y * this.time + (this.acceleration * this.time * this.time) / 2

    this.position.x += this.velocity.x * this.time
    if (this.position.x <= 0 || this.position.x >= this.position.maxX) {
      this.position.x <= 0 ? (this.position.x = 0) : (this.position.x = this.position.maxX)
      this.velocity.x = -1 * this.velocity.x
    }

    if (this.position.y >= this.position.maxY) {
      this.position.y = this.position.maxY
      this.velocity.y = -1 * this.velocity.y
    }
    if (this.position.y <= 0) {
      this.position.y = 0
      this.velocity.y = 0
      this.velocity.x = 0
    }

    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'
  }

  getPower() {
    let ballCenterX
    let ballCenterY

    const line = document.createElement('div')
    line.classList.add('line')
    this.htmlElement.appendChild(line)

    this.htmlElement.addEventListener('mousedown', () => {
      if (!this.velocity.y) this.allowShot = 1
      ballCenterY = ball.htmlElement.getBoundingClientRect().y + this.diameter / 2
      ballCenterX = ball.htmlElement.getBoundingClientRect().x + this.diameter / 2
    })

    document.addEventListener('mouseup', evt => {
      if (this.allowShot === 1) {
        this.velocity.x = (ballCenterX - evt.pageX) * 3
        if (Math.abs(this.velocity.x) > this.velocity.max) {
          this.velocity.x >= 0
            ? (this.velocity.x = this.velocity.max)
            : this.velocity !== 0 && (this.velocity.x = -1 * this.velocity.max)
        }

        this.velocity.y = (evt.pageY - ballCenterY) * 3
        if (Math.abs(this.velocity.y) > this.velocity.max) {
          this.velocity.y = this.velocity.max
        }
      }
      line.style.width = 0
      this.allowShot = 0
    })

    document.addEventListener('mousemove', evt => {
      if (this.allowShot) {
        const lineX = evt.pageX - ballCenterX
        const lineY = evt.pageY - ballCenterY
        let lineWidth = Math.sqrt(Math.pow(lineX, 2) + Math.pow(lineY, 2)) - 10
        if (lineWidth > 200) lineWidth = 200
        const deg = lineX >= 0 ? Math.atan(lineY / lineX) : Math.atan(lineY / lineX) + Math.PI

        line.style.width = lineWidth + 'px'
        line.style.transform = 'rotate(' + deg + 'rad)'
      }
    })
  }
}

const ball = new Ball(document.querySelector('.container'), 30)

ball.init().append()

setInterval(ball.move.bind(ball), 40)
