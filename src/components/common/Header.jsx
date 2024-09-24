import React from "react";

import { Home, Info, Mail } from "lucide-react";

import styles from "./Header.module.css";
import HeaderLogo from "../../assets/images/logo/headerLogo.png";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/user-atoms";
import { Link } from "react-router-dom";
export const Header = () => {
  let user = useRecoilValue(userState);

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
          </ul>
        </nav>
        {user && (
          <span className={styles.userName}>환영합니다, {user.name}님</span>
        )}
      </div>
    </header>
  );
};
