import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck } from 'lucide-react';

export const MockVietQRCard = ({
  bookingCode,
  pitchName,
  amount,
  customerPhone,
  bankName = 'MB Bank (Ngân hàng TMCP Quân Đội)',
  accountNumber = '8888 2468 9999',
  accountHolder = 'HE THONG SAN BONG PITCHCONNECT',
}) => {
  const [copiedKey, setCopiedKey] = useState(null);

  const cleanPhone = customerPhone?.replace(/\D/g, '').slice(-9) || '908123456';
  const transferContent = `DATSAN ${bookingCode} ${cleanPhone}`;

  // Định dạng tiền tệ VND chuẩn JS thay cho formatVND
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="pitch-vietqr-container">
      {/* Header VietQR Brand & Napas */}
      <div className="pitch-vietqr-header">
        <div className="pitch-vietqr-brand">
          <span className="pitch-vietqr-badge">VietQR</span>
          <span className="pitch-napas-badge">NAPAS 247</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600 }}>
          <ShieldCheck style={{ width: 14, height: 14 }} />
          <span>Thanh toán an toàn</span>
        </div>
      </div>

      {/* Realistic Vector QR Code */}
      <div className="pitch-vietqr-image-wrapper">
        <svg
          viewBox="0 0 200 200"
          width="150"
          height="150"
          className="rounded-lg shadow-sm"
          style={{ background: '#ffffff', maxWidth: '100%', height: 'auto' }}
        >
          {/* Background */}
          <rect width="200" height="200" fill="#ffffff" rx="8" />

          {/* Top-Left Finder Pattern */}
          <rect x="15" y="15" width="45" height="45" rx="6" fill="#111827" />
          <rect x="22" y="22" width="31" height="31" rx="4" fill="#ffffff" />
          <rect x="28" y="28" width="19" height="19" rx="3" fill="#004b91" />

          {/* Top-Right Finder Pattern */}
          <rect x="140" y="15" width="45" height="45" rx="6" fill="#111827" />
          <rect x="147" y="22" width="31" height="31" rx="4" fill="#ffffff" />
          <rect x="153" y="28" width="19" height="19" rx="3" fill="#004b91" />

          {/* Bottom-Left Finder Pattern */}
          <rect x="15" y="140" width="45" height="45" rx="6" fill="#111827" />
          <rect x="22" y="147" width="31" height="31" rx="4" fill="#ffffff" />
          <rect x="28" y="153" width="19" height="19" rx="3" fill="#004b91" />

          {/* Alignment Pattern bottom right */}
          <rect x="145" y="145" width="25" height="25" rx="3" fill="#111827" />
          <rect x="150" y="150" width="15" height="15" rx="2" fill="#ffffff" />
          <rect x="154" y="154" width="7" height="7" rx="1" fill="#004b91" />

          {/* Data Modules (simulated high density matrix) */}
          <g fill="#1f2937">
            {/* Top row bars */}
            <rect x="68" y="16" width="6" height="6" rx="1" />
            <rect x="78" y="16" width="6" height="6" rx="1" />
            <rect x="96" y="16" width="6" height="6" rx="1" />
            <rect x="106" y="16" width="14" height="6" rx="1" />
            <rect x="126" y="16" width="6" height="6" rx="1" />

            <rect x="68" y="26" width="14" height="6" rx="1" />
            <rect x="90" y="26" width="8" height="6" rx="1" />
            <rect x="104" y="26" width="6" height="6" rx="1" />
            <rect x="116" y="26" width="14" height="6" rx="1" />

            <rect x="74" y="36" width="6" height="6" rx="1" />
            <rect x="86" y="36" width="12" height="6" rx="1" />
            <rect x="110" y="36" width="8" height="6" rx="1" />
            <rect x="124" y="36" width="10" height="6" rx="1" />

            <rect x="68" y="46" width="8" height="6" rx="1" />
            <rect x="82" y="46" width="16" height="6" rx="1" />
            <rect x="104" y="46" width="8" height="6" rx="1" />
            <rect x="120" y="46" width="12" height="6" rx="1" />

            <rect x="72" y="56" width="14" height="6" rx="1" />
            <rect x="94" y="56" width="10" height="6" rx="1" />
            <rect x="112" y="56" width="18" height="6" rx="1" />

            {/* Left-middle area */}
            <rect x="16" y="68" width="6" height="12" rx="1" />
            <rect x="28" y="68" width="12" height="6" rx="1" />
            <rect x="46" y="68" width="8" height="6" rx="1" />
            <rect x="16" y="86" width="14" height="6" rx="1" />
            <rect x="36" y="86" width="8" height="6" rx="1" />
            <rect x="50" y="86" width="10" height="6" rx="1" />

            <rect x="22" y="98" width="12" height="6" rx="1" />
            <rect x="40" y="98" width="8" height="6" rx="1" />
            <rect x="54" y="98" width="6" height="6" rx="1" />

            <rect x="16" y="110" width="8" height="6" rx="1" />
            <rect x="30" y="110" width="14" height="6" rx="1" />
            <rect x="50" y="110" width="10" height="6" rx="1" />

            <rect x="22" y="122" width="14" height="6" rx="1" />
            <rect x="42" y="122" width="18" height="6" rx="1" />

            {/* Right-middle area */}
            <rect x="140" y="68" width="8" height="6" rx="1" />
            <rect x="154" y="68" width="14" height="6" rx="1" />
            <rect x="174" y="68" width="10" height="6" rx="1" />
            <rect x="146" y="80" width="18" height="6" rx="1" />
            <rect x="170" y="80" width="12" height="6" rx="1" />
            <rect x="140" y="92" width="12" height="6" rx="1" />
            <rect x="160" y="92" width="14" height="6" rx="1" />
            <rect x="180" y="92" width="6" height="6" rx="1" />
            <rect x="144" y="104" width="8" height="6" rx="1" />
            <rect x="158" y="104" width="22" height="6" rx="1" />
            <rect x="140" y="116" width="16" height="6" rx="1" />
            <rect x="162" y="116" width="12" height="6" rx="1" />
            <rect x="180" y="116" width="6" height="6" rx="1" />
            <rect x="146" y="128" width="10" height="6" rx="1" />
            <rect x="162" y="128" width="20" height="6" rx="1" />

            {/* Bottom-middle area */}
            <rect x="68" y="140" width="12" height="6" rx="1" />
            <rect x="86" y="140" width="18" height="6" rx="1" />
            <rect x="110" y="140" width="12" height="6" rx="1" />
            <rect x="128" y="140" width="10" height="6" rx="1" />

            <rect x="72" y="152" width="8" height="6" rx="1" />
            <rect x="86" y="152" width="14" height="6" rx="1" />
            <rect x="106" y="152" width="8" height="6" rx="1" />
            <rect x="120" y="152" width="16" height="6" rx="1" />

            <rect x="68" y="164" width="16" height="6" rx="1" />
            <rect x="90" y="164" width="10" height="6" rx="1" />
            <rect x="108" y="164" width="16" height="6" rx="1" />
            <rect x="130" y="164" width="8" height="6" rx="1" />

            <rect x="74" y="176" width="10" height="6" rx="1" />
            <rect x="90" y="176" width="22" height="6" rx="1" />
            <rect x="118" y="176" width="12" height="6" rx="1" />
            <rect x="176" y="176" width="10" height="6" rx="1" />
          </g>

          {/* Central Logo Box */}
          <rect x="78" y="78" width="44" height="44" rx="8" fill="#ffffff" stroke="#004b91" strokeWidth="2" />
          <circle cx="100" cy="100" r="16" fill="#164BFF" />
          {/* Soccer ball stylized white lines */}
          <circle cx="100" cy="100" r="8" fill="#80FF72" />
          <polygon points="100,94 105,97 103,103 97,103 95,97" fill="#180832" />
        </svg>

        <div className="pitch-vietqr-scan-hint">
          <QrCode style={{ width: 13, height: 13, color: '#004b91' }} />
          <span>Quét mã bằng ứng dụng Ngân hàng</span>
        </div>
      </div>

      {/* Account Info Detail Strip */}
      <div className="pitch-vietqr-details">
        {/* Bank Name */}
        <div className="pitch-qr-row">
          <span className="pitch-qr-row-label">Ngân hàng</span>
          <div className="pitch-qr-row-content">
            <span style={{ color: '#004b91', fontWeight: 700 }}>MB Bank</span>
            <span style={{ fontSize: '0.625rem', color: '#6b7280' }}>(Quân Đội)</span>
          </div>
        </div>

        {/* Account Number */}
        <div className="pitch-qr-row">
          <span className="pitch-qr-row-label">Số tài khoản</span>
          <div className="pitch-qr-row-content">
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.025em' }}>{accountNumber}</span>
            <button
              type="button"
              onClick={() => handleCopy(accountNumber.replace(/\s+/g, ''), 'acc')}
              className={`pitch-copy-btn ${copiedKey === 'acc' ? 'copied' : ''}`}
              title="Sao chép số tài khoản"
            >
              {copiedKey === 'acc' ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
              <span>{copiedKey === 'acc' ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>
        </div>

        {/* Account Holder Name */}
        <div className="pitch-qr-row">
          <span className="pitch-qr-row-label">Chủ tài khoản</span>
          <div className="pitch-qr-row-content" style={{ fontSize: '0.6875rem' }}>
            <span>{accountHolder}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="pitch-qr-row" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <span className="pitch-qr-row-label" style={{ color: '#166534', fontWeight: 600 }}>Số tiền</span>
          <div className="pitch-qr-row-content">
            <span style={{ fontFamily: 'var(--font-mono)', color: '#15803d', fontWeight: 800 }}>
              {formattedAmount}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(amount?.toString() || '0', 'amount')}
              className={`pitch-copy-btn ${copiedKey === 'amount' ? 'copied' : ''}`}
              title="Sao chép số tiền"
            >
              {copiedKey === 'amount' ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
              <span>{copiedKey === 'amount' ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>
        </div>

        {/* Transfer Memo */}
        <div className="pitch-qr-row" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
          <span className="pitch-qr-row-label" style={{ color: '#1e40af', fontWeight: 600 }}>Nội dung CK</span>
          <div className="pitch-qr-row-content">
            <span style={{ fontFamily: 'var(--font-mono)', color: '#1e3a8a', fontWeight: 700, fontSize: '0.6875rem' }}>
              {transferContent}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(transferContent, 'memo')}
              className={`pitch-copy-btn ${copiedKey === 'memo' ? 'copied' : ''}`}
              title="Sao chép nội dung chuyển khoản"
            >
              {copiedKey === 'memo' ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
              <span>{copiedKey === 'memo' ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};