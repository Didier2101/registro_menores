import { useState } from "react";
import Header from "./Header";
import { Typography } from "@mui/material";
import { themeColors } from '../utils/theme';

import ListadoMenores from "./ListadoMenores";


const Vigilantes = () => {
    const [usuario] = useState("");


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        console.log("Sesión cerrada");
        window.location.href = "/"; // Redirigir a la página de inicio
    };



    return (
        <div>
            <Header usuario={usuario} onLogout={handleLogout} />
            <Typography variant="h5"
                sx={{
                    pl: 1, pr: 1, mt: 2,
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    color: themeColors.secondary.main, // Negro para el texto
                }}
            >
                Panel vigilantes
            </Typography>

            <ListadoMenores />

        </div>
    );
};

export default Vigilantes;
