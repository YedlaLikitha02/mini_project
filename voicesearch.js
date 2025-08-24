import { db } from "./firebase-config.js";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // ✅ Setup Image Classifier
  const imageInput = document.getElementById("imageClassifierInput");
  const preview = document.getElementById("imageClassifierPreview");
  const result = document.getElementById("imageClassifierResult");
  const button = document.getElementById("imageClassifierButton");
  const clearButton = document.getElementById("clearImageButton");
  
  // Variable to store the image data
  let base64Image = "";
  
  // Set up the image input event handler
  imageInput.addEventListener("change", function() {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function() {
        base64Image = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
        preview.src = reader.result;
        preview.style.display = "block";
        console.log("✅ Base64 image loaded.");
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Set up clear button
  clearButton.addEventListener("click", function() {
    // Clear the image
    base64Image = "";
    preview.src = "";
    preview.style.display = "none";
    result.innerText = "";
    
    // Reset the file input
    imageInput.value = "";
    
    console.log("🧹 Image cleared.");
  });
  
  // ✅ Setup Web Speech API for Voice Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN"; // Indian English

  // ✅ Handle "Voice Search" Button Click
  document.getElementById("voicesearch").addEventListener("click", () => {
    try {
      recognition.abort(); // 🔁 Safely stop if already running
      recognition.start(); // ✅ Then start again
      console.log("Listening for a state name...");
    } catch (err) {
      console.error("❌ Speech Recognition Error:", err);
    }
  });

  // ✅ Process Speech Input
  recognition.onresult = async (event) => {
    const stateName = event.results[0][0].transcript.toLowerCase().trim().replace(/[^a-z\s]/g, "");
    console.log("Cleaned State Name:", `"${stateName}"`);
    
    highlightState(stateName);
  };

  // ✅ Image Classification Button Click
  button.addEventListener("click", async function() {
    if (!base64Image) {
      alert("⚠️ Please upload an image first.");
      return;
    }
    
    const apiKey = "MeJEFfdWsYRjvNmgmFJG";
    const model = "my-first-project-i0o4p";
    const version = 32;
    
    try {
      result.innerText = "🔄 Processing image...";
      
      const response = await fetch(
        `https://classify.roboflow.com/${model}/${version}?api_key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: base64Image
        }
      );
      
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data = await response.json();
      console.log("📊 Roboflow response:", data);
      
      if (data?.predictions?.length > 0) {
        const { class: cmName, confidence } = data.predictions[0];
        result.innerText = `✅ Recognized: ${cmName} (${(confidence * 100).toFixed(2)}%)`;
        
        // Map the CM to their state
        await findStateForCM(cmName);
      } else {
        result.innerText = "ℹ️ No predictions found.";
      }
    } catch (err) {
      console.error("❌ Error during classification:", err);
      result.innerText = `❌ Error: ${err.message}`;
    }
  });
  
  // Function to find the state based on CM name
  async function findStateForCM(cmName) {
    try {
      // Hardcoded mapping of CMs to states for quick lookup
      const cmToStateMap = {
        "Y. S. Jagan Mohan Reddy": "andhra pradesh",
         "N.Chandrababu Naidu": "andhra pradesh",
        "Siddaramaiah": "karnataka",
        "Kalvakuntla_Chandrashekar_Rao": "telangana",
        "Anumula Revanth Reddy": "telangana",
        "Devendra Gangadharrao Fadnavis":"maharashtra",
        "M. K. Stalin":"tamil nadu",
        "Pinarayi Vijayan":"kerala"
        // Add more CM to state mappings as needed
      };
      
      // First try the hardcoded map
      let stateName = cmToStateMap[cmName];
      
      // If not found in hardcoded map, try Firebase
      if (!stateName) {
        try {
          const statesRef = collection(db, "states");
          const q = query(statesRef, where("chief_minister", "==", cmName));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Get the first matching state
            const stateDoc = querySnapshot.docs[0];
            const stateData = stateDoc.data();
            stateName = stateData.name.toLowerCase();
          }
        } catch (err) {
          console.error("Firebase query error:", err);
          // Continue with the function even if Firebase fails
        }
      }
      
      if (stateName) {
        console.log(`✅ Found state for CM ${cmName}: ${stateName}`);
        highlightState(stateName);
        result.innerText += `\n✅ State: ${stateName}`;
      } else {
        console.log(`❌ No state found for CM: ${cmName}`);
        result.innerText += "\n❌ Could not find state for this CM.";
      }
    } catch (err) {
      console.error("Error finding state for CM:", err);
      result.innerText += `\n❌ Error: ${err.message}`;
    }
  }
});

// Function to highlight a state and fetch its info
function highlightState(stateName) {
  console.log("Attempting to highlight state:", stateName);
  
  // Try finding the state element by data-name attribute
  let stateElement = document.querySelector(`[data-name="${stateName}"]`);
  
  // If not found, try finding by ID
  if (!stateElement) {
    // Map of state names to their IDs in your SVG
    const stateToIdMap = {
      "andhra pradesh": "INAP",
      "telangana": "INTG",
      "kerala": "INKL",
      "tamil nadu": "INTN",
      "maharashtra":"INMH",
      "karnataka":"INKA"
      // Add more mappings as needed
    };
    
    const stateId = stateToIdMap[stateName];
    if (stateId) {
      stateElement = document.getElementById(stateId);
    }
  }
  
  if (stateElement) {
    // Highlight the state
    stateElement.style.fill = "yellow";
    setTimeout(() => { stateElement.style.fill = ""; }, 2000);
    
    // Fetch and display state info
    fetchStateInfo(stateName);
  } else {
    console.log("❌ State not found on the map:", stateName);
    alert(`State "${stateName}" not found on the map.`);
  }
}

// ✅ Fetch State Info from Firebase
async function fetchStateInfo(stateName) {
  console.log("Fetching from Firebase for:", stateName);
  const docRef = doc(db, "states", stateName.toLowerCase());
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const stateData = docSnap.data();
    console.log("✅ State Data:", stateData);
    displayStateDetails(stateData);
    readOutStateDetails(stateData);
  } else {
    alert("❌ State data not found in Firebase!");
  }
}

// ✅ Display State Data in White
function displayStateDetails(stateData) {
  const infoDiv = document.getElementById("stateInfo");
  if (!infoDiv) {
    alert("❌ Element with ID 'stateInfo' not found in HTML!");
    return;
  }
  
  infoDiv.innerHTML = `
    <strong>${stateData.name}</strong><br>
    🏛 Capital: ${stateData.capital}<br>
    👨‍💼 Chief Minister: ${stateData.chief_minister}<br>
    🗣 Official Language: ${stateData.official_language}<br>
    📅 Formation Day: ${stateData.formation_day}
  `;
}

// ✅ AI Reads Out State Details
function readOutStateDetails(stateData) {
  const speech = new SpeechSynthesisUtterance();
  const text = `Here are the details for ${stateData.name}.
    The capital is ${stateData.capital}.
    The current Chief Minister is ${stateData.chief_minister}.
    The official language is ${stateData.official_language}.
    It was formed on ${stateData.formation_day}.`;
  
  speech.text = text;
  speech.lang = "en-IN";
  speech.rate = 0.9;
  speech.volume = 1;
  speech.pitch = 1;
  
  speech.onend = () => console.log("Finished Speaking!");
  window.speechSynthesis.speak(speech);
}