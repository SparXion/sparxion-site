# Data Model
- Student: {id: string, interests: [string], talents: [string], images: [{url: string, tags: [string]}]}
- Career: {name: string, description: string, interests: [string], skills: [string], images: [{url: string, tags: [string]}]}
- Company: {name: string, needs: [string], industry: string, images: [{url: string, tags: [string]}]}
- Image: {url: string, tags: [string], source: string}