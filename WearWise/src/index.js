// index.js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add mouse trail effects and enhanced animations
document.addEventListener('DOMContentLoaded', () => {
  // Add subtle parallax effect to background
  document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    const bgElements = document.querySelectorAll('.fixed > div');
    bgElements.forEach((element, index) => {
      const depth = (index + 1) * 0.5;
      element.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
    });
  });
  
  // Create mouse trail effect
  const createMouseTrail = () => {
    let trailElements = [];
    const trailLength = 15;
    const fadeRate = 0.05;
    
    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
      const trailElement = document.createElement('div');
      trailElement.className = 'mouse-trail';
      trailElement.style.opacity = 1 - (i * fadeRate);
      trailElement.style.transform = 'scale(' + (1 - (i * 0.05)) + ')';
      document.body.appendChild(trailElement);
      trailElements.push({
        element: trailElement,
        x: 0,
        y: 0
      });
    }
    
    // Update trail positions
    document.addEventListener('mousemove', (e) => {
      // Update first element position
      trailElements[0].x = e.clientX;
      trailElements[0].y = e.clientY;
      
      // Update remaining elements
      for (let i = 1; i < trailLength; i++) {
        const current = trailElements[i];
        const previous = trailElements[i - 1];
        
        // Calculate ease towards previous element
        current.x += (previous.x - current.x) * 0.3;
        current.y += (previous.y - current.y) * 0.3;
      }
      
      // Set CSS positions
      trailElements.forEach((item) => {
        item.element.style.left = (item.x - 3) + 'px';
        item.element.style.top = (item.y - 3) + 'px';
      });
    });
  };
  
  // Only create mouse trail on devices with pointer support (not mobile)
  if (window.matchMedia("(pointer: fine)").matches) {
    createMouseTrail();
  }
  
  // Add hover effects to all glassmorphism elements
  const glassElements = document.querySelectorAll('.glass');
  glassElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'translateY(-3px)';
      element.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translateY(0)';
      element.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.05)';
    });
  });
  
  // Add click ripple effect to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'absolute inset-0 bg-white bg-opacity-30 rounded-lg';
      ripple.style.transform = `scale(0)`;
      ripple.style.transformOrigin = `${x}px ${y}px`;
      ripple.style.animation = 'ripple 0.6s linear';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.innerHTML = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  button {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);