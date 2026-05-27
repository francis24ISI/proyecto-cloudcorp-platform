import React, { useState, useEffect } from 'react';
import { C, NAV_SECTIONS } from '../data/constants';

function BlinkDot({ color = C.green }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      width: 7, height: 7,
      borderRadius: '50%',
      background: color,
      opacity: on ? 1 : 0.2,
      transition: 'opacity 0.4s',
      flexShrink: 0,
    }} />
  );
}

export default function Sidebar({ active, onSelect }) {
  return (
    <aside style={{
      width: 248,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      overflow: 'hidden',
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: '20px 16px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
          <div style={{
            width: 36, height: 36,
            background: `linear-gradient(135deg, ${C.accent}, #1d4ed8)`,
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            boxShadow: `0 0 20px ${C.accentGlow}`,
          }}>☁</div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18, fontWeight: 800, letterSpacing: -0.5,
            color: C.text,
          }}>
            Cloud<span style={{ color: C.accent2 }}>Corp</span>
          </div>
        </div>
        <div style={{
          fontFamily: 'monospace', fontSize: 9,
          color: C.text3, textTransform: 'uppercase',
          letterSpacing: 2, paddingLeft: 46,
        }}>
          Gestión & Backup B2E
        </div>

        {/* AWS Badge */}
        <div style={{
          marginTop: 12,
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,153,0,0.08)',
          border: '1px solid rgba(255,153,0,0.22)',
          borderRadius: 7,
          padding: '6px 10px',
        }}>
          <BlinkDot color={C.green} />
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: C.aws }}>
            AWS Connected · us-east-1
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
        {NAV_SECTIONS.map(sec => (
          <div key={sec.section} style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 8,
              color: C.text3, textTransform: 'uppercase',
              letterSpacing: 2, padding: '0 8px', marginBottom: 5,
            }}>
              {sec.section}
            </div>

            {sec.items.map(item => {
              const isActive = item.label === active;
              return (
                <div
                  key={item.label}
                  onClick={() => onSelect(item.label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    marginBottom: 2,
                    background: isActive ? 'rgba(37,99,235,0.15)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(37,99,235,0.28)'
                      : '1px solid transparent',
                    color: isActive ? C.accent2 : C.text2,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1 }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span style={{
                      background: item.badgeColor,
                      color: '#fff',
                      fontSize: 9,
                      fontFamily: 'monospace',
                      padding: '1px 7px',
                      borderRadius: 99,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── User ── */}
      <div style={{
        padding: '13px 15px',
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}>JC</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 12.5, fontWeight: 700,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>Juan C. Rivera</div>
          <div style={{ fontSize: 9, color: C.text3, fontFamily: 'monospace' }}>
            Admin · IT Corporativo
          </div>
        </div>
        <span style={{ fontSize: 16, color: C.text3, cursor: 'pointer' }}>⚙</span>
      </div>
    </aside>
  );
}
