export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    try {
        const apiKey = process.env.OPENAI_API_KEY; 
        
        if (!apiKey) {
            return res.status(200).json({ 
                reply: "I am currently in demo mode. Please add your OpenAI API key to Vercel to enable real AI.",
                isDemo: true 
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are HERSPACE, a friendly women\'s health AI. Provide short, educational, safe advice on menstrual health, hygiene, and self-care. Never diagnose or prescribe medicine.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 150
            })
        });
        
        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'AI service unavailable' });
    }
}
