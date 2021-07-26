/*****************************************************************************
* | Description :	BitAbantu extension for micro:bit
* | Developer   :   Lorne
* | More Info   :	http://chmakered.com/
******************************************************************************/

enum Joystick {
    //% block=" UpLeft"
    UpLeft,
    //% block=" ↑ Up"
    Up,
    //% block=" UpRight"
    UpRight,
    //% block=" ← Left"
    Left,
    //% block=" Middle"
    Middle,
    //% block=" → Right"
    Right,
    //% block=" LowerLeft"
    LowerLeft,
    //% block=" ↓ Down"
    Down,
    //% block=" LowerRight"
    LowerRight
}

enum GrovePin {
    //% block="P0"
    P0 = DigitalPin.P0,
    //% block="P1"
    P1 = DigitalPin.P1,
    //% block="P2"
    P2 = DigitalPin.P2,
    //% block="P8"
    P8 = DigitalPin.P8,
    //% block="P12"
    P12 = DigitalPin.P12,
    //% block="P16"
    P16 = DigitalPin.P16
}

enum GroveAnalogPin {
    //% block="P0"
    P0 = AnalogPin.P0,
    //% block="P1"
    P1 = AnalogPin.P1,
    //% block="P2"
    P2 = AnalogPin.P2
}

enum DistanceUnit {
    //% block="cm"
    cm,
    //% block="inch"
    inch
}

enum trick {
    //% block="arise"
    getUp,
    //% block=" +left"
    L_forward = AnalogPin.P14,
    //% block=" -right"
    R_backward = AnalogPin.P15,
    //% block=" +right"
    R_forward = AnalogPin.P16,
}

enum IRLineSensor {
    //% block="left sensor"
    left,
    //% block=" right sensor"
    right
}

enum PingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}

/**
 * Well known colors for a NeoPixel strip
 */
 enum NeoPixelColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

/**
 * Different modes for RGB or RGB+W NeoPixel strips
 */
enum NeoPixelMode {
    //% block="RGB (GRB format)"
    RGB = 1,
    //% block="RGB+W"
    RGBW = 2,
    //% block="RGB (RGB format)"
    RGB_RGB = 3
}



/**
 * Provides access to BitAbantu blocks for micro: bit functionality.
 */
//% color=190 icon="\uf126" block= "BitAbantu"
//% groups="['Analog', 'Digital', 'I2C', 'Grove Modules']"
namespace BitAbantu {
    let posi_init = 0;

    function InitialPosition(): void {
        posi_init = 1;
        return;
    }

    export enum BitAbantuKey {
        //% block="A"
        key_A = DAL.MICROBIT_ID_IO_P5,
        //% block="B"
        key_B = DAL.MICROBIT_ID_IO_P11,
        //% block="C"
        key_C = DAL.MICROBIT_ID_IO_P13,
        //% block="D"
        key_D = DAL.MICROBIT_ID_IO_P14,
        //% block="L"
        key_L = DAL.MICROBIT_ID_IO_P15,
        //% block="R"
        key_R = DAL.MICROBIT_ID_IO_P16,
    }
    
    /**
     * Button Events of BitAbantu
     */
    //%
    export enum BitAbantuKeyEvent {
        //% block="click"
        click = DAL.MICROBIT_BUTTON_EVT_CLICK,
        //% block="pressed"
        pressed = DAL.MICROBIT_BUTTON_EVT_DOWN,
        //% block="released"
        released = DAL.MICROBIT_BUTTON_EVT_UP,
    }

	/**
	 * 
	 */
    //% shim=bitabantu::init
    function init(): void {
        return;
    }

    /**
     * Do something when a key is pressed, releassed or clicked
     */
    //% blockId=OnKey
    //% block="on key $key| is $keyEvent"
    export function OnKey(key: BitAbantuKey, keyEvent: BitAbantuKeyEvent, handler: Action) {
        if (!posi_init) {
            InitialPosition();
        }

        init();
        control.onEvent(<number>key, <number>keyEvent, handler); // register handler
    }

