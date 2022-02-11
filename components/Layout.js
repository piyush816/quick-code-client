import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <ThemeProvider attribute="class">
      <Navbar />

      <main className="lg:px-20 z-0 dark:bg-secondary  text-gray-800  dark:text-white px-5 py-5 min-h-screen">
        {children}
      </main>

      <ToastContainer theme="colored" />
    </ThemeProvider>
  );
}

export default Layout;
