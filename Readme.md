# Matching Engine Demo

This project is a **JavaScript experiment** exploring the performance of a simple order-matching engine implemented in a browser environment. The goal is to examine how well the engine handles a large number of randomly generated orders while adhering to principles of the **Random Walk Theory**, which suggests that price movements are random and unpredictable.

## Key Concepts

1. **Order Matching**:

   - The engine matches `buy` and `sell` orders based on their prices.
   - If a `buy` order has a price equal to or higher than a `sell` order, they are matched.
   - Partial matching is supported, and any remaining unmatched quantity is added back to the order book.

2. **Random Walk Theory**:

   - Orders are generated with random prices and quantities to simulate unpredictable market behavior.
   - This randomness provides a realistic stress test for the matching algorithm.

3. **Statistics**:
   - The project tracks key metrics:
     - Percentage of matched orders.
     - Average time taken to process matches.
   - These insights help evaluate the efficiency and scalability of the implementation.

## Features

- **Add Orders Manually**: Input custom `price`, `quantity`, and `type` (`buy` or `sell`).
- **Generate Random Orders**: Quickly add a large number of random orders to the order book.
- **Live Statistics**:
  - Matched percentage.
  - Average matching time.
- **Real-time Visualization**:
  - Order book dynamically updates as orders are added and matched.

## Project Structure

```
/project-folder
├── src
│   ├── demo.html            # Main HTML file
│   ├── matching-engine.js   # JavaScript logic for the matching engine
│   └── styles.css           # Styling for the application
├── tests
│   └── performance-tests.js # Unit tests for performance and correctness
├── package.json             # Node.js configuration file
```

## Setup Instructions

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run the Project**:

   ```bash
   npm start
   ```

   This will launch a local development server and open the application in your default browser.

3. **Run Unit Tests**:
   Navigate to the `tests` folder and execute:
   ```bash
   npm test
   ```
   This will perform 10 iterations of stress testing with 100,000 random orders in each iteration.

## Performance Goals

This experiment seeks to answer:

- How many orders can the matching engine process efficiently?
- How quickly can it match orders under heavy load?
- Can the engine provide meaningful insights into matching performance using randomly generated data?

## Limitations

- **JavaScript Environment**: This implementation runs entirely in the browser, making it inherently slower than optimized backend solutions.
- **Simplistic Matching**: No advanced order types (e.g., market orders, limit orders).
- **In-memory Storage**: The order book is stored in memory, limiting scalability.

## Future Enhancements

- Introduce advanced order types and more complex matching rules.
- Use Web Workers to improve performance under heavy loads.
- Export detailed performance metrics for external analysis.

## Acknowledgments

- **Random Walk Theory** inspired the randomness in order generation.
- Experiment conducted to explore the feasibility of running financial algorithms in JavaScript.
