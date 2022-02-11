function Heading({ title, subTitle }) {
  return (
    <div className="heading my-2 mb-10 flex items-center ">
      <h3 className="text-xl capitalize font-display">
        {subTitle} <span className="text-primary uppercase">{title}</span>
      </h3>
    </div>
  );
}

export default Heading;
