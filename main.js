'use strict';

var Vertice = function(name) {
  this.name = name;
  this.index = 1;
  this.relations = [];
  this.isMarked = false;
  this.addRelation = function(vertice) {
    this.relations.push(vertice);
  };
  this.setIndex = function(index) {
    this.index = index;
  };

  return this;
};

window.onload = function() {

var generator = document.querySelector('#generator'), vertices,
    BFS = document.querySelector('#BFS'),
    DFS = document.querySelector('#DFS');
generator.addEventListener('click', function (e) {
  vertices = +document.querySelector('#vertices').value;
  generateMatrix(vertices);
}, false);

DFS.addEventListener('click', function(e) {
  e.preventDefault();
  vertices = +document.querySelector('#vertices').value;
  var G = buildGraph(vertices);
  document.querySelector('.DFS-table').innerHTML = '';
  var start = document.querySelector('#start').value.toUpperCase();
  deepFisrtSearch(G, start);
});

BFS.addEventListener('click', function(e) {
  e.preventDefault();
  vertices = +document.querySelector('#vertices').value;
  var G = buildGraph(vertices);
  document.querySelector('.DFS-table').innerHTML = '';
  var start = document.querySelector('#start').value.toUpperCase();
  breadthFirstSearch(G, start);
});

};

function generateMatrix(vertices) {

  var matrix = document.querySelector('.matrix');

  matrix.innerHTML = '';

  for (let i = 0; i < vertices; i++) {
    var elem = document.createElement('div');
    elem.classList.add('matrix__row');
    elem.setAttribute('id', 'row' + i);
    for (let j = 0; j < vertices; j++) {
      let input = document.createElement('button');
      input.innerHTML = String.fromCharCode(65 + i) + '-' + String.fromCharCode(65 + j);
      input.setAttribute('data-value', 0);
      input.classList.add('matrix__input');
      input.classList.add('matrix__input-' + i + '_' + j);
      input.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('matrix__input-active');
        if (+this.dataset.value == 1) {
          this.dataset.value = 0;
        } else {
          this.dataset.value = 1;
        }
      });
      elem.appendChild(input);
    }
    matrix.appendChild(elem);
  }
}

function buildGraph(vertices) {
  var graph = [];
  if (checkSimmetry(vertices)) {
    for (let i = 0; i < vertices; i++) {
      graph[i] = new Vertice(String.fromCharCode(65 + i));
      if (String.fromCharCode(65 + i) == 'L') {
        console.log(graph[i]);
      }
    }
    for (let i = 0; i < vertices; i++) {
      for (let j = 0; j < vertices; j++) {
        if (+document.querySelector('.matrix__input-' + i + '_' + j).dataset.value == 1) {
          graph[i].addRelation(graph[j]);
        }
      }
    }
    console.log(graph);
    return graph;
  } else {
    return 'Failed to build graph';
  }
}

function checkSimmetry(vertices) {
  for (let i = 0; i < vertices; i++) {
    for (let j = 0; j < i; j++) {
      if (+document.querySelector('.matrix__input-' + i + '_' + j).value != +document.querySelector('.matrix__input-' + j + '_' + i).value) {
        return false;
      }
    }
  }

  return true;
}

function deepFisrtSearch(graph, startVerticeName, index = 0, queue = []) {
  var index = index, curVertice, Q = queue;
  for (let i = 0; i < graph.length; i++) {
    if (graph[i].name == startVerticeName) {
      curVertice = graph[i];
      graph[i].setIndex(index++);
      graph[i].isMarked = true;
      Q.push(graph[i].name);
      appendResults(curVertice.name, index, Q);
      break;
    }
  }
  while (curVertice.relations.length != 0) {
    if (curVertice.relations[0].isMarked) {
      curVertice.relations.shift();
    } else {
      index = deepFisrtSearch(graph, curVertice.relations[0].name, index, Q);
    }
  }
  Q.pop();
  appendResults('-', '-', Q);
  return index;
}

function breadthFirstSearch(graph, startVerticeName, Q = []) {
  var index = 0, curLevel = [];
  for (let i = 0; i < graph.length; i++) {
    if (graph[i].name == startVerticeName) {
      curLevel.push(graph[i]);
      graph[i].setIndex(index++);
      graph[i].isMarked = true;
      Q.push(graph[i].name);
      appendResults(graph[i].name, index, Q);
      break;
    }
  }

  while (curLevel.length != 0) {
    for(let j = 0; j < curLevel[0].relations.length; j++) {
      if (!curLevel[0].relations[j].isMarked) {
        curLevel[0].relations[j].isMarked = true;
        curLevel[0].relations[j].setIndex(index++);
        curLevel.push(curLevel[0].relations[j]);
        Q.push(curLevel[0].relations[j].name);
        appendResults(curLevel[0].relations[j].name, index, Q);
      }
    }
    curLevel.shift();
    Q.shift();
    appendResults('-', '-', Q);
  }
  // while (Q.length != 0) {

    // curLevel.forEach(function(item, i, arr) {
    //   for(let j = 0; j < item.relations.length; j++) {
    //     if (!item.relations[j].isMarked) {
    //       item.relations[j].isMarked = true;
    //       item.relations[j].setIndex(index++);
    //       curLevel.push(item.relations[j]);
    //       Q.push(item.relations[j].name);
    //       appendResults(item.relations[j].name, index, Q);
    //     }
    //   }
    //   curLevel.shift();
    //   Q.shift();
    //   appendResults('-', '-', Q);
    // });
  // }
}

function appendResults() {
  var table = document.querySelector('.DFS-table'),
      tr = document.createElement('tr');
  for (let i = 0; i < arguments.length; i++) {
    var td = document.createElement('td');
    td.innerHTML = arguments[i];
    tr.appendChild(td);
  }
  table.appendChild(tr);
}
