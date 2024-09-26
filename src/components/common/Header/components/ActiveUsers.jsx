import React from "react";
import { useRecoilValue } from "recoil";
import { activeUsersState } from "../../../../recoil/chat-atoms";
import styles from "./ActiveUsers.module.css";

const ActiveUsers = () => {
  const activeUsers = useRecoilValue(activeUsersState);

  if (activeUsers.length === 0) {
    return (
      <div className={styles.emptyState}>현재 활성 사용자가 없습니다.</div>
    );
  }

  return (
    <div className={styles.activeUsers}>
      <div className={styles.avatarGrid}>
        {activeUsers.map((user) => (
          <div key={user.id} className={styles.avatarItem}>
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className={styles.avatar}
            />
            <span className={styles.userName}>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveUsers;
