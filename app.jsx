import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const joinRoom = () => {
    if (room && user) {
      socket.emit('join', { room, user });
      fetch(`http://localhost:3000/rooms/${room}/messages`)
        .then(res => res.json())
        .then(data => setMessages(data));
      setJoined(true);
    }
  };

  const sendMessage = () => {
    socket.emit('message', { room, user, text: message });
    setMessage('');
  };

  useEffect(() => {
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('notification', (note) =>
      setMessages((prev) => [...prev, { user: 'System', text: note, timestamp: Date.now() }])
    );
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      {!joined ? (
        <div>
          <input placeholder="User" onChange={e => setUser(e.target.value)} />
          <input placeholder="Room" onChange={e => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Room: {room}</h2>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <input value={message} onChange={e => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
