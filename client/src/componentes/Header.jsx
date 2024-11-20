import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { themeColors } from "../utils/theme";
import LogoutIcon from "@mui/icons-material/Logout"; // Ícono de salida

const Header = ({ onLogout }) => {
    const navigate = useNavigate();

    // Obtener el nombre del usuario desde localStorage
    const usuario = localStorage.getItem("usuario");

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("id");
        onLogout();
        navigate("/");
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: themeColors.secondary.main, // Azul claro
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        sx={{ marginRight: 1, width: 40, height: 40 }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            textTransform: "uppercase",
                            color: themeColors.common.white,
                            fontSize: "1rem",
                        }}
                    >
                        {usuario}
                    </Typography>
                </div>
                <Button
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />} // Ícono de salida
                    sx={{
                        color: themeColors.common.white,
                    }}
                >
                    Cerrar Sesión
                </Button>
            </Toolbar>
        </AppBar>
    );
};

// Agregar validación de prop-types
Header.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default Header;
