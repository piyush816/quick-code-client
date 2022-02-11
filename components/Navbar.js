import Link from "next/link";

import { MdLogout, MdDarkMode, MdLightMode } from "react-icons/md";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import JsCookie from "js-cookie";
import { useTheme } from "next-themes";

function Navbar({}) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies.token;

  return (
    <nav
      className="lg:px-20 px-5 py-5 flex items-center justify-between 
        dark:bg-secondary dark:text-white"
    >
      <Link href="/">
        <h3 className="font-display cursor-pointer text-gray-800 dark:text-white text-2xl">
          <span className="text-primary">Q</span>Code
        </h3>
      </Link>
      <div className="flex items-center">
        {theme === "light" ? (
          <MdDarkMode
            className="cursor-pointer"
            onClick={() => setTheme("dark")}
            size="25"
          />
        ) : (
          <MdLightMode
            className="cursor-pointer"
            onClick={() => setTheme("light")}
            size="25"
          />
        )}

        {token && (
          <MdLogout
            size="25"
            onClick={() => {
              JsCookie.remove("token");
              router.replace("/");
            }}
            className="cursor-pointer ml-5 hover:text-primary"
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
