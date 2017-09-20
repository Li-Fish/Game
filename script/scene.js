class Scene {
    constructor(game) {
        this.game = game
    }
}

class MainScene extends Scene {
    constructor(game) {
        super(game)
        this.setup()

        play('bgm')
    }

    setup() {
        var self = this

        this.HPBar = document.querySelector("#HP")
        this.HPNum = document.querySelector("#HPNum")
        this.MPBar = document.querySelector("#MP")
        this.MPNum = document.querySelector("#MPNum")

        this.selfBullet = []
        this.enemyBullet = []
        this.animals = []
        this.player = new Player(this.game, this.selfBullet)

        this.game.register_action('a', function () {
            self.player.moveLeft()
        })
        this.game.register_action('d', function () {
            self.player.moveRight()
        })
        this.game.register_action('w', function () {
            self.player.moveUP()
        })
        this.game.register_action('s', function () {
            self.player.moveDown()
        })
        this.game.register_action(' ', function () {
            self.player.boom()
        })
        // this.game.register_action('mouse', function () {
        //     self.player.fire(self.game.cursorX, self.game.cursorY)
        // })
    }

    draw() {
        for (var animal of this.animals) {
            animal.draw()
        }
        for (var bullet of this.selfBullet) {
            bullet.draw()
        }
        for (var bullet of this.enemyBullet) {
            bullet.draw()
        }
        this.player.draw()
    }

    updata() {
        if (this.game.clock % 15 === 0 && this.animals.length <= 10) {
            this.animals.push(new Enemy(this.game, this.enemyBullet, randint(0, totalWidth - images['animal'].width), 0, randint(1, 3)))
        }

        this.player.updata()

        for (var i = 0; i < this.animals.length; i++) {
            this.animals[i].updata()
            for (var j = 0; j < this.selfBullet.length; j++) {
                var bullet = this.selfBullet[j]
                if (collision(this.animals[i], bullet)) {
                    this.animals[i].HP--
                    this.selfBullet.splice(j, 1)
                    j--
                }
            }

            if (this.animals[i].HP < 0 || this.animals[i].y === totalHeight - this.animals[i].height/2) {
                if (this.animals[i].HP < 0)
                    play('boom')
                this.animals.splice(i, 1)
                i--
            }
        }

        for (var i = 0; i < this.selfBullet.length; i++) {
            var bullet = this.selfBullet[i]
            bullet.updata()
            if (bullet.x < 0 || bullet.y < 0 || bullet.x > totalWidth || bullet.y > totalHeight) {
                this.selfBullet.splice(i, 1)
                i--
            }
        }

        for (var i = 0; i < this.enemyBullet.length; i++) {
            var bullet = this.enemyBullet[i]
            bullet.updata()
            var flag = false
            if (collision(this.player, bullet)) {
                if (this.player.clock_inv === 0) {
                    this.player.HP--
                    flag = true
                    this.player.clock_inv = this.player.invincible
                }
            }
            if (flag || bullet.x < 0 || bullet.y < 0 || bullet.x > totalWidth || bullet.y > totalHeight) {
                this.enemyBullet.splice(i, 1)
                i--
            }
        }

        this.HPBar.style.width = 500 * (this.player.HP/this.player.totalHP) + "px"
        this.MPBar.style.width = 500 * (this.player.MP/this.player.totalMP) + "px"
        // this.HPNum.textContent = "HP: " + this.player.HP
        // this.MPNum.textContent = "MP: " + this.player.MP

        this.draw()
    }
}