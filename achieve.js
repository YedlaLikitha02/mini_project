// Global variables
let map;
let markersLayer;
let currentFilter = 'all';

// Project data with detailed information and images
const projectsData = [
  {
    id: 1,
    name: "Kaleshwaram Lift Irrigation Project",
    category: "infrastructure",
    lat: 18.8176,
    lng: 79.7003,
    description: "World's largest multi-stage lift irrigation project",
    details: {
      title: "Kaleshwaram Lift Irrigation Project",
      subtitle: "Engineering Marvel of Telangana",
      cost: "₹80,500 Crores",
      beneficiaries: "37 Lakh Acres",
      completion: "2019",
      highlights: [
        "World's largest multi-stage lift irrigation project",
        "Pumps water from Godavari river to irrigate 37 lakh acres",
        "20 pumping stations with 1832 MW capacity",
        "Barrages at Medigadda, Annaram, and Sundilla",
        "Benefits 13 districts of Telangana"
      ],
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
        "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400"
      ]
    }
  },
  {
    id: 2,
    name: "Mission Bhagiratha",
    category: "infrastructure",
    lat: 17.3850,
    lng: 78.4867,
    description: "Providing safe drinking water to every household",
    details: {
      title: "Mission Bhagiratha",
      subtitle: "Safe Drinking Water for All",
      cost: "₹43,791 Crores",
      beneficiaries: "2.5 Crore People",
      completion: "2018",
      highlights: [
        "Largest drinking water supply project in the world",
        "Provides safe drinking water to 2.5 crore people",
        "Covers 25,000 habitations across all districts",
        "Water quality monitoring through advanced technology",
        "99% household coverage achieved"
      ],
      images: [
        "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400",
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
        "https://images.unsplash.com/photo-1594736797933-d0701ba2fe65?w=400"
      ]
    }
  },
  {
    id: 3,
    name: "Mission Kakatiya",
    category: "agriculture",
    lat: 18.0011,
    lng: 79.5885,
    description: "Restoration and renovation of minor irrigation tanks",
    details: {
      title: "Mission Kakatiya",
      subtitle: "Reviving Traditional Water Bodies",
      cost: "₹20,000 Crores",
      beneficiaries: "46,531 Tanks",
      completion: "Ongoing",
      highlights: [
        "Restoration of 46,531 minor irrigation tanks",
        "Revival of traditional water harvesting systems",
        "Increased groundwater levels significantly",
        "Enhanced agricultural productivity",
        "Community participation in tank restoration"
      ],
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400",
        "https://images.unsplash.com/photo-1574263867128-a3e5c1b1debc?w=400"
      ]
    }
  },
  {
    id: 4,
    name: "Rythu Bandhu",
    category: "agriculture",
    lat: 17.7431,
    lng: 83.3070,
    description: "Financial assistance to farmers for cultivation",
    details: {
      title: "Rythu Bandhu",
      subtitle: "Investment Support for Farmers",
      cost: "₹12,000 Crores annually",
      beneficiaries: "58 Lakh Farmers",
      completion: "2018 onwards",
      highlights: [
        "Direct investment support of ₹10,000 per acre per season",
        "Covers both Kharif and Rabi seasons",
        "Benefits 58 lakh farmer families",
        "No intermediaries - direct bank transfer",
        "Largest farmer investment support scheme in India"
      ],
      images: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
        "https://images.unsplash.com/photo-1592982604834-8e0aba1ec947?w=400",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
      ]
    }
  },
  {
    id: 5,
    name: "T-Hub",
    category: "technology",
    lat: 17.4435,
    lng: 78.3772,
    description: "India's leading innovation ecosystem",
    details: {
      title: "T-Hub",
      subtitle: "Fostering Innovation and Entrepreneurship",
      cost: "₹200 Crores",
      beneficiaries: "1000+ Startups",
      completion: "2015",
      highlights: [
        "India's largest startup incubator",
        "Supported over 1000 startups",
        "Partnership with global tech giants",
        "Created thousands of jobs",
        "Focus on emerging technologies like AI, IoT, and blockchain"
      ],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
      ]
    }
  },
  {
    id: 6,
    name: "KTR Metro Rail",
    category: "infrastructure",
    lat: 17.4065,
    lng: 78.4772,
    description: "Hyderabad Metro Rail connecting the city",
    details: {
      title: "Hyderabad Metro Rail",
      subtitle: "Transforming Urban Transportation",
      cost: "₹18,800 Crores",
      beneficiaries: "3 Million Daily Commuters",
      completion: "2017-2019",
      highlights: [
        "Largest metro rail project in PPP mode",
        "69 km operational network with 57 stations",
        "Reduces travel time by 50-60%",
        "Eco-friendly electric trains",
        "Integration with IT corridor and airport"
      ],
      images: [
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400",
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400",
        "https://images.unsplash.com/photo-1592454862781-6b4d8812d47d?w=400",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
      ]
    }
  }
];

// Initialize map
function initMap() {
  map = L.map('map').setView([17.8495, 79.0747], 7);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  markersLayer = L.layerGroup().addTo(map);
  loadMarkers();
}

// Load markers on map
function loadMarkers() {
  markersLayer.clearLayers();
  
  projectsData.forEach(project => {
    if (currentFilter === 'all' || project.category === currentFilter) {
      const icon = getIconByCategory(project.category);
      const marker = L.marker([project.lat, project.lng], { icon })
        .bindPopup(`
          <div class="popup-content">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <button onclick="showProjectDetails(${project.id})" class="details-btn">
              View Details
            </button>
          </div>
        `)
        .addTo(markersLayer);
    }
  });
}

// Get icon based on category
function getIconByCategory(category) {
  const iconColors = {
    infrastructure: '#e74c3c',
    agriculture: '#27ae60',
    technology: '#3498db',
    education: '#f39c12',
    healthcare: '#9b59b6'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${iconColors[category] || '#95a5a6'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

// Filter projects
function filterProjects(category) {
  currentFilter = category;
  loadMarkers();
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[onclick="filterProjects('${category}')"]`).classList.add('active');
}

// Show project details modal
function showProjectDetails(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;
  
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${project.details.title}</h2>
      <p class="subtitle">${project.details.subtitle}</p>
      <span class="close-btn" onclick="closeModal()">&times;</span>
    </div>
    
    <div class="modal-body">
      <div class="project-stats">
        <div class="stat-item">
          <h4>Investment</h4>
          <p>${project.details.cost}</p>
        </div>
        <div class="stat-item">
          <h4>Beneficiaries</h4>
          <p>${project.details.beneficiaries}</p>
        </div>
        <div class="stat-item">
          <h4>Completion</h4>
          <p>${project.details.completion}</p>
        </div>
      </div>
      
      <div class="image-gallery">
        ${project.details.images.map(img => 
          `<img src="${img}" alt="${project.name}" class="gallery-img">`
        ).join('')}
      </div>
      
      <div class="highlights">
        <h3>Key Highlights</h3>
        <ul>
          ${project.details.highlights.map(highlight => 
            `<li>${highlight}</li>`
          ).join('')}
        </ul>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('projectModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('projectModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);