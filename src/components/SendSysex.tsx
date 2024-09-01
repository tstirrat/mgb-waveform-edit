import { Dropdown } from "primereact/dropdown";
import { useMidiPermission, useMidiPortNames } from "../hooks/use_midi";
import { Flex } from "./Flex";
import { FormEventHandler, useState } from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Waveform } from "../types";
import { sendWaveformSysex } from "../lib/sysex";
import { Field } from "./Field";
import { Card } from "primereact/card";
import { SysexPreview } from "./SysexPreview";
import { SysexDownloadButton } from "./SysexDownloadButton";
import { Text } from "./Typography";

export const SendSysex: React.FC<{ readonly waveform: Waveform }> = ({
  waveform,
}) => {
  const perm = useMidiPermission();
  const { midi, portNames } = useMidiPortNames();

  const [portName, setPortName] = useState<string | undefined>(undefined);

  const sendSysex: FormEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!midi) throw new Error("MIDI is not ready");

    if (!portName) throw new Error("You must select a port");

    const port = [...midi.outputs.values()].find((o) => o.name === portName);

    if (!port) throw new Error(`Port not found ${portName}`);

    sendWaveformSysex(port, waveform);
  };

  if (!perm) return <strong>Error: Permission unavailable</strong>;

  if (!midi) return <strong>Error: No MIDIAccess</strong>;

  if (!midi.sysexEnabled) return <strong>Error: SysEx not enabled</strong>;

  if (!portName && midi.outputs.size) {
    const first = [...midi.outputs.values()][0];

    if (first.name) setPortName(first.name);
  }

  return (
    <Card title="Send to mGB">
      <Flex col align="start" gap={8}>
        <Flex
          row
          align="center"
          justify="start"
          gap={8}
          as="form"
          onSubmit={sendSysex}
        >
          <Field label="Port">
            {(id) => (
              <Dropdown
                inputId={id}
                name="midiPort"
                options={portNames}
                value={portName}
                onChange={(e) => setPortName(e.value)}
                placeholder="MIDI Port"
              />
            )}
          </Field>

          <Button label="Send" icon={PrimeIcons.PLAY} />
        </Flex>

        <Flex row align="baseline">
          <SysexDownloadButton waveform={waveform} />
          <SysexPreview waveform={waveform} />
        </Flex>

        <Text secondary>
          <em>
            Note: This currently sends to the ACTIVE mGB WAV slot
            <br /> (TODO: allow sending to specific slots)
          </em>
        </Text>
      </Flex>
    </Card>
  );
};
