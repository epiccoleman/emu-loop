import { whisper, keyboard } from '@oliveai/ldk';
import mario from "./mario";
import zelda from "./zelda";
import encodeBmp from './encodeBmp';
import jsnes from 'jsnes';
import base64js from 'base64-js';

function displayComponents (fc, f_b64) {
  return {
    label: `It'sa me!`,
    id: "mario",
    onClose: () => {
      console.log('Closed Text Whisper');
    },
    components: [
      {
        type: whisper.WhisperComponentType.Message,
        body: `frame ${fc}`
      },
      {
        body: `![](data:image/bmp;base64,${f_b64})`,
        type: whisper.WhisperComponentType.Markdown,
      },
    ],
  }
}

async function whateverWhisper() {
    var frame_b64 = "0";
    var frame;
    var frame_ct = 0;

    const display = await whisper.create(displayComponents(frame_ct, frame_b64));

    var nes = new jsnes.NES({
      onFrame: function(framebuffer_24) {
        frame = framebuffer_24;
        frame_ct++;

        if (frame_ct < 5 || (frame_ct > 200 && frame_ct % 3 == 0) || (frame_ct > 40 && frame_ct < 200 && frame_ct % 10 == 0)) {
        let bmp = encodeBmp(frame);
        frame_b64 = base64js.fromByteArray(bmp)
        display.update(displayComponents(frame_ct, frame_b64));
        }
      },

      onAudioSample: function(left, right) {
        // ... play audio sample PROBABLY NEVER
      },
      emulateSound: false
    });

    await keyboard.listenHotkey({key: 'a'}, (pressed) => {nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT)})
    await keyboard.listenHotkey({key: 'd'}, (pressed) => {nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT)})
    await keyboard.listenHotkey({key: 'j'}, (pressed) => {nes.buttonDown(1, jsnes.Controller.BUTTON_B)})
    await keyboard.listenHotkey({key: 'k'}, (pressed) => {nes.buttonDown(1, jsnes.Controller.BUTTON_A)})
    await keyboard.listenHotkey({key: 'p'}, (pressed) => {nes.buttonDown(1, jsnes.Controller.BUTTON_START)})

    var romStr = String.fromCharCode.apply(null, mario);
    // var zeldaStr = String.fromCharCode.apply(null, zeldaStr);
    nes.loadROM(romStr);
    // nes.loadROM(zeldaStr);

    for (let i = 0; i < 40; i++) {
      nes.frame();
    }

    setInterval(function() {
      nes.frame();
    }, 150);
    // }

    whisper.create({
      label: "Secret Quest",
      components: [
        {
          type: whisper.WhisperComponentType.Message,
          body: " "
        }
      ]
    })
}

whateverWhisper();
