const users = [
  {
    name: 'Vantage Admin',
    email: 'admin@vantage.lk',
    password: process.env.ADMIN_PASSWORD,
    isAdmin: true,
  },
  {
    name: 'Test Customer',
    email: 'customer@vantage.lk',
    password: process.env.CUSTOMER_PASSWORD,
  },
];

export default users;