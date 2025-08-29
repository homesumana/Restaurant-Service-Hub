
import React, { useState, useEffect, useCallback } from 'react';
import { useQueue } from '../context/QueueContext';
import { MenuItem, RequestType, OrderItem } from '../types';
import { generateMenu } from '../services/geminiService';
import { BillIcon, FoodIcon, ServiceIcon } from '../components/icons/Icons';

interface TableViewProps {
  tableId: number;
}

const TableView: React.FC<TableViewProps> = ({ tableId }) => {
  const { addRequest } = useQueue();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const generatedMenu = await generateMenu();
        setMenu(generatedMenu);
      } catch (err) {
        setError('Failed to load the menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);
  
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };
  
  const handleAddToOrder = (item: MenuItem) => {
    setOrder(prevOrder => {
        const existingItem = prevOrder.find(orderItem => orderItem.item.name === item.name);
        if (existingItem) {
            return prevOrder.map(orderItem => 
                orderItem.item.name === item.name ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
            );
        }
        return [...prevOrder, { item, quantity: 1 }];
    });
  };

  const handleRemoveFromOrder = (itemName: string) => {
      setOrder(prevOrder => {
          const existingItem = prevOrder.find(orderItem => orderItem.item.name === itemName);
          if (existingItem && existingItem.quantity > 1) {
              return prevOrder.map(orderItem => 
                  orderItem.item.name === itemName ? { ...orderItem, quantity: orderItem.quantity - 1 } : orderItem
              );
          }
          return prevOrder.filter(orderItem => orderItem.item.name !== itemName);
      });
  };

  const handleSendOrder = () => {
    if (order.length === 0) return;
    addRequest(tableId, RequestType.Order, { items: order, total: calculateOrderTotal() });
    setOrder([]);
    showNotification('Your order has been sent to the kitchen!');
  };
  
  const handleRequestBill = () => {
    addRequest(tableId, RequestType.Bill);
    showNotification('A staff member will bring your bill shortly.');
  };

  const handleCallStaff = () => {
    addRequest(tableId, RequestType.Service, { message: 'Customer needs assistance' });
    showNotification('A staff member is on their way to assist you.');
  };

  const calculateOrderTotal = useCallback(() => {
    return order.reduce((total, orderItem) => total + orderItem.item.price * orderItem.quantity, 0);
  }, [order]);

  if (loading) {
    return <div className="text-center p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Generating today's specials...</p>
    </div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {notification && (
        <div className="fixed top-20 right-1/2 translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {notification}
        </div>
      )}
      
      {/* Menu Section */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Menu for Table {tableId}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.map((item) => (
            <div key={item.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between transition-shadow hover:shadow-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddToOrder(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-semibold"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Order & Actions Section */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 dark:border-gray-600">Your Order</h2>
            {order.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty. Add items from the menu.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {order.map(({ item, quantity }) => (
                        <div key={item.name} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                                <p className="text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleRemoveFromOrder(item.name)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-lg font-bold flex items-center justify-center">-</button>
                                <span className="font-semibold w-6 text-center">{quantity}</span>
                                <button onClick={() => handleAddToOrder(item)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-lg font-bold flex items-center justify-center">+</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t dark:border-gray-600 mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span>${calculateOrderTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleSendOrder}
                  disabled={order.length === 0}
                  className="w-full mt-4 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <FoodIcon className="w-5 h-5" /> Place Order
                </button>
              </>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-6">
            <h2 className="text-xl font-bold mb-4">Other Services</h2>
            <div className="flex flex-col space-y-3">
              <button onClick={handleRequestBill} className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 transition-colors font-semibold flex items-center justify-center gap-2">
                <BillIcon className="w-5 h-5" /> Request Bill
              </button>
              <button onClick={handleCallStaff} className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2">
                <ServiceIcon className="w-5 h-5" /> Call Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableView;
