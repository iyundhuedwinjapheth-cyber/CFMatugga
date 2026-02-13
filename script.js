// Default products with stock images
        const defaultProducts = [
            {
                name: 'Broiler Day-Old Chicks',
                description: 'Fast-growing, high-quality broiler chicks from certified breeds. Perfect for meat production.',
                price: 3500,
                image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80',
                badge: 'Best Seller'
            },
            {
                name: 'Layer Day-Old Chicks',
                description: 'Premium layer breeds with excellent egg production rates. Start your egg farm today.',
                price: 4200,
                image: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=600&q=80',
                badge: 'Popular'
            },
            {
                name: 'Kuroiler Chicks',
                description: 'Dual-purpose breed for both meat and eggs. Hardy and disease-resistant.',
                price: 5000,
                image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=600&q=80',
                badge: 'Premium'
            },
            {
                name: 'Poultry Feed',
                description: 'Nutritionally balanced feed for all growth stages. Boost productivity with quality nutrition.',
                price: 85000,
                image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80',
                badge: 'Essential'
            }
        ];

        // Default videos
        const defaultVideos = [
            {
                title: 'Day-Old Chick Hatchery Tour',
                description: 'See how we maintain the highest standards in our hatchery',
                thumbnail: 'https://images.unsplash.com/photo-1594281577828-c705e2b87a05?w=600&q=80',
                url: '#'
            },
            {
                title: 'Poultry Farm Management Tips',
                description: 'Expert advice on managing a successful poultry farm',
                thumbnail: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&q=80',
                url: '#'
            },
            {
                title: 'Customer Success Story',
                description: 'How one farmer grew their business with our chicks',
                thumbnail: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80',
                url: '#'
            }
        ];

        // Default gallery images
        const defaultGallery = [
            { url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80', caption: 'Our Premium Chicks' },
            { url: 'https://images.unsplash.com/photo-1594281577828-c705e2b87a05?w=600&q=80', caption: 'Modern Hatchery' },
            { url: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=600&q=80', caption: 'Healthy Flock' },
            { url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&q=80', caption: 'Farm Facilities' },
            { url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80', caption: 'Quality Control' },
            { url: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=600&q=80', caption: 'Free-Range Area' }
        ];

        // Load products
        function loadProducts() {
            const grid = document.getElementById('productsGrid');
            const products = JSON.parse(localStorage.getItem('farmProducts')) || defaultProducts;
            
            grid.innerHTML = products.map((product, index) => `
                <div class="product-card" style="transition-delay: ${index * 0.1}s">
                    <div class="product-image loading" data-bg="${product.image}" id="product-img-${index}">
                        <span class="product-badge">${product.badge || 'New'}</span>
                    </div>
                    <div class="product-content">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">UGX ${product.price.toLocaleString()}</div>
                        <button class="order-button" onclick="openOrderModal('${product.name}', ${product.price})">Order Now</button>
                    </div>
                </div>
            `).join('');
            
            // Lazy load product images
            products.forEach((product, index) => {
                const imgElement = document.getElementById(`product-img-${index}`);
                lazyLoadBackground(imgElement, product.image);
            });
        }

        // Lazy load background images
        function lazyLoadBackground(element, imageUrl) {
            if (!element) return;
            
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = new Image();
                        img.onload = () => {
                            element.style.backgroundImage = `url('${imageUrl}')`;
                            element.classList.remove('loading');
                        };
                        img.src = imageUrl;
                        obs.unobserve(element);
                    }
                });
            }, { rootMargin: '50px' });
            
            observer.observe(element);
        }

        // Load videos
        function loadVideos() {
            const gallery = document.getElementById('videoGallery');
            const videos = JSON.parse(localStorage.getItem('farmVideos')) || defaultVideos;
            
            gallery.innerHTML = videos.map((video, index) => `
                <div class="video-card" onclick="playVideo('${video.url}')">
                    <div class="video-thumbnail loading" id="video-thumb-${index}">
                        <div class="play-button">▶</div>
                    </div>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                    </div>
                </div>
            `).join('');
            
            // Lazy load video thumbnails
            videos.forEach((video, index) => {
                const thumbElement = document.getElementById(`video-thumb-${index}`);
                lazyLoadBackground(thumbElement, video.thumbnail);
            });
        }

        // Load gallery
        function loadGallery() {
            const gallery = document.getElementById('photoGallery');
            const photos = JSON.parse(localStorage.getItem('farmGallery')) || defaultGallery;
            
            gallery.innerHTML = photos.map((photo, index) => `
                <div class="gallery-item" onclick="openLightbox('${photo.url}')" style="transition-delay: ${index * 0.05}s">
                    <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
                    <div class="gallery-overlay">
                        <p>${photo.caption}</p>
                    </div>
                </div>
            `).join('');
        }

        // Parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroBackground = document.querySelector('.hero-bg');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            // Hide/show navbar
            const navbar = document.getElementById('navbar');
            if (scrolled > 100) {
                if (scrolled > window.lastScroll) {
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                }
            }
            window.lastScroll = scrolled;
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, observerOptions);

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.section-title, .section-subtitle, .product-card, .feature-card, .video-card, .gallery-item').forEach(el => {
                observer.observe(el);
            });
            
            // Lazy load about image
            const aboutImage = document.querySelector('.about-image');
            if (aboutImage) {
                aboutImage.classList.add('loading');
                lazyLoadBackground(aboutImage, 'https://images.unsplash.com/photo-1594281577828-c705e2b87a05?w=800&q=80');
            }
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Order modal
        let currentPrice = 0;

        function openOrderModal(product, price) {
            document.getElementById('orderProduct').value = product;
            document.getElementById('orderPrice').value = `UGX ${price.toLocaleString()}`;
            currentPrice = price;
            document.getElementById('orderQuantity').value = 1;
            updateOrderTotal();
            openModal('orderModal');
        }

        function closeOrderModal() {
            closeModal('orderModal');
        }

        document.getElementById('orderQuantity').addEventListener('input', updateOrderTotal);

        function updateOrderTotal() {
            const quantity = parseInt(document.getElementById('orderQuantity').value) || 0;
            const total = currentPrice * quantity;
            document.getElementById('orderTotal').value = `UGX ${total.toLocaleString()}`;
        }

        // Registration form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const customer = {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                location: document.getElementById('regLocation').value,
                farmType: document.getElementById('regFarmType').value,
                registeredAt: new Date().toISOString()
            };

            const customers = JSON.parse(localStorage.getItem('farmCustomers') || '[]');
            customers.push(customer);
            localStorage.setItem('farmCustomers', JSON.stringify(customers));

            showToast('Registration successful! You will receive updates on new products.');
            closeModal('registerModal');
            document.getElementById('registerForm').reset();
        });

        // Order form
        document.getElementById('orderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const orderData = {
                product: document.getElementById('orderProduct').value,
                quantity: document.getElementById('orderQuantity').value,
                total: document.getElementById('orderTotal').value,
                name: document.getElementById('orderName').value,
                phone: document.getElementById('orderPhone').value,
                email: document.getElementById('orderEmail').value,
                address: document.getElementById('orderAddress').value,
                timestamp: new Date().toISOString()
            };

            const orders = JSON.parse(localStorage.getItem('farmOrders') || '[]');
            orders.push(orderData);
            localStorage.setItem('farmOrders', JSON.stringify(orders));

            showToast('Order placed successfully! We will contact you shortly.');
            closeOrderModal();
            document.getElementById('orderForm').reset();
        });

        // Contact form
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const contactData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            const contacts = JSON.parse(localStorage.getItem('farmContacts') || '[]');
            contacts.push(contactData);
            localStorage.setItem('farmContacts', JSON.stringify(contacts));

            showToast('Thank you for your message! We will get back to you soon.');
            document.getElementById('contactForm').reset();
        });

        // Lightbox
        function openLightbox(imageSrc) {
            document.getElementById('lightboxImage').src = imageSrc;
            document.getElementById('lightbox').classList.add('active');
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
        }

        // Video player
        function playVideo(url) {
            if (url === '#') {
                showToast('Video playback feature - connect to your video hosting service');
            } else {
                window.open(url, '_blank');
            }
        }

        // Toast notification
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 3000);
        }

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Close lightbox on outside click
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                closeLightbox();
            }
        });

        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNav = document.getElementById('mobileNav');
        const mobileOverlay = document.getElementById('mobileOverlay');

        function openMobileMenu() {
            mobileNav.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileMenuBtn.addEventListener('click', openMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);

        // Initialize
        loadProducts();
        loadVideos();
        loadGallery();


// ===== Website Content Sync (Admin -> Public) =====
const WEBSITE_CONTENT_KEY = 'websiteContent';

function applyWebsiteContent(content) {
  if (!content) return;

  // Hero
  if (content.heroTitle) {
    const h1 = document.querySelector('.hero-content h1');
    if (h1) h1.textContent = content.heroTitle;
  }
  if (content.heroSubtitle) {
    const p = document.querySelector('.hero-content p');
    if (p) p.textContent = content.heroSubtitle;
  }
  if (content.heroCtaText) {
    const cta = document.querySelector('.hero-content .cta-button');
    if (cta) cta.textContent = content.heroCtaText;
  }

  // About
  if (content.aboutTitle) {
    const t = document.querySelector('#about .section-title');
    if (t) t.textContent = content.aboutTitle;
  }
  if (content.aboutHeading) {
    const h = document.querySelector('#about .about-text h3');
    if (h) h.textContent = content.aboutHeading;
  }
  if (content.aboutBody) {
    const paras = document.querySelectorAll('#about .about-text p');
    if (paras && paras.length) {
      // Put entire body in first paragraph, hide extra paragraphs
      paras[0].textContent = content.aboutBody;
      for (let i = 1; i < paras.length; i++) paras[i].style.display = 'none';
    }
  }

  // Contact
  if (content.contactTitle) {
    const t = document.querySelector('#contact .section-title');
    if (t) t.textContent = content.contactTitle;
  }

  // Footer small text
  if (content.footerNote) {
    const existing = document.querySelector('.footer-note');
    if (existing) existing.textContent = content.footerNote;
    else {
      const footer = document.querySelector('footer');
      if (footer) {
        const div = document.createElement('div');
        div.className = 'footer-note';
        div.style.textAlign = 'center';
        div.style.opacity = '0.85';
        div.style.fontSize = '12px';
        div.style.marginTop = '12px';
        div.textContent = content.footerNote;
        footer.appendChild(div);
      }
    }
  }
}

function loadWebsiteContent() {
  try {
    const raw = localStorage.getItem(WEBSITE_CONTENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Invalid websiteContent in localStorage', e);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved admin content (if any)
  applyWebsiteContent(loadWebsiteContent());

  // Shortcut to admin
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
      window.location.href = 'admin.html';
    }
  });
});

// Live update when admin saves (works across tabs)
window.addEventListener('storage', (event) => {
  if (event.key === WEBSITE_CONTENT_KEY) {
    applyWebsiteContent(loadWebsiteContent());
  }
});