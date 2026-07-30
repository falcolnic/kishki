// Single shared volume value used by every sound source in the app
// (LoadingScreen SFX, Desktop blips, and <audio> elements via their own refs).
export const audioBus = { volume: 0.7 }

export function setBusVolume(v) {
    audioBus.volume = Math.max(0, Math.min(1, v))
}