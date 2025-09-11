# Start Supabase MCP Server

# Extract project reference from the URL
$projectRef = "stegrntfjihdhipqhpag"

# Run the MCP server
Write-Host "Starting Supabase MCP Server for project: $projectRef"
Write-Host "Please enter your Supabase access token when prompted"

npx @supabase/mcp-server-supabase@latest --read-only --project-ref=$projectRef