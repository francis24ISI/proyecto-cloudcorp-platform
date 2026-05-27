import React, { useState, useEffect } from 'react';
import { C, AWS_SERVICES } from '../data/constants';

function BlinkDot({ color }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7,
      borderRadius: '50%', background: color,
      opacity: on ? 1 : 0.2, transition: 'opacity 0.4s',
    }} />
  );
}

function ServiceCard({ s }) {
  const [hov, setHov] = useState(false);
  const statusColor = s.status === 'ok' ? C.green : C.yellow;
  const statusText  = s.status === 'ok' ? 'Operativo' : '2 alertas';

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   hov ? 'rgba(255,153,0,0.04)' : C.bg,
        border:       `1px solid ${hov ? 'rgba(255,153,0,0.4)' : C.border}`,
        borderRadius: 10,
        padding:      '13px 14px',
        cursor:       'pointer',
        transition:   'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: C.awsGlow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>
          {s.icon}
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: C.aws, fontWeight: 600 }}>
          {s.name}
        </span>
      </div>
      <div style={{ fontSize: 11, color: C.text3, lineHeight: 1.45, marginBottom: 8 }}>
        {s.desc}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <BlinkDot color={statusColor} />
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: statusColor }}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

export default function AwsServices() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700 }}>
          Servicios AWS Activos
          <span style={{
            background: C.awsGlow, border: '1px solid rgba(255,153,0,0.3)',
            color: C.aws, fontSize: 8, padding: '2px 8px', borderRadius: 99,
            fontFamily: 'monospace',
          }}>AWS</span>
          <span style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            color: C.green, fontSize: 8, padding: '2px 8px', borderRadius: 99,
            fontFamily: 'monospace',
          }}>LIVE</span>
        </div>
        <span style={{ fontSize: 10, color: C.accent2, cursor: 'pointer', fontFamily: 'monospace' }}>
          Ver consola →
        </span>
      </div>

      {/* Grid */}
      <div style={{
        padding: 16,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {AWS_SERVICES.map(s => <ServiceCard key={s.name} s={s} />)}
      </div>
    </div>
  );
}
