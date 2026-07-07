import { cn } from '../lib/utils';

interface Order {
  id: string;
  customer: string;
  date: string;
  status: string;
  revenue: number;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-sm">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Revenue</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="text-slate-900 dark:text-slate-200">
                <td className="py-4 font-medium">{order.id}</td>
                <td className="py-4 text-slate-500">{order.customer}</td>
                <td className="py-4 text-slate-500">{order.date}</td>
                <td className="py-4">₹{(order.revenue / 100000).toFixed(1)}L</td>
                <td className="py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium",
                    order.status === 'Completed' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
