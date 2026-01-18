import background from "../../assets/images/main-bg.png";
import {Link} from 'react-router-dom';
export default function Error404Page() {
    return (
            <main  className="bg-gray-700 min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-blend-overlay"
                        style={{
                        backgroundImage: `url(${background})`,}}>    
                {/*centered division for button and title screen*/}
            <div className="text-center">
                {/*title*/}
                <h1 className="text-white/95 text-[7rem] tracking-wide text-balance font-raider flex items-center gap-0.5">
                <span className="text-r">ERROR</span><span> 404</span>
                </h1>

                {/*sub-title*/}
                <p className="text-white/80 text-[1.2rem] font-arame tracking-wider ">
                This page does not exist.
                </p>

                {/*stylised button*/}
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to="/" className="text-[1.8rem] text-white/80 font-arame
                    px-6 py-2.5 bg-b1/60
                    ring-2 ring-white/25 duration-500
                    justify-center items-center flex
                    hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r">
                    Return to Home Page 
                    </Link>
                </div>

            </div>
            </main>    
            );
        }