
import { useEffect } from "react";
import Home from "./Pages/Home";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUser } from "./store/createSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      const {data} =await getCurrentUser();
      // console.log(data)

      if (data) {
        dispatch(setUser(data)); // response ke structure ke hisaab se
      }else {
        console.log("data not recieve")
      }
    };

    getUser();
  }, [dispatch]);

  return <Home />;
};

export default App;

