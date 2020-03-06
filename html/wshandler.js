var wslocation = prompt("Please enter your WebSockets IP", "192.168.0.");

var ws = new WebSocket("ws://" + wslocation + ":1337");

ws.onmessage = function(event) {
  console.log(event.data);
};

async function btdown(key) {
  ws.send("1" + key);
}

async function btup(key) {
  ws.send("0" + key);
}
