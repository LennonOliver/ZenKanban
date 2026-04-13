export function playSakura() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const colors = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ffffff', '#ffb7b2'];
  const leafCount = 45;

  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    leaf.style.position = 'absolute';
    leaf.style.width = Math.random() * 8 + 10 + 'px';
    leaf.style.height = Math.random() * 8 + 10 + 'px';
    leaf.style.background = color;
    leaf.style.borderRadius = '0 50% 50% 50%';
    leaf.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    const startX = Math.random() * 100;
    const startY = -15;
    
    leaf.style.left = startX + 'vw';
    leaf.style.top = startY + 'vh';
    
    const duration = Math.random() * 3 + 4;
    const delay = Math.random() * 0.5;
    
    const drift = Math.random() * 100 - 50;
    const horizontalSway = Math.random() * 150 - 75; 
    const rotate = Math.random() * 720;

    leaf.animate([
      { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { transform: `translate3d(${drift}px, 50vh, 0) rotate(${rotate / 2}deg)`, offset: 0.5 },
      { transform: `translate3d(${horizontalSway}px, 120vh, 0) rotate(${rotate}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      easing: 'ease-in-out',
      fill: 'forwards'
    });

    container.appendChild(leaf);
  }

  setTimeout(() => {
    container.remove();
  }, 8000);
}
