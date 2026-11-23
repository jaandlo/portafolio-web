// 1. Inicializar iconos
lucide.createIcons();

// 2. Menú móvil
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

// 3. Filtro dinámico de proyectos
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Quitar estado activo a todos
    filterButtons.forEach((btn) => {
      btn.classList.remove("bg-white", "text-obsidian");
      btn.classList.add(
        "bg-white/5",
        "text-silver",
        "border",
        "border-white/10",
      );
    });

    // Activar el botón seleccionado
    button.classList.remove(
      "bg-white/5",
      "text-silver",
      "border",
      "border-white/10",
    );
    button.classList.add("bg-white", "text-obsidian");

    // Filtrar tarjetas
    const filterValue = button.getAttribute("data-filter");
    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (filterValue === "all" || filterValue === category) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// 4. Envío real del formulario mediante Fetch API
const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");
const submitBtn = document.getElementById("submit-btn");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Cambiar estado visual mientras envía
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;

  // Empaquetar todos los datos del formulario
  const formData = new FormData(contactForm);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      feedback.textContent =
        "¡Mensaje enviado con éxito! Te responderé pronto.";
      feedback.classList.remove("hidden", "text-red-400");
      feedback.classList.add("text-accent");
      contactForm.reset();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    feedback.textContent =
      "Hubo un error al enviar. Verifica tu conexión o Access Key.";
    feedback.classList.remove("hidden", "text-accent");
    feedback.classList.add("text-red-400");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
// 5. Efecto de luz ambiental siguiendo el cursor (Spotlight)
const spotlight = document.getElementById("spotlight");

if (spotlight) {
  window.addEventListener("mousemove", (e) => {
    // Actualiza las variables CSS --x y --y con la posición exacta del ratón
    spotlight.style.setProperty("--x", `${e.clientX}px`);
    spotlight.style.setProperty("--y", `${e.clientY}px`);
  });

  // 6. Fondo animado de red geométrica (Nodos, Triángulos, Cruces y Líneas)
  const canvas = document.getElementById("network-canvas");
  const ctx = canvas.getContext("2d");

  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  // Ajustar el tamaño del canvas al tamaño de la ventana
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Rastrear posición del ratón para conectar líneas con el cursor
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Clase que representa cada figura geométrica flotante
  class GeometricNode {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6; // Velocidad suave en X
      this.vy = (Math.random() - 0.5) * 0.6; // Velocidad suave en Y
      this.size = Math.random() * 4 + 2;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.02;

      // Tipos de figuras basadas en tu imagen: punto, triángulo, aro o cruz (+)
      const shapes = ["dot", "dot", "triangle", "ring", "cross"];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      this.isNeon = Math.random() > 0.75; // 25% de nodos en verde #29ED22
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.spin;

      // Rebotar suavemente en los bordes de la pantalla
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const color = this.isNeon
        ? "rgba(41, 237, 34, 0.55)"
        : "rgba(174, 181, 191, 0.35)";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.2;

      if (this.shape === "dot") {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === "ring") {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.4, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.shape === "triangle") {
        const s = this.size * 2.2;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.86, s * 0.5);
        ctx.lineTo(-s * 0.86, s * 0.5);
        ctx.closePath();
        ctx.stroke();
      } else if (this.shape === "cross") {
        const s = this.size * 1.2;
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(s, 0);
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Crear cantidad de nodos proporcional al tamaño de pantalla
  function initNetwork() {
    particles = [];
    const numberOfNodes = Math.min(
      Math.floor((canvas.width * canvas.height) / 16000),
      85,
    );
    for (let i = 0; i < numberOfNodes; i++) {
      particles.push(new GeometricNode());
    }
  }

  // Dibujar las líneas que unen los nodos cercanos
  function connectNodes() {
    const maxDistance = 135;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.hypot(dx, dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.25;
          ctx.strokeStyle = `rgba(174, 181, 191, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Conectar nodos cercanos al cursor con líneas verde neón (#29ED22)
      if (mouse.x !== null && mouse.y !== null) {
        const dxMouse = particles[a].x - mouse.x;
        const dyMouse = particles[a].y - mouse.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);

        if (distMouse < mouse.radius) {
          const opacity = (1 - distMouse / mouse.radius) * 0.6;
          ctx.strokeStyle = `rgba(41, 237, 34, ${opacity})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Bucle de animación a 60 FPS
  function animateNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectNodes();
    requestAnimationFrame(animateNetwork);
  }

  initNetwork();
  animateNetwork();
  window.addEventListener("resize", initNetwork);
}
