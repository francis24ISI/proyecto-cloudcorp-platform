import React from 'react';
import { C, STORAGE_ITEMS } from '../data/constants';

export default function StorageDonut() {
  const r = 52, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;

  const segments = STORAGE_ITEMS.filter(s => s.pct !== null);
  let offset = 0;

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
          Storage S3
        </span>
        <span style={{ fontSize: 10, color: C.accent2, cursor: 'pointer', fontFamily: 'monospace' }}>
          Detalle
        </span>
      </div>

      <div style={{
        padding: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* SVG Donut */}
        <svg width={140} height={140} viewBox="0 0 140 140">
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={r}
            fill="none" stroke={C.border} strokeWidth={14} />

          {/* Colored segments */}
          {segments.map((seg, i) => {
            const dashLen = seg.pct * circumference;
            const gapLen  = circumference - dashLen;
            const rotOffset = -(offset * circumference) + (circumference / 4);
            offset += seg.pct;
            return (
              <circle key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={14}
                strokeDasharray={`${dashLen} ${gapLen}`}
                strokeDashoffset={rotOffset}
                strokeLinecap="round"
              />
            );
          })}

          {/* Center text */}
          <text x={cx} y={cy - 6}
            textAnchor="middle" fill={C.text}
            fontSize={22} fontWeight={800} fontFamily="'Syne', sans-serif">
            75%
          </text>
          <text x={cx} y={cy + 12}
            textAnchor="middle" fill={C.text3}
            fontSize={10} fontFamily="monospace">
            usado
          </text>
        </svg>

        {/* Legend */}
        <div style={{ width: '100%', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {STORAGE_ITEMS.map(s => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', fontSize: 11.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.text2 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                {s.label}
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: C.text3 }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
