import { Card } from "primereact/card";
import { Waveform } from "../types";
import { sysexWaveformMessage, toHex } from "../lib/sysex";
import { useMemo } from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

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

  const handleDownload = () => {
    const fileName = "mGB-patch.syx";
    downloadFile(blobUrl, fileName);
  };

  return (
    <Card>
      <Button
        icon={PrimeIcons.DOWNLOAD}
        onClick={handleDownload}
        label="Download .syx file"
      />
      <details>
        <summary>
          <strong>Sysex data</strong>
        </summary>
        <code>
          <pre>{output}</pre>
        </code>
      </details>
    </Card>
  );
};

function downloadFile(blobUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
