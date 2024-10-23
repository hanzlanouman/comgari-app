import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href="/(auth)/sign-in" />;
};

export default Home;
