-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store document embeddings
create table if not exists documents (
  id bigserial primary key,
  content text, -- The text content of the ticket or document
  metadata jsonb, -- Additional metadata (e.g., ticket_id, author)
  embedding vector(1536) -- OpenAI embedding vector size
);

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- Create an index for faster queries (IVFFlat)
create index if not exists documents_embedding_idx on documents using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
