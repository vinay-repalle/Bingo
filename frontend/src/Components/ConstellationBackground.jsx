import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadLinksPreset } from 'tsparticles-preset-links';

function ConstellationBackground({ dark = false }) {
  const particlesInit = useCallback(async (engine) => {
    await loadLinksPreset(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // no-op
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Particles
        id="tsparticles-constellation"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          preset: 'links',
          background: {
            color: {
              value: 'transparent'
            }
          },
          fpsLimit: 60,
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: { value: dark ? '#60a5fa' : '#3b82f6' },
            links: {
              enable: true,
              color: dark ? '#60a5fa' : '#3b82f6',
              opacity: 0.4,
              distance: 130,
              width: 1
            },
            move: { enable: true, speed: 1.2, outModes: { default: 'out' } },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } }
          },
          detectRetina: true,
          fullScreen: { enable: false }
        }}
      />
    </div>
  );
}

export default ConstellationBackground;


