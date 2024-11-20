import { Box, Button, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from "@mui/material"
import { themeColors } from "../utils/theme";
import { Edit, VisibilityOutlined, Delete, Close } from '@mui/icons-material';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { validarCampos } from '../utils/validaciones';

const API = import.meta.env.VITE_API_URL;

const ListadoMenores = () => {

    const esMovil = useMediaQuery('(min-width:600px)');


    const obtenerFechaHoraColombia = () => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("es-CO", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

        const parts = formatter.formatToParts(now);
        const fecha = `${parts.find(p => p.type === "year").value}-${parts.find(p => p.type === "month").value
            }-${parts.find(p => p.type === "day").value}`;
        const hora = `${parts.find(p => p.type === "hour").value}:${parts.find(p => p.type === "minute").value
            }:${parts.find(p => p.type === "second").value}`;

        return `${fecha} ${hora}`;
    };



    const userId = localStorage.getItem('id');
    const userRol = localStorage.getItem('rol');
    console.log('rol para eliminar', userRol)


    const [detallePaciente, setDetallePaciente] = useState(false);
    const [puertaSalida, setPuertaSalida] = useState("");
    const [openEdit, setOpenEdit] = useState(false); // Modal para editar
    const [selectedPaciente, setSelectedPaciente] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [openAdd, setOpenAdd] = useState(false); // Modal para añadir
    const [nuevoPaciente, setNuevoPaciente] = useState({
        nombre_menor: "",
        apellidos_menor: "",
        numero_manilla: "",
        edad: "",
        genero_menor: "",
        tipo_documento_menor: "",
        numero_documento_menor: "",
        nacionalidad_menor: "",
        nombres_acompanante: "",
        tipo_documento_acompanante: "",
        numero_documento_acompanante: "",
        parentesco: "",
        genero_acompanante: "",
        nacionalidad_acompanante: "",
        fecha_ingreso: obtenerFechaHoraColombia(),
        entrada: "",
        vigilante_id: userId, // Ajustar según el contexto
    });

    console.log('nuevo paciente', nuevoPaciente)

    const handleAddPaciente = async (e) => {
        e.preventDefault();
        const { esValido, errores } = validarCampos(nuevoPaciente, step);

        if (!esValido) {
            alert("Por favor corrige los siguientes errores:\n" + errores.join("\n"));
            return;
        }


        try {
            const response = await fetch(`${API}/paciente`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoPaciente),
            });
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Paciente Agregado",
                    text: "El paciente se ha agregado correctamente.",
                });
                setOpenAdd(false); // Cerrar modal
                setNuevoPaciente({
                    nombre_menor: "",
                    apellidos_menor: "",
                    numero_manilla: "",
                    edad: "",
                    genero_menor: "",
                    tipo_documento_menor: "",
                    numero_documento_menor: "",
                    nacionalidad_menor: "",
                    nombres_acompanante: "",
                    tipo_documento_acompanante: "",
                    numero_documento_acompanante: "",
                    parentesco: "",
                    genero_acompanante: "",
                    nacionalidad_acompanante: "",
                    fecha_ingreso: new Date().toISOString().split("T")[0],
                    entrada: "",
                    vigilante_id: userId,
                });
                fetchPacientes(); // Actualizar lista de pacientes
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorData.message || "No se pudo agregar el paciente.",
                });
            }
        } catch (error) {
            console.error("Error al agregar paciente:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al agregar el paciente.",
            });
        }
    };

    // obtener paciente por id}
    const obtenerPacientePorId = async (id) => {
        try {
            const response = await fetch(`${API}/paciente/${id}`);
            if (response.ok) {
                const data = await response.json();
                setDetallePaciente(data)
                console.log('detalles por id del paciente'.data);
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorData.message || "No se pudo obtener el paciente.",
                });
            }
        } catch (error) {
            console.error("Error al obtener el paciente:", error);
            return null;
        }
    };

    // funcion para ocultar los formularios
    const handleCloseForm = () => {
        setOpenAdd(false);
        setOpenEdit(false);
        setDetallePaciente(false);
    };
    // Obtener pacientes
    const fetchPacientes = async () => {
        try {
            const response = await fetch(`${API}/paciente`);  // Asegúrate de que esta ruta sea la correcta
            const data = await response.json();
            setPacientes(data);
            console.log(data);
            console.log('creado por:', data.nombre_vigilante);
        } catch (error) {
            console.error("Error al obtener los pacientes:", error);
        }
    };


    useEffect(() => {
        fetchPacientes();
    }, []);


    const handleOpenEdit = (paciente) => {
        setSelectedPaciente(paciente); // Establece el paciente seleccionado
        // setHoraSalida("");
        setPuertaSalida(""); // Limpia el campo de puerta de salida
        setOpenEdit(true); // Abre el modal
    };


    // Editar datos de salida del paciente
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            fecha_salida: obtenerFechaHoraColombia(),
            salida: puertaSalida,
        };

        try {
            const response = await fetch(`${API}/paciente/${selectedPaciente.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Datos actualizados",
                    text: "Los datos del paciente han sido actualizados.",
                });
                setOpenEdit(false); // Cierra el modal
                fetchPacientes(); // Refresca la lista de pacientes
            } else {
                const data = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.error || "No se pudo completar la operación.",
                });
            }
        } catch (error) {
            console.error("Error al actualizar paciente:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al actualizar los datos del paciente.",
            });
        }
    };


    // Función para eliminar un paciente
    const handleDelete = async (id) => {
        // Confirmación antes de eliminar
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este paciente será eliminado permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {

            try {
                const response = await fetch(`${API}/paciente/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Si la eliminación es exitosa, actualizar la lista de pacientes
                    setPacientes(pacientes.filter((paciente) => paciente.id !== id));
                    await Swal.fire({
                        title: 'Eliminado',
                        text: 'El paciente ha sido eliminado exitosamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    });
                } else {
                    // Si hay algún error con la eliminación
                    await Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al eliminar al paciente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });
                }
                // Actualizar la lista de pacientes
                fetchPacientes();
            } catch (error) {
                console.error('Error al eliminar el paciente', error);
                await Swal.fire({
                    title: 'Error',
                    text: 'No se pudo conectar al servidor.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "Fecha no disponible";

        const opciones = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "America/Bogota",
        };

        const fechaLocal = new Date(fecha); // Asegúrate de que `fecha` sea válida
        return new Intl.DateTimeFormat("es-CO", opciones).format(fechaLocal).replace(',', '');
    };


    const capitalizarPrimerLetra = (texto) => {
        if (!texto) return '';  // Si el texto está vacío o no existe, retornamos una cadena vacía
        return texto
            .split(' ')  // Separa la cadena por palabras
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())  // Capitaliza cada palabra
            .join(' ');  // Une las palabras de nuevo en una cadena
    };


    const ordenarPorFecha = (pacientes, orden = 'asc') => {
        return pacientes.sort((a, b) => {
            const fechaA = new Date(a.fecha_ingreso); // Cambia 'fecha_creacion' por el campo que almacena la fecha de creación en tu base de datos
            const fechaB = new Date(b.fecha_salida);

            if (orden === 'asc') {
                return fechaA - fechaB; // Orden ascendente
            } else {
                return fechaB - fechaA; // Orden descendente
            }
        });
    };
    const pacientesOrdenados = ordenarPorFecha(pacientes, 'des');



    const [step, setStep] = useState(0); // Control del paso actual

    // Manejar el avance al siguiente paso
    const handleNext = () => {
        const { esValido, errores } = validarCampos(nuevoPaciente, step);

        if (!esValido) {
            alert("Por favor corrige los siguientes errores:\n" + errores.join("\n"));
            return;
        }

        setStep(step + 1);
    };

    // Manejar el regreso al paso anterior
    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div>
            <Box sx={{ pl: 1, pr: 1, mt: 1, display: 'flex', justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>
                    Menores registrados
                </Typography>
                <Button
                    onClick={() => setOpenAdd(true)}
                    variant="contained" size="small"
                    sx={{
                        backgroundColor: themeColors.secondary.main,
                        color: themeColors.common.white,
                        fontSize: '0.8rem',
                        borderRadius: '5px',
                    }}
                >
                    Añadir menor
                </Button>
            </Box>



            <Box sx={{ pl: 1, pr: 1, mt: 2, overflow: "auto", }}>
                <TableContainer component={Paper} sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table>

                        <TableHead sx={{ backgroundColor: themeColors.secondary.main, position: 'sticky', top: 0, zIndex: 1 }}>
                            <TableRow>
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Nombres</TableCell>
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Numero manilla</TableCell>
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Acompañante</TableCell>
                                {esMovil && (
                                    <>
                                        <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Parentesco</TableCell>
                                        <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Hora Ingreso</TableCell>
                                        <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Hora Salida</TableCell>
                                        <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Puerta entrada</TableCell>
                                        <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Puerta salida</TableCell>
                                        <TableCell sx={{ color: themeColors.common.white, textAlign: 'left', fontWeight: 'bold', fontSize: '0.8rem' }}>Ingresado por:</TableCell>
                                    </>
                                )}
                                <TableCell sx={{ color: themeColors.common.white, textAlign: 'right', fontWeight: 'bold', fontSize: '0.8rem' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pacientesOrdenados.map((paciente) => (
                                <TableRow key={paciente.numero_manilla}>
                                    <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{capitalizarPrimerLetra(paciente.nombre_menor)} {capitalizarPrimerLetra(paciente.apellidos_menor)}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{paciente.numero_manilla}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{capitalizarPrimerLetra(paciente.nombres_acompanante)}</TableCell>
                                    {esMovil && (
                                        <>
                                            <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{paciente.parentesco}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{formatearFecha(paciente.fecha_ingreso)}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', p: 1 }}> {paciente.fecha_salida ? formatearFecha(paciente.fecha_salida) : 'Sin registro'}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{paciente.entrada}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{paciente.salida ? paciente.salida : 'Sin registro'}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', p: 1 }}>{capitalizarPrimerLetra(paciente.nombre_vigilante)}</TableCell>
                                        </>
                                    )}
                                    <TableCell sx={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                                        {!paciente.salida && (
                                            <IconButton
                                                size="small"
                                                color="themeColors.secondary.main"
                                                variant="outlined"
                                                onClick={() => handleOpenEdit(paciente)}
                                            >
                                                <Edit size="small"
                                                    sx={{
                                                        '&:hover': {
                                                            color: 'blue', // Color de fondo al pasar el cursor
                                                        },
                                                    }} />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            onClick={() => obtenerPacientePorId(paciente.id)}
                                        >
                                            <VisibilityOutlined
                                                size="small"
                                                sx={{
                                                    '&:hover': {
                                                        color: 'blue', // Color de fondo al pasar el cursor
                                                    },
                                                }}
                                            />


                                        </IconButton>



                                        {userRol === 'Administrador' && (
                                            <IconButton
                                                color="themeColors.secondary.main"
                                                variant="outlined"
                                                onClick={() => handleDelete(paciente.id)}
                                            >
                                                <Delete
                                                    size="small"
                                                    sx={{
                                                        '&:hover': {
                                                            color: 'red', // Color de fondo al pasar el cursor
                                                        },
                                                    }}
                                                />
                                            </IconButton>
                                        )}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>



            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <Box sx={{ padding: 2, backgroundColor: "white", margin: "auto", maxWidth: 400 }}>
                    <Typography variant="h5" gutterBottom>
                        Editar Datos de Salida
                    </Typography>
                    <form onSubmit={handleEditSubmit}>


                        <TextField
                            select
                            label="Puerta de Salida"
                            fullWidth
                            margin="normal"
                            value={puertaSalida}
                            onChange={(e) => setPuertaSalida(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            required
                        >
                            <option value=""></option>
                            <option value="Consulta externa">Consulta externa</option>
                            <option value="Urgencias">Urgencias</option>
                            <option value="Cafeteria">Cafeteria</option>
                        </TextField>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth sx={{ marginTop: 2 }}>
                            Actualizar Datos
                        </Button>
                    </form>
                </Box>
            </Modal>


            <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxWidth: "600px",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        overflowY: "auto",
                        maxHeight: "80vh",
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ marginTop: 2, fontWeight: "bold" }}>
                        Agregar Paciente
                    </Typography>

                    {/* Control de pasos */}
                    {step === 0 && (
                        <>
                            <Typography variant="subtitle1" sx={{ marginTop: 2, fontWeight: "bold" }}>
                                Datos del menor
                            </Typography>
                            <TextField
                                label="Nombre"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.nombre_menor}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre_menor: e.target.value })}
                                required
                            />
                            <TextField
                                label="Apellidos"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.apellidos_menor}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, apellidos_menor: e.target.value })}
                                required
                            />
                            <TextField
                                label="Número de Manilla"
                                fullWidth
                                type="number"
                                margin="normal"
                                value={nuevoPaciente.numero_manilla}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, numero_manilla: e.target.value })}
                                required
                            />
                            <TextField
                                label="Edad"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.edad}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, edad: e.target.value })}
                                required
                            />
                            <TextField
                                label="Género"
                                select
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.genero_menor}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, genero_menor: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="M">Niño</option>
                                <option value="F">Niña</option>
                            </TextField>
                            <TextField
                                select
                                label="Tipo de Documento"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.tipo_documento_menor}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, tipo_documento_menor: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="R.C">Registro Civil</option>
                                <option value="T.I">Targeta de identidad</option>
                                <option value="A.N">Acta de nacimiento</option>
                            </TextField>
                            <TextField
                                label="Número de Documento"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.numero_documento_menor}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, numero_documento_menor: e.target.value })}
                                required
                            />
                            <TextField
                                select
                                label="Nacionalidad"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.nacionalidad_menor}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nacionalidad_menor: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="Colombiana">Colombiana</option>
                                <option value="Extranjera">Extranjera</option>
                            </TextField>

                        </>
                    )}

                    {step === 1 && (
                        <>
                            <Typography variant="subtitle1" sx={{ marginTop: 2, fontWeight: "bold" }}>
                                Datos del acompañante
                            </Typography>
                            <TextField
                                label="Nombres y apellidos"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.nombres_acompanante}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombres_acompanante: e.target.value })}
                                required
                            />
                            <TextField
                                select
                                label="Tipo de Documento"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.tipo_documento_acompanante}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, tipo_documento_acompanante: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="C.C">Cédula de ciudadanía</option>
                                <option value="P.P">Pasaporte</option>
                                <option value="C.E">Cédula de extranjería</option>
                            </TextField>
                            <TextField
                                label="Número de Documento"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.numero_documento_acompanante}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, numero_documento_acompanante: e.target.value })}
                                required
                            />
                            <TextField
                                select
                                label="Parentesco"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.parentesco}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, parentesco: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="Padre">Padre</option>
                                <option value="Madre">Madre</option>
                                <option value="Hermano">Hermano</option>
                                <option value="Abuelo">Abuelo</option>
                                <option value="Tío">Tío</option>
                                <option value="Otro">Otro</option>
                            </TextField>
                            <TextField
                                select
                                label="Género"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.genero_acompanante}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, genero_acompanante: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </TextField>
                            <TextField
                                select
                                label="Nacionalidad"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.nacionalidad_acompanante}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nacionalidad_acompanante: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="Colombiana">Colombiana</option>
                                <option value="Extranjera">Extranjera</option>
                            </TextField>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Typography variant="subtitle1" sx={{ marginTop: 2, fontWeight: "bold" }}>
                                Detalles de ingreso
                            </Typography>
                            <TextField
                                select
                                label="Puerta de entrada"
                                fullWidth
                                margin="normal"
                                value={nuevoPaciente.entrada}
                                onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, entrada: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value=""></option>
                                <option value="Consulta externa">Consulta externa</option>
                                <option value="Urgencias">Urgencias</option>
                                <option value="Cafetería">Cafetería</option>
                            </TextField>
                        </>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                        {step > 0 && (
                            <Button onClick={handleBack} variant="outlined">
                                Anterior
                            </Button>
                        )}
                        {step < 2 ? (
                            <Button onClick={handleNext} variant="contained">
                                Siguiente
                            </Button>
                        ) : (
                            <Button onClick={handleAddPaciente} variant="contained" color="primary">
                                Enviar
                            </Button>
                        )}
                    </Box>
                </Box>
            </Modal>


            {/* modal para los detalles del paciente */}
            <Modal
                open={Boolean(detallePaciente)}
                onClose={handleCloseForm}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: '90%',
                    maxWidth: '600px',
                    bgcolor: 'background.paper',
                    border: 'none',
                    boxShadow: 24,
                    p: 2,
                    overflowY: 'auto',
                    maxHeight: esMovil ? '88vh' : '96vh',
                }}
                >
                    {detallePaciente && (
                        <Box>
                            {/* Encabezado */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    pb: 1,

                                }}
                            >
                                <Typography id="parent-modal-title" variant="h5" component="h2" sx={{ color: 'themeColors.secondary.main', fontWeight: 'bold' }}>
                                    Detalles del Paciente
                                </Typography>
                                <IconButton onClick={handleCloseForm}>
                                    <Close />
                                </IconButton>
                            </Box>
                            {/* Información del paciente */}
                            <Box
                                sx={{
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    p: 2,
                                    borderRadius: '5px',
                                    mb: 2
                                }}
                            >
                                <Typography id="parent-modal-title" variant="h6" component="h2" sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                                    Datos del menor
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, fontSize: '1.3rem' }}>
                                    Nombre
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                                    {capitalizarPrimerLetra(detallePaciente.nombre_menor)} {capitalizarPrimerLetra(detallePaciente.apellidos_menor)}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: esMovil ? 10 : 1, flexDirection: esMovil ? 'row' : 'column', }}>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                            Número de Manilla
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.numero_manilla}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                            Edad
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.edad} Años</Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                            Género
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.genero_menor}</Typography>
                                    </Box>
                                </Box>

                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                    Documento del Menor
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                                    {detallePaciente.tipo_documento_menor} - {detallePaciente.numero_documento_menor}
                                </Typography>

                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                    Nacionalidad
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.nacionalidad_menor}</Typography>
                            </Box>

                            {/* Información del acompañante */}
                            <Box sx={{
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                p: 2,
                                borderRadius: '5px',
                            }}>
                                <Typography variant="h6" sx={{ fontSize: '1.3rem', fontWeight: 'bold', mt: 1 }}>
                                    Detalles del Acompañante
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', mt: 1 }}>
                                    Nombre
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{capitalizarPrimerLetra(detallePaciente.nombres_acompanante)}</Typography>

                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                    Documento
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                                    {detallePaciente.tipo_documento_acompanante} - {detallePaciente.numero_documento_acompanante}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: esMovil ? 10 : 1,
                                        flexDirection: esMovil ? 'row' : 'column',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                            Parentesco
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.parentesco}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                            Genero
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.genero_acompanante}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                            Nacionalidad
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.nacionalidad_acompanante}</Typography>
                                    </Box>
                                </Box>

                            </Box>
                            <Box sx={
                                {
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    p: 2,
                                    mt: 2,
                                    borderRadius: '5px',
                                }
                            }>
                                <Typography variant="h6" sx={{ fontSize: '1.3rem', fontWeight: 'bold', mt: 1, mb: 2 }}>
                                    Datos de ingreso y salida
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                    Puerta de entrada
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.entrada}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', mt: 1 }}>
                                    Fecha de ingreso
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{formatearFecha(new Date(detallePaciente.fecha_ingreso))}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                    Puerta de salida
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}>{detallePaciente.salida ? detallePaciente.salida : 'Sin registrar'}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.3rem', }}>
                                    Fecha de salida
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ mb: 2, fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.6)' }}
                                >
                                    {detallePaciente.fecha_salida
                                        ? formatearFecha(new Date(detallePaciente.fecha_salida))
                                        : 'Sin registrar'}
                                </Typography>



                            </Box>
                            {/* Botón para cerrar */}
                            <Box sx={{ mt: 3, textAlign: 'right' }}>
                                <Button variant="contained" color="secondary" onClick={handleCloseForm}>
                                    Cerrar
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>
        </div >
    )
}

export default ListadoMenores