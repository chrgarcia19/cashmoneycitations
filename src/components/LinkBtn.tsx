import Link from "next/link";
import React from "react";

type Props = {
  linkData: string,
  text: string,
};

const LinkBtn = (props: Props) => {
  return (
    <Link href={props.linkData}  className="linkBtn inline-block bg-gradient-to-r from-sky-400 to-sky-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200">
      {props.text}
    </Link>
  );
};

export default LinkBtn;