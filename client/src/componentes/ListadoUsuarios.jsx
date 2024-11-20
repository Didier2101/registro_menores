import { useEffect, useState } from "react";
import { Button, TextField, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import { themeColors } from "../utils/theme";


import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API = import.meta.env.VITE_API_URL;


const ListadoUsuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [nombre, setNombre] = useState("");
    const [numeroDocumento, setNumeroDocumento] = useState("");
    const [usuarioInput, setUsuarioInput] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [rol, setRol] = useState("Vigilante");
    const [editUserId, setEditUserId] = useState(null);
    const [open, setOpen] = useState(false);  // Para abrir el modal de añadir
    const [openEdit, setOpenEdit] = useState(false); // Para abrir el modal de editar


    useEffect(() => {
        fetchUsuarios();
    }, []);
    // Obtener usuarios registrados
    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${API}/usuarios`);
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            const errorMessage = error.message || "Ocurrió un error inesperado.";
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    // Crear usuario
    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            nombres: nombre,
            numero_documento: numeroDocumento,
            usuario: usuarioInput,
            contrasena,
            rol,
        };

        try {
            const response = await fetch(`${API}/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Usuario creado",
                    text: "Operación exitosa.",
                    showConfirmButton: false,
                    timer: 1500
                });
                setNombre("");
                setNumeroDocumento("");
                setUsuarioInput("");
                setContrasena("");
                setRol("Administrador");
                setOpen(false);
                fetchUsuarios(); // Refrescar la lista de usuarios
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "Exito",
                    title: "Se creo el usuario exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            const errorMessage = error.message || "Ocurrió un error inesperado.";
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    // Editar usuario
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            nombres: nombre,
            numero_documento: numeroDocumento,
        };

        try {
            const response = await fetch(`${API}/usuarios/${editUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Usuario actualizado",
                    text: "Operación exitosa.",
                });
                setNombre("");
                setNumeroDocumento("");
                setOpenEdit(false);
                fetchUsuarios(); // Refrescar la lista de usuarios
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.error || "No se pudo completar la operación.",
                });
            }
        } catch (error) {
            const errorMessage = error.message || "Ocurrió un error inesperado.";
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };


    // Eliminar usuario
    const handleDelete = async (id) => {
        try {
            // Mostrar la alerta de confirmación
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "¡No podrás revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "¡Sí, eliminarlo!",
            });

            // Si el usuario confirma la eliminación
            if (result.isConfirmed) {
                // Realizar la eliminación
                const response = await fetch(`${API}/usuarios/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (response.ok) {
                    // Actualizar el estado para remover al usuario eliminado
                    setUsuarios(usuarios.filter((user) => user.id !== id));

                    // Mostrar mensaje de éxito
                    Swal.fire({
                        position: "top-end",
                        title: "Se elimino el usuario",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else {
                    console.error("Error al eliminar el usuario:", result.message);
                }
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const capitalizarPrimerLetra = (texto) => {
        if (!texto) return '';  // Si el texto está vacío o no existe, retornamos una cadena vacía
        return texto
            .split(' ')  // Separa la cadena por palabras
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())  // Capitaliza cada palabra
            .join(' ');  // Une las palabras de nuevo en una cadena
    };


    return (
        <div>

            <Box sx={{ pl: 1, pr: 1, mt: 1, display: 'flex', justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>
                    Usuarios Registrados
                </Typography>
                <Button variant="contained" color="primary" onClick={() => {
                    setOpen(true);

                }}
                    sx={{
                        backgroundColor: themeColors.secondary.main,
                        color: themeColors.common.white,
                        fontSize: '0.8rem',
                        borderRadius: '5px',
                    }}
                >
                    Añadir Usuario
                </Button>
            </Box>


            <Box sx={{ pl: 1, pr: 1, mt: 2 }}>

                <TableContainer component={Paper} sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: themeColors.secondary.main, position: 'sticky', top: 0, zIndex: 1 }}>
                            <TableRow>
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Nombre</TableCell>
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Número de Documento</TableCell>
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Rol</TableCell>
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'right', fontWeight: 'bold', fontSize: '0.8rem' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{capitalizarPrimerLetra(user.nombres)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{user.numero_documento}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{user.rol}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'flex-end', p: 1 }}>

                                        <IconButton
                                            size="small"
                                            color="themeColors.secondary.main"
                                            variant="outlined"
                                            onClick={() => {
                                                setEditUserId(user.id);
                                                setNombre(user.nombres);
                                                setNumeroDocumento(user.numero_documento);
                                                setOpenEdit(true);
                                            }}
                                        >
                                            <EditIcon size="small"
                                                sx={{
                                                    '&:hover': {
                                                        color: 'blue', // Color de fondo al pasar el cursor
                                                    },
                                                }} />
                                        </IconButton>

                                        <IconButton
                                            color="secondary"
                                            variant="outlined"
                                            onClick={() => handleDelete(user.id)}

                                        >
                                            <DeleteIcon
                                                size="small"
                                                sx={{
                                                    '&:hover': {
                                                        color: 'red', // Color de fondo al pasar el cursor
                                                    },
                                                }}
                                            />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>


            {/* Modal para añadir usuario */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ padding: 2, backgroundColor: "white", margin: "auto", maxWidth: 400 }}>
                    <Typography variant="h5" gutterBottom>
                        Crear Usuario
                    </Typography>
                    <form onSubmit={handleCreateSubmit}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            margin="normal"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <TextField
                            label="Número de Documento"
                            fullWidth
                            margin="normal"
                            value={numeroDocumento}
                            onChange={(e) => setNumeroDocumento(e.target.value)}
                        />
                        <TextField
                            label="Usuario"
                            fullWidth
                            margin="normal"
                            value={usuarioInput}
                            onChange={(e) => setUsuarioInput(e.target.value)}
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                        <TextField
                            label="Rol"
                            select
                            fullWidth
                            margin="normal"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="Administrador">Administrador</option>
                            <option value="Vigilante">Vigilante</option>
                        </TextField>

                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginTop: 2 }}>
                            Crear Usuario
                        </Button>
                    </form>
                </Box>
            </Modal>

            {/* Modal para editar usuario */}
            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <Box sx={{ padding: 2, backgroundColor: "white", margin: "auto", maxWidth: 400 }}>
                    <Typography variant="h5" gutterBottom>
                        Editar Usuario
                    </Typography>
                    <form onSubmit={handleEditSubmit}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            margin="normal"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <TextField
                            label="Número de Documento"
                            fullWidth
                            margin="normal"
                            value={numeroDocumento}
                            onChange={(e) => setNumeroDocumento(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginTop: 2 }}>
                            Actualizar Usuario
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default ListadoUsuarios