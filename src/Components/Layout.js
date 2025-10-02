import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout({ isLoggedIn, userId , onLogout }) {
  const css = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      margin: 0,
      padding: 0
    },
    main: {
      flexGrow: 1,
      margin: 0,
      padding: 0
    },
    footer: {
      backgroundColor: "#f3f3f3",
      textAlign: "center",
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: 0,
      padding: 0
    }
  };

  return (
    <div style={css.container}>
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout}  userId={userId} />
      <main style={css.main}>
        <Outlet />
      </main>
      <footer style={css.footer}>
        © {new Date().getFullYear()} Cesar Mauricio Martinez Navarro
      </footer>
    </div>
  );
}
