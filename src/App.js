import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import QwertyHancock from './QwertyHancock'

function App() {
  useEffect(() => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext(),
      settings = {
        id: 'keyboard',
        width: 600,
        height: 150,
        startNote: 'A2',
        whiteNotesColour: '#fff',
        blackNotesColour: '#000',
        borderColour: '#000',
        activeColour: 'yellow',
        octaves: 2
      },
      keyboard = new QwertyHancock(settings);

    let masterGain = context.createGain();
    let nodes = [];

    masterGain.gain.value = 0.3;
    masterGain.connect(context.destination);

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

    // Analytics
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-32368229-1']);
    _gaq.push(['_trackPageview']);

    (function () {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  });
  return (
    <div className="App">
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
