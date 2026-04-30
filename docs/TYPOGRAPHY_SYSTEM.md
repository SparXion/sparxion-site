# SparXion Typography System

## Font Hierarchy

### Logo Font (EXO 2)
- **Usage**: Only for logo SVG text elements
- **Font Family**: `font-logo` (Exo 2)
- **Note**: This font is embedded in SVG files and should not be used elsewhere

### Primary Font (Roboto)
- **Usage**: All body text, headings, navigation, buttons, and UI elements
- **Font Family**: `font-sans` (Roboto)
- **Weights Available**: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)

## Typography Scale - Unified Hierarchy

### Large Headings (Weight Differentiated)
- **H1** (`text-h1`): 3rem / 48px
  - Weight: 500 (Medium)
  - Line Height: 1.2
  - Letter Spacing: -0.02em
  - Use: Page titles, hero headlines
  - **Purpose**: Maximum visual impact through size

- **H2** (`text-h2`): 1.5rem / 24px
  - Weight: 500 (Medium)
  - Line Height: 1.3
  - Letter Spacing: -0.01em
  - Use: Section headings
  - **Purpose**: Clear section hierarchy

### Medium Headings (Consistent Weight)
- **H3** (`text-h3`): 1.2rem / 19.2px
  - Weight: 500 (Medium)
  - Line Height: 1.4
  - Letter Spacing: 0
  - Use: Subsection headings

- **H4** (`text-h4`): 1rem / 16px
  - Weight: 500 (Medium)
  - Line Height: 1.5
  - Letter Spacing: 0
  - Use: Card titles, small headings

### Body Text (Unified Weight - Size Creates Hierarchy)
All body text sizes use **Regular (400)** weight for consistency. Size differences create visual hierarchy.

- **Body** (`text-body`): 1rem / 16px
  - Weight: 400 (Regular) - **Unified**
  - Line Height: 1.6
  - Letter Spacing: 0.01em
  - Use: Primary body text, paragraphs

- **Small** (`text-small`): 0.875rem / 14px
  - Weight: 400 (Regular) - **Unified**
  - Line Height: 1.5
  - Letter Spacing: 0.01em
  - Use: Secondary text, captions, supporting content

- **Tiny** (`text-tiny`): 0.75rem / 12px
  - Weight: 400 (Regular) - **Unified**
  - Line Height: 1.4
  - Letter Spacing: 0.01em
  - Use: Labels, fine print, metadata

## Design Principles

### Weight Strategy
1. **Headings (H1-H4)**: Use Medium (500) weight for clear hierarchy
2. **All Body Text**: Use Regular (400) weight consistently - creates unified feel
3. **Size Differentiation**: Smaller fonts rely on size, not weight, for hierarchy

### Visual Balance
- **Large elements** (H1, H2): Size + Medium weight = Strong presence
- **Medium elements** (H3, H4): Medium size + Medium weight = Clear but not overwhelming
- **Small elements** (Body, Small, Tiny): Unified Regular weight = Cohesive, readable

### Hierarchy Rules
1. **Size is primary**: Larger = more important
2. **Weight is secondary**: Used only for headings vs body
3. **Consistency**: All body text shares the same weight (400)
4. **Clarity**: Clear distinction between heading weights (500) and body weights (400)

## Usage Guidelines

1. **Always use predefined classes**: Use `text-h1`, `text-body`, etc. - never custom sizes
2. **Weight consistency**: Don't add `font-bold` or `font-light` to body text classes
3. **Size hierarchy**: Use appropriate size class for importance level
4. **Line height**: Maintain specified line heights for optimal readability
5. **Letter spacing**: Roboto benefits from slight positive letter spacing (0.01em) for body text

## Implementation

All typography is configured in:
- `tailwind.config.js` - Font families and size definitions
- `src/index.css` - Base font settings
- `index.html` - Google Fonts import for Roboto
