class UIManager {
    /**
     * Muestra la pantalla de inicio de sesión para administrador
     */
    static mostrarLoginAdmin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-form">
                <h2>Iniciar Sesión como Administrador</h2>
                <div class="form-group">
                    <label for="usuario">Usuario:</label>
                    <input type="text" id="usuario" required>
                </div>
                <div class="form-group">
                    <label for="contrasena">Contraseña:</label>
                    <input type="password" id="contrasena" required>
                </div>
                <button id="btnLogin" class="btn">Iniciar Sesión</button>
            </div>
        `;

        document.getElementById('btnLogin').addEventListener('click', async () => {
            const usuario = document.getElementById('usuario').value;
            const contrasena = document.getElementById('contrasena').value;
            
            try {
                const loginExitoso = await AuthService.iniciarSesionAdmin(usuario, contrasena);
                if (loginExitoso) {
                    this.mostrarPanelAdmin();
                } else {
                    this.mostrarError('Credenciales incorrectas');
                }
            } catch (error) {
                this.mostrarError('Error al iniciar sesión');
            }
        });
    }

    /**
     * Muestra el panel de administración
     */
    static async mostrarPanelAdmin() {
        const eleccionesIniciadas = localStorage.getItem('eleccionesIniciadas') === 'true';
        
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="header">
                <h1>Panel de Administración</h1>
            </div>
            <div class="admin-panel">
                <button id="btnIniciarElecciones" class="btn" ${eleccionesIniciadas ? 'disabled' : ''}>
                    Iniciar Elecciones
                </button>
                <button id="btnCerrarElecciones" class="btn" ${!eleccionesIniciadas ? 'disabled' : ''}>
                    Cerrar Elecciones
                </button>
                <button id="btnCerrarSesion" class="btn">Cerrar Sesión</button>
            </div>
        `;

        document.getElementById('btnIniciarElecciones').addEventListener('click', () => {
            localStorage.setItem('eleccionesIniciadas', 'true');
            this.mostrarPanelAdmin();
            this.mostrarMensaje('Elecciones iniciadas correctamente');
        });

        document.getElementById('btnCerrarElecciones').addEventListener('click', async () => {
            localStorage.setItem('eleccionesIniciadas', 'false');
            this.mostrarPanelAdmin();
            this.mostrarMensaje('Elecciones cerradas correctamente');
            await this.mostrarResultados();
        });

        document.getElementById('btnCerrarSesion').addEventListener('click', () => {
            AuthService.cerrarSesionAdmin();
            this.mostrarLoginAdmin();
        });
    }

    /**
     * Muestra la interfaz de votación con los candidatos
     */
    static async mostrarInterfazVotacion() {
        try {
            const candidatos = await ApiService.obtenerCandidatos();
            
            // Agregar candidato en blanco
            candidatos.push({
                id: 'blanco',
                nombre: 'Voto en Blanco',
                programa: 'N/A',
                ficha: 'N/A',
                foto: 'https://via.placeholder.com/150?text=Voto+en+Blanco'
            });

            const app = document.getElementById('app');
            app.innerHTML = `
                <div class="header">
                    <h1>Elecciones Representante de Aprendices</h1>
                    <p>Selecciona tu candidato</p>
                </div>
                <div class="candidato-container" id="candidatosList"></div>
            `;

            const container = document.getElementById('candidatosList');
            candidatos.forEach(candidato => {
                const card = document.createElement('div');
                card.className = 'candidato-card';
                card.innerHTML = `
                    <h3 class="candidato-nombre">${candidato.nombre}</h3>
                    <img src="${candidato.foto}" alt="${candidato.nombre}" class="candidato-foto">
                    <p class="candidato-programa">${candidato.programa}</p>
                    <p class="candidato-ficha">Ficha: ${candidato.ficha}</p>
                `;
                card.addEventListener('click', () => this.confirmarVoto(candidato));
                container.appendChild(card);
            });
        } catch (error) {
            this.mostrarError('Error al cargar los candidatos');
        }
    }

    /**
     * Muestra un diálogo de confirmación para votar por un candidato
     * @param {Object} candidato - Datos del candidato seleccionado
     */
    static confirmarVoto(candidato) {
        if (confirm(`¿Estás seguro de votar por ${candidato.nombre}?`)) {
            this.registrarVoto(candidato.id);
        }
    }

    /**
     * Registra el voto para un candidato
     * @param {string} candidatoId - ID del candidato
     */
    static async registrarVoto(candidatoId) {
        try {
            await ApiService.registrarVoto(candidatoId);
            alert('¡Tu voto ha sido registrado correctamente!');
        } catch (error) {
            this.mostrarError('Error al registrar el voto');
        }
    }

    /**
     * Muestra los resultados de las elecciones
     */
    static async mostrarResultados() {
        try {
            const resultados = await ApiService.obtenerResultados();
            const candidatos = await ApiService.obtenerCandidatos();
            
            // Agregar candidato en blanco
            candidatos.push({
                id: 'blanco',
                nombre: 'Voto en Blanco',
                programa: 'N/A',
                ficha: 'N/A'
            });

            const app = document.getElementById('app');
            app.innerHTML = `
                <div class="header">
                    <h1>Resultados de las Elecciones</h1>
                </div>
                <div class="resultados-container">
                    <h2>Total de Votos por Candidato</h2>
                    <div id="resultadosList"></div>
                </div>
            `;

            const container = document.getElementById('resultadosList');
            
            candidatos.forEach(candidato => {
                const votos = resultados[candidato.id] || 0;
                const item = document.createElement('div');
                item.className = 'resultado-item';
                item.innerHTML = `
                    <span>${candidato.nombre}</span>
                    <span>${votos} votos</span>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            this.mostrarError('Error al cargar los resultados');
        }
    }

    /**
     * Muestra un mensaje de éxito
     * @param {string} mensaje - Mensaje a mostrar
     */
    static mostrarMensaje(mensaje) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = mensaje;
        document.getElementById('app').prepend(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    /**
     * Muestra un mensaje de error
     * @param {string} mensaje - Mensaje a mostrar
     */
    static mostrarError(mensaje) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.textContent = mensaje;
        document.getElementById('app').prepend(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}