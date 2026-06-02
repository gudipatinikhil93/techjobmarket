import { createClient } from '@supabase/supabase-js';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function getEnv(key) {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  if (Object.assign(__vite_import_meta_env__, { SUPABASE_URL: "https://visxcznbunrqqkqgxajo.supabase.co", SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc3hjem5idW5ycXFrcWd4YWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTc4MjksImV4cCI6MjA5NTk3MzgyOX0.wASUm7ZVD1RpJeRKBe8RVf_fS1QJbOLYTlNOwG4jx3M", SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc3hjem5idW5ycXFrcWd4YWpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM5NzgyOSwiZXhwIjoyMDk1OTczODI5fQ._2fTYhT7ynunxdFo6UNLgwXpDq2aZW2pofwnsSFhRcc", _: "/usr/bin/npm" }) && Object.assign(__vite_import_meta_env__, { SUPABASE_URL: "https://visxcznbunrqqkqgxajo.supabase.co", SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc3hjem5idW5ycXFrcWd4YWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTc4MjksImV4cCI6MjA5NTk3MzgyOX0.wASUm7ZVD1RpJeRKBe8RVf_fS1QJbOLYTlNOwG4jx3M", SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc3hjem5idW5ycXFrcWd4YWpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM5NzgyOSwiZXhwIjoyMDk1OTczODI5fQ._2fTYhT7ynunxdFo6UNLgwXpDq2aZW2pofwnsSFhRcc", _: "/usr/bin/npm" })[key]) {
    return Object.assign(__vite_import_meta_env__, { SUPABASE_URL: "https://visxcznbunrqqkqgxajo.supabase.co", SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc3hjem5idW5ycXFrcWd4YWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTc4MjksImV4cCI6MjA5NTk3MzgyOX0.wASUm7ZVD1RpJeRKBe8RVf_fS1QJbOLYTlNOwG4jx3M", SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc3hjem5idW5ycXFrcWd4YWpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM5NzgyOSwiZXhwIjoyMDk1OTczODI5fQ._2fTYhT7ynunxdFo6UNLgwXpDq2aZW2pofwnsSFhRcc", _: "/usr/bin/npm" })[key];
  }
  return void 0;
}
const supabaseUrl = getEnv("SUPABASE_URL");
const supabaseAnonKey = getEnv("SUPABASE_ANON_KEY");
const supabaseServiceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
const activeKey = supabaseServiceKey || supabaseAnonKey;
if (!supabaseUrl || !activeKey) {
  console.warn("--- WARNING: Supabase credentials are missing ---");
}
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  activeKey || "placeholder"
);

export { supabase as s };
