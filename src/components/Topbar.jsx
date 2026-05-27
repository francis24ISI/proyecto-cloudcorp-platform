import React from 'react';
import { C } from '../data/constants';

export default function Topbar({ active }) {
  return (
    <header style={{
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      height: 56,
      display: 'flex', alignItems: 'center',
      gap: 14, padding: '0 24px',
      flexShrink: 0,
    }}>

      {/* Breadcrumb */}
      <div style={{
        flex: 1, fontFamily: 'monospace',
        fontSize: 10, color: C.text3,
      }}>
        CloudCorp / <span style={{ color: C.accent2 }}>{active}</span> / Resumen General
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: C.bg,
        border: `1px solid ${C.border2}`,
        borderRadius: 8, padding: '7px 12px', width: 230,
      }}>
        <span style={{ color: C.text3, fontSize: 13 }}>🔍</span>
        <input
          type="text"
          placeholder="Buscar recursos, backups..."
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: C.text, fontSize: 12, fontFamily: 'monospace',
            width: '100%',
          }}
        />
      </div>

      {/* Icon buttons */}
      {['🌙', '🔔', '⚙'].map(icon => (
        <div
          key={icon}
          style={{
            width: 34, height: 34, borderRadius: 8,
            border: `1px solid ${C.border2}`,
            background: C.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: C.text2, cursor: 'pointer',
            position: 'relative', transition: 'border-color 0.15s',
          }}
        >
          {icon}
          {icon === '🔔' && (
            <span style={{
              position: 'absolute', top: 5, right: 5,
              width: 6, height: 6,
              background: C.red, borderRadius: '50%',
              border: `1.5px solid ${C.surface}`,
            }} />
          )}
        </div>
      ))}
    </header>
  );
}
