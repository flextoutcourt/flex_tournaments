// app/tournament/[id]/live/components/ConfettiEffect.tsx
import React from 'react';

const ConfettiEffect: React.FC = () => {
  return (
    <>
      <div className="confetti-container fixed inset-0 pointer-events-none z-50">
        {[...Array(150)].map((_, i) => (
          <div key={i} className="confetti" style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: `hsl(${Math.random() * 360}, 80%, 70%)`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            opacity: Math.random() * 0.5 + 0.5,
            transform: `scale(${0.7 + Math.random() * 0.6}) rotate(${Math.random() * 720 - 360}deg)`
          }}></div>
        ))}
      </div>
      {/* Les styles globaux pour les confettis sont maintenant dans le page.tsx ou un fichier CSS global */}
    </>
  );
};

export default ConfettiEffect;