// Temporary in-memory storage (no Redis)

let memoryStore = {};

export async function storeChunks(domain, chunks) {
  memoryStore[domain] = chunks;
}

export async function searchSimilar(domain, queryEmbedding, topK) {
  return memoryStore[domain] || [];
}
