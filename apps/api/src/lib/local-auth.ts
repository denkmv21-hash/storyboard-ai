/**
 * Local Authentication for Development
 * Простая аутентификация без внешних зависимостей
 */

import crypto from 'crypto';

interface User {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
  credits: number;
  subscriptionTier: 'free' | 'basic' | 'pro' | 'enterprise';
  createdAt: Date;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}

// In-memory storage for development
const users: Map<string, User> = new Map();
const sessions: Map<string, { user: User; session: Session }> = new Map();

function generateId(): string {
  return crypto.randomUUID();
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export const localAuth = {
  signup: async (email: string, password: string, name?: string) => {
    // Check if user exists
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === email
    );

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user: User = {
      id: generateId(),
      email,
      name: name || null,
      passwordHash: hashPassword(password),
      credits: 10, // Free credits for new users
      subscriptionTier: 'free',
      createdAt: new Date(),
    };

    users.set(user.id, user);

    // Create session
    const session = localAuth.createSession(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.name,
          credits: user.credits,
          subscription_tier: user.subscriptionTier,
        },
      },
      session,
    };
  },

  login: async (email: string, password: string) => {
    // Find user by email
    const user = Array.from(users.values()).find((u) => u.email === email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    if (user.passwordHash !== hashPassword(password)) {
      throw new Error('Invalid credentials');
    }

    // Create session
    const session = localAuth.createSession(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.name,
          credits: user.credits,
          subscription_tier: user.subscriptionTier,
        },
      },
      session,
    };
  },

  createSession: (user: User): Session => {
    const session: Session = {
      access_token: generateToken(),
      refresh_token: generateToken(),
      expires_in: 3600, // 1 hour
      expires_at: Date.now() + 3600000,
    };

    sessions.set(session.access_token, { user, session });

    return session;
  },

  getSession: (accessToken: string) => {
    const data = sessions.get(accessToken);
    if (!data) {
      return null;
    }

    // Check if session is expired
    if (Date.now() > data.session.expires_at) {
      sessions.delete(accessToken);
      return null;
    }

    return data;
  },

  logout: (accessToken: string) => {
    sessions.delete(accessToken);
  },

  // Get user by email (for testing)
  getUserByEmail: (email: string) => {
    return Array.from(users.values()).find((u) => u.email === email);
  },

  // Clear all data (for testing)
  clear: () => {
    users.clear();
    sessions.clear();
  },
};
