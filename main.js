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

    return this
  }

  append() {
    this.container.appendChild(this.htmlElement)
  }

  move() {
    this.velocity.y += this.acceleration * this.time
    this.position.y += this.velocity.y * this.time + (this.acceleration * this.time * this.time) / 2
    if (this.position.y >= this.position.maxY) {
      this.position.y = this.position.maxY
      this.velocity.y = -1 * this.velocity.y
    }
    if (this.position.y <= 0) {
      this.position.y = 0
      this.velocity.y = 0
      this.velocity.x = 0
    }

    this.position.x += this.velocity.x * this.time
    if (this.position.x <= 0 || this.position.x >= this.position.maxX) {
      this.position.x <= 0 ? (this.position.x = 0) : (this.position.x = this.position.maxX)
      this.velocity.x = -1 * this.velocity.x
    }

    this.render()
  }

  render() {
    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'
  }

  getPower() {
    this.htmlElement.addEventListener('mousedown', () => (this.allowShot = 1))

    const ballCenterY = ball.htmlElement.getBoundingClientRect().y + this.diameter / 2
    const ballCenterX = ball.htmlElement.getBoundingClientRect().x + this.diameter / 2

    document.addEventListener('mouseup', evt => {
      if (this.allowShot) {
        this.velocity.x = (ballCenterX - evt.pageX) * 3
        console.log(ballCenterX - evt.pageX)
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
      this.allowShot = 0
    })
  }
}

const ball = new Ball(document.querySelector('.container'), 30)

ball.init().append()
ball.getPower()

setInterval(ball.move.bind(ball), 40)
