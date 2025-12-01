<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Welcome to Nexus Commerce</h1>
          <p class="subtitle">Your one-stop shop for amazing products. Discover quality items with fast delivery and secure checkout.</p>
          <div class="hero-buttons">
            <router-link to="/products" class="btn-explore">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Explore Products
            </router-link>
            <router-link v-if="!isAuthenticated" to="/login" class="btn-signin">
              Sign In
            </router-link>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-card">
            <div class="visual-icon">🛍️</div>
            <div class="visual-stats">
              <div class="stat-item">
                <span class="stat-number">1000+</span>
                <span class="stat-label">Products</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">500+</span>
                <span class="stat-label">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="why-choose-section">
      <div class="why-choose-content">
        <div class="section-header">
          <h2>Why Choose Nexus Commerce?</h2>
          <p>Experience the difference with our customer-first approach</p>
        </div>
        
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon-wrapper">
              <div class="benefit-icon">⚡</div>
            </div>
            <h3>Lightning Fast</h3>
            <p>Quick browsing experience with instant product search and filters</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon-wrapper">
              <div class="benefit-icon">💯</div>
            </div>
            <h3>Quality Guaranteed</h3>
            <p>All products verified for quality and authenticity before shipping</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon-wrapper">
              <div class="benefit-icon">🎁</div>
            </div>
            <h3>Special Offers</h3>
            <p>Regular discounts, deals, and exclusive offers for members</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon-wrapper">
              <div class="benefit-icon">🤝</div>
            </div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer support to help with any questions</p>
          </div>
        </div>
        
        <div class="trust-indicators">
          <div class="trust-item">
            <span class="trust-icon">✓</span>
            <span class="trust-text">Secure Payments</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">✓</span>
            <span class="trust-text">Easy Returns</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">✓</span>
            <span class="trust-text">Free Shipping Over $50</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">✓</span>
            <span class="trust-text">Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
};
</script>

<style scoped>
.home {
  max-width: 100%;
  padding: 0;
  margin: 0;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
  min-height: 300px;
}

.hero-text {
  flex: 1;
  text-align: left;
}

.hero h1 {
  font-size: 48px;
  margin: 0 0 20px 0;
  font-weight: 800;
  line-height: 1.2;
}

.subtitle {
  font-size: 18px;
  margin: 0 0 30px 0;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-explore,
.btn-signin {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-explore {
  background-color: white;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-explore:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-signin {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  backdrop-filter: blur(10px);
}

.btn-signin:hover {
  background-color: white;
  color: #667eea;
}

.hero-visual {
  flex: 0 0 350px;
}

.visual-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.visual-icon {
  font-size: 80px;
  text-align: center;
  margin-bottom: 20px;
}

.visual-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 5px;
}

.stat-label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.why-choose-section {
  padding: 20px 40px;
  background: white;
}

.why-choose-content {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 42px;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.section-header p {
  font-size: 18px;
  color: #718096;
  margin: 0;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 50px;
}

.benefit-card {
  text-align: center;
  padding: 30px 20px;
  background: #f7fafc;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.benefit-card:hover {
  transform: translateY(-8px);
  border-color: #667eea;
  background: white;
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.15);
}

.benefit-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.benefit-icon {
  font-size: 36px;
}

.benefit-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.benefit-card p {
  font-size: 14px;
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  padding: 30px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 16px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trust-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #42b983 0%, #38a169 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.trust-text {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
}

@media (max-width: 1024px) {
  .hero-content {
    gap: 40px;
  }
  
  .hero-visual {
    flex: 0 0 280px;
  }
  
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .trust-indicators {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 30px 20px;
  }
  
  .hero-content {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }
  
  .hero-text {
    text-align: center;
  }
  
  .hero h1 {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
    max-width: 100%;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-visual {
    flex: 0 0 auto;
    width: 100%;
    max-width: 350px;
  }
  
  .why-choose-section {
    padding: 40px 20px;
  }
  
  .section-header h2 {
    font-size: 32px;
  }
  
  .section-header p {
    font-size: 16px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .trust-indicators {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  
  .trust-item {
    justify-content: center;
  }
}
</style>