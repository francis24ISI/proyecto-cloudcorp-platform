import React, { useState, useEffect } from 'react';
import { C, BACKUP_JOBS } from '../data/constants';

function BackupBar({ job }) {
  const [pct, setPct] = useState(job.pct);

  useEffect(() => {
    if (!job.animate) return;
    const interval = setInterval(() => {
      setPct(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return Math.min(100, prev + (job.slow ? 0.3 : 0.7));
      });
    }, 800);
    return () => clearInterval(interval);
  }, [job.animate, job.slow]);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 5,
      }}>
        <span style={{ fontSize: 12.5, fontWeight: 500, color: C.text }}>
          {job.name}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: C.text3 }}>
          {job.size} · {job.label}
        </span>
      </div>
      <div style={{
        height: 5, background: C.border,
        borderRadius: 99, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: job.color,
          borderRadius: 99,
          transition: 'width 0.7s ease',
        }} />
      </div>
    </div>
  );
}

export default function BackupJobs() {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700 }}>
          Jobs de Backup
          <span style={{
            background: C.awsGlow, border: '1px solid rgba(255,153,0,0.3)',
            color: C.aws, fontSize: 8, padding: '2px 8px', borderRadius: 99,
            fontFamily: 'monospace',
          }}>AWS Backup</span>
        </div>
        <span style={{ fontSize: 10, color: C.accent2, cursor: 'pointer', fontFamily: 'monospace' }}>
          Ver todos
        </span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {BACKUP_JOBS.map(job => <BackupBar key={job.name} job={job} />)}
      </div>
    </div>
  );
}
