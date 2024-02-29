import LinkBtn from "@/components/LinkBtn";
import Image from 'next/image';
import cmcLogo from '../../public/cashmoneycitations_logo.png';
import Link from "next/link";

export default function HomePage() {
  return(
    <>
      <div className="w-full h-screen bg-zinc-700">
        <div className='h-screen flex items-center justify-center pb-20'>
        <div className="card w-96 bg-slate-200 shadow-xl">
            <figure className="px-10 pt-10">
              <Image src={cmcLogo} alt="Cash Money Citations Logo" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Welcome to Cash Money Citations!</h2>
              <div className="card-actions">
                <p>A citation generation website created by: Christian Garcia, Harris Gustafson, Thomas Hohnholt, & Hamza Faisal</p>
              </div>
            </div>
          </div>
          <div className="card w-96 bg-slate-200 shadow-xl">
            <figure className="px-10 pt-10">
              <img src="https://avatars.githubusercontent.com/u/93625102?v=4" alt="GitHub Icon" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Cash Money Citations GitHub Repository</h2>
              <div className="card-actions">
                <LinkBtn linkData="https://github.com/chrgarcia19/cashmoneycitations" text="To GitHub" />
              </div>
            </div>
          </div>
          <div className="card w-96 bg-slate-200 shadow-xl">
          <figure className="px-10 pt-10">
            <img src="https://github.blog/wp-content/uploads/2020/07/87728232-766b4a80-c777-11ea-8f81-1d468fc360ab.png?fit=1200%2C630" alt="GitHub Icon" className="rounded-xl"/>
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Cash Money Citations Project Roadmap</h2>
            <div className="card-actions">
              <button className="linkBtn inline-block bg-gradient-to-r from-orange-400 to-orange-700 py-3 px-6 rounded-full font-bold text-white tracking-wide shadow-xs hover:shadow-2xl active:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition duration-200">
                <span><Link href="https://github.com/users/chrgarcia19/projects/2">To Roadmap</Link></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}