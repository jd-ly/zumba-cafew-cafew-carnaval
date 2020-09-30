var Player = function(name, color, position, direction) {

    this.name = name;
    this.position = position;
    this.life = 3;
    this.bullets = new Array();
    this.direction = direction;
    this.speed = 0;
    this.bulletTime = 0;

    this.material = new THREE.MeshLambertMaterial({
        color: color,
        });


    vehiculeMesh = new THREE.ConeGeometry(5, 20, 32);
    this.graphic = new THREE.Mesh(vehiculeMesh, this.material);

    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), this.direction+(3*Math.PI/2));
};

Player.prototype.dead = function () {
    if (this.life === 0) {
        this.graphic.position.z = this.graphic.position.z - 0.1;
        //Nettoyage de la div container
        $("#container").html("");
        jQuery('#' + this.name + ' >.life').text("Tu es mort !");
        init();
    } else {
        this.life -= 1;
        this.position.x = 50;
        this.position.y = 0;
        this.speed = 0;
    }
};

Player.prototype.accelerate = function (distance) {
    var max = 2;

    this.speed += distance / 4;
    if (this.speed >= max) {
        this.speed = max;
    }
};

Player.prototype.decelerate = function (distance) {
    var min = -1;

    this.speed -= distance / 16;
    if (this.speed <= min) {
        this.speed = min;
    }
};

Player.prototype.displayInfo = function () {
    jQuery('#'+this.name+' >.life').text(this.life);
}

Player.prototype.turn = function (angle) {
    this.direction += angle;
    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), angle);
};

Player.prototype.move = function () {
    var moveTo = new THREE.Vector3(
        this.speed * Math.cos(this.direction) + this.position.x,
        this.speed * Math.sin(this.direction) + this.position.y,
        this.graphic.position.z
    );

    this.position = moveTo;

    if (this.speed > 0) {
        this.speed = this.speed - 0.04;
    }
    else if (this.speed < 0) {
        this.speed = this.speed + 0.04;
    }

    this.graphic.position.x = this.position.x;
    this.graphic.position.y = this.position.y;
    
    light1.position.x = this.position.x;
    light1.position.y = this.position.y;
};

Player.prototype.autoEnemy = function (delta) {
    const x = this.graphic.position.x + WIDTH / 2;
    const y = this.graphic.position.y + HEIGHT / 2;
    if (this.name === "follower") {
        if ( x > player1.graphic.position.x ) {
            //TODO
        }
    }
    else {
        if (x > WIDTH || y < 0 || y > HEIGHT || x < 0) {
            this.turn(180);
        } else { // random turn
            const random = Math.floor(Math.random() * 100);
            if (random === 1) {
                this.turn(20);
            }
            if (random === 2) {
                this.turn(-20);
            }
        }

        if (this.bulletTime + 0.5 < clock.getElapsedTime()) {
            let bullet = new THREE.Mesh(
                new THREE.SphereGeometry(2),
                bullet_player1_material);
            scene.add(bullet);
            bullet.position.x = this.graphic.position.x + 7.5 * Math.cos(this.direction);
            bullet.position.y = this.graphic.position.y + 7.5 * Math.sin(this.direction);
            bullet.angle = this.direction;
            this.bullets.push(bullet);
            this.bulletTime = clock.getElapsedTime();
        }

        // move bullets
        var moveDistance = 5;

        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].position.x += moveDistance * Math.cos(this.bullets[i].angle);
            this.bullets[i].position.y += moveDistance * Math.sin(this.bullets[i].angle);
        }
    }
    this.accelerate(50 * delta);
    this.move()
};

