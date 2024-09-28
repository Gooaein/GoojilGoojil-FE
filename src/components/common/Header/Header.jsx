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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleActiveUsers = () => {
    setShowActiveUsers(!showActiveUsers);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleExternalLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const navItems = [
    { name: "홈", icon: Home, path: "/" },
    {
      name: "소개",
      icon: Info,
      path: "https://litt.ly/googilgoojil",
      external: true,
    },
    {
      name: "리틀리",
      icon: Mail,
      path: "https://litt.ly/googilgoojil",
      external: true,
    },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <Link to="/">
              <img src={HeaderLogo} alt="로고" className={styles.logo} />
            </Link>
          </div>
          <div className={styles.mobileActions}>
            <button onClick={toggleActiveUsers} className={styles.mobileButton}>
              👤
            </button>
            <button onClick={toggleMobileMenu} className={styles.mobileButton}>
              ☰
            </button>
          </div>
          <nav
            className={`${styles.nav} ${showMobileMenu ? styles.showMobileMenu : ""}`}
          >
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <button
                      onClick={() => handleExternalLink(item.path)}
                      className={styles.navItem}
                    >
                      <item.icon className={styles.icon} size={18} />
                      {item.name}
                    </button>
                  ) : (
                    <Link to={item.path} className={styles.navItem}>
                      <item.icon className={styles.icon} size={18} />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
              <li className={styles.desktopOnly}>
                <button onClick={toggleActiveUsers} className={styles.navItem}>
                  <Users className={styles.icon} size={18} />
                  활성 사용자 ({activeUsers.length})
                </button>
              </li>
            </ul>
          </nav>
          {user && (
            <span className={`${styles.userName} ${styles.desktopOnly}`}>
              환영합니다, {user.name}님
            </span>
          )}
        </div>
      </header>
      {showActiveUsers && <ActiveUsersContainer />}
    </>
  );
};
