import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { logTrackIds } from '../utilities/audio-utils';
@Component({
  selector: 'wn-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioComponent implements AfterViewInit {
  @ViewChild('startButton') startButton: ElementRef<HTMLButtonElement>;
  @ViewChild('callButton') callButton: ElementRef<HTMLButtonElement>;
  @ViewChild('hangupButton') hangupButton: ElementRef<HTMLButtonElement>;

  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;

  localStream: MediaStream;
  remoteStream: MediaStream;

  peer1: RTCPeerConnection;
  peer2: RTCPeerConnection;

  offerOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };

  getName(peer: RTCPeerConnection) {
    return peer === this.peer1 ? 'peer1' : 'peer2';
  }

  getOtherPeer(peer: RTCPeerConnection) {
    // console.log(peer === this.peer1, peer, this.peer1);
    return peer == this.peer1 ? this.peer2 : this.peer1;
  }

  async start() {
    console.log('Requesting local stream');
    this.startButton.nativeElement.disabled = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log('Received local stream');
      this.localVideo.nativeElement.srcObject = stream;
      this.localVideo.nativeElement.muted = true;
      this.localStream = stream;
      this.callButton.nativeElement.disabled = false;
    } catch (e) {
      alert(`getUserMedia() error: ${e.name}`);
    }
  }
  async call() {
    this.callButton.nativeElement.disabled = true;
    this.hangupButton.nativeElement.disabled = false;
    console.log('Starting call');
    const startTime = window.performance.now();
    const videoTracks = this.localStream.getVideoTracks();
    const audioTracks = this.localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const configuration = {};
    // this.getSelectedSdpSemantics();
    console.log('RTCPeerConnection configuration:', configuration);
    this.peer1 = new RTCPeerConnection(configuration);
    console.log('Created local peer connection object this.peer1');
    this.peer1.addEventListener(
      'icecandidate',
      async (e) => await this.onIceCandidate(this.peer1, e)
    );
    this.peer2 = new RTCPeerConnection(configuration);
    console.log('Created remote peer connection object this.peer2');
    this.peer2.addEventListener(
      'icecandidate',
      async (e) => await this.onIceCandidate(this.peer2, e)
    );
    this.peer1.addEventListener('iceconnectionstatechange', (e) =>
      this.onIceStateChange(this.peer1, e)
    );
    this.peer2.addEventListener('iceconnectionstatechange', (e) =>
      this.onIceStateChange(this.peer2, e)
    );
    this.peer2.addEventListener('track', this.gotRemoteStream);

    this.localStream
      .getTracks()
      .forEach((track) => this.peer1.addTrack(track, this.localStream));
    console.log('Added local stream to this.peer1');

    try {
      console.log('this.peer1 createOffer start');
      const offer = await this.peer1.createOffer(this.offerOptions);
      await this.onCreateOfferSuccess(offer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  }

  onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

  async onCreateOfferSuccess(desc) {
    console.log(`Offer from peer1\n${desc.sdp}`);
    console.log('peer1 setLocalDescription start');
    try {
      await this.peer1.setLocalDescription(desc);
      this.onSetLocalSuccess(this.peer1);
    } catch (e) {
      this.onSetSessionDescriptionError();
    }

    console.log('this.peer2 setRemoteDescription start');
    try {
      await this.peer2.setRemoteDescription(desc);
      this.onSetRemoteSuccess(this.peer2);
    } catch (e) {
      this.onSetSessionDescriptionError();
    }

    console.log('this.peer2 createAnswer start');
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    try {
      const answer = await this.peer2.createAnswer();
      await this.onCreateAnswerSuccess(answer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  }
  onSetLocalSuccess(peer: RTCPeerConnection) {
    console.log(`${this.getName(peer)} setLocalDescription complete`);
  }
  onSetRemoteSuccess(peer: RTCPeerConnection) {
    console.log(`${this.getName(peer)} setRemoteDescription complete`);
  }
  onSetSessionDescriptionError(error?) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }
  gotRemoteStream(e) {
    if (this.remoteVideo.nativeElement.srcObject !== e.streams[0]) {
      this.remoteVideo.nativeElement.srcObject = e.streams[0];
      console.log('peer2 received remote stream');
    }
  }

  hangup() {
    console.log('Ending call');
    this.peer1.close();
    this.peer2.close();
    this.peer1 = null;
    this.peer2 = null;
    this.hangupButton.nativeElement.disabled = true;
    this.callButton.nativeElement.disabled = false;
  }

  async onCreateAnswerSuccess(desc) {
    console.log(`Answer from peer2:\n${desc.sdp}`);
    console.log('peer2 setLocalDescription start');
    try {
      await this.peer2.setLocalDescription(desc);
      this.onSetLocalSuccess(this.peer2);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    console.log('this.peer1 setRemoteDescription start');
    try {
      await this.peer1.setRemoteDescription(desc);
      this.onSetRemoteSuccess(this.peer1);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
  }

  async onIceCandidate(
    peer: RTCPeerConnection,
    event: RTCPeerConnectionIceEvent
  ) {
    console.log('event: ', event);

    try {
      const other = await this.getOtherPeer(peer);
      if (other) {
        console.log('other: ', other);
        other.addIceCandidate(event.candidate);
      }
      this.onAddIceCandidateSuccess(peer);
    } catch (e) {
      this.onAddIceCandidateError(peer, e);
    }

    console.log(
      `${this.getName(peer)} ICE candidate:\n${
        event.candidate ? event.candidate.candidate : '(null)'
      }`
    );
  }

  onAddIceCandidateSuccess(peer: RTCPeerConnection) {
    console.log(`${this.getName(peer)} addIceCandidate success`);
  }

  onAddIceCandidateError(peer: RTCPeerConnection, error) {
    console.log(
      `${this.getName(peer)} failed to add ICE Candidate: ${error.toString()}`
    );
  }

  onIceStateChange(peer: RTCPeerConnection, event) {
    if (peer) {
      console.log(
        `${this.getName(peer)} ICE state: ${peer.iceConnectionState}`
      );
      console.log('ICE state change event: ', event);
    }
  }

  ngAfterViewInit() {
    console.log(this.startButton);
    console.log(this.callButton);
    console.log(this.hangupButton);

    console.log(this.localVideo);
    console.log(this.remoteVideo);
  }

  async performOfferAnswer(local, remote) {
    const offer = await local.createOffer();
    await local.setLocalDescription(offer);
    await remote.setRemoteDescription(offer);
    const answer = await remote.createAnswer();
    await remote.setLocalDescription(answer);
    await local.setRemoteDescription(answer);
  }

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
