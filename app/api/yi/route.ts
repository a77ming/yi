import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { model, messages, temperature } = await req.json();

  try {
    const response = await fetch('https://api.lingyiwanwu.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 9298040603f44028a2304a069753f3a0`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from API:', errorText);
      return NextResponse.json({ error: 'Failed to fetch response from API', details: errorText }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as any).message }, { status: 500 });
  }
};
