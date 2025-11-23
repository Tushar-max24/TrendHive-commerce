import React from "react";

const steps = ["Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const OrderStatusTracker = ({ status }) => {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex justify-between items-center my-4">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
            ${
              index < currentIndex
                ? "bg-green-500 text-white"
                : index === currentIndex
                ? "bg-blue-600 text-white"
                : "bg-gray-300"
            }
          `}
          >
            {index < currentIndex ? "✔" : index + 1}
          </div>

          <p className="text-xs mt-1">{step}</p>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-14 ${
                index < currentIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTracker;
