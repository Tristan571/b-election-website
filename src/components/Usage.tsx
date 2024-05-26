import React from "react";
 // Adjust the path to where your image is located

export default function Usage() {
  const colors = [
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-pink-200"
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto flex flex-row">
        <div className="w-1/2 flex justify-center items-center">
          <img src="https://images.pexels.com/photos/335393/pexels-photo-335393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Guide" className="w-full h-full object-cover" />
        </div>
        <div className="w-1/2">
          <h1 className="text-center text-3xl font-bold mb-6">Don't know where to start?</h1>
          <h1 className="text-center text-2xl font-bold mb-6 text-slate-600">See the user guide below</h1>
          <ul
            aria-label="Activity feed"
            role="feed"
            className="relative flex flex-col gap-12 py-12 pl-8 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200"
          >
            {[
              "Create Metamask Wallet",
              "Connect via Metamask",
              "Choose available Election",
              "Vote for your favorite candidate",
              "Wait for the result",
              "You're done! Try now",
            ].map((text, index) => (
              <li role="article" className="relative pl-8" key={index}>
                <span className={`absolute left-0 z-10 flex items-center justify-center w-10 h-10 -translate-x-1/2 rounded-full text-slate-700 ring-2 ring-white ${colors[index % colors.length]}`}>
                  {index + 1}
                </span>
                <div className="flex flex-col flex-1 gap-0">
                  <h4 className="text-xl font-medium text-slate-700">
                    {text}
                  </h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
