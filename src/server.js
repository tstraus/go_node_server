var os = require('os');
var http = require('http')
var fs = require('fs')
var chalk = require('chalk')

function createArray(length) {
    var arr = new Array(length || 0), i = length

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1)
        while (i--) arr[length - 1 - i] = createArray.apply(this.args)
    }

    return arr
}

var board = createArray(19, 19)
var black = true
var connections = 0

var index = fs.readFileSync(__dirname + '/index.html')

var app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(index)
})

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log("Server IP: " + addresses)

var io = require('socket.io').listen(app)

io.on('connection', (socket) => {
    console.log(chalk.green('client connected'))
    connections++

    socket.emit('board', board, black)

    socket.on('attemptMove', (data) => {
        if (data.black) {
            console.log(chalk.blue("color: black"))
        }

        else {
            console.log(chalk.blue("color: white"))
        }

        console.log(chalk.yellow("x: ") + data.x)
        console.log(chalk.yellow("y: ") + data.y)

        if (!(board[data.y][data.x] === 'b') && !(board[data.y][data.x] === 'w')) {
            if (data.black) {
                board[data.y][data.x] = 'b'
            }

            else {
                board[data.y][data.x] = 'w'
            }

            io.emit('move', { black: black, x: data.x, y: data.y })
            black = !black
        }
    })

    socket.on('disconnect', () => {
        console.log(chalk.red('client disconnected'))
        connections--

        if (connections === 0) {
            board = createArray(19, 19)
            black = true
            console.log(chalk.magenta('board reset'))
        }
    })
})

app.listen(1234)
