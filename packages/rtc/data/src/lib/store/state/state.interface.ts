import { FormData } from '../../core';

export interface State {
  connectedClients: string[];
  data: Partial<FormData>;
}
