'use client';
import { useState } from 'react';

const segments = ['Videovigilancia', 'Alarmas', 'Radiocomunicación', 'Redes', 'Control de Acceso', 'Energía Solar'];
export default function DistributionRegistrationForm() {
  const [notice, setNotice] = useState('');
  return <form className="account-card" onSubmit={(event) => { event.preventDefault(); setNotice('Aviso: el pre-registro no fue enviado ni almacenado. Esta demostración local no contacta a SYSCOM.'); }}>
    <p className="eyebrow">Distribución · demostración local</p>
    <h1>Pre-registro para distribución</h1>
    <p>SYSCOM vende a integradores e instaladores. Selecciona tus áreas de interés para un pre-registro de demostración.</p>
    <p>Demostración local únicamente. No se envían ni almacenan datos o documentos, ni se contacta a ningún servicio.</p>
    <label>Razón social / nombre comercial<input autoComplete="off" required /></label>
    <label>NIT<input autoComplete="off" /></label>
    <label>Nombre del contacto<input autoComplete="off" required /></label>
    <label>Correo del contacto<input type="email" autoComplete="off" required /></label>
    <label>Teléfono de contacto<input type="tel" autoComplete="off" /></label>
    <label>Teléfono adicional<input type="tel" autoComplete="off" /></label>
    <label>Dirección comercial<input autoComplete="off" /></label>
    <label>Departamento<input autoComplete="off" /></label>
    <label>Ciudad<input autoComplete="off" /></label>
    <fieldset className="segment-options"><legend>Segmentos de interés</legend>{segments.map((segment) => <label key={segment}><input type="checkbox" name="segments" value={segment} />{segment}</label>)}</fieldset>
    <label>Régimen tributario<select defaultValue=""><option value="">Seleccionar</option><option>Responsable de IVA</option><option>No responsable de IVA</option><option>Régimen Simple de Tributación</option></select></label>
    <fieldset className="segment-options"><legend>Retenciones aplicables</legend>{['Retención en la fuente', 'Retención de IVA (ReteIVA)', 'Retención de ICA (ReteICA)', 'No aplica'].map((option) => <label key={option}><input type="checkbox" name="retenciones" value={option} />{option}</label>)}</fieldset>
    <label>Documentos de soporte (no se cargarán)<input type="file" multiple disabled aria-describedby="document-notice" /></label>
    <small id="document-notice">La carga de archivos está deshabilitada en esta demostración.</small>
    <button className="button primary" type="submit">Enviar pre-registro (demostración local)</button>
    <p className="form-notice" role="status" aria-live="polite">{notice}</p>
  </form>;
}
