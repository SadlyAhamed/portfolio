/* ==========================================================================
   Sheikh Sadly Ahamed - Portfolio Dynamic JavaScript Engine
   Interactive Particles, Typing Effect, Terminal Tabs, Skills Filter & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasParticles();
    initTypingEffect();
    initCodeTabs();
    initSkillFilters();
    initNavbarScroll();
    initScrollSpy();
    initStatCounters();
    initBackToTop();
    initMobileNav();
    initCVDownload();
});

/* ==========================================================================
   1. Interactive Tech Canvas Particles
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);

    for (let i = 0; i < particleCount; i++) {
        const vx = (Math.random() - 0.5) * 0.45;
        const vy = (Math.random() - 0.5) * 0.45;
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: vx,
            vy: vy,
            baseVx: vx,
            baseVy: vy,
            size: Math.random() * 1.8 + 0.8,
            alpha: Math.random() * 0.5 + 0.2,
            baseAlpha: Math.random() * 0.5 + 0.2
        });
    }

    // Explosion sparks array & shockwave rings
    const sparks = [];
    const shockwaves = [];

    // Trigger explosive blast on cursor click
    function triggerBlast(x, y) {
        const blastRadius = 260;
        const blastPower = 18;

        // 1. Push ambient particles away violently
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = p.x - x;
            const dy = p.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            if (dist < blastRadius) {
                const force = ((blastRadius - dist) / blastRadius) * blastPower;
                const angle = Math.atan2(dy, dx);
                p.vx += Math.cos(angle) * force;
                p.vy += Math.sin(angle) * force;
                p.alpha = 1;
            }
        }

        // 2. Spawn radiant explosion shards
        const sparkCount = 30;
        const colors = [
            'rgba(6, 182, 212, ',   // Neon Cyan
            'rgba(16, 185, 129, ',  // Emerald
            'rgba(249, 115, 22, ',  // Cyber Orange
            'rgba(255, 255, 255, '  // Core White
        ];

        for (let i = 0; i < sparkCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 9 + 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            sparks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.6 + 1.2,
                color: color,
                alpha: 1,
                decay: Math.random() * 0.024 + 0.016
            });
        }

        // 3. Shockwave expansion ring
        shockwaves.push({
            x: x,
            y: y,
            radius: 4,
            maxRadius: 180,
            alpha: 0.85
        });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    const mouseRadius = 140;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    window.addEventListener('click', (e) => {
        triggerBlast(e.clientX, e.clientY);
    });

    function render() {
        ctx.clearRect(0, 0, width, height);

        // 1. Render & Update Expanding Shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 2;
            sw.alpha *= 0.92;

            if (sw.alpha < 0.02 || sw.radius >= sw.maxRadius) {
                shockwaves.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(6, 182, 212, ${sw.alpha * 0.7})`;
            ctx.lineWidth = 2.2;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
        }

        // 2. Render & Update Blast Sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vx *= 0.94;
            s.vy *= 0.94;
            s.alpha -= s.decay;

            if (s.alpha <= 0) {
                sparks.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `${s.color}${s.alpha})`;
            ctx.fill();
        }

        // 3. Render & Update Ambient Particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Cursor hover repulsion / interactive displacement
            const mdx = p.x - mouseX;
            const mdy = p.y - mouseY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < mouseRadius && mDist > 0) {
                const repulseForce = (1 - mDist / mouseRadius) * 3.5;
                const angle = Math.atan2(mdy, mdx);
                p.vx += Math.cos(angle) * repulseForce * 0.35;
                p.vy += Math.sin(angle) * repulseForce * 0.35;
                p.alpha = Math.min(1, p.alpha + 0.3);

                // Laser connection from cursor to nearby particle
                ctx.beginPath();
                ctx.moveTo(mouseX, mouseY);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 * (1 - mDist / mouseRadius)})`;
                ctx.lineWidth = 0.75;
                ctx.stroke();
            }

            p.x += p.vx;
            p.y += p.vy;

            // Decelerate back to calm cruising drift
            p.vx = p.vx * 0.94 + p.baseVx * 0.06;
            p.vy = p.vy * 0.94 + p.baseVy * 0.06;
            p.alpha = p.alpha * 0.97 + p.baseAlpha * 0.03;

            // Boundary wrap
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;


            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 130) * Math.min(p.alpha, p2.alpha)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(render);
    }

    render();
}


/* ==========================================================================
   2. Hero Typing Effect
   ========================================================================== */
