import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderAt(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

test('renders Jobarena brand', () => {
  renderAt('/');
  const brand = screen.getByText(/Jobarena/i);
  expect(brand).toBeInTheDocument();
});

test('signin shows validation errors when submitting empty form', () => {
  renderAt('/signin');

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
  expect(screen.getByText(/please enter your password/i)).toBeInTheDocument();
});

test('signup requires agreeing to terms', () => {
  renderAt('/signup');

  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'supersecure' } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'supersecure' } });

  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  expect(screen.getByText(/must agree to the terms/i)).toBeInTheDocument();
});
