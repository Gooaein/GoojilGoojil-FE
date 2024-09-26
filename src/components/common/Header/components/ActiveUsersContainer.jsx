import React from "react";
import { useRecoilValue } from "recoil";
import { activeUsersState } from "../../../../recoil/chat-atoms";
import ActiveUsers from "./ActiveUsers";
import styles from "./ActiveUsersContainer.module.css";

const ActiveUsersContainer = () => {
  const activeUsers = useRecoilValue(activeUsersState);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>활성 사용자 ({activeUsers.length})</h3>
      <ActiveUsers />
    </div>
  );
};

export default ActiveUsersContainer;
