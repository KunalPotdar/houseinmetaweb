// Form validation and order processing
function submitOrder() {
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const termsCheckbox = document.getElementById('termsCheckbox');
    const dataProcessingCheckbox = document.getElementById('dataProcessingCheckbox');

    // Clear previous errors
    clearFormErrors();

    // Validation
    let isValid = true;

    if (uploadedFiles.length === 0) {
        showError('Please upload at least one file');
        return;
    }

    if (!selectedPackage) {
        showError('Please select a package');
        return;
    }

    // Only validate form fields if they exist
    if (firstName && !firstName) {
        showFieldError('firstNameError', 'Please enter your first name');
        isValid = false;
    }

    if (lastName && !lastName) {
        showFieldError('lastNameError', 'Please enter your last name');
        isValid = false;
    }

    if (email && !email) {
        showFieldError('emailError', 'Please enter your email address');
        isValid = false;
    } else if (email && !isValidEmail(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Only validate checkboxes if they exist (removed in new version)
    if (termsCheckbox && !termsCheckbox.checked) {
        showFieldError('termsError', 'You must agree to Terms of Service and Privacy Policy');
        isValid = false;
    }

    if (dataProcessingCheckbox && !dataProcessingCheckbox.checked) {
        showFieldError('dataProcessingError', 'You must consent to data processing for order fulfillment');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading if element exists
    const loading = document.getElementById('loading');
    const submitBtn = document.getElementById('submitBtn');
    if (loading) loading.style.display = 'block';
    if (submitBtn) submitBtn.disabled = true;

    // Process payment
    setTimeout(() => {
        processPayment();
    }, 2000);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '❌ ' + message;
        errorElement.classList.add('show');
    }
}

// Clear all form errors
function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
}

// Show general error
function showError(message) {
    const errorDiv = document.getElementById('uploadError');
    errorDiv.textContent = '❌ ' + message;
    errorDiv.classList.add('show');
}

// Reset form
function resetForm() {
    uploadedFiles = [];
    selectedPackage = null;
    
    // Reset file input if it exists
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    
    // Reset checkboxes if they exist
    const termsCheckbox = document.getElementById('termsCheckbox');
    const marketingCheckbox = document.getElementById('marketingCheckbox');
    const dataProcessingCheckbox = document.getElementById('dataProcessingCheckbox');
    if (termsCheckbox) termsCheckbox.checked = false;
    if (marketingCheckbox) marketingCheckbox.checked = false;
    if (dataProcessingCheckbox) dataProcessingCheckbox.checked = false;
    
    // Reset text fields if they exist
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    if (firstName) firstName.value = '';
    if (lastName) lastName.value = '';
    if (email) email.value = '';
    if (phone) phone.value = '';
    
    // Remove selected state from package cards
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    renderFileList();
    updateOrderSummary();
    
    const uploadError = document.getElementById('uploadError');
    if (uploadError) uploadError.classList.remove('show');
    clearFormErrors();
}