import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'wn-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioComponent {
  onTimeDomain(array: Uint8Array, canvas: HTMLCanvasElement) {
    const canvasCtx = canvas.getContext('2d');

    if (!canvasCtx) {
      return;
    }

    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / array.length;
    let x = 0;

    for (let i = 0; i < array.length; i++) {
      const v = array[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}