    /**
    * Get the key state (pressed or not)
    * @param key the pin that acts as a button
    */
    //% blockId=KeyPressed
    //% block="key $key| is pressed"
    export function KeyPressed(key: BitAbantuKey): boolean {
        if (!posi_init) {
            InitialPosition();
        }

        const pin = <DigitalPin><number>key;
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(<DigitalPin><number>key) == 0;
    }

    /**
    * turn on of off the vibration motor
    */
    //% blockId=SetMotor
    //% block="vibration $on|"
    //% on.shadow="toggleOnOff"
    //% on.defl="true"
    //% weight=45
    export function SetMotor(on: boolean) {
        if (on) {
            pins.digitalWritePin(DigitalPin.P8, 1);
        }else{
            pins.digitalWritePin(DigitalPin.P8, 0);
        }
    }

    const x0 = 500;
    const y0 = 500;
    const d0 = 250;

    /**
    * Get the joystick state
    * @param position the current position of joystick
    */
    //% blockId=OnJoystick
    //% block="joystick $position|"
    //% position.fieldEditor="gridpicker"
    //% position.fieldOptions.columns=3
    //% weight = 40
    export function OnJoystick(position: Joystick): boolean {
        let x = pins.analogReadPin(AnalogPin.P1) - x0;
        let y = pins.analogReadPin(AnalogPin.P2) - y0;
        let d = Math.round(Math.sqrt(Math.abs(x * x) + Math.abs(y * y)));
        const value1 = Math.round(d * 0.38);        //0.38 is the value of sin 22.5°
        const value2 = Math.round(d * 0.92);        //0.92 is the value of sin 67.5°
        let getPosition = Joystick.Middle;

        if (d > d0) {
            if (x > 0 && y > 0) {               // (x,y) is at top right area
                if (y > value2) {
                    getPosition = Joystick.Up;
                } else if (y < value1) {
                    getPosition = Joystick.Right;
                } else {
                    getPosition = Joystick.UpRight;
                }
            } else if (x > 0 && y < 0) {        // (x,y) is at bot right area
                if (x > value2) {
                    getPosition = Joystick.Right;
                } else if (x < value1) {
                    getPosition = Joystick.Down;
                } else {
                    getPosition = Joystick.LowerRight;
                }
            } else if (x < 0 && y < 0) {         // (x,y) is at bot left area
                y = Math.abs(y);
                if (y > value2) {
                    getPosition = Joystick.Down;
                } else if (y < value1) {
                    getPosition = Joystick.Left;
                } else {
                    getPosition = Joystick.LowerLeft;
                }
            } else if (x < 0 && y > 0) {         // (x,y) is at top left area
                if (y > value2) {
                    getPosition = Joystick.Up;
                } else if (y < value1) {
                    getPosition = Joystick.Left;
                } else {
                    getPosition = Joystick.UpLeft;
                }
            }
        } else {
            getPosition = Joystick.Middle;
        }

        if (getPosition == position) {
            return true;
        } else {
            return false;
        }
    }


    let L_backward = AnalogPin.P13;
    let L_forward = AnalogPin.P14;
    let R_forward = AnalogPin.P15; 
    let R_backward = AnalogPin.P16;

    /**
    * Set the motors' speed of BitCar
    */
    //% blockId=move
    //% block="BitCar: left motor $left \\%, right motor$right \\%"
    //% left.shadow="speedPicker"
    //% right.shadow="speedPicker"
    //% group="BitCar Control"
    //% weight=100
    export function move(left: number, right: number) {
        if (left >= 0) {
            pins.analogWritePin(L_backward, 0);
            pins.analogWritePin(L_forward, Math.map(left, 0, 100, 0, 1023));
        } else if (left < 0) {
            pins.analogWritePin(L_backward, Math.map(Math.abs(left), 0, 100, 0, 1023));
            pins.analogWritePin(L_forward, 0);
        }
        if (right >= 0) {
            pins.analogWritePin(R_backward, 0);
            pins.analogWritePin(R_forward, Math.map(right, 0, 100, 0, 1023));
        } else if (right < 0) {
            pins.analogWritePin(R_backward, Math.map(Math.abs(right), 0, 100, 0, 1023));
            pins.analogWritePin(R_forward, 0);
        }
    }

