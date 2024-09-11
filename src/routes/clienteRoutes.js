const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { body, param, query } = require('express-validator');

// Validaciones para crear y actualizar cliente
const validarCliente = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio.')
    .matches(/^[A-Za-z\s]{3,100}$/).withMessage('El nombre debe contener solo letras y espacios, entre 3 y 100 caracteres.'),
  
  body('correo')
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('Debe ser un correo electrónico válido.'),
  
    //Formato ESPAÑA:
  body('telefono')
    .notEmpty().withMessage('El teléfono es obligatorio.')
    .matches(/^\+34-\d{3}-\d{3}-\d{3}$/).withMessage('El teléfono debe tener el formato +34-XXX-XXX-XXX.'),

  body('empresa')
    .optional()
    .isLength({ max: 100 }).withMessage('La empresa no debe exceder los 100 caracteres.'),
  
  body('pais')
    .notEmpty().withMessage('El país es obligatorio.')
    .isLength({ min: 2, max: 56 }).withMessage('Debe ser un país valido.'),
  
  body('fechaContacto')
    .notEmpty().withMessage('La fecha de contacto es obligatoria.')
    .isISO8601().withMessage('Debe ser una fecha válida.')
    .isBefore(new Date().toISOString()).withMessage('La fecha de contacto no puede ser futura.'),
  
  body('estadoCliente')
    .notEmpty().withMessage('El estado del cliente es obligatorio.')
    .isIn(['Nuevo', 'En negociación', 'Ganado', 'Perdido']).withMessage('El estado del cliente debe ser uno de los valores predefinidos.')
];

// Middleware para manejar errores de validación
const manejarErrores = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Crear cliente
router.post('/', validarCliente, manejarErrores, clienteController.crearCliente);

// Leer todos los clientes con filtros opcionales
router.get('/', [
  // Validaciones para los filtros
  query('estadoCliente').optional().isIn(['Nuevo', 'En negociación', 'Ganado', 'Perdido']).withMessage('Estado de cliente inválido.'),
  query('empresa').optional().isString(),
  query('fechaInicio').optional().isISO8601().withMessage('Fecha de inicio inválida.'),
  query('fechaFin').optional().isISO8601().withMessage('Fecha de fin inválida.')
], manejarErrores, clienteController.leerClientes);

// Leer un cliente específico por ID
router.get('/:id', [
  param('id').notEmpty().withMessage('El ID es obligatorio.')
], manejarErrores, clienteController.leerClientePorId);

// Actualizar un cliente por ID
router.put('/:id', [
  param('id').notEmpty().withMessage('El ID es obligatorio.'),
  ...validarCliente
], manejarErrores, clienteController.actualizarCliente);

// Eliminar un cliente por ID
router.delete('/:id', [
  param('id').notEmpty().withMessage('El ID es obligatorio.')
], manejarErrores, clienteController.eliminarCliente);

module.exports = router;
