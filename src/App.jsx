import { useState } from 'react';
import { Search } from 'lucide-react';
import './App.css';

function App() {
  const [miasto, setMiasto] = useState('');
  const [pogoda, setPogoda] = useState(null);
  const [ladowanie, setLadowanie] = useState(false);
  const [blad, setBlad] = useState(null);

  const Wyszukiwanie = async (e) => {
    e.preventDefault();
    if (!miasto.trim()) return;

    setLadowanie(true);
    setBlad(null);
    setPogoda(null);

    try {
      const kluczApi = '695559eb2ee914b4d93fcb07ad934f6b';
      const odpowiedz = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${miasto}&appid=${kluczApi}&units=metric&lang=pl`
      );

      if (!odpowiedz.ok) {
        throw new Error('Nie znaleziono miasta. Spróbuj ponownie.');
      }

      const dane = await odpowiedz.json();
      setPogoda(dane);
    } catch (err) {
      setBlad(err.message);
    } finally {
      setLadowanie(false);
    }
  };

  return (
    <div className="aplikacja-pogodowa">
      <h1>Sprawdź pogodę</h1>

      <form onSubmit={Wyszukiwanie} className="formularz-wyszukiwania">
        <input
          type="text"
          placeholder="Wpisz nazwę miasta..."
          value={miasto}
          onChange={(e) => setMiasto(e.target.value)}
        />
        <button type="submit">
          <Search size={20} />
        </button>
      </form>

      {ladowanie && <div className="ladowanie">Ładowanie...</div>}

      {blad && <div className="blad">{blad}</div>}

      {pogoda && (
        <div className="informacje-pogodowe">
          <h2>{pogoda.name}</h2>
          <div className="szczegoly-pogodowe">
            <img
              src={`https://openweathermap.org/img/wn/${pogoda.weather[0].icon}@2x.png`}
              alt={pogoda.weather[0].description}
            />
            <div className="temperatura">
              {Math.round(pogoda.main.temp)}°C
            </div>
          </div>
          <div className="opis">{pogoda.weather[0].description}</div>
          <div className="dodatkowe-informacje">
            <div>Wilgotność: {pogoda.main.humidity}%</div>
            <div>Wiatr: {pogoda.wind.speed} m/s</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
