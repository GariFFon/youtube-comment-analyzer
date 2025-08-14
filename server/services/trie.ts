export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  commentIds: Set<string>; // Store comment IDs that contain words ending at this node

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.commentIds = new Set();
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string, commentId: string): void {
    let current = this.root;
    const normalizedWord = word.toLowerCase().trim();

    for (const char of normalizedWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
      // Add comment ID to each node along the path for prefix search
      current.commentIds.add(commentId);
    }

    current.isEndOfWord = true;
  }

  search(word: string): Set<string> {
    const normalizedWord = word.toLowerCase().trim();
    let current = this.root;

    for (const char of normalizedWord) {
      if (!current.children.has(char)) {
        return new Set(); // Word not found
      }
      current = current.children.get(char)!;
    }

    return current.commentIds;
  }

  startsWith(prefix: string): Set<string> {
    const normalizedPrefix = prefix.toLowerCase().trim();
    let current = this.root;

    for (const char of normalizedPrefix) {
      if (!current.children.has(char)) {
        return new Set(); // Prefix not found
      }
      current = current.children.get(char)!;
    }

    // Return all comment IDs that have words with this prefix
    return current.commentIds;
  }

  // Build trie from comments
  static fromComments(comments: Array<{ id: string; textDisplay: string; authorDisplayName: string }>): Trie {
    const trie = new Trie();
    
    for (const comment of comments) {
      // Index words from comment text
      const words = Trie.extractWords(comment.textDisplay);
      for (const word of words) {
        if (word.length > 2) { // Only index words longer than 2 characters
          trie.insert(word, comment.id);
        }
      }
      
      // Index author name
      const authorWords = Trie.extractWords(comment.authorDisplayName);
      for (const word of authorWords) {
        if (word.length > 2) {
          trie.insert(word, comment.id);
        }
      }
    }
    
    return trie;
  }

  private static extractWords(text: string): string[] {
    // Remove URLs, mentions, hashtags, and special characters
    const cleanText = text
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/@[\w]+/g, '') // Remove mentions
      .replace(/#[\w]+/g, '') // Remove hashtags
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return cleanText.split(/\s+/).filter(word => word.length > 0);
  }
}
