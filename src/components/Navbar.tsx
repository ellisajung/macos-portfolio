import dayjs from "dayjs";
import { navIcons, navLinks } from "#constants";

const Navbar = () => {
  return (
    <nav>
      {/* navbar left side */}
      <div>
        <img src="/images/apple-logo.svg" alt="apple-logo" />
        <p className="font-bold">Ellisa's portfolio</p>
        <ul>
          {navLinks.map(({ id, name }) => (
            <li key={id}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* navbar right side */}
      <div>
        <ul>
          {navIcons.map(({ id, imgSrc }) => (
            <li key={id}>
              <img src={imgSrc} alt={`icon-${id}`} />
            </li>
          ))}
        </ul>
        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};
export default Navbar;
