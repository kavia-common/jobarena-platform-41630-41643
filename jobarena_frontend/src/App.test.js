import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Jobarena brand', () => {
  render(<App />);
  const brand = screen.getByText(/Jobarena/i);
  expect(brand).toBeInTheDocument();
});
