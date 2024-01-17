import { useContext } from "react";
import SessionContext from "./SessionContext";

interface HeaderProps {
  handleLogout: () => void;
}

const Header = (props: HeaderProps) => {
  const { handleLogout } = props;
  const session = useContext(SessionContext);

  return (
    <p>
      logged in as {session.user.email}
      <button onClick={handleLogout}>log out</button>
    </p>
  );
};

export default Header;
