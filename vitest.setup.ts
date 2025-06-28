import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import MockSignIn from './tests/__mocks__/MockSignIn.svelte';
import MockSignUp from './tests/__mocks__/MockSignUp.svelte';

// vi.stubEnv('PUBLIC_CLERK_PUBLISHABLE_KEY', 'test1235')
vi.mock('svelte-clerk', () => ({
    SignIn: MockSignIn,
    SignUp: MockSignUp,
  }));