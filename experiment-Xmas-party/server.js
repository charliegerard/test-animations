var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

server.listen(8000);

app.use('/', express.static('public'));

io.on('connection', function(socket){
  socket.on('new connection', function(data){

    fs.readFile("public/graph.json", "utf8", function(error, data) {
      var allData = JSON.parse(data);
      var numberOfConnections = allData.nodes.length
      allData.nodes.push({name: 'Connection ' + numberOfConnections, group: 1})

      var randomLinkLength = Math.floor(Math.random() * (15 - 5)) + 5;
      allData.links.push({source: allData.links.length, target: 0, value: randomLinkLength})

      fs.writeFile('public/graph.json', JSON.stringify(allData, null, 2), function(err, data){
        if(err){
          console.log('something went wrong')
        } else {
          console.log('all good!')
        }
      })

      socket.emit('redraw graph', {data: allData});
    });
  })
})
