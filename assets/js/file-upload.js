// File upload handling
let uploadedFiles = [];

// Setup upload area
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        });
    });

    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

// Validate and handle files
function handleFiles(files) {
    const validExtensions = ['pdf', 'dwg', 'jpg', 'jpeg', 'png', 'zip'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    const errorDiv = document.getElementById('uploadError');
    errorDiv.classList.remove('show');

    for (let file of files) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(extension)) {
            showError('Invalid file format. Accepted: PDF, DWG, JPG, PNG, ZIP');
            return;
        }

        if (file.size > maxSize) {
            showError('File size exceeds 100MB limit');
            return;
        }

        uploadedFiles.push({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2),
            file: file
        });
    }

    renderFileList();
    updateOrderSummary();
    document.getElementById('fileInput').value = '';
}

// Render file list
function renderFileList() {
    const fileList = document.getElementById('fileList');
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }

    fileList.innerHTML = '<h3 style="color: #333; margin-bottom: 15px; margin-top: 20px;">Uploaded Files:</h3>' + 
        uploadedFiles.map((file, index) => `
            <div class="file-item">
                <span class="file-name">📄 ${file.name} (${file.size}MB)</span>
                <button class="remove-btn" onclick="removeFile(${index})">Remove</button>
            </div>
        `).join('');
}

// Remove file from list
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    updateOrderSummary();
}