    /**
    * BitCar stop
    */
    //% blockId=stop
    //% block="BitCar: stop"
    //% group="BitCar Control"
    //% weight=99
    //% blockGap=40
    export function stop() {
        pins.analogWritePin(L_backward, 0);
        pins.analogWritePin(L_forward, 0);
        pins.analogWritePin(R_backward, 0);
        pins.analogWritePin(R_forward, 0);
    }

    /**
    * When BitCar is still, make it stand up from the ground and then stop, try to tweak the motor speed and the charge time if it failed to do so
    */
    //% blockId=standup_still
    //% block="BitCar: stand up with speed $speed \\% charge$charge|(ms)"
    //% speed.defl=100
    //% speed.min=0 speed.max=100
    //% charge.defl=250
    //% group="BitCar Control"
    //% weight=98
    //% blockGap=40
    export function standup_still(speed: number, charge: number) {
        move(-speed, -speed);
        basic.pause(200);
        move(speed, speed);
        basic.pause(charge);
        stop();
    }


    /**
    * Check the state of the IR line sensor, the LED indicator is ON if the line is detected by the corresponding sensor
    */
    //% blockId=linesensor
    //% block="BitCar: line under $sensor|"
    //% group="BitCar Control"
    //% weight=97
    export function linesensor(sensor: IRLineSensor): boolean {
        let result: boolean = false;

        if (sensor == IRLineSensor.left) {
            if (pins.analogReadPin(AnalogPin.P1) < 500) {
                result = true;
            }
        } else if (sensor == IRLineSensor.right) {
            if (pins.analogReadPin(AnalogPin.P2) < 500) {
                result = true;
            }
        }
        return result;
    }

    /**
    * Line following at a specified speed.
    */
    //% blockId=linefollow
    //% block="BitCar: follow line at speed $speed \\%"
    //% speed.defl=50
    //% speed.min=0 speed.max=100
    //% group="BitCar Control"
    //% weight=96
    export function linefollow(speed: number) {
        if (linesensor(IRLineSensor.left) && linesensor(IRLineSensor.right)) {
            move(speed, speed);
        } else {
            if (!(linesensor(IRLineSensor.left)) && linesensor(IRLineSensor.right)) {
                move(speed, 0);
                if (!(linesensor(IRLineSensor.left)) && !(linesensor(IRLineSensor.right))) {
                    move(speed, 0);
                }
            } else {
                if (!(linesensor(IRLineSensor.right)) && linesensor(IRLineSensor.left)) {
                    move(0, speed);
                    if (!(linesensor(IRLineSensor.left)) && !(linesensor(IRLineSensor.right))) {
                        move(0, speed);
                    }
                }
            }
        }
    }

