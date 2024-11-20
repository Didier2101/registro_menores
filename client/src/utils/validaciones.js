export const validarCampos = (paciente, step) => {
  // Validaciones generales según el paso del formulario
  switch (step) {
    case 0: // Validaciones para los datos del menor
      return validarDatosMenor(paciente);

    case 1: // Validaciones para los datos del acompañante
      return validarDatosAcompanante(paciente);

    case 2: // Validaciones para los detalles de ingreso
      return validarDetallesIngreso(paciente);

    default:
      return { esValido: false, errores: ["Paso inválido"] };
  }
};

const validarDatosMenor = (paciente) => {
  const errores = [];

  if (!paciente.nombre_menor || !esTexto(paciente.nombre_menor)) {
    errores.push("El nombre del menor es obligatorio y debe ser texto.");
  }
  if (!paciente.apellidos_menor || !esTexto(paciente.apellidos_menor)) {
    errores.push("Los apellidos del menor son obligatorios y deben ser texto.");
  }
  if (!paciente.numero_manilla || !esNumero(paciente.numero_manilla)) {
    errores.push("El número de manilla es obligatorio y debe ser un número.");
  }
  if (!paciente.edad || !esNumero(paciente.edad)) {
    errores.push("La edad es obligatoria y debe ser un número.");
  }
  if (!paciente.genero_menor) {
    errores.push("El género del menor es obligatorio.");
  }
  if (!paciente.tipo_documento_menor) {
    errores.push("El tipo de documento del menor es obligatorio.");
  }
  if (
    !paciente.numero_documento_menor ||
    !esNumero(paciente.numero_documento_menor)
  ) {
    errores.push(
      "El número de documento del menor es obligatorio y debe ser un número."
    );
  }
  if (!paciente.nacionalidad_menor) {
    errores.push("La nacionalidad del menor es obligatoria.");
  }

  return { esValido: errores.length === 0, errores };
};

const validarDatosAcompanante = (paciente) => {
  const errores = [];

  if (!paciente.nombres_acompanante || !esTexto(paciente.nombres_acompanante)) {
    errores.push(
      "Los nombres del acompañante son obligatorios y deben ser texto."
    );
  }
  if (!paciente.tipo_documento_acompanante) {
    errores.push("El tipo de documento del acompañante es obligatorio.");
  }
  if (
    !paciente.numero_documento_acompanante ||
    !esNumero(paciente.numero_documento_acompanante)
  ) {
    errores.push(
      "El número de documento del acompañante es obligatorio y debe ser un número."
    );
  }
  if (!paciente.parentesco) {
    errores.push("El parentesco con el menor es obligatorio.");
  }
  if (!paciente.genero_acompanante) {
    errores.push("El género del acompañante es obligatorio.");
  }
  if (!paciente.nacionalidad_acompanante) {
    errores.push("La nacionalidad del acompañante es obligatoria.");
  }

  return { esValido: errores.length === 0, errores };
};

const validarDetallesIngreso = (paciente) => {
  const errores = [];

  if (!paciente.entrada) {
    errores.push("La puerta de entrada es obligatoria.");
  }

  return { esValido: errores.length === 0, errores };
};

// Validadores auxiliares
const esTexto = (valor) => /^[a-zA-Z\s]+$/.test(valor);
const esNumero = (valor) => /^[0-9]+$/.test(valor);
