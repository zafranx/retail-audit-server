import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, name, role = 'Auditor' } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: data.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      session: data.session,
      user: data.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed', details: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);

    if (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
};
