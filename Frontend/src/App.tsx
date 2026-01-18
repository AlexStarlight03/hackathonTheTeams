import { useState, useEffect } from 'react'
import './App.css'
import GroupsList from "./pages/GroupsList";
import GroupPage from "./pages/Group";
import Evenements from "./pages/Evenements";
import Ressources from "./pages/Ressources";
import Navbar from "./components/Navbar";
import Home from "./pages/index.tsx";
import RegisterPage from './pages/RegisterPage.tsx';
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
import DiscussionsList from "./pages/discussions";

export type Page =
  | { name: "home"}
  | { name: "groups" }
  | { name: "group"; groupId: number }
  | { name: "events" }
  | { name: "ressources" }
  | { name: "register" }
  | { name: "chat"; discussionId: number; userId: number }
  | { name: "dashboard"; userId: number }
  | { name: "discussions"; userId: number };

function App() {
   const [page, setPage] = useState<Page>({ name: "home" });
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [user, setUser] = useState<{ prenom: string; email: string; id?: number; professionnel?: boolean } | undefined>(undefined);

  const handleLogin = (userData: { prenom: string; email: string; id?: number; professionnel?: boolean }) => {
    setIsLoggedIn(true);
    setUser(userData);
    setPage({ name: "home" });
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(undefined);
    localStorage.removeItem("token");
    setPage({ name: "home" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/auth/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setIsLoggedIn(true);
            setUser(data.user);
          } else {
            setIsLoggedIn(false);
            setUser(undefined);
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUser(undefined);
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
      <>
        <Navbar
          navigate={setPage}
          isLoggedIn={isLoggedIn}
          userId={user?.id}
        />

        {page.name === "home" && (
          <Home
            isLoggedIn={isLoggedIn}
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            navigate={setPage}
          />
        )}

      {page.name === "groups" && (
        <GroupsList onSelectGroup={id =>
          setPage({ name: "group", groupId: id })
        }/>
      )}
      {page.name === "group" && (
        <GroupPage
          groupId={page.groupId}
          onBack={() => setPage({ name: "groups" })}
          navigate={setPage}
        />
      )}
      {page.name === "events" && <Evenements />}
      {page.name === "ressources" && <Ressources />}
      {page.name === "register" && (
        <RegisterPage
          onRegisterSuccess={() => setPage({ name: "home" })}
          onNavigateToLogin={() => setPage({ name: "home" })}
        />)}
     {page.name === "chat" && (
        <ChatPage
          discussionId={page.discussionId}
          userId={page.userId}
          />
      )}
      {page.name === "dashboard" && user?.id && (
        <Dashboard userId={page.userId} />
      )}
      {page.name === "discussions" && user?.id && (
          <DiscussionsList
            navigate={setPage}
          />
        )}
    </>
  )
}
export default App
