const API_BASE_URL = 'https://raw.githubusercontent.com/CesarMCuellarCha/Elecciones/refs/heads/main';

class ApiService {
    /**
     * Obtiene la lista de candidatos desde la API
     * @returns {Promise<Array>} Lista de candidatos
     */
    static async obtenerCandidatos() {
        try {
            const response = await fetch(`${API_BASE_URL}/candidatos.json`);
            if (!response.ok) throw new Error('Error al obtener candidatos');
            return await response.json();
        } catch (error) {
            console.error('Error en obtenerCandidatos:', error);
            throw error;
        }
    }

    /**
     * Obtiene la información del administrador desde la API
     * @returns {Promise<Object>} Datos del administrador
     */
    static async obtenerAdministrador() {
        try {
            const response = await fetch(`${API_BASE_URL}/administrador.json`);
            if (!response.ok) throw new Error('Error al obtener datos del administrador');
            return await response.json();
        } catch (error) {
            console.error('Error en obtenerAdministrador:', error);
            throw error;
        }
    }

    /**
     * Registra un voto para un candidato (simulado)
     * @param {string} candidatoId - ID del candidato
     * @returns {Promise<boolean>} True si el voto fue registrado exitosamente
     */
    static async registrarVoto(candidatoId) {
        // En una aplicación real, aquí haríamos una llamada a un backend
        // Para esta simulación, almacenaremos los votos en localStorage
        try {
            const votos = JSON.parse(localStorage.getItem('votos')) || {};
            votos[candidatoId] = (votos[candidatoId] || 0) + 1;
            localStorage.setItem('votos', JSON.stringify(votos));
            return true;
        } catch (error) {
            console.error('Error en registrarVoto:', error);
            throw error;
        }
    }

    /**
     * Obtiene los resultados de la votación
     * @returns {Promise<Object>} Objeto con los votos por candidato
     */
    static async obtenerResultados() {
        try {
            const votos = JSON.parse(localStorage.getItem('votos')) || {};
            return votos;
        } catch (error) {
            console.error('Error en obtenerResultados:', error);
            throw error;
        }
    }
}