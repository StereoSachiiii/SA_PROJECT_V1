# Frontend Layer: State Management & Data Fetching

## Overview
The application handles state through a combination of local component state, the **React Context API** for global identity/theme, and **TanStack Query (React Query)** for server-side state synchronization.

## Global State: AuthContext
Located at `src/shared/context/AuthContext`.
- **Purpose**: Manages user authentication status, credentials, and business profile information.
- **Client Sync**: On login, the `AuthContext` updates its state, which triggers a global re-render, effectively switching the UI between "Public", "Vendor", and "Admin" modes.
- **Persistence**: Auth tokens are persisted in `localStorage` and re-hydrated on application mount.

## Server-Side State: TanStack Query
The project extensively uses `@tanstack/react-query` to handle data fetching, caching, and mutations. This eliminates the need for complex Redux reducers for API data.

### 1. useQuery
Used for read operations (e.g., fetching a reservation list).
- **Benefits**: Automatic caching, background re-fetching, and built-in loading/error states.
- **Implementation**: API calls are wrapped in custom hooks or directly in components using the `adminApi`, `vendorApi`, etc.

### 2. useMutation
Used for write operations (e.g., booking a stall, approving a refund).
- **Benefits**: Handling optimistic updates, side effects (showing success toasts), and cache invalidation.
- **Pattern**:
    ```typescript
    const mutation = useMutation({
      mutationFn: adminApi.approveRefund,
      onSuccess: () => {
        // Invalidate the 'refunds' query key to trigger a background refresh
        queryClient.invalidateQueries({ queryKey: ['refunds'] });
      },
    });
    ```

## Local UI State
For transient UI states (modals, form inputs, active tabs), standard `useState` and `useReducer` hooks are used. With the recent refactoring into modular components, local state is kept "down" in the relevant sub-component wherever possible to minimize unnecessary renders.

## Data Fetching Best Practices
1. **Centralized Client**: All requests pass through a centralized Axios client in `src/shared/api/client.ts`.
2. **Error Interceptors**: The client automatically handles 401 Unauthorized by clearing the local session and redirecting to login.
3. **Type Safety**: Every API call uses TypeScript interfaces from `src/shared/types/api.ts` to ensure end-to-end data integrity.
