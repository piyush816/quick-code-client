function Button({ onClick, type, wFull, text }) {
  const classes = {
    primary: `px-8 py-2 hover:shadow-md font-bold  capitalize text-white
        rounded-md border-2 
      border-primary bg-primary`,
    secondary: `px-8 py-2 hover:shadow-md font-bold rounded-md border-2 border-primary`,
  };

  if (wFull === true) {
    classes.primary += " w-full";
    classes.secondary += " w-full";
  }

  return (
    <button
      type="submit"
      onClick={onClick}
      className={type === "primary" ? classes.primary : classes.secondary}
    >
      {text}
    </button>
  );
}

export default Button;
