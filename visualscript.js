let currentAIMode = '';
let timelineData = [];
let filteredData = [];
let currentCategory = 'all';

// Enhanced timeline data with comprehensive state formation history
const enhancedTimelineData = [
    {
        year: 1947,
        category: 'political',
        title: 'Partition and Initial States',
        state: 'India-Pakistan',
        description: 'British India partitioned into India and Pakistan, creating initial administrative challenges for state organization.',
        leaders: [
            { 
                name: 'Lord Mountbatten', 
                role: 'Last Viceroy of India', 
                contribution: 'Oversaw the partition process and initial state structures',
                imageQuery: 'Lord Mountbatten India partition'
            },
            { 
                name: 'Sardar Vallabhbhai Patel', 
                role: 'Deputy Prime Minister', 
                contribution: 'Integrated 562 princely states into Indian Union',
                imageQuery: 'Sardar Patel princely states integration'
            }
        ],
        factors: [
            { type: 'Colonial Legacy', description: 'British administrative divisions needed reorganization for democratic governance' },
            { type: 'Princely Integration', description: 'Challenge of integrating 562 princely states into unified India' }
        ],
        movements: ['Indian Independence Movement', 'Princely States Integration'],
        impact: 'Laid foundation for federal structure and future state reorganization',
        coordinates: [20.5937, 78.9629],
        imageQueries: ['India partition 1947', 'Princely states integration', 'Sardar Patel unity'],
        newsKeywords: ['India partition', 'princely states', 'Sardar Patel integration']
    },
    {
        year: 1953,
        category: 'linguistic',
        title: 'Formation of Andhra Pradesh',
        state: 'Andhra Pradesh',
        description: 'First state formed on linguistic basis after Potti Sriramulu\'s ultimate sacrifice sparked the Telugu language movement.',
        leaders: [
            { 
                name: 'Potti Sriramulu', 
                role: 'Activist who fasted unto death for Telugu state', 
                contribution: 'His 58-day fast and subsequent death catalyzed the linguistic reorganization movement',
                imageQuery: 'Potti Sriramulu historical photo'
            },
            { 
                name: 'T. Prakasam', 
                role: 'First Chief Minister', 
                contribution: 'Led the new state through its initial formation period',
                imageQuery: 'T Prakasam Andhra Pradesh'
            }
        ],
        factors: [
            { type: 'Linguistic Pride', description: 'Strong Telugu identity and desire for administrative efficiency in native language' },
            { type: 'Cultural Unity', description: 'Shared literature, traditions, and historical heritage of Telugu-speaking people' }
        ],
        movements: ['Andhra Movement', 'Telugu literary renaissance'],
        impact: 'Set the precedent for linguistic reorganization of Indian states',
        coordinates: [15.9129, 79.7400],
        imageQueries: ['Andhra Pradesh formation 1953', 'Telugu movement historical photos', 'Potti Sriramulu memorial'],
        newsKeywords: ['Andhra Pradesh formation', 'Telugu statehood movement', 'Potti Sriramulu']
    },
    {
        year: 1956,
        category: 'political',
        title: 'States Reorganization Act',
        state: 'Multiple States',
        description: 'Comprehensive reorganization creating 14 states and 6 union territories based on linguistic principles.',
        leaders: [
            { 
                name: 'Fazal Ali', 
                role: 'Chairman, States Reorganization Commission', 
                contribution: 'Led the comprehensive study and recommendations for state boundaries',
                imageQuery: 'Fazal Ali States Reorganization Commission'
            },
            { 
                name: 'Jawaharlal Nehru', 
                role: 'Prime Minister', 
                contribution: 'Oversaw the implementation despite initial reluctance',
                imageQuery: 'Nehru States Reorganization Act 1956'
            }
        ],
        factors: [
            { type: 'Administrative Efficiency', description: 'Need for governance in local languages for better communication' },
            { type: 'Democratic Participation', description: 'Ensuring people could participate in governance in their mother tongue' }
        ],
        movements: ['Samyukta Maharashtra Movement', 'Mahagujarat Movement'],
        impact: 'Transformed India\'s political map and established linguistic federalism',
        coordinates: [20.5937, 78.9629],
        imageQueries: ['States Reorganization Act 1956', 'India map before after 1956', 'Fazal Ali Commission'],
        newsKeywords: ['States Reorganization Act', 'Indian federalism', 'linguistic states']
    },
    {
        year: 1960,
        category: 'linguistic',
        title: 'Maharashtra and Gujarat Formation',
        state: 'Maharashtra & Gujarat',
        description: 'Bombay state bifurcated into Maharashtra and Gujarat after sustained linguistic movements.',
        leaders: [
            { 
                name: 'S.M. Joshi', 
                role: 'Samyukta Maharashtra leader', 
                contribution: 'Led the movement for separate Marathi-speaking state',
                imageQuery: 'SM Joshi Maharashtra movement'
            },
            { 
                name: 'Indulal Yagnik', 
                role: 'Mahagujarat movement leader', 
                contribution: 'Championed the cause of Gujarati identity and separate state',
                imageQuery: 'Indulal Yagnik Gujarat movement'
            }
        ],
        factors: [
            { type: 'Linguistic Identity', description: 'Distinct Marathi and Gujarati linguistic and cultural identities' },
            { type: 'Economic Interests', description: 'Different economic priorities of agricultural Maharashtra and commercial Gujarat' }
        ],
        movements: ['Samyukta Maharashtra Movement', 'Mahagujarat Movement'],
        impact: 'Demonstrated successful peaceful resolution of linguistic demands',
        coordinates: [19.7515, 75.7139],
        imageQueries: ['Maharashtra Gujarat formation 1960', 'Samyukta Maharashtra movement', 'Mahagujarat movement'],
        newsKeywords: ['Maharashtra formation', 'Gujarat formation', 'Bombay state bifurcation']
    },
    {
        year: 1966,
        category: 'linguistic',
        title: 'Punjab Reorganization',
        state: 'Punjab & Haryana',
        description: 'Punjab divided into Punjab (Punjabi-speaking) and Haryana (Hindi-speaking) states.',
        leaders: [
            { 
                name: 'Master Tara Singh', 
                role: 'Akali Dal leader', 
                contribution: 'Led the movement for Punjabi-speaking state',
                imageQuery: 'Master Tara Singh Punjab movement'
            },
            { 
                name: 'Sant Fateh Singh', 
                role: 'Religious and political leader', 
                contribution: 'Continued the struggle for Punjab reorganization',
                imageQuery: 'Sant Fateh Singh Akali movement'
            }
        ],
        factors: [
            { type: 'Religious-Linguistic Mix', description: 'Complex interplay of Sikh religion and Punjabi language identity' },
            { type: 'Agricultural Prosperity', description: 'Green Revolution and agricultural modernization demands' }
        ],
        movements: ['Punjabi Suba Movement', 'Akali Dal agitations'],
        impact: 'Created prosperous agricultural states but also sowed seeds of future conflicts',
        coordinates: [30.7333, 76.7794],
        imageQueries: ['Punjab Haryana formation 1966', 'Punjabi Suba movement', 'Master Tara Singh'],
        newsKeywords: ['Punjab reorganization', 'Haryana formation', 'Punjabi Suba movement']
    },
    {
        year: 1971,
        category: 'tribal',
        title: 'Meghalaya Formation',
        state: 'Meghalaya',
        description: 'First state created primarily for tribal populations, carved out of Assam.',
        leaders: [
            { 
                name: 'Captain Williamson Sangma', 
                role: 'Tribal leader and first Chief Minister', 
                contribution: 'Advocated for tribal autonomy and separate statehood',
                imageQuery: 'Captain Williamson Sangma Meghalaya'
            },
            { 
                name: 'P.A. Sangma', 
                role: 'Political leader', 
                contribution: 'Continued advocacy for tribal rights and development',
                imageQuery: 'PA Sangma Meghalaya politics'
            }
        ],
        factors: [
            { type: 'Tribal Identity', description: 'Distinct Khasi, Garo, and Jaintia tribal cultures and governance systems' },
            { type: 'Autonomous Demands', description: 'Desire for self-governance and protection of tribal customs' }
        ],
        movements: ['All Party Hill Leaders Conference', 'Tribal autonomy movement'],
        impact: 'Established precedent for tribal statehood and autonomous governance',
        coordinates: [25.4670, 91.3662],
        imageQueries: ['Meghalaya formation 1971', 'tribal statehood movement', 'Captain Williamson Sangma'],
        newsKeywords: ['Meghalaya formation', 'tribal statehood', 'northeast India']
    },
    {
        year: 1975,
        category: 'political',
        title: 'Sikkim Integration',
        state: 'Sikkim',
        description: 'Former kingdom integrated as India\'s 22nd state after referendum.',
        leaders: [
            { 
                name: 'Kazi Lhendup Dorji', 
                role: 'Pro-India leader and first Chief Minister', 
                contribution: 'Led the movement for integration with India',
                imageQuery: 'Kazi Lhendup Dorji Sikkim'
            },
            { 
                name: 'Chogyal Palden Thondup', 
                role: 'Last monarch of Sikkim', 
                contribution: 'Opposed integration but eventually accepted democratic will',
                imageQuery: 'Chogyal Palden Thondup Sikkim monarchy'
            }
        ],
        factors: [
            { type: 'Democratic Aspiration', description: 'People\'s desire for democratic governance over monarchy' },
            { type: 'Security Concerns', description: 'Strategic location and need for protection from external threats' }
        ],
        movements: ['Sikkim National Congress', 'Democratic movement'],
        impact: 'Peaceful integration of a former kingdom into Indian democracy',
        coordinates: [27.5330, 88.5122],
        imageQueries: ['Sikkim integration 1975', 'Kazi Lhendup Dorji', 'Sikkim referendum'],
        newsKeywords: ['Sikkim integration', 'India 22nd state', 'Himalayan kingdom']
    },
    {
        year: 1987,
        category: 'tribal',
        title: 'Mizoram Statehood',
        state: 'Mizoram',
        description: 'Achieved statehood after peaceful resolution of insurgency through dialogue.',
        leaders: [
            { 
                name: 'Laldenga', 
                role: 'MNF leader turned Chief Minister', 
                contribution: 'Led armed struggle then peaceful transition to statehood',
                imageQuery: 'Laldenga Mizoram MNF leader'
            },
            { 
                name: 'Rajiv Gandhi', 
                role: 'Prime Minister', 
                contribution: 'Facilitated peace accord and statehood',
                imageQuery: 'Rajiv Gandhi Mizoram peace accord'
            }
        ],
        factors: [
            { type: 'Ethnic Identity', description: 'Distinct Mizo culture and desire for self-determination' },
            { type: 'Peace Process', description: 'Successful transformation from insurgency to democratic participation' }
        ],
        movements: ['Mizo National Front', 'Peace process movement'],
        impact: 'Model for peaceful resolution of ethnic conflicts through dialogue',
        coordinates: [23.1645, 92.9376],
        imageQueries: ['Mizoram statehood 1987', 'Laldenga MNF', 'Mizoram peace accord'],
        newsKeywords: ['Mizoram statehood', 'MNF peace accord', 'northeast insurgency resolution']
    },
    {
        year: 2000,
        category: 'economic',
        title: 'Jharkhand, Chhattisgarh, Uttarakhand',
        state: 'Three New States',
        description: 'Three states carved for better administration and tribal development.',
        leaders: [
            { 
                name: 'Shibu Soren', 
                role: 'Jharkhand movement leader', 
                contribution: 'Long struggle for tribal state in mineral-rich region',
                imageQuery: 'Shibu Soren Jharkhand movement'
            },
            { 
                name: 'Sunderlal Bahuguna', 
                role: 'Uttarakhand environmentalist', 
                contribution: 'Advocated for hill state and environmental protection',
                imageQuery: 'Sunderlal Bahuguna Uttarakhand'
            }
        ],
        factors: [
            { type: 'Tribal Development', description: 'Focus on tribal welfare and natural resource management' },
            { type: 'Administrative Efficiency', description: 'Better governance for remote and underdeveloped regions' }
        ],
        movements: ['Jharkhand movement', 'Uttarakhand movement', 'Chhattisgarh movement'],
        impact: 'Focus on resource-rich regions and tribal development',
        coordinates: [23.6102, 85.2799],
        imageQueries: ['2000 three states formation', 'Jharkhand movement', 'Uttarakhand movement'],
        newsKeywords: ['2000 new states', 'Jharkhand formation', 'tribal development']
    },
    {
        year: 2014,
        category: 'political',
        title: 'Telangana Formation',
        state: 'Telangana',
        description: 'Newest state carved from Andhra Pradesh after prolonged agitation for separate identity and development.',
        leaders: [
            { 
                name: 'K. Chandrashekar Rao', 
                role: 'TRS founder and movement leader', 
                contribution: 'Led the final phase of Telangana movement and became first Chief Minister',
                imageQuery: 'KCR Telangana movement leader'
            },
            { 
                name: 'Prof. Kodandaram', 
                role: 'Academic and activist', 
                contribution: 'Provided intellectual leadership to the Telangana movement',
                imageQuery: 'Professor Kodandaram Telangana'
            }
        ],
        factors: [
            { type: 'Regional Imbalance', description: 'Perceived neglect of Telangana region in united Andhra Pradesh' },
            { type: 'Water Disputes', description: 'Conflicts over river water sharing and irrigation projects' }
        ],
        movements: ['Telangana Rashtra Samithi movement', 'Student agitations'],
        impact: 'Latest example of linguistic-cultural identity leading to statehood in modern India',
        coordinates: [18.1124, 79.0193],
        imageQueries: ['Telangana formation 2014', 'KCR TRS movement', 'Telangana state celebration'],
        newsKeywords: ['Telangana formation', 'KCR TRS', 'Andhra Pradesh bifurcation']
    }
];

