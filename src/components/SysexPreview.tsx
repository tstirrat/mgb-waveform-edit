import { Card } from "primereact/card";
import { Waveform } from "../types";
import { sysexWaveformMessage, toHex } from "../lib/sysex";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Flex } from "./Flex";
import { useMemo } from "react";
import { IconUtils } from "primereact/utils";

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
${wave.join(", ")}
</wave data>

${sysex[23]} = SYSEX EOF
`;

  // Convert Blob to URL
  const blobUrl = useMemo(() => {
    // Convert object to Blob
    const blobConfig = new Blob(
      [Uint8Array.from(sysexWaveformMessage(waveform))],
      { type: "application/octet-stream" }
    );
    return URL.createObjectURL(blobConfig);
  }, [waveform]);

  return (
    <Card title="Sysex data">
      <code>
        <pre>{output}</pre>
      </code>
      <Flex row align="end" grow="1">
        <a href={blobUrl} download="mGB-patch.syx">
          Download .syx file
        </a>
      </Flex>
    </Card>
  );
};
