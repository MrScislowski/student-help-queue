import { attemptLogin, setToken } from "../requests";
import { GoogleLogin } from "@react-oauth/google";

const LoginButton = (props) => {
  const { setUser } = props;

  return (
    <GoogleLogin
      onSuccess={(response) => {
        const { credential } = response;
        attemptLogin({ credential }).then((response) => {
          setUser(response);
          window.localStorage.setItem(
            "studentHelpQueueUser",
            JSON.stringify(response)
          );
        });
      }}
      onError={(error) => console.log(`Login error: ${error}`)}
    />
  );
};

export default LoginButton;
