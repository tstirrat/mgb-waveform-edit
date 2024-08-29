export type Callback<T> = (v: T) => void;

/** The representation of a waveform. 32 nibbles long. */
export type Waveform = number[];

export const SAMPLES_PER_WAVEFORM = 32;

export const BYTES_PER_WAVEFORM = 16;

export const BIT_DEPTH = 16;
