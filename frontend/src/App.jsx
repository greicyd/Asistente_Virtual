import { useState, useRef, useEffect } from "react";
import { FiSend, FiMessageSquare,  FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";


export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);


  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verifica si el clic no ocurrió dentro del contenedor del avatar/menú
      if (!event.target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 168)}px`;
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
    setIsLoading(true);
    if (!isStarted) setIsStarted(true);

    const userMessage = { from: "user", text: input };
    const typingMessage = { from: "bot", text: "" };

    setMessages((msgs) => [...msgs, userMessage, typingMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("http://192.168.100.213:3001/preguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: input }),
      });

      const data = await res.json();

      const fullText = data.respuesta?.trim() || "No se obtuvo una respuesta del servidor";
      let currentText = "";
      const delay = 20;

      // Escribe la respuesta letra por letra
      const typeLetterByLetter = (i = 0) => {
        if (i < fullText.length) {
          currentText += fullText[i];
          setMessages((msgs) => {
            const newMsgs = [...msgs];
            newMsgs[newMsgs.length - 1] = { from: "bot", text: currentText };
            return newMsgs;
          });
          setTimeout(() => typeLetterByLetter(i + 1), delay);
        } else {
          setIsLoading(false);
        }
      };

      typeLetterByLetter();

    } catch (err) {
      console.error("Error:", err);
      setMessages((msgs) => {
        const newMsgs = [...msgs];
        newMsgs[newMsgs.length - 1] = {
          from: "bot",
          text: "Error al conectar con el asistente.",
        };
        return newMsgs;
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) sendMessage();
    }
  };
  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.100.213:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: username, contraseña: password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setLoginError("");
      } else {
        // Mostrar el mensaje exacto del backend
        setLoginError(data.message || "Error en credenciales");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setLoginError("Error al conectar con el servidor");
    }
  };


  const handleLogout = () => {
  // Limpiar localStorage
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("token");

  // Resetear estado
  setIsLoggedIn(false);
  setUserMenuOpen(false);

  // Opcional: limpiar otros estados si lo deseas
  setMessages([]);
  setInput("");
  setIsStarted(false);
};

  if (!isLoggedIn) {

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="flex items-center gap-2 mb-20">
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
          <FiMessageSquare className="text-white w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Asistente Virtual</h1>
      </div>

      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h2>

        {/* Correo electrónico */}
      <div className="relative mb-4">
        <FiMail className="absolute top-2.5 left-3 text-gray-400" />
        <input
          type="email"
          placeholder="Correo electrónico"
          className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none ${
            loginError ? "border-red-500" : "border-gray-300"
          }`}
          value={username}
          onChange={(e) => {setUsername(e.target.value);
            if (loginError) setLoginError("");
          }}
        />
      </div>

      {/* Contraseña */}
      <div className="relative mb-2">
        <FiLock className="absolute top-2.5 left-3 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          className={`w-full pl-10 pr-10 py-2 border rounded-lg text-sm outline-none ${
            loginError ? "border-red-500" : "border-gray-300"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-2.5 right-3 text-gray-400"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {/* Texto de error */}
      {loginError && (
        <p className="text-red-500 text-sm mb-4">{loginError}</p>
      )}

        <button
          onClick={handleLogin}
          disabled={!username || !password} // <-- deshabilita si algún campo está vacío
          className={`w-full py-2 rounded-lg text-white transition ${
            !username || !password
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header fijo arriba */}
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
            <FiMessageSquare className="text-white w-6 h-6" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 select-none">Asistente Virtual</h1>
        </div>

        {/* Avatar y menú usuario */}
        <div className="relative user-menu-container">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition"
          >
            <FiUser className="text-white w-6 h-6" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Vista condicional: bienvenida o chat */}
      {!isStarted ? (
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">¡Hola! Estoy listo para ayudarte 🚀</h2>
          <p className="text-gray-600 mb-8">Escribe tu primera pregunta para comenzar</p>
          <div className="w-full max-w-xl flex items-end gap-2">
            <textarea
              ref={textareaRef}
              onInput={autoResize}
              onKeyDown={handleKeyDown}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 resize-none rounded-xl px-4 py-2 text-sm bg-white outline-none placeholder-gray-400 overflow-y-auto max-h-[168px] leading-6"
              rows={2}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`p-2 rounded-full transition ${
                isLoading ? "bg-gray-300 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </main>
      ) : (
        <>
          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl shadow text-sm max-w-[75%] whitespace-pre-wrap break-words ${
                      msg.from === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-900"
                    }`}
                  >
                    {msg.from === "bot" && msg.text === "" ? (
                      <span className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Input abajo */}
          <footer className="bg-gray-100 px-4 py-4">
            <div className="max-w-2xl mx-auto flex items-end gap-2">
              <textarea
                ref={textareaRef}
                onInput={autoResize}
                onKeyDown={handleKeyDown}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 resize-none rounded-xl px-4 py-2 text-sm bg-white outline-none placeholder-gray-400 overflow-y-auto max-h-[168px] leading-6"
                rows={2}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className={`p-2 rounded-full transition ${
                  isLoading
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FiSend size={20} />
              </button>
            </div>
          </footer>
        </>
      )}

      {/* Estilos para puntos animados */}
      <style>{`
        .loading-dots span {
          display: inline-block;
          animation-name: bounce;
          animation-duration: 1.4s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          margin-right: 2px;
          font-weight: bold;
          font-size: 1.2em;
        }
        .loading-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
