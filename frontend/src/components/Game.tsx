import { useEffect, useRef, useState } from 'react';
import { BallManager } from '../game/classes/BallManager';
import apiV1 from '../api/axiosInstance';

export function Game() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement,
      );
      setBallManager(ballManager);
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef} width="800" height="800"></canvas>
      <button
        onClick={async () => {
          const response = await apiV1.post('/games/plinkoo/outcome', {
            data: 1,
          });
          if (ballManager) {
            ballManager.addBall(response.data.point);
          }
        }}
      >
        Add ball
      </button>
    </div>
  );
}
