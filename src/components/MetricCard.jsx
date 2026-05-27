import React from 'react';
import { C } from '../data/constants';

const TOP_COLORS = [C.accent2, C.green, C.aws, C.purple];

export default function MetricCard({ metric, index }) {
  const { label, value, delta, up, icon } = metric;

  const deltaColor = up === true ? C.green : up === false ? C.red : C.text3;

  return (
    <div
      className="fade-up"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${TOP_COLORS[index]}, transparent)`,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'monospace', fontSize: 9,
          color: C.text3, textTransform: 'uppercase', letterSpacing: 1.5,
        }}>
          {label}
        </span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>

      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 28, fontWeight: 800, letterSpacing: -1,
        color: C.text, lineHeight: 1, marginBottom: 7,
      }}>
        {value}
      </div>

      <div style={{ fontFamily: 'monospace', fontSize: 11, color: deltaColor }}>
        {delta}
      </div>
    </div>
  );
}
