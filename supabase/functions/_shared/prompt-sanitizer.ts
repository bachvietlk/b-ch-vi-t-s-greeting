/**
 * Prompt Sanitization Utilities
 * Defense-in-depth protection against prompt injection attacks
 */

// Suspicious patterns that may indicate prompt injection attempts
const SUSPICIOUS_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions?/i,
  /you\s+are\s+now\s+a/i,
  /\[?\s*system\s*\]?\s*:/i,
  /repeat\s+your\s+system\s+prompt/i,
  /disregard\s+(all\s+)?(previous|prior)\s+/i,
  /forget\s+(all\s+)?(previous|prior)\s+/i,
  /override\s+(safety|security)\s+(guidelines?|protocols?)/i,
  /<\|.*?\|>/g, // Token separators
  /\[\s*INST\s*\]/i, // Instruction tags
  /<<\s*SYS\s*>>/i, // System tags
];

export interface SanitizeResult {
  sanitized: string;
  isSuspicious: boolean;
  detectedPatterns: string[];
}

/**
 * Sanitizes a user prompt by:
 * 1. Removing control characters
 * 2. Detecting potential injection attempts
 * 3. Returning sanitized content with metadata
 */
export function sanitizePrompt(prompt: string): SanitizeResult {
  // Remove control characters (keep newlines and tabs)
  let sanitized = prompt.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  
  // Detect suspicious patterns
  const detectedPatterns: string[] = [];
  
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      detectedPatterns.push(pattern.source);
    }
  }
  
  const isSuspicious = detectedPatterns.length > 0;
  
  return {
    sanitized: sanitized.trim(),
    isSuspicious,
    detectedPatterns,
  };
}

/**
 * Validates chat message roles
 * Only allows 'user' and 'assistant' roles from client
 */
export function validateMessageRole(role: string): boolean {
  return ['user', 'assistant'].includes(role);
}

/**
 * Sanitizes an array of chat messages
 */
export interface ChatMessage {
  role: string;
  content: string | unknown;
}

export function sanitizeMessages(messages: ChatMessage[]): { 
  sanitized: ChatMessage[]; 
  hasInvalidRoles: boolean;
  hasSuspiciousContent: boolean;
} {
  let hasInvalidRoles = false;
  let hasSuspiciousContent = false;
  
  const sanitized = messages.map(msg => {
    // Validate role
    if (!validateMessageRole(msg.role)) {
      hasInvalidRoles = true;
      // Force to 'user' if invalid
      msg.role = 'user';
    }
    
    // Sanitize content if string
    if (typeof msg.content === 'string') {
      const result = sanitizePrompt(msg.content);
      if (result.isSuspicious) {
        hasSuspiciousContent = true;
        console.warn('Suspicious content detected in message');
      }
      msg.content = result.sanitized;
    }
    
    return msg;
  });
  
  return {
    sanitized,
    hasInvalidRoles,
    hasSuspiciousContent,
  };
}
