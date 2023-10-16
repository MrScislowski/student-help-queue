import { attemptLogin, setToken } from "../requests";
import { GoogleLogin } from "@react-oauth/google";
import { User } from "../types";

interface LoginButtonProps {
  setUser: (user: User|null) => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { setUser } = props;

  return (
    <GoogleLogin
      onSuccess={(response) => {
        if (!response.credential) {
          throw new Error("credential not returned")
        }
        const credential: string = response.credential;
        attemptLogin(credential).then((response) => {
          setUser(response);
          window.localStorage.setItem(
            "studentHelpQueueUser",
            JSON.stringify(response)
          );
        });
      }}
      onError={() => {
        console.log(`Login error`)
      }}
    />
  );
};

export default LoginButton;
