const Header = (props) => {
  const { user, handleLogout } = props;

  return (
    <p>
      logged in as {user.email}
      <button onClick={handleLogout}>log out</button>
    </p>
  );
};

export default Header;
