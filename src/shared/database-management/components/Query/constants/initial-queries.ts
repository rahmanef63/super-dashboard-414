import { QueryItem } from './types';

export const initialQueries: QueryItem[] = [
    {
        name: "Drop Existing Tables",
        description: "Drop all existing tables to start fresh",
        query: `
-- Drop tables in correct order due to dependencies
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS user_dashboards CASCADE;
DROP TABLE IF EXISTS dashboards CASCADE;
DROP TABLE IF EXISTS users CASCADE;`.trim()
    },
    {
        name: "Create Users Table",
        description: "Create users table with dashboard arrays",
        query: `
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    avatar VARCHAR(255),
    default_dashboard_id UUID,
    dashboard_ids UUID[] DEFAULT '{}',
    dashboard_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (id, email, name, role)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin@example.com',
    'Admin User',
    'admin'
) ON CONFLICT (id) DO NOTHING;`.trim()
    },
    {
        name: "Create Dashboards Table",
        description: "Create dashboards table with menu items JSONB",
        query: `
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255) DEFAULT 'layout-dashboard',
    plan VARCHAR(50) DEFAULT 'Personal',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    menu_items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create default dashboard
INSERT INTO dashboards (id, name, description, logo, plan)
VALUES (
    'b24c5f8a-5e25-4f9d-8492-9bf5f418c408',
    'Main Dashboard',
    'Default dashboard for all users',
    'layout-dashboard',
    'Personal'
) ON CONFLICT (id) DO NOTHING;`.trim()
    },
    {
        name: "Create Menu Items Table",
        description: "Create menu items table with hierarchy",
        query: `
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    url JSONB,
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    order_index INTEGER,
    type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_dashboard_id ON menu_items(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON menu_items(parent_id);`.trim()
    },
    {
        name: "Link Default Dashboard to Admin",
        description: "Add default dashboard to admin user",
        query: `
-- Update admin user with default dashboard
UPDATE users 
SET 
    default_dashboard_id = 'b24c5f8a-5e25-4f9d-8492-9bf5f418c408',
    dashboard_ids = array_append(dashboard_ids, 'b24c5f8a-5e25-4f9d-8492-9bf5f418c408'),
    dashboard_roles = array_append(dashboard_roles, 'owner')
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';`.trim()
    },
    {
        name: "Create Default Menu Items",
        description: "Add default menu items to main dashboard",
        query: `
-- Insert main menu items
WITH menu_insert AS (
    INSERT INTO menu_items (dashboard_id, title, icon, url, type, order_index)
    VALUES 
        ('b24c5f8a-5e25-4f9d-8492-9bf5f418c408', 'Dashboard', 'layout-dashboard', '{"href":"/"}', 'main', 1),
        ('b24c5f8a-5e25-4f9d-8492-9bf5f418c408', 'Settings', 'settings', '{"href":"/settings"}', 'main', 2)
    RETURNING id, title
)
SELECT * FROM menu_insert;`.trim()
    },
    {
        name: "Verify Setup",
        description: "Check if everything is set up correctly",
        query: `
-- Check users
SELECT id, email, name, role, dashboard_ids, dashboard_roles 
FROM users;

-- Check dashboards
SELECT id, name, description, logo, plan, is_public, is_active 
FROM dashboards;

-- Check menu items
SELECT id, dashboard_id, title, icon, url, parent_id, order_index, type 
FROM menu_items;`.trim()
    }
];