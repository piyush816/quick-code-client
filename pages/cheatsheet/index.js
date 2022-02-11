import Heading from "../../components/Heading";
import Link from "next/link";
import { parseCookies, destroyCookie } from "nookies";
import { MdAddBox } from "react-icons/md";

function cheatsheet({ cheatsheets }) {
  return (
    <section className="relative">
      <Link href="/create-cheatsheet">
        <MdAddBox
          style={{ top: "-10px" }}
          size="38"
          className="text-primary  cursor-pointer absolute z-0 right-0"
        />
      </Link>

      <Heading title="Cheat sheats" subTitle="Your" />

      {cheatsheets.length <= 0 ? (
        <h1 className="text-center lg:text-4xl text-2xl w-full p-5 mt-20 text-gray-50">
          You don't have any cheatsheet create on to see
        </h1>
      ) : (
        <div className="grid 2xl:grid-cols-5 md:grid-cols-2 sm:grid-rows-2 lg:grid-cols-4 grid-cols-1 lg:gap-10 gap-10 mx-auto container my-14">
          {cheatsheets.map((cheatsheet) => {
            return (
              <Link key={cheatsheet._id} href={`cheatsheet/${cheatsheet._id}`}>
                <div className="relative dark:bg-card  shadow-lg  p-10 h-60 w-full cursor-pointer grid place-items-center rounded-xl">
                  <h3 className="uppercase text-center font-display text-3xl ">
                    {cheatsheet.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default cheatsheet;

export const getServerSideProps = async (context) => {
  let data = [];

  // getting cookies
  const cookies = parseCookies(context);
  const token = cookies.token;

  // if token is not available
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  // making request
  const response = await fetch("http://localhost:8000/api/cheatsheet", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // invalid token
  if (response.status === 401 || response.status === 403) {
    destroyCookie(context, "token");
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (response.status === 200) {
    data = await response.json();
  }

  return {
    props: {
      cheatsheets: data,
    },
  };
};
