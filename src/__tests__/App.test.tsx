import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('App', () => {
  test('renders login page by default', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    const { container } = renderWithRouter(<App />);
    expect(container).toBeInTheDocument();
  });
});
