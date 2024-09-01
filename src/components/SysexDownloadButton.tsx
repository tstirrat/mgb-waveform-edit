import { Waveform } from "../types";
import { sysexWaveformMessage } from "../lib/sysex";
import { useMemo } from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

export const SysexDownloadButton: React.FC<{ waveform: Waveform }> = ({
  waveform,
}) => {
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
    <Button
      text
      icon={PrimeIcons.DOWNLOAD}
      onClick={handleDownload}
      label="Download .syx file"
    />
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
