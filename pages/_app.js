import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Layout from "../components/Layout";
import "react-toastify/dist/ReactToastify.css";
import "highlight.js/styles/night-owl.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
