

const map = L.map('map').setView([23.5937, 80.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let geojsonData;
let sortedStates = [];
let currentIndex = 0;
let interval = null;
let speed = 1500;

const playPauseBtn = document.getElementById("playPauseBtn");
const speedSlider = document.getElementById("speedRange");
const infoText = document.getElementById("infoText");

fetch('indiaStates.geojson')
  .then(res => res.json())
  .then(data => {
    geojsonData = data;
    sortedStates = [...data.features].sort((a, b) =>
      a.properties.formation_year - b.properties.formation_year
    );
  });

function highlightState(stateFeature) {
  const layer = L.geoJSON(stateFeature, {
    style: {
      color: "orange",
      weight: 2,
      fillOpacity: 0.6
    }
  }).addTo(map);

  const stateName = stateFeature.properties.state_name;
  fetchGrokInfo(stateName).then((info) => {
    infoText.textContent = `${stateName}: ${info}`;
  });
}

function startAnimation() {
  interval = setInterval(() => {
    if (currentIndex >= sortedStates.length) {
      clearInterval(interval);
      playPauseBtn.textContent = "Play";
      return;
    }
    highlightState(sortedStates[currentIndex]);
    currentIndex++;
  }, speed);
  playPauseBtn.textContent = "Pause";
}

function stopAnimation() {
  clearInterval(interval);
  interval = null;
  playPauseBtn.textContent = "Play";
}

playPauseBtn.addEventListener("click", () => {
  if (interval) {
    stopAnimation();
  } else {
    startAnimation();
  }
});

speedSlider.addEventListener("input", (e) => {
  speed = Number(e.target.value);
  if (interval) {
    stopAnimation();
    startAnimation();
  }
});

async function fetchGrokInfo(stateName) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "user",
          content: `In 3 sentences, explain the formation and early leadership of the Indian state ${stateName}.`
        }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No info available.";
}
