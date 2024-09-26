import { atom } from "recoil";

export const questionsState = atom({
  key: "questionsState",
  default: [],
});

export const activeUsersState = atom({
  key: "activeUsersState",
  default: [],
});

export const newQuestionState = atom({
  key: "newQuestionState",
  default: "",
});

export const stompClientState = atom({
  key: "stompClientState",
  default: null,
});
