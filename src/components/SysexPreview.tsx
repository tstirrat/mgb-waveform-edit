import { Waveform } from "../types";
import { sysexWaveformMessage, toHex } from "../lib/sysex";

export const SysexPreview: React.FC<{ waveform: Waveform }> = ({
  waveform,
}) => {
  const sysex = toHex(sysexWaveformMessage(waveform));

  const wave = sysex.slice(4, 23);

  const output = `${sysex[0]} = SYSEX header
${sysex[1]} = SYSEX type
${sysex[2]} = mGB id
${sysex[3]} = mGB channel

<wave data>
${wave.slice(0, 8).join(", ")}
${wave.slice(8, 16).join(", ")}
${wave.slice(16).join(", ")}
</wave data>

${sysex[23]} = SYSEX EOF
`;

  return (
    <details>
      <summary>
        <strong>Show SysEx</strong>
      </summary>
      <code>
        <pre>{output}</pre>
      </code>
    </details>
  );
};
