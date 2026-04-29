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
async function getDashboardData({
  search = "",
  page = 1,
  limit = 10
}) {
  try {
    const [users, orders] = await Promise.all([
      fetchUsers(),
      fetchOrders()
    ]);

    // 1. active users
    const activeOnly = users.filter(u => u.active);

    // 2. build orders map
    const ordersMap = orders.reduce((acc, o) => {
      acc[o.userId] ??= {
        totalSpent: 0,
        orderCount: 0,
        categories: {}
      };

      acc[o.userId].totalSpent += o.amount;
      acc[o.userId].orderCount += 1;

      acc[o.userId].categories[o.category] =
        (acc[o.userId].categories[o.category] || 0) + o.amount;

      return acc;
    }, {});

    // 3. merge users
    let merged = activeOnly.map(u => {
      const stats = ordersMap[u.id] || {
        totalSpent: 0,
        orderCount: 0,
        categories: {}
      };

      const favoriteCategory =
        Object.entries(stats.categories)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      return {
        name: u.name.charAt(0).toUpperCase() + u.name.slice(1),
        totalSpent: stats.totalSpent,
        orderCount: stats.orderCount,
        favoriteCategory
      };
    });

    // 4. search
    if (search) {
      merged = merged.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 5. sort
    merged.sort((a, b) => b.totalSpent - a.totalSpent);

    // 6. pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = merged.slice(start, end);

    // 7. return
    return {
      total: merged.length,
      page,
      limit,
      data: paginated
    };

  } catch (error) {
    console.error("API failed:", error);
    return "something failed";
  }
}
getDashboardData({ search: "a", page: 1, limit: 3 }).then(console.log);