import background from "../../assets/images/main-bg.png";
import {LiaCanadianMapleLeaf} from "react-icons/lia";
import {Link} from 'react-router-dom';
import { TbMapQuestion } from "react-icons/tb"
import { PiShieldCheckeredFill } from "react-icons/pi";
export default function LandingPage() {
    return (
        <main  className="bg-gray-700 min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-blend-overlay"
                    style={{
                    backgroundImage: `url(${background})`,}}>

            <div className="absolute right-4 top-4 z-50">
                <Link to="help"className=" text-[2rem] text-white/80 font-arame 
                px-2.5 py-2.5 bg-b1/60
                ring-2 ring-white/25 
                duration-500
                justify-center flex items-center
                hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r">
                    <TbMapQuestion />
                </Link>
            
            </div>
            {/* WRITE THE CSS DIRECTLY IN the 'className' attribute, look up the equivalent CSS style on TailwindCSS' site if needed */}
            <div className="text-center">

                <h1 className="text-white/95 text-[7rem] tracking-wide text-balance font-raider flex items-center gap-0.5">
                <span className="text-r">CAN</span><LiaCanadianMapleLeaf color={"#fb2c36"}/><span className="text-[7rem]">SHIELD</span>
                </h1>

                <p className="text-white/80 text-[1.2rem] font-arame tracking-wider ">
                Real-time Canadian arctic strategy simulator
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">

                    <Link to="/map"className="text-[1.8rem] text-white/80 font-arame
                    px-6 py-2.5 bg-b1/60
                    ring-2 ring-white/25 duration-500
                    justify-center items-center flex
                    hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r">
                    <PiShieldCheckeredFill className="mr-3"/>Defend 
                    </Link>
                    
                </div>
            </div>


            
        </main>
    );
}