import { atom } from "recoil";

export const characterState = atom({
  key: "characterState",
  default: {
    body: "",
    eyes: "",
    mouth: "",
  },
});
