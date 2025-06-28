import { Given, Then } from 'quickpickle';
import { expect } from "vitest"
import { render, screen } from '@testing-library/svelte';
import SignIn from '../../src/routes/(auth)/sign-in/+page.svelte';

Given('I am on the {string} page', async (world, page) => {
    if (page === "/sign-in") {
        render(SignIn);
    }
});

Then('I should see the login form', async () => {
    const signUpElement = await screen.findByTestId('mock-sign-in');
    expect(signUpElement).toBeInTheDocument();
  }); 
