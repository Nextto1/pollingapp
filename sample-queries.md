# Sample Queries for Testing Supabase MCP Server with Trae AI

Use these sample queries to test your connection to the Supabase MCP server through Trae AI.

## Schema Exploration

### List All Tables
```sql
SELECT table_name 
FROM information_schema.tables
WHERE table_schema = 'public';
```

### View Polls Table Schema
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'polls';
```

### View Poll Options Table Schema
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'poll_options';
```

### View Votes Table Schema
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'votes';
```

## Data Queries

### Get All Active Polls
```sql
SELECT 
  id, 
  title, 
  description, 
  created_at, 
  expires_at
FROM 
  polls
WHERE 
  status = 'active'
ORDER BY 
  created_at DESC;
```

### Get Poll Options for a Specific Poll
```sql
SELECT 
  po.id, 
  po.text, 
  po.order_index,
  COUNT(v.id) as vote_count
FROM 
  poll_options po
LEFT JOIN 
  votes v ON po.id = v.option_id
WHERE 
  po.poll_id = '[POLL_ID]' -- Replace with actual poll ID
GROUP BY 
  po.id, po.text, po.order_index
ORDER BY 
  po.order_index;
```

### Get Poll Results
```sql
SELECT 
  p.title as poll_title,
  po.text as option_text,
  COUNT(v.id) as vote_count,
  ROUND(
    (COUNT(v.id) * 100.0 / NULLIF((
      SELECT COUNT(*) 
      FROM votes v2 
      WHERE v2.poll_id = p.id
    ), 0)), 2
  ) as percentage
FROM 
  polls p
JOIN 
  poll_options po ON p.id = po.poll_id
LEFT JOIN 
  votes v ON po.id = v.option_id
WHERE 
  p.id = '[POLL_ID]' -- Replace with actual poll ID
GROUP BY 
  p.id, p.title, po.id, po.text
ORDER BY 
  vote_count DESC;
```

### Get User Voting History
```sql
SELECT 
  p.title as poll_title,
  po.text as selected_option,
  v.created_at as voted_at
FROM 
  votes v
JOIN 
  polls p ON v.poll_id = p.id
JOIN 
  poll_options po ON v.option_id = po.id
WHERE 
  v.user_id = '[USER_ID]' -- Replace with actual user ID
ORDER BY 
  v.created_at DESC;
```

### Count Polls by Status
```sql
SELECT 
  status, 
  COUNT(*) as count
FROM 
  polls
GROUP BY 
  status;
```

### Find Polls Expiring Soon
```sql
SELECT 
  id, 
  title, 
  expires_at,
  NOW() as current_time,
  expires_at - NOW() as time_remaining
FROM 
  polls
WHERE 
  status = 'active' AND
  expires_at IS NOT NULL AND
  expires_at > NOW() AND
  expires_at < NOW() + INTERVAL '24 hours'
ORDER BY 
  expires_at;
```

## Advanced Queries

### Most Popular Polls (by Vote Count)
```sql
SELECT 
  p.id, 
  p.title, 
  COUNT(v.id) as total_votes
FROM 
  polls p
LEFT JOIN 
  votes v ON p.id = v.poll_id
GROUP BY 
  p.id, p.title
ORDER BY 
  total_votes DESC
LIMIT 10;
```

### User Participation Rate
```sql
WITH user_votes AS (
  SELECT 
    user_id, 
    COUNT(DISTINCT poll_id) as polls_voted
  FROM 
    votes
  GROUP BY 
    user_id
)

SELECT 
  uv.user_id,
  uv.polls_voted,
  (SELECT COUNT(*) FROM polls) as total_polls,
  ROUND((uv.polls_voted * 100.0 / NULLIF((SELECT COUNT(*) FROM polls), 0)), 2) as participation_rate
FROM 
  user_votes uv
ORDER BY 
  participation_rate DESC;
```

### Poll Option Distribution
```sql
SELECT 
  COUNT(id) as option_count,
  COUNT(DISTINCT poll_id) as poll_count
FROM 
  poll_options
GROUP BY 
  poll_id
ORDER BY 
  option_count DESC;
```

## Questions to Ask Trae AI

1. "What tables are in my polling application database?"
2. "Show me the schema for the polls table"
3. "Write a query to find all active polls"
4. "How can I get the results for a specific poll?"
5. "Write a query to find the most popular polls"
6. "How do I find polls that are expiring soon?"
7. "Create a query to show user voting history"
8. "How can I calculate the percentage of votes for each option in a poll?"
9. "Write a query to find polls with no votes"
10. "How do I find which users have voted on a specific poll?"