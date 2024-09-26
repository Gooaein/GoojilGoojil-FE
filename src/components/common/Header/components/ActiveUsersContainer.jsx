import React from "react";
import ActiveUsers from "./ActiveUsers";
import styles from "./ActiveUsersContainer.module.css";

const ActiveUsersContainer = () => {
  return (
    <div className={styles.container}>
      <ActiveUsers />
    </div>
  );
};

export default ActiveUsersContainer;
