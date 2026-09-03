const socket = io();

const output =
  document.getElementById("output");

const button =
  document.getElementById("send");

function log(message) {
  output.textContent += message + "\n";
}

socket.on("connect", () => {
  log(`Connected: ${socket.id}`);
});

socket.on("connect_error", (error) => {
  log(
    `Connection error: ${error.message}`
  );
});

socket.on("user:updated", (data) => {
  log(
    `User updated: ${JSON.stringify(data)}`
  );
});

socket.on("order:created", (data) => {
  log(
    `Order created: ${JSON.stringify(data)}`
  );
});

button.addEventListener(
  "click",
  () => {
    socket.emit("user:update", {
      name: "Day 8 Test User",
      timestamp:
        new Date().toISOString()
    });

    log(
      "User update event sent"
    );
  }
);