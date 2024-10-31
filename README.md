# Lab6_y_Lab9_IngSoftware1_CasoC
Laboratorio 6 Caso "C" del curso de ingeniería de software I
# Laboratorio 9:
Se solicitaron 10 pruebas unitarias para el API (del laboratorio 6), utilizando como mínimo una en Mock. 
# Explicación: 
- Como el programa se encuentra corriendo con node.js se tomaron los frameworks Mocha y Chai.
- Para mocks  se utilizó sinon.
# Ejecución: 
- Para instalar las dependencias con este comando:
  
    npm install --save-dev mocha chai sinon sinon-chai
- Para correr las pruebas es: 

    npm test
# Justificación: 
- Utilizamos Mocha ya que es un framework para node.js y es ideal para la escritura e integración de pruebas unitarias.
- Chai se utilizó como biblioteca de aserciones el cual es un complemento de Mocha ya que nos da una sintáxis más amigable para realizar las pruebas.
- En el caso de Sinon nos sirve para la creación de mocks en JavaScript y para la simulación del comportamiento de las dependencias sin alterar el entorno real.
- Se escogió Sinon en lugar de Jest ya que Sinon es mejor para las pruebas de backend y es más flexible, en cambio, Jest es ideal para entornos de frontend el cual no es necesario de momento. 
