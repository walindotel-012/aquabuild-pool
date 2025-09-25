// src/components/auth/AuthForm.js
import { Modal } from '../ui/Modal.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase.js';

export class AuthForm {
  constructor(onAuthSuccess, onAuthError = null) {
    this.onAuthSuccess = onAuthSuccess;
    this.onAuthError = onAuthError;
    this.modal = new Modal();
  }
  
  show() {
    const formHTML = `
      <div class="space-y-6">
        <!-- Formulario de Email/Contraseña -->
        <div id="email-form-section">
          <form id="email-form" class="space-y-4">
            <div>
              <label for="auth-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="auth-email" class="form-control" required placeholder="tu@email.com">
            </div>
            <div>
              <label for="auth-password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" id="auth-password" class="form-control" required placeholder="Mínimo 6 caracteres">
            </div>
            <div class="flex space-x-3">
              <button type="button" id="login-email-btn" class="btn btn-primary flex-1">Iniciar Sesión</button>
              <button type="button" id="register-email-btn" class="btn btn-outline flex-1">Registrarse</button>
            </div>
          </form>
        </div>

        <!-- Separador -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">O continuar con</span>
          </div>
        </div>

        <!-- Botón de Google -->
        <div class="text-center">
          <button id="google-signin-btn" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        <!-- Información adicional -->
        <div class="text-xs text-gray-500 text-center">
          <p>Al iniciar sesión, aceptas nuestros Términos de servicio y Política de privacidad.</p>
        </div>
      </div>
    `;
    
    this.modal.show('Iniciar Sesión - AquaBuild', formHTML, null, (modal) => {
      // Event listeners
      document.getElementById('login-email-btn').addEventListener('click', () => {
        this.handleEmailLogin(modal);
      });
      
      document.getElementById('register-email-btn').addEventListener('click', () => {
        this.handleEmailRegister(modal);
      });
      
      document.getElementById('google-signin-btn').addEventListener('click', () => {
        this.handleGoogleSignIn(modal);
      });
    });
  }
  
  async handleEmailLogin(modal) {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      this.onAuthSuccess();
      modal.close();
    } catch (error) {
      this.handleError(error, 'iniciar sesión');
    }
  }
  
  async handleEmailRegister(modal) {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      this.onAuthSuccess();
      modal.close();
    } catch (error) {
      this.handleError(error, 'registrarte');
    }
  }
  
  async handleGoogleSignIn(modal) {
    try {
      await signInWithPopup(auth, googleProvider);
      this.onAuthSuccess();
      modal.close();
    } catch (error) {
      this.handleError(error, 'iniciar sesión con Google');
    }
  }
  
  handleError(error, action) {
    let message = 'Error desconocido';
    
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'El email no es válido';
        break;
      case 'auth/user-disabled':
        message = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/user-not-found':
        message = 'No se encontró una cuenta con este email';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta';
        break;
      case 'auth/email-already-in-use':
        message = 'Este email ya está registrado';
        break;
      case 'auth/weak-password':
        message = 'La contraseña es muy débil (mínimo 6 caracteres)';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Inicio de sesión cancelado';
        break;
      case 'auth/popup-blocked':
        message = 'Popup bloqueado. Por favor permite popups para este sitio';
        break;
      default:
        message = error.message;
    }
    
    if (this.onAuthError) {
      this.onAuthError(message);
    } else {
      alert(`Error al ${action}: ${message}`);
    }
  }
  
  // Método para cerrar sesión
  static async logout() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return false;
    }
  }
}