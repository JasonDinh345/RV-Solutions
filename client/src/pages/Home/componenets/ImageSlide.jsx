import useGet from "../../../hooks/useGet"
import { useState, useEffect,useRef } from "react";

export default function ImageSlide(){
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    const {data: images, isLoading} = useGet("http://localhost:1231/image")
    const goNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
    resetTimer();
  };

    
    const goPrev = () => {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
        resetTimer();
    };

    const resetTimer = () => {
        if(images){
            if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 8000);
        }
    };

    useEffect(() => {
        if(images){
            resetTimer();
        }

        return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);
    return(
        images && !isLoading && (
            <div id="imageSlideShow" className="flexCenter">
                <div className="overlay">
                    <h2 onClick={goPrev}> &lt; </h2>
                    <h2 onClick={goNext}> &gt; </h2>
                </div>
                <img className="sideImage"
                    src={images[(index - 1 + images.length) % images.length].ImageURL}
                    alt="Slideshow"
                    key={index - 1}
                    />
                <img  className="mainImage"
                    src={images[index].ImageURL}
                    alt="Slideshow"  
                    key={index} 
                />
                
                <img className="sideImage"
                src={images[(index + 1) % images.length].ImageURL}
                alt="Slideshow"
                key={index + 1}
                />
                    
            </div>
        )
    )
}