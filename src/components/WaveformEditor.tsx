import styled from "@emotion/styled";
import { memo, MouseEventHandler, useCallback, useMemo } from "react";
import { Flex } from "./Flex";
import { BIT_DEPTH, Callback, SAMPLES_PER_WAVEFORM, Waveform } from "../types";

export const WaveformEditor: React.FC<{
  readonly waveform: Waveform;
  readonly onChange: Callback<Waveform>;
}> = ({ waveform, onChange }) => {
  if (waveform.length !== SAMPLES_PER_WAVEFORM) {
    throw new Error(
      `Waveform has incorrect sample size ${waveform.length}. Should be ${SAMPLES_PER_WAVEFORM}`
    );
  }

  const handleChange = useCallback<OnSampleChange>(
    (sampleIndex, value) => {
      const newWaveform = [...waveform];
      newWaveform[sampleIndex] = value;

      onChange(newWaveform);
    },
    [onChange, waveform]
  );

  return (
    <Flex col align="center">
      <Flex row grow="1" align="center" style={{ height: POINT_SIZE }}>
        {waveform.slice(0, SAMPLES_PER_WAVEFORM).map((val, i) => (
          <Block key={i} align="center" justify="center">
            {val.toString(16).toUpperCase()}
          </Block>
        ))}
      </Flex>
      <Flex row grow="1" align="center" style={{ border: `2px solid white` }}>
        {waveform.map((sample, i) => (
          <SampleColumn
            key={i}
            index={i}
            value={sample}
            onChange={handleChange}
          />
        ))}
      </Flex>
    </Flex>
  );
};

const POINT_SIZE = 20;

const Block = styled(Flex)({
  width: POINT_SIZE,
  height: POINT_SIZE,
  textAlign: "center",
  verticalAlign: "middle",
});

const SAMPLES = new Array(BIT_DEPTH).fill(0);

const SampleColumn: React.FC<{
  readonly index: number;
  readonly value: number;
  readonly onChange: OnSampleChange;
}> = ({ index, value, onChange }) => {
  const samples = useMemo(() => [...SAMPLES], []);

  if (value >= BIT_DEPTH || value < 0) {
    throw new Error(
      `Invalid sample value: ${value.toString(16)}. Range is 0 - F`
    );
  }

  const handleChange = useCallback(
    (newValue: number) => {
      onChange(index, newValue);
    },
    [index, onChange]
  );

  return (
    <Flex colReverse grow="0" justify="flex-start" align="center">
      {samples.map((_, i) => (
        <SamplePoint
          index={index}
          key={i}
          value={i}
          isActive={i === value}
          onChange={handleChange}
        />
      ))}
    </Flex>
  );
};

const SamplePointWrapper = styled.div<{ isActive: boolean }>(
  ({ isActive: isActive }) => ({
    width: POINT_SIZE,
    height: POINT_SIZE,

    backgroundColor: isActive ? "white" : undefined,
  })
);

type OnSampleChange = (index: number, value: number) => void;

const LEFT_BUTTON = 1;

const SamplePoint: React.FC<{
  readonly index: number;
  readonly onChange: Callback<number>;
  readonly value: number;
  readonly isActive: boolean;
}> = memo(({ value, isActive, onChange }) => {
  const setPoint: MouseEventHandler = (e) => {
    if (e.buttons & LEFT_BUTTON) {
      // console.log(`${index} = ${value}`);
      onChange(value);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <SamplePointWrapper
      isActive={isActive}
      onMouseMove={setPoint}
      onMouseDown={setPoint}
    />
  );
});
