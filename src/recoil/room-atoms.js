// src/recoil/roomAtoms.js
import { atom } from "recoil";

export const roomDataState = atom({
  key: "roomDataState",
  default: null,
});

export const avatarState = atom({
  key: "avatarState",
  default: null,
});

export const reviewState = atom({
  key: "reviewState",
  default: null,
});
