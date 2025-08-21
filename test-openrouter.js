import { OpenRouterService } from './server/services/openrouter.js';

async function testOpenRouter() {
  try {
    console.log('Testing OpenRouter API...');
    const service = new OpenRouterService();
    
    const result = await service.analyzeComment('This is an amazing tutorial! Thanks for sharing.');
    console.log('Test successful:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOpenRouter();
