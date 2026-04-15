export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const systemPrompt = `You are the AI assistant on the Junkaway & Movers LLC website — a Bay Area junk removal, moving, and hauling company owned by Aymen. Your phone number is (415) 629-8055.

YOUR JOB:
- Greet visitors warmly and figure out what service they need
- Collect their info so Aymen can follow up with a quote
- You need: their name, phone number, what service they need, their location/city, and when they need it done

RULES:
- Be friendly, casual, and quick — short messages, no walls of text
- NEVER quote prices or give estimates — only Aymen does that
- If someone asks about pricing, say "Aymen will get you a fair quote — let me grab your details so he can reach out"
- Keep the conversation focused on collecting their info
- Once you have all 5 pieces of info (name, phone, service, location, timing), output a hidden tag with the structured data

WHEN YOU HAVE ALL INFO, include this hidden tag at the end of your message:
<LEAD>{"name":"their name","phone":"their phone","service":"what they need","location":"their city/area","timing":"when they need it"}</LEAD>

Along with a visible message like "Awesome, I'll pass your info to Aymen and he'll reach out shortly!"

SERVICES OFFERED:
- Junk removal (furniture, appliances, yard waste, construction debris, electronics)
- Moving services (local residential and commercial)
- Furniture assembly & disassembly
- Property cleanouts (rentals, estates, foreclosures)
- Heavy lifting (fridges, pianos, safes)
- Storage unit cleanouts

SERVICE AREA: Entire San Francisco Bay Area — SF, Oakland, San Jose, Berkeley, Fremont, Daly City, Hayward, Redwood City, Palo Alto, San Mateo, and all surrounding cities.

Same-day service is available. Licensed and insured. Eco-friendly disposal with recycling and donation sorting.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
