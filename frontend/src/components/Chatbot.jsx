import { useEffect, useRef, useState } from 'react';
import { chatAPI } from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! Ask me for movie suggestions like action, comedy, thriller, top movies, latest, or popular.',
      results: []
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      results: []
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await chatAPI.sendMessage(trimmed);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data?.message || 'I could not understand that. Please try again.',
        results: Array.isArray(data?.results) ? data.results : []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'bot',
          text: 'Something went wrong. Please try again in a moment.',
          results: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleSend();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-600 sm:bottom-5 sm:right-5 sm:px-5"
      >
        {isOpen ? 'Close Chat' : 'Chat'}
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-2 z-50 flex h-[70vh] w-[95vw] max-w-[360px] flex-col overflow-hidden rounded-xl border border-dark-lighter bg-dark-light shadow-2xl sm:bottom-20 sm:right-5 sm:h-[500px] sm:w-[360px]">
          <div className="border-b border-dark-lighter px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Entertainment Assistant</h3>
            <p className="text-xs text-gray-300">Get movie and TV suggestions</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  message.sender === 'user'
                    ? 'ml-auto bg-red-500 text-white'
                    : 'bg-dark text-gray-100'
                }`}
              >
                <p>{message.text}</p>

                {message.sender === 'bot' && message.results?.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.results.map((item) => (
                      <div key={item.id} className="rounded-md border border-dark-lighter p-2">
                        {item.poster && (
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="mb-2 h-36 w-full rounded object-cover"
                          />
                        )}
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-xs text-gray-300">Rating: {Number(item.rating).toFixed(1)} / 10</p>
                        <p className="mt-1 text-xs text-gray-300">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[90%] rounded-lg bg-dark px-3 py-2 text-sm text-gray-100">
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-dark-lighter p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for suggestions..."
                className="flex-1 rounded-md border border-dark-lighter bg-dark px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