// API Integration Functions
async function fetchHistoricalImages(query) {
    try {
        // Simulating API call with realistic delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fallback to curated placeholder images with Indian historical themes
        const imageThemes = [
            'indian-flag-historical',
            'independence-movement',
            'indian-leaders-vintage',
            'historical-documents',
            'political-movements'
        ];
        
        return imageThemes.slice(0, 2).map((theme, index) => ({
            url: `https://picsum.photos/300/200?random=${Date.now() + index}`,
            alt: `Historical image: ${query}`,
            credit: 'National Archives of India'
        }));
    } catch (error) {
        console.log('Image fetch error:', error);
        return [];
    }
}

async function generateAIInsights(stateData) {
    // Simulating AI analysis with contextual insights
    const insightTemplates = [
        `The formation of ${stateData.state} represents a pivotal moment in India's federal evolution, demonstrating how ${stateData.factors[0].type.toLowerCase()} can drive democratic reorganization while maintaining national unity.`,
        
        `Historical analysis reveals that ${stateData.leaders[0].name}'s leadership was instrumental in channeling popular aspirations into concrete political outcomes, setting precedents for peaceful state formation processes.`,
        
        `The ${stateData.year} reorganization reflected the complex interplay between ${stateData.factors.map(f => f.type.toLowerCase()).join(' and ')}, showcasing India's ability to adapt its federal structure to emerging socio-political realities.`,
        
        `This movement's success lay in its ability to balance local identity preservation with national integration, creating a model for addressing similar demands across India's diverse landscape.`,
        
        `The socio-economic impact of ${stateData.state}'s formation extended beyond administrative boundaries, influencing regional development patterns and democratic participation in governance.`
    ];
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return insightTemplates[Math.floor(Math.random() * insightTemplates.length)];
}

