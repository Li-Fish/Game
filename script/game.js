var totalWidth = 1300
var totalHeight = 700
var log = console.log.bind(console)

class Game {
    constructor() {
        this.canvas = document.querySelector('#id-canvas')
        this.context = this.canvas.getContext('2d')

        this.keys = {}
        this.actions = {}

        this.clock = 0
        this.setup()

        this.scene = new MainScene(this)
    }

    setup() {
        var self = this

        totalHeight = this.canvas.height
        totalWidth = this.canvas.width

        window.addEventListener('keydown', function (event) {
            self.keys[event.key] = true
        })
        window.addEventListener('keyup', function (event) {
            self.keys[event.key] = false
        })
        this.canvas.addEventListener('mousedown', function () {
            self.keys['mouse'] = true
        })
        this.canvas.addEventListener('mouseup', function () {
            self.keys['mouse'] = false
        })

        document.onmousemove = function (e) {
            self.cursorX = e.pageX
            self.cursorY = e.pageY
        }
    }

    register_action(key, callback) {
        this.actions[key] = callback
    }

    run() {
        var self = this

        setInterval(function () {
            self.clock++

            var actions = Object.keys(self.actions)
            for (var x of actions) {
                if (self.keys[x]) self.actions[x]()
            }

            self.scene.updata()
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)
            self.scene.draw()

        }, 1000 / 60)
    }

}

function __main__() {
    loadSource()
    var game = new Game()
    game.run()
}

__main__()
