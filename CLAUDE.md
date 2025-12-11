# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TextBelt is a REST API that sends outgoing SMS messages by converting them to emails sent to carrier-specific email-to-SMS gateways. This is the open-source version that uses free delivery mechanisms via email gateways, separate from the paid commercial service at textbelt.com.

## Common Commands

```bash
# Install dependencies
npm install

# Start the standalone server (runs on port 9090 by default)
node server/app.js

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Prerequisites

- **Redis**: Must be running on port 6379 before starting the server
  - Install locally: see http://redis.io/topics/quickstart
  - Start with: `redis-server`

- **Email Transport Configuration**: Must configure `lib/config.js` before sending messages
  - Set up a Nodemailer transport (SMTP or sendmail)
  - Configure `fromAddress` in `mailOptions`

## Architecture

### Core Components

**lib/text.js** - Core SMS sending logic
- `sendText()`: Main function that sends SMS by emailing all carrier gateways for a region
- Uses Nodemailer to send emails to carrier gateways
- Sends to ALL providers in parallel via Promise.all unless a specific carrier is specified
- Returns a Promise that resolves when all emails are sent

**lib/providers.js** - Regional provider lists
- Maps regions (`us`, `canada`, `intl`) to arrays of email gateway patterns
- Format: `%s@gateway.com` where %s is replaced with phone number
- US region is default if no region specified

**lib/carriers.js** - Individual carrier mappings
- Maps carrier names (lowercase keys) to specific email gateway patterns
- Allows targeting specific carriers instead of broadcasting to all regional providers
- Same email gateway format as providers.js

**lib/config.js** - Email transport configuration
- Exports: `transport` (Nodemailer transport), `mailOptions` (from address, etc.), `debugEnabled`
- Must be configured with valid SMTP credentials or sendmail path before use
- Default includes example SMTP_TRANSPORT and SENDMAIL_TRANSPORT configurations

**server/app.js** - Express REST API server
- Port: 9090 (default) or from `process.env.PORT`
- CORS enabled for all origins
- Debug logging enabled by default via `text.config({ debugEnabled: true })`

**index.js** - Module entry point
- Re-exports lib/text.js for use as a module in other projects

### API Endpoints

- `POST /text` - Send to US phone numbers (9-10 digits)
  - Required: `number`, `message`
  - Optional: `carrier` (to target specific carrier), `getcarriers=1` (to list carriers)

- `POST /canada` - Send to Canadian phone numbers
  - Uses canada provider list

- `POST /intl` - Send to international phone numbers
  - Uses intl provider list

### How SMS Delivery Works

1. Phone number and message received via API
2. If carrier specified, uses single carrier's gateway(s); otherwise uses all regional providers
3. For each provider, replaces `%s` in gateway pattern with phone number
4. Creates email with message as both text and html body
5. Sends emails in parallel to all gateways via Nodemailer
6. Success means email was sent to gateways, NOT that SMS was delivered
7. Messages with colons are prefixed with a space to avoid vtext delivery issues

### Message Flow Example

```
POST /text with number=5551234567, message="Hello"
  ↓
stripPhone() → "5551234567"
  ↓
textRequestHandler() → text.send("5551234567", "Hello", null, "us")
  ↓
Uses providers.us array (15+ gateways)
  ↓
Sends emails to:
  - 5551234567@txt.att.net
  - 5551234567@vtext.com
  - 5551234567@tmomail.net
  - ... (all US providers)
  ↓
Returns {success: true} if emails sent
```

## Usage as Module

```javascript
const text = require('textbelt');

// US number (default)
text.send('9491234567', 'Message text', undefined, function(err) {
  if (err) console.log(err);
});

// With region specified
text.send('9491234567', 'Message text', 'canada', function(err) {
  if (err) console.log(err);
});
```

## Code Style

- ESLint configured with Airbnb style guide (.eslintrc)
- Run `npm run lint:fix` before committing changes