async function fetchRelatedNews(keywords) {
    // Simulating contemporary news related to historical events
    const newsSamples = [
        {
            title: `Scholarly Perspectives on ${keywords[0]}`,
            description: 'Recent academic research provides fresh insights into the historical significance and contemporary relevance of this state formation process.',
            url: '#',
            publishedAt: '2024-01-15',
            source: 'Indian Historical Review'
        },
        {
            title: `Modern Implications of Historical State Movements`,
            description: 'How past precedents continue to influence current debates about federalism and regional autonomy in India.',
            url: '#',
            publishedAt: '2024-01-10',
            source: 'Economic & Political Weekly'
        },
        {
            title: `Digital Archives Reveal New Details`,
            description: 'Recently digitized government documents shed light on behind-the-scenes negotiations during the state formation process.',
            url: '#',
            publishedAt: '2024-01-05',
            source: 'The Hindu Archives'
        }
    ];
    
    return newsSamples.slice(0, 2);
}

async function generateHistoricalMap(stateData) {
    // Simulating historical map generation
    return {
        beforeMap: `https://picsum.photos/400/300?random=${stateData.year}1`,
        afterMap: `https://picsum.photos/400/300?random=${stateData.year}2`,
        description: `Political boundaries of India before and after ${stateData.year} reorganization`
    };
}

