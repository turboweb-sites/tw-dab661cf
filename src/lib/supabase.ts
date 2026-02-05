import { createClient } from '@supabase/supabase-js';

// ⚠️ VALUES INJECTED BY TURBOWEB AT PUBLISH TIME
// In preview: empty values (Supabase disabled)
// In production: real values from environment
const SUPABASE_URL = 'https://afmjwytlktwvrjwqorfh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbWp3eXRsa3R3dnJqd3FvcmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTA3NDgsImV4cCI6MjA4NTAyNjc0OH0.DpYsshHSmmK5_1Jjjfk32cvllfyNgoyDq_Co85QnA-g';
const TABLE_PREFIX = 'p_dab661cf_6915_44c6_a649_03b6f8d30958_';

// Create client (placeholder URL in preview mode)
export const supabase = createClient(
  SUPABASE_URL.startsWith('__') ? 'https://placeholder.supabase.co' : SUPABASE_URL,
  SUPABASE_ANON_KEY.startsWith('__') ? 'eyJhbGciOiJIUzI1NiJ9.placeholder' : SUPABASE_ANON_KEY
);

// Add prefix to table name
const t = (table: string) => TABLE_PREFIX.startsWith('__') ? table : `${TABLE_PREFIX}${table}`;

// Check if Supabase is configured (false in preview)
export const isConfigured = () => !SUPABASE_URL.startsWith('__');

// In-memory storage for preview mode (works without Supabase)
const previewStorage: Record<string, any[]> = {};

// Helper functions for common operations (prefix is added automatically)
// In preview mode: uses in-memory storage. In production: uses Supabase.
export const db = {
  // Get all records
  getAll: async (table: string) => {
    // Preview mode: return in-memory data
    if (!isConfigured()) {
      return previewStorage[table] || [];
    }
    
    const { data, error } = await supabase
      .from(t(table))
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get single record
  getById: async (table: string, id: string) => {
    // Preview mode: find in memory
    if (!isConfigured()) {
      const items = previewStorage[table] || [];
      return items.find(item => item.id === id) || null;
    }
    
    const { data, error } = await supabase
      .from(t(table))
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create record
  create: async (table: string, record: any) => {
    // Preview mode: add to memory
    if (!isConfigured()) {
      const newRecord = { 
        ...record, 
        id: crypto.randomUUID(), 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      if (!previewStorage[table]) previewStorage[table] = [];
      previewStorage[table].unshift(newRecord);
      return newRecord;
    }
    
    const { data, error } = await supabase
      .from(t(table))
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update record
  update: async (table: string, id: string, updates: any) => {
    // Preview mode: update in memory
    if (!isConfigured()) {
      const items = previewStorage[table] || [];
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
        return items[index];
      }
      return null;
    }
    
    const { data, error } = await supabase
      .from(t(table))
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete record
  delete: async (table: string, id: string) => {
    // Preview mode: remove from memory
    if (!isConfigured()) {
      const items = previewStorage[table] || [];
      previewStorage[table] = items.filter(item => item.id !== id);
      return;
    }
    
    const { error } = await supabase
      .from(t(table))
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};