$(document).ready(function(){
    var socket = io.connect('http://localhost:8000')
    // createGraph();

    $('#container').click(function(){
      createPersonOne();
      createPersonTwo();
      heartBeat();
      setTimeout(function(){
        merge();
        addToJson();
      }, 6000);
    })

  var createPersonOne = () => {
    var personOneDiv = $("<div class='person-one'></div>");

    personOneDiv.css({
      'width': '6em',
      'height': '6em',
      'backgroundColor': '#EB01A5',
      'borderRadius': '3em',
      'top': '40em',
      'left': '20em',
      'display': 'inline-block',
      'position': 'absolute'
    })

    $('body').append(personOneDiv);

    personOneDiv.animate({
      marginTop: "-=400"
    }, 3000);
  };

  var createPersonTwo = () => {
    var personTwoDiv = $("<div class='person-two'></div>");

    personTwoDiv.css({
      'width': '6em',
      'height': '6em',
      'backgroundColor': '#208075',
      'borderRadius': '3em',
      'top': '40em',
      'right': '20em',
      'display': 'inline-block',
      'position': 'absolute'
    })

    $('body').append(personTwoDiv);

    personTwoDiv.animate({
      marginTop: "-=400",
    }, 3000);
  };

  var merge = () => {
    $('.person-one').animate({
      left: '+=332',
      opacity: 0.5
    }, 1500)

    $('.person-two').animate({
      right: '+=332',
      opacity: 0.5
    }, 1500)

    setTimeout(function(){
      $('.person-one').fadeOut();
      $('.person-two').fadeOut();
    }, 3000);
  };

  var heartBeat = () => {
    $('.person-one').addClass('heartbeat');
    $('.person-two').addClass('heartbeat');
  }

  var fadePeopleToGraph = function(){
    $('.person-one').fadeOut("slow");
    $('.person-two').fadeOut("slow");
  }

  var testGraph = function(){
    d3.json("miserables.json", function(error, graph) {
      var width = 960,
        height = 500;

      var color = d3.scale.category10();

      var nodes = [],
          links = [];

      var force = d3.layout.force()
          .nodes(graph.nodes)
          .links(graph.links)
          .charge(-400)
          .linkDistance(120)
          .size([width, height])
          .on("tick", tick);

      var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

      var node = svg.selectAll(".node"),
          link = svg.selectAll(".link");

      // 1. Add three nodes and three links.
      setTimeout(function() {
        for(var i = 0; i < graph.nodes.length; i++){
          nodes.push(graph.nodes[i])
        }

        for(var y = 0; y < graph.links.length; y++){
          links.push(graph.links[y])
        }
        start();
      }, 0);

      socket.on('redraw graph', function(data){
        var nodes = data.data.nodes;
        var links = data.data.links;
        var latestNode = nodes[nodes.length - 1];
        var latestLink = links[links.length - 1];

        nodes.push(latestNode);
        links.push(latestLink);
        start(data);
      })

      function start(d) {
        if(d !== undefined){
          var nodeNumber = d.data.links.length -1;
          var links = graph.links.push(d.data.links[nodeNumber])
          var nodes = graph.nodes.push(d.data.nodes[nodeNumber])
        }
        link = link.data(graph.links);
        link.enter().insert("line").attr("class", "link");
        link.exit().remove();

        node = node.data(graph.nodes);
        node.enter().append("circle").attr("class", "node").attr("r", 8);
        node.exit().remove();

        force.start();
      }

      function tick() {
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
      }
    });
  }
  testGraph();

  var addToJson = function(){
    socket.emit('new connection', {});
  }

});
