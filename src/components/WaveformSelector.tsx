import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { memo } from "react";
import { WAVEFORM_SLOTS } from "../lib/globals";
import { Callback } from "../types";
import { Field } from "./Field";
import { Flex } from "./Flex";

export const WaveformSelector: React.FC<{
  value: number;
  onChange: Callback<number>;
}> = ({ value, onChange }) => {
  if (value >= WAVEFORM_SLOTS)
    throw new Error(
      `Invalid waveform index ${value}. Only  0-${WAVEFORM_SLOTS - 1} are valid`
    );

  return (
    <Field label="Waveform index">
      {(id) => <SliderWithDisplay id={id} value={value} onChange={onChange} />}
    </Field>
  );
};

const SliderWithDisplay: React.FC<{
  id: string;
  value: number;
  onChange: Callback<number>;
}> = memo(({ id, value, onChange }) => {
  return (
    <Flex row gap={16} align="center" grow="1" style={{ padding: "0 8px" }}>
      <Slider
        id={id}
        style={{ flex: 1 }}
        max={WAVEFORM_SLOTS - 1}
        value={value}
        onChange={(e) => {
          if (typeof e.value === "number") onChange(e.value);
        }}
      />
      <InputText value={value.toString()} readOnly style={{ width: "48px" }} />
    </Flex>
  );
});
