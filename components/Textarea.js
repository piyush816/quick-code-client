function Textarea({ placeholder, name, errorMessage, register }) {
  return (
    <div className="mb-5">
      <textarea
        {...register(name)}
        placeholder={placeholder}
        rows="5"
        className="w-full px-5 py-3 dark:bg-gray-900 dark:placeholder-gray-400 rounded-md outline-none border-2 focus:border-primary "
      ></textarea>
      <small className="text-red-400 font-bold dark:font-normal capitalize">
        {errorMessage}
      </small>
    </div>
  );
}

export default Textarea;
