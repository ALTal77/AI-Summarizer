import "./App.css";
import Demo from "./Components/Demo";
import Hero from "./Components/Hero";

function App() {
  return (
    <div>
      <main>
        <div>
          <div className="gradient"></div>
          <div className="app">
            <Hero />
            <Demo />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
