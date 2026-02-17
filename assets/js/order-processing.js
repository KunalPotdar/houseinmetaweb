// Order processing and payment handling
function processPayment() {
    // Check if payment method selector exists (may be removed)
    const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'card';
    
    const totalAmountEl = document.getElementById('totalAmount');
    const total = totalAmountEl ? parseFloat(totalAmountEl.textContent.replace('€', '')) : 0;

    // Collect user data - safely handle missing elements
    const firstName = document.getElementById('firstName')?.value.trim() || '';
    const lastName = document.getElementById('lastName')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const marketingCheckbox = document.getElementById('marketingCheckbox');
    const marketingConsent = marketingCheckbox ? marketingCheckbox.checked : false;

    // Prepare order data
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString(),
        user: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone || 'Not provided'
        },
        gdpr: {
            termsAgreed: true,
            dataProcessingConsent: true,
            marketingConsent: marketingConsent,
            consentTimestamp: new Date().toISOString()
        },
        package: selectedPackage ? selectedPackage.name : 'N/A',
        price: selectedPackage ? selectedPackage.price : 0,
        tax: selectedPackage ? selectedPackage.price * 0.10 : 0,
        total: total,
        filesCount: uploadedFiles.length,
        paymentMethod: paymentMethod,
        files: uploadedFiles.map(f => ({
            name: f.name,
            size: f.size
        }))
    };

    // Process payment based on method
    if (paymentMethod === 'card') {
        processStripePayment(orderData);
    } else if (paymentMethod === 'bank_transfer') {
        processBankTransfer(orderData);
    }
}

// Process bank transfer
function processBankTransfer(orderData) {
    // Save order to backend for manual processing
    sendOrderToBackend(orderData, 'bank_transfer');
}

// Handle payment success
async function handlePaymentSuccess(orderData) {
    // Show success message
    document.getElementById('loading').style.display = 'none';
    document.getElementById('successMessage').classList.add('show');

    // Save order to backend and send email notification
    await sendOrderToBackend(orderData, 'stripe');

    // Show confirmation after 2 seconds
    setTimeout(() => {
        alert(`✓ Payment of €${orderData.total.toFixed(2)} processed successfully!\n\nOrder ID: ${orderData.orderId}\n\nA confirmation email has been sent to ${orderData.user.email}\n\nYour 3D conversion will begin shortly!`);
        resetForm();
        document.getElementById('successMessage').classList.remove('show');
        document.getElementById('submitBtn').disabled = false;
    }, 1500);
}

// Send order to backend
function sendOrderToBackend(orderData, paymentProcessor) {
    const orderPayload = {
        ...orderData,
        paymentProcessor: paymentProcessor,
        sendEmail: true,
        emailTemplate: 'order_confirmation'
    };

    // Use Lambda fetch format
    return fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order saved and email sent:', data);
        
        // Also send email via dedicated endpoint
        return sendOrderConfirmationEmail(orderData);
    })
    .catch(error => {
        console.error('Error saving order:', error);
    });
}

// Send confirmation email with order details
function sendOrderConfirmationEmail(orderData) {
    const emailPayload = {
        to: orderData.user.email,
        customerName: `${orderData.user.firstName} ${orderData.user.lastName}`,
        orderId: orderData.orderId,
        packageName: orderData.package,
        price: orderData.price,
        tax: orderData.tax,
        total: orderData.total,
        filesCount: orderData.filesCount,
        files: orderData.files,
        timestamp: orderData.timestamp,
        phone: orderData.user.phone,
        paymentMethod: orderData.paymentMethod
    };

    // Use Lambda fetch format
    return fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendEmail}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Confirmation email sent:', data);
        return data;
    })
    .catch(error => {
        console.error('Error sending confirmation email:', error);
        // Don't throw error - order was saved even if email fails
        return null;
    });
}