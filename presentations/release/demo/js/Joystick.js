// ultra-simple single axis gamepad support
// made with love by mcfunkypants for Ballrog

function handleJoystickControls() {

    // pixles per frame at max joystick reading
    const JOYSTICK_SPEED_SCALE = 8; 
    
    var x = 0;
    var buttonWasPressed = false;

    if (navigator.getGamepads) { // new enough browser? 
        var gamepad = navigator.getGamepads()[0]; // first avail
        if (gamepad) { // always null unless user has pressed a button
            // just use the first gamepad
            x = gamepad.axes[0]; // left stick
            // deadzone to avoid drift due to sensor innacuracy
            if (Math.abs(x)<0.1) x = 0;
            buttonWasPressed = 
                (gamepad.buttons[0].value || 
                gamepad.buttons[1].value ||
                gamepad.buttons[2].value ||
                gamepad.buttons[3].value ||
                gamepad.buttons[9].value);
        
        }
    }

    // actually move the player one paddle
    paddleX += x * JOYSTICK_SPEED_SCALE;

    // force it to stay on-screen
    // TODO: confirm this still works if padding changes size due to a powerup
    if (paddleX<0) paddleX = 0;
    if (paddleX>canvas.width-paddleWidth) paddleX = canvas.width-paddleWidth;
    maybeMoveHeldBall();

    // handle buttons (to launch ball!)
    // A,B,X,Y, or START == same as a mouseClick
    if (buttonWasPressed) gameClicked();
    
    //console.log('joystick X: '+x.toFixed(1)+' paddle X:' + paddleX.toFixed(1));
}
