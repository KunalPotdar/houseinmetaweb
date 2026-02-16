// Stripe Configuration and Initialization
const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLIC_KEY'; // Replace with your Stripe public key
const stripe = Stripe(STRIPE_PUBLIC_KEY);
const elements = stripe.elements();
const cardElement = elements.create('card');

// Initialize Stripe on page load
function initializeStripe() {
    const cardElementContainer = document.getElementById('card-element');
    if (cardElementContainer && STRIPE_PUBLIC_KEY !== 'pk_test_YOUR_STRIPE_PUBLIC_KEY') {
        cardElement.mount('#card-element');
        cardElement.addEventListener('change', handleCardChange);
    }
}

// Handle card input changes
function handleCardChange(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
        displayError.classList.add('show');
    } else {
        displayError.textContent = '';
        displayError.classList.remove('show');
    }
}

// Process Stripe payment
async function processStripePayment(orderData) {
    const cardErrors = document.getElementById('card-errors');

    // Create payment method with Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: `${orderData.user.firstName} ${orderData.user.lastName}`,
            email: orderData.user.email,
            phone: orderData.user.phone
        }
    });

    if (error) {
        cardErrors.textContent = error.message;
        cardErrors.classList.add('show');
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submitBtn').disabled = false;
        return;
    }

    // Send to your backend to create Payment Intent
    try {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(orderData.total * 100), // Amount in cents
                currency: 'eur',
                paymentMethodId: paymentMethod.id,
                orderData: orderData
            })
        });

        const { clientSecret, status } = await response.json();

        if (status === 'succeeded') {
            // Payment succeeded
            handlePaymentSuccess(orderData);
        } else if (status === 'requires_action') {
            // Payment requires additional action (3D Secure, etc.)
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret);
            
            if (confirmError) {
                cardErrors.textContent = confirmError.message;
                cardErrors.classList.add('show');
                document.getElementById('loading').style.display = 'none';
                document.getElementById('submitBtn').disabled = false;
            } else if (paymentIntent.status === 'succeeded') {
                handlePaymentSuccess(orderData);
            }
        } else {
            throw new Error('Payment processing failed');
        }
    } catch (error) {
        console.error('Payment error:', error);
        cardErrors.textContent = 'Payment processing failed. Please try again.';
        cardErrors.classList.add('show');
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submitBtn').disabled = false;
    }
}