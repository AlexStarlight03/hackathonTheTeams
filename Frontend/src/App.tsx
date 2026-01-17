import { useState } from 'react'
import './App.css'
import GroupsList from "./pages/GroupsList";
import GroupPage from "./pages/Group";
import Evenements from "./pages/Evenements";
import Ressources from "./pages/Ressources";
import Navbar from "./components/Navbar";
import Home from "./pages/index.tsx";
import RegisterPage from './pages/RegisterPage.tsx';
import ChatPage from "./pages/ChatPage";


export type Page =
  | { name: "home"}
  | { name: "groups" }
  | { name: "group"; groupId: number }
  | { name: "events" }
  | { name: "ressources" }
  | { name: "register" }
  | { name: "chat"; discussionId: number; userId: number };

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

  return (
      <>
        <Navbar navigate={setPage} />

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
    </>
  )
}
export default App
