// Package data and management
// Base package configuration with icons and prices (language-independent)
const packageConfigs = [
    {
        id: 'basic',
        icon: '<svg viewBox="0 0 100 100" style="width:60px;height:60px;filter:drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" /></linearGradient></defs><rect x="20" y="35" width="60" height="40" fill="url(#grad1)" rx="3"/><polygon points="25,35 50,15 75,35" fill="url(#grad1)"/><rect x="35" y="45" width="8" height="20" fill="white" opacity="0.7"/><rect x="57" y="45" width="8" height="20" fill="white" opacity="0.7"/></svg>',
        price: 49.99,
        period: 'one-time',
        featured: false
    },
    {
        id: 'professional',
        icon: '<svg viewBox="0 0 100 100" style="width:60px;height:60px;filter:drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))"><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" /></linearGradient></defs><rect x="20" y="25" width="15" height="50" fill="url(#grad2)" rx="2"/><rect x="42" y="20" width="15" height="55" fill="url(#grad2)" rx="2"/><rect x="64" y="30" width="15" height="45" fill="url(#grad2)" rx="2"/><circle cx="27.5" cy="80" r="4" fill="#667eea"/><circle cx="49.5" cy="80" r="4" fill="#667eea"/><circle cx="71.5" cy="80" r="4" fill="#667eea"/></svg>',
        price: 99.99,
        period: 'one-time',
        featured: false
    },
    {
        id: 'premium',
        icon: '<svg viewBox="0 0 100 100" style="width:60px;height:60px;filter:drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))"><defs><linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#764ba2;stop-opacity:1" /><stop offset="100%" style="stop-color:#667eea;stop-opacity:1" /></linearGradient></defs><path d="M 50 15 L 62 50 L 88 50 L 70 65 L 78 95 L 50 80 L 22 95 L 30 65 L 12 50 L 38 50 Z" fill="url(#grad3)"/><circle cx="50" cy="50" r="35" fill="none" stroke="url(#grad3)" stroke-width="1.5" opacity="0.5"/></svg>',
        price: 129.99,
        period: 'one-time',
        featured: true
    }
];

// Feature keys that need to be translated for each package
const packageFeatureKeys = {
    basic: ['package.quick.feature1', 'package.quick.feature2', 'package.quick.feature3', 'package.quick.feature4'],
    professional: ['package.pro.feature1', 'package.pro.feature2', 'package.pro.feature3', 'package.pro.feature4'],
    premium: ['package.premium.feature1', 'package.premium.feature2', 'package.premium.feature3', 'package.premium.feature4', 'package.premium.feature5']
};

// Get translated package data for current language
function getTranslatedPackages() {
    return packageConfigs.map(config => {
        const langKey = config.id === 'basic' ? 'quick' : config.id === 'professional' ? 'pro' : 'premium';
        const featureKeys = packageFeatureKeys[config.id];
        
        return {
            id: config.id,
            name: window.i18n ? window.i18n.t(`package.${langKey}.name`) : 'Package',
            icon: config.icon,
            description: window.i18n ? window.i18n.t(`package.${langKey}.description`) : 'Description',
            price: config.price,
            period: config.period,
            features: window.i18n ? featureKeys.map(key => window.i18n.t(key)) : [],
            featured: config.featured
        };
    });
}

let packages = getTranslatedPackages();
let selectedPackage = null;

// Render packages
function renderPackages() {
    // Refresh packages data from current language
    packages = getTranslatedPackages();
    
    const grid = document.getElementById('packagesGrid');
    const periodText = window.i18n ? (pkg) => pkg.period === 'one-time' ? window.i18n.t('package.quick.period') : 'per month' : 'One-time fee';
    
    grid.innerHTML = packages.map(pkg => `
        <div class="package-card ${pkg.featured ? 'featured' : ''}" onclick="selectPackage('${pkg.id}')">
            <div class="package-icon">${pkg.icon.startsWith('<svg') ? pkg.icon : (pkg.icon.startsWith('/') ? `<img src="${pkg.icon}" alt="${pkg.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` : pkg.icon)}</div>
            <div class="package-name">${pkg.name}</div>
            <div class="package-description">${pkg.description}</div>
            <div class="package-divider"></div>
            <div class="package-price">
                <span class="currency">€</span>${pkg.price.toFixed(2)}
            </div>
            <div class="package-period">${pkg.period === 'one-time' ? (window.i18n ? window.i18n.t('package.quick.period') : 'One-time fee') : 'per month'}</div>
            <div class="package-features">
                ${pkg.features.map(feature => `<div class="feature">${feature}</div>`).join('')}
            </div>
            <button class="package-btn" id="btn-${pkg.id}">${window.i18n ? window.i18n.t('package.selectBtn') : 'Select Package'}</button>
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
    const iconDisplay = selectedPackage.icon.startsWith('<svg') 
        ? selectedPackage.icon 
        : `<span style="font-size: 2em; display: inline-block;">${selectedPackage.icon}</span>`;
    
    packageInfoBox.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                    ${iconDisplay}
                </div>
                <div>
                    <strong style="color: #667eea; font-size: 1.1em;">Selected Package:</strong>
                    <div style="color: #333; margin-top: 5px; font-size: 1.2em; font-weight: 600;">
                        ${selectedPackage.name}
                    </div>
                    <div style="color: #666; margin-top: 5px; font-size: 0.95em;">
                        €${selectedPackage.price.toFixed(2)} (One-time fee)
                    </div>
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