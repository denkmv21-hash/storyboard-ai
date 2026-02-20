/**
 * Mock Redis client for development without Redis
 */

interface MockRedisData {
  [key: string]: {
    value: string;
    expires?: number;
  };
}

class MockRedis {
  private data: MockRedisData = {};

  async ping(): Promise<string> {
    return 'PONG';
  }

  async get(key: string): Promise<string | null> {
    const item = this.data[key];
    if (!item) return null;
    
    if (item.expires && Date.now() > item.expires) {
      delete this.data[key];
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string, options?: { EX?: number }): Promise<void> {
    this.data[key] = {
      value,
      expires: options?.EX ? Date.now() + options.EX * 1000 : undefined,
    };
  }

  async del(key: string): Promise<void> {
    delete this.data[key];
  }

  async lpush(key: string, value: string): Promise<void> {
    const item = this.data[key];
    const list = item ? JSON.parse(item.value) : [];
    list.unshift(value);
    this.data[key] = { value: JSON.stringify(list) };
  }

  async rpop(key: string): Promise<string | null> {
    const item = this.data[key];
    if (!item) return null;
    
    const list = JSON.parse(item.value);
    if (list.length === 0) return null;
    
    const popped = list.pop();
    this.data[key] = { value: JSON.stringify(list) };
    return popped;
  }

  async brpop(key: string): Promise<[string, string] | null> {
    // For mock, just return immediately
    const result = await this.rpop(key);
    if (!result) return null;
    return [key, result];
  }

  async expire(key: string, seconds: number): Promise<void> {
    const item = this.data[key];
    if (item) {
      item.expires = Date.now() + seconds * 1000;
    }
  }

  async close(): Promise<void> {
    this.data = {};
  }
}

export const mockRedis = new MockRedis();
export default mockRedis;
