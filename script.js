// Cyberpunk Interactive Effects

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counters when stats section is visible
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, target);
                }
            });
        }
    });
}, observerOptions);

// Observe stats section
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection.parentElement);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to vortex
    let vortex = document.querySelector('.vortex-overlay');
    if (vortex) {
        let scrollY = 0;
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            const rotation = scrollY * 0.1;
            vortex.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${1 + scrollY * 0.0001})`;
        });
    }

    // Add typing effect to terminal
    const terminalLines = document.querySelectorAll('.terminal-line .command');
    terminalLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '0';
        
        setTimeout(() => {
            line.style.opacity = '1';
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, index * 500);
    });

    // Add glow pulse to server lights on hover
    const serverLights = document.querySelectorAll('.server-lights');
    serverLights.forEach(server => {
        server.addEventListener('mouseenter', () => {
            server.style.opacity = '1';
            server.style.transition = 'opacity 0.3s ease';
        });
        server.addEventListener('mouseleave', () => {
            server.style.opacity = '0.6';
        });
    });

    // Add random glitch effect to logo
    const logo = document.querySelector('.logo');
    if (logo) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                logo.style.animation = 'none';
                setTimeout(() => {
                    logo.style.animation = 'glitch 0.3s';
                }, 10);
            }
        }, 2000);
    }

    // Mouse trail effect (optional cyberpunk enhancement)
    let mouseTrail = [];
    const maxTrailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) { // Only sometimes for performance
            const trailDot = document.createElement('div');
            trailDot.style.position = 'fixed';
            trailDot.style.left = e.clientX + 'px';
            trailDot.style.top = e.clientY + 'px';
            trailDot.style.width = '4px';
            trailDot.style.height = '4px';
            trailDot.style.background = 'rgba(0, 255, 65, 0.5)';
            trailDot.style.borderRadius = '50%';
            trailDot.style.pointerEvents = 'none';
            trailDot.style.zIndex = '1000';
            trailDot.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.8)';
            document.body.appendChild(trailDot);
            
            mouseTrail.push(trailDot);
            if (mouseTrail.length > maxTrailLength) {
                const oldDot = mouseTrail.shift();
                oldDot.style.opacity = '0';
                oldDot.style.transition = 'opacity 0.5s ease';
                setTimeout(() => oldDot.remove(), 500);
            }
            
            setTimeout(() => {
                trailDot.style.opacity = '0';
                trailDot.style.transition = 'opacity 0.5s ease';
                setTimeout(() => trailDot.remove(), 500);
            }, 300);
        }
    });

    // Add entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe post cards
    document.querySelectorAll('.post-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(card);
    });
});

// Console easter egg
console.log('%c> AI_TESTING_LABS [SYSTEM_INITIALIZED]', 'color: #00ff41; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
console.log('%cWelcome to the matrix...', 'color: #00d9ff; font-size: 12px;');
