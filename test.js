const { agentCore } = require("./agent-core");
agentCore.query("Hello!").then(r => console.log("✅", r));