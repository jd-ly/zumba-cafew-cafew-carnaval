var bullet_player1_material = new THREE.MeshLambertMaterial(
    {
        color: 0x00ff00,
        transparent: false
    });

function shoot() {
    if (keyboard.pressed("space") && player1.bulletTime + 0.8 < clock.getElapsedTime()) {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        player1.bulletTime = clock.getElapsedTime();
    }

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++) {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);
    }
}

function collisions() {
    bullet_collision();
    player_collision();
    player_falling();
}

const hitbox_delta = 10;
function isTouchingEnemy(index) {
    const x = player1.bullets[index].position.x;
    const y = player1.bullets[index].position.y;
    for (i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (Math.abs(x - enemy.position.x) < hitbox_delta
            && Math.abs(y - enemy.position.y) < hitbox_delta) {
            scene.remove(player1.bullets[index]);
            scene.remove(enemy.graphic);
            player1.bullets.splice(index, 1);
        }
    }
}

function bullet_collision() {
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++) {
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2) {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
        } else {
            isTouchingEnemy(i);
        }
    }
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        for (let j = 0; j < enemy.bullets.length; j++) {
            if (Math.abs(enemy.bullets[j].position.x) >= WIDTH / 2 ||
                Math.abs(enemy.bullets[j].position.y) >= HEIGHT / 2) {
                scene.remove(enemy.bullets[j]);
                enemy.bullets.splice(j, 1);
            } else if (Math.abs(player1.position.x - enemy.position.x) < hitbox_delta
            && Math.abs(player1.position.y - enemy.position.y) < hitbox_delta) {
                scene.remove(enemy.bullets[j]);
                enemy.bullets.splice(j, 1);
                player1.dead();
            }
        }
    }
}

function player_collision() {
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if (x > WIDTH)
        player1.graphic.position.x -= x - WIDTH;
    if (y < 0)
        player1.graphic.position.y -= y;
    if (y > HEIGHT)
        player1.graphic.position.y -= y - HEIGHT;
    if (x < 0)
        player1.graphic.position.x -= x;


    for (let i = 0; i < enemies.length; i++) {
        const enemyX = enemies[i].graphic.position.x + WIDTH / 2;
        const enemyY = enemies[i].graphic.position.y + HEIGHT / 2;

        if (Math.abs(enemyX - x) < 1 && Math.abs(enemyY - y) < 1) {
            player1.dead();
        }
    }
}

function player_falling() {
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var element = [];

    for (var i = 0; i < noGround.length; i++) {
        element = noGround[i];

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var mtileX = (element[0] + sizeOfTileX) | 0;
        var mtileY = (element[1] + sizeOfTileY) | 0;

        if ((x > tileX)
            && (x < mtileX)
            && (y > tileY)
            && (y < mtileY)) {
            player1.dead();
        }
    }

}
