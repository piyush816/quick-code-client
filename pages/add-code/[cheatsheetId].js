import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Input from "../../components/Input";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Textarea from "../../components/Textarea";

// form schema
const schema = yup
  .object()
  .shape({
    title: yup.string().required("Title is required").max(45),
    body: yup.string().required("Code is required"),
  })
  .required();

function addCheatsheet({ cheatsheet }) {
  const router = useRouter();

  // react hook from
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // form submit
  const onSubmit = async (formData) => {
    // gettng cookies
    const cookies = parseCookies();

    // adding code in cheatsheet
    const res = await fetch(
      `http://localhost:8000/api/cheatsheet/${cheatsheet._id}/codes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(formData),
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

    // successfully added
    if (res.status === 201) {
      toast(`Code Added in Cheatsheet Successfully`, {
        position: "top-center",
        type: "success",
      });

      router.push(`/cheatsheet/${cheatsheet._id}`);
    }
  };

  return (
    <section>
      <Heading title={cheatsheet.name} subTitle="add code in" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container lg:w-1/2 w-11/12 mx-auto "
      >
        <Input
          errorMessage={errors.title?.message}
          register={register}
          name="title"
          type="text"
          placeholder="Title"
        />

        <Textarea
          name="body"
          register={register}
          placeholder="Code"
          errorMessage={errors.body?.message}
        />

        <Button text="Submit" wFull={true} type="primary" />
      </form>
    </section>
  );
}

export default addCheatsheet;

export const getServerSideProps = async (context) => {
  // getting cookies
  const cookies = parseCookies(context);

  const token = cookies.token;

  let cheatsheet = {};

  const { cheatsheetId } = context.query;

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  // getting cheatsheet
  const response = await fetch(
    `http://localhost:8000/api/cheatsheet/${cheatsheetId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // if get the cheatsheet
  if (response.status === 200) {
    cheatsheet = await response.json();
  }
  // cheatsheet not found
  else if (response.status === 400) {
    return {
      notFound: true,
    };
  }

  // unauthorized
  else if (response.status === 401 || response.status === 403) {
    destroyCookie(context, "token");
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: { cheatsheet },
  };
};