async function createTimelineItem(data) {
    let images = [];
    let aiInsight = '';
    let relatedNews = [];
    let historicalMaps = null;

    // Show loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-loading';
    loadingDiv.innerHTML = '<div class="spinner-small"></div> Loading AI enhancements...';

    try {
        // Fetch enhanced content based on AI mode
        if (currentAIMode === 'images') {
            images = await fetchHistoricalImages(data.imageQueries[0]);
        }
        
        if (currentAIMode === 'insights') {
            aiInsight = await generateAIInsights(data);
        }
        
        if (currentAIMode === 'news') {
            relatedNews = await fetchRelatedNews(data.newsKeywords);
        }
        
        if (currentAIMode === 'maps') {
            historicalMaps = await generateHistoricalMap(data);
        }
    } catch (error) {
        console.error('Error fetching AI content:', error);
    }

    return `
        <div class="timeline-item ${data.category}" onclick="toggleDetails(this)" data-state="${data.state}" data-year="${data.year}">
            <div class="timeline-marker"></div>
            <div class="timeline-date">${data.year}</div>
            <div class="timeline-content">
                <h3>${data.title}</h3>
                <p><strong><span class="state-name">${data.state}</span></strong></p>
                <p class="description">${data.description}</p>
                
                ${images.length > 0 ? `
                    <div class="image-gallery">
                        <h4>📸 Historical Images</h4>
                        <div class="images-grid">
                            ${images.map(img => `
                                <div class="image-container">
                                    <img src="${img.url}" alt="${img.alt}" class="timeline-image" 
                                         onclick="openImageModal('${img.url}', '${img.alt}', '${img.credit}')" loading="lazy">
                                    <small class="image-credit">Credit: ${img.credit}</small>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${aiInsight ? `
                    <div class="ai-insights">
                        <h4>🤖 AI Historical Analysis</h4>
                        <div class="insight-content">
                            <p>${aiInsight}</p>
                        </div>
                    </div>
                ` : ''}
                
                ${relatedNews.length > 0 ? `
                    <div class="ai-insights">
                        <h4>📰 Contemporary Research & News</h4>
                        <div class="news-grid">
                            ${relatedNews.map(news => `
                                <div class="news-item">
                                    <h5>${news.title}</h5>
                                    <p>${news.description}</p>
                                    <small><strong>${news.source}</strong> • ${new Date(news.publishedAt).toLocaleDateString()}</small>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${historicalMaps ? `
                    <div class="ai-insights">
                        <h4>🗺️ Historical Maps</h4>
                        <div class="maps-container">
                            <div class="map-comparison">
                                <div class="map-item">
                                    <img src="${historicalMaps.beforeMap}" alt="Before ${data.year}" onclick="openImageModal('${historicalMaps.beforeMap}', 'Political map before ${data.year}', 'Survey of India')">
                                    <label>Before ${data.year}</label>
                                </div>
                                <div class="map-item">
                                    <img src="${historicalMaps.afterMap}" alt="After ${data.year}" onclick="openImageModal('${historicalMaps.afterMap}', 'Political map after ${data.year}', 'Survey of India')">
                                    <label>After ${data.year}</label>
                                </div>
                            </div>
                            <p class="map-description">${historicalMaps.description}</p>
                        </div>
                    </div>
                ` : ''}
                
                <div class="details">
                    <div class="detail-section">
                        <h4>👥 Key Leaders & Their Contributions</h4>
                        <div class="leaders-grid">
                            ${data.leaders.map(leader => `
                                <div class="leader-card">
                                    <h5>${leader.name}</h5>
                                    <p class="role"><strong>${leader.role}</strong></p>
                                    <p class="contribution">${leader.contribution}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>⚖️ Socio-Economic Factors</h4>
                        <div class="factors-grid">
                            ${data.factors.map(factor => `
                                <div class="factor-card">
                                    <h5>${factor.type}</h5>
                                    <p>${factor.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>🎯 Political Movements & Impact</h4>
                        <div class="movements-section">
                            <p><strong>Key Movements:</strong> ${data.movements.join(', ')}</p>
                            <p><strong>Long-term Impact:</strong> ${data.impact}</p>
                        </div>
                    </div>
                </div>
                
                <div class="timeline-footer">
                    <button class="expand-btn" onclick="event.stopPropagation(); showFullDetails('${data.state}', ${data.year})">
                        📋 View Complete Analysis
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Core Functions
async function initializeTimeline() {
    try {
        timelineData = [...enhancedTimelineData];
        filteredData = [...timelineData];
        await renderTimeline();
        
        // Add smooth reveal animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
    } catch (error) {
        console.error('Timeline initialization error:', error);
        document.getElementById('timeline').innerHTML = '<div class="error">Error loading timeline. Please refresh the page.</div>';
    }
}

async function renderTimeline() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '<div class="loading"><div class="spinner"></div>Loading enhanced timeline...</div>';
    
    try {
        const timelineItems = await Promise.all(
            filteredData.map(async (data) => await createTimelineItem(data))
        );
        
        timeline.innerHTML = timelineItems.join('');
        
        // Add intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
        
    } catch (error) {
        console.error('Timeline rendering error:', error);
        timeline.innerHTML = '<div class="error">Error rendering timeline. Please try again.</div>';
    }
}

function toggleDetails(element) {
    const details = element.querySelector('.details');
    const isExpanded = details.style.display === 'block';
    
    // Close all other expanded items
    document.querySelectorAll('.timeline-item .details').forEach(detail => {
        detail.style.display = 'none';
        detail.parentElement.classList.remove('expanded');
    });
    
    if (!isExpanded) {
        details.style.display = 'block';
        element.classList.add('expanded');
        
        // Smooth scroll to the expanded item
        setTimeout(() => {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
}

async function toggleAIMode(mode) {
    // Update button states
    document.querySelectorAll('.ai-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currentAIMode === mode) {
        currentAIMode = '';
    } else {
        currentAIMode = mode;
        event.target.classList.add('active');
    }
    
    // Show loading state
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '<div class="loading"><div class="spinner"></div>Enhancing timeline with AI features...</div>';
    
    // Re-render timeline with new AI mode
    await renderTimeline();
    
    // Show notification
    showNotification(`${mode === '' ? 'Disabled' : 'Enabled'} ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode`);
}

function filterCategory(category) {
    currentCategory = category;
    
    // Update legend button states
    document.querySelectorAll('.legend-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (category === 'all') {
        filteredData = [...timelineData];
    } else {
        filteredData = timelineData.filter(item => item.category === category);
    }
    
    renderTimeline();
    showNotification(`Showing ${category === 'all' ? 'all' : category} events`);
}

function searchTimeline(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredData = currentCategory === 'all' ? 
            [...timelineData] : 
            timelineData.filter(item => item.category === currentCategory);
    } else {
        const baseData = currentCategory === 'all' ? 
            timelineData : 
            timelineData.filter(item => item.category === currentCategory);
            
        filteredData = baseData.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.state.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.leaders.some(leader => leader.name.toLowerCase().includes(searchTerm)) ||
            item.movements.some(movement => movement.toLowerCase().includes(searchTerm))
        );
    }
    
    renderTimeline();
    
    if (searchTerm && filteredData.length === 0) {
        document.getElementById('timeline').innerHTML = 
            '<div class="no-results">No results found for "' + query + '". Try different keywords.</div>';
    }
}

function openImageModal(url, alt, credit) {
    const modal = document.getElementById('contentModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="image-modal">
            <img src="${url}" alt="${alt}" style="max-width: 100%; height: auto;">
            <div class="image-info">
                <h3>${alt}</h3>
                <p><strong>Source:</strong> ${credit}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showFullDetails(stateName, year) {
    const stateData = timelineData.find(item => item.state === stateName && item.year === year);
    if (!stateData) return;
    
    const modal = document.getElementById('contentModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="full-details">
            <h2>${stateData.title} (${stateData.year})</h2>
            <h3>${stateData.state}</h3>
            
            <div class="detail-grid">
                <div class="detail-card">
                    <h4>📜 Historical Context</h4>
                    <p>${stateData.description}</p>
                    <p><strong>Impact:</strong> ${stateData.impact}</p>
                </div>
                
                <div class="detail-card">
                    <h4>👥 Leadership Profile</h4>
                    ${stateData.leaders.map(leader => `
                        <div class="leader-profile">
                            <h5>${leader.name}</h5>
                            <p class="role">${leader.role}</p>
                            <p>${leader.contribution}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="detail-card">
                    <h4>🎯 Political Analysis</h4>
                    <p><strong>Key Movements:</strong></p>
                    <ul>
                        ${stateData.movements.map(movement => `<li>${movement}</li>`).join('')}
                    </ul>
                    <p><strong>Driving Factors:</strong></p>
                    <ul>
                        ${stateData.factors.map(factor => `<li><strong>${factor.type}:</strong> ${factor.description}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-card">
                    <h4>🗺️ Geographic Context</h4>
                    <p><strong>Coordinates:</strong> ${stateData.coordinates[0]}°N, ${stateData.coordinates[1]}°E</p>
                    <p><strong>Category:</strong> ${stateData.category.charAt(0).toUpperCase() + stateData.category.slice(1)} Reorganization</p>
                </div>
            </div>
            
            <div class="modal-actions">
                <button onclick="generateDetailedReport('${stateName}', ${year})" class="action-btn">
                    📊 Generate Detailed Report
                </button>
                <button onclick="shareStateInfo('${stateName}', ${year})" class="action-btn">
                    🔗 Share Information
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('contentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

async function generateDetailedReport(stateName, year) {
    const stateData = timelineData.find(item => item.state === stateName && item.year === year);
    if (!stateData) return;
    
    showNotification('Generating detailed report...');
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const reportContent = `
        <div class="detailed-report">
            <div class="report-header">
                <h2>Comprehensive Analysis Report</h2>
                <h3>${stateData.state} Formation (${stateData.year})</h3>
                <p class="report-date">Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="report-section">
                <h4>Executive Summary</h4>
                <p>The formation of ${stateData.state} in ${stateData.year} represents a significant milestone in India's federal evolution. This reorganization was driven by ${stateData.factors.map(f => f.type.toLowerCase()).join(', ')} and successfully addressed the aspirations of the local population while maintaining national unity.</p>
            </div>
            
            <div class="report-section">
                <h4>Historical Timeline</h4>
                <ul>
                    <li><strong>Pre-${stateData.year}:</strong> Growing demands for reorganization based on ${stateData.category} factors</li>
                    <li><strong>${stateData.year}:</strong> ${stateData.title} - ${stateData.description}</li>
                    <li><strong>Post-${stateData.year}:</strong> ${stateData.impact}</li>
                </ul>
            </div>
            
            <div class="report-section">
                <h4>Leadership Analysis</h4>
                ${stateData.leaders.map(leader => `
                    <div class="leader-analysis">
                        <h5>${leader.name} - ${leader.role}</h5>
                        <p>${leader.contribution}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="report-section">
                <h4>Socio-Political Factors</h4>
                ${stateData.factors.map(factor => `
                    <div class="factor-analysis">
                        <h5>${factor.type}</h5>
                        <p>${factor.description}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="report-section">
                <h4>Movement Dynamics</h4>
                <p><strong>Key Movements:</strong> ${stateData.movements.join(', ')}</p>
                <p>These movements demonstrated the democratic process of addressing regional aspirations through peaceful means, setting important precedents for federal reorganization in India.</p>
            </div>
            
            <div class="report-footer">
                <p><em>This report is generated based on historical data and AI analysis for educational purposes.</em></p>
            </div>
        </div>
    `;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = reportContent;
    
    showNotification('Detailed report generated successfully!');
}

function shareStateInfo(stateName, year) {
    const stateData = timelineData.find(item => item.state === stateName && item.year === year);
    if (!stateData) return;
    
    const shareText = `🏛️ ${stateData.title} (${stateData.year})\n\n${stateData.description}\n\nKey Leaders: ${stateData.leaders.map(l => l.name).join(', ')}\n\n#IndianStates #History #Federalism`;
    
    if (navigator.share) {
        navigator.share({
            title: `${stateData.title} - ${stateData.year}`,
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Information copied to clipboard!');
        }).catch(() => {
            showNotification('Unable to share. Please copy manually.');
        });
    }
}

// Enhanced search functionality with autocomplete
function setupAdvancedSearch() {
    const searchBox = document.querySelector('.search-box');
    const suggestions = ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Gujarat', 'Punjab', 'Haryana', 'Sikkim', 'Meghalaya', 'Mizoram', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand'];
    
    searchBox.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        
        // Remove existing suggestions
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        if (value.length > 1) {
            const matchingSuggestions = suggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(value)
            );
            
            if (matchingSuggestions.length > 0) {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'search-suggestions';
                suggestionsDiv.innerHTML = matchingSuggestions.map(suggestion => 
                    `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
                ).join('');
                
                searchBox.parentNode.appendChild(suggestionsDiv);
            }
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            const suggestions = document.querySelector('.search-suggestions');
            if (suggestions) {
                suggestions.remove();
            }
        }
    });
}

function selectSuggestion(suggestion) {
    const searchBox = document.querySelector('.search-box');
    searchBox.value = suggestion;
    searchTimeline(suggestion);
    
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

// Statistics Dashboard
function showStatistics() {
    const stats = {
        totalStates: timelineData.length,
        byCategory: {},
        byDecade: {},
        leaderCount: 0
    };
    
    timelineData.forEach(item => {
        // Count by category
        stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
        
        // Count by decade
        const decade = Math.floor(item.year / 10) * 10;
        stats.byDecade[decade] = (stats.byDecade[decade] || 0) + 1;
        
        // Count leaders
        stats.leaderCount += item.leaders.length;
    });
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="statistics-dashboard">
            <h2>📊 Timeline Statistics</h2>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>${stats.totalStates}</h3>
                    <p>Total State Formations</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.leaderCount}</h3>
                    <p>Historical Leaders</p>
                </div>
                <div class="stat-card">
                    <h3>${Object.keys(stats.byCategory).length}</h3>
                    <p>Movement Categories</p>
                </div>
                <div class="stat-card">
                    <h3>${Math.max(...Object.keys(stats.byDecade)) - Math.min(...Object.keys(stats.byDecade)) + 10}</h3>
                    <p>Years Covered</p>
                </div>
            </div>
            
            <div class="category-breakdown">
                <h3>Formation by Category</h3>
                ${Object.entries(stats.byCategory).map(([category, count]) => `
                    <div class="category-stat">
                        <span class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${(count / stats.totalStates) * 100}%"></div>
                        </div>
                        <span class="stat-count">${count}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="decade-breakdown">
                <h3>Formation by Decade</h3>
                ${Object.entries(stats.byDecade).sort().map(([decade, count]) => `
                    <div class="decade-stat">
                        <span class="decade-name">${decade}s</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${(count / stats.totalStates) * 100}%"></div>
                        </div>
                        <span class="stat-count">${count}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('contentModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Close modal with Escape
        if (e.key === 'Escape') {
            closeModal();
        }
        
        // Search with Ctrl+F
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            document.querySelector('.search-box').focus();
        }
        
        // Show statistics with Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showStatistics();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTimeline();
    setupAdvancedSearch();
    setupKeyboardShortcuts();
    
    // Set default legend state
    document.querySelector('.legend-item').classList.add('active');
    
    // Add loading animation
    const header = document.querySelector('.header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        header.style.transition = 'all 0.6s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
    
    // Add service worker for offline functionality (if needed)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
});

// Handle modal clicks outside content
document.getElementById('contentModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Smooth scrolling for timeline navigation
function scrollToYear(year) {
    const targetItem = document.querySelector(`[data-year="${year}"]`);
    if (targetItem) {
        targetItem.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Highlight the item temporarily
        targetItem.classList.add('highlight');
        setTimeout(() => {
            targetItem.classList.remove('highlight');
        }, 2000);
    }
}

// Export functionality for educational use
function exportTimelineData() {
    const dataToExport = {
        generatedOn: new Date().toISOString(),
        totalStates: timelineData.length,
        data: timelineData.map(item => ({
            year: item.year,
            state: item.state,
            title: item.title,
            category: item.category,
            description: item.description,
            leaders: item.leaders.map(l => ({ name: l.name, role: l.role })),
            movements: item.movements,
            impact: item.impact
        }))
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
        type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'indian-states-formation-timeline.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Timeline data exported successfully!');
}

// Print functionality
function printTimeline() {
    const printWindow = window.open('', '_blank');
    const timelineContent = document.getElementById('timeline').innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Indian States Formation Timeline</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .timeline-item { margin-bottom: 30px; border-left: 3px solid #007bff; padding-left: 20px; }
                .timeline-date { font-weight: bold; color: #007bff; }
                .state-name { color: #28a745; font-weight: bold; }
                .description { margin: 10px 0; }
                .details { display: block !important; }
                @media print {
                    .ai-insights, .image-gallery, .timeline-footer { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Formation Saga of Bharat States</h1>
            <div class="timeline">${timelineContent}</div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Add these functions to window for global access
window.showStatistics = showStatistics;
window.exportTimelineData = exportTimelineData;
window.printTimeline = printTimeline;
window.scrollToYear = scrollToYear;