// Cyberpunk Interactive Effects

document.addEventListener('DOMContentLoaded', () => {
    
    // Function to type text character by character
    function typeCommand(element, text, callback) {
        let index = 0;
        const typingSpeed = 50; // milliseconds per character
        
        // Add blinking cursor
        element.classList.add('blinking-cursor');
        
        function typeChar() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, typingSpeed + Math.random() * 30); // Add slight randomness for realism
            } else {
                // Remove cursor after typing completes
                element.classList.remove('blinking-cursor');
                if (callback) {
                    callback();
                }
            }
        }
        
        typeChar();
    }
    
    // Initialize terminal on page load
    const terminalBody = document.getElementById('terminal-body');
    
    if (terminalBody) {
        // Initial terminal startup sequence
        setTimeout(() => {
            // Add command line
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            commandLine.innerHTML = '<span class="prompt">></span><span class="command"></span>';
            terminalBody.appendChild(commandLine);
            
            const commandElement = commandLine.querySelector('.command');
            
            // Type the command character by character
            typeCommand(commandElement, 'initialize_ai_testing_protocol', () => {
                // Add first output after typing completes
                setTimeout(() => {
                    const output1 = document.createElement('div');
                    output1.className = 'terminal-line';
                    output1.innerHTML = '<span class="output">[OK] Neural networks activated</span>';
                    terminalBody.appendChild(output1);
                    
                    // Add second output
                    setTimeout(() => {
                        const output2 = document.createElement('div');
                        output2.className = 'terminal-line';
                        output2.innerHTML = '<span class="output">[OK] Test frameworks loaded</span>';
                        terminalBody.appendChild(output2);
                        
                        // Add final output
                        setTimeout(() => {
                            const output3 = document.createElement('div');
                            output3.className = 'terminal-line';
                            output3.innerHTML = '<span class="output blinking-cursor">[READY] System operational</span>';
                            terminalBody.appendChild(output3);
                        }, 400);
                    }, 400);
                }, 300);
            });
        }, 500);
    }

    // About button functionality
    const aboutBtn = document.getElementById('about-btn');
    let aboutClicked = false;
    
    if (aboutBtn && terminalBody) {
        aboutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Prevent multiple clicks
            if (aboutClicked) return;
            aboutClicked = true;
            
            // Scroll to terminal
            const terminal = document.querySelector('.terminal-window');
            if (terminal) {
                terminal.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Clear terminal and add about command after a delay
            setTimeout(() => {
                // Clear terminal content
                terminalBody.innerHTML = '';
                
                // Add command line
                const commandLine = document.createElement('div');
                commandLine.className = 'terminal-line';
                commandLine.innerHTML = '<span class="prompt">></span><span class="command"></span>';
                terminalBody.appendChild(commandLine);
                
                const commandElement = commandLine.querySelector('.command');
                
                // Type the command character by character
                typeCommand(commandElement, 'cat about.txt', () => {
                    // Add about text output after typing completes
                    setTimeout(() => {
                        const aboutLine = document.createElement('div');
                        aboutLine.className = 'terminal-line';
                        aboutLine.style.whiteSpace = 'pre-wrap';
                        aboutLine.innerHTML = '<span class="output">A personal blog on AI in offensive security. I post about building/using AI tools, testing AI/LLM/ML applications, and sharing relevant news and education.</span>';
                        terminalBody.appendChild(aboutLine);
                        
                        // Add new prompt line
                        setTimeout(() => {
                            const readyLine = document.createElement('div');
                            readyLine.className = 'terminal-line';
                            readyLine.innerHTML = '<span class="prompt">></span><span class="command blinking-cursor"></span>';
                            terminalBody.appendChild(readyLine);
                            
                            // Scroll terminal into view
                            readyLine.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            
                            // Reset flag after animation complete (allow clicking again after a delay)
                            setTimeout(() => {
                                aboutClicked = false;
                            }, 3000);
                        }, 1000);
                    }, 300);
                });
            }, 600);
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]:not(#about-btn)').forEach(anchor => {
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
