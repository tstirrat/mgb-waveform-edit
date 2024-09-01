import styled from "@emotion/styled";
import { memo, MouseEventHandler, useCallback, useMemo } from "react";
import { Flex } from "./Flex";
import { Callback, Waveform } from "../types";
import { BIT_DEPTH, SAMPLES_PER_WAVEFORM } from "../lib/globals";

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
      <WaveformHex waveform={waveform} />
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

const Block = styled(Flex)<{ primary?: boolean }>(({ primary }) => ({
  width: POINT_SIZE,
  height: POINT_SIZE,
  textAlign: "center",
  verticalAlign: "middle",
  color: primary ? `var(--primary-color)` : undefined,
}));

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
          isMidPoint={i === 8}
          onChange={handleChange}
        />
      ))}
    </Flex>
  );
};

const SamplePointWrapper = styled.div<{
  isActive: boolean;
  isMidpoint: boolean;
}>(({ isActive, isMidpoint }) => ({
  width: POINT_SIZE,
  height: POINT_SIZE,

  backgroundColor: isActive ? "white" : undefined,
  boxShadow: isMidpoint ? "inset 0 -1px 0 0 var(--highlight-bg)" : undefined,
}));

type OnSampleChange = (index: number, value: number) => void;

const LEFT_BUTTON = 1;

const SamplePoint: React.FC<{
  readonly index: number;
  readonly onChange: Callback<number>;
  readonly value: number;
  readonly isActive: boolean;
  readonly isMidPoint: boolean;
}> = memo(({ value, isActive, isMidPoint, onChange }) => {
  const setPoint: MouseEventHandler = (e) => {
    if (e.buttons & LEFT_BUTTON) {
      onChange(value);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <SamplePointWrapper
      isMidpoint={isMidPoint}
      isActive={isActive}
      onMouseMove={setPoint}
      onMouseDown={setPoint}
    />
  );
});

/** The indexes to show in primary color so that hex grouping is more clear */
const HEX_INDEX = [2, 3, 6, 7, 10, 11, 14, 15, 18, 19, 22, 23, 26, 27, 30, 31];

const WaveformHex: React.FC<{ waveform: Waveform }> = ({ waveform }) => {
  return (
    <Flex row grow="1" align="center" style={{ height: POINT_SIZE }}>
      {waveform.slice(0, SAMPLES_PER_WAVEFORM).map((val, i) => (
        <Block
          key={i}
          align="center"
          justify="center"
          primary={HEX_INDEX.includes(i)}
        >
          {val.toString(16).toUpperCase()}
        </Block>
      ))}
    </Flex>
  );
};
