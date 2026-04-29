function fetchUsers() {
  return Promise.resolve([
    { id: 1, name: "ali", active: true },
    { id: 2, name: "sara", active: false },
    { id: 3, name: "john", active: true },
    { id: 4, name: "emma", active: true }
  ]);
}
function fetchOrders() {
  return Promise.resolve([
    { userId: 1, category: "food", amount: 120 },
    { userId: 1, category: "tech", amount: 80 },
    { userId: 3, category: "food", amount: 300 },
    { userId: 4, category: "tech", amount: 50 },
    { userId: 4, category: "food", amount: 70 },
    { userId: 3, category: "tech", amount: 100 }
  ]);
}