import { useState } from 'react';

export default function Cotacao() {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState('');

  const buscar = async () => {
    setErro('');
    setDados([]);

    if (!inicio || !fim) {
      setErro('Informe as duas datas.');
      return;
    }

    if (new Date(inicio) > new Date(fim)) {
      setErro('Data inicial deve ser antes da final.');
      return;
    }

    const url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${inicio.replace(/-/g, '')}&end_date=${fim.replace(/-/g, '')}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        setDados(json.reverse());
      } else {
        setErro('Nenhum dado encontrado.');
      }
    } catch {
      setErro('Erro ao buscar dados.');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h3>Cotação USD/BRL</h3>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
        <button onClick={buscar}>Buscar</button>
      </div>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {dados.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {dados.map((item) => (
            <div key={item.timestamp} style={{ marginBottom: 5 }}>
              <strong>{new Date(item.timestamp * 1000).toLocaleDateString()}</strong> - Compra: R${parseFloat(item.bid).toFixed(2)} | Venda: R${parseFloat(item.ask).toFixed(2)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
