import { useState } from "react";

export function useMidiPermission() {
  const [granted, setGranted] = useState<PermissionState | undefined>(
    undefined
  );

  (async () => {
    try {
      const { state } = await navigator.permissions.query({
        name: "midi",
        sysex: true,
      });
      setGranted(state);
    } catch (e) {
      console.error(`Failed to get MIDI permission`, e);
    }
  })();

  return granted;
}

export function useMidiAccess() {
  const [midi, setMidi] = useState<MIDIAccess | undefined>(undefined);

  (async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
      setMidi(midiAccess);
    } catch (e) {
      console.error(`Failed to get MIDI access`, e);
    }
  })();

  return midi;
}
