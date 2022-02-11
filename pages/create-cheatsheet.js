import Button from "../components/Button";
import Heading from "../components/Heading";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { parseCookies, destroyCookie } from "nookies";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import router from "next/router";

// form schema
const schema = yup
  .object()
  .shape({
    name: yup.string().required("Cheatsheet Name is required").max(20),
    description: yup
      .string()
      .required("Cheatsheet Description is required")
      .max(150),
  })
  .required();

function createCheatsheet() {
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
    // getting cookies
    const cookies = parseCookies();

    // creating cheatsheet
    const res = await fetch("http://localhost:8000/api/cheatsheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    // cheking for errors
    if (res.status === 400) {
      toast(data.error, {
        position: "top-center",
        type: "error",
      });

      return;
    }

    // created succesfully
    if (res.status === 201) {
      toast(`Cheatsheet Created Successfully`, {
        position: "top-center",
        type: "success",
      });

      router.replace("/cheatsheet");
    }
  };

  return (
    <section>
      <Heading title="Cheat sheat" subTitle="create new" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container lg:w-1/2 w-11/12 mx-auto "
      >
        <Input
          errorMessage={errors.name?.message}
          register={register}
          name="name"
          type="text"
          placeholder="Name"
        />
        <Textarea
          name="description"
          register={register}
          placeholder="Description"
          errorMessage={errors.description?.message}
        />
        <Button text="Submit" wFull={true} type="primary" />
      </form>
    </section>
  );
}

export default createCheatsheet;

export const getServerSideProps = async (context) => {
  // cookies
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  const response = await fetch(`http://localhost:8000/api/cheatsheet}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    destroyCookie(context, "token");
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
};
