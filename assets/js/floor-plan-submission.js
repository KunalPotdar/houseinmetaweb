// Floor Plan Submission Handler
// Handles file uploads and form submission for 2D to 3D conversion

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
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Parse response as JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response status:', response.status);
      const text = await response.text();
      console.error('Response text:', text);
      throw new Error(`Server returned invalid JSON: ${text.substring(0, 200)}`);
    }

    // Check if response is ok
    if (!response.ok) {
      throw new Error(data.error || `Failed to submit floor plan: ${response.statusText}`);
    }

    console.log('Response data:', data);

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit floor plan');
    }

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
    showError(error.message || 'An error occurred while submitting your floor plan. Please try again. Check browser console for details.');
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
