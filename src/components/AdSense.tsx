'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export function AdSense({ 
  format = 'auto', 
  style, 
  className = 'my-6' 
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, []);

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-9027732959517119"
        data-ad-slot="1234567890"
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
