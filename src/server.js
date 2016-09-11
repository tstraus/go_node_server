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

var index = fs.readFileSync(__dirname + '/index.html')

var app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(index)
})

var io = require('socket.io').listen(app)

io.on('connection', (socket) => {
    console.log(chalk.green('client connected'))

    //socket.emit('welcome', { message: 'Welcome!', id: socket.id })

    socket.on('move', (data) => {
        console.log(chalk.blue("color: ") + data.color)
        console.log(chalk.yellow("x: ") + data.x)
        console.log(chalk.yellow("y: ") + data.y)

        if (!(board[data.y][data.x] === 'black') && !(board[data.y][data.x] === 'white')) {
            board[data.y][data.x] = data.color
        }
        
        console.log(board)
    })

    socket.on('disconnect', () => {
        console.log(chalk.red('client disconnected'))
    })
})

app.listen(1234)