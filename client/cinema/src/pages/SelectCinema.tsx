import { useEffect, useState } from "react";
import type { CinemaItem , FetchState} from "../types";
import { getCinemas } from "../api/Cinema";
import { CinemaSearchBar } from "../Components/CinemaSearchBar";

export function SelectCinema() {
    const [items, setItems] = useState<CinemaItem[]>([]);
    const [fState, setFState] = useState<FetchState>("idle");

    // getting Cinemas from API
    useEffect(() => {

        let active = true;
        setFState("loading");
        
        getCinemas().then((data) =>{
            if(!active) return;
            setItems(data);
            setFState("loaded");
        }).catch(() => {
            if(active) setFState("failed");
        })


        return () => {
            active = false;
        }
            
        
    }, [])


    return (
        <section className="Cinema-Selection">
            <h2 className="Cinema-Selection-Title"> Select you Cinema</h2>
            {fState !== "loaded" ? <p>Loading...</p> : <CinemaSearchBar cinemas={items }/>}
            

        </section>
    )
}