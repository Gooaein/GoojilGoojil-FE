// atoms.js
import { atom } from 'recoil';

export const chatMessagesState = atom({
  key: 'chatMessagesState',
  default: [],
});
