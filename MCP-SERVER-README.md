# Supabase MCP Server Setup for Trae AI

This guide will help you set up and connect the Supabase MCP (Model Context Protocol) server to Trae AI for your polling application.

## Prerequisites

- Node.js and npm installed
- A Supabase account with access to your project
- Supabase personal access token

## Step 1: Create a Supabase Access Token

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click on your profile icon in the bottom left corner
3. Select "Access Tokens"
4. Click "Generate New Token"
5. Give your token a name (e.g., "MCP Server Token")
6. Set the appropriate permissions (read-only is recommended for safety)
7. Click "Generate Token"
8. Copy the token (you won't be able to see it again)

## Step 2: Start the MCP Server

You can start the MCP server using the provided PowerShell script:

```powershell
.\start-mcp-server.ps1
```

When prompted, enter your Supabase access token.

Alternatively, you can run the server directly with:

```powershell
npx @supabase/mcp-server-supabase@latest --read-only --project-ref=stegrntfjihdhipqhpag
```

## Step 3: Configure Trae AI

1. Open Trae AI
2. Go to Settings > MCP Servers
3. Add a new MCP server
4. Use the configuration from the `trae-mcp-config.json` file, replacing `<your-personal-access-token>` with your actual token

## Step 4: Test the Connection

Once connected, you can ask Trae AI questions about your database schema and write queries. Examples:

- "What tables are in my database?"
- "Show me the schema for the polls table"
- "Write a query to get all active polls"
- "How many votes are there per poll?"

## Database Schema Overview

Your polling application has the following main tables:

- `polls`: Stores poll information (title, description, status, etc.)
- `poll_options`: Stores options for each poll
- `votes`: Records user votes for poll options

## Security Considerations

- The MCP server is configured in read-only mode for security
- Your access token should be kept secure and not shared
- Consider using project-scoped access for additional security

## Troubleshooting

- If the connection fails, check that your access token is correct
- Ensure the project reference is correct
- Verify that your Supabase project is active