# Host Editing Proposal Component

A reusable React component for hosts to review, edit, and counteroffer on guest proposal terms. Built with React, TypeScript, and Vite.

## Features

- **Review Proposal Terms**: View all details of a guest's proposal including dates, schedule, pricing, and house rules
- **Edit/Counteroffer**: Modify proposal terms including:
  - Move-in date selection
  - Reservation span (weeks/duration)
  - Check-in/check-out days
  - Weekly schedule pattern
  - House rules selection
- **Real-time Preview**: See updated pricing breakdown before submitting changes
- **Accept As-Is**: Accept proposals without modifications
- **Reject Proposals**: Reject proposals with optional reason
- **Responsive Design**: Works on desktop and mobile devices

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:8000

## Build

Create a production build:

```bash
npm run build
```

## Usage

```tsx
import { HostEditingProposal } from './components';
import type { Proposal, HouseRule, AlertMessage, CounterofferParams } from './types';

function MyApp() {
  const handleAcceptAsIs = async (proposal: Proposal) => {
    // Handle accept logic
  };

  const handleCounteroffer = async (params: CounterofferParams) => {
    // Handle counteroffer logic
  };

  const handleReject = async (proposal: Proposal, reason: string) => {
    // Handle reject logic
  };

  const handleAlert = (alert: AlertMessage) => {
    // Display notification
  };

  return (
    <HostEditingProposal
      proposal={proposal}
      availableHouseRules={houseRules}
      isInternalUsage={false}
      onAcceptAsIs={handleAcceptAsIs}
      onCounteroffer={handleCounteroffer}
      onReject={handleReject}
      onCancel={() => {}}
      onAlert={handleAlert}
    />
  );
}
```

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `proposal` | `Proposal` | Yes | The proposal data to display and edit |
| `availableHouseRules` | `HouseRule[]` | Yes | List of house rules available for selection |
| `isInternalUsage` | `boolean` | No | Flag for internal usage mode (disables some features) |
| `onAcceptAsIs` | `(proposal: Proposal) => Promise<void>` | No | Callback when proposal is accepted without changes |
| `onCounteroffer` | `(params: CounterofferParams) => Promise<void>` | No | Callback when counteroffer is submitted |
| `onReject` | `(proposal: Proposal, reason: string) => Promise<void>` | No | Callback when proposal is rejected |
| `onCancel` | `() => void` | No | Callback when editing is cancelled |
| `onAlert` | `(alert: AlertMessage) => void` | No | Callback to display notifications |

## Project Structure

```
src/
├── components/
│   ├── HostEditingProposal.tsx   # Main component
│   ├── ReservationPriceBreakdown.tsx   # Pricing breakdown display
│   ├── ScheduleSelector.tsx   # Schedule/day selection
│   ├── FormInputs.tsx   # Date picker, dropdowns, multi-select
│   └── index.ts   # Component exports
├── styles/
│   └── host-editing-proposal.css   # Component styles
├── types/
│   └── index.ts   # TypeScript interfaces and types
└── App.tsx   # Demo application
```

## Design System

The component uses a consistent design system with:

### Colors
- Primary Purple: `#31135D`
- Reject Red: `#C82333`
- Text Primary: `#424242`
- Border Gray: `#6B6B6B`

### Fonts
- Headings: Martel (serif)
- Body: Lato / DM Sans (sans-serif)

### Components
- Rounded buttons (20px radius)
- Dotted borders for sections
- Inset shadows on form inputs
- Collapsible sections with animations

## License

MIT
