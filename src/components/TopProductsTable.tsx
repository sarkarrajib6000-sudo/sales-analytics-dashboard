export function TopProductsTable({ orders }: { orders: any[] }) {
  // Sort and take top 10
  const topProducts = [...orders]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top 10 Products by Revenue</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
            <th className="pb-3">Product ID</th>
            <th className="pb-3 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {topProducts.map((order) => (
            <tr key={order.id} className="text-slate-900 dark:text-slate-200">
              <td className="py-4 font-medium">{order.id}</td>
              <td className="py-4 text-right">${order.revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
