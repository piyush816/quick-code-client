import Card from "../../components/Card";
import Heading from "../../components/Heading";
import { parseCookies, destroyCookie } from "nookies";
import { MdAddBox, MdDelete } from "react-icons/md";
import router from "next/router";
import { toast } from "react-toastify";

function cheatsheetById({ cheatsheet }) {
  const deleteCheatsheet = async () => {
    if (!confirm("Do you really want to delete?")) return;

    // getting cookies
    const cookies = parseCookies();

    // creating cheatsheet
    const res = await fetch(
      `http://localhost:8000/api/cheatsheet/${cheatsheet._id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      }
    );

    const data = await res.json();

    // cheking for errors
    if (res.status === 400) {
      toast(data.error, {
        position: "top-center",
        type: "error",
      });

      return;
    }

    // deleted succesfully
    if (res.status === 200) {
      toast(`Cheatsheet Deleted Successfully`, {
        position: "top-center",
        type: "success",
      });
    }

    router.push("/cheatsheet");
  };

  return (
    <section className="relative">
      <MdAddBox
        style={{ top: "-10px" }}
        size="38"
        onClick={() => {
          router.push(`/add-code/${cheatsheet._id}`);
        }}
        className="text-primary cursor-pointer absolute z-0 right-14"
      />
      <MdDelete
        onClick={deleteCheatsheet}
        style={{ top: "-10px" }}
        size="38"
        className="text-red-500  cursor-pointer absolute z-0 right-0"
      />
      <Heading subTitle="collection of" title={cheatsheet.name} />
      {
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
          {cheatsheet.codes.map((code) => {
            return (
              <Card
                codeId={code._id}
                cheatsheetId={cheatsheet._id}
                key={code._id}
                title={code.title}
                code={code.body}
              />
            );
          })}
        </div>
      }
    </section>
  );
}

export default cheatsheetById;

export const getServerSideProps = async (context) => {
  let data = {};

  // getting cookies
  const cookies = parseCookies(context);
  let token = cookies.token;

  // if token is not available
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  const { id } = context.query;

  // making request
  const res = await fetch(`http://localhost:8000/api/cheatsheet/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // unauthorized
  if (res.status === 401 || res.status === 403) {
    destroyCookie(context, "token");
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  // notFound
  else if (res.status === 400) {
    return {
      notFound: true,
    };
  }
  // success
  else if (res.status === 200) {
    data = await res.json();
  }

  return {
    props: {
      cheatsheet: data,
    },
  };
};
