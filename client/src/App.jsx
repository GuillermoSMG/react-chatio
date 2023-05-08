import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const socket = io('http://localhost:4000');

  useEffect(() => {
    const receiveMessage = message => {
      setMessages([message, ...messages]);
    };
    socket.on('message', receiveMessage);

    return () => {
      socket.off('message', receiveMessage);
    };
  }, [messages]);

  const handleSubmit = event => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: 'Me',
    };
    setMessages([newMessage, ...messages]);
    setMessage('');
    socket.emit('message', newMessage.body);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          onChange={e => setMessage(e.target.value)}
          value={message}
          name='message'
        />
        <button>Send</button>
      </form>
      <div>
        <ul className='h-80 overflow-y-auto'>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black'
              }`}
            >
              <b>{message.from}</b>:{message.body}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
