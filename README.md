# Pet Evolution API

A proof-of-concept API for generating, evolving, and modifying pet images using OpenAI's DALL-E 3 model.

## Features

1. **Generate New Pet** - Create a unique pet with customizable parameters
2. **Evolve Pet** - Advance pet to next evolution stage (more mature and complex)
3. **Modify Pet** - Add accessories and minor changes to existing pet

## Setup

1. Install dependencies: `npm install`
2. Ensure your OpenAI API key is in the `.env` file
3. Start the server: `npm start`

## API Endpoints

### POST /api/generate-pet
Generate a new pet with specified parameters.

**Body:**
```json
{
  "cuteness": 8,        // 1-10 scale
  "coolness": 6,        // 1-10 scale  
  "colorPalette": "blue and purple",
  "animals": ["cat", "dragon", "butterfly"]
}
```

### POST /api/evolve-pet
Evolve pet to next stage (more mature/complex).

**Body:**
```json
{
  "petId": "123",
  "currentStage": 1,
  "maxStages": 4,
  "description": "cute dragon-cat hybrid"
}
```

### POST /api/modify-pet
Add accessories or minor modifications.

**Body:**
```json
{
  "petId": "123", 
  "baseDescription": "cute dragon-cat hybrid",
  "modifications": ["wizard hat", "glowing eyes", "small cape"]
}
```

### GET /api/health
Health check endpoint.

## Testing

Run the server and use the test examples in `test-examples.js` or use curl commands shown in the console output.

## Notes

- Each pet has 3 evolution stages (Baby → Juvenile → Adult)
- Evolution makes pets more mature and detailed
- Modifications are non-destructive accessories/changes
- Uses DALL-E 3 and Google Gemini for high-quality image generation