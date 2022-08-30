import "./App.css";
import Header from "./components/Header";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="HeaderAndFeed">
        <Header />
        <Feed />
      </div>
    </div>
  );
}

export default App;
