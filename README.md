# mGB Waveform Editor

This tool allows one to replace the waveform that is selected in the WAV channel. It sends a custom
SysEx message to mGB, so you will need:

1. A custom mGB built from [this branch](https://github.com/tstirrat/mGB/pull/6)
1. An ArduinoBoy or some way to send MIDI to the mGB cart

I have not tested it in RetroPlug, in theory it should work.

### Running the development server

```
bun run dev
```
