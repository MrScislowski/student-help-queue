import { Session, User } from "../types";

interface HeaderProps {
  session: Session;
  handleLogout: () => void;
}

const Header = (props: HeaderProps) => {
  const { session, handleLogout } = props;

  return (
    <p>
      logged in as {session.user.email}
      <button onClick={handleLogout}>log out</button>
    </p>
  );
};

export default Header;
