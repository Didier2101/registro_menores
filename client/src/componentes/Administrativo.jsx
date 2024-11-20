import { useState } from "react";
import Header from "./Header";
import { Typography, Button, Box } from "@mui/material";
import { themeColors } from "../utils/theme";
import ListadoUsuarios from "./ListadoUsuarios";
import ListadoMenores from "./ListadoMenores";

const Administrativo = () => {
    const [usuario] = useState("");
    const [mostrarUsuarios, setMostrarUsuarios] = useState(false);  // Estado para controlar la vista

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        console.log("Sesión cerrada");
        window.location.href = "/"; // Redirigir a la página de inicio
    };

    const handleToggleView = () => {
        setMostrarUsuarios(!mostrarUsuarios); // Cambiar la vista
    };

    return (
        <div>
            <Header usuario={usuario} onLogout={handleLogout} />
            <Box sx={{ pl: 1, pr: 1, mt: 1, display: 'flex', justifyContent: "start" }}>
                <Typography variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: themeColors.secondary.main, // Negro para el texto
                    }}
                >
                    Panel administrativo
                </Typography>

                {/* Botón para alternar entre los componentes */}
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: themeColors.secondary.main,
                        color: themeColors.common.white,
                        borderRadius: '5px',
                        marginLeft: 2,
                    }}
                    onClick={handleToggleView}
                >
                    {mostrarUsuarios ? "Ver registro de menores" : "Ver registro de usuarios"}
                </Button>

            </Box>
            {/* Mostrar el componente correspondiente según el estado */}
            {mostrarUsuarios ? <ListadoUsuarios /> : <ListadoMenores />}
        </div>
    );
};

export default Administrativo;
