import { useQuery } from "react-query";
import axios from "axios";

const App = () => {
  const result = useQuery("activeEntries", () =>
    axios.get("http://localhost:3001/api/queue").then((res) => res.data)
  );

  console.log(result);

  return <p> hello </p>;
};

export default App;
