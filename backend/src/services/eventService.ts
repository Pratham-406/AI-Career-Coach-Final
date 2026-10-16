import { Response } from 'express';

interface SSEClient {
  id: string;
  res: Response;
  userId?: string;
}

class EventService {
  private clients: SSEClient[] = [];

  public addClient(id: string, res: Response, userId?: string) {
    this.clients.push({ id, res, userId });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId: id, timestamp: new Date().toISOString() })}\n\n`);

    res.on('close', () => {
      this.removeClient(id);
    });
  }

  public removeClient(id: string) {
    this.clients = this.clients.filter(c => c.id !== id);
  }

  public broadcast(eventType: string, data: any, targetUserId?: string) {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify({ ...data, timestamp: new Date().toISOString() })}\n\n`;

    this.clients.forEach(client => {
      if (!targetUserId || !client.userId || client.userId === targetUserId) {
        try {
          client.res.write(payload);
        } catch {
          this.removeClient(client.id);
        }
      }
    });
  }
}

export const eventService = new EventService();
