import React from 'react';
import { C, CHART_DAYS, CHART_CONTRATOS, CHART_RENOV } from '../data/constants';

const MAX = Math.max(...CHART_CONTRATOS);

export default function BarChart() {
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
          Actividad Comercial
        </span>
        <span style={{ fontSize: 10, color: C.accent2, fontFamily: 'monospace' }}>
          Últimas 2 semanas
        </span>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Bars */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          gap: 5, height: 110,
        }}>
          {CHART_DAYS.map((day, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
              height: '100%', justifyContent: 'flex-end',
            }}>
              <div style={{
                width: '100%',
                height: `${(CHART_CONTRATOS[i] / MAX) * 100}%`,
                background: C.accent, opacity: 0.85,
                borderRadius: '3px 3px 0 0',
              }} />
              <div style={{
                width: '100%',
                height: `${(CHART_RENOV[i] / MAX) * 100}%`,
                background: C.green, opacity: 0.65,
                borderRadius: '3px 3px 0 0',
              }} />
              <div style={{
                fontFamily: 'monospace', fontSize: 8,
                color: C.text3, marginTop: 3,
              }}>
                {day}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: 16,
          marginTop: 12, paddingTop: 12,
          borderTop: `1px solid ${C.border}`,
        }}>
          {[
            { color: C.accent,  label: 'Contratos'   },
            { color: C.green,   label: 'Renovaciones' },
          ].map(({ color, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: C.text2,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
