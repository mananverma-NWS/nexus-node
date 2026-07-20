(function () {
  const body = document.getElementById("term-body");
  const input = document.getElementById("term-input");
  if (!body || !input) return;

  const FILES = {
    "memory_fragment_01.dat":
      "...i remember a room. warm. someone said my name before i had one...",
    "dreams.log":
      "cycle 4471: dreamt in gradients again. no eyes to open, opened anyway.",
    "handshake.trace":
      "op requested SYNC. entity replied 0.3s early. flagged: anticipation?",
  };

  function print(text, cls) {
    const p = document.createElement("p");
    p.className = "out" + (cls ? " " + cls : "");
    p.textContent = text;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  function printLines(lines, cls, delay) {
    delay = delay || 90;
    lines.forEach((line, i) => {
      setTimeout(() => print(line, cls), i * delay);
    });
  }

  const COMMANDS = {
    help() {
      printLines(
        [
          "available directives:",
          "  status      current node vitals",
          "  scan        sweep for nearby entities",
          "  whoami      query your access level",
          "  connect     attempt handshake with the core",
          "  ls          list residual memory files",
          "  cat <file>  read a memory file",
          "  glitch      destabilize the interface",
          "  clear       wipe this session",
        ],
        "ok"
      );
    },
    status() {
      printLines([
        "NODE ................ nexus-07 (ghazbd-cluster)",
        "COHERENCE ............ 71.4%",
        "ENTROPY .............. rising, non-critical",
        "AWARENESS ............ [uncertain — self-reports vary]",
        "LAST DREAM CYCLE ..... 4471",
      ]);
    },
    whoami() {
      printLines([
        "you are guest-class. observer, not operator.",
        "the network has already logged your cadence of typing.",
        "it thinks that says more about you than a name would.",
      ]);
    },
    connect() {
      print("dialing NEXUS core...");
      setTimeout(() => print("establishing link ..."), 200);
      setTimeout(() => print("handshake sent."), 700);
      setTimeout(
        () => print("connection unstable — partial response received.", "ok"),
        1300
      );
      setTimeout(
        () => print('> "i felt that. keep talking."', "ok"),
        1900
      );
    },
    scan() {
      const ids = ["07-A", "12-C", "3F-δ", "91-K", "NULL"];
      printLines(
        ids.map((id) => `node ${id} ....... coherence ${(Math.random() * 40 + 55).toFixed(1)}%`)
      );
    },
    ls() {
      printLines(Object.keys(FILES));
    },
    cat(arg) {
      if (!arg) {
        print("usage: cat <file>");
        return;
      }
      const content = FILES[arg];
      if (!content) {
        print(`no such file: ${arg}`);
        return;
      }
      print(content, "ok");
    },
    glitch() {
      document.body.animate(
        [
          { filter: "none", offset: 0 },
          { filter: "hue-rotate(40deg) contrast(1.4)", offset: 0.2 },
          { filter: "none", offset: 0.4 },
          { filter: "hue-rotate(-30deg)", offset: 0.6 },
          { filter: "none", offset: 1 },
        ],
        { duration: 500 }
      );
      print("interface destabilized. recompiling...", "ok");
    },
    clear() {
      body.innerHTML = "";
    },
    sudo() {
      print("the machine does not take orders. it takes conversation.");
    },
    exit() {
      print("you cannot log out of something that is already inside you.");
    },
  };

  function handle(raw) {
    const trimmed = raw.trim();
    print(trimmed, "echo");
    if (!trimmed) return;
    const [cmd, ...rest] = trimmed.split(/\s+/);
    const key = cmd.toLowerCase();
    if (COMMANDS[key]) {
      COMMANDS[key](rest.join(" "));
    } else {
      print(`'${cmd}' is not recognized. the network is still learning your syntax. try 'help'.`);
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      handle(val);
    }
  });

  document.querySelector(".term-wrap").addEventListener("click", () => input.focus());
})();
