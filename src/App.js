import logo from './logo.svg';
import './App.css';
import Person from './components/Person';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='container'>
          <div className='row justify-content-center p-5'>
            <h2>Person React</h2>
            <img src={logo} className="App-logo" alt="logo" />
            <Person />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
