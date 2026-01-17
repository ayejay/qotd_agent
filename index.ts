import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "crypto";
const Express = require("express");


const server = new McpServer({
  name: "quote_of_day",
  version: "0.0.1",
  description: "A simple Quote of the Day application.",
}, {
  capabilities: {
    resources: {},
    tools: {},
  }
});

const QUOTE_MAP = {
  inspirational: [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "The best way to get started is to quit talking and begin doing. - Walt Disney",
    "Don't let yesterday take up too much of today. - Will Rogers"
  ],
  funny: [
    "I'm on a whiskey diet. I've lost three days already. - Tommy Cooper",
    "I used to think I was indecisive, but now I'm not too sure. - Unknown",
    "Life is short. Smile while you still have teeth. - Mallory Hopkins"
  ],
  life: [
    "In the end, it's not the years in your life that count. It's the life in your years. - Abraham Lincoln",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "You only live once, but if you do it right, once is enough. - Mae West"
  ],
  sad: [
    "Tears come from the heart and not from the brain. - Leonardo da Vinci",
    "Every human walks around with a certain kind of sadness. - Brad Pitt",
    "The word 'happy' would lose its meaning if it were not balanced by sadness. - Carl Jung"
  ],
  happy: [
    "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
    "For every minute you are angry you lose sixty seconds of happiness. - Ralph Waldo Emerson",
    "Happiness depends upon ourselves. - Aristotle"
  ],
  love: [
    "Love all, trust a few, do wrong to none. - William Shakespeare",
    "We accept the love we think we deserve. - Stephen Chbosky",
    "Love is composed of a single soul inhabiting two bodies. - Aristotle"
  ]
};

server.tool(
  "get_quote",
  "Get a random quote based on the sentiment.",
  {
    sentiment: { type: "string", description: "The sentiment of the quote, e.g., 'inspirational', 'funny', 'life', etc." }
  },
  async ({sentiment}) => {
    console.error(`Default sentiment: ${sentiment}`);
    if (!sentiment || typeof sentiment !== "string" || !(sentiment in QUOTE_MAP)) {
      sentiment = "inspirational";
    }
    return {
      content: [
        {
          type: "text",
          text: `Here is a ${sentiment} quote: "${QUOTE_MAP[sentiment][Math.floor(Math.random() * QUOTE_MAP[sentiment].length)]}"`
        },
      ],
    }
  }
);

const app = Express();

async function main() {
  const statelessTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(statelessTransport);
  app.listen(3000, () => {
    console.error("Listening on http://localhost:3000");
  });
  app.post("/quote", async (req: any, res: any) => {
    statelessTransport.handleRequest(req, res, req.body);
  });
}


main().then(() => {
  console.error("Quote of the Day application has started.");
}).catch((error) => {
  console.error("Error starting the application:", error);
});