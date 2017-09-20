class Thing {
    constructor(game, image_name, physical = 1) {
        this.x = 0
        this.y = 0
        this.speed = 10
        this.image_name = image_name
        this.image = images[image_name]
        this.height = this.image.height
        this.width = this.image.width
        this.physical = physical
        this.phyWidth = this.image.width * physical
        this.phyHeight = this.image.height * physical
        this.game = game
    }

    setImage() {
        this.image = images[this.image_name]
        this.width = this.image.width
        this.height = this.image.height
        this.phyWidth = this.image.width * this.physical
        this.phyHeight = this.image.height * this.physical
    }

    moveUP() {
        this.y -= this.speed
        this.y = Math.max(this.height / 2, this.y)
    }

    moveDown() {
        this.y += this.speed
        this.y = Math.min(totalHeight - this.height / 2, this.y)
    }

    moveLeft() {
        this.x -= this.speed
        this.x = Math.max(this.height / 2, this.x)
    }

    moveRight() {
        this.x += this.speed
        this.x = Math.min(totalWidth - this.width / 2, this.x)
    }

    draw() {
        this.setImage()
        this.game.context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2)
    }
}

class Bullet extends Thing {
    constructor(game, x, y, tx, ty, speed, image_name = 'bullet') {
        super(game, image_name)
        this.x = x  - this.width / 2
        this.y = y
        this.tx = tx  - this.width / 2
        this.ty = ty

        this.speed = speed

        this.width = images[image_name].width
        this.height = images[image_name].height

        var len = Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y))

        this.speedX = this.speed * (this.tx - this.x) / len
        this.speedY = this.speed * (this.ty - this.y) / len
    }

    updata() {
        this.move()
    }

    draw() {
        if (this.image_name === "selfBullet")
            animation(this.game.context, this.x, this.y, 0, this.image_name)
        else
            super.draw()
    }

    move() {
        this.x += this.speedX
        this.y += this.speedY
    }
}

class Fighter extends Thing {
    constructor(game, x, y, speed, image_name, bulletImage, bullets, physical = 1) {
        super(game, image_name, physical)
        this.x = x
        this.y = y
        this.speed = speed
        this.bulletImage = bulletImage
        this.bullets = bullets

        this.bulletSpeed = 10
        this.attackSpeed = 5
        this.cd = 10

        this.totalHP = 100
        this.totalMP = 100
        this.HP = 100
        this.MP = 100

        this.clock_as = 0
        this.clock_cd = 0
    }

    updata() {
        this.clock_cd = Math.max(0, this.clock_cd - 1)
        this.clock_as = Math.max(0, this.clock_as - 1)
        this.MP = Math.min(this.totalMP, this.MP + 0.5)
    }

    fire(toX, toY) {
        if (this.clock_as !== 0) return
        // this.MP -= 5

        play('biu')

        this.clock_as = this.attackSpeed
        this.bullets.push(new Bullet(this.game, this.x, this.y - 30, toX, toY, this.bulletSpeed * 2, this.bulletImage))
    }

    boom() {
        if (this.clock_cd !== 0 || this.MP <= 20) return

        this.MP -= 20

        play('biu')

        this.clock_cd = this.cd
        var r = 1000
        var m = 10

        var space = 2 * Math.PI / 20

        for (var c = 0; c < 2 * Math.PI; c += space) {
            this.bullets.push(new Bullet(this.game, this.x + m * Math.sin(c), this.y + m * Math.cos(c), this.x + r * Math.sin(c), this.x + r * Math.cos(c), this.bulletSpeed, this.bulletImage))
        }
    }
}

class Player extends Fighter {
    constructor(game, bullets, x = 250, y = 500, speed = 5, image_name = 'player', bulletImage = 'selfBullet', physical = 0.5) {
        super(game, x, y, speed, image_name, bulletImage, bullets, physical)
        this.invincible = 10
        this.clock_inv = 0
        this.width = 32
        this.height = 47
        this.phyWidth = this.width / 4
        this.phyHeight = this.height / 4
    }

    draw() {
        animation(this.game.context, this.x - this.width / 2, this.y - this.height / 2, (this.game.clock / 8 % 8), 'players')
    }

    updata() {
        super.updata()
        this.fire(this.x, this.y - 100)
        if (this.game.keys['d']) {
            this.image_name = 'right'
        } else if (this.game.keys['a']) {
            this.image_name = 'left'
        } else {
            this.image_name = 'player'
        }

        this.clock_inv = Math.max(0, this.clock_inv - 1)
    }
}

class Enemy extends Fighter {
    constructor(game, bullets, x = 200, y = 100, speed = 5, image_name = 'enemy1', bulletImage = 'bullet') {
        super(game, x, y, speed, image_name, bulletImage, bullets)
        this.HP = randint(5, 10)
        this.speed = speed
        this.bulletSpeed = 2.5
        this.attackSpeed = 100
        this.cd = 1000
        this.setup()
    }

    setup() {
        this.image_name = 'enemy' + randint(1, 8)
    }

    updata() {
        super.updata()
        if (this.speed === 3) this.boom()
        this.fire(this.x, this.y + 100)
        this.moveDown()
    }
}