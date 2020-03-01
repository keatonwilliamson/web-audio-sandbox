import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import QwertyHancock from './QwertyHancock'

function App() {
  useEffect(() => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    let keyboard = new QwertyHancock({
        id: 'keyboard',
        width: 600,
        height: 150,
        startNote: 'A2',
        whiteNotesColour: '#fff',
        blackNotesColour: '#000',
        borderColour: '#000',
        activeColour: 'yellow',
        octaves: 2
      });

    let masterGain = context.createGain();
    let analyser = context.createAnalyser();



    masterGain.gain.value = 0.3;
    masterGain.connect(analyser).connect(context.destination);

    let nodes = [];

    keyboard.keyDown = function (note, frequency) {
      var oscillator = context.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;
      oscillator.connect(masterGain);
      oscillator.start(0);

      nodes.push(oscillator);
    };

    keyboard.keyUp = function (note, frequency) {
      var new_nodes = [];

      for (var i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
          nodes[i].stop(0);
          nodes[i].disconnect();
        } else {
          new_nodes.push(nodes[i]);
        }
      }

      nodes = new_nodes;
    };

    // // Analytics
    // var _gaq = _gaq || [];
    // _gaq.push(['_setAccount', 'UA-32368229-1']);
    // _gaq.push(['_trackPageview']);

    // (function () {
    //   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    //   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    //   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    // })();

    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");
    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;
    // draw an oscilloscope of the current audio source

    function draw() {

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

  });
  return (
    <div className="App">
      <canvas class="visualizer" width="375" height="100"></canvas>
      <div id="keyboard"></div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