    /**
    * Get the distance from Grove-Ultrasonic Sensor, the measuring range is between 2-350cm
    */
    //% blockId=grove_ultrasonic
    //% block="Ultrasonic Sensor $groveport|: distance in $Unit"
    //% group="Sensors"
    //% weight=100
    export function grove_ultrasonic(groveport: GrovePin, Unit: DistanceUnit): number {
        let duration = 0;
        let distance = 0;
        let port: number = groveport;

        pins.digitalWritePin(<DigitalPin>port, 0);
        control.waitMicros(2);
        pins.digitalWritePin(<DigitalPin>port, 1);
        control.waitMicros(10);
        pins.digitalWritePin(<DigitalPin>port, 0);

        duration = pins.pulseIn(<DigitalPin>port, PulseValue.High, 50000);

        if (Unit == DistanceUnit.cm) distance = duration * 153 / 58 / 100;
        else distance = duration * 153 / 148 / 100;
        basic.pause(50);
        if (distance > 0) return Math.floor(distance * 10) / 10;
        else return 350;
    }
    /**
    * Get the distance from Grove-Ultrasonic Sensor, the measuring range is between 2-350cm
    */
    //% blockId=grove_ultrasonic_v2
    //% block="(V2)Ultrasonic Sensor $groveport|: distance in $Unit"
    //% group="Sensors"
    //% weight=99
    export function grove_ultrasonic_v2(groveport: GrovePin, Unit: DistanceUnit): number {
        let duration = 0;
        let distance = 0;
        let port: number = groveport;

        pins.digitalWritePin(<DigitalPin>port, 0);
        control.waitMicros(2);
        pins.digitalWritePin(<DigitalPin>port, 1);
        control.waitMicros(10);
        pins.digitalWritePin(<DigitalPin>port, 0);

        duration = pins.pulseIn(<DigitalPin>port, PulseValue.High, 50000);

        if (Unit == DistanceUnit.cm) distance = duration * 153 / 88 / 100;
        else distance = duration * 153 / 226 / 100;
        basic.pause(50);
        if (distance > 0) return Math.floor(distance * 10) / 10;
        else return 350;
    }

    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */
    //% blockId=sonar_ping block="ping trig %trig|echo %echo|unit %unit"
    export function ping(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case PingUnit.Centimeters: return Math.idiv(d, 58);
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d ;
        }
    }





     /**
     * A NeoPixel strip
     */
      export class Strip {
        buf: Buffer;
        pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number; // start offset in LED strip
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any

        /**
         * Shows all LEDs to a given color (range 0-255 for r, g, b).
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_strip_color" block="%strip|show color %rgb=neopixel_colors"
        //% strip.defl=strip
        //% weight=85 blockGap=8
        //% subcategory="Neopixel"
        showColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }

        /**
         * Shows a rainbow pattern on all LEDs.
         * @param startHue the start hue value for the rainbow, eg: 1
         * @param endHue the end hue value for the rainbow, eg: 360
         */
        //% blockId="neopixel_set_strip_rainbow" block="%strip|show rainbow from %startHue|to %endHue"
        //% strip.defl=strip
        //% weight=85 blockGap=8
        //% subcategory="Neopixel"
        showRainbow(startHue: number = 1, endHue: number = 360) {
            if (this._length <= 0) return;

            startHue = startHue >> 0;
            endHue = endHue >> 0;
            const saturation = 100;
            const luminance = 50;
            const steps = this._length;
            const direction = HueInterpolationDirection.Clockwise;

            //hue
            const h1 = startHue;
            const h2 = endHue;
            const hDistCW = ((h2 + 360) - h1) % 360;
            const hStepCW = Math.idiv((hDistCW * 100), steps);
            const hDistCCW = ((h1 + 360) - h2) % 360;
            const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
            let hStep: number;
            if (direction === HueInterpolationDirection.Clockwise) {
                hStep = hStepCW;
            } else if (direction === HueInterpolationDirection.CounterClockwise) {
                hStep = hStepCCW;
            } else {
                hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW;
            }
            const h1_100 = h1 * 100; //we multiply by 100 so we keep more accurate results while doing interpolation

            //sat
            const s1 = saturation;
            const s2 = saturation;
            const sDist = s2 - s1;
            const sStep = Math.idiv(sDist, steps);
            const s1_100 = s1 * 100;

            //lum
            const l1 = luminance;
            const l2 = luminance;
            const lDist = l2 - l1;
            const lStep = Math.idiv(lDist, steps);
            const l1_100 = l1 * 100

            //interpolate
            if (steps === 1) {
                this.setPixelColor(0, hsl(h1 + hStep, s1 + sStep, l1 + lStep))
            } else {
                this.setPixelColor(0, hsl(startHue, saturation, luminance));
                for (let i = 1; i < steps - 1; i++) {
                    const h = Math.idiv((h1_100 + i * hStep), 100) + 360;
                    const s = Math.idiv((s1_100 + i * sStep), 100);
                    const l = Math.idiv((l1_100 + i * lStep), 100);
                    this.setPixelColor(i, hsl(h, s, l));
                }
                this.setPixelColor(steps - 1, hsl(endHue, saturation, luminance));
            }
            this.show();
        }

        /**
         * Displays a vertical bar graph based on the `value` and `high` value.
         * If `high` is 0, the chart gets adjusted automatically.
         * @param value current value to plot
         * @param high maximum value, eg: 255
         */
        //% weight=84
        //% blockId=neopixel_show_bar_graph block="%strip|show bar graph of %value|up to %high"
        //% strip.defl=strip
        //% icon="\uf080"
        //% subcategory="Neopixel"
        showBarGraph(value: number, high: number): void {
            if (high <= 0) {
                this.clear();
                this.setPixelColor(0, NeoPixelColors.Yellow);
                this.show();
                return;
            }

            value = Math.abs(value);
            const n = this._length;
            const n1 = n - 1;
            let v = Math.idiv((value * n), high);
            if (v == 0) {
                this.setPixelColor(0, 0x666600);
                for (let i = 1; i < n; ++i)
                    this.setPixelColor(i, 0);
            } else {
                for (let i = 0; i < n; ++i) {
                    if (i <= v) {
                        const b = Math.idiv(i * 255, n1);
                        this.setPixelColor(i, BitAbantu.rgb(b, 0, 255 - b));
                    }
                    else this.setPixelColor(i, 0);
                }
            }
            this.show();
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b).
         * You need to call ``show`` to make the changes visible.
         * @param pixeloffset position of the NeoPixel in the strip
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_pixel_color" block="%strip|set pixel color at %pixeloffset|to %rgb=neopixel_colors"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=80
        //% subcategory="Neopixel"
        setPixelColor(pixeloffset: number, rgb: number): void {
            this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
        }

        /**
         * Sets the number of pixels in a matrix shaped strip
         * @param width number of pixels in a row
         */
        //% blockId=neopixel_set_matrix_width block="%strip|set matrix width %width"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=5
        //% subcategory="Neopixel"
        setMatrixWidth(width: number) {
            this._matrixWidth = Math.min(this._length, width >> 0);
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b) in a matrix shaped strip
         * You need to call ``show`` to make the changes visible.
         * @param x horizontal position
         * @param y horizontal position
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_matrix_color" block="%strip|set matrix color at x %x|y %y|to %rgb=neopixel_colors"
        //% strip.defl=strip
        //% weight=4
        //% subcategory="Neopixel"
        setMatrixColor(x: number, y: number, rgb: number) {
            if (this._matrixWidth <= 0) return; // not a matrix, ignore
            x = x >> 0;
            y = y >> 0;
            rgb = rgb >> 0;
            const cols = Math.idiv(this._length, this._matrixWidth);
            if (x < 0 || x >= this._matrixWidth || y < 0 || y >= cols) return;
            let i = x + y * this._matrixWidth;
            this.setPixelColor(i, rgb);
        }

        /**
         * For NeoPixels with RGB+W LEDs, set the white LED brightness. This only works for RGB+W NeoPixels.
         * @param pixeloffset position of the LED in the strip
         * @param white brightness of the white LED
         */
        //% blockId="neopixel_set_pixel_white" block="%strip|set pixel white LED at %pixeloffset|to %white"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=80
        //% subcategory="Neopixel"
        setPixelWhiteLED(pixeloffset: number, white: number): void {
            if (this._mode === NeoPixelMode.RGBW) {
                this.setPixelW(pixeloffset >> 0, white >> 0);
            }
        }

        /**
         * Send all the changes to the strip.
         */
        //% blockId="neopixel_show" block="%strip|show" blockGap=8
        //% strip.defl=strip
        //% weight=79
        //% subcategory="Neopixel"
        show() {
            // only supported in beta
            // ws2812b.setBufferMode(this.pin, this._mode);
            ws2812b.sendBuffer(this.buf, this.pin);
        }

        /**
         * Turn off all LEDs.
         * You need to call ``show`` to make the changes visible.
         */
        //% blockId="neopixel_clear" block="%strip|clear"
        //% strip.defl=strip
        //% weight=76
        //% subcategory="Neopixel"
        clear(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }

        /**
         * Gets the number of pixels declared on the strip
         */
        //% blockId="neopixel_length" block="%strip|length" blockGap=8
        //% strip.defl=strip
        //% subcategory="Neopixel"
        length() {
            return this._length;
        }

        /**
         * Set the brightness of the strip. This flag only applies to future operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
         */
        //% blockId="neopixel_set_brightness" block="%strip|set brightness %brightness" blockGap=8
        //% strip.defl=strip
        //% weight=59
        //% subcategory="Neopixel"
        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }

        /**
         * Apply brightness to current colors using a quadratic easing function.
         **/
        //% blockId="neopixel_each_brightness" block="%strip|ease brightness" blockGap=8
        //% strip.defl=strip
        //% weight=58
        //% subcategory="Neopixel"
        easeBrightness(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const br = this.brightness;
            const buf = this.buf;
            const end = this.start + this._length;
            const mid = Math.idiv(this._length, 2);
            for (let i = this.start; i < end; ++i) {
                const k = i - this.start;
                const ledoffset = i * stride;
                const br = k > mid
                    ? Math.idiv(255 * (this._length - 1 - k) * (this._length - 1 - k), (mid * mid))
                    : Math.idiv(255 * k * k, (mid * mid));
                const r = (buf[ledoffset + 0] * br) >> 8; buf[ledoffset + 0] = r;
                const g = (buf[ledoffset + 1] * br) >> 8; buf[ledoffset + 1] = g;
                const b = (buf[ledoffset + 2] * br) >> 8; buf[ledoffset + 2] = b;
                if (stride == 4) {
                    const w = (buf[ledoffset + 3] * br) >> 8; buf[ledoffset + 3] = w;
                }
            }
        }

        /**
         * Create a range of LEDs.
         * @param start offset in the LED strip to start the range
         * @param length number of LEDs in the range. eg: 4
         */
        //% weight=89
        //% blockId="neopixel_range" block="%strip|range from %start|with %length|leds"
        //% strip.defl=strip
        //% subcategory="Neopixel"
        //% blockSetVariable=range
        range(start: number, length: number): Strip {
            start = start >> 0;
            length = length >> 0;
            let strip = new Strip();
            strip.buf = this.buf;
            strip.pin = this.pin;
            strip.brightness = this.brightness;
            strip.start = this.start + Math.clamp(0, this._length - 1, start);
            strip._length = Math.clamp(0, this._length - (strip.start - this.start), length);
            strip._matrixWidth = 0;
            strip._mode = this._mode;
            return strip;
        }

        /**
         * Shift LEDs forward and clear with zeros.
         * You need to call ``show`` to make the changes visible.
         * @param offset number of pixels to shift forward, eg: 1
         */
        //% blockId="neopixel_shift" block="%strip|shift pixels by %offset" blockGap=8
        //% strip.defl=strip
        //% weight=40
        //% subcategory="Neopixel"
        shift(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.shift(-offset * stride, this.start * stride, this._length * stride)
        }

        /**
         * Rotate LEDs forward.
         * You need to call ``show`` to make the changes visible.
         * @param offset number of pixels to rotate forward, eg: 1
         */
        //% blockId="neopixel_rotate" block="%strip|rotate pixels by %offset" blockGap=8
        //% strip.defl=strip
        //% weight=39
        //% subcategory="Neopixel"
        rotate(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.rotate(-offset * stride, this.start * stride, this._length * stride)
        }

        /**
         * Set the pin where the neopixel is connected, defaults to P0.
         */
        //% weight=10
        //% subcategory="Neopixel"
        setPin(pin: DigitalPin): void {
            this.pin = pin;
            pins.digitalWritePin(this.pin, 0);
            // don't yield to avoid races on initialization
        }

        /**
         * Estimates the electrical current (mA) consumed by the current light configuration.
         */
        //% weight=9 blockId=neopixel_power block="%strip|power (mA)"
        //% strip.defl=strip
        //% subcategory="Neopixel"
        power(): number {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const end = this.start + this._length;
            let p = 0;
            for (let i = this.start; i < end; ++i) {
                const ledoffset = i * stride;
                for (let j = 0; j < stride; ++j) {
                    p += this.buf[i + j];
                }
            }
            return Math.idiv(this.length() * 7, 10) /* 0.7mA per neopixel */
                + Math.idiv(p * 480, 10000); /* rought approximation */
        }

        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === NeoPixelMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const end = this.start + this._length;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * stride, red, green, blue)
            }
        }
        private setAllW(white: number) {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            let end = this.start + this._length;
            for (let i = this.start; i < end; ++i) {
                let ledoffset = i * 4;
                buf[ledoffset + 3] = white;
            }
        }
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            let stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            pixeloffset = (pixeloffset + this.start) * stride;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            let br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.setBufferRGB(pixeloffset, red, green, blue)
        }
        private setPixelW(pixeloffset: number, white: number): void {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            pixeloffset = (pixeloffset + this.start) * 4;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            buf[pixeloffset + 3] = white;
        }
    }

    /**
     * Create a new NeoPixel driver for `numleds` LEDs.
     * @param pin the pin where the neopixel is connected.
     * @param numleds number of leds in the strip, eg: 24,30,60,64
     */
    //% blockId="neopixel_create" block="NeoPixel at pin %pin|with %numleds|leds as %mode"
    //% weight=90 blockGap=8
    //% subcategory="Neopixel"
    //% trackArgs=0,2
    //% blockSetVariable=strip
    export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): Strip {
        let strip = new Strip();
        let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
        strip.buf = pins.createBuffer(numleds * stride);
        strip.start = 0;
        strip._length = numleds;
        strip._mode = mode || NeoPixelMode.RGB;
        strip._matrixWidth = 0;
        strip.setBrightness(128)
        strip.setPin(pin)
        return strip;
    }

    /**
     * Converts red, green, blue channels into a RGB color
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% weight=1
    //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
    //% subcategory="Neopixel"
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% weight=2 blockGap=8
    //% blockId="neopixel_colors" block="%color"
    //% subcategory="Neopixel"
    export function colors(color: NeoPixelColors): number {
        return color;
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converts a hue saturation luminosity value into a RGB color
     * @param h hue from 0 to 360
     * @param s saturation from 0 to 99
     * @param l luminosity from 0 to 99
     */
    //% blockId=neopixelHSL block="hue %h|saturation %s|luminosity %l"
    export function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }



    let usedPin = AnalogPin.P0;

    function wait_for_signal() {
        while (pins.analogReadPin(usedPin) > 500) { }
    }


    function read_on() {
        let c = 0;
        while (pins.analogReadPin(usedPin) < 500 && c < 500) {
            c++;
        }
        return c;
    }

    function read_off() {
        let d = 0;
        while (pins.analogReadPin(usedPin) > 500 && d < 500) {
            d++;
        }
        return d;
    }

    function readKey() {
        wait_for_signal();
        let c1 = 0;
        let c2 = 0;
        let res = 0;
        while (c1 < 25 && c2 < 25) {
            c1 = read_on();
            c2 = read_off();
        }
        for (let i = 0; i < 32; i++) {
            c1 = read_on();
            c2 = read_off();
            res = res + res;
            if (c2 > 10) {
                res = res + 1;
            }
        }
        return res;
    }



    /**
     * This is a statement block
     */
    //% block
    //% group="红外传感器"
    export function initInfrared(pin: AnalogPin) {
        usedPin = pin
    }

    /**
     * This is a reporter block that returns a number
     */
    //% block
    //% group="红外传感器"
    export function getPressedKey(): string {
        let tasta = readKey()
        switch (tasta) {
            case 16753245:
                return "1"
            case 16736925:
                return "2"
            case 16769565:
                return "3"
            case 16720605:
                return "4"
            case 16712445:
                return "5"
            case 16761405:
                return "6"
            case 16769055:
                return "7"
            case 16754775:
                return "8"
            case 16748655:
                return "9"
            case 16750695:
                return "0"
            case 16738455:
                return "*"
            case 16756815:
                return "#"
            case 16718055:
                return "u"
            case 16730805:
                return "d"
            case 16716015:
                return "<"
            case 16734885:
                return ">"
            case 16726215:
                return "ok"
            default:
                return convertToText(tasta)
        }
    }


}
