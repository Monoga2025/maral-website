'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [notice, setNotice] = useState('');
  return <form className="account-card" onSubmit={(event) => { event.preventDefault(); setNotice('Autenticación desconectada: no se inició sesión. La información no se envió ni se almacenó.'); }}>
    <p className="eyebrow">Demo local · acceso de clientes</p>
    <h1>Iniciar sesión</h1>
    <p>No hay autenticación real conectada. No envíes credenciales reales: este formulario solo muestra un aviso local.</p>
    <label>Número de cliente<input inputMode="numeric" autoComplete="off" required /></label>
    <label>Contraseña<input type="password" autoComplete="off" required /></label>
    <p>Si es tu primer ingreso, solicita tu contraseña a un representante de ventas.</p>
    <button className="button primary" type="submit">Continuar (sin autenticación)</button>
    <p className="form-notice" role="status" aria-live="polite">{notice}</p>
  </form>;
}
