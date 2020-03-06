
const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
export function getNoteInformation (frequency) {
  const noteVal = Math.log2(frequency / 27.5) * 12
  const noteNumber = Math.round(noteVal)
  const cents = (noteVal - noteNumber) * 100
  const note = NOTES[noteNumber % 12]
  const octave = Math.floor(noteNumber / 12)

  return {
    note: note,
    cents: cents,
    octave: octave,
  }
}
