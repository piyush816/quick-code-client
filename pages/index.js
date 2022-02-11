import Button from "../components/Button";
import Link from "next/link";
import { parseCookies, destroyCookie } from "nookies";

function index() {
  return (
    <section>
      <h1 className="lg:text-7xl md:text-5xl text-4xl mt-20 mb-5 text-center font-display">
        <span className="text-primary">DEV.... DON’T BE FRUSTRATE AND</span>{" "}
        WASTE YOUR TIME
      </h1>

      <p className="lg:text-2xl md:text-xl text-lg md:mx-40 sm:mx-16 mb-5  text-center  font-bold">
        Because now you can easily save your time and no need to remember
        difficult syntax.
      </p>

      <div className="grid sm:grid-cols-2 lg:w-80 md:w-96 sm:w-4/6 mx-auto grid-cols-1 gap-5">
        <Link href="/register">
          <Button type="primary" text="register" />
        </Link>
        <Link href="/login">
          <Button type="secondary" text="login" />
        </Link>
      </div>
    </section>
  );
}

export default index;

export const getServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (token) {
    const response = await fetch("http://localhost:8000/api/cheatsheet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return {
        redirect: {
          permanent: false,
          destination: "/cheatsheet",
        },
      };
    } else if (response.status === 401 || response.status === 403) {
      destroyCookie(context, "token");
    }
  }
  return {
    props: {},
  };
};
