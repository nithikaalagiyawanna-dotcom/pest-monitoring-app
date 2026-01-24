
'use client';
import { useState } from 'react';

export default function PinPad() {
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState<string|undefined>();

  async function submit() {
    setMsg(undefined);
    const r = await fetch('/api/login', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ pin })
    });
    const j = await r.json();
    if (!r.ok) setMsg(j.error || 'Login failed');
    else window.location.href = '/inspect';
  }

  return (
    <div style={{maxWidth:280}}>
      <h3>Enter 4‑digit PIN</h3>
      <input
        inputMode="numeric" maxLength={4}
        value={pin}
        onChange={e=>setPin(e.target.value.replace(/\D/g,''))}
        style={{fontSize:24, letterSpacing:4, padding:'6px 8px'}}
      />
      <div style={{marginTop:12}}>
        <button onClick={submit} disabled={pin.length!==4}>Login</button>
      </div>
      {msg && <p style={{color:'crimson'}}>{msg}</p>}
    </div>
  );
}
