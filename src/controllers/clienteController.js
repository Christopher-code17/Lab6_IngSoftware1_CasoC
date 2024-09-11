const fs = require('fs');
const path = require('path');

const clientesFilePath = path.join(__dirname, '../data/clientes.json');

// Leer los clientes desde el archivo JSON
const leerClientesDesdeArchivo = () => {
  try {
    const datos = fs.readFileSync(clientesFilePath, 'utf8');
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error leyendo el archivo de clientes:', error);
    return [];
  }
};

// Escribir los clientes en el archivo JSON
const escribirClientesEnArchivo = (clientes) => {
  try {
    fs.writeFileSync(clientesFilePath, JSON.stringify(clientes, null, 2));
  } catch (error) {
    console.error('Error escribiendo en el archivo de clientes:', error);
  }
};

const { v4: uuidv4 } = require('uuid');
const { leerClientesDesdeArchivo, escribirClientesEnArchivo } = require('./ruta/del/archivo/anterior');

exports.crearCliente = (req, res) => {
  const { nombre, correo, telefono, empresa, pais, fechaContacto, estadoCliente } = req.body;

  if (!nombre || !correo || !telefono || !pais || !fechaContacto || !estadoCliente) {
    return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser proporcionados.' });
  }

  const clientes = leerClientesDesdeArchivo();

  const correoExistente = clientes.find(c => c.correo === correo);
  if (correoExistente) {
    return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
  }

  const nuevoCliente = {
    id: uuidv4(),
    nombre,
    correo,
    telefono,
    empresa: empresa || '',
    pais,
    fechaContacto,
    estadoCliente
  };

  clientes.push(nuevoCliente);
  escribirClientesEnArchivo(clientes);

  res.status(201).json({ mensaje: 'Cliente creado exitosamente.', cliente: nuevoCliente });
};

exports.leerClientePorId = (req, res) => {
  const clientes = leerClientesDesdeArchivo();
  const cliente = clientes.find(c => c.id === req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
  res.status(200).json(cliente);
};

exports.eliminarCliente = (req, res) => {
  const clientes = leerClientesDesdeArchivo();
  const clienteIndex = clientes.findIndex(c => c.id === req.params.id);
  if (clienteIndex === -1) return res.status(404).json({ mensaje: 'Cliente no encontrado.' });

  clientes.splice(clienteIndex, 1);
  escribirClientesEnArchivo(clientes);

  res.status(200).json({ mensaje: 'Cliente eliminado exitosamente.' });
};

exports.actualizarCliente = (req, res) => {
  const clientes = leerClientesDesdeArchivo();
  const clienteIndex = clientes.findIndex(c => c.id === req.params.id);
  if (clienteIndex === -1) return res.status(404).json({ mensaje: 'Cliente no encontrado.' });

  const { nombre, correo, telefono, empresa, pais, fechaContacto, estadoCliente } = req.body;

  if (correo && clientes.some(c => c.correo === correo && c.id !== req.params.id)) {
    return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado por otro cliente.' });
  }

  clientes[clienteIndex] = {
    ...clientes[clienteIndex],
    nombre: nombre || clientes[clienteIndex].nombre,
    correo: correo || clientes[clienteIndex].correo,
    telefono: telefono || clientes[clienteIndex].telefono,
    empresa: empresa !== undefined ? empresa : clientes[clienteIndex].empresa,
    pais: pais || clientes[clienteIndex].pais,
    fechaContacto: fechaContacto || clientes[clienteIndex].fechaContacto,
    estadoCliente: estadoCliente || clientes[clienteIndex].estadoCliente
  };

  escribirClientesEnArchivo(clientes);

  res.status(200).json({ mensaje: 'Cliente actualizado exitosamente.', cliente: clientes[clienteIndex] });
};

exports.leerClientes = (req, res) => {
  let clientes = leerClientesDesdeArchivo();
  
  const { estadoCliente, empresa, fechaInicio, fechaFin } = req.query;
  
  if (estadoCliente) {
    clientes = clientes.filter(c => c.estadoCliente === estadoCliente);
  }
  
  if (empresa) {
    clientes = clientes.filter(c => c.empresa.toLowerCase().includes(empresa.toLowerCase()));
  }
  
  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    clientes = clientes.filter(c => {
      const fecha = new Date(c.fechaContacto);
      return fecha >= inicio && fecha <= fin;
    });
  } else if (fechaInicio) {
    const inicio = new Date(fechaInicio);
    clientes = clientes.filter(c => {
      const fecha = new Date(c.fechaContacto);
      return fecha >= inicio;
    });
  } else if (fechaFin) {
    const fin = new Date(fechaFin);
    clientes = clientes.filter(c => {
      const fecha = new Date(c.fechaContacto);
      return fecha <= fin;
    });
  }

  res.status(200).json(clientes);
};