/**
 * Unit tests for the matching engine demo.
 * These tests generate random orders, measure matching times, and calculate average performance metrics.
 */
const Decimal = require("decimal.js");
const { performance } = require("perf_hooks");

/** Order Book */
const orderBook = [];
let totalOrders = 0;
let matchedOrders = 0;

/**
 * Adds a new order to the order book and attempts to match it.
 * @param {{price: Decimal, quantity: Decimal, type: string}} newOrder The order to add.
 */
function matchOrders(newOrder) {
  const oppositeType = newOrder.type === "buy" ? "sell" : "buy";

  for (let i = 0; i < orderBook.length; i++) {
    const existingOrder = orderBook[i];

    if (
      existingOrder.type === oppositeType &&
      ((newOrder.type === "buy" && newOrder.price.gte(existingOrder.price)) ||
        (newOrder.type === "sell" && newOrder.price.lte(existingOrder.price)))
    ) {
      const matchedQuantity = Decimal.min(
        newOrder.quantity,
        existingOrder.quantity
      );

      newOrder.quantity = newOrder.quantity.minus(matchedQuantity);
      existingOrder.quantity = existingOrder.quantity.minus(matchedQuantity);

      matchedOrders++;

      if (existingOrder.quantity.equals(0)) {
        orderBook.splice(i, 1);
        i--;
      }

      if (newOrder.quantity.equals(0)) {
        return;
      }
    }
  }

  if (newOrder.quantity.greaterThan(0)) {
    orderBook.push(newOrder);
  }
}

/**
 * Generates random orders and adds them to the order book.
 * @param {number} count Number of random orders to generate.
 */
function generateRandomOrders(count) {
  for (let i = 0; i < count; i++) {
    const price = new Decimal((Math.random() * 100).toFixed(2));
    const quantity = new Decimal((Math.random() * 10 + 1).toFixed(2));
    const type = Math.random() > 0.5 ? "buy" : "sell";

    const randomOrder = { price, quantity, type };
    matchOrders(randomOrder);
  }
}

/**
 * Runs performance tests on the matching engine.
 */
function runTests() {
  const iterations = 10;
  const ordersPerIteration = 100000;

  let totalMatchingTime = 0;
  let totalMatchedOrders = 0;

  for (let i = 0; i < iterations; i++) {
    // Reset state
    orderBook.length = 0;
    totalOrders = 0;
    matchedOrders = 0;

    // Generate and match orders
    const startTime = performance.now();
    generateRandomOrders(ordersPerIteration);
    const endTime = performance.now();

    // Collect metrics
    totalMatchingTime += endTime - startTime;
    totalMatchedOrders += matchedOrders;

    console.log(`Iteration ${i + 1}:`);
    console.log(`  Time Taken: ${(endTime - startTime).toFixed(2)} ms`);
    console.log(`  Matched Orders: ${matchedOrders}`);
  }

  // Calculate averages
  const averageTime = totalMatchingTime / iterations;
  const averageMatchedOrders = totalMatchedOrders / iterations;

  console.log("\nPerformance Summary:");
  console.log(`  Average Time per 100k Orders: ${averageTime.toFixed(2)} ms`);
  console.log(`  Average Matched Orders: ${averageMatchedOrders}`);
}

// Run the tests
runTests();
