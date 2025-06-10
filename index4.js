document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si las elecciones están activas
    const eleccionesIniciadas = localStorage.getItem('eleccionesIniciadas') === 'true';
    
    // Verificar si el usuario es administrador
    const esAdmin = AuthService.esAdminAutenticado();
    
    if (esAdmin) {
        UIManager.mostrarPanelAdmin();
    } else if (eleccionesIniciadas) {
        UIManager.mostrarInterfazVotacion();
    } else {
        // Mostrar mensaje de que las elecciones no han comenzado
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="header">
                <h1>Elecciones Representante de Aprendices</h1>
            </div>
            <div class="alert">
                <p>Las elecciones aún no han comenzado. Por favor, espera a que el administrador inicie el proceso.</p>
                <button id="btnAdminLogin" class="btn">Acceso Administrador</button>
            </div>
        `;
        
        document.getElementById('btnAdminLogin').addEventListener('click', () => {
            UIManager.mostrarLoginAdmin();
        });
    }
});