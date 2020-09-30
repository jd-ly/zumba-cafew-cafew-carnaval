function update()
{
    var delta = clock.getDelta(); // seconds.
    var moveDistance = 50 * delta; // 200 pixels per second
    var rotateAngle = Math.PI / 2 * delta * 2;   // pi/2 radians (90 degrees) per second

    if (keyboard.pressed("left"))
        player1.turn(rotateAngle);
    if (keyboard.pressed("right"))
        player1.turn(-rotateAngle);
    if (keyboard.pressed("up"))
        player1.accelerate(moveDistance);
    if (keyboard.pressed("down"))
        player1.decelerate(moveDistance);

    for (i = 0; i < enemies.length; i++) {
        enemies[i].autoEnemy(delta)
    }
    enemy1.autoEnemy(delta);
    player1.move();
    controls.update();

}