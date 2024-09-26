import React from "react";
import { useRecoilValue } from "recoil";
import { activeUsersState } from "../../../../recoil/chat-atoms";
import styles from "./ActiveUsers.module.css";
const ActiveUsers = () => {
  const activeUsers = useRecoilValue(activeUsersState);

  return (
    <div className={styles.activeUsers}>
      <div className={styles.avatarContainer}>
        {activeUsers.map((user) => (
          <div key={user.guest_id} className={styles.avatar}>
            <img
              src={`data:image/png;base64,${user.avartar_base64}`}
              alt={`User ${user.guest_id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ActiveUsers;
