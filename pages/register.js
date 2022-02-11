import Input from "../components/Input";
import Button from "../components/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCookie } from "nookies";

// form schema
const schema = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Name must be atleast 3 charaters"),
    email: yup.string().required("Email is required").email("Invalid Email Id"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "password must be atleast 6 characters"),
    cPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

function Register() {
  const router = useRouter();

  // react hook from
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // on form submit
  const onSubmit = async (formData) => {
    const res = await fetch("http://localhost:8000/api/auth/register", {
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

    if (res.status === 201) {
      toast("Your account has been Successfully created", {
        position: "top-center",
        type: "success",
      });
      setCookie(null, "token", data.token, { maxAge: 30 * 24 * 60 * 60 });
      router.replace("/");
    }
  };

  return (
    <div className="lg:w-4/12 w-11/12 mx-auto my-5">
      <h3 className="font-display capitalize text-3xl text-center mb-10">
        Create your account
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          register={register}
          type="text"
          errorMessage={errors.name?.message}
          placeholder="Name"
          name="name"
        />
        <Input
          register={register}
          type="email"
          name="email"
          placeholder="Email"
          errorMessage={errors.email?.message}
        />
        <Input
          register={register}
          type="password"
          name="password"
          placeholder="Password"
          errorMessage={errors.password?.message}
        />
        <Input
          register={register}
          type="password"
          name="cPassword"
          placeholder="Confirm Password"
          errorMessage={errors.cPassword?.message}
        />

        <div className="mb-5">
          <Button text="Register" type="primary" wFull={true} />
        </div>

        <p className="text-sm">
          I already have an account{" "}
          <Link href="/login">
            <a className="text-primary hover:underline">Login</a>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