function initTypingEffect() {
    const target = document.getElementById('typing-role');
    if (!target) return;

    const phrases = [
        "Scalable Java 21 & Spring Boot Microservices",
        "Cross-Platform Flutter & Native Android Security Apps",
        "Sub-50ms Elasticsearch Search Engines",
        "Agentic AI & RAG Enterprise Pipelines",
        "Event-Driven Architectures with Kafka & RabbitMQ",
        "Cloud-Native & High-Availability Banking Systems"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 75;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            target.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 35;
        } else {
            target.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typingDelay = 2000; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingDelay = 400; // Pause before typing new text
        }

        setTimeout(type, typingDelay);
    }

    type();
}

/* ==========================================================================
   3. Code Showcase Terminal Tabs
   ========================================================================== */
function initCodeTabs() {
    const tabButtons = document.querySelectorAll('.t-tab');
    const panels = document.querySelectorAll('.code-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = `tab-${btn.getAttribute('data-tab')}`;
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   4. Technical Skills Filtering
   ========================================================================== */
function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   5. Navbar Scroll & Background Blurring
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   6. ScrollSpy for Active Navigation Link
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   7. Stat Counters Animation
   ========================================================================== */
function initStatCounters() {
    const statCards = document.querySelectorAll('.stat-number');
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                statCards.forEach(card => {
                    const target = parseFloat(card.getAttribute('data-target'));
                    const suffix = card.getAttribute('data-suffix') || '';
                    const isDecimal = target % 1 !== 0;
                    let current = 0;
                    const step = target / 35;

                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            card.textContent = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
                            clearInterval(interval);
                        } else {
                            card.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
                        }
                    }, 30);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsRow = document.querySelector('.hero-stats-row');
    if (statsRow) observer.observe(statsRow);
}

/* ==========================================================================
   8. Back to Top Button
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================================================
   9. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('mobile-open');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('mobile-open');
        });
    });
}

/* ==========================================================================
   10. Toast Notification & Copy to Clipboard
   ========================================================================== */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-cyan"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.9)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(message || 'Copied to clipboard!');
    }).catch(() => {
        showToast('Copied: ' + text);
    });
}

/* ==========================================================================
   11. Interactive Project Deep Dive Modal
   ========================================================================== */
const projectData = {
    rlts: {
        title: "RLTS - Retail Loan Management System",
        client: "Dhaka Bank Limited",
        type: "Enterprise Banking & Loan Processing",
        tech: ["Java 21", "Spring Boot 3+", "Elasticsearch", "RabbitMQ", "Angular", "Oracle DB", "Docker", "TDD"],
        description: "Retail Loan Management System (RLTS) is a mission-critical enterprise banking platform engineered for Dhaka Bank to automate end-to-end retail loan origination, risk calculation, verification, and multi-level disbursement workflows.",
        architecture: [
            "<strong>Java 21 & Spring Boot 3 Core:</strong> Built microservice endpoints utilizing modern Java virtual threads and Spring Data JPA with Oracle Database connection pooling.",
            "<strong>Sub-Second Search Engine:</strong> Managed dedicated Elasticsearch clusters to index applicant profiles, financial statements, and credit histories, slashing search latency from seconds to <50ms.",
            "<strong>Decoupled Asynchronous Messaging:</strong> Integrated RabbitMQ exchanges and queues to reliably stream multi-tier loan approval events without blocking HTTP request threads.",
            "<strong>ACID Banking Security:</strong> Enforced rigorous Spring Security JWT authorization with role-based branch access and transactional rollback guarantees."
        ],
        metrics: [
            "Zero transactional data loss across all loan processing stages",
            "High concurrency supporting simultaneous multi-branch approvals",
            "TDD test suite with 90%+ code coverage on financial calculation services"
        ]
    },
    fms: {
        title: "FMS - Financial Management System",
        client: "Ansar VDP",
        type: "Organizational Budgeting & Fund Streaming",
        tech: ["Java", "Spring Boot", "Apache Kafka", "PostgreSQL", "Docker", "Jenkins", "Angular", "Linux"],
        description: "A comprehensive institutional financial management and allocation platform for Ansar VDP to monitor nationwide budgetary disbursements, tracking ledger accounts in real-time.",
        architecture: [
            "<strong>Real-Time Event Streaming:</strong> Implemented Apache Kafka topics and partitions to ingest high-volume financial transaction logs across nationwide department units.",
            "<strong>PostgreSQL Query Optimization:</strong> Structured complex relational database schemas with custom index tuning to generate fiscal reports across years of operational data.",
            "<strong>CI/CD & Containerized Delivery:</strong> Formulated automated Jenkins CI/CD pipelines deploying Docker containers to production servers with zero downtime.",
            "<strong>Clean Architecture & Angular Frontend:</strong> Separated business domains cleanly into modular backend components integrated seamlessly with Angular dashboard views."
        ],
        metrics: [
            "Real-time event streaming across multi-departmental funds",
            "Automated continuous integration reducing deployment time by 60%",
            "Enterprise-grade audit trails for every budgetary movement"
        ]
    },
    erp: {
        title: "Enterprise ERP & AI Evaluation Engine",
        client: "Enterprise Systems Innovation",
        type: "ERP Microservices & Agentic AI Orchestration",
        tech: ["Java 21", "Spring Boot 3", "LLM APIs", "ELK Stack (Elasticsearch, Logstash, Kibana)", "Prompt Engineering", "RAG"],
        description: "An advanced dual-purpose enterprise solution providing robust ERP financial transaction modules coupled with an autonomous AI evaluation engine that validates, scores, and audits technical data using LLMs.",
        architecture: [
            "<strong>Agentic AI & RAG Pipeline:</strong> Integrated LLM APIs with vector embeddings and custom prompt engineering to autonomously analyze, grade, and summarize technical documentation.",
            "<strong>Function & Tool Calling:</strong> Configured AI agents with tool-calling capabilities to query internal ERP databases before formulating analytical responses.",
            "<strong>Full Observability via ELK Stack:</strong> Deployed Elasticsearch, Logstash pipelines, and Kibana visualizations to monitor distributed transaction traces and AI execution latency.",
            "<strong>Fault-Tolerant Microservices:</strong> Implemented circuit breakers and retry policies to ensure uninterrupted ERP uptime during downstream API spikes."
        ],
        metrics: [
            "Automated 80%+ of repetitive technical verification tasks",
            "Comprehensive ELK real-time log analytics dashboard",
            "Microservices architecture with resilient fallback mechanisms"
        ]
    },
    secureeye: {
        title: "SecureEye - Anti-Theft & Location Security System",
        client: "Commercial Mobile Security Application",
        type: "Flutter (Dart) & Native Android (Kotlin) Engineering",
        tech: ["Flutter", "Dart", "Kotlin", "DeviceAdminReceiver", "CameraX API", "MBTiles", "Sqflite", "Local HTTP Tile Server", "Firebase Auth", "Cloud Firestore", "Google Drive API", "Firebase Analytics"],
        description: "SecureEye is an advanced anti-theft and offline location security application engineered using Flutter (Dart) and native Kotlin. The app protects mobile devices from unauthorized intrusion via hardware-level Android security receivers and provides offline spatial geofencing alarms.",
        architecture: [
            "<strong>Android DeviceAdminReceiver & Silent Capture:</strong> Integrated native Kotlin security receiver listening for failed lock-screen PIN/pattern entries. Upon wrong input, it silently captures an intruder selfie using the front camera via CameraX.",
            "<strong>Zero-Cost Direct Cloud Synchronization:</strong> Automatically emails the intruder snapshot and uploads it directly to the user's personal Google Drive via Google Drive REST API, ensuring zero server storage hosting expenses.",
            "<strong>Offline Spatial Alarms & Embedded Tile Server:</strong> Engineered a 100% offline background location alarm system. Map data is stored locally in MBTiles format using Sqflite and served via a custom embedded local HTTP tile server to trigger alarms upon entering defined radius boundaries.",
            "<strong>Commercial Device-Limiting Licensing:</strong> Integrated Firebase Authentication and Cloud Firestore to enforce strict multi-device licensing rules, tracking active device signatures and restricting unauthorized concurrent logins alongside Firebase Analytics."
        ],
        metrics: [
            "Zero server storage costs achieved via direct Google Drive OAuth2 integration",
            "100% offline map rendering & background arrival geofencing alarms",
            "Hardware-level silent front camera capture on wrong lock-screen PIN entry",
            "Cloud Firestore commercial licensing with strict device-limit enforcement"
        ]
    },
    prid: {
        title: "PRID - Profit / Interest Distribution Banking System",
        client: "Dhaka Bank Limited",
        type: "Enterprise Banking Interest Calculation & Poller Engine",
        tech: ["Java (Spring Boot)", "Angular (v20)", "Bootstrap 5", "RxJS", "Chart.js", "Angular-Slickgrid", "Multi-Module Architecture", "Oracle DB", "prid-server", "prid-data-poller", "prid-entity"],
        description: "PRID (Profit/Interest Distribution) is a mission-critical banking interest distribution platform engineered for Dhaka Bank. It daily polls source data, normalizes records via strict 30-day month rules, and executes 100% accurate, deterministic interest calculations across Branches, Sub-Branches, and Foreign Currency (FC) accounts.",
        architecture: [
            "<strong>Spring Boot Multi-Module System Architecture:</strong> Decoupled into specialized modules including <code>prid-server</code> for core calculation logic, <code>prid-data-poller</code> for automated source synchronization, and <code>prid-entity</code> for domain data models.",
            "<strong>Strict 30-Day Month Rule & Gap Normalization:</strong> Custom-engineered algorithmic engine strictly enforcing 30-day month calculations with deterministic gap-filling rules (missing first days, mid-month data gaps, and February adjustments).",
            "<strong>Monthly Average Amount Engine:</strong> Accurately computes 'Monthly Average Amount' to distribute profits and deductions across Branches, Sub-Branches, and Foreign Currency (FC) accounts with zero arithmetic variance.",
            "<strong>High-Throughput Angular 20 & Slickgrid UI:</strong> Designed a reactive front-end with Angular (v20), Bootstrap 5, RxJS, Chart.js financial charts, and Angular-Slickgrid to smoothly render tens of thousands of transactional ledger records."
        ],
        metrics: [
            "100% deterministic & mathematically rigorous banking interest calculation",
            "Automated daily source system data polling and normalization pipeline",
            "Sub-second grid rendering for high-volume banking ledgers via Angular-Slickgrid",
            "Complete multi-tier interest allocation for Branches, Sub-Branches & FC Accounts"
        ]
    }
};

