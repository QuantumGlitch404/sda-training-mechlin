class ApiService {
  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_URL ||
      'http://localhost:3014/api/v1';

    this.token =
      localStorage.getItem(
        'authToken'
      );
  }

  async request(
    endpoint,
    options = {}
  ) {
    const url =
      `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type':
          'application/json',

        ...(this.token && {
          Authorization:
            `Bearer ${this.token}`
        }),

        ...options.headers
      },

      ...options
    };

    try {
      const response =
        await fetch(
          url,
          config
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
          'Request failed'
        );
      }

      return data;
    } catch (error) {
      console.error(
        'API request failed:',
        error
      );

      throw error;
    }
  }

  async login(
    credentials
  ) {
    const response =
      await this.request(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(
            credentials
          )
        }
      );

    if (
      response.data.accessToken
    ) {
      this.token =
        response.data.accessToken;

      localStorage.setItem(
        'authToken',
        this.token
      );
    }

    return response;
  }

  async getUsers() {
    return this.request(
      '/users'
    );
  }

  async getProducts() {
    return this.request(
      '/products'
    );
  }

  async createOrder(
    orderData
  ) {
    return this.request(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify(
          orderData
        )
      }
    );
  }

  async getOrders() {
    return this.request(
      '/orders'
    );
  }

  async getAnalytics() {
    return this.request(
      '/analytics'
    );
  }

  logout() {
    this.token = null;

    localStorage.removeItem(
      'authToken'
    );
  }
}

export default new ApiService();