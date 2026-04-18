// Chat AI Widget — Hoa Tươi Thanh Ngọc
(function () {
  const CHAT_API = "http://localhost:5000"; // Local test — đổi thành URL Railway sau khi deploy

  // Session ID cố định cho mỗi trình duyệt
  function getSessionId() {
    let id = localStorage.getItem("htn_chat_session");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("htn_chat_session", id);
    }
    return id;
  }

  const sessionId = getSessionId();

  const toggleBtn   = document.getElementById("chat-toggle-btn");
  const toggleIcon  = document.getElementById("chat-toggle-icon");
  const chatMenu    = document.getElementById("chat-menu");
  const openAiBtn   = document.getElementById("open-ai-chat");
  const chatBox     = document.getElementById("chat-box");
  const closeBtn    = document.getElementById("close-chat");
  const messagesEl  = document.getElementById("chat-messages");
  const inputEl     = document.getElementById("chat-input");
  const sendBtn     = document.getElementById("chat-send");

  let menuOpen = false;
  let loading  = false;

  // Toggle menu
  toggleBtn.addEventListener("click", function () {
    menuOpen = !menuOpen;
    chatMenu.classList.toggle("hidden", !menuOpen);
    toggleIcon.textContent = menuOpen ? "✕" : "💬";
    if (menuOpen) chatBox.classList.add("hidden");
  });

  // Mở chat AI
  openAiBtn.addEventListener("click", function () {
    chatMenu.classList.add("hidden");
    chatBox.classList.remove("hidden");
    menuOpen = false;
    toggleIcon.textContent = "💬";
    inputEl.focus();
  });

  // Đóng chat AI
  closeBtn.addEventListener("click", function () {
    chatBox.classList.add("hidden");
  });

  // Gửi tin nhắn bằng Enter
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  sendBtn.addEventListener("click", sendMessage);

  function addMessage(role, content, images) {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg " + (role === "user" ? "user" : "bot");

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = content;
    wrap.appendChild(bubble);

    if (images && images.length > 0) {
      const grid = document.createElement("div");
      grid.className = "chat-images";
      images.forEach(function (url) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "sản phẩm hoa";
        img.loading = "lazy";
        grid.appendChild(img);
      });
      wrap.appendChild(grid);
    }

    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return wrap;
  }

  function addTyping() {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg bot";
    wrap.id = "chat-typing";
    wrap.innerHTML = '<div class="chat-bubble chat-typing-dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById("chat-typing");
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || loading || !CHAT_API) {
      if (!CHAT_API) {
        addMessage("bot", "⚠️ Bot chưa được kết nối. Vui lòng gọi 093 492 6092 ạ!");
      }
      return;
    }

    inputEl.value = "";
    addMessage("user", text);
    addTyping();
    loading = true;
    sendBtn.disabled = true;

    try {
      const res = await fetch(CHAT_API + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      const data = await res.json();
      removeTyping();
      addMessage("bot", data.reply, data.images);
    } catch (err) {
      removeTyping();
      addMessage("bot", "Xin lỗi anh/chị, em gặp sự cố. Vui lòng gọi 093 492 6092 ạ!");
    } finally {
      loading = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }
})();
