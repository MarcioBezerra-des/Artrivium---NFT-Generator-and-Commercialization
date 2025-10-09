import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #3498db;
    --secondary: #2ecc71;
    --accent: #9b59b6;
    --background: #ffffff;
    --text: #333333;
    --text-light: #777777;
    --border: #e0e0e0;
    --error: #e74c3c;
    --success: #27ae60;
    --warning: #f39c12;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--background);
    color: var(--text);
    line-height: 1.6;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: darken(var(--primary), 10%);
    }
  }

  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-container {
    min-height: calc(100vh - 160px);
    padding: 2rem 0;
  }
`;

export default GlobalStyle;