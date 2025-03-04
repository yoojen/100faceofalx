import { NavLink } from "react-router-dom";
import { navLinks, personalInfo } from "../Utils";

const appNav = (
  <div>
    <img src="/assets/logo_.png" alt="" height={50} width={50} />
    <span className="capitalize">Stock yanjye</span>
  </div>
);

const footerList = (
  <ul>
    {navLinks.map((link, i) => {
      return (
        <li className="hover:text-blue-500" key={i}>
          <NavLink to={link.rel}>{link.text}</NavLink>
        </li>
      );
    })}
  </ul>
);

const copyRight = (
  <small className="space-x-6 italic">
    <span>
      &copy; {personalInfo.firstName} {personalInfo.lastName}
    </span>
    <span>-</span>
    <span>{personalInfo.email}</span>
  </small>
);

const contacts = (
  <ul>
    <li>
      {personalInfo.firstName}
      {personalInfo.lastName}
    </li>
    <li>{personalInfo.email}</li>
    <li>
      {personalInfo.continent}.{personalInfo.country}
    </li>
  </ul>
);
export const ToLoginOnly = () => {
  return <div>{copyRight}</div>;
};

export default function Footer() {
  return (
    <div className="flex justify-between px-5 bg-white p-3 italic">
      <div>{appNav}</div>
      <div>{footerList}</div>
      <div>{contacts}</div>
    </div>
  );
}