function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <div class="modal-deepdive-header">
            <span class="modal-client-tag"><i class="fa-solid fa-landmark"></i> ${data.client}</span>
            <h2>${data.title}</h2>
            <span>${data.type}</span>
        </div>

        <p class="modal-desc" style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
            ${data.description}
        </p>

        <div class="modal-architecture-box">
            <h4><i class="fa-solid fa-network-wired text-cyan"></i> Architecture & Engineering Highlights</h4>
            <ul class="modal-bullet-list">
                ${data.architecture.map(item => `<li><i class="fa-solid fa-angle-right"></i> <div>${item}</div></li>`).join('')}
            </ul>
        </div>

        <div class="modal-tech-stack" style="margin-top: 1.25rem;">
            <h4 style="font-size: 0.9rem; color: #cbd5e1; margin-bottom: 0.5rem;">Technologies Utilized:</h4>
            <div class="project-tech-badges">
                ${data.tech.map(t => `<span>${t}</span>`).join('')}
            </div>
        </div>

        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-sm" onclick="closeProjectModal()">
                <span>Close Deep Dive</span>
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal(e) {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
});

/* ==========================================================================
   12. Contact Form Submission (Web3Forms API)
   ========================================================================== */
async function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    const submitBtn = document.getElementById('form-submit-btn');
    const originalBtnText = `<i class="fa-regular fa-paper-plane"></i> <span>Send Message</span>`;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>`;
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: 'ecdfe1e6-a2d4-4c95-b00b-fd64cbbd0b3a',
                name: name,
                email: email,
                subject: subject || 'Portfolio Contact Message',
                message: message,
                from_name: `${name} (Portfolio Inquiry)`
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast('Thank you! Your message has been sent directly to my email.');
            document.getElementById('contact-form').reset();
        } else {
            showToast(result.message || 'Failed to send message. Please try again.');
        }
    } catch (err) {
        console.error('Contact submission error:', err);
        showToast('Network error. Opening email client fallback...');
        const mailtoUrl = `mailto:sadlyahamed1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Sheikh Sadly,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoUrl;
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}


/* ==========================================================================
   13. Robust Offline & Online CV Download Engine
   ========================================================================== */
function b64toBlob(b64Data, contentType = 'application/pdf', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
}

function initCVDownload() {
    let downloadHref = 'assets/Sheikh_Sadly_Ahamed_CV.pdf';
    const fileName = 'Sheikh_Sadly_Ahamed_CV.pdf';

    // 1. Generate pre-warmed Blob URL from embedded Base64 (guarantees direct disk download on file:// and http/https)
    if (window.CV_PDF_BASE64) {
        try {
            const blob = b64toBlob(window.CV_PDF_BASE64, 'application/pdf');
            downloadHref = window.URL.createObjectURL(blob);
        } catch (err) {
            console.warn('Base64 blob conversion failed:', err);
        }
    }

    const cvButtons = document.querySelectorAll('.cv-download-action, #hero-download-cv, #nav-cv-download, #social-cv');
    cvButtons.forEach(btn => {
        btn.href = downloadHref;
        btn.setAttribute('download', fileName);
        btn.removeAttribute('target');
        btn.addEventListener('click', () => {
            showToast('Downloading Sheikh Sadly Ahamed CV (PDF)...');
        });
    });
}



