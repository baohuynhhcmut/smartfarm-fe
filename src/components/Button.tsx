import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition"
    >
      {text}
    </button>
  );
};

export default Button;
