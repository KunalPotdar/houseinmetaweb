// Order summary calculations
function updateOrderSummary() {
    const packageName = selectedPackage ? selectedPackage.name : 'No package selected';
    const fileCount = uploadedFiles.length;
    const subtotal = selectedPackage ? selectedPackage.price : 0;
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    // Only update elements if they exist (they were removed in the simplified version)
    const elements = {
        'selectedPackageName': packageName,
        'fileCount': fileCount,
        'subtotal': `€${subtotal.toFixed(2)}`,
        'taxAmount': `€${tax.toFixed(2)}`,
        'totalAmount': `€${total.toFixed(2)}`
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}