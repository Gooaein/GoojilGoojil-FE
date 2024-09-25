import React, { useState } from "react";
import { Home, Info, Mail, Users } from "lucide-react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import HeaderLogo from "../../../assets/images/logo/headerLogo.png";
import { userState } from "../../../recoil/user-atoms";
import { activeUsersState } from "../../../recoil/chat-atoms";
import ActiveUsersContainer from "./components/ActiveUsersContainer";

export const Header = () => {
  const user = useRecoilValue(userState);
  const activeUsers = useRecoilValue(activeUsersState);
  const [showActiveUsers, setShowActiveUsers] = useState(false);

  const toggleActiveUsers = () => {
    setShowActiveUsers(!showActiveUsers);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src={HeaderLogo} alt="로고" className={styles.logo} />
          </Link>
        </div>
        <nav>
          <ul className={styles.navList}>
            {[
              { name: "홈", icon: Home },
              { name: "소개", icon: Info },
              { name: "연락처", icon: Mail },
            ].map((item) => (
              <li key={item.name}>
                <Link className={styles.navItem}>
                  <item.icon className={styles.icon} size={18} />
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <button onClick={toggleActiveUsers} className={styles.navItem}>
                <Users className={styles.icon} size={18} />
                활성 사용자 ({activeUsers.length})
              </button>
              {showActiveUsers && <ActiveUsersContainer />}
            </li>
          </ul>
        </nav>
        {user && (
          <span className={styles.userName}>환영합니다, {user.name}님</span>
        )}
      </div>
    </header>
  );
};
