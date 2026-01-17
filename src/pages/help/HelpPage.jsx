import background from "../../assets/images/main-bg.png";
import {LiaCanadianMapleLeaf} from "react-icons/lia";
import {Link} from 'react-router-dom';
export default function HelpPage() {
    return (
        <main  className="bg-gray-700 min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-blend-overlay"
                    style={{
                    backgroundImage: `url(${background})`,}}>

            {/* WRITE THE CSS DIRECTLY IN the 'className' attribute, look up the equivalent CSS style on TailwindCSS' site if needed */}
            <div className="bg-black/40 h-175 w-250">

                <div className="px-10 py-5">

                    <h1 className="text-white/95 text-[3rem] tracking-wide text-balance font-raider flex items-center justify-center gap-0.5">
                    <span className="text-r">CAN</span><LiaCanadianMapleLeaf color={"#fb2c36"}/>SHIELD
                    </h1>

                    <h2 className="text-white/80 font-arame text-[1.1rem] tracking-wider font-bold my-1">
                    How to Play ?
                    </h2>

                    <p className="text-white/80 font-arame text-[0.9rem] tracking-wider leading-8">
                    CANShield simulates real-time strategy (RTS) of the Canadian Artic Regions' naval passageways. 
                    Control your expenses and manage the deployment of 3 different classes of Canadian naval ships. 
                    Precise timing in deployments as well as choice of naval ship classes are key to keeping consistent coverage and reducing costs.
                    </p>

                    <div className="flex items-center  justify-center py-2">
                        <div className="mx-5">
                        <div className="w-60 h-60 bg-[url('./assets/images/icon-halifax.jpg')] bg-cover border-2 border-r"/>
                        <p className="text-white/80 font-arame text-[0.8rem] tracking-wider leading-7 mt-1.5">
                        Halifax Frigate<br/>
                        Cost: $450,000<br/>
                        Speed: 30 Knots<br/>
                        Range: 9,500 N-Miles<br/>
                        </p>
                        </div>

                        <div className="mx-10 my-2">
                        <div className="w-60 h-60 bg-[url('./assets/images/icon-dewolf.jpg')] bg-cover border-2 border-r"/>
                        <p className="text-white/80 font-arame text-[0.8rem] tracking-wider leading-7 mt-1.5">
                        Harry DeWolf Patrol Vessel<br/>
                        Cost: $250,000<br/>
                        Speed: 17 Knots<br/>
                        Range: 6,800 N-Miles<br/>
                        </p>
                        </div>

                        <div className="mx-5">
                        <div className="w-60 h-60 bg-[url('./assets/images/icon-kingston.jpg')] bg-cover border-2 border-r"/>
                        <p className="text-white/80 font-arame text-[0.8rem] tracking-wider leading-7 mt-1.5">
                        Kingston Coastal Defence Vessel<br/>
                        Cost: $150,000<br/>
                        Speed: 15 Knots<br/>
                        Range: 5,000 N-Miles<br/>
                        </p>
                        </div>
                    
                    </div>

                    <p className="text-r font-arame text-[0.8rem] tracking-wider text-center leading-8">
                    *Ship statistics are for simulation purposes only. Data may not be accurate.
                    </p>

                </div>

            </div>
            <div className="mt-5 flex items-center justify-center gap-x-6">
                        <Link to="/"className="text-[1.2rem] text-white/80 font-arame
                        px-6 py-2.5 bg-b1/60
                        ring-2 ring-white/25 
                        hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r">
                        Ready
                        </Link>           
                    </div>

            
        </main>
    );
}