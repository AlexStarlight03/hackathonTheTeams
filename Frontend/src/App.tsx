import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import GroupsList from "./pages/GroupsList";
import GroupPage from "./pages/Group";
// import Evenements from "./pages/Evenements";
// import Ressources from "./pages/Ressources";


type Page =
  | { name: "groups" }
  | { name: "group"; groupId: number }
  | { name: "events" }
  | { name: "ressources" };

function App() {
   const [page, setPage] = useState<Page>({ name: "groups" });

  return (
      <>
        <nav>
          <button onClick={() => setPage({name: "groups"})}>Groupes</button>
          <button onClick={() => setPage({name: "events"})}>Évènements</button>
          <button onClick={() => setPage({name: "ressources"})}>Ressources</button>
        </nav>

        {page.name === "groups" && (
          <GroupsList onSelectGroup={id =>
            setPage({name : "group", groupId: id})
          }/>
        )}
      {page.name === "group" && (
        <GroupPage
          groupId={page.groupId}
          onBack={() => setPage({ name: "groups" })}
        />
      )}

      {/* {page.name === "events" && <Evenements />}
      {page.name === "ressources" && <Ressources />} */}
      </>
  )
}

export default App

// <>
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src={viteLogo} className="logo" alt="Vite logo" />
//     </a>
//     <a href="https://react.dev" target="_blank">
//       <img src={reactLogo} className="logo react" alt="React logo" />
//     </a>
//   </div>
//   <h1>Vite + React</h1>
//   <div className="card">
//     <button onClick={() => setCount((count) => count + 1)}>
//       count is {count}
//     </button>
//     <p>
//       Edit <code>src/App.tsx</code> and save to test HMR
//     </p>
//   </div>
//   <p className="read-the-docs">
//     Click on the Vite and React logos to learn more
//   </p>
// </>