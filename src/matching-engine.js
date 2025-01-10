/**
 * Order book, which stores all active buy and sell orders.
 * @type {Array<{price: Decimal, quantity: Decimal, type: string}>}
 */
const orderBook = [];

/** @type {number} Total number of orders processed. */
let totalOrders = 0;

/** @type {number} Total number of matched orders. */
let matchedOrders = 0;

/** @type {number} Total time spent on matching orders (in milliseconds). */
let totalMatchingTime = 0;

/**
 * Adds a new order to the order book and attempts to match it with existing orders.
 * Updates statistics and re-renders the order book.
 */
function addOrder() {
  const price = new Decimal(document.getElementById("price").value);
  const quantity = new Decimal(document.getElementById("quantity").value);
  const type = document.getElementById("type").value;

  /** @type {{price: Decimal, quantity: Decimal, type: string}} */
  const newOrder = { price, quantity, type };
  totalOrders++;

  const startTime = performance.now();
  matchOrders(newOrder);
  const endTime = performance.now();

  totalMatchingTime += endTime - startTime;
  renderOrderBook();
  updateStatistics();
}

/**
 * Adds multiple random orders to the order book for testing purposes.
 * Each order has a random price, quantity, and type.
 * @param {number} count Number of random orders to generate.
 */
function addRandomOrders(count) {
  for (let i = 0; i < count; i++) {
    const price = new Decimal((Math.random() * 100).toFixed(2));
    const quantity = new Decimal((Math.random() * 10 + 1).toFixed(2));
    const type = Math.random() > 0.5 ? "buy" : "sell";

    /** @type {{price: Decimal, quantity: Decimal, type: string}} */
    const randomOrder = { price, quantity, type };
    totalOrders++;

    const startTime = performance.now();
    matchOrders(randomOrder);
    const endTime = performance.now();

    totalMatchingTime += endTime - startTime;
  }
  renderOrderBook();
  updateStatistics();
}

/**
 * Matches a new order against existing orders in the order book.
 * Removes matched orders and updates their quantities if partially matched.
 * @param {{price: Decimal, quantity: Decimal, type: string}} newOrder The order to be matched.
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
      console.log(`Matched ${matchedQuantity} @ ${existingOrder.price}`);

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
 * Renders the current order book in the HTML table.
 */
function renderOrderBook() {
  const tableBody = document.getElementById("order-book");
  tableBody.innerHTML = "";

  orderBook.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${order.type}</td>
            <td>${order.price.toFixed(2)}</td>
            <td>${order.quantity.toFixed(2)}</td>
        `;
    tableBody.appendChild(row);
  });
}

/**
 * Updates the statistics displayed on the page, including matched percentage and average matching time.
 */
function updateStatistics() {
  const matchedPercentage =
    totalOrders > 0 ? ((matchedOrders / totalOrders) * 100).toFixed(2) : 0;
  const averageMatchingTime =
    totalOrders > 0 ? (totalMatchingTime / totalOrders).toFixed(2) : 0;

  document.getElementById(
    "matched-percentage"
  ).textContent = `Matched Percentage: ${matchedPercentage}%`;
  document.getElementById(
    "matching-time"
  ).textContent = `Matching Time: ${averageMatchingTime}ms`;
}
