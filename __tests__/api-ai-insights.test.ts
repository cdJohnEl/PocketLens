import { NextRequest } from 'next/server';
import handler from '../app/api/ai-insights/route';

describe('/api/ai-insights endpoint', () => {
  it('returns insights for valid transactions', async () => {
    const req = new NextRequest('http://localhost/api/ai-insights', {
      method: 'POST',
      body: JSON.stringify({ transactions: [{ amount: 100, type: 'Income', category: 'Salary', date: '2025-09-20' }] }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await handler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.insights).toBeDefined();
  });
});
