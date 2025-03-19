import { useEffect, useState } from 'react';
import { theme } from '../style/theme';
import { DetectedGameSchema, DetectedGamesDTO } from 'cmap-shared';

export default function useGameDetector() {

  const [detectedGames, setDetectedGames] = useState<DetectedGamesDTO>(null);
  const gameDetectionIcon = 'ri-gamepad-line';

  const gamesDetected = detectedGames !== null ? detectedGames.length > 0 : null;
  const gamesDetectedColor = gamesDetected !== null ? gamesDetected ? theme.colors.success : theme.colors.error : undefined;

  const vrchatDetected = detectedGames !== null ? detectedGames.includes(DetectedGameSchema.Values.VRChat) : null;
  const vrchatDetectedColor = vrchatDetected !== null ? vrchatDetected ? theme.colors.success : theme.colors.error : undefined;

  const chilloutvrDetected = detectedGames !== null ? detectedGames.includes(DetectedGameSchema.Values.VRChat) : null;
  const chilloutvrDetectedColor = chilloutvrDetected !== null ? chilloutvrDetected ? theme.colors.success : theme.colors.error : undefined;

  useEffect(() => {
    window.IPC.send('gameDetector:check');
    const removeListener = window.IPC.receive('gameDetector:detectedGames', (data) => setDetectedGames(data));

    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  function gamesDetectedText() {
    if (detectedGames === null) return 'Not checking if any game is running';
    if (detectedGames.length === 0) return 'No games running';
    return 'Playing ' + detectedGames.join(', ');
  }

  return {
    detectedGames,
    gameDetectionIcon,
    gamesDetected,
    gamesDetectedColor,
    gamesDetectedText: gamesDetectedText(),
    vrchatDetected,
    vrchatDetectedColor,
    chilloutvrDetected,
    chilloutvrDetectedColor
  };
}
