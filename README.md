# mGB Waveform Editor

https://mgb-waveform-edit.web.app/

This tool allows one to edit the waveform for [mGB](https://github.com/trash80/mGB). It works via a SysEx message.

You will need:

1. A custom mGB - built from [this branch](https://github.com/tstirrat/mGB/pull/6)
1. An ArduinoBoy or some way to send MIDI to the mGB cart

I have not tested it in RetroPlug, in theory it should work.

### Running the development server

```
bun install
bun run dev
```

### Building the app

```
bun install
bun run build
```
