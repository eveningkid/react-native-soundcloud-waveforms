export function getWaveForms(size = 150) {
  const waveforms = [];

  for (let i = 0; i < size; i++) {
    waveforms.push(Math.max(10, Math.floor(Math.random() * 100)));
  }

  return waveforms;
}

