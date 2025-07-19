import React from "react";

const transactions = [
  {
    name: "Zomato",
    time: "Today, 2:34 PM",
    amount: "-₹450",
    bubble: "Food Bubble",
    color: "text-pink-400",
  },
  {
    name: "Uber",
    time: "Today, 11:20 AM",
    amount: "-₹320",
    bubble: "Travel Bubble",
    color: "text-blue-400",
  },
  {
    name: "H&M",
    time: "Yesterday, 5:45 PM",
    amount: "-₹1,200",
    bubble: "Fashion Bubble",
    color: "text-purple-400",
  },
];

export default function RecentTransactions() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl mb-24 shadow-inner">
      <h3 className="text-white font-semibold mb-4">Recent Transactions</h3>
      {transactions.map((txn, index) => (
        <div
          key={index}
          className="flex justify-between items-center border-b border-gray-800 py-3"
        >
          <div>
            <p className="font-medium">{txn.name}</p>
            <p className="text-xs text-gray-400">{txn.time}</p>
          </div>
          <div className="text-right">
            <p className={`${txn.color} font-semibold`}>{txn.amount}</p>
            <p className="text-xs text-gray-400">{txn.bubble}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
