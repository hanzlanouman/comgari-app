import { route } from "@/common";
import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href={route.auth.Welcome} />;
};

export default Home;
