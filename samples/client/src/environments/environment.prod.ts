import { WebSocketConfig } from '../app/shared';

export const environment = {
  production: true,
};

export const webSocketConfig: WebSocketConfig = {
  url: 'https://webneek-server.herokuapp.com',
  options: {},
};

export const rtcConfiguration: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};
