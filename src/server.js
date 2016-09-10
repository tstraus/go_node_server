var http = require('http')
var fs = require('fs')
var chalk = require('chalk')

var index = fs.readFileSync(__dirname + '/index.html')

var app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(index)
})

var io = require('socket.io').listen(app)

io.on('connection', (socket) => {
    console.log(chalk.green('client connected'))

    socket.emit('welcome', { message: 'Welcome!', id: socket.id })

    socket.on('client', console.log)

    socket.on('message', (data) => {
        console.log(chalk.blue("move: ") + data.move)
    })

    socket.on('disconnect', () => {
        console.log(chalk.red('client disconnected'))
    })
})

app.listen(1234)