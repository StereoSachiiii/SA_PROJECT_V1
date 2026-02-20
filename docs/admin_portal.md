# Admin Portal: The Command Center

## Overview
The Admin Portal is the central orchestration hub of the system. It is designed for high-density information management and provides event organizers with total control over the fair's lifecycle.

## Core Modules

### 1. System Console (Dashboard)
Located at `src/apps/admin/pages/Dashboard.tsx`.
- **Metrics**: Real-time gross revenue, saturation index (stall fill rate), and active vendor counts.
- **Health**: Live status monitoring of external services (Email, Database, Stripe).
- **Activity**: A rolling audit trail showing recent system actions.

### 2. Event Orchestration
Manages the creation and configuration of book fairs.
- **Lifecycle**: Events progress from `DRAFT` (internal setup) to `OPEN` (public booking) and finally `CLOSED`.
- **Venue Scaling**: Admins can add multiple halls and define their physical constraints.

### 3. Stall Inventory & Pricing
- **Grid View**: A visual representation of the event map.
- **Pricing Strategy**: Ability to set different prices across stall categories (e.g., Premium vs. Standard).
- **Inventory Control**: Massive operations like blocking/unblocking entire rows of stalls for logistics.

### 4. Financial Oversight (Refunds & Audit)
- **Refund Management**: A dedicated interface for reviewing and approving/denying vendor refund requests.
- **Audit Trails**: Specialized views for searching and filtering the system's audit logs to track changes.

## Administrative Design Language
The Admin UI emphasizes:
- **High Information Density**: Using tables and dense metric cards to provide a bird's-eye view.
- **Operational Safety**: Critical actions (e.g., deleting events) are protected by specialized confirmation patterns and modals.
- **Real-time Feedback**: Extensive use of loading skeletons and success/error notifications to ensure the admin is always aware of the system's state.

## Implementation Details
Admin features typically interact with the `AdminController` on the backend, which is protected by the `hasRole('ADMIN')` authority. Data fetching is optimized through query invalidation, ensuring the dashboard reflects the very latest system state.
