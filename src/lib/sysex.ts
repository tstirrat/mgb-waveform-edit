import { BYTES_PER_WAVEFORM, SAMPLES_PER_WAVEFORM, Waveform } from "../types";

const MIDI_STATUS_SYSEX = 0xf0;
const SYSEX_NON_COMMERCIAL = 0x7d;
const SYSEX_EOF = 0xf7;

const SYSEX_MGB_ID = 0x69;
const MGB_WAV_CHANNEL = 0x02;

export function sendWaveformSysex(port: MIDIOutput, waveform: Waveform) {
  port.send(sysexWaveformMessage(waveform));
}

export function toBytes(waveform: Waveform) {
  return waveform.reduce((out: number[], sample: number, index: number) => {
    const isHighNibble = index % 2;
    if (isHighNibble) {
      const lowNibble = out[out.length - 1];

      const byte = lowNibble + (sample << 4);

      out[out.length - 1] = byte;
    } else {
      out[out.length] = sample;
    }

    return out;
  }, []);
}

export function sysexMessage(message: number[]) {
  return [MIDI_STATUS_SYSEX, SYSEX_NON_COMMERCIAL, ...message, SYSEX_EOF];
}

export function sysexWaveformMessage(waveform: number[]) {
  if (waveform.length !== SAMPLES_PER_WAVEFORM)
    throw new Error(
      `Incorrect wav bytes ${waveform.length}. Should be ${SAMPLES_PER_WAVEFORM}`
    );

  const wavBytes = toBytes(waveform);

  if (wavBytes.length !== BYTES_PER_WAVEFORM)
    throw new Error(
      `Incorrect wav bytes ${wavBytes.length}. Should be ${BYTES_PER_WAVEFORM}`
    );

  return sysexMessage([
    SYSEX_MGB_ID,
    MGB_WAV_CHANNEL,
    ...encodeSysEx7Bit(wavBytes),
  ]);
}

/**
 * Encode System Exclusive messages.
 *
 * SysEx messages are encoded to guarantee transmission of data bytes higher than
 * 127 without breaking the MIDI protocol. Use this static method to convert the
 * data you want to send.
 *
 * Code inspired from Ruin & Wesen's SysEx encoder/decoder - http://ruinwesen.com
 */
function encodeSysEx7Bit(inData: number[]): number[] {
  const outSysEx: number[] = [];

  // const outLength = 0; // Num bytes in output array.
  let count = 0; // Num 7bytes in a block.

  let msbIndex = 0;
  outSysEx[msbIndex] = 0;
  for (let i = 0; i < inData.length; ++i) {
    const data = inData[i];

    if (data > 0xff)
      throw new Error(`Can only encode 8 bit numbers, got ${data}`);

    const msb = data >> 7;
    const body = data & 0x7f;

    outSysEx[msbIndex] |= msb << (6 - count);
    outSysEx[msbIndex + 1 + count] = body;

    if (count++ == 6) {
      msbIndex += 8;
      // outLength += 8;
      outSysEx[msbIndex] = 0;
      count = 0;
    }
  }
  return outSysEx;
}

export function toHex(message: number[]) {
  return message.map((b) => b.toString(16));
}

export function toHexWithPrefix(message: number[]) {
  return message.map((b) => "0x" + b.toString(16));
}
