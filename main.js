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

    this.velocity = {
      y: 200,
      x: 300,
      maxVelocity: 600
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
}

const ball = new Ball(document.querySelector('.container'), 30)

ball.init().append()
