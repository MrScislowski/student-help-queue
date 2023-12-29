import { attemptLogin } from "../requests/requests";
import { GoogleLogin } from "@react-oauth/google";
import { Session, User } from "../types";
import config from "../config";

interface LoginButtonProps {
  setSession: (session: Session | null) => void;
}

const LoginButton = (props: LoginButtonProps) => {
  const { setSession } = props;

  return (
    <GoogleLogin
      onSuccess={(response) => {
        if (!response.credential) {
          throw new Error("credential not returned");
        }
        const credential: string = response.credential;
        attemptLogin(credential).then((response) => {
          setSession(response);
          window.localStorage.setItem(
            config.cookieName,
            JSON.stringify(response)
          );
        });
      }}
      onError={() => {
        console.log(`Login error`);
      }}
    />
  );
};

export default LoginButton;
