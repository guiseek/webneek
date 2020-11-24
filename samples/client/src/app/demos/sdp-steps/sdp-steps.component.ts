import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'wn-sdp-steps',
  templateUrl: './sdp-steps.component.html',
  styleUrls: ['./sdp-steps.component.scss'],
})
export class SdpStepsComponent implements OnInit, AfterViewInit {
  @ViewChild('getMediaButtonRefButton') getMediaButtonRef: ElementRef<
    HTMLButtonElement
  >;
  getMediaButton: HTMLButtonElement;

  @ViewChild('createPeerConnectionRefButton')
  createPeerConnectionButtonRef: ElementRef<HTMLButtonElement>;
  createPeerConnectionButton: HTMLButtonElement;

  @ViewChild('createOfferRefButton') createOfferRef: ElementRef<
    HTMLButtonElement
  >;
  createOfferButton: HTMLButtonElement;

  @ViewChild('setOfferRefButton') setOfferRef: ElementRef<HTMLButtonElement>;
  setOfferButton: HTMLButtonElement;

  @ViewChild('createAnswerRefButton') createAnswerRef: ElementRef<
    HTMLButtonElement
  >;
  createAnswerButton: HTMLButtonElement;

  @ViewChild('setAnswerRefButton') setAnswerRef: ElementRef<HTMLButtonElement>;
  setAnswerButton: HTMLButtonElement;

  @ViewChild('hangupRefButton') hangupRef: ElementRef<HTMLButtonElement>;
  hangupButton: HTMLButtonElement;

  @ViewChild('localTextarea') offerSdpTextareaRef: ElementRef<
    HTMLTextAreaElement
  >;
  offerSdpTextarea: HTMLTextAreaElement;

  @ViewChild('remoteTextarea') answerSdpTextareaRef: ElementRef<
    HTMLTextAreaElement
  >;
  answerSdpTextarea: HTMLTextAreaElement;

  @ViewChild('audioSrc') audioSelectRef: ElementRef<HTMLSelectElement>;
  audioSelect: HTMLSelectElement;

  @ViewChild('videoSrc') videoSelectRef: ElementRef<HTMLSelectElement>;
  videoSelect: HTMLSelectElement;

  @ViewChild('localVideoRefEl') localVideoRef: ElementRef<HTMLVideoElement>;
  localVideo: HTMLVideoElement;

  @ViewChild('remoteVideoRefEl') remoteVideoRef: ElementRef<HTMLVideoElement>;
  remoteVideo: HTMLVideoElement;

  @ViewChild('selectSource') selectSourceRef: ElementRef<HTMLDivElement>;
  selectSource: HTMLDivElement;

  dataChannelDataReceived: RTCDataChannel;

  localPeerConnection: RTCPeerConnection;
  remotePeerConnection: RTCPeerConnection;
  localStream: MediaStream;
  sendChannel: RTCDataChannel;
  receiveChannel: RTCDataChannel;
  dataChannelOptions: RTCDataChannelInit = { ordered: true };
  dataChannelCounter = 0;
  sendDataLoop: number;

  offerOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };

  constructor() {}

  async ngOnInit() {
    try {
      const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
      this.gotSources(enumerateDevices);
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewInit() {
    this.getMediaButton = this.getMediaButtonRef.nativeElement;

    this.createPeerConnectionButton = this.createPeerConnectionButtonRef.nativeElement;

    this.createOfferButton = this.createOfferRef.nativeElement;

    this.setOfferButton = this.setOfferRef.nativeElement;

    this.createAnswerButton = this.createAnswerRef.nativeElement;

    this.setAnswerButton = this.setAnswerRef.nativeElement;

    this.hangupButton = this.hangupRef.nativeElement;

    this.offerSdpTextarea = this.offerSdpTextareaRef.nativeElement;

    this.answerSdpTextarea = this.answerSdpTextareaRef.nativeElement;

    this.selectSource = this.selectSourceRef.nativeElement;

    this.audioSelect = this.audioSelectRef.nativeElement;

    this.videoSelect = this.videoSelectRef.nativeElement;

    this.localVideo = this.localVideoRef.nativeElement;

    this.remoteVideo = this.remoteVideoRef.nativeElement;
  }

  gotSources(sourceInfos) {
    this.selectSource.classList.remove('hidden');
    let audioCount = 0;
    let videoCount = 0;
    for (let i = 0; i < sourceInfos.length; i++) {
      const option = document.createElement('option');
      option.value = sourceInfos[i].deviceId;
      option.text = sourceInfos[i].label;
      if (sourceInfos[i].kind === 'audioinput') {
        audioCount++;
        if (option.text === '') {
          option.text = `Audio ${audioCount}`;
        }
        this.audioSelect.appendChild(option);
      } else if (sourceInfos[i].kind === 'videoinput') {
        videoCount++;
        if (option.text === '') {
          option.text = `Video ${videoCount}`;
        }
        this.videoSelect.appendChild(option);
      } else {
        console.log('unknown', JSON.stringify(sourceInfos[i]));
      }
    }
  }

  async getMedia() {
    this.getMediaButton.disabled = true;
    this.createPeerConnectionButton.disabled = false;
    this.localVideo.muted = true;
    if (this.localStream) {
      this.localVideo.srcObject = null;
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    const audioSource = this.audioSelect.value;
    console.log(`Selected audio source: ${audioSource}`);
    const videoSource = this.videoSelect.value;
    console.log(`Selected video source: ${videoSource}`);

    const constraints: MediaStreamConstraints = {
      audio: {
        optional: [
          {
            sourceId: audioSource,
          },
        ],
      },
      video: {
        optional: [
          {
            sourceId: videoSource,
          },
        ],
      },
    } as MediaStreamConstraints;
    console.log('Requested local stream');
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia(constraints);
      this.gotStream(userMedia);
    } catch (e) {
      console.log('navigator.getUserMedia error: ', e);
    }
  }

  gotStream(stream: MediaStream) {
    console.log('Received local stream');
    this.localVideo.srcObject = stream;
    this.localStream = stream;
  }

  createPeerConnection() {
    this.createPeerConnectionButton.disabled = true;
    this.createOfferButton.disabled = false;
    this.createAnswerButton.disabled = false;
    this.setOfferButton.disabled = false;
    this.setAnswerButton.disabled = false;
    this.hangupButton.disabled = false;
    console.log('Starting call');
    const videoTracks = this.localStream.getVideoTracks();
    const audioTracks = this.localStream.getAudioTracks();

    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }

    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const servers = null;

    this.localPeerConnection = this.localPeerConnection = new RTCPeerConnection(
      servers
    );
    console.log('Created local peer connection object localPeerConnection');
    this.localPeerConnection.onicecandidate = (e) =>
      this.onIceCandidate(this.localPeerConnection, e);
    this.sendChannel = this.localPeerConnection.createDataChannel(
      'sendDataChannel',
      this.dataChannelOptions
    );
    this.sendChannel.onopen = this.onSendChannelStateChange;
    this.sendChannel.onclose = this.onSendChannelStateChange;
    this.sendChannel.onerror = this.onSendChannelStateChange;

    this.remotePeerConnection = this.remotePeerConnection = new RTCPeerConnection(
      servers
    );
    console.log('Created remote peer connection object remotePeerConnection');
    this.remotePeerConnection.onicecandidate = (e) =>
      this.onIceCandidate(this.remotePeerConnection, e);
    this.remotePeerConnection.ontrack = this.gotRemoteStream;
    this.remotePeerConnection.ondatachannel = this.receiveChannelCallback;

    this.localStream
      .getTracks()
      .forEach((track) =>
        this.localPeerConnection.addTrack(track, this.localStream)
      );
    console.log('Adding Local Stream to peer connection');
  }
  onSetSessionDescriptionSuccess() {
    console.log('Set session description success.');
  }
  onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }
  async createOffer() {
    try {
      const offer = await this.localPeerConnection.createOffer(
        this.offerOptions
      );
      this.gotDescription1(offer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  }
  onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

  async setOffer() {
    // Restore the SDP from the textarea. Ensure we use CRLF which is what is generated
    // even though https://tools.ietf.org/html/rfc4566#section-5 requires
    // parsers to handle both LF and CRLF.
    const sdp = this.offerSdpTextarea.value
      .split('\n')
      .map((l) => l.trim())
      .join('\r\n');
    const offer: RTCSessionDescriptionInit = {
      type: 'offer',
      sdp: sdp,
    };
    console.log(`Modified Offer from localPeerConnection\n${sdp}`);

    try {
      await this.localPeerConnection.setLocalDescription(offer);
      this.onSetSessionDescriptionSuccess();
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    try {
      await this.remotePeerConnection.setRemoteDescription(offer);
      this.onSetSessionDescriptionSuccess();
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
  }
  gotDescription1(description: RTCSessionDescriptionInit) {
    this.offerSdpTextarea.disabled = false;
    this.offerSdpTextarea.value = description.sdp;
  }
  async createAnswer() {
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    try {
      const answer = await this.remotePeerConnection.createAnswer();
      this.gotDescription2(answer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  }

  async setAnswer() {
    // Restore the SDP from the textarea. Ensure we use CRLF which is what is generated
    // even though https://tools.ietf.org/html/rfc4566#section-5 requires
    // parsers to handle both LF and CRLF.
    const sdp = this.answerSdpTextarea.value
      .split('\n')
      .map((l) => l.trim())
      .join('\r\n');
    const answer: RTCSessionDescriptionInit = {
      type: 'answer',
      sdp: sdp,
    };

    try {
      await this.remotePeerConnection.setLocalDescription(answer);
      this.onSetSessionDescriptionSuccess();
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    console.log(`Modified Answer from remotePeerConnection\n${sdp}`);
    try {
      await this.localPeerConnection.setRemoteDescription(answer);
      this.onSetSessionDescriptionSuccess();
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
  }
  gotDescription2(description: RTCSessionDescriptionInit) {
    this.answerSdpTextarea.disabled = false;
    this.answerSdpTextarea.value = description.sdp;
  }

  sendData() {
    if (this.sendChannel.readyState === 'open') {
      this.sendChannel.send(`${this.dataChannelCounter}`);
      console.log(`DataChannel send counter: ${this.dataChannelCounter}`);
      this.dataChannelCounter++;
    }
  }

  hangup() {
    this.remoteVideo.srcObject = null;
    console.log('Ending call');
    this.localStream.getTracks().forEach((track) => track.stop());
    this.sendChannel.close();
    if (this.receiveChannel) {
      this.receiveChannel.close();
    }
    this.localPeerConnection.close();
    this.remotePeerConnection.close();
    this.localPeerConnection = null;
    this.remotePeerConnection = null;
    this.offerSdpTextarea.disabled = true;
    this.answerSdpTextarea.disabled = true;
    this.getMediaButton.disabled = false;
    this.createPeerConnectionButton.disabled = true;
    this.createOfferButton.disabled = true;
    this.setOfferButton.disabled = true;
    this.createAnswerButton.disabled = true;
    this.setAnswerButton.disabled = true;
    this.hangupButton.disabled = true;
  }

  gotRemoteStream = (e: RTCTrackEvent) => {
    console.log(this.remoteVideo);
    console.log(this.remoteVideoRef.nativeElement);
    if (!this.remoteVideo) {
      this.remoteVideo = this.remoteVideoRef.nativeElement;
    }
    if (this.remoteVideo.srcObject !== e.streams[0]) {
      this.remoteVideo.srcObject = e.streams[0];
      console.log('Received remote stream');
    }
  };

  getOtherPc(pc: RTCPeerConnection) {
    return pc === this.localPeerConnection
      ? this.remotePeerConnection
      : this.localPeerConnection;
  }

  getName(pc: RTCPeerConnection) {
    return pc === this.localPeerConnection
      ? 'localPeerConnection'
      : 'remotePeerConnection';
  }

  onIceCandidate = async (
    pc: RTCPeerConnection,
    event: RTCPeerConnectionIceEvent
  ) => {
    try {
      await this.getOtherPc(pc).addIceCandidate(event.candidate);
      this.onAddIceCandidateSuccess(pc);
    } catch (e: unknown) {
      this.onAddIceCandidateError(pc, e);
    }

    console.log(
      `${this.getName(pc)} ICE candidate:\n${
        event.candidate ? event.candidate.candidate : '(null)'
      }`
    );
  };

  onAddIceCandidateSuccess(pc: RTCPeerConnection) {
    console.log('AddIceCandidate success.');
  }
  onAddIceCandidateError(pc: RTCPeerConnection, error?: unknown) {
    console.log(`Failed to add Ice Candidate: ${error.toString()}`);
  }

  receiveChannelCallback = (event: RTCDataChannelEvent) => {
    console.log('Receive Channel Callback');
    this.receiveChannel = event.channel;
    this.receiveChannel.onmessage = this.onReceiveMessageCallback;
    this.receiveChannel.onopen = this.onReceiveChannelStateChange;
    this.receiveChannel.onclose = this.onReceiveChannelStateChange;
  };

  onReceiveMessageCallback = (event: MessageEvent) => {
    this.dataChannelDataReceived = event.data;
    console.log(`DataChannel receive counter: ${this.dataChannelDataReceived}`);
  };

  onSendChannelStateChange = () => {
    const readyState = this.sendChannel.readyState;
    console.log(`Send channel state is: ${readyState}`);
    if (readyState === 'open') {
      this.sendDataLoop = setInterval(this.sendData, 1000);
    } else {
      clearInterval(this.sendDataLoop);
    }
  };
  onReceiveChannelStateChange = () => {
    const readyState = this.receiveChannel.readyState;
    console.log(`Receive channel state is: ${readyState}`);
  };
}
