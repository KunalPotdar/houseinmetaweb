// Floor Plan Submission Handler
// Handles file uploads and form submission for 2D to 3D conversion

// Diagnostic function to check API connectivity
async function diagnoseAPI() {
  console.log('=== API Connectivity Diagnostic ===');
  console.log('API Base URL:', API_CONFIG.baseURL);
  console.log('Endpoint:', API_CONFIG.endpoints.submit);
  
  try {
    const healthUrl = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.health}`;
    console.log('Testing health endpoint:', healthUrl);
    
    const response = await fetch(healthUrl, { method: 'GET' });
    console.log('Health check response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API is reachable:', data);
      return true;
    } else {
      console.warn('API returned error status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('API connectivity error:', error.message);
    return false;
  }
}

// Call diagnostic on page load
window.addEventListener('load', () => {
  console.log('Floor Plan Submission module loaded');
  // Uncomment to auto-run diagnostics: diagnoseAPI();
});

async function generateAndSend() {
  try {
    // Get form values
    const projectName = document.getElementById('projectName').value.trim();
    const personName = document.getElementById('personName').value.trim();
    const projectEmail = document.getElementById('projectEmail').value.trim();
    const fileList = document.getElementById('fileList');
    const generateBtn = document.getElementById('generateBtn');
    const uploadLoading = document.getElementById('uploadLoading');
    const uploadError = document.getElementById('uploadError');

    // Clear previous errors
    uploadError.classList.remove('show');
    uploadError.textContent = '';

    // Validate form fields
    if (!projectName) {
      showError('Please enter a project name');
      return;
    }

    if (!personName) {
      showError('Please enter your name');
      return;
    }

    if (!projectEmail) {
      showError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(projectEmail)) {
      showError('Please enter a valid email address');
      return;
    }

    // Get uploaded files from the uploadedFiles array (not from file input, as it gets cleared)
    if (!uploadedFiles || uploadedFiles.length === 0) {
      showError('Please upload at least one floor plan file');
      return;
    }

    // Show loading state
    generateBtn.disabled = true;
    uploadLoading.style.display = 'flex';

    // Prepare FormData for multipart file upload
      // Only support single file for backend compatibility
      if (uploadedFiles.length !== 1) {
        showError('Please upload exactly one PDF file.');
        return;
      }
      const file = uploadedFiles[0].file;
      if (file.type !== 'application/pdf') {
        showError('Only PDF files are supported.');
        return;
      }
      
      // Read file as base64
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const pdfBase64 = await toBase64(file);

      // Prepare JSON body for Lambda backend
      const payload = {
        projectName,
        name: personName,
        email: projectEmail,
        pdfBase64
      };

      // Send to Lambda backend using API_CONFIG
      const apiUrl = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.submit}`;
      console.log('Submitting to API endpoint:', apiUrl);
      console.log('Payload keys:', Object.keys(payload));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 30000 // 30 second timeout for file processing
      });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response headers:', response.headers);

    // Lambda function returns wrapped response with statusCode property
    let data;
    let parsedBody;
    
    try {
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 500));
      
      // Try to parse as JSON
      data = JSON.parse(responseText);
      
      // Handle Lambda response format { statusCode: 200, body: "..." }
      if (data.statusCode && data.body) {
        try {
          parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
        } catch (e) {
          parsedBody = { message: data.body };
        }
      }
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response status:', response.status);
      throw new Error(`Server returned invalid JSON (${response.status}): Unable to parse response`);
    }

    // Check HTTP status
    if (!response.ok) {
      // Check if we have Lambda error details
      const lambdaStatus = data.statusCode || response.status;
      const errorMsg = parsedBody?.error || parsedBody?.message || response.statusText || 'Unknown error';
      
      const fullError = `API Error (${lambdaStatus}): ${errorMsg}\n\nPlease verify:\n• Internet connection is stable\n• API endpoint is correctly configured\n• Lambda function is deployed and running`;
      
      console.error('API Response:', { lambdaStatus, errorMsg, data });
      throw new Error(fullError);
    }

    // Verify success from Lambda response
    console.log('Response data:', data);
    
    const successMsg = parsedBody?.message || data.message || 'Floor plan submitted successfully';
    if (data.statusCode === 200 || response.ok) {
      showSuccess(successMsg + '! Check your email for confirmation.');
      clearForm();
      uploadLoading.style.display = 'none';
      generateBtn.disabled = false;
      return;
    }
    
    throw new Error(successMsg);

    // Success - show confirmation message
    showSuccess(data.message || 'Floor plan submitted successfully! Check your email for confirmation.');
    
    // Clear form
    clearForm();

    // Hide loading
    uploadLoading.style.display = 'none';
    generateBtn.disabled = false;

  } catch (error) {
    console.error('Submission error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    let userMessage = error.message || 'An error occurred while submitting your floor plan.';
    
    // Provide specific guidance based on error type
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userMessage = 'Network error: Unable to reach the API.\n\n• Check your internet connection\n• Verify the API endpoint is accessible\n• Try again in a moment';
    } else if (error.message.includes('API Error (5')) {
      userMessage = 'Server error: The backend service encountered an issue.\n\n• This may be a temporary issue\n• Please try again in a few moments\n• If the problem persists, contact support';
    } else if (error.message.includes('API Error (400')) {
      userMessage = 'Validation error: Please ensure all fields are correctly filled:\n\n• Project name is not empty\n• A valid email address\n• A PDF file is uploaded\n• Check browser console for details';
    } else if (error.message.includes('invalid JSON')) {
      userMessage = 'Server communication error: Invalid response format.\n\nPlease:\n• Verify the API endpoint configuration\n• Check that the Lambda function is deployed\n• Contact support if the problem persists';
    }
    
    showError(userMessage);
    document.getElementById('uploadLoading').style.display = 'none';
    document.getElementById('generateBtn').disabled = false;
  }
}

function showError(message) {
  const uploadError = document.getElementById('uploadError');
  uploadError.textContent = message;
  uploadError.classList.add('show');
  uploadError.style.color = '#ff6b6b';
  uploadError.style.marginTop = '15px';
  uploadError.style.padding = '12px';
  uploadError.style.background = '#fff5f5';
  uploadError.style.borderRadius = '6px';
  uploadError.style.border = '1px solid #ffdddd';
}

function showSuccess(message) {
  const uploadError = document.getElementById('uploadError');
  uploadError.textContent = message;
  uploadError.classList.add('show');
  uploadError.style.color = '#155724';
  uploadError.style.marginTop = '15px';
  uploadError.style.padding = '12px';
  uploadError.style.background = '#d4edda';
  uploadError.style.borderRadius = '6px';
  uploadError.style.border = '1px solid #c3e6cb';
}

function clearForm() {
  document.getElementById('projectName').value = '';
  document.getElementById('personName').value = '';
  document.getElementById('projectEmail').value = '';
  document.getElementById('fileInput').value = '';
  document.getElementById('fileList').innerHTML = '';
}

function resetForm() {
  clearForm();
  const uploadError = document.getElementById('uploadError');
  uploadError.classList.remove('show');
  uploadError.textContent = '';
}

// Add event listeners when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Optional: Add validation on input fields
  const projectEmail = document.getElementById('projectEmail');
  if (projectEmail) {
    projectEmail.addEventListener('blur', function() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.style.borderColor = '#ff6b6b';
      } else {
        this.style.borderColor = '#e0e0e0';
      }
    });

    projectEmail.addEventListener('focus', function() {
      this.style.borderColor = '#667eea';
    });
  }
});
