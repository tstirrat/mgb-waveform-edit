import { Dropdown } from "primereact/dropdown";
import { useMidiAccess, useMidiPermission } from "../hooks/use_midi";
import { Flex } from "./Flex";
import { FormEventHandler, useId, useState } from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Waveform } from "../types";
import { Fieldset } from "primereact/fieldset";
import { sendWaveformSysex } from "../lib/sysex";

export const SendSysex: React.FC<{ readonly waveform: Waveform }> = ({
  waveform,
}) => {
  const perm = useMidiPermission();
  const midi = useMidiAccess();

  const [portId, setPortId] = useState<string | undefined>(undefined);

  const sendSysex: FormEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!portId) throw new Error("You must select a port");

    const port = midi?.outputs.get(portId);

    if (!port) throw new Error(`Invalid port ${portId}`);

    sendWaveformSysex(port, waveform);
  };

  if (!perm) return <strong>Error: Permission unavailable</strong>;

  if (!midi?.sysexEnabled) return <strong>Error: SysEx not enabled</strong>;

  if (!midi) return <strong>Error: No MIDIAccess</strong>;

  if (!portId && midi.outputs.size) {
    setPortId([...midi.outputs.values()][0].id);
  }

  return (
    <Fieldset>
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
              options={[...midi.outputs.values()]}
              optionLabel="name"
              optionValue="id"
              value={portId}
              valueTemplate={(
                option: MIDIOutput | undefined,
                { placeholder }
              ) => <span>{option?.name ?? placeholder}</span>}
              onChange={(e) => setPortId(e.value)}
              placeholder="MIDI Port"
            />
          )}
        </Field>
        <Button label="Send" icon={PrimeIcons.PLAY} />
      </Flex>
    </Fieldset>
  );
};

const Field: React.FC<{
  label: string;
  children: (id: string) => React.ReactNode;
}> = ({ label, children }) => {
  const id = useId();
  return (
    <Flex row align="center" gap={8} style={{ alignContent: "center" }}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
    </Flex>
  );
};
