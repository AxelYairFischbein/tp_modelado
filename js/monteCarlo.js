// ===================================================
// Método de Monte Carlo
// Integración numérica y aproximación de π
// Requiere: parseMathExpr (parser.js)
// ===================================================

// INTEGRACIÓN POR MONTE CARLO
function metodoMonteCarloIntegracion(fExpr, a, b, nMuestras) {
  const f = parseMathExpr(fExpr);

  if (a >= b) {
    return { error: true, message: 'a debe ser menor que b' };
  }
  if (nMuestras < 1) {
    return { error: true, message: 'nMuestras debe ser al menos 1' };
  }

  // Generar puntos aleatorios en el intervalo [a, b]
  const xAleatorios = [];
  const fValores = [];
  
  for (let i = 0; i < nMuestras; i++) {
    const x = a + Math.random() * (b - a);
    const fx = f(x);
    xAleatorios.push(x);
    fValores.push(fx);
  }

  // Calcular estadísticas
  const longitudIntervalo = b - a;
  const sumaF = fValores.reduce((sum, val) => sum + val, 0);
  const promedioF = sumaF / nMuestras;
  const integralEstimada = longitudIntervalo * promedioF;

  const fMin = Math.min(...fValores);
  const fMax = Math.max(...fValores);
  
  // Desviación estándar
  const varianza = fValores.reduce((sum, val) => sum + Math.pow(val - promedioF, 2), 0) / nMuestras;
  const desvStd = Math.sqrt(varianza);

  // Historial de muestras (primeras 10 y últimas 10)
  const historial = [];
  const muestrasAMostrar = Math.min(10, nMuestras);

  for (let i = 0; i < muestrasAMostrar; i++) {
    historial.push({
      muestra: i + 1,
      x: xAleatorios[i],
      fx: fValores[i]
    });
  }

  if (nMuestras > 20) {
    historial.push({
      muestra: '...',
      x: '...',
      fx: '...'
    });
  }

  for (let i = Math.max(muestrasAMostrar, nMuestras - muestrasAMostrar); i < nMuestras; i++) {
    historial.push({
      muestra: i + 1,
      x: xAleatorios[i],
      fx: fValores[i]
    });
  }

  return {
    error: false,
    integral: integralEstimada,
    nMuestras: nMuestras,
    intervalo: { a, b },
    longitudIntervalo: longitudIntervalo,
    historial: historial,
    estadisticas: {
      fMin: fMin,
      fMax: fMax,
      fPromedio: promedioF,
      desvStd: desvStd
    },
    columns: ['Muestra', 'x', 'f(x)'],
    getRow: (h) => [h.muestra, h.x.toFixed ? h.x.toFixed(6) : h.x, h.fx.toFixed ? h.fx.toFixed(6) : h.fx]
  };
}

// APROXIMACIÓN DE π USANDO MONTE CARLO
// Método: Círculo inscrito en cuadrado [0,1] x [0,1]
function aproximarPi(nPuntos) {
  if (nPuntos < 1) {
    return { error: true, message: 'nPuntos debe ser al menos 1' };
  }

  let puntosDestro = 0;

  // Generar puntos aleatorios y contar los que caen dentro del círculo
  for (let i = 0; i < nPuntos; i++) {
    const x = Math.random();
    const y = Math.random();
    const distancia = Math.sqrt(x * x + y * y);

    if (distancia <= 1) {
      puntosDestro++;
    }
  }

  // π ≈ 4 * (puntos_dentro / puntos_totales)
  const piAproximado = 4 * puntosDestro / nPuntos;
  const piReal = Math.PI;
  const error = Math.abs(piAproximado - piReal);
  const porcentajeError = (error / piReal) * 100;

  return {
    error: false,
    piAproximado: piAproximado,
    piReal: piReal,
    nPuntos: nPuntos,
    puntosDestro: puntosDestro,
    puntosAfuera: nPuntos - puntosDestro,
    razonDestro: puntosDestro / nPuntos,
    errorAbsoluto: error,
    errorPorcentaje: porcentajeError
  };
}

// MONTE CARLO MEJORADO CON MÁS INFORMACIÓN
function metodoMonteCarloCompleto(fExpr, a, b, nMuestras) {
  const resultado = metodoMonteCarloIntegracion(fExpr, a, b, nMuestras);
  
  if (resultado.error) {
    return resultado;
  }

  // Agregar información adicional
  resultado.metodologia = "Método de Monte Carlo para Integración Numérica";
  resultado.descripcion = "Genera puntos aleatorios en el intervalo [a,b], " +
                          "evalúa la función en esos puntos y estima la integral como " +
                          "longitud_intervalo × promedio_de_f(x)";
  
  return resultado;
}
