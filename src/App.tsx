import { useState } from "react";
import { SendSysex } from "./components/SendSysex";
import { WaveformEditor } from "./components/WaveformEditor";
import { Callback, Waveform } from "./types";
import { MGB_WAVEFORMS } from "./lib/globals";
import { Flex } from "./components/Flex";
import { fromBytes } from "./lib/sysex";
import { WaveformSelector } from "./components/WaveformSelector";

function App() {
  // deep clone the mGB default set (bytes) into samples
  const [waveforms, setWaveforms] = useState<Waveform[]>(
    MGB_WAVEFORMS.map((bytes) => [...fromBytes(bytes)])
  );
  const [waveIndex, setWaveIndex] = useState(0);

  const waveform = waveforms[waveIndex];

  const setCurrentWaveform: Callback<Waveform> = (waveform) =>
    setWaveforms((prev) => {
      const newWaveforms = [...prev];
      newWaveforms[waveIndex] = waveform;
      return newWaveforms;
    });

  return (
    <Flex row justify="center" align="center">
      <Flex col align="stretch" gap={8} style={{ maxWidth: 800 }}>
        <WaveformEditor waveform={waveform} onChange={setCurrentWaveform} />
        <WaveformSelector value={waveIndex} onChange={setWaveIndex} />
        <SendSysex waveform={waveform} />
      </Flex>
    </Flex>
  );
}

export default App;
