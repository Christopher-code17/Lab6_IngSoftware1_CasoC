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