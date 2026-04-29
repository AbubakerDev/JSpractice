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
}){
  try {
    //fetch all
    const [users , orders] = await Promise.all([fetchUsers(), fetchOrders()])
    // activeOnly
    const activeOnly = users.filter((u) => u.active);
    // reduce method to for total, count and catgories
    const ordersMap = orders.reduce((acc, o)=>{
      acc[o.userId] ??= {total: 0, count: 0, categories: {}}
      acc[o.userId].total += o.amount;
      acc[o.userId].count += 1;
      acc[o.userId].categories[o.category] = (acc[o.userId].categories[o.category] || 0) + o.amount;
      return acc;
    }, {});
    // merge with users by finding same id....
    const merged = activeOnly.map((u)=>{
      const stats = ordersMap[u.id] || {
        totalSpent: 0,
        orderCount: 0,
        categories: {}
      }
      const favoriteCategory = Object.entries(stats.categories).sort((a,b)=>b[1] - a[1])[0]?.[0] || null;
      return {
        name: u.name.charAt(0).toUpperCase() + u.name.slice(1),
        totalSpent: stats.total,
        orderCount: stats.count,
        favoriteCategory
      }
    })
    // search ny word
    const filteredData = merged.filter(u => 
    !search || u.name.toLowerCase().includes(search.toLowerCase())
    );
    // findig highest spendre
    const highestSpender = merged.sort((a,b)=> b.totalSpent - a.totalSpent);
    // pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const pagination = merged.slice(start, end);
    return {
      total: merged.length,
      page,
      limit,
      data: pagination
    }
  }
  // error handling
  catch (error) {
    console.error("One or more API didn't fetched!")
    return "something failed"
  }
}
getDashboardData({ search: "", page: 1, limit: 3 }).then(console.log);