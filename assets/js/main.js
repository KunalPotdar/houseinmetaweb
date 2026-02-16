// Minimal JS for navigation toggle and theme helper
document.addEventListener('DOMContentLoaded',()=>{
  const btn = document.getElementById('navToggle');
  if(btn){
    btn.addEventListener('click',()=>{
      const nav = document.querySelector('nav');
      if(nav.style.display==='block'){nav.style.display=''}else{nav.style.display='block'}
    })
  }
});

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeStripe();
    renderPackages();
    setupUploadArea();
    updateOrderSummary();
});
