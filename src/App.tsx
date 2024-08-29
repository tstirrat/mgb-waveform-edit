import { useState } from "react";
import { SendSysex } from "./components/SendSysex";
import { WaveformEditor } from "./components/WaveformEditor";
import { Waveform } from "./types";
import { SysexPreview } from "./components/SysexPreview";
import { Flex } from "./components/Flex";

const INITIAL_WAVEFORM: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  //
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];

function App() {
  const [waveform, setWaveform] = useState<Waveform>(INITIAL_WAVEFORM);

  return (
    <Flex row justify="center" align="center">
      <Flex col align="stretch" gap={8} style={{ maxWidth: 800 }}>
        <WaveformEditor waveform={waveform} onChange={setWaveform} />
        <SendSysex waveform={waveform} />
        <SysexPreview waveform={waveform} />
      </Flex>
    </Flex>
  );
}

export default App;
