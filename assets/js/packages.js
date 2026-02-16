// Package data and management
const packages = [
    {
        id: 'basic',
        name: '3D Quick',
        icon: '🏠',
        description: 'Get your floor plan converted to 3D in no time',
        price: 39.99,
        period: 'one-time',
        features: [
            'High Quality Axonometric 3D View image',
            'Single floor conversion',
            'Two Interior 3D Rendered images',
            '5-day delivery',
        ],
        featured: false
    },
    {
        id: 'professional',
        name: '3D Pro',
        icon: '🏢',
        description: 'Get a detailed understanding of your space with 3D Pro',
        price: 69.99,
        period: 'one-time',
        features: [
            'In addition to 3D Quick features:',
            'High-quality Interior Rendered images',
            'High quality 360° images for immersive experience',
            'Two Revisions based on client feedback',
            'Advanced navigation & interactivity',
            
        ],
        featured: true
    },
    {
        id: 'premium',
        name: '3D Premium',
        icon: '👑',
        description: 'Walk through your space like never before with 3D Premium',
        price: 99.99,
        period: 'one-time',
        features: [
            'In addition to 3D Pro features:',
            'A fully interactive 3D model with advanced navigation',
            '3D files for use in VR/AR applications',
            'Priority support and faster delivery',
        ],
        featured: false
    }
];

let selectedPackage = null;

// Render packages
function renderPackages() {
    const grid = document.getElementById('packagesGrid');
    grid.innerHTML = packages.map(pkg => `
        <div class="package-card ${pkg.featured ? 'featured' : ''}" onclick="selectPackage('${pkg.id}')">
            <span class="package-icon">${pkg.icon}</span>
            <div class="package-name">${pkg.name}</div>
            <div class="package-description">${pkg.description}</div>
            <div class="package-divider"></div>
            <div class="package-price">
                <span class="currency">€</span>${pkg.price.toFixed(2)}
            </div>
            <div class="package-period">${pkg.period === 'one-time' ? 'One-time fee' : 'per month'}</div>
            <div class="package-features">
                ${pkg.features.map(feature => `<div class="feature">${feature}</div>`).join('')}
            </div>
            <button class="package-btn" id="btn-${pkg.id}">Select Package</button>
        </div>
    `).join('');
}

// Select package
function selectPackage(packageId) {
    selectedPackage = packages.find(p => p.id === packageId);
    
    // Update UI
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    updateOrderSummary();
}