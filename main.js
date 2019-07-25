class Ball {
  constructor(container, diameter) {
    this.container = container || document.body
    this.diameter = diameter || 50
    this.position = {
      top: this.container.offsetHeight - this.diameter - 2,
      left: 0
    }

    this.htmlElement = null
  }

  init() {
    this.htmlElement = document.createElement('div')
    this.htmlElement.classList.add('ball')
    this.htmlElement.style.width = this.diameter + 'px'
    this.htmlElement.style.height = this.diameter + 'px'
    this.htmlElement.style.top = this.position.top + 'px'
    this.htmlElement.style.left = this.position.left + 'px'

    return this
  }

  append() {
    this.container.appendChild(this.htmlElement)
  }
}

const ball = new Ball(document.querySelector('.container'), 70)

ball.init().append()
