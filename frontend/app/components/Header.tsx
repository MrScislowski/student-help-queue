import { User } from "../types";

interface HeaderProps {
  user: User;
  handleLogout: () => void;
}

const Header = (props: HeaderProps) => {
  const { user, handleLogout } = props;

  return (
    <p>
      logged in as {user.email}
      <button onClick={handleLogout}>log out</button>
    </p>
  );
};

export default Header;
