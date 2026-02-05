import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/E-Commerce Platform/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders stats dashboard', () => {
    render(<App />);
    // Check if stats section exists (it may be loading initially)
    expect(document.querySelector('.stats-container') || document.querySelector('.loading')).toBeTruthy();
  });

  test('renders products tab', () => {
    render(<App />);
    const productsTab = screen.getByText(/Products/i);
    expect(productsTab).toBeInTheDocument();
  });

  test('renders add product tab', () => {
    render(<App />);
    const addTab = screen.getByText(/Add Product/i);
    expect(addTab).toBeInTheDocument();
  });
});
