export const curriculum = [
{day:1,phase:1,title:'Local Setup, Canvas UI & JSON Item Structure ($json, $input)',sourceName:'n8n Academy — N8N101 Essentials',sourceUrlOrQuery:'https://learn.n8n.io/',deliverable:'Run npx n8n locally and build a 3-node trigger-to-action test workflow.',
coreConcept:"Imagine n8n as a magical conveyor belt in a factory. Each box on the belt is a piece of data (like a customer order). Every machine the belt passes through (a 'node') does something to that box — reads it, transforms it, or sends it somewhere. Today you're building your first mini-factory and learning what's inside each box (JSON — just a fancy word for labeled data, like a name-tag with info).",
tutorialTitle:'n8n 101 Essentials — Full Beginner Course',
tutorialUrl:'https://learn.n8n.io/',
steps:[
"Open n8n in your browser (run 'npx n8n' in your terminal first, then go to http://localhost:5678). Click 'New Workflow' in the top-right.",
"Click the '+' button in the center of the canvas. Search for 'Manual Trigger' and add it. This is your start button.",
"Click the '+' icon on the right side of the Manual Trigger node. Search for 'Set' (also called Edit Fields). Add it and set a field called 'name' with the value 'Hello World'.",
"Add one more node — search for 'No Operation' (a do-nothing placeholder). Connect all three. Click 'Test Workflow' and check that you can see your data flowing through each node."
],
boss:false},

{day:2,phase:1,title:'Core Logic Nodes (If, Switch, Edit Fields/Set, Merge, Split Out)',sourceName:'Official n8n Text Course — Level 1',sourceUrlOrQuery:'https://docs.n8n.io/courses/level-one/',deliverable:'Build a workflow that fetches dummy orders, splits items out, and routes VIP orders (>5,000 BDT) to a separate branch.',
coreConcept:"Today you're adding traffic lights and roundabouts to your factory belt. The 'If' node is a yes/no gate: if an order is big, go left; if small, go right. 'Split Out' is like unpacking a box of oranges one by one so each orange gets handled separately. By the end of today, your workflow will make real decisions — just like a smart employee sorting mail.",
tutorialTitle:'n8n Level 1 Course — Logic & Flow Control',
tutorialUrl:'https://docs.n8n.io/courses/level-one/',
steps:[
"Add an HTTP Request node set to GET https://jsonplaceholder.typicode.com/todos — this gives you fake data to work with. Run it and inspect the JSON output.",
"Add a 'Split Out' node after the HTTP Request. Set the 'Field To Split Out' to the array field returned. Each item now flows as a separate piece.",
"Add an 'If' node. Set the condition: Number({{ $json.id }}) > 10 (simulating a 'VIP' threshold). This creates two branches: True and False.",
"Connect a 'Set' node on the True branch that adds a field 'tag' = 'VIP'. Connect another Set on the False branch with 'tag' = 'Standard'. Test and confirm both branches fire correctly."
],
boss:false},

{day:3,phase:1,title:'JavaScript Inside the Code Node & Data Transformation',sourceName:'n8n Docs Code Node Guide + Level 2 Course',sourceUrlOrQuery:'https://docs.n8n.io/code/code-node/',deliverable:'Write a JS snippet using $input.all() to clean phone numbers, calculate totals, and return formatted JSON.',
coreConcept:"Sometimes the factory machines aren't enough — you need a custom robot arm. That's the Code node: you write a small JavaScript recipe and it does exactly what you describe. Think of it like writing instructions in plain English but for a computer. '$input.all()' just means 'grab every box on the belt and let me work with them all at once'.",
tutorialTitle:'n8n Code Node — Full Guide with Examples',
tutorialUrl:'https://docs.n8n.io/code/code-node/',
steps:[
"Add a Code node to your canvas. In the Code editor, type: const items = $input.all(); — this grabs all incoming data items.",
"Add a transformation: return items.map(item => ({ json: { ...item.json, phone: item.json.phone?.replace(/\\D/g, '').slice(-10) || 'N/A' } })); — this cleans phone numbers.",
"Extend your code to also calculate a total field: add price: (item.json.quantity || 1) * (item.json.unitPrice || 100) inside your map.",
"Connect a Set node after the Code node to pick only the fields you want to output (name, phone, price). Run the full workflow and verify the output is clean."
],
boss:false},

{day:4,phase:1,title:'Webhooks (GET/POST) & Respond to Webhook Node',sourceName:'n8n Docs Webhook Node + YouTube: Nick Saraev n8n Webhooks Tutorial',sourceUrlOrQuery:'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/',deliverable:'Build an HTML/Next.js form or Postman request that sends JSON to n8n and receives a processed JSON response back.',
coreConcept:"A webhook is like giving your workflow a phone number. When someone calls that number (sends data to that URL), your workflow wakes up and does its job. Today you'll make n8n wait for a knock on the door, process what comes in, and politely reply back — all automatically. This is how most real-world automations start!",
tutorialTitle:'n8n Webhooks — Trigger Workflows from Anywhere',
tutorialUrl:'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/',
steps:[
"Add a Webhook node. Set HTTP Method to POST. Copy the 'Test URL' shown. Leave 'Response Mode' as 'Last Node' for now.",
"Add a Code node after it: return [{ json: { received: $input.first().json, processed: true, timestamp: new Date().toISOString() } }];",
"Add a 'Respond to Webhook' node at the end. Set 'Response Body' to Expression and type: {{ JSON.stringify($json) }}. Set Content-Type to application/json.",
"Open Postman (or use curl). Send a POST request to your Webhook test URL with body: {\"name\": \"Test\", \"amount\": 5000}. You should get a live JSON response back!"
],
boss:false},

{day:5,phase:1,title:'HTTP Request Node, REST APIs, Bearer Auth & OAuth2',sourceName:'n8n Academy — N8N102 Integrations: APIs & Connected Workflows',sourceUrlOrQuery:'https://learn.n8n.io/',deliverable:'Authenticate with an external REST API using Bearer tokens/headers and parse the returned payload.',
coreConcept:"APIs are like waiters at a restaurant. You (n8n) place an order with the right 'credentials' (like a VIP card — that's the Bearer token), and the kitchen (the external service) brings you exactly the data you asked for. Today you'll learn to talk to any external service professionally, using the secret handshakes (auth headers) that prove you're allowed in.",
tutorialTitle:'n8n 102 — Integrations: APIs & Connected Workflows',
tutorialUrl:'https://learn.n8n.io/',
steps:[
"Add an HTTP Request node. Set URL to https://api.github.com/users/github (a free public API). Set Method to GET. Run it and inspect the JSON.",
"Now create a free account on weatherapi.com or similar. Go to n8n Credentials → New → Header Auth. Set Header Name to 'key' and paste your API key.",
"In your HTTP Request node, set Authentication to 'Header Auth' and pick the credential you just made. Update the URL to the weather endpoint.",
"Add a Set node to extract only the fields you want from the response (city name, temperature, condition). This is a complete authenticated API call!"
],
boss:true},

{day:6,phase:2,title:'AI Agent Node vs. Basic LLM Chain & System Prompting',sourceName:'YouTube: Futurepedia — From Zero to Your First AI Agent in 25 Minutes (n8n)',sourceUrlOrQuery:'https://www.youtube.com/results?search_query=Futurepedia+From+Zero+to+Your+First+AI+Agent+in+25+Minutes+n8n',deliverable:'Build your first conversational agent inside n8n with a role-based System Prompt.',
coreConcept:"An LLM Chain is like asking a very smart intern to write one email. An AI Agent is like hiring that same intern full-time — they can use tools (like a calendar or search engine), remember context, and make decisions. The System Prompt is their job description: 'You are a helpful support agent for XYZ company. Never discuss competitors.' Today you'll create your first AI employee.",
tutorialTitle:'From Zero to Your First AI Agent in 25 Minutes (n8n)',
tutorialUrl:'https://www.youtube.com/results?search_query=Futurepedia+From+Zero+to+Your+First+AI+Agent+in+25+Minutes+n8n',
steps:[
"Add a 'Chat Trigger' node — this gives your agent a chat interface. Connect it to an 'AI Agent' node (not the Basic LLM Chain).",
"Inside the AI Agent node, add a Chat Model sub-node. Use Google Gemini (free) — set the model to gemini-1.5-flash. Add your API key from aistudio.google.com.",
"Click the System Prompt field in the AI Agent. Write a clear persona: 'You are Maya, a friendly customer support agent for n8n Academy. Help students with their workflow questions. Keep answers under 150 words.'",
"Test your agent in the Chat preview. Ask it: 'How do I use the If node?' — it should respond in character. Try breaking it by asking about competitors."
],
boss:false},

{day:7,phase:2,title:'Connecting Free/Low-Cost LLM APIs (Gemini 2.5 Flash, Groq, OpenAI)',sourceName:'Google AI Studio + n8n Advanced AI docs',sourceUrlOrQuery:'https://aistudio.google.com/',deliverable:'Connect a free Gemini 2.5 Flash API key to your n8n agent for $0 testing.',
coreConcept:"Different AI brains have different strengths and prices. Gemini Flash is lightning-fast and free — great for testing. Groq is incredibly fast (think race car). OpenAI GPT-4 is the gold standard but costs money. Today you'll set up multiple brains like a tool belt, so you always use the right one for each job without wasting money.",
tutorialTitle:'Google AI Studio — Get Your Free Gemini API Key',
tutorialUrl:'https://aistudio.google.com/',
steps:[
"Go to aistudio.google.com → click 'Get API Key' → copy the key. In n8n, go to Credentials → New → Google Gemini API. Paste the key and save.",
"Go to console.groq.com → sign up free → create an API key. In n8n, add a new Credential → Groq API. Paste and save.",
"In your AI Agent from yesterday, swap the Chat Model sub-node. Try Gemini 2.5 Flash and test with the same prompt. Note the speed and quality.",
"Build a small comparison: duplicate the agent, use Groq Llama3 in the second one. Ask both the same question and compare outputs side by side."
],
boss:false},

{day:8,phase:2,title:'Conversation Memory (Window Buffer & Postgres/SQLite Chat Memory)',sourceName:'n8n Docs Memory Sub-nodes + YouTube: Nate Herk n8n Chat Memory Tutorial',sourceUrlOrQuery:'https://docs.n8n.io/advanced-ai/examples/understand-memory/',deliverable:"Pass a user's phone number or ID as sessionId into memory so it remembers context across messages.",
coreConcept:"Without memory, every message to your AI is like meeting it for the first time — it has zero context. Memory nodes are like giving your AI a notepad. Window Buffer Memory keeps a short recent history (like remembering the last 5 messages). Postgres/SQLite Memory saves it permanently to a database, so even if you restart n8n, the conversation history survives.",
tutorialTitle:'Understanding Memory in n8n AI Agents',
tutorialUrl:'https://docs.n8n.io/advanced-ai/examples/understand-memory/',
steps:[
"Open your AI Agent node. Click the '+' under the Memory slot. Add 'Window Buffer Memory'. Set 'Context Window Length' to 5 messages. Test a conversation — the agent should now remember earlier messages.",
"Now test multi-turn: say 'My name is Alex', then ask 'What is my name?' — the agent should remember. Without memory, it couldn't do this.",
"Set up a session ID: in the Chat Trigger, the sessionId is available as {{ $('Chat Trigger').item.json.sessionId }}. Pass this into the Memory node's Session ID field so each user gets their own private memory.",
"Optional upgrade: replace Window Buffer with Postgres Chat Memory. Set up a free Supabase database, add the connection string to n8n Credentials, and test that memory persists after restarting n8n."
],
boss:false},

{day:9,phase:2,title:'Structured Output Parser & Auto-Fixing Parser (Strict JSON Schemas)',sourceName:'n8n Docs Output Parser Sub-nodes + n8n.io/workflows — Structured Output',sourceUrlOrQuery:'https://docs.n8n.io/advanced-ai/examples/understand-structured-output/',deliverable:'Force an LLM to read a messy customer message and output strict JSON (intent, product, phone, sentiment).',
coreConcept:"Raw LLM output is like asking someone to fill a form by speaking — the information is there but it's messy and inconsistent. A Structured Output Parser is like giving them a printed form with boxes to fill in. You define exactly what fields you need (like 'intent', 'product', 'phone') and the AI must return data in that exact format, ready to plug into your next automation step.",
tutorialTitle:'Structured Output Parsers in n8n — Full Guide',
tutorialUrl:'https://docs.n8n.io/advanced-ai/examples/understand-structured-output/',
steps:[
"Add a Basic LLM Chain node (simpler than a full agent for this task). Connect your Gemini model to it.",
"In the LLM Chain, add an 'Output Parser' sub-node → choose 'Structured Output Parser'. Define a JSON schema with fields: intent (string), product (string), phone (string), sentiment (enum: positive/neutral/negative).",
"Set the prompt to: 'Analyze this customer message and extract: intent, product mentioned, phone number, and sentiment. Message: {{ $json.message }}'",
"Test it with a messy message like: 'Hey I ordered the blue headphones, order #4421, can you help me? My number is 017-1234-5678. Very unhappy!!' — verify the output is clean JSON."
],
boss:false},

{day:10,phase:2,title:'Single-Agent Tool Calling (Google Sheets, Gmail, Google Calendar)',sourceName:'David Ondrej — Build Everything with AI Agents + N8N103 AI Course',sourceUrlOrQuery:'https://www.youtube.com/results?search_query=David+Ondrej+Build+Everything+with+AI+Agents+n8n',deliverable:'Build an AI receptionist that checks Google Calendar availability and books a meeting slot automatically.',
coreConcept:"A tool-calling agent is like a super-assistant who doesn't just answer questions but actually does things for you. Tell it 'Book a meeting with Rahul tomorrow at 3pm' and it will actually open your calendar, check if you're free, and create the event — without you lifting a finger. Tools are the hands of your AI brain.",
tutorialTitle:'Build Everything with AI Agents in n8n — David Ondrej',
tutorialUrl:'https://www.youtube.com/results?search_query=David+Ondrej+Build+Everything+with+AI+Agents+n8n',
steps:[
"Connect your Google account to n8n: Credentials → New → Google OAuth2 API. Enable the Calendar, Sheets, and Gmail APIs in your Google Cloud Console.",
"In your AI Agent, add tool sub-nodes: '+' under Tools → Google Calendar → 'Get Events' (to check availability) and 'Create Event' (to book).",
"Write a clear tool description for each: 'Use this to check if a time slot is available on the calendar before booking anything.' Good descriptions = smarter agent decisions.",
"Test with: 'Book a 30-minute call with client@email.com tomorrow at 10am, title: Demo Call'. Watch n8n check availability then create the actual calendar event."
],
boss:false},

{day:11,phase:2,title:'Multi-Agent Teams & "Call n8n Workflow" Tool',sourceName:'YouTube: Nate Herk — I Built the Ultimate Team of AI Agents in n8n',sourceUrlOrQuery:'https://www.youtube.com/results?search_query=Nate+Herk+Ultimate+Team+of+AI+Agents+n8n',deliverable:'Build 1 Manager Agent that delegates tasks to 2 separate n8n sub-workflows (Sales Sub-Agent and Support Sub-Agent).',
coreConcept:"One AI trying to do everything is like one employee doing every job in a company — they burn out and make mistakes. Multi-agent systems are like a real team: a Manager AI reads the customer message, decides who should handle it, and passes it to the right specialist. The Sales Agent handles new inquiries; the Support Agent handles problems. Each expert focuses on what they do best.",
tutorialTitle:'I Built the Ultimate Team of AI Agents in n8n — Nate Herk',
tutorialUrl:'https://www.youtube.com/results?search_query=Nate+Herk+Ultimate+Team+of+AI+Agents+n8n',
steps:[
"Create 'Workflow A — Sales Sub-Agent': a simple AI Agent workflow that handles sales questions. It should respond with product info and pricing. Set a Webhook trigger so it can be called from outside.",
"Create 'Workflow B — Support Sub-Agent': another AI Agent that handles complaints and returns. Give it a different system prompt focused on empathy and solutions.",
"Create the Manager Workflow: add an AI Agent with the prompt 'Read the message. If it is a new sales inquiry, call the Sales Agent. If it is a support issue, call the Support Agent.'",
"Add 'Call n8n Workflow' tool nodes to the Manager, pointing at Workflow A and B by their IDs. Test: send 'I want to buy the Pro plan' — it should route to Sales. Send 'My order is broken' — it should route to Support."
],
boss:true},

{day:12,phase:3,title:'Vector DB Setup (Supabase pgvector / Pinecone) & Document Chunking',sourceName:"Nate Herk — From Zero to RAG Agent: Full Beginner's Course",sourceUrlOrQuery:'https://www.youtube.com/results?search_query=Nate+Herk+From+Zero+to+RAG+Agent',deliverable:'Set up a free Supabase (pgvector) or Pinecone index and test embeddings.',
coreConcept:"Imagine your AI needs to search through 500 pages of company documents to answer a question. Reading all 500 pages every time is too slow and expensive. A Vector Database is like a super-smart library index — it converts each paragraph into a 'fingerprint' (a list of numbers called an embedding) and stores it. When you ask a question, it instantly finds the paragraphs with similar fingerprints.",
tutorialTitle:'From Zero to RAG Agent — Full Beginner Course (Nate Herk)',
tutorialUrl:'https://www.youtube.com/results?search_query=Nate+Herk+From+Zero+to+RAG+Agent',
steps:[
"Go to supabase.com → New Project (free tier). Once created, go to SQL Editor and run: CREATE EXTENSION IF NOT EXISTS vector; — this enables the pgvector extension.",
"Run the n8n vector table setup SQL: CREATE TABLE documents (id bigserial primary key, content text, metadata jsonb, embedding vector(1536)); — this is where your document chunks will live.",
"In n8n, add a 'Supabase Vector Store' node. Add a new Credential with your Supabase URL and service_role key (from Project Settings → API).",
"Add a 'Default Data Loader' and test embedding a simple text: type 'Hello, this is a test document' and run the workflow. Check your Supabase table — you should see a row with an embedding column filled with numbers."
],
boss:false},

{day:13,phase:3,title:'Automated Document Ingestion Pipeline (Google Drive → Vector Store)',sourceName:'Nate Herk — Step by Step: RAG AI Agents Got Even Better (Supabase + n8n)',sourceUrlOrQuery:'https://www.youtube.com/results?search_query=Nate+Herk+RAG+AI+Agents+Supabase+n8n',deliverable:'Build a workflow that watches a Google Drive folder, splits new PDFs into chunks, and updates Supabase automatically.',
coreConcept:"Instead of manually uploading documents, imagine a smart filing system that watches a Google Drive folder. The moment you drop a PDF in, it automatically reads every page, chops it into small readable pieces (chunks), converts each chunk into a fingerprint (embedding), and files it in your vector database. This is how enterprise knowledge bases work!",
tutorialTitle:'RAG AI Agents Got Even Better — Supabase + n8n (Nate Herk)',
tutorialUrl:'https://www.youtube.com/results?search_query=Nate+Herk+RAG+AI+Agents+Supabase+n8n',
steps:[
"Add a 'Google Drive Trigger' node. Set it to watch a specific folder for new files. Connect your Google OAuth credential.",
"Add a 'Download' node to get the file content, then a 'Extract from File' node set to PDF to get the raw text.",
"Add a 'Recursive Character Text Splitter' node. Set Chunk Size to 500, Chunk Overlap to 50. This breaks the PDF text into manageable pieces.",
"Connect to your Supabase Vector Store node (Insert mode). Add an Embeddings model (Google Gemini Embeddings are free). Drop a PDF into your watched Drive folder and watch the chunks appear in Supabase!"
],
boss:false},

{day:14,phase:3,title:'RAG Retrieval Agent & Grounding Prompts (Zero Hallucinations)',sourceName:'Official n8n RAG Guide + Nate Herk RAG tutorials',sourceUrlOrQuery:'https://n8n.io/rag/',deliverable:'Connect the Vector Store as a tool to your AI Agent and instruct it to cite company policies accurately.',
coreConcept:"RAG stands for Retrieval-Augmented Generation — a fancy way of saying 'look it up before you answer'. Without RAG, an AI makes stuff up (hallucination). With RAG, it first searches your documents for relevant info, then uses that real info to construct its answer. It's like the difference between a student who makes up facts vs. one who checks the textbook first.",
tutorialTitle:'RAG with n8n — Official Guide',
tutorialUrl:'https://n8n.io/rag/',
steps:[
"In your AI Agent node, add a Vector Store tool sub-node. Connect it to your Supabase vector store. Set it to 'Retrieve Documents' mode.",
"Write a grounding system prompt: 'You are a knowledgeable assistant. ONLY answer questions based on the documents retrieved from the knowledge base. If the answer is not in the documents, say: I do not have that information in my knowledge base. Never make up information.'",
"Test with a question that IS in your documents (e.g., a policy from the PDFs you ingested). The agent should cite the correct info.",
"Test with a question NOT in your documents. The agent should say it doesn't know, NOT invent an answer. This is the hallucination test!"
],
boss:false},

{day:15,phase:3,title:'Hybrid RAG (Combining Vector Search + SQL/Tabular Database Tool)',sourceName:'The AI Automators — n8n RAG Masterclass',sourceUrlOrQuery:'https://www.youtube.com/results?search_query=The+AI+Automators+n8n+RAG+Masterclass',deliverable:'Build an e-commerce agent that uses Vector RAG for return policies and a SQLite/Postgres/Sheets tool for live stock prices.',
coreConcept:"Some questions need the library (policies, documents) and some need a live database (prices, inventory). Hybrid RAG combines both. The agent decides: if someone asks about return policy → search the vector store. If they ask about stock availability → query the live database. It's like an employee who knows when to check the handbook vs. the live inventory system.",
tutorialTitle:'n8n RAG Masterclass — Hybrid Retrieval',
tutorialUrl:'https://www.youtube.com/results?search_query=The+AI+Automators+n8n+RAG+Masterclass',
steps:[
"Set up a simple Google Sheet as your 'live database' with columns: product_name, sku, price, in_stock. Fill in 5-10 sample products.",
"In n8n, add a Google Sheets tool to your AI Agent (Read Rows operation). Give it a description: 'Use this tool to look up live product prices and stock availability. Never use this for policy questions.'",
"Add your Supabase Vector Store tool with description: 'Use this tool to look up company policies, return procedures, and warranty information. Never use this for pricing.'",
"Test: ask 'What is your return policy for electronics?' (should use Vector Store). Then ask 'Is the AirPods Pro in stock?' (should use Sheets). The agent must pick the right tool each time."
],
boss:false},

{day:16,phase:3,title:'Binary Files, PDF Text Extraction & Image/Voice Processing',sourceName:'n8n Template — AI-powered WhatsApp chatbot for text, voice, images, and PDF with RAG',sourceUrlOrQuery:'https://n8n.io/workflows/',deliverable:'Add a Switch node that transcribes incoming audio notes before feeding text to the AI Agent.',
coreConcept:"Most AI workflows only handle text. But real customers send voice messages, photos of broken products, and PDF invoices. Today you'll handle all of them like a pro. n8n can receive a voice message, convert it to text (transcription), pass that text to your AI, and reply — all automatically. This is how WhatsApp business bots work in the real world.",
tutorialTitle:'AI-Powered WhatsApp Chatbot — Voice, Images & PDF',
tutorialUrl:'https://n8n.io/workflows/',
steps:[
"Add a Switch node after your Webhook/Chat Trigger. Create three routes based on message type: text → continue normally. audio → transcription route. document → PDF extraction route.",
"For the audio route: add an HTTP Request node to call OpenAI Whisper API (or Deepgram) with the audio file binary. It returns a text transcript.",
"For the document route: add 'Extract from File' node set to PDF. Output the extracted text.",
"Merge all three routes back to a single point using a Merge node (Combine mode). The AI Agent receives clean text regardless of what format the user sent."
],
boss:true},

{day:17,phase:4,title:'Global Error Handling (Error Trigger Node → Telegram/Slack Alerts)',sourceName:'n8n Docs — Error Handling',sourceUrlOrQuery:'https://docs.n8n.io/flow-logic/error-handling/',deliverable:'Build an Error Workflow that sends an instant Telegram alert with the failed node name and execution URL.',
coreConcept:"In production, workflows will fail — an API goes down, a customer sends unexpected data, a quota runs out. Without error handling, you won't know until an angry client calls. Error handling is your smoke alarm: the moment something breaks, you get an instant message on Telegram or Slack telling you exactly what broke and where. No surprises, no unhappy clients.",
tutorialTitle:'Error Handling in n8n — Full Guide',
tutorialUrl:'https://docs.n8n.io/flow-logic/error-handling/',
steps:[
"Create a brand-new workflow called 'Global Error Handler'. Add an 'Error Trigger' node as the start (this fires whenever ANY other workflow fails).",
"Add a Telegram node (or Slack). Create a Telegram bot via @BotFather and get a bot token + chat ID. Add the credential in n8n.",
"Set the Telegram message to: 🚨 Workflow Failed!\n📋 Workflow: {{ $json.workflow.name }}\n❌ Error: {{ $json.execution.error.message }}\n🔗 {{ $json.execution.url }}",
"Go to n8n Settings → Error Workflow. Select your new error handler workflow. Now create a simple test workflow that intentionally fails (wrong API URL). Trigger it and confirm you receive the Telegram alert."
],
boss:false},

{day:18,phase:4,title:'Rate Limit Protection (Loop Over Items / Split in Batches + Wait Node)',sourceName:'n8n Docs — Loop Over Items',sourceUrlOrQuery:'https://docs.n8n.io/flow-logic/looping/',deliverable:'Build a bulk lead-enrichment loop that processes 50 leads in batches of 5 with a 3-second pause between API calls.',
coreConcept:"External APIs have limits — like a restaurant that can only serve 10 orders per minute. If you blast 50 requests at once, they block you (rate limiting). The solution is to process in small batches with a pause between each batch. It's like being a considerate customer: order 5 items, wait politely, then order 5 more. This prevents 429 errors and keeps your workflows running smoothly.",
tutorialTitle:'Looping in n8n — Loop Over Items & Split in Batches',
tutorialUrl:'https://docs.n8n.io/flow-logic/looping/',
steps:[
"Create a mock dataset: use a Code node to generate 20 fake leads: return Array.from({length:20}, (_, i) => ({json: {id: i+1, email: `lead${i+1}@test.com`, name: `Lead ${i+1}`}}));",
"Add a 'Split in Batches' node. Set 'Batch Size' to 5. This will process 5 leads at a time, automatically looping until all 20 are done.",
"Inside the loop, add an HTTP Request node that calls a free enrichment API (like clearbit.com free tier or just a placeholder URL) for each lead.",
"Add a 'Wait' node after the HTTP Request. Set it to 3 seconds. This creates the pause between batches. Run the workflow and confirm it processes all 20 leads in groups of 5."
],
boss:false},

{day:19,phase:4,title:'Real Chat Channel Integration (WhatsApp Cloud API, Messenger, Telegram)',sourceName:'Meta for Developers Docs + n8n WhatsApp Business Cloud API AI Agent',sourceUrlOrQuery:'https://developers.facebook.com/docs/whatsapp/cloud-api/',deliverable:'Connect local n8n (via Cloudflare Tunnel or ngrok) to a real Telegram or WhatsApp test number.',
coreConcept:"Your workflows live on your computer but clients are on WhatsApp and Telegram. To connect them, you need a 'bridge' — a tunnel that lets external services reach your local n8n. Cloudflare Tunnel is like giving your house a public address so pizza delivery can find you, even though you're in an apartment without a street number. This is how every real WhatsApp business bot is built.",
tutorialTitle:'WhatsApp Cloud API Setup — Meta for Developers',
tutorialUrl:'https://developers.facebook.com/docs/whatsapp/cloud-api/',
steps:[
"Install Cloudflare Tunnel: run 'npm install -g cloudflared' then 'cloudflared tunnel --url http://localhost:5678'. Copy the https URL it gives you — this is your public n8n address.",
"For Telegram (easier to start): create a bot with @BotFather → get the token. Add a Telegram Trigger node in n8n. Paste the public Cloudflare URL as the webhook URL.",
"Build a simple echo bot: Telegram Trigger → AI Agent (with memory) → Telegram (Send Message). The agent replies to whatever the user sends.",
"Test by messaging your Telegram bot from your phone. You should get a live AI response. For WhatsApp: go to developers.facebook.com → create a test app → set your Cloudflare URL as the webhook."
],
boss:false},

{day:20,phase:4,title:'Self-Hosting n8n on a $5 VPS via Docker Compose + SSL + Webhook Auth',sourceName:'Official n8n Docker Compose Guide',sourceUrlOrQuery:'https://docs.n8n.io/hosting/installation/server-setups/docker-compose/',deliverable:'Deploy n8n via Docker Compose with environment variables and header authentication on webhooks.',
coreConcept:"Running n8n on your laptop is fine for learning, but clients need 24/7 reliability. A VPS (Virtual Private Server) is a tiny always-on computer in the cloud that costs $4-6/month. Docker Compose is like a recipe that sets up n8n exactly the same way every time. SSL gives you the padlock (https) so clients trust your webhooks. Webhook auth adds a secret password so random people can't trigger your workflows.",
tutorialTitle:'n8n Docker Compose — Self-Hosting on a VPS',
tutorialUrl:'https://docs.n8n.io/hosting/installation/server-setups/docker-compose/',
steps:[
"Get a $5 VPS on DigitalOcean, Hetzner, or Vultr. SSH into it. Run: apt update && apt install docker.io docker-compose -y",
"Create a docker-compose.yml file with n8n service, postgres service, and traefik for SSL. Use the official n8n docker-compose template from docs.n8n.io.",
"Set environment variables: N8N_BASIC_AUTH_ACTIVE=true, N8N_BASIC_AUTH_USER, N8N_BASIC_AUTH_PASSWORD. These protect your n8n instance with a login.",
"Point your domain (or a free subdomain from duckdns.org) to your VPS IP. Run 'docker-compose up -d'. Visit your domain — you should see n8n with a valid SSL certificate (padlock icon)!"
],
boss:false},

{day:21,phase:4,title:'Build & Record Loom Walkthroughs for Your 3 Client Portfolio Projects',sourceName:'Loom + Your 3 Built Workflows',sourceUrlOrQuery:'https://www.loom.com/',deliverable:'Record three 2-minute screen recordings showing the business problem, live demo, and clean n8n workflow for: (1) E-com Order/Support Bot, (2) AI Lead Qualifier, (3) Content Engine.',
coreConcept:"Clients don't understand technical workflows — they understand results. A 2-minute Loom video is worth 10 pages of documentation. You show the business problem (relatable), then the live demo (impressive), then the clean workflow (proof you built it). This video becomes your portfolio piece that you share on LinkedIn and in client pitches. It's how n8n freelancers land their first ৳50,000 project.",
tutorialTitle:'Loom — Record Your Screen in Seconds',
tutorialUrl:'https://www.loom.com/',
steps:[
"Install Loom extension (free). Open your E-commerce Support Bot workflow. Record your screen: explain the business problem first (30 sec), show the live chat in action (60 sec), zoom into the workflow nodes (30 sec).",
"Repeat for your AI Lead Qualifier: show a sample lead coming in, the AI qualifying it, and the result going to a CRM or Sheets. Keep it under 2 minutes.",
"Record the Content Engine workflow: show the trigger (new topic idea), the AI generating content, and the auto-post to a channel or document.",
"Upload all 3 videos to Loom. Copy the share links. Paste them into the Demo Video URL fields in this app's Portfolio tab. Share on LinkedIn with the caption: 'I built 3 AI automation projects in 21 days. Here's what they do.'"
],
boss:true},
].map(d => ({
  ...d,
  id: d.day,
  xp: 100,
  completed: false,
  notes: '',
  demoUrl: '',
  workflowJson: '',
}));

export const phases=[
  {id:1,name:'Foundations & Core Data Plumbing',range:'Days 1–5',icon:'01'},
  {id:2,name:'AI Agents, Memory & Tool Calling',range:'Days 6–11',icon:'02'},
  {id:3,name:'Agentic RAG & Vector Databases',range:'Days 12–16',icon:'03'},
  {id:4,name:'Production Engineering & Portfolio',range:'Days 17–21',icon:'04'}
];
