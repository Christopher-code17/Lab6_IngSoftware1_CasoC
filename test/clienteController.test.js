import { expect } from 'chai';
import sinon from 'sinon';
import { clienteController } from '../src/controllers/clienteController.js';

describe('Pruebas unitarias para clienteController', () => {

  afterEach(() => {
    sinon.restore();
  });

  // 1. Creacin fallida por nombre demasiado corto
  it('debería devolver error si el nombre tiene menos de 3 caracteres', () => {
    const req = {
      body: {
        nombre: "EA",
        correo: "test@gmail.com",
        telefono: "+34-123-456-789",
        pais: "España",
        fechaContacto: "2023-09-15",
        estadoCliente: "Nuevo"
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.crearCliente(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/El nombre debe tener al menos 3 caracteres/)))).to.be.true;
  });

  // 2. Creacion fallida por fecha de contacto en el futuro
  it('debería devolver error si la fecha de contacto es futura', () => {
    const req = {
      body: {
        nombre: "Erwin Andres Lima",
        correo: "ErwinLimAndres@gmail.com",
        telefono: "+34-123-456-780",
        pais: "Guatemala",
        fechaContacto: "2025-09-15",
        estadoCliente: "En negociación"
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.crearCliente(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/La fecha de contacto no puede ser futura/)))).to.be.true;
  });

  // 3. Creacion fallida por telefono con formato incorrecto
  it('debería devolver error si el teléfono no tiene el formato correcto', () => {
    const req = {
      body: {
        nombre: "Carlos Barrientos",
        correo: "carlos@correo.com",
        telefono: "+34-490-9875-50",
        pais: "Guatemala",
        fechaContacto: "2024-09-14",
        estadoCliente: "Nuevo"
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.crearCliente(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/El teléfono debe tener el formato \+34-XXX-XXX-XXX/)))).to.be.true;
  });

  // 4. Creación fallida si el correo ya esta registrado
  it('debería devolver error si el correo electrónico ya está registrado', () => {
    sinon.stub(clienteController, 'leerClientesDesdeArchivo').returns([
      { correo: "test@gmail.com" }
    ]);

    const req = {
      body: {
        nombre: "Carlos Coronado",
        correo: "test@gmail.com",
        telefono: "+34-123-456-789",
        pais: "España",
        fechaContacto: "2023-09-15",
        estadoCliente: "Nuevo"
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.crearCliente(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/El correo electrónico ya está registrado/)))).to.be.true;
  });

  // 5. Creación fallida si falta el campo obligatorio pais
  it('debería devolver error si falta el campo obligatorio pais', () => {
    const req = {
      body: {
        nombre: "Carlos",
        correo: "CarlosBarr@gmail.com",
        telefono: "+34-123-456-789",
        fechaContacto: "2023-09-15",
        estadoCliente: "Nuevo"
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.crearCliente(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/El país es obligatorio/)))).to.be.true;
  });

  // 6. Creacion exitosa de un cliente con todos los campos validos
  it('debería crear un cliente exitosamente si todos los campos son válidos', () => {
    sinon.stub(clienteController, 'leerClientesDesdeArchivo').returns([]);
    sinon.stub(clienteController, 'escribirClientesEnArchivo').returns();

    const req = {
      body: {
        nombre: "Nicolas Avila",
        correo: "NicoAv@gmail.com",
        telefono: "+34-342-456-789",
        empresa: "Universidad del Valle",
        pais: "España",
        fechaContacto: "2023-08-15",
        estadoCliente: "Nuevo"
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.crearCliente(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/Cliente creado exitosamente/)))).to.be.true;
  });

  // 7. Lectura fallida de cliente por ID inexistente
  it('debería devolver error 404 si el cliente con el ID proporcionado no existe', () => {
    sinon.stub(clienteController, 'leerClientesDesdeArchivo').returns([]);

    const req = { params: { id: 'inexistente-id' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.leerClientePorId(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/Cliente no encontrado/)))).to.be.true;
  });

  // 8. Lectura exitosa de cliente por id válido
  it('debería devolver el cliente correctamente si el ID es válido', () => {
    const cliente = { id: 'valido-id', nombre: 'Juan' };
    sinon.stub(clienteController, 'leerClientesDesdeArchivo').returns([cliente]);

    const req = { params: { id: 'valido-id' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.leerClientePorId(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(cliente)).to.be.true;
  });

  // 9. Actualizacion fallida si el correo ya existe en otro cliente
  it('debería devolver error si el correo que se intenta actualizar ya existe en otro cliente', () => {
    sinon.stub(clienteController, 'leerClientesDesdeArchivo').returns([
      { id: 'otro-id', correo: 'NicoAv@gmail.com' }  // Cliente con el correo que ya existe
    ]);

    const req = {
      params: { id: 'cliente-id' },
      body: { correo: 'NicoAv@gmail.com' }  // Mismo correo para el nuevo cliente
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.actualizarCliente(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/El correo electrónico ya está registrado por otro cliente/)))).to.be.true;
  });

  // 10. Eliminación exitosa de cliente por id valido
  it('debería eliminar un cliente exitosamente si el ID es válido', () => {
    sinon.stub(clienteController, 'leerClientesDesdeArchivo').returns([{ id: 'cliente-id' }]);
    sinon.stub(clienteController, 'escribirClientesEnArchivo').returns();

    const req = { params: { id: 'cliente-id' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    clienteController.eliminarCliente(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(sinon.match.has("mensaje", sinon.match(/Cliente eliminado exitosamente/)))).to.be.true;
  });
});
