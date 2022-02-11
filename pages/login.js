import Input from "../components/Input";
import Button from "../components/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import router from "next/router";
import { setCookie } from "nookies";

// form schema
const schema = yup
  .object()
  .shape({
    email: yup.string().required("Email is required").email("Invalid Email Id"),
    password: yup.string().required("Password is required"),
  })
  .required();

function Login() {
  // react hook from
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // on form submit
  async function onSubmit(formData) {
    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    if (res.status === 200) {
      toast(`Welcome back ${data.name}`, {
        position: "top-center",
        type: "success",
      });
      setCookie(null, "token", data.token, { maxAge: 30 * 24 * 60 * 60 });
      router.replace("/");
    }
  }

  return (
    <div className="lg:w-4/12 w-11/12 mx-auto my-5">
      <h3 className="font-display capitalize text-3xl text-center mb-10">
        Welcome Back
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          errorMessage={errors.email?.message}
          name="email"
          type="email"
          register={register}
          placeholder="Email"
        />
        <Input
          register={register}
          type="password"
          errorMessage={errors.password?.message}
          name="password"
          placeholder="Password"
        />

        <p className="text-primary  text-sm hover:underline  mb-8">
          Forget Password
        </p>

        <div className="mb-5">
          <Button text="Login" type="primary" wFull={true} />
        </div>

        <p className="text-sm">
          I dont have an account{" "}
          <Link href="/register">
            <a className="text-primary hover:underline">Register</a>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
