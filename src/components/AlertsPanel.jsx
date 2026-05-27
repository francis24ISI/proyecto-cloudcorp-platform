import React from 'react';
import { C, ALERTS } from '../data/constants';

export default function AlertsPanel() {
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
          Alertas & Eventos
        </span>
        <span style={{ fontSize: 10, color: C.accent2, cursor: 'pointer', fontFamily: 'monospace' }}>
          Marcar todo
        </span>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {ALERTS.map(a => (
          <div key={a.title} style={{
            display: 'flex', gap: 10,
            padding: '10px 13px',
            borderRadius: 9,
            background: C.bg,
            border: `1px solid ${a.border}`,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>{a.icon}</span>
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 3,
              }}>
                {a.title}
              </div>
              <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.45 }}>
                {a.msg}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: C.text3, marginTop: 5 }}>
                {a.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
