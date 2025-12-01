import { Dock, Navbar, Welcome } from "#components";

const App = () => {
  return (
    <main className="font-">
      <Navbar />
      <Welcome />
      <Dock />
    </main>
  );
};
export default App;
