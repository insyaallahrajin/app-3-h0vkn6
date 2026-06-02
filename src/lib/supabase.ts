import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://jqsqhhqfdrdnjdwxopzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc3FoaHFmZHJkbmpkd3hvcHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTQ3MjcsImV4cCI6MjA5NTg5MDcyN30._ecGfmP0y2ZtHU3Zz8L1Uwtbd2ckgFXh4XZegGZBZm8'
);