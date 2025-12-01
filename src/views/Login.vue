<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-box login-box">
        <div class="auth-header">
          <div class="auth-icon login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p class="auth-subtitle">Sign in to continue shopping</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="login-email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Address
            </label>
            <input 
              type="email" 
              id="login-email"
              v-model="loginForm.email" 
              placeholder="you@example.com" 
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="login-password">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Password
            </label>
            <div class="password-input-wrapper">
              <input 
                :type="showLoginPassword ? 'text' : 'password'"
                id="login-password"
                v-model="loginForm.password" 
                placeholder="Enter your password" 
                required
                class="form-input"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showLoginPassword = !showLoginPassword"
              >
                <svg v-if="!showLoginPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit btn-login" :disabled="isLoggingIn">
            <span v-if="isLoggingIn" class="btn-loading">
              <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
              </svg>
              Logging in...
            </span>
            <span v-else>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Sign In
            </span>
          </button>
        </form>

        <div v-if="loginError" class="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ loginError }}
        </div>
      </div>

      <div class="auth-box register-box">
        <div class="auth-header">
          <div class="auth-icon register-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h2>Create Account</h2>
          <p class="auth-subtitle">Join us and start shopping today</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="register-first-name">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                First Name
              </label>
              <input 
                type="text" 
                id="register-first-name"
                v-model="registerForm.first_name" 
                placeholder="John" 
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="register-last-name">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Last Name
              </label>
              <input 
                type="text" 
                id="register-last-name"
                v-model="registerForm.last_name" 
                placeholder="Doe" 
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="register-email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Address
            </label>
            <input 
              type="email" 
              id="register-email"
              v-model="registerForm.email" 
              placeholder="you@example.com" 
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="register-password">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Password
              <span class="password-hint">(min. 6 characters)</span>
            </label>
            <div class="password-input-wrapper">
              <input 
                :type="showRegisterPassword ? 'text' : 'password'"
                id="register-password"
                v-model="registerForm.password" 
                placeholder="Create a password" 
                required
                minlength="6"
                class="form-input"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showRegisterPassword = !showRegisterPassword"
              >
                <svg v-if="!showRegisterPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="register-password-confirm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Confirm Password
            </label>
            <div class="password-input-wrapper">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'"
                id="register-password-confirm"
                v-model="registerForm.password_confirmation" 
                placeholder="Confirm your password" 
                required
                class="form-input"
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit btn-register" :disabled="isRegistering">
            <span v-if="isRegistering" class="btn-loading">
              <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Create Account
            </span>
          </button>
        </form>

        <div v-if="registerError" class="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ registerError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      loginForm: { 
        email: '', 
        password: '' 
      },
      registerForm: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loginError: '',
      registerError: '',
      isLoggingIn: false,
      isRegistering: false,
      showLoginPassword: false,
      showRegisterPassword: false,
      showConfirmPassword: false
    };
  },
  methods: {
    async handleLogin() {
      this.loginError = '';
      this.isLoggingIn = true;
      
      try {
        await this.$store.dispatch('login', this.loginForm);
        this.$router.push('/products');
      } catch (err) {
        console.error(err);
        if (err.response) {
          if (err.response.status === 401) {
            this.loginError = 'Wrong email or password. Please try again.';
          } else if (err.response.status === 400) {
            this.loginError = 'Invalid login data. Please check your input.';
          } else {
            this.loginError = err.response.data?.error || err.response.data?.message || 'Failed to login. Please try again.';
          }
        } else {
          this.loginError = 'Network error. Please check your connection.';
        }
      } finally {
        this.isLoggingIn = false;
      }
    },
    
    async handleRegister() {
      this.registerError = '';
      
      if (this.registerForm.password !== this.registerForm.password_confirmation) {
        this.registerError = 'Passwords do not match.';
        return;
      }
      
      if (this.registerForm.password.length < 6) {
        this.registerError = 'Password must be at least 6 characters long.';
        return;
      }
      
      this.isRegistering = true;
      
      try {
        await api.register(this.registerForm);
        
        await this.$store.dispatch('login', {
          email: this.registerForm.email,
          password: this.registerForm.password
        });
        
        this.$router.push('/products');
      } catch (err) {
        console.error(err);
        if (err.response) {
          if (err.response.status === 409) {
            this.registerError = 'User with this email already exists.';
          } else if (err.response.status === 400) {
            this.registerError = err.response.data?.error || 'Invalid registration data. Please check your input.';
          } else {
            this.registerError = err.response.data?.error || 'Failed to register. Please try again.';
          }
        } else {
          this.registerError = 'Network error. Please check your connection.';
        }
      } finally {
        this.isRegistering = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 1030px;
  padding: 60px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  max-width: 1200px;
  width: 100%;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.5s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-box:hover {
  transform: translateY(-5px);
}

.login-box {
  border-top: 4px solid #667eea;
}

.register-box {
  border-top: 4px solid #f093fb;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.login-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.auth-header h2 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: #2d3748;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  margin: 0;
  font-size: 16px;
  color: #718096;
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

.form-group label svg {
  color: #667eea;
  flex-shrink: 0;
}

.password-hint {
  font-size: 12px;
  font-weight: 400;
  color: #a0aec0;
  margin-left: auto;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #2d3748;
  background: #f7fafc;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #667eea;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-register {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  margin-top: 20px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fee 0%, #fdd 100%);
  border: 2px solid #f56565;
  border-radius: 12px;
  color: #c53030;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: shake 0.5s ease;
}

.error-message svg {
  flex-shrink: 0;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@media (max-width: 968px) {
  .auth-container {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .auth-box {
    padding: 32px 28px;
  }
}

@media (max-width: 640px) {
  .auth-page {
    padding: 40px 16px;
  }

  .auth-box {
    padding: 28px 20px;
  }

  .auth-header h2 {
    font-size: 28px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-input {
    padding: 12px 14px;
    font-size: 14px;
  }

  .btn-submit {
    padding: 14px;
    font-size: 15px;
  }
}
</style>