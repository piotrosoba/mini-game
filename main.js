class Ball {
  constructor(container, radius, shotsCounter) {
    this.container = container || document.body
    this.radius = radius || 10
    this.shotsCounter = shotsCounter
    this.angle = 0
    this.position = {
      y: 0,
      maxY: this.container.offsetHeight - this.radius * 2 - 2,
      x: this.container.offsetWidth / 2 - this.radius,
      maxX: this.container.offsetWidth - this.radius * 2 - 2,
      center: {
        y: 0 + this.radius,
        x: 0 + this.radius
      }
    }
    this.allowShot = 0

    this.velocity = {
      y: 0,
      x: 0,
      max: 470
    }
    this.acceleration = -120 // px/s^2
    this.timeTick = 40 //ms
    this.time = this.timeTick / 1000 // s

    this.htmlElement = null
    this.htmlElementBackground = null
    this.htmlElementEyes = null
  }

  init() {
    this.htmlElement = document.createElement('div')
    this.htmlElement.classList.add('ball')
    this.htmlElement.style.width = this.radius * 2 + 'px'
    this.htmlElement.style.height = this.radius * 2 + 'px'
    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'
    this.htmlElement.style.transition = this.timeTick + 'ms'

    this.htmlElementBackground = document.createElement('div')
    this.htmlElementBackground.classList.add('ball-background')
    this.htmlElement.appendChild(this.htmlElementBackground)

    this.getPower()
    this.listeners()

    return this
  }

  append() {
    this.container.appendChild(this.htmlElement)
  }

  move() {
    this.velocity.y += this.acceleration * this.time
    this.position.y += this.velocity.y * this.time + (this.acceleration * this.time * this.time) / 2

    this.position.x += this.velocity.x * this.time
    if (this.position.x < 0 || this.position.x >= this.position.maxX) {
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

    this.position.center.x = this.position.x + this.radius
    this.position.center.y = this.position.y + this.radius

    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'
    if (this.position.y > 0) {
      this.htmlElementBackground.style.transform = `rotate(${this.angle}deg)`
      this.angle += 5
      if (this.angle >= 360) this.angle = 0
    }
  }

  backToCenter() {
    this.htmlElement.style.transition = '350ms'
    this.velocity.y = 0
    this.velocity.x = 0
    this.position.x = this.container.offsetWidth / 2 - this.radius
    this.position.y = 0
  }

  listeners() {
    this.container.addEventListener('click', evt => {
      if (this.position.y > 0) {
        this.backToCenter()
      }
    })
  }

  getPower() {
    let ballCenterX
    let ballCenterY

    const line = document.createElement('div')
    line.classList.add('line')
    this.htmlElement.appendChild(line)

    this.htmlElement.addEventListener('mousedown', evt => {
      evt.preventDefault()
      if (!this.velocity.y) this.allowShot = 1
      ballCenterY = this.htmlElement.getBoundingClientRect().y + this.radius
      ballCenterX = this.htmlElement.getBoundingClientRect().x + this.radius
    })

    document.addEventListener('mousemove', evt => {
      evt.preventDefault()
      if (this.allowShot) {
        const lineX = evt.pageX - ballCenterX
        const lineY = evt.pageY - ballCenterY
        let lineWidth = Math.sqrt(Math.pow(lineX, 2) + Math.pow(lineY, 2)) - 10
        if (lineWidth > 100) lineWidth = 100
        const deg = lineX >= 0 ? Math.atan(lineY / lineX) : Math.atan(lineY / lineX) + Math.PI

        line.style.width = lineWidth + 'px'
        line.style.transform = 'rotate(' + deg + 'rad)'
      }
    })

    document.addEventListener('mouseup', evt => {
      evt.preventDefault()
      if (this.allowShot === 1) {
        this.velocity.x = ((ballCenterX - evt.pageX) * this.velocity.max) / 100
        if (Math.abs(this.velocity.x) > this.velocity.max) {
          this.velocity.x >= 0
            ? (this.velocity.x = this.velocity.max)
            : this.velocity !== 0 && (this.velocity.x = -1 * this.velocity.max)
        }

        this.velocity.y = (Math.abs(evt.pageY - ballCenterY) * this.velocity.max) / 100
        if (Math.abs(this.velocity.y) > this.velocity.max) {
          this.velocity.y = this.velocity.max
        }
        if (this.velocity.y > 50) this.shotsCounter()
        this.htmlElement.style.transition = this.timeTick + 'ms'
      }

      line.style.width = 0
      this.allowShot = 0
    })
  }
}

class Target {
  constructor(container, level) {
    this.container = container || document.body
    this.timeTick = 40 //ms
    this.time = this.timeTick / 1000 // s
    this.wasCollision = false
    this.acceleration = level >= 7 ? -120 : 0

    this.velocity = {
      y: level >= 7 ? Math.random() * 100 + level * 5 : 0,
      x: level >= 4 ? (level % 2 ? level * 35 : level * -35) : 0
    }

    this.radius = Math.random() * 31 + 19
    this.position = {
      x: ((Math.random() * 90 + 5) / 100) * this.container.offsetWidth,
      y: ((Math.random() * 40 + 50) / 100) * this.container.offsetHeight,
      center: {
        x: null,
        y: null
      },
      max: {
        x: this.container.offsetWidth - 2 * this.radius,
        y: this.container.offsetHeight - 2 * this.radius
      },
      min: {
        x: 0,
        y: this.container.offsetHeight / 3
      }
    }
    this.position.center.x = this.radius + this.position.x
    this.position.center.y = this.radius + this.position.y

    this.htmlElement = null
    this.htmlElementBackground = null
    this.htmlElementEyes = null
  }

  init() {
    this.htmlElement = document.createElement('div')
    this.htmlElement.classList.add('target')
    this.htmlElement.style.width = this.radius * 2 + 'px'
    this.htmlElement.style.height = this.radius * 2 + 'px'
    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'
    this.htmlElement.style.tansition = this.timeTick + 'ms'

    this.htmlElementBackground = document.createElement('div')
    this.htmlElementBackground.classList.add('target-background')
    this.htmlElement.appendChild(this.htmlElementBackground)

    this.htmlElementEyes = document.createElement('div')
    this.htmlElementEyes.classList.add('target-eyes')
    this.htmlElement.appendChild(this.htmlElementEyes)

    return this
  }

  append() {
    this.container.appendChild(this.htmlElement)
  }

  move() {
    this.position.x += this.velocity.x * this.time
    if (this.position.x <= this.position.min.x || this.position.x >= this.position.max.x) {
      this.position.x <= this.position.min.x
        ? (this.position.x = this.position.min.x)
        : (this.position.x = this.position.max.x)
      this.velocity.x = -1 * this.velocity.x
    }
    if (Math.random() > 0.995) this.velocity.x = this.velocity.x * -1

    this.velocity.y += this.acceleration * this.time
    this.position.y += this.velocity.y * this.time - (this.acceleration * this.time * this.time) / 2
    if (this.position.y <= this.position.min.y || this.position.y >= this.position.max.y) {
      this.position.y <= this.position.min.y
        ? (this.position.y = this.position.min.y)
        : (this.position.y = this.position.max.y)
      this.velocity.y = -1 * this.velocity.y
    }

    this.position.center.x = this.radius + this.position.x
    this.position.center.y = this.radius + this.position.y

    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'

    this.htmlElement.style.bottom = this.position.y + 'px'
    this.htmlElement.style.left = this.position.x + 'px'
  }
}

class Game {
  constructor(container) {
    this.container = container || document.body
    this.timeTick = 40 //ms
    this.level = 1
    this.maxLevel = 20
    this.shots = 0

    this.ball = new Ball(this.container, 25, this.shotsCounter())
    this.ball.init()

    this.mainInterval = null
    this.target = null
    this.targetContainer = null
    this.levelContainer = null
    this.shotsContainer = null
  }

  init() {
    this.targetContainer = document.createElement('div')
    this.targetContainer.classList.add('target-container')
    this.container.appendChild(this.targetContainer)

    this.levelContainer = document.createElement('div')
    this.levelContainer.classList.add('level-container')
    this.levelContainer.innerText = `Level: ${this.level}/${this.maxLevel}`
    this.container.appendChild(this.levelContainer)

    this.shotsContainer = document.createElement('div')
    this.shotsContainer.classList.add('shots-container')
    this.shotsContainer.innerText = `Shots: ${this.shots}`
    this.container.appendChild(this.shotsContainer)

    this.ball.append()

    this.target = new Target(this.targetContainer, this.level)
    this.target.init().append()

    this.mainInterval = setInterval(this.mainLoop.bind(this), this.timeTick)

    return this
  }

  initSplashScreen() {
    const splashScreen = document.createElement('div')
    splashScreen.classList.add('splash-screen')

    const description = document.createElement('p')
    description.classList.add('splash-screen__description')
    description.innerText =
      'To play use mouse, shot as few times as you can. You can reset your ball by click on game window.'
    splashScreen.appendChild(description)

    const startButton = document.createElement('div')
    startButton.classList.add('splash-screen__start-button')
    startButton.innerText = 'START!'
    startButton.addEventListener('click', () => {
      this.container.innerText = ''
      this.init()
    })
    splashScreen.appendChild(startButton)

    this.container.append(splashScreen)
  }

  initEndScreen() {
    clearInterval(this.mainInterval)

    const endScreen = document.createElement('div')
    endScreen.classList.add('splash-screen')

    const description = document.createElement('p')
    description.classList.add('splash-screen__description')
    description.innerText =
      this.shots <= 30
        ? `HOORAY! :)
Only ${this.shots} shots.`
        : `You can do it better... :(
Too much shots - ${this.shots}`
    endScreen.appendChild(description)

    const againButton = document.createElement('div')
    againButton.classList.add('splash-screen__start-button')
    againButton.innerText = 'PLAY AGAIN!'
    againButton.addEventListener('click', () => {
      this.container.innerText = ''
      this.level = 1
      this.shots = 0
      this.ball.velocity.y = 0
      this.ball.velocity.x = 0
      this.ball.position.x = this.container.offsetWidth / 2 - this.ball.radius
      this.ball.position.y = 0
      this.init()
    })
    endScreen.appendChild(againButton)

    this.container.append(endScreen)
  }

  isColision() {
    if (this.target && !this.target.wasCollision) {
      const a = this.ball.position.center.x - this.target.position.center.x
      const b = this.ball.position.center.y - this.target.position.center.y
      const c = Math.sqrt(a * a + b * b)

      if (c <= this.ball.radius + this.target.radius) {
        this.target.wasCollision = true
        this.collision()
        setTimeout(() => {
          this.target = null
        }, 800)
      }
    }
  }

  collision() {
    this.level++
    this.levelContainer.innerText = `Level: ${this.level}/${this.maxLevel}`
    if (this.level > this.maxLevel) {
      this.level = this.maxLevel
      this.initEndScreen()
    }

    this.ball.backToCenter()

    this.target.velocity.x = 0
    this.target.velocity.y = 0
    this.target.htmlElementBackground.style.opacity = '0'
    this.target.htmlElementEyes.style.top = '100px'
    this.target.htmlElementEyes.style.opacity = '0'
  }

  newTarget() {
    if (!this.target && !this.ball.position.y) {
      this.targetContainer.innerText = ''
      this.target = new Target(this.targetContainer, this.level)
      this.target.init().append()
    }
  }

  mainLoop() {
    this.ball.move()
    if (this.target) this.target.move()
    this.isColision()
    this.newTarget()
  }

  shotsCounter() {
    return () => {
      this.shots++
      this.shotsContainer.innerText = `Shots: ${this.shots}`
    }
  }
}

const game = new Game(document.querySelector('.container'))
game.initSplashScreen()
