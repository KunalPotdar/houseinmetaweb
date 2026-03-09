// Package data and management
const packages = [
    {
        id: 'basic',
        name: '3D Quick',
        icon: '/assets/images/axenometricview.png',
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
            <div class="package-icon">${pkg.icon.startsWith('/') ? `<img src="${pkg.icon}" alt="${pkg.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` : pkg.icon}</div>
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
    
    // Store selected package in localStorage for persistence
    localStorage.setItem('selectedPackage', JSON.stringify({
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.price,
        features: selectedPackage.features
    }));
    
    // Update UI
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Update order summary
    updateOrderSummary();
    
    // Show selected package info in the form
    displaySelectedPackageInfo();
}

// Display selected package information in the form section
function displaySelectedPackageInfo() {
    if (!selectedPackage) return;
    
    // Create or update package info box
    let packageInfoBox = document.getElementById('selectedPackageInfo');
    
    if (!packageInfoBox) {
        // Create the info box if it doesn't exist
        packageInfoBox = document.createElement('div');
        packageInfoBox.id = 'selectedPackageInfo';
        packageInfoBox.style.cssText = `
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 2px solid #667eea;
        `;
        
        // Insert after the upload section h2
        const uploadSection = document.querySelector('.upload-section');
        const h2 = uploadSection.querySelector('h2');
        h2.parentNode.insertBefore(packageInfoBox, h2.nextSibling);
    }
    
    // Update the content
    packageInfoBox.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
                <strong style="color: #667eea; font-size: 1.1em;">Selected Package:</strong>
                <div style="color: #333; margin-top: 5px; font-size: 1.2em; font-weight: 600;">
                    ${selectedPackage.icon} ${selectedPackage.name}
                </div>
                <div style="color: #666; margin-top: 5px; font-size: 0.95em;">
                    €${selectedPackage.price.toFixed(2)} (One-time fee)
                </div>
            </div>
            <div style="display: flex; gap: 10px; flex-direction: column;">
                <button onclick="document.getElementById('packagesGrid').scrollIntoView({behavior: 'smooth'})" 
                        style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Change Package
                </button>
                <button onclick="copyFormSummary()" 
                        style="background: #764ba2; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Share Info
                </button>
            </div>
        </div>
    `;
}

// Initialize selected package from localStorage on page load
function initializeSelectedPackage() {
    const savedPackage = localStorage.getItem('selectedPackage');
    if (savedPackage) {
        try {
            const packageData = JSON.parse(savedPackage);
            selectedPackage = packages.find(p => p.id === packageData.id);
            
            if (selectedPackage) {
                // Mark the package as selected in the UI
                document.addEventListener('DOMContentLoaded', () => {
                    const packageCards = document.querySelectorAll('.package-card');
                    const index = packages.findIndex(p => p.id === selectedPackage.id);
                    if (packageCards[index]) {
                        packageCards[index].classList.add('selected');
                        displaySelectedPackageInfo();
                    }
                });
            }
        } catch (e) {
            console.log('Could not restore package selection:', e);
        }
    }
}

// Get shareable package information
function getPackageSummary() {
    if (!selectedPackage) {
        return {
            selected: false,
            message: 'No package selected yet'
        };
    }
    
    return {
        selected: true,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packageIcon: selectedPackage.icon,
        packagePrice: selectedPackage.price,
        packageFeatures: selectedPackage.features,
        // Generate a formatted summary
        summary: `${selectedPackage.icon} ${selectedPackage.name} - €${selectedPackage.price.toFixed(2)}`
    };
}

// Generate shareable text with selected package and form information
function getFormSummary() {
    const projectName = document.getElementById('projectName')?.value || '';
    const personName = document.getElementById('personName')?.value || '';
    const projectEmail = document.getElementById('projectEmail')?.value || '';
    const packageSummary = getPackageSummary();
    
    if (!packageSummary.selected) {
        return 'Please select a package first.';
    }
    
    let summary = '📋 Floor Plan Conversion Request\n';
    summary += '=' .repeat(40) + '\n\n';
    
    if (personName) summary += `👤 Name: ${personName}\n`;
    if (projectEmail) summary += `📧 Email: ${projectEmail}\n`;
    if (projectName) summary += `🏗️ Project: ${projectName}\n`;
    
    summary += `\n📦 Selected Package:\n`;
    summary += `${packageSummary.packageIcon} ${packageSummary.packageName}\n`;
    summary += `💰 Price: €${packageSummary.packagePrice.toFixed(2)}\n`;
    
    return summary;
}

// Copy form summary to clipboard
function copyFormSummary() {
    const summary = getFormSummary();
    navigator.clipboard.writeText(summary).then(() => {
        alert('Package and form information copied to clipboard!');
    }).catch(() => {
        alert('Could not copy to clipboard. Summary:\n\n' + summary);
    });
}

// Call initialization when script loads
initializeSelectedPackage();