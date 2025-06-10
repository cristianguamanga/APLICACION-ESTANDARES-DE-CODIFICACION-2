class AuthService {
    /**
     * Valida las credenciales del administrador
     * @param {string} usuario - Nombre de usuario
     * @param {string} contrasena - Contraseña
     * @returns {Promise<boolean>} True si las credenciales son válidas
     */
    static async validarAdministrador(usuario, contrasena) {
        try {
            const adminData = await ApiService.obtenerAdministrador();
            return adminData.usuario === usuario && adminData.contrasena === contrasena;
        } catch (error) {
            console.error('Error en validarAdministrador:', error);
            throw error;
        }
    }

    /**
     * Inicia sesión como administrador
     * @param {string} usuario - Nombre de usuario
     * @param {string} contrasena - Contraseña
     * @returns {Promise<boolean>} True si el inicio de sesión fue exitoso
     */
    static async iniciarSesionAdmin(usuario, contrasena) {
        const esValido = await this.validarAdministrador(usuario, contrasena);
        if (esValido) {
            localStorage.setItem('adminAutenticado', 'true');
            return true;
        }
        return false;
    }

    /**
     * Cierra la sesión del administrador
     */
    static cerrarSesionAdmin() {
        localStorage.removeItem('adminAutenticado');
    }

    /**
     * Verifica si hay una sesión activa de administrador
     * @returns {boolean} True si hay sesión activa
     */
    static esAdminAutenticado() {
        return localStorage.getItem('adminAutenticado') === 'true';
    }
}