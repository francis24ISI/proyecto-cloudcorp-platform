import React from 'react';
import { C, ACTIVITY } from '../data/constants';

const TH = ['Usuario', 'Acción', 'Recurso AWS', 'Estado', 'Fecha & Hora'];

export default function ActivityTable() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{
        padding: '15px 20px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700 }}>
          Actividad Reciente de Empleados
        </span>
        <span style={{ fontSize: 10, color: C.accent2, cursor: 'pointer', fontFamily: 'monospace' }}>
          Ver historial completo
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {TH.map(h => (
                <th key={h} style={{
                  textAlign: 'left',
                  fontFamily: 'monospace', fontSize: 9,
                  textTransform: 'uppercase', letterSpacing: 1.5,
                  color: C.text3, padding: '10px 18px',
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIVITY.map(row => (
              <tr key={row.name} style={{ borderBottom: `1px solid ${C.border}` }}>
                {/* Usuario */}
                <td style={{ padding: '10px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${row.grad[0]}, ${row.grad[1]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                    }}>
                      {row.initials}
                    </div>
                    <span style={{ fontSize: 12.5 }}>{row.name}</span>
                  </div>
                </td>

                {/* Acción */}
                <td style={{ padding: '10px 18px', fontSize: 12, color: C.text2 }}>
                  {row.action}
                </td>

                {/* Recurso AWS */}
                <td style={{ padding: '10px 18px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: C.aws }}>
                    {row.resource}
                  </span>
                </td>

                {/* Estado */}
                <td style={{ padding: '10px 18px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 10px', borderRadius: 99,
                    fontSize: 10, fontFamily: 'monospace',
                    background: `${row.sColor}22`,
                    color: row.sColor,
                    border: `1px solid ${row.sColor}44`,
                  }}>
                    {row.status}
                  </span>
                </td>

                {/* Tiempo */}
                <td style={{
                  padding: '10px 18px',
                  fontFamily: 'monospace', fontSize: 10, color: C.text3,
                }}>
                  {row.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
