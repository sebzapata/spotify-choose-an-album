const LogoutButton = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="border-none text-base font-medium bg-transparent text-gray-100 cursor-pointer disabled:cursor-not-allowed"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
