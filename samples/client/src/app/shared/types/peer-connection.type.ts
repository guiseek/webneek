export type WebRTCPeerConnection = RTCPeerConnection & {
  addStream: (stream: MediaStream) => {};
  onremovestream: Function;
};
