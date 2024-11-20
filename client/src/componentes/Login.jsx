import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TextField, Button, Box, CircularProgress, Typography, Alert, AlertTitle } from "@mui/material";

const API = import.meta.env.VITE_API_URL;
const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");  // Limpiar posibles errores previos

        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usuario,
                    contrasena,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: "Redirigiendo...",
                    timer: 1500,
                    showConfirmButton: false,
                });
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuario", data.nombres);
                localStorage.setItem("id", data.id);
                localStorage.setItem("rol", data.rol);

                // Redirigir según el rol
                if (data.rol === "Administrador") {
                    navigate("/administrativo");
                } else if (data.rol === "Vigilante") {
                    navigate("/vigilantes");
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Rol desconocido",
                        text: "No tienes acceso a este sistema.",
                    });
                }
            } else {
                setError(data.error || "Usuario o contraseña incorrectos.");
            }
        } catch (error) {
            setError("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: 350,
                margin: "50px auto",
                padding: 3,
                border: "1px solid #ddd",
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center" }}>
                Iniciar Sesión
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 3, textAlign: "center", color: "gray" }}>
                Ingrese sus credenciales para acceder
            </Typography>

            <form onSubmit={handleLogin}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Usuario"
                        variant="outlined"
                        fullWidth
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </Box>

                {error && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Iniciar Sesión
                        </Button>
                    )}
                </Box>
            </form>
        </Box>
    );
};

export default Login;
