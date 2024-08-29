import React from "react";
import { Header } from "../header";
import { Nav } from "../nav";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./Layout.module.scss";
import { PostFormProvider } from "../../contexts/PostFormContext";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  // console.log(location.pathname);

  const renderHeader = () => {
    // 로그인/회원가입 헤더 : 없음
    if (path === "/login" || path === "/signup") {
      return null;
    }

    // 메인페이지 헤더
    if (path === "/") {
      return <Header type="main" location="강남구" />;
    }
    // 게시글상세페이지 헤더
    if (path.startsWith("/post/") && path !== "/post/new") {
      return <Header type="detail" />;
    }

    // 글쓰기페이지 헤더
    if (path === "/post/new") {
      return <Header type="write" />;
    }
    // 채팅상세페이지 헤더
    if (path.startsWith("/chat/") && path !== "/chat") {
      return <Header type="chat" />;
    }

    // 프로필페이지 헤더
    if (path === "/profile") {
      return <Header type="profile" />;
    }

    return <Header />;
  };

  const renderNav = () => {
    if (path.startsWith("/post")) {
      return null;
    }
    return <Nav />;
  };

  return (
    <>
      <PostFormProvider>
        <div className={styles.layoutContainer}>
          {renderHeader()}
          <div className={styles.contentsContainer}>
            <Outlet />
          </div>
          {renderNav()}
        </div>
      </PostFormProvider>
    </>
  );
};

export default Layout;
