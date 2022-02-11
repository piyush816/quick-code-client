function Input({ type, placeholder, name, errorMessage, register }) {
  if (register) {
    return (
      <div className="mb-5">
        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className="w-full px-5 py-3 dark:bg-gray-900 dark:placeholder-gray-400 rounded-md outline-none border-2 border-gray-200 focus:border-primary "
        />
        <small className="text-red-400 capitalize font-bold dark:font-normal">
          {errorMessage}
        </small>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <input
        type={type}
        placeholder={placeholder}
        name="name"
        className="w-full px-5 py-3 rounded-md outline-none border-2 border-gray-200 focus:border-primary "
      />
    </div>
  );
}

export default Input;
