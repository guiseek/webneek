import {
  Input,
  OnInit,
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { rtcConfiguration } from './../../../environments/environment';
import { WebRTCPeerConnection, WebSocketFacade } from '../../shared';
import { createUid } from './../../utilities';

const stringify = (obj: object) => JSON.stringify(obj);
const toJSON = (str: string) => JSON.parse(str);

@Component({
  selector: 'wn-peer-connection',
  templateUrl: './peer-connection.component.html',
  styleUrls: ['./peer-connection.component.scss'],
})
export class PeerConnectionComponent implements OnInit, OnDestroy {
  callActive = false;

  pc: WebRTCPeerConnection;

  localStream: MediaStream;

  senderId: string;

  @Input() autoplay = false;

  @ViewChild('me') me!: ElementRef<HTMLVideoElement>;
  @ViewChild('remote') remote!: ElementRef<HTMLVideoElement>;

  constructor(private socket: WebSocketFacade) {}

  ngOnInit(): void {
    this.setUpMeet();
  }

  setUpMeet() {
    this.senderId = createUid();

    this.socket.on('offer', this.readMessage.bind(this));

    try {
      this.pc = this.createConnection(rtcConfiguration);
    } catch (error) {
      this.pc = this.createConnection(rtcConfiguration);
    }

    this.pc.onicecandidate = (evt) => {
      evt.candidate
        ? this.sendMessage(this.senderId, stringify({ ice: evt.candidate }))
        : console.log('Sent Allt Ice');
    };

    this.pc.onicecandidate = (event) => {
      event.candidate
        ? this.sendMessage(this.senderId, stringify({ ice: event.candidate }))
        : console.log('Sent All Ice');
    };

    this.pc.onremovestream = () => {
      console.log('Stream Ended');
    };

    this.pc.ontrack = ({ streams }) =>
      (this.remote.nativeElement.srcObject = streams[0]);

    this.showMe();
  }

  createConnection(configuration: RTCConfiguration) {
    return new RTCPeerConnection(configuration) as WebRTCPeerConnection;
  }

  sendMessage(sender: string, message: any) {
    this.socket.emit('offer', { sender, message });
  }

  readMessage({ message, sender }: any) {
    try {
      const { ice, sdp } = toJSON(message);

      if (sender !== this.senderId) {
        if (ice !== undefined && this.pc !== null) {
          this.pc.addIceCandidate(new RTCIceCandidate(ice));
        } else if (sdp.type === 'offer') {
          this.callActive = true;

          this.pc
            .setRemoteDescription(new RTCSessionDescription(sdp))
            .then(() => this.pc.createAnswer())
            .then((answer) => this.pc.setLocalDescription(answer))
            .then(() => {
              const message = { sdp: this.pc.localDescription };
              this.sendMessage(this.senderId, stringify(message));
            });
        } else if (sdp.type === 'answer') {
          this.callActive = true;

          this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  showMe() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => (this.me.nativeElement.srcObject = stream))
      .then((stream) => {
        this.pc.addStream(stream);
        this.localStream = stream;
      });
  }

  showRemote() {
    try {
      this.pc
        .createOffer()
        .then((offer) => this.pc.setLocalDescription(offer))
        .then(() => {
          const message = { sdp: this.pc.localDescription };
          this.sendMessage(this.senderId, stringify(message));

          this.callActive = true;
        });
    } catch (error) {
      this.setUpMeet();
      console.log(error);
    }
  }

  hangup() {
    this.pc.close();

    const tracks = this.localStream.getTracks();
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].stop();
    }

    this.callActive = false;
  }

  ngOnDestroy(): void {
    if (this.pc) {
      this.pc.close();

      const tracks = this.localStream.getTracks();
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].stop();
      }
    }
  }
}
