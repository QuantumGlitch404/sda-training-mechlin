import { useState } from 'react';

import api from './services/api';

function App() {
  const [email, setEmail] =
    useState(
      'meezab@example.com'
    );

  const [password, setPassword] =
    useState(
      'password123'
    );

  const [loggedIn, setLoggedIn] =
    useState(
      Boolean(
        localStorage.getItem(
          'authToken'
        )
      )
    );

  const [users, setUsers] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [analytics, setAnalytics] =
    useState(null);

  const [message, setMessage] =
    useState('');

  async function handleLogin(
    event
  ) {
    event.preventDefault();

    try {
      await api.login({
        email,
        password
      });

      setLoggedIn(true);
      setMessage(
        'Login successful'
      );
    } catch (error) {
      setMessage(
        error.message
      );
    }
  }

  async function loadUsers() {
    try {
      const response =
        await api.getUsers();

      setUsers(
        response.data.users
      );

      setMessage(
        'Users loaded'
      );
    } catch (error) {
      setMessage(
        error.message
      );
    }
  }

  async function loadProducts() {
    try {
      const response =
        await api.getProducts();

      setProducts(
        response.data.products
      );

      setMessage(
        'Products loaded'
      );
    } catch (error) {
      setMessage(
        error.message
      );
    }
  }

  async function loadOrders() {
    try {
      const response =
        await api.getOrders();

      setOrders(
        response.data.orders
      );

      setMessage(
        'Orders loaded'
      );
    } catch (error) {
      setMessage(
        error.message
      );
    }
  }

  async function loadAnalytics() {
    try {
      const response =
        await api.getAnalytics();

      setAnalytics(
        response.data
      );

      setMessage(
        'Analytics loaded'
      );
    } catch (error) {
      setMessage(
        error.message
      );
    }
  }

  async function createOrder() {
    try {
      const response =
        await api.createOrder({
          items: [
            {
              productId: '1',
              quantity: 2,
              price: 199.99
            }
          ],

          shippingAddress: {
            street:
              '123 Test Street',
            city:
              'Jaipur',
            state:
              'Rajasthan',
            zipCode:
              '302001',
            country:
              'India'
          }
        });

      setMessage(
        `Order ${response.data.id} created`
      );

      await loadOrders();
      await loadAnalytics();
    } catch (error) {
      setMessage(
        error.message
      );
    }
  }

  function handleLogout() {
    api.logout();

    setLoggedIn(false);

    setUsers([]);
    setProducts([]);
    setOrders([]);
    setAnalytics(null);

    setMessage(
      'Logged out'
    );
  }

  if (!loggedIn) {
    return (
      <main className="page">
        <section className="card login-card">
          <h1>
            Day 14 Integration Dashboard
          </h1>

          <p>
            React frontend connected to
            Node.js backend
          </p>

          <form
            onSubmit={
              handleLogin
            }
          >
            <label>
              Email
            </label>

            <input
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />

            <button type="submit">
              Login
            </button>
          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>
            Integration Dashboard
          </h1>

          <p>
            Day 14 — Frontend +
            Backend
          </p>
        </div>

        <button
          onClick={
            handleLogout
          }
        >
          Logout
        </button>
      </header>

      <section className="actions">
        <button
          onClick={
            loadUsers
          }
        >
          Load Users
        </button>

        <button
          onClick={
            loadProducts
          }
        >
          Load Products
        </button>

        <button
          onClick={
            createOrder
          }
        >
          Create Test Order
        </button>

        <button
          onClick={
            loadOrders
          }
        >
          Load Orders
        </button>

        <button
          onClick={
            loadAnalytics
          }
        >
          Load Analytics
        </button>
      </section>

      {message && (
        <section className="message">
          {message}
        </section>
      )}

      <section className="grid">
        <article className="card">
          <h2>Users</h2>

          {users.length === 0 ? (
            <p>
              Click "Load Users"
            </p>
          ) : (
            users.map(
              (user) => (
                <div
                  className="item"
                  key={
                    user.id
                  }
                >
                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {user.email}
                  </span>

                  <small>
                    Role: {user.role}
                  </small>
                </div>
              )
            )
          )}
        </article>

        <article className="card">
          <h2>Products</h2>

          {products.length === 0 ? (
            <p>
              Click "Load Products"
            </p>
          ) : (
            products.map(
              (product) => (
                <div
                  className="item"
                  key={
                    product.id
                  }
                >
                  <strong>
                    {product.name}
                  </strong>

                  <span>
                    ₹{product.price}
                  </span>

                  <small>
                    Stock:
                    {' '}
                    {product.stock}
                  </small>
                </div>
              )
            )
          )}
        </article>

        <article className="card">
          <h2>Orders</h2>

          {orders.length === 0 ? (
            <p>
              No orders yet
            </p>
          ) : (
            orders.map(
              (order) => (
                <div
                  className="item"
                  key={
                    order.id
                  }
                >
                  <strong>
                    Order #
                    {order.id}
                  </strong>

                  <span>
                    ₹
                    {order.total.toFixed(
                      2
                    )}
                  </span>

                  <small>
                    {order.status}
                  </small>
                </div>
              )
            )
          )}
        </article>

        <article className="card">
          <h2>
            Analytics
          </h2>

          {!analytics ? (
            <p>
              Click "Load Analytics"
            </p>
          ) : (
            <>
              <div className="stat">
                Users:
                {' '}
                {analytics.totalUsers}
              </div>

              <div className="stat">
                Products:
                {' '}
                {analytics.totalProducts}
              </div>

              <div className="stat">
                Orders:
                {' '}
                {analytics.totalOrders}
              </div>

              <div className="stat">
                Sales:
                {' '}
                ₹
                {analytics.totalSales.toFixed(
                  2
                )}
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;