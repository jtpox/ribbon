/*
 * Class to log onto the console.
 */
class Console {

    /*
     * Construct the definitions for emphasis, colors and background colors for the text.
     */
    constructor()
    {
        this.emphasis = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            underscore: '\x1b[4m',
            blink: '\x1b[5m',
            reverse: '\x1b[7m',
            hidden: '\x1b[8m'
        };

        this.foreground = {
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m'
        };

        this.background = {
            black: '\x1b[40m',
            red: '\x1b[41m',
            green: '\x1b[42m',
            yellow: '\x1b[43m',
            blue: '\x1b[44m',
            magenta: '\x1b[45m',
            cyan: '\x1b[46m',
            white: '\x1b[47m'
        };
    }

    /*
     * Send the log to console.
     * type: [ 'request/error', 'POST/GET/PUT/DELETE' ]
     * message: string
     * USAGE: this.log([ 'request', 'DELETE' ], req.path);
     */
    log(type, message)
    {
        //Constructing the start of the log.
        var log = '[';
        switch( type[0].toLowerCase() )
        {
            case "request":
            log += this.foreground.cyan + type[1].toUpperCase() + this.emphasis.reset;
            break;

            case "error":
            log += this.emphasis.blink + this.foreground.red +this.background.white + 'ERROR' + this.emphasis.reset;
            break;

            default:
            log += this.foreground.yellow + 'INFO' + this.emphasis.reset;
            break;
        }

        console.log(log + ']: ' + message);
    }

}

module.exports = Console;