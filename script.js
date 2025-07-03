

document.addEventListener('DOMContentLoaded', () => {
  const pantalla = document.querySelector('.pantalla');
  let operacion = '';
  let resultadoMostrado = false;
  let modoPolaco = false;

  const botones = document.querySelectorAll('.btn');

  function calcularExpresion(expresion) {
    try {
      let expresionModificada = expresion
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/log/g, "Math.log10")
        .replace(/\^/g, "**");

      return new Function(`return ${expresionModificada}`)();
    } catch {
      return 'Error';
    }
  }

  function evaluarPolaca(expr) {
    if (!expr.trim()) return 'Error'; // Validar entrada vacía

    expr = corregirEspacios(expr); // Aplica la corrección automática de espacios
    const tokens = expr.split(/\s+/).reverse();
    const stack = [];

    for (const token of tokens) {
      if (!isNaN(token)) {
        stack.push(parseFloat(token)); // Agrega números a la pila
      } else {
        if (stack.length < 2) return 'Error'; // Verifica suficientes operandos

        const b = stack.pop();
        const a = stack.pop();

        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            stack.push(a / b);
            break;
          default:
            return 'Error'; // Manejo de operadores inválidos
        }
      }
    }

    return stack.length === 1 ? stack[0] : 'Error'; // Validar resultado
  }

  function corregirEspacios(expr) {
    return expr
      .replace(/([+\-*/()])/g, ' $1 ')  // Agrega espacios alrededor de operadores y paréntesis
      .replace(/\s+/g, ' ')             // Elimina múltiples espacios seguidos
      .trim();                           // Elimina espacios al inicio y final
  }

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const valor = boton.textContent;

      if (resultadoMostrado && /[0-9.]/.test(valor)) {
        operacion = '';
        resultadoMostrado = false;
      }

      if (/[+\-*/^()]/.test(valor)) {
        operacion += valor;
        pantalla.textContent = operacion;
      } else if (valor === 'C') {
        operacion = '';
        pantalla.textContent = modoPolaco ? 'Modo Polaco' : '0';
        resultadoMostrado = false;
      } else if (valor === '←') {
        operacion = operacion.slice(0, -1);
        pantalla.textContent = operacion || (modoPolaco ? 'Modo Polaco' : '0');
      } else if (valor === '=') {
        try {
          if (modoPolaco) {
            operacion = evaluarPolaca(operacion).toString();
          } else {
            operacion = calcularExpresion(operacion).toString();
          }
          pantalla.textContent = operacion.slice(0, 70);
          resultadoMostrado = true;
        } catch (error) {
          pantalla.textContent = 'Error';
          operacion = '';
        }
      } else if (["sin", "cos", "tan", "sqrt", "log"].includes(valor)) {
        operacion += ` ${valor}(`;
        pantalla.textContent = operacion;
      } else {
        operacion += valor;
        pantalla.textContent = operacion.slice(0, 70);
      }
    });
  });

  const btnModo = document.getElementById('modo');
  btnModo.addEventListener('click', () => {
    modoPolaco = !modoPolaco;
    btnModo.textContent = modoPolaco ? 'Modo: Polaco' : 'Modo: Normal';
    pantalla.textContent = modoPolaco ? 'Modo Polaco' : '0';
    operacion = '';
  });

  const btnAutoEspaciado = document.getElementById('autoEspaciado');
  btnAutoEspaciado.addEventListener('click', () => {
    operacion += ' '; // ✅ Agrega un espacio cada vez que se presiona el botón
    pantalla.innerText = operacion; // ✅ Actualiza la pantalla con la nueva expresión
    console.log("Expresión con espacio añadido:", operacion); // Para verificar en la consola
  });
});